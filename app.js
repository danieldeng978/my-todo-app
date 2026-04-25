// public/app.js - Todo App with User Authentication
// 完整用户登录系统：注册、登录、登出

const DATABASE_URL = 'https://first-ad067-default-rtdb.asia-southeast1.firebasedatabase.app';

// 用户状态
let currentUser = null;
let authToken = localStorage.getItem('todo_auth_token');
let userEmail = localStorage.getItem('todo_user_email');

// DOM 元素
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const totalCount = document.getElementById('totalCount');
const completedCount = document.getElementById('completedCount');
const pendingCount = document.getElementById('pendingCount');
const messageEl = document.getElementById('message');
const header = document.querySelector('header');

// ==================== 简单的密码哈希 ====================

function hashPassword(password) {
  // 简单的哈希（用于演示，生产环境用bcrypt）
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 'hash_' + Math.abs(hash).toString(36);
}

// ==================== 用户系统 ====================

// 生成用户ID
function generateUserId() {
  return 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// 注册
async function register(email, password) {
  try {
    // 检查是否已存在
    const checkResponse = await fetch(`${DATABASE_URL}/users.json`);
    const usersData = await checkResponse.json();
    
    if (usersData) {
      const existingUser = Object.values(usersData).find(u => u.email === email);
      if (existingUser) {
        throw new Error('该邮箱已注册');
      }
    }
    
    // 创建新用户
    const userId = generateUserId();
    const userData = {
      email,
      passwordHash: hashPassword(password),
      created: new Date().toISOString()
    };
    
    const response = await fetch(`${DATABASE_URL}/users/${userId}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) throw new Error('注册失败');
    
    // 自动登录
    login(email, password);
    
  } catch (error) {
    showMessage(error.message, 'error');
  }
}

// 登录
async function login(email, password) {
  try {
    const response = await fetch(`${DATABASE_URL}/users.json`);
    const usersData = await response.json();
    
    if (!usersData) throw new Error('无用户数据');
    
    // 查找用户
    let foundUser = null;
    let foundUserId = null;
    
    for (const [userId, user] of Object.entries(usersData)) {
      if (user.email === email && user.passwordHash === hashPassword(password)) {
        foundUser = user;
        foundUserId = userId;
        break;
      }
    }
    
    if (!foundUser) throw new Error('邮箱或密码错误');
    
    // 保存登录状态
    currentUser = { id: foundUserId, email: foundUser.email };
    authToken = foundUserId;
    userEmail = email;
    localStorage.setItem('todo_auth_token', authToken);
    localStorage.setItem('todo_user_email', email);
    
    // 刷新界面
    showApp();
    showMessage(`欢迎回来，${email}！`, 'success');
    
  } catch (error) {
    showMessage(error.message, 'error');
  }
}

// 登出
function logout() {
  currentUser = null;
  authToken = null;
  userEmail = null;
  localStorage.removeItem('todo_auth_token');
  localStorage.removeItem('todo_user_email');
  showLogin();
  showMessage('已退出登录', 'success');
}

// 获取用户数据路径
function getUserPath() {
  return authToken ? `todos_${authToken}` : null;
}

// ==================== Todo CRUD ====================

async function fetchTodos() {
  if (!authToken) return;
  
  try {
    const path = getUserPath();
    const response = await fetch(`${DATABASE_URL}/${path}.json`);
    const data = await response.json();
    
    const todos = data ? Object.entries(data).map(([id, todo]) => ({ id, ...todo })) : [];
    todos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    renderTodos(todos);
    updateStats(todos);
  } catch (error) {
    showMessage('获取数据失败', 'error');
  }
}

async function addTodo(title) {
  if (!title.trim()) return;
  if (!authToken) {
    showMessage('请先登录', 'error');
    return;
  }
  
  try {
    const path = getUserPath();
    const newTodo = {
      title: title.trim(),
      completed: false,
      created_at: new Date().toISOString()
    };
    
    const response = await fetch(`${DATABASE_URL}/${path}.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTodo)
    });
    
    if (!response.ok) throw new Error('添加失败');
    
    showMessage('添加成功！', 'success');
    fetchTodos();
    todoInput.value = '';
  } catch (error) {
    showMessage(error.message, 'error');
  }
}

