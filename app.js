// public/app.js - Todo App V5: Search
// 添加搜索功能

const DATABASE_URL = 'https://first-ad067-default-rtdb.asia-southeast1.firebasedatabase.app';

// 用户状态
let currentUser = null;
let authToken = localStorage.getItem('todo_auth_token');
let userEmail = localStorage.getItem('todo_user_email');
let currentCategory = 'all';
let currentPriority = 'all';
let searchQuery = '';
let categories = [];

// 优先级
const PRIORITIES = [
  { id: 'high', name: '紧急', icon: '🔴', color: '#e74c3c', bgColor: '#fdeaea' },
  { id: 'medium', name: '重要', icon: '🟡', color: '#f39c12', bgColor: '#fef9e7' },
  { id: 'low', name: '一般', icon: '🟢', color: '#27ae60', bgColor: '#eafaf1' }
];

// DOM
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const totalCount = document.getElementById('totalCount');
const completedCount = document.getElementById('completedCount');
const pendingCount = document.getElementById('pendingCount');
const messageEl = document.getElementById('message');

// ==================== 工具函数 ====================

function hashPassword(password) {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 'hash_' + Math.abs(hash).toString(36);
}

function generateUserId() {
  return 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// ==================== 用户系统 ====================

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

// ==================== 路径 ====================

function getUserPath() { return authToken ? `todos_${authToken}` : null; }
function getCategoriesPath() { return authToken ? `categories_${authToken}` : null; }

// ==================== 分类系统 ====================

async function fetchCategories() {
  if (!authToken) return [];
  try {
    const response = await fetch(`${DATABASE_URL}/${getCategoriesPath()}.json`);
    const data = await response.json();
    categories = data ? Object.entries(data).map(([id, cat]) => ({ id, ...cat })) : [];
    return categories;
  } catch (error) {
    categories = [];
    return categories;
  }
}

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

async function deleteCategory(catId) {
  if (!authToken || catId === 'all') return;
  const todos = await fetchTodosRaw();
  for (const todo of todos) {
    if (todo.category === catId) {
      await fetch(`${DATABASE_URL}/${getUserPath()}/${todo.id}.json`, { method: 'DELETE' });
    }
  }
  await fetch(`${DATABASE_URL}/${getCategoriesPath()}/${catId}.json`, { method: 'DELETE' });
  currentCategory = 'all';
  await loadCategories();
}

// ==================== Todo CRUD ====================

async function fetchTodosRaw() {
  if (!authToken) return [];
  const response = await fetch(`${DATABASE_URL}/${getUserPath()}.json`);
  const data = await response.json();
  return data ? Object.entries(data).map(([id, todo]) => ({ id, ...todo })) : [];
}

async function fetchTodos() {
  if (!authToken) return [];
  let todos = await fetchTodosRaw();
  
  // 搜索过滤
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    todos = todos.filter(t => 
      t.title.toLowerCase().includes(query) ||
      (t.dueDate && t.dueDate.includes(query))
    );
  }
  
  // 分类过滤
  if (currentCategory !== 'all') todos = todos.filter(t => t.category === currentCategory);
  
  // 优先级过滤
  if (currentPriority !== 'all') todos = todos.filter(t => t.priority === currentPriority);
  
  // 排序
  todos.sort((a, b) => {
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;
    if (a.dueDate && b.dueDate) {
      if (a.dueDate !== b.dueDate) return new Date(a.dueDate) - new Date(b.dueDate);
    }
    return new Date(b.created_at) - new Date(a.created_at);
  });
  
  renderTodos(todos);
  
  // 统计（基于所有数据，不过滤搜索）
  const allTodos = await fetchTodosRaw();
  updateStats(allTodos.filter(t => 
    (currentCategory === 'all' || t.category === currentCategory) &&
    (currentPriority === 'all' || t.priority === currentPriority)
  ));
  return todos;
}

