// public/app.js - Todo App V10: Internationalization
// 添加中英文切换功能

const DATABASE_URL = 'https://first-ad067-default-rtdb.asia-southeast1.firebasedatabase.app';

// ==================== 国际化 ====================

const translations = {
  zh: {
    appName: 'Todo App',
    version: '国际化',
    welcome: '欢迎',
    guest: '访客',
    logout: '退出登录',
    login: '登录',
    register: '注册',
    email: '邮箱',
    password: '密码',
    addTodo: '添加待办...',
    add: '添加',
    search: '搜索...',
    clear: '清除',
    all: '全部',
    categories: '分类',
    addCategory: '添加分类',
    export: '导出',
    import: '导入',
    stats: '统计',
    share: '分享',
    joinShare: '加入分享',
    createShare: '创建分享',
    exitShare: '退出',
    notifications: '通知',
    notificationsOn: '通知开',
    notificationsOff: '通知关',
    total: '总计',
    completed: '已完成',
    pending: '进行中',
    overdue: '已过期',
    dueToday: '今天到期',
    dueThisWeek: '本周到期',
    byPriority: '按优先级',
    urgent: '紧急',
    important: '重要',
    normal: '一般',
    delete: '删除',
    cancel: '取消',
    confirm: '确认',
    setDate: '设置截止日期',
    changeDate: '修改日期',
    deleteDate: '删除日期',
    dateFormat: '格式: 2024-12-31',
    skip: '跳过',
    enterCode: '输入分享码',
    shareCode: '分享码',
    copyLink: '复制链接',
    shareLinkCopied: '链接已复制',
    sharedMode: '分享模式',
    readOnly: '只读模式',
    emailRegistered: '该邮箱已注册',
    emailPasswordError: '邮箱或密码错误',
    pleaseInput: '请输入',
    addSuccess: '添加成功',
    deleteSuccess: '删除成功',
    setDateSuccess: '已设置日期',
    dateDeleted: '已删除日期',
    exportSuccess: '已导出',
    importSuccess: '成功导入',
    shareCreated: '分享已创建',
    joinedShare: '已加入分享',
    exitedShare: '已退出分享',
    shareFailed: '分享失败',
    shareNotExist: '分享不存在',
    shareCodeInvalid: '分享码无效',
    shareReadOnly: '分享模式只读',
    notificationsEnabled: '已开启通知',
    notificationsDisabled: '已关闭通知',
    notificationsDenied: '通知权限被拒绝',
    browserNotSupport: '您的浏览器不支持通知',
    noTodos: '暂无待办',
    noResults: '未找到匹配的待办',
    dangerOperation: '危险操作',
    inputDelete: '输入"删除"确认清空',
    cancelled: '已取消',
    clearedAll: '已清空所有数据',
    clearFailed: '清空失败',
    exportFailed: '导出失败',
    importFailed: '导入失败',
    fileFormatError: '文件格式不正确',
    overwrite: '覆盖现有数据',
    append: '追加到现有数据',
    overdueTask: '已过期',
    dueTodayTask: '今天',
    addDate: '加日期',
    categoryName: '输入分类名称',
    selectIcon: '选择图标',
    selectColor: '选择颜色',
    noTodosYet: '暂无待办',
    statsOverview: '统计概览',
    timeReminder: '时间提醒',
    byCategory: '按分类',
    enterShareCode: '输入分享码:',
    shareUrl: '分享链接',
    language: '语言',
    chinese: '中文',
    english: 'English'
  },
  en: {
    appName: 'Todo App',
    version: 'i18n',
    welcome: 'Welcome',
    guest: 'Guest',
    logout: 'Logout',
    login: 'Login',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    addTodo: 'Add todo...',
    add: 'Add',
    search: 'Search...',
    clear: 'Clear',
    all: 'All',
    categories: 'Categories',
    addCategory: 'Add Category',
    export: 'Export',
    import: 'Import',
    stats: 'Stats',
    share: 'Share',
    joinShare: 'Join Share',
    createShare: 'Create Share',
    exitShare: 'Exit',
    notifications: 'Notifications',
    notificationsOn: 'Notif On',
    notificationsOff: 'Notif Off',
    total: 'Total',
    completed: 'Completed',
    pending: 'Pending',
    overdue: 'Overdue',
    dueToday: 'Due Today',
    dueThisWeek: 'Due This Week',
    byPriority: 'By Priority',
    urgent: 'Urgent',
    important: 'Important',
    normal: 'Normal',
    delete: 'Delete',
    cancel: 'Cancel',
    confirm: 'Confirm',
    setDate: 'Set due date',
    changeDate: 'Change date',
    deleteDate: 'Delete date',
    dateFormat: 'Format: 2024-12-31',
    skip: 'Skip',
    enterCode: 'Enter share code',
    shareCode: 'Share Code',
    copyLink: 'Copy Link',
    shareLinkCopied: 'Link copied',
    sharedMode: 'Share Mode',
    readOnly: 'Read Only',
    emailRegistered: 'Email already registered',
    emailPasswordError: 'Email or password error',
    pleaseInput: 'Please input',
    addSuccess: 'Added successfully',
    deleteSuccess: 'Deleted successfully',
    setDateSuccess: 'Date set',
    dateDeleted: 'Date deleted',
    exportSuccess: 'Exported',
    importSuccess: 'Imported',
    shareCreated: 'Share created',
    joinedShare: 'Joined share',
    exitedShare: 'Exited share',
    shareFailed: 'Share failed',
    shareNotExist: 'Share does not exist',
    shareCodeInvalid: 'Invalid share code',
    shareReadOnly: 'Share mode is read-only',
    notificationsEnabled: 'Notifications enabled',
    notificationsDisabled: 'Notifications disabled',
    notificationsDenied: 'Notification permission denied',
    browserNotSupport: 'Browser does not support notifications',
    noTodos: 'No todos yet',
    noResults: 'No matching todos',
    dangerOperation: 'Danger!',
    inputDelete: 'Type "delete" to confirm',
    cancelled: 'Cancelled',
    clearedAll: 'All data cleared',
    clearFailed: 'Clear failed',
    exportFailed: 'Export failed',
    importFailed: 'Import failed',
    fileFormatError: 'Invalid file format',
    overwrite: 'Overwrite existing data',
    append: 'Append to existing data',
    overdueTask: 'Overdue',
    dueTodayTask: 'Today',
    addDate: 'Add date',
    categoryName: 'Enter category name',
    selectIcon: 'Select icon',
    selectColor: 'Select color',
    noTodosYet: 'No todos yet',
    statsOverview: 'Statistics',
    timeReminder: 'Time Reminder',
    byCategory: 'By Category',
    enterShareCode: 'Enter share code:',
    shareUrl: 'Share URL',
    language: 'Language',
    chinese: '中文',
    english: 'English'
  }
};