async function toggleTodo(id) {
  try {
    const path = getUserPath();
    const getResponse = await fetch(`${DATABASE_URL}/${path}/${id}.json`);
    const todo = await getResponse.json();
    
    if (!todo) throw new Error('未找到');
    
    await fetch(`${DATABASE_URL}/${path}/${id}.json`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !todo.completed })
    });
    
    fetchTodos();
  } catch (error) {
    showMessage(error.message, 'error');
  }
}

async function deleteTodo(id) {
  try {
    const path = getUserPath();
    await fetch(`${DATABASE_URL}/${path}/${id}.json`, {
      method: 'DELETE'
    });
    
    showMessage('删除成功！', 'success');
    fetchTodos();
  } catch (error) {
    showMessage(error.message, 'error');
  }
}

// ==================== 渲染函数 ====================

function renderTodos(todos) {
  todoList.innerHTML = '';
  
  if (!authToken) return;
  
  if (todos.length === 0) {
    todoList.innerHTML = `
      <li class="empty-state">
        <span>📋</span>
        <p>暂无待办，添加一个吧！</p>
      </li>
    `;
    return;
  }
  
  todos.forEach(todo => {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    li.innerHTML = `
      <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleTodo('${todo.id}')">
      <span class="todo-text">${escapeHtml(todo.title)}</span>
      <button class="delete-btn" onclick="deleteTodo('${todo.id}')">删除</button>
    `;
    todoList.appendChild(li);
  });
}

function updateStats(todos) {
  const total = todos.length;
  const completed = todos.filter(t => t.completed).length;
  totalCount.textContent = total;
  completedCount.textContent = completed;
  pendingCount.textContent = total - completed;
}

function showMessage(text, type) {
  messageEl.textContent = text;
  messageEl.className = `message ${type}`;
  setTimeout(() => {
    messageEl.textContent = '';
    messageEl.className = 'message';
  }, 3000);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ==================== UI 切换 ====================

function showLogin() {
  header.innerHTML = `
    <h1>📝 Todo App</h1>
    <p>用户登录</p>
    <div class="auth-form">
      <input type="email" id="authEmail" placeholder="邮箱">
      <input type="password" id="authPassword" placeholder="密码">
      <div class="auth-buttons">
        <button onclick="handleAuth('login')">登录</button>
        <button onclick="handleAuth('register')" class="secondary">注册</button>
      </div>
    </div>
  `;
  todoList.innerHTML = '';
  updateStats([0,0,0]);
  totalCount.textContent = '0';
  completedCount.textContent = '0';
  pendingCount.textContent = '0';
}

function showApp() {
  header.innerHTML = `
    <h1>📝 Todo App</h1>
    <p>欢迎，${userEmail}</p>
    <button onclick="logout()" class="logout-btn">退出登录</button>
    <p style="font-size: 12px; color: #888; margin-top: 5px;">
      🔄 数据同步到 Firebase 云端
    </p>
  `;
}

async function handleAuth(action) {
  const email = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value;
  
  if (!email || !password) {
    showMessage('请输入邮箱和密码', 'error');
    return;
  }
  
  if (action === 'login') {
    await login(email, password);
  } else {
    await register(email, password);
  }
}

// ==================== 事件绑定 ====================

addBtn.addEventListener('click', () => {
  const title = todoInput.value.trim();
  if (title) addTodo(title);
});

todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const title = todoInput.value.trim();
    if (title) addTodo(title);
  }
});

// ==================== 初始化 ====================

document.addEventListener('DOMContentLoaded', () => {
  if (authToken && userEmail) {
    currentUser = { id: authToken, email: userEmail };
    showApp();
    fetchTodos();
  } else {
    showLogin();
  }
});

window.toggleTodo = toggleTodo;
window.deleteTodo = deleteTodo;
window.handleAuth = handleAuth;
window.logout = logout;
