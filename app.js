// public/app.js - Todo App V2: Categories/Folders
// 添加分类/文件夹功能

const DATABASE_URL = 'https://first-ad067-default-rtdb.asia-southeast1.firebasedatabase.app';

// 用户状态
let currentUser = null;
let authToken = localStorage.getItem('todo_auth_token');
let userEmail = localStorage.getItem('todo_user_email');
let currentCategory = 'all'; // 当前分类
let categories = []; // 用户分类列表

// DOM 元素
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const totalCount = document.getElementById('totalCount');
const completedCount = document.getElementById('completedCount');
const pendingCount = document.getElementById('pendingCount');
const messageEl = document.getElementById('message');

// ==================== 密码哈希 ====================

function hashPassword(password) {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 'hash_' + Math.abs(hash).toString(36);
}

// ==================== 用户系统 ====================

function generateUserId() {
  return 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

async function register(email, password) {
  try {
    const checkResponse = await fetch(`${DATABASE_URL}/users.json`);
    const usersData = await checkResponse.json();
    
    if (usersData) {
      const existingUser = Object.values(usersData).find(u => u.email === email);
      if (existingUser) throw new Error('该邮箱已注册');
    }
    
    const userId = generateUserId();
    await fetch(`${DATABASE_URL}/users/${userId}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, passwordHash: hashPassword(password), created: new Date().toISOString() })
    });
    
    login(email, password);
  } catch (error) {
    showMessage(error.message, 'error');
  }
}

async function login(email, password) {
  try {
    const response = await fetch(`${DATABASE_URL}/users.json`);
    const usersData = await response.json();
    
    let foundUser = null;
    let foundUserId = null;
    
    for (const [userId, user] of Object.entries(usersData || {})) {
      if (user.email === email && user.passwordHash === hashPassword(password)) {
        foundUser = user;
        foundUserId = userId;
        break;
      }
    }
    
    if (!foundUser) throw new Error('邮箱或密码错误');
    
    currentUser = { id: foundUserId, email: foundUser.email };
    authToken = foundUserId;
    userEmail = email;
    localStorage.setItem('todo_auth_token', authToken);
    localStorage.setItem('todo_user_email', email);
    
    showApp();
    showMessage(`欢迎回来，${email}！`, 'success');
  } catch (error) {
    showMessage(error.message, 'error');
  }
}

function logout() {
  currentUser = null;
  authToken = null;
  userEmail = null;
  localStorage.removeItem('todo_auth_token');
  localStorage.removeItem('todo_user_email');
  showLogin();
  showMessage('已退出登录', 'success');
}

// ==================== 分类系统 ====================

function getUserPath() {
  return authToken ? `todos_${authToken}` : null;
}

function getCategoriesPath() {
  return authToken ? `categories_${authToken}` : null;
}

// 获取分类
async function fetchCategories() {
  if (!authToken) return [];
  try {
    const response = await fetch(`${DATABASE_URL}/${getCategoriesPath()}.json`);
    const data = await response.json();
    if (data) {
      categories = Object.entries(data).map(([id, cat]) => ({ id, ...cat }));
    } else {
      categories = [
        { id: 'work', name: '工作', icon: '💼', color: '#e74c3c' },
        { id: 'life', name: '生活', icon: '🏠', color: '#3498db' },
        { id: 'study', name: '学习', icon: '📚', color: '#27ae60' }
      ];
    }
    return categories;
  } catch (error) {
    categories = [];
    return categories;
  }
}

// 添加分类
async function addCategory(name, icon = '📁', color = '#667eea') {
  if (!authToken) return;
  const id = 'cat_' + Date.now().toString(36);
  await fetch(`${DATABASE_URL}/${getCategoriesPath()}/${id}.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, icon, color })
  });
  await loadCategories();
}

// 删除分类
async function deleteCategory(catId) {
  if (!authToken || catId === 'all') return;
  
  // 删除该分类下的所有待办
  const todos = await fetchTodos();
  for (const todo of todos) {
    if (todo.category === catId) {
      await fetch(`${DATABASE_URL}/${getUserPath()}/${todo.id}.json`, { method: 'DELETE' });
    }
  }
  
  // 删除分类
  await fetch(`${DATABASE_URL}/${getCategoriesPath()}/${catId}.json`, { method: 'DELETE' });
  currentCategory = 'all';
  await loadCategories();
}

// ==================== Todo CRUD ====================

async function fetchTodos() {
  if (!authToken) return [];
  try {
    const path = getUserPath();
    const response = await fetch(`${DATABASE_URL}/${path}.json`);
    const data = await response.json();
    let todos = data ? Object.entries(data).map(([id, todo]) => ({ id, ...todo })) : [];
    
    // 过滤当前分类
    if (currentCategory !== 'all') {
      todos = todos.filter(t => t.category === currentCategory);
    }
    
    todos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    renderTodos(todos);
    updateStats(todos.filter(t => t.category === currentCategory || currentCategory === 'all'));
    return todos;
  } catch (error) {
    return [];
  }
}

