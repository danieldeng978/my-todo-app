// public/app.js - Todo App V8: Share/Collaboration
// 添加分享/协作功能

const DATABASE_URL = 'https://first-ad067-default-rtdb.asia-southeast1.firebasedatabase.app';

// 用户状态
let currentUser = null;
let authToken = localStorage.getItem('todo_auth_token');
let userEmail = localStorage.getItem('todo_user_email');
let currentCategory = 'all';
let currentPriority = 'all';
let searchQuery = '';
let categories = [];
let showStats = false;
let currentShareCode = localStorage.getItem('todo_share_code');
let isSharedMode = false;

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

function generateShareCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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
    isSharedMode = false;
    currentShareCode = null;
    localStorage.removeItem('todo_share_code');
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
  isSharedMode = false;
  currentShareCode = null;
  localStorage.removeItem('todo_share_code');
  showLogin();
  showMessage('已退出登录', 'success');
}

// ==================== 路径 ====================

function getUserPath() { 
  if (isSharedMode && currentShareCode) {
    return `shared_${currentShareCode}`;
  }
  return authToken ? `todos_${authToken}` : null; 
}

function getCategoriesPath() { 
  if (isSharedMode && currentShareCode) {
    return `shared_cat_${currentShareCode}`;
  }
  return authToken ? `categories_${authToken}` : null; 
}

// ==================== 分享系统 ====================

async function createShare() {
  if (!authToken) { showMessage('请先登录', 'error'); return; }
  
  try {
    const shareCode = generateShareCode();
    
    // 创建分享数据存储
    await fetch(`${DATABASE_URL}/shared_${shareCode}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ todos: [], created: new Date().toISOString(), owner: authToken })
    });
    
    // 复制当前分类
    const cats = await fetchCategories();
    for (const cat of cats) {
      await fetch(`${DATABASE_URL}/shared_cat_${shareCode}/${cat.id}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cat)
      });
    }
    
    // 复制当前待办
    const todos = await fetchTodosRaw();
    for (const todo of todos) {
      const newTodo = { ...todo };
      delete newTodo.id;
      await fetch(`${DATABASE_URL}/shared_${shareCode}/todos.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo)
      });
    }
    
    currentShareCode = shareCode;
    isSharedMode = true;
    localStorage.setItem('todo_share_code', shareCode);
    
    // 显示分享码
    const shareUrl = `https://danieldeng978.github.io/my-todo-app/?share=${shareCode}`;
    
    if (confirm(`分享码: ${shareCode}\n\n链接: ${shareUrl}\n\n是否复制链接?`)) {
      navigator.clipboard.writeText(shareUrl);
      showMessage('链接已复制!', 'success');
    }
    
    showApp();
  } catch (error) {
    showMessage('创建分享失败', 'error');
  }
}

async function joinShare() {
  const shareCode = prompt('输入分享码:');
  if (!shareCode || !shareCode.trim()) return;
  
  const code = shareCode.trim().toUpperCase();
  
  try {
    // 检查分享是否存在
    const response = await fetch(`${DATABASE_URL}/shared_${code}.json`);
    if (!response.ok) throw new Error('分享不存在');
    
    currentShareCode = code;
    isSharedMode = true;
    localStorage.setItem('todo_share_code', code);
    
    showMessage('已加入分享列表!', 'success');
    showApp();
  } catch (error) {
    showMessage('分享码无效', 'error');
  }
}

async function exitShare() {
  isSharedMode = false;
  currentShareCode = null;
  localStorage.removeItem('todo_share_code');
  showMessage('已退出分享模式', 'success');
  showApp();
}

// ==================== 分类系统 ====================

async function fetchCategories() {
  const path = getCategoriesPath();
  if (!path) return [];
  try {
    const response = await fetch(`${DATABASE_URL}/${path}.json`);
    const data = await response.json();
    categories = data ? Object.entries(data).map(([id, cat]) => ({ id, ...cat })) : [];
    return categories;
  } catch (error) {
    categories = [];
    return categories;
  }
}