async function addTodo() {
  const title = todoInput.value.trim();
  if (!title) { showMessage('请输入待办内容', 'error'); return; }
  if (!authToken) { showMessage('请先登录', 'error'); return; }
  
  const dueDate = prompt('设置截止日期（格式: 2024-12-31）\n直接回车跳过:', '');
  
  try {
    const newTodo = {
      title,
      completed: false,
      created_at: new Date().toISOString(),
      category: currentCategory === 'all' ? null : currentCategory,
      priority: currentPriority === 'all' ? 'medium' : currentPriority,
      dueDate: dueDate ? dueDate : null
    };
    
    await fetch(`${DATABASE_URL}/${getUserPath()}.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTodo)
    });
    
    showMessage('添加成功！', 'success');
    todoInput.value = '';
    fetchTodos();
  } catch (error) {
    showMessage(error.message, 'error');
  }
}

async function toggleTodo(id) {
  try {
    const getResponse = await fetch(`${DATABASE_URL}/${getUserPath()}/${id}.json`);
    const todo = await getResponse.json();
    await fetch(`${DATABASE_URL}/${getUserPath()}/${id}.json`, {
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
    await fetch(`${DATABASE_URL}/${getUserPath()}/${id}.json`, { method: 'DELETE' });
    showMessage('删除成功！', 'success');
    fetchTodos();
  } catch (error) {
    showMessage(error.message, 'error');
  }
}

async function setDueDate(id, currentDate) {
  const newDate = prompt('设置截止日期（格式: 2024-12-31）\n输入空值删除日期:', currentDate || '');
  try {
    if (newDate === '') {
      await fetch(`${DATABASE_URL}/${getUserPath()}/${id}.json`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dueDate: null })
      });
      showMessage('已删除日期', 'success');
    } else if (newDate) {
      await fetch(`${DATABASE_URL}/${getUserPath()}/${id}.json`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dueDate: newDate })
      });
      showMessage('已设置日期', 'success');
    }
    fetchTodos();
  } catch (error) {
    showMessage(error.message, 'error');
  }
}

// ==================== 搜索 ====================

function performSearch(query) {
  searchQuery = query.trim();
  renderSearchResults();
  fetchTodos();
}

function renderSearchResults() {
  const existing = document.querySelector('.search-results-info');
  if (existing) existing.remove();
  
  if (searchQuery) {
    const info = document.createElement('div');
    info.className = 'search-results-info';
    info.innerHTML = `🔍 搜索: <strong>"${escapeHtml(searchQuery)}"</strong> <button onclick="clearSearch()">清除</button>`;
    document.querySelector('.input-section').before(info);
  }
}

function clearSearch() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.value = '';
  searchQuery = '';
  renderSearchResults();
  fetchTodos();
}

// ==================== 渲染 ====================

function renderTodos(todos) {
  todoList.innerHTML = '';
  if (!authToken) return;
  
  if (todos.length === 0) {
    todoList.innerHTML = `<li class="empty-state"><span>📋</span><p>${searchQuery ? '未找到匹配的待办' : '暂无待办'}</p></li>`;
    return;
  }
  
  const today = new Date().toISOString().split('T')[0];
  
  todos.forEach(todo => {
    const cat = categories.find(c => c.id === todo.category);
    const priority = PRIORITIES.find(p => p.id === todo.priority) || PRIORITIES[1];
    
    let overdueClass = '';
    let overdueText = '';
    if (todo.dueDate && !todo.completed) {
      if (todo.dueDate < today) {
        overdueClass = 'overdue';
        overdueText = '🔴 已过期';
      } else if (todo.dueDate === today) {
        overdueText = '🟡 今天';
      }
    }
    
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''} ${overdueClass}`;
    li.style.borderLeft = `4px solid ${priority.color}`;
    
    li.innerHTML = `
      <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleTodo('${todo.id}')">
      <span class="todo-text">${highlightMatch(escapeHtml(todo.title), searchQuery)}</span>
      ${todo.dueDate ? `<span class="todo-date" onclick="setDueDate('${todo.id}', '${todo.dueDate}')">📅 ${todo.dueDate} ${overdueText}</span>` : `<span class="todo-date add-date" onclick="setDueDate('${todo.id}')">➕ 加日期</span>`}
      <span class="todo-priority" style="background:${priority.bgColor};color:${priority.color}">${priority.icon} ${priority.name}</span>
      ${cat ? `<span class="todo-category" style="background:${cat.color}20;color:${cat.color}">${cat.icon} ${cat.name}</span>` : ''}
      <button class="delete-btn" onclick="deleteTodo('${todo.id}')">删除</button>
    `;
    todoList.appendChild(li);
  });
}