let currentLang = localStorage.getItem('todo_lang') || 'zh';

function t(key) {
  return translations[currentLang][key] || translations['zh'][key] || key;
}

function toggleLanguage() {
  currentLang = currentLang === 'zh' ? 'en' : 'zh';
  localStorage.setItem('todo_lang', currentLang);
  showApp();
  showMessage(currentLang === 'zh' ? '已切换到中文' : 'Switched to English', 'success');
}

// ==================== 用户状态 ====================

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
let notificationsEnabled = localStorage.getItem('todo_notifications') === 'true';

// ==================== 优先级 ====================

const PRIORITIES = [
  { id: 'high', name: t('urgent'), icon: '🔴', color: '#e74c3c', bgColor: '#fdeaea' },
  { id: 'medium', name: t('important'), icon: '🟡', color: '#f39c12', bgColor: '#fef9e7' },
  { id: 'low', name: t('normal'), icon: '🟢', color: '#27ae60', bgColor: '#eafaf1' }
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

// ==================== 通知系统 ====================

async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    showMessage(t('browserNotSupport'), 'error');
    return false;
  }
  if (Notification.permission === 'granted') {
    return true;
  }
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      notificationsEnabled = true;
      localStorage.setItem('todo_notifications', 'true');
      showMessage(t('notificationsEnabled'), 'success');
      updateNotificationUI();
      return true;
    }
  }
  showMessage(t('notificationsDenied'), 'error');
  return false;
}