async function addCategory(name, icon = '📁', color = '#667eea') {
  const path = getCategoriesPath();
  if (!path) return;
  const id = 'cat_' + Date.now().toString(36);
  await fetch(`${DATABASE_URL}/${path}/${id}.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, icon, color })
  });
  await loadCategories();
}

async function deleteCategory(catId) {
  if (!authToken || catId === 'all' || isSharedMode) return;
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
  const path = getUserPath();
  if (!path) return [];
  const response = await fetch(`${DATABASE_URL}/${path}.json`);
  const data = await response.json();
  if (isSharedMode) {
    return data && data.todos ? Object.entries(data.todos).map(([id, todo]) => ({ id, ...todo })) : [];
  }
  return data ? Object.entries(data).map(([id, todo]) => ({ id, ...todo })) : [];
}

async function fetchTodos() {
  const path = getUserPath();
  if (!path) return [];
  let todos = await fetchTodosRaw();
  
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    todos = todos.filter(t => t.title.toLowerCase().includes(query) || (t.dueDate && t.dueDate.includes(query)));
  }
  
  if (currentCategory !== 'all') todos = todos.filter(t => t.category === currentCategory);
  if (currentPriority !== 'all') todos = todos.filter(t => t.priority === currentPriority);
  
  todos.sort((a, b) => {
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;
    if (a.dueDate && b.dueDate) {
      if (a.dueDate !== b.dueDate) return new Date(a.dueDate) - new Date(b.dueDate);
    }
    return new Date(b.created_at) - new Date(a.created_at);
  });
  
  renderTodos(todos);
  
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
  if (!authToken && !isSharedMode) { showMessage('请先登录', 'error'); return; }
  
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
    
    if (isSharedMode) {
      await fetch(`${DATABASE_URL}/${getUserPath()}/todos.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo)
      });
    } else {
      await fetch(`${DATABASE_URL}/${getUserPath()}.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo)
      });
    }
    
    showMessage('添加成功!', 'success');
    todoInput.value = '';
    fetchTodos();
  } catch (error) {
    showMessage(error.message, 'error');
  }
}

async function toggleTodo(id) {
  try {
    let url = `${DATABASE_URL}/${getUserPath()}`;
    if (isSharedMode) {
      url += `/todos/${id}`;
    } else {
      url += `/${id}`;
    }
    const getResponse = await fetch(url + '.json');
    const todo = await getResponse.json();
    
    await fetch(url, {
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
  if (isSharedMode) {
    showMessage('分享模式只读,不能删除', 'error');
    return;
  }
  try {
    await fetch(`${DATABASE_URL}/${getUserPath()}/${id}.json`, { method: 'DELETE' });
    showMessage('删除成功!', 'success');
    fetchTodos();
  } catch (error) {
    showMessage(error.message, 'error');
  }
}

async function setDueDate(id, currentDate) {
  const newDate = prompt('设置截止日期（格式: 2024-12-31）\n输入空值删除日期:', currentDate || '');
  try {
    let url = `${DATABASE_URL}/${getUserPath()}`;
    if (isSharedMode) {
      url += `/todos/${id}`;
    } else {
      url += `/${id}`;
    }
    
    if (newDate === '') {
      await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dueDate: null })
      });
      showMessage('已删除日期', 'success');
    } else if (newDate) {
      await fetch(url, {
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

// ==================== 统计功能 ====================

async function getStats() {
  const todos = await fetchTodosRaw();
  
  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    pending: todos.filter(t => !t.completed).length,
    byPriority: {
      high: todos.filter(t => t.priority === 'high').length,
      medium: todos.filter(t => t.priority === 'medium').length,
      low: todos.filter(t => t.priority === 'low').length
    },
    byCategory: {},
    overdue: todos.filter(t => t.dueDate && !t.completed && t.dueDate < new Date().toISOString().split('T')[0]).length,
    dueToday: todos.filter(t => t.dueDate && !t.completed && t.dueDate === new Date().toISOString().split('T')[0]).length,
    dueThisWeek: 0
  };
  
  const today = new Date();
  const weekEnd = new Date(today);
  weekEnd.setDate(weekEnd.getDate() + 7);
  
  todos.filter(t => t.dueDate && !t.completed).forEach(t => {
    if (t.dueDate >= new Date().toISOString().split('T')[0] && t.dueDate <= weekEnd.toISOString().split('T')[0]) {
      stats.dueThisWeek++;
    }
  });
  
  categories.forEach(cat => {
    stats.byCategory[cat.id] = todos.filter(t => t.category === cat.id).length;
  });
  
  return stats;
}

async function toggleStats() {
  showStats = !showStats;
  if (showStats) {
    renderStats();
  } else {
    hideStats();
  }
}

async function renderStats() {
  const existing = document.querySelector('.stats-dashboard');
  if (existing) existing.remove();
  
  const stats = await getStats();
  
  const dashboard = document.createElement('div');
  dashboard.className = 'stats-dashboard';
  
  dashboard.innerHTML = `
    <div class="stats-header">
      <h3>📊 统计概览</h3>
      <button onclick="toggleStats()" class="close-stats">×</button>
    </div>
    
    <div class="stats-grid">
      <div class="stat-card total"><div class="stat-number">${stats.total}</div><div class="stat-label">总计</div></div>
      <div class="stat-card completed"><div class="stat-number">${stats.completed}</div><div class="stat-label">已完成</div></div>
      <div class="stat-card pending"><div class="stat-number">${stats.pending}</div><div class="stat-label">进行中</div></div>
      <div class="stat-card overdue"><div class="stat-number">${stats.overdue}</div><div class="stat-label">已过期</div></div>
    </div>
    
    <div class="stats-section">
      <h4>🔴 按优先级</h4>
      <div class="priority-bars">
        <div class="bar-row"><span class="bar-label">🔴 紧急</span><div class="bar-bg"><div class="bar-fill high" style="width:${stats.total ? (stats.byPriority.high / stats.total * 100) : 0}%"></div></div><span class="bar-count">${stats.byPriority.high}</span></div>
        <div class="bar-row"><span class="bar-label">🟡 重要</span><div class="bar-bg"><div class="bar-fill medium" style="width:${stats.total ? (stats.byPriority.medium / stats.total * 100) : 0}%"></div></div><span class="bar-count">${stats.byPriority.medium}</span></div>
        <div class="bar-row"><span class="bar-label">🟢 一般</span><div class="bar-bg"><div class="bar-fill low" style="width:${stats.total ? (stats.byPriority.low / stats.total * 100) : 0}%"></div></div><span class="bar-count">${stats.byPriority.low}</span></div>
      </div>
    </div>
    
    <div class="stats-section">
      <h4>📅 时间提醒</h4>
      <div class="time-alerts">
        <div class="alert-item overdue"><span>🔴 已过期</span><strong>${stats.overdue}</strong></div>
        <div class="alert-item today"><span>🟡 今天到期</span><strong>${stats.dueToday}</strong></div>
        <div class="alert-item week"><span>📆 本周到期</span><strong>${stats.dueThisWeek}</strong></div>
      </div>
    </div>
  `;
  
  document.querySelector('.container').prepend(dashboard);
}

function hideStats() {
  const existing = document.querySelector('.stats-dashboard');
  if (existing) existing.remove();
}

// ==================== 导出/导入 ====================

async function exportData() {
  if (!authToken || isSharedMode) return;
  try {
    const todos = await fetchTodosRaw();
    const cats = await fetchCategories();
    const exportData = {
      version: 'V8',
      exportDate: new Date().toISOString(),
      userEmail: userEmail,
      todos: todos,
      categories: cats
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `todo-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showMessage(`已导出 ${todos.length} 条待办`, 'success');
  } catch (error) {
    showMessage('导出失败', 'error');
  }
}