function highlightMatch(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function updateStats(todos) {
  totalCount.textContent = todos.length;
  completedCount.textContent = todos.filter(t => t.completed).length;
  pendingCount.textContent = todos.filter(t => !t.completed).length;
}

function showMessage(text, type) {
  messageEl.textContent = text;
  messageEl.className = `message ${type}`;
  setTimeout(() => { messageEl.textContent = ''; messageEl.className = 'message'; }, 3000);
}

// 网络错误处理
function handleNetworkError(error) {
  console.error('Network error:', error);
  showMessage('网络连接失败，请检查网络后刷新重试', 'error');
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ==================== UI ====================

async function loadCategories() {
  await fetchCategories();
  renderCategoryTabs();
  renderPriorityTabs();
  renderSearchResults();
  fetchTodos();
}

function renderCategoryTabs() {
  const existing = document.querySelector('.category-tabs');
  if (existing) existing.remove();
  
  const tabs = document.createElement('div');
  tabs.className = 'category-tabs';
  tabs.innerHTML = `<div class="category-tab ${currentCategory === 'all' ? 'active' : ''}" onclick="switchCategory('all')">📋 全部</div>`;
  
  categories.forEach(cat => {
    tabs.innerHTML += `<div class="category-tab ${currentCategory === cat.id ? 'active' : ''}" onclick="switchCategory('${cat.id}')" style="${currentCategory === cat.id ? `background:${cat.color}20;border-color:${cat.color}` : ''}">${cat.icon} ${cat.name}<span class="delete-cat" onclick="event.stopPropagation(); deleteCategory('${cat.id}')">×</span></div>`;
  });
  
  tabs.innerHTML += `<div class="category-tab add-cat" onclick="showAddCategory()">➕ 添加分类</div>`;
  document.querySelector('.input-section').before(tabs);
}

function renderPriorityTabs() {
  const existing = document.querySelector('.priority-tabs');
  if (existing) existing.remove();
  
  const tabs = document.createElement('div');
  tabs.className = 'priority-tabs';
  tabs.innerHTML = `<div class="priority-tab ${currentPriority === 'all' ? 'active' : ''}" onclick="switchPriority('all')">🎯 全部</div>`;
  
  PRIORITIES.forEach(p => {
    tabs.innerHTML += `<div class="priority-tab ${currentPriority === p.id ? 'active' : ''}" onclick="switchPriority('${p.id}')" style="${currentPriority === p.id ? `background:${p.bgColor};border-color:${p.color};color:${p.color}` : ''}">${p.icon} ${p.name}</div>`;
  });
  
  document.querySelector('.input-section').before(tabs);
}

function switchCategory(catId) {
  currentCategory = catId;
  loadCategories();
}

function switchPriority(priority) {
  currentPriority = priority;
  renderPriorityTabs();
  fetchTodos();
}

function showAddCategory() {
  const name = prompt('输入分类名称:');
  if (name && name.trim()) {
    const icons = ['💼', '🏠', '📚', '🎯', '💪', '🎮', '🎵', '🍔'];
    const icon = prompt(`选择图标(1-8):\n${icons.map((ic, i) => `${i+1}. ${ic}`).join('\n')}:`, '1');
    const colors = ['#e74c3c', '#3498db', '#27ae60', '#f39c12', '#9b59b6', '#1abc9c'];
    const color = prompt(`选择颜色(1-6):\n${colors.map((c, i) => `${i+1}. ${c}`).join('\n')}:`, '1');
    addCategory(name.trim(), icons[parseInt(icon) - 1] || '📁', colors[parseInt(color) - 1] || '#667eea');
  }
}

function showLogin() {
  document.querySelector('header').innerHTML = `
    <h1>📝 Todo App</h1>
    <p>V5: 搜索功能</p>
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
  // 添加搜索框
  const searchHTML = `
    <div class="search-box">
      <input type="text" id="searchInput" placeholder="🔍 搜索待办..." oninput="performSearch(this.value)">
    </div>
  `;
  
  document.querySelector('header').innerHTML = `
    <h1>📝 Todo App</h1>
    <p>欢迎，${userEmail}</p>
    <button onclick="logout()" class="logout-btn">退出登录</button>
    <p style="font-size: 12px; color: #888; margin-top: 5px;">🔍 V5: 搜索功能</p>
    ${searchHTML}
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

// ==================== 事件 ====================

addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && todoInput.value.trim()) addTodo();
});

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
window.setDueDate = setDueDate;
window.performSearch = performSearch;
window.clearSearch = clearSearch;
window.handleAuth = handleAuth;
window.logout = logout;
window.switchCategory = switchCategory;
window.switchPriority = switchPriority;
window.deleteCategory = deleteCategory;
window.showAddCategory = showAddCategory;