function toggleNotifications() {
  if (notificationsEnabled) {
    notificationsEnabled = false;
    localStorage.setItem('todo_notifications', 'false');
    showMessage(t('notificationsDisabled'), 'success');
  } else {
    requestNotificationPermission();
  }
  updateNotificationUI();
}

function updateNotificationUI() {
  const btn = document.getElementById('notificationBtn');
  if (btn) {
    btn.innerHTML = notificationsEnabled ? '🔔 ' + t('notificationsOn') : '🔕 ' + t('notificationsOff');
    btn.className = 'notification-btn ' + (notificationsEnabled ? 'enabled' : 'disabled');
  }
}

function sendNotification(title, body, icon = '📋') {
  if (!notificationsEnabled || Notification.permission !== 'granted') return;
  try {
    const notification = new Notification(title, { body, icon, tag: 'todo-app' });
    notification.onclick = () => { window.focus(); notification.close(); };
    setTimeout(() => notification.close(), 5000);
  } catch (e) { console.log('Notification error:', e); }
}

async function checkDueNotifications() {
  if (!authToken || !notificationsEnabled) return;
  const now = new Date().toISOString().split('T')[0];
  const todos = await fetchTodosRaw();
  const overdue = todos.filter(t => t.dueDate && !t.completed && t.dueDate < now);
  const dueToday = todos.filter(t => t.dueDate && !t.completed && t.dueDate === now);
  const lastCheck = localStorage.getItem('todo_last_notification_check') || '';
  const today = new Date().toDateString();
  if (lastCheck !== today) {
    if (overdue.length > 0) sendNotification('⚠️ ' + t('overdue'), `${overdue.length} ${t('overdue')}`, '🔴');
    if (dueToday.length > 0) sendNotification('📅 ' + t('dueToday'), `${dueToday.length} ${t('dueToday')}`, '🟡');
    localStorage.setItem('todo_last_notification_check', today);
  }
}

// ==================== 用户系统 ====================

async function register(email, password) {
  try {
    const checkResponse = await fetch(`${DATABASE_URL}/users.json`);
    const usersData = await checkResponse.json();
    if (usersData) {
      const existingUser = Object.values(usersData).find(u => u.email === email);
      if (existingUser) throw new Error(t('emailRegistered'));
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
    if (!foundUser) throw new Error(t('emailPasswordError'));
    currentUser = { id: foundUserId, email: foundUser.email };
    authToken = foundUserId;
    userEmail = email;
    localStorage.setItem('todo_auth_token', authToken);
    localStorage.setItem('todo_user_email', email);
    isSharedMode = false;
    currentShareCode = null;
    localStorage.removeItem('todo_share_code');
    showApp();
    showMessage(`${t('welcome')}，${email}！`, 'success');
    checkDueNotifications();
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
  showMessage(t('logout'), 'success');
}

// ==================== 路径 ====================

function getUserPath() { 
  if (isSharedMode && currentShareCode) return `shared_${currentShareCode}`;
  return authToken ? `todos_${authToken}` : null; 
}

function getCategoriesPath() { 
  if (isSharedMode && currentShareCode) return `shared_cat_${currentShareCode}`;
  return authToken ? `categories_${authToken}` : null; 
}

// ==================== 分享系统 ====================

async function createShare() {
  if (!authToken) { showMessage(t('pleaseInput') + t('login'), 'error'); return; }
  try {
    const shareCode = generateShareCode();
    await fetch(`${DATABASE_URL}/shared_${shareCode}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ todos: [], created: new Date().toISOString(), owner: authToken })
    });
    const cats = await fetchCategories();
    for (const cat of cats) {
      await fetch(`${DATABASE_URL}/shared_cat_${shareCode}/${cat.id}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cat)
      });
    }
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
    const shareUrl = `https://danieldeng978.github.io/my-todo-app/?share=${shareCode}&lang=${currentLang}`;
    if (confirm(`${t('shareCode')}: ${shareCode}\n\nURL: ${shareUrl}\n\n${t('copyLink')}?`)) {
      navigator.clipboard.writeText(shareUrl);
      showMessage(t('shareLinkCopied'), 'success');
    }
    showApp();
  } catch (error) {
    showMessage(t('shareFailed'), 'error');
  }
}