async function importData() {
  if (!authToken || isSharedMode) return;
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!data.todos || !Array.isArray(data.todos)) throw new Error('文件格式不正确');
      const overwrite = confirm(`将导入 ${data.todos.length} 条待办\n\n"确定"覆盖,"取消"追加`);
      if (overwrite) {
        const existingTodos = await fetchTodosRaw();
        for (const todo of existingTodos) {
          await fetch(`${DATABASE_URL}/${getUserPath()}/${todo.id}.json`, { method: 'DELETE' });
        }
      }
      let imported = 0;
      for (const todo of data.todos) {
        const newTodo = {
          title: todo.title,
          completed: todo.completed || false,
          created_at: todo.created_at || new Date().toISOString(),
          category: todo.category || null,
          priority: todo.priority || 'medium',
          dueDate: todo.dueDate || null
        };
        await fetch(`${DATABASE_URL}/${getUserPath()}.json`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTodo)
        });
        imported++;
      }
      showMessage(`成功导入 ${imported} 条待办`, 'success');
      loadCategories();
      fetchTodos();
    } catch (error) {
      showMessage('导入失败: ' + error.message, 'error');
    }
  };
  input.click();
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
  if (!authToken && !isSharedMode) return;
  
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
      ${!isSharedMode ? `<button class="delete-btn" onclick="deleteTodo('${todo.id}')">删除</button>` : ''}
    `;
    todoList.appendChild(li);
  });
}

function highlightMatch(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
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
    tabs.innerHTML += `<div class="category-tab ${currentCategory === cat.id ? 'active' : ''}" onclick="switchCategory('${cat.id}')" style="${currentCategory === cat.id ? `background:${cat.color}20;border-color:${cat.color}` : ''}">${cat.icon} ${cat.name}${!isSharedMode ? `<span class="delete-cat" onclick="event.stopPropagation(); deleteCategory('${cat.id}')">×</span>` : ''}</div>`;
  });
  
  if (!isSharedMode) {
    tabs.innerHTML += `<div class="category-tab add-cat" onclick="showAddCategory()">➕ 添加分类</div>`;
  }
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
    <p>V8: 分享协作</p>
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
  const searchHTML = `<div class="search-box"><input type="text" id="searchInput" placeholder="🔍 搜索待办..." oninput="performSearch(this.value)"></div>`;
  
  let shareHTML = '';
  if (isSharedMode) {
    shareHTML = `
      <div class="share-mode-banner">
        <span>🤝 分享模式: ${currentShareCode}</span>
        <button onclick="exitShare()" class="exit-share-btn">退出</button>
      </div>
    `;
  } else if (authToken) {
    shareHTML = `
      <div class="share-bar">
        <button onclick="createShare()" class="share-btn">🔗 创建分享</button>
        <button onclick="joinShare()" class="join-btn">🤝 加入分享</button>
      </div>
    `;
  }
  
  const exportHTML = !isSharedMode ? `
    <div class="export-import-bar">
      <button onclick="exportData()" class="export-btn">📤 导出</button>
      <button onclick="importData()" class="import-btn">📥 导入</button>
      <button onclick="toggleStats()" class="stats-btn">📊 统计</button>
    </div>
  ` : `<div class="export-import-bar"><button onclick="toggleStats()" class="stats-btn">📊 统计</button></div>`;
  
  document.querySelector('header').innerHTML = `
    <h1>📝 Todo App</h1>
    <p>欢迎，${userEmail || '访客'}</p>
    ${authToken && !isSharedMode ? `<button onclick="logout()" class="logout-btn">退出登录</button>` : ''}
    <p style="font-size: 12px; color: #888; margin-top: 5px;">🔗 V8: 分享协作</p>
    ${shareHTML}
    ${searchHTML}
    ${exportHTML}
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

// ==================== 初始化 ====================

async function init() {
  // 检查URL中是否有分享码
  const urlParams = new URLSearchParams(window.location.search);
  const shareCode = urlParams.get('share');
  
  if (shareCode) {
    currentShareCode = shareCode.toUpperCase();
    isSharedMode = true;
    localStorage.setItem('todo_share_code', currentShareCode);
    showMessage('已加入分享!', 'success');
  }
  
  if (authToken && userEmail) {
    currentUser = { id: authToken, email: userEmail };
    showApp();
  } else if (currentShareCode) {
    showApp();
  } else {
    showLogin();
  }
}

addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && todoInput.value.trim()) addTodo();
});

document.addEventListener('DOMContentLoaded', init);

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
window.exportData = exportData;
window.importData = importData;
window.toggleStats = toggleStats;
window.createShare = createShare;
window.joinShare = joinShare;
window.exitShare = exitShare;