async function addTodo(title) {
  if (!title.trim()) return;
  if (!authToken) { showMessage('请先登录', 'error'); return; }
  
  try {
    const path = getUserPath();
    const newTodo = {
      title: title.trim(),
      completed: false,
      created_at: new Date().toISOString(),
      category: currentCategory === 'all' ? null : currentCategory
    };
    
    await fetch(`${DATABASE_URL}/${path}.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTodo)
    });
    
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
    await fetch(`${DATABASE_URL}/${path}/${id}.json`, { method: 'DELETE' });
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
    const cat = categories.find(c => c.id === todo.category);
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    li.innerHTML = `
      <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleTodo('${todo.id}')">
      <span class="todo-text">${escapeHtml(todo.title)}</span>
      ${cat ? `<span class="todo-category" style="background:${cat.color}20;color:${cat.color};border:1px solid ${cat.color}">${cat.icon} ${cat.name}</span>` : ''}
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
  setTimeout(() => { messageEl.textContent = ''; messageEl.className = 'message'; }, 3000);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ==================== UI 渲染 ====================

async function loadCategories() {
  await fetchCategories();
  renderCategoryTabs();
  fetchTodos();
}

function renderCategoryTabs() {
  // 在输入框上方显示分类标签
  const existingTabs = document.querySelector('.category-tabs');
  if (existingTabs) existingTabs.remove();
  
  const tabsContainer = document.createElement('div');
  tabsContainer.className = 'category-tabs';
  
  // 全部
  tabsContainer.innerHTML += `
    <div class="category-tab ${currentCategory === 'all' ? 'active' : ''}" onclick="switchCategory('all')">
      📋 全部
    </div>
  `;
  
  // 用户分类
  categories.forEach(cat => {
    tabsContainer.innerHTML += `
      <div class="category-tab ${currentCategory === cat.id ? 'active' : ''}" 
           onclick="switchCategory('${cat.id}')"
           style="${currentCategory === cat.id ? `background:${cat.color}20;border-color:${cat.color}` : ''}">
        ${cat.icon} ${cat.name}
        <span class="delete-cat" onclick="event.stopPropagation(); deleteCategory('${cat.id}')">×</span>
      </div>
    `;
  });
  
  // 添加分类按钮
  tabsContainer.innerHTML += `
    <div class="category-tab add-cat" onclick="showAddCategory()">
      ➕ 添加分类
    </div>
  `;
  
  document.querySelector('.input-section').before(tabsContainer);
}

function switchCategory(catId) {
  currentCategory = catId;
  renderCategoryTabs();
}

function showAddCategory() {
  const name = prompt('输入分类名称（如：工作、生活）:');
  if (name && name.trim()) {
    const icons = ['💼', '🏠', '📚', '🎯', '💪', '🎮', '🎵', '🍔'];
    const icon = prompt(`选择图标（回复数字）:\n${icons.map((ic, i) => `${i+1}. ${ic}`).join('\n')}:`, '1');
    const colors = ['#e74c3c', '#3498db', '#27ae60', '#f39c12', '#9b59b6', '#1abc9c'];
    const color = prompt(`选择颜色（回复数字）:\n${colors.map((c, i) => `${i+1}. ${c}`).join('\n')}:`, '1');
    
    const selectedIcon = icons[parseInt(icon) - 1] || '📁';
    const selectedColor = colors[parseInt(color) - 1] || '#667eea';
    
    addCategory(name.trim(), selectedIcon, selectedColor);
  }
}

// ==================== 登录/应用 UI ====================

function showLogin() {
  document.querySelector('header').innerHTML = `
    <h1>📝 Todo App V2</h1>
    <p>分类管理</p>
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
  totalCount.textContent = '0';
  completedCount.textContent = '0';
  pendingCount.textContent = '0';
}

function showApp() {
  document.querySelector('header').innerHTML = `
    <h1>📝 Todo App</h1>
    <p>欢迎，${userEmail}</p>
    <button onclick="logout()" class="logout-btn">退出登录</button>
    <p style="font-size: 12px; color: #888; margin-top: 5px;">📁 V2: 分类管理</p>
  `;
  loadCategories();
}

async function handleAuth(action) {
  const email = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value;
  if (!email || !password) { showMessage('请输入邮箱和密码', 'error'); return; }
  if (action === 'login') await login(email, password);
  else await register(email, password);
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
  } else {
    showLogin();
  }
});

// 全局函数
window.toggleTodo = toggleTodo;
window.deleteTodo = deleteTodo;
window.handleAuth = handleAuth;
window.logout = logout;
window.switchCategory = switchCategory;
window.deleteCategory = deleteCategory;
window.showAddCategory = showAddCategory;