async function joinShare() {
  const shareCode = prompt(t('enterShareCode'));
  if (!shareCode || !shareCode.trim()) return;
  const code = shareCode.trim().toUpperCase();
  try {
    const response = await fetch(`${DATABASE_URL}/shared_${code}.json`);
    if (!response.ok) throw new Error(t('shareNotExist'));
    currentShareCode = code;
    isSharedMode = true;
    localStorage.setItem('todo_share_code', code);
    showMessage(t('joinedShare'), 'success');
    showApp();
  } catch (error) {
    showMessage(t('shareCodeInvalid'), 'error');
  }
}

function exitShare() {
  isSharedMode = false;
  currentShareCode = null;
  localStorage.removeItem('todo_share_code');
  showMessage(t('exitedShare'), 'success');
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
  if (!title) { showMessage(t('pleaseInput') + t('addTodo').replace('...', ''), 'error'); return; }
  if (!authToken && !isSharedMode) { showMessage(t('pleaseInput') + t('login'), 'error'); return; }
  
  const dueDate = prompt(`${t('setDate')} (${t('dateFormat')})\n${t('skip')}:`, '');
  
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
    
    showMessage(t('addSuccess'), 'success');
    todoInput.value = '';
    fetchTodos();
  } catch (error) {
    showMessage(error.message, 'error');
  }
}

async function toggleTodo(id) {
  try {
    let url = `${DATABASE_URL}/${getUserPath()}`;
    if (isSharedMode) url += `/todos/${id}`;
    else url += `/${id}`;
    
    const getResponse = await fetch(url + '.json');
    const todo = await getResponse.json();
    
    if (!todo.completed && notificationsEnabled) {
      sendNotification('✅ ' + t('completed'), `"${todo.title.slice(0, 20)}..." ${t('completed')}`, '🎉');
    }
    
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
  if (isSharedMode) { showMessage(t('shareReadOnly'), 'error'); return; }
  try {
    await fetch(`${DATABASE_URL}/${getUserPath()}/${id}.json`, { method: 'DELETE' });
    showMessage(t('deleteSuccess'), 'success');
    fetchTodos();
  } catch (error) {
    showMessage(error.message, 'error');
  }
}

async function setDueDate(id, currentDate) {
  const newDate = prompt(`${t('changeDate')} (${t('dateFormat')})\n${t('deleteDate')}:`, currentDate || '');
  try {
    let url = `${DATABASE_URL}/${getUserPath()}`;
    if (isSharedMode) url += `/todos/${id}`;
    else url += `/${id}`;
    
    if (newDate === '') {
      await fetch(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ dueDate: null }) });
      showMessage(t('dateDeleted'), 'success');
    } else if (newDate) {
      await fetch(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ dueDate: newDate }) });
      showMessage(t('setDateSuccess'), 'success');
      const today = new Date().toISOString().split('T')[0];
      if (newDate === today && notificationsEnabled) {
        sendNotification('📅 ' + t('dueToday'), `${t('dueToday')}: ${newDate}`, '🟡');
      }
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
  if (showStats) renderStats();
  else hideStats();
}

async function renderStats() {
  const existing = document.querySelector('.stats-dashboard');
  if (existing) existing.remove();
  const stats = await getStats();
  const dashboard = document.createElement('div');
  dashboard.className = 'stats-dashboard';
  dashboard.innerHTML = `
    <div class="stats-header">
      <h3>📊 ${t('statsOverview')}</h3>
      <button onclick="toggleStats()" class="close-stats">×</button>
    </div>
    <div class="stats-grid">
      <div class="stat-card total"><div class="stat-number">${stats.total}</div><div class="stat-label">${t('total')}</div></div>
      <div class="stat-card completed"><div class="stat-number">${stats.completed}</div><div class="stat-label">${t('completed')}</div></div>
      <div class="stat-card pending"><div class="stat-number">${stats.pending}</div><div class="stat-label">${t('pending')}</div></div>
      <div class="stat-card overdue"><div class="stat-number">${stats.overdue}</div><div class="stat-label">${t('overdue')}</div></div>
    </div>
    <div class="stats-section">
      <h4>🔴 ${t('byPriority')}</h4>
      <div class="priority-bars">
        <div class="bar-row"><span class="bar-label">🔴 ${t('urgent')}</span><div class="bar-bg"><div class="bar-fill high" style="width:${stats.total ? (stats.byPriority.high / stats.total * 100) : 0}%"></div></div><span class="bar-count">${stats.byPriority.high}</span></div>
        <div class="bar-row"><span class="bar-label">🟡 ${t('important')}</span><div class="bar-bg"><div class="bar-fill medium" style="width:${stats.total ? (stats.byPriority.medium / stats.total * 100) : 0}%"></div></div><span class="bar-count">${stats.byPriority.medium}</span></div>
        <div class="bar-row"><span class="bar-label">🟢 ${t('normal')}</span><div class="bar-bg"><div class="bar-fill low" style="width:${stats.total ? (stats.byPriority.low / stats.total * 100) : 0}%"></div></div><span class="bar-count">${stats.byPriority.low}</span></div>
      </div>
    </div>
    <div class="stats-section">
      <h4>📅 ${t('timeReminder')}</h4>
      <div class="time-alerts">
        <div class="alert-item overdue"><span>🔴 ${t('overdue')}</span><strong>${stats.overdue}</strong></div>
        <div class="alert-item today"><span>🟡 ${t('dueToday')}</span><strong>${stats.dueToday}</strong></div>
        <div class="alert-item week"><span>📆 ${t('dueThisWeek')}</span><strong>${stats.dueThisWeek}</strong></div>
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
      version: 'V10',
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
    showMessage(`${t('exportSuccess')} ${todos.length} ${t('total')}`, 'success');
  } catch (error) {
    showMessage(t('exportFailed'), 'error');
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
      if (!data.todos || !Array.isArray(data.todos)) throw new Error(t('fileFormatError'));
      const overwrite = confirm(`Import ${data.todos.length} todos\n\nOK=${t('overwrite')}, Cancel=${t('append')}`);
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
      showMessage(`${t('importSuccess')} ${imported} ${t('total')}`, 'success');
      loadCategories();
      fetchTodos();
    } catch (error) {
      showMessage(t('importFailed') + ': ' + error.message, 'error');
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
    info.innerHTML = `🔍 ${t('search')}: <strong>"${escapeHtml(searchQuery)}"</strong> <button onclick="clearSearch()">${t('clear')}</button>`;
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
    todoList.innerHTML = `<li class="empty-state"><span>📋</span><p>${searchQuery ? t('noResults') : t('noTodosYet')}</p></li>`;
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
        overdueText = '🔴 ' + t('overdueTask');
      } else if (todo.dueDate === today) {
        overdueText = '🟡 ' + t('dueTodayTask');
      }
    }
    
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''} ${overdueClass}`;
    li.style.borderLeft = `4px solid ${priority.color}`;
    
    li.innerHTML = `
      <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleTodo('${todo.id}')">
      <span class="todo-text">${highlightMatch(escapeHtml(todo.title), searchQuery)}</span>
      ${todo.dueDate ? `<span class="todo-date" onclick="setDueDate('${todo.id}', '${todo.dueDate}')">📅 ${todo.dueDate} ${overdueText}</span>` : `<span class="todo-date add-date" onclick="setDueDate('${todo.id}')">➕ ${t('addDate')}</span>`}
      <span class="todo-priority" style="background:${priority.bgColor};color:${priority.color}">${priority.icon} ${priority.name}</span>
      ${cat ? `<span class="todo-category" style="background:${cat.color}20;color:${cat.color}">${cat.icon} ${cat.name}</span>` : ''}
      ${!isSharedMode ? `<button class="delete-btn" onclick="deleteTodo('${todo.id}')">${t('delete')}</button>` : ''}
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
  tabs.innerHTML = `<div class="category-tab ${currentCategory === 'all' ? 'active' : ''}" onclick="switchCategory('all')">📋 ${t('all')}</div>`;
  
  categories.forEach(cat => {
    tabs.innerHTML += `<div class="category-tab ${currentCategory === cat.id ? 'active' : ''}" onclick="switchCategory('${cat.id}')" style="${currentCategory === cat.id ? `background:${cat.color}20;border-color:${cat.color}` : ''}">${cat.icon} ${cat.name}${!isSharedMode ? `<span class="delete-cat" onclick="event.stopPropagation(); deleteCategory('${cat.id}')">×</span>` : ''}</div>`;
  });
  
  if (!isSharedMode) {
    tabs.innerHTML += `<div class="category-tab add-cat" onclick="showAddCategory()">➕ ${t('addCategory')}</div>`;
  }
  document.querySelector('.input-section').before(tabs);
}

function renderPriorityTabs() {
  const existing = document.querySelector('.priority-tabs');
  if (existing) existing.remove();
  
  const tabs = document.createElement('div');
  tabs.className = 'priority-tabs';
  tabs.innerHTML = `<div class="priority-tab ${currentPriority === 'all' ? 'active' : ''}" onclick="switchPriority('all')">🎯 ${t('all')}</div>`;
  
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
  const name = prompt(t('categoryName') + ':');
  if (name && name.trim()) {
    const icons = ['💼', '🏠', '📚', '🎯', '💪', '🎮', '🎵', '🍔'];
    const icon = prompt(`${t('selectIcon')}(1-8):\n${icons.map((ic, i) => `${i+1}. ${ic}`).join('\n')}:`, '1');
    const colors = ['#e74c3c', '#3498db', '#27ae60', '#f39c12', '#9b59b6', '#1abc9c'];
    const color = prompt(`${t('selectColor')}(1-6):\n${colors.map((c, i) => `${i+1}. ${c}`).join('\n')}:`, '1');
    addCategory(name.trim(), icons[parseInt(icon) - 1] || '📁', colors[parseInt(color) - 1] || '#667eea');
  }
}

function showLogin() {
  document.querySelector('header').innerHTML = `
    <h1>📝 ${t('appName')}</h1>
    <p>🌍 ${t('version')}</p>
    <div class="lang-toggle">
      <button onclick="toggleLanguage()" class="lang-btn">${currentLang === 'zh' ? '🇨🇳 中文' : '🇺🇸 English'}</button>
    </div>
    <div class="auth-form">
      <input type="email" id="authEmail" placeholder="${t('email')}">
      <input type="password" id="authPassword" placeholder="${t('password')}">
      <div class="auth-buttons">
        <button onclick="handleAuth('login')">${t('login')}</button>
        <button onclick="handleAuth('register')" class="secondary">${t('register')}</button>
      </div>
    </div>
  `;
  todoList.innerHTML = '';
  totalCount.textContent = '0';
  completedCount.textContent = '0';
  pendingCount.textContent = '0';
}

function showApp() {
  // Update priorities with translations
  PRIORITIES[0].name = t('urgent');
  PRIORITIES[1].name = t('important');
  PRIORITIES[2].name = t('normal');
  
  const searchHTML = `<div class="search-box"><input type="text" id="searchInput" placeholder="🔍 ${t('search')}" oninput="performSearch(this.value)"></div>`;
  
  let shareHTML = '';
  if (isSharedMode) {
    shareHTML = `
      <div class="share-mode-banner">
        <span>🤝 ${t('sharedMode')}: ${currentShareCode}</span>
        <button onclick="exitShare()" class="exit-share-btn">${t('exitShare')}</button>
      </div>
    `;
  } else if (authToken) {
    shareHTML = `
      <div class="share-bar">
        <button onclick="createShare()" class="share-btn">🔗 ${t('createShare')}</button>
        <button onclick="joinShare()" class="join-btn">🤝 ${t('joinShare')}</button>
      </div>
    `;
  }
  
  const exportHTML = !isSharedMode ? `
    <div class="export-import-bar">
      <button onclick="exportData()" class="export-btn">📤 ${t('export')}</button>
      <button onclick="importData()" class="import-btn">📥 ${t('import')}</button>
      <button onclick="toggleStats()" class="stats-btn">📊 ${t('stats')}</button>
      <button onclick="toggleNotifications()" id="notificationBtn" class="notification-btn ${notificationsEnabled ? 'enabled' : 'disabled'}">${notificationsEnabled ? '🔔 ' + t('notificationsOn') : '🔕 ' + t('notificationsOff')}</button>
    </div>
  ` : `
    <div class="export-import-bar">
      <button onclick="toggleStats()" class="stats-btn">📊 ${t('stats')}</button>
    </div>
  `;
  
  document.querySelector('header').innerHTML = `
    <div class="header-top">
      <div>
        <h1>📝 ${t('appName')}</h1>
        <p>${t('welcome')}，${userEmail || t('guest')}</p>
      </div>
      <div class="header-actions">
        <button onclick="toggleLanguage()" class="lang-btn-sm">🌍 ${currentLang === 'zh' ? '中文' : 'EN'}</button>
        ${authToken && !isSharedMode ? `<button onclick="logout()" class="logout-btn">${t('logout')}</button>` : ''}
      </div>
    </div>
    <p style="font-size: 12px; color: #888; margin-top: 5px;">🌍 V10: ${t('version')}</p>
    ${shareHTML}
    ${searchHTML}
    ${exportHTML}
  `;
  loadCategories();
}

async function handleAuth(action) {
  const email = document.getElementById('authEmail').value.trim();
  const password = document.getElementById('authPassword').value;
  if (!email || !password) { showMessage(t('pleaseInput') + t('email') + ' ' + t('password'), 'error'); return; }
  if (action === 'login') await login(email, password);
  else await register(email, password);
}

// ==================== 初始化 ====================

async function init() {
  const urlParams = new URLSearchParams(window.location.search);
  const shareCode = urlParams.get('share');
  const langParam = urlParams.get('lang');
  
  if (langParam && (langParam === 'zh' || langParam === 'en')) {
    currentLang = langParam;
    localStorage.setItem('todo_lang', currentLang);
  }
  
  if (shareCode) {
    currentShareCode = shareCode.toUpperCase();
    isSharedMode = true;
    localStorage.setItem('todo_share_code', currentShareCode);
    showMessage(t('joinedShare'), 'success');
  }
  
  if (authToken && userEmail) {
    currentUser = { id: authToken, email: userEmail };
    showApp();
  } else if (currentShareCode) {
    showApp();
  } else {
    showLogin();
  }
  
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && authToken) {
      checkDueNotifications();
    }
  });
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
window.toggleNotifications = toggleNotifications;
window.toggleLanguage = toggleLanguage;
window.createShare = createShare;
window.joinShare = joinShare;
window.exitShare = exitShare;
