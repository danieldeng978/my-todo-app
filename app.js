// public/app.js - Todo App V11 + Voice Robot
// 添加语音机器人功能

const DATABASE_URL = 'https://first-ad067-default-rtdb.asia-southeast1.firebasedatabase.app';

// ==================== 国际化 ====================

const translations = {
  zh: {
    appName: 'Todo App', version: '语音版', welcome: '欢迎', guest: '访客', logout: '退出登录',
    login: '登录', register: '注册', email: '邮箱', password: '密码', addTodo: '添加待办...', add: '添加',
    search: '搜索...', clear: '清除', all: '全部', categories: '分类', addCategory: '添加分类',
    export: '导出', import: '导入', stats: '统计', share: '分享', joinShare: '加入分享',
    createShare: '创建分享', exitShare: '退出', notifications: '通知', notificationsOn: '通知开',
    notificationsOff: '通知关', total: '总计', completed: '已完成', pending: '进行中',
    overdue: '已过期', dueToday: '今天到期', dueThisWeek: '本周到期', byPriority: '按优先级',
    urgent: '紧急', important: '重要', normal: '一般', delete: '删除', cancel: '取消', confirm: '确认',
    setDate: '设置截止日期', changeDate: '修改日期', deleteDate: '删除日期', dateFormat: '格式: 2024-12-31',
    skip: '跳过', enterCode: '输入分享码', shareCode: '分享码', copyLink: '复制链接',
    shareLinkCopied: '链接已复制', sharedMode: '分享模式', readOnly: '只读模式',
    emailRegistered: '该邮箱已注册', emailPasswordError: '邮箱或密码错误', pleaseInput: '请输入',
    addSuccess: '添加成功', deleteSuccess: '删除成功', setDateSuccess: '已设置日期', dateDeleted: '已删除日期',
    exportSuccess: '已导出', importSuccess: '成功导入', shareCreated: '分享已创建', joinedShare: '已加入分享',
    exitedShare: '已退出分享', shareFailed: '分享失败', shareNotExist: '分享不存在',
    shareCodeInvalid: '分享码无效', shareReadOnly: '分享模式只读', notificationsEnabled: '已开启通知',
    notificationsDisabled: '已关闭通知', notificationsDenied: '通知权限被拒绝',
    browserNotSupport: '您的浏览器不支持通知', noTodos: '暂无待办', noResults: '未找到匹配的待办',
    dangerOperation: '危险操作', inputDelete: '输入"删除"确认清空', cancelled: '已取消',
    clearedAll: '已清空所有数据', clearFailed: '清空失败', exportFailed: '导出失败',
    importFailed: '导入失败', fileFormatError: '文件格式不正确', overwrite: '覆盖现有数据',
    append: '追加到现有数据', overdueTask: '已过期', dueTodayTask: '今天', addDate: '加日期',
    categoryName: '输入分类名称', selectIcon: '选择图标', selectColor: '选择颜色',
    noTodosYet: '暂无待办', statsOverview: '统计概览', timeReminder: '时间提醒', byCategory: '按分类',
    enterShareCode: '输入分享码:', shareUrl: '分享链接', language: '语言', chinese: '中文', english: 'English',
    darkMode: '深色模式', lightMode: '浅色模式', recurring: '重复', daily: '每天', weekly: '每周',
    monthly: '每月', none: '不重复', subtasks: '子任务', addSubtask: '添加子任务', subtaskPlaceholder: '输入子任务...',
    shortcuts: '快捷键', pressShortcut: '按 {key} 快速操作', keyboardShortcuts: '键盘快捷键',
    voiceRobot: '语音助手', voiceListening: '正在听...', voiceHint: '点击说话', voiceNotSupported: '语音不支持',
    voicePermission: '请允许麦克风权限', voiceError: '语音识别错误', voiceTimeout: '没有听到声音',
    voiceAdded: '已添加待办', voiceShowed: '这是你的待办', voiceEmpty: '暂无待办', voiceCompleted: '已完成',
    voicePending: '进行中', voiceHelp: '可以说"添加待办吃饭"或"显示我的待办"'
  },
  en: {
    appName: 'Todo App', version: 'Voice Version', welcome: 'Welcome', guest: 'Guest', logout: 'Logout',
    login: 'Login', register: 'Register', email: 'Email', password: 'Password', addTodo: 'Add todo...', add: 'Add',
    search: 'Search...', clear: 'Clear', all: 'All', categories: 'Categories', addCategory: 'Add Category',
    export: 'Export', import: 'Import', stats: 'Stats', share: 'Share', joinShare: 'Join Share',
    createShare: 'Create Share', exitShare: 'Exit', notifications: 'Notifications', notificationsOn: 'Notif On',
    notificationsOff: 'Notif Off', total: 'Total', completed: 'Completed', pending: 'Pending',
    overdue: 'Overdue', dueToday: 'Due Today', dueThisWeek: 'Due This Week', byPriority: 'By Priority',
    urgent: 'Urgent', important: 'Important', normal: 'Normal', delete: 'Delete', cancel: 'Cancel', confirm: 'Confirm',
    setDate: 'Set due date', changeDate: 'Change date', deleteDate: 'Delete date', dateFormat: 'Format: 2024-12-31',
    skip: 'Skip', enterCode: 'Enter share code', shareCode: 'Share Code', copyLink: 'Copy Link',
    shareLinkCopied: 'Link copied', sharedMode: 'Share Mode', readOnly: 'Read Only',
    emailRegistered: 'Email already registered', emailPasswordError: 'Email or password error', pleaseInput: 'Please input',
    addSuccess: 'Added successfully', deleteSuccess: 'Deleted successfully', setDateSuccess: 'Date set', dateDeleted: 'Date deleted',
    exportSuccess: 'Exported', importSuccess: 'Imported', shareCreated: 'Share created', joinedShare: 'Joined share',
    exitedShare: 'Exited share', shareFailed: 'Share failed', shareNotExist: 'Share does not exist',
    shareCodeInvalid: 'Invalid share code', shareReadOnly: 'Share mode is read-only', notificationsEnabled: 'Notifications enabled',
    notificationsDisabled: 'Notifications disabled', notificationsDenied: 'Notification permission denied',
    browserNotSupport: 'Browser does not support notifications', noTodos: 'No todos yet', noResults: 'No matching todos',
    dangerOperation: 'Danger!', inputDelete: 'Type "delete" to confirm', cancelled: 'Cancelled',
    clearedAll: 'All data cleared', clearFailed: 'Clear failed', exportFailed: 'Export failed',
    importFailed: 'Import failed', fileFormatError: 'Invalid file format', overwrite: 'Overwrite existing data',
    append: 'Append to existing data', overdueTask: 'Overdue', dueTodayTask: 'Today', addDate: 'Add date',
    categoryName: 'Enter category name', selectIcon: 'Select icon', selectColor: 'Select color',
    noTodosYet: 'No todos yet', statsOverview: 'Statistics', timeReminder: 'Time Reminder', byCategory: 'By Category',
    enterShareCode: 'Enter share code:', shareUrl: 'Share URL', language: 'Language', chinese: '中文', english: 'English',
    darkMode: 'Dark Mode', lightMode: 'Light Mode', recurring: 'Recurring', daily: 'Daily', weekly: 'Weekly',
    monthly: 'Monthly', none: 'No Repeat', subtasks: 'Subtasks', addSubtask: 'Add Subtask', subtaskPlaceholder: 'Enter subtask...',
    shortcuts: 'Shortcuts', pressShortcut: 'Press {key} for quick action', keyboardShortcuts: 'Keyboard Shortcuts',
    voiceRobot: 'Voice Assistant', voiceListening: 'Listening...', voiceHint: 'Tap to speak', voiceNotSupported: 'Voice not supported',
    voicePermission: 'Please allow microphone', voiceError: 'Voice recognition error', voiceTimeout: 'No voice detected',
    voiceAdded: 'Todo added', voiceShowed: 'Here are your todos', voiceEmpty: 'No todos yet', voiceCompleted: 'completed',
    voicePending: 'pending', voiceHelp: 'Say "add todo eat" or "show my todos"'
  }
};

let currentLang = localStorage.getItem('todo_lang') || 'zh';
let isDarkMode = localStorage.getItem('todo_dark_mode') === 'true';

function t(key) {
  return translations[currentLang][key] || translations['zh'][key] || key;
}

function toggleLanguage() {
  currentLang = currentLang === 'zh' ? 'en' : 'zh';
  localStorage.setItem('todo_lang', currentLang);
  showApp();
  showMessage(currentLang === 'zh' ? '已切换到中文' : 'Switched to English', 'success');
}

function toggleDarkMode() {
  isDarkMode = !isDarkMode;
  localStorage.setItem('todo_dark_mode', isDarkMode);
  applyDarkMode();
  showMessage(isDarkMode ? t('darkMode') : t('lightMode'), 'success');
}

function applyDarkMode() {
  if (isDarkMode) document.body.classList.add('dark');
  else document.body.classList.remove('dark');
}

// ==================== 语音机器人系统 ====================

let voiceRecognition = null;
let voiceSynthesis = window.speechSynthesis;
let isListening = false;
let voiceRobotExpanded = false;

function isVoiceSupported() {
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
}

function initVoiceRecognition() {
  if (!isVoiceSupported()) return;
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  voiceRecognition = new SpeechRecognition();
  voiceRecognition.continuous = false;
  voiceRecognition.interimResults = false;
  voiceRecognition.lang = currentLang === 'zh' ? 'zh-CN' : 'en-US';
  
  voiceRecognition.onstart = () => {
    isListening = true;
    updateVoiceButton();
    showVoiceStatus(t('voiceListening'), 'listening');
  };
  
  voiceRecognition.onend = () => {
    isListening = false;
    updateVoiceButton();
    hideVoiceStatus();
    const overlay = document.getElementById('voiceOverlay');
    if (overlay) overlay.style.display = 'none';
  };
  
  voiceRecognition.onerror = (event) => {
    isListening = false;
    updateVoiceButton();
    hideVoiceStatus();
    const overlay = document.getElementById('voiceOverlay');
    if (overlay) overlay.style.display = 'none';
    if (event.error === 'not-allowed') showMessage(t('voicePermission'), 'error');
    else showMessage(t('voiceError'), 'error');
  };
  
  voiceRecognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase().trim();
    processVoiceCommand(transcript);
  };
}

function startListening() {
  if (!isVoiceSupported()) { showMessage(t('voiceNotSupported'), 'error'); return; }
  if (isListening) { voiceRecognition.stop(); return; }
  voiceRecognition.lang = currentLang === 'zh' ? 'zh-CN' : 'en-US';
  voiceRecognition.start();
  const overlay = document.getElementById('voiceOverlay');
  const btn = document.getElementById('voiceBtn');
  if (overlay) overlay.style.display = 'flex';
  if (btn) { btn.innerHTML = '🔴'; btn.classList.add('listening'); }
}

function updateVoiceButton() {
  const btn = document.getElementById('voiceBtn');
  const overlay = document.getElementById('voiceOverlay');
  if (btn) {
    if (isListening) { btn.innerHTML = '🔴'; btn.classList.add('listening'); }
    else { btn.innerHTML = '🤖'; btn.classList.remove('listening'); }
  }
  if (overlay && !isListening) overlay.style.display = 'none';
}

function showVoiceStatus(text, type, autoHide = true) {
  const existing = document.querySelector('.voice-status');
  if (existing) existing.remove();
  const status = document.createElement('div');
  status.className = `voice-status ${type}`;
  status.innerHTML = `<span class="voice-wave">🔊</span><span>${text}</span>`;
  const robot = document.querySelector('.voice-robot');
  if (robot) robot.appendChild(status);
  if (autoHide) setTimeout(() => { const el = document.querySelector('.voice-status'); if (el) el.remove(); }, 1500);
}

function hideVoiceStatus() {
  const existing = document.querySelector('.voice-status');
  if (existing) setTimeout(() => existing.remove(), 1500);
}

function speak(text) {
  if (!voiceSynthesis) return;
  voiceSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = currentLang === 'zh' ? 'zh-CN' : 'en-US';
  utterance.rate = 1;
  utterance.pitch = 1;
  const voices = voiceSynthesis.getVoices();
  const targetLang = currentLang === 'zh' ? 'zh' : 'en';
  const foundVoice = voices.find(v => v.lang.startsWith(targetLang));
  if (foundVoice) utterance.voice = foundVoice;
  voiceSynthesis.speak(utterance);
}

async function processVoiceCommand(transcript) {
  const zhAdd = ['添加', '加', '新建', '创建'];
  const enAdd = ['add', 'create', 'new', 'todo'];
  const zhShow = ['显示', '查看', '我的待办', '有什么'];
  const enShow = ['show', 'list', 'my todos', 'what'];
  
  let added = false;
  for (const p of zhAdd) {
    if (transcript.includes(p)) {
      const title = transcript.split(p).pop().trim();
      if (title) { await addTodoByVoice(title); added = true; break; }
    }
  }
  if (!added) {
    for (const p of enAdd) {
      if (transcript.includes(p)) {
        const parts = transcript.split(p);
        const title = parts[parts.length - 1].trim();
        if (title && title.length > 1) { await addTodoByVoice(title); added = true; break; }
      }
    }
  }
  if (added) return;
  
  let showed = false;
  for (const p of zhShow) {
    if (transcript.includes(p)) { await showTodosByVoice(); showed = true; break; }
  }
  if (!showed) {
    for (const p of enShow) {
      if (transcript.includes(p)) { await showTodosByVoice(); showed = true; break; }
    }
  }
  if (showed) return;
  
  if (transcript.includes('帮助') || transcript.includes('help')) {
    speak(t('voiceHelp'));
    showVoiceStatus(t('voiceHelp'), 'info');
  }
}

async function addTodoByVoice(title) {
  if (!authToken) { speak(currentLang === 'zh' ? '请先登录' : 'Please login first'); return; }
  try {
    const newTodo = {
      title, completed: false, created_at: new Date().toISOString(),
      category: null, priority: 'medium', dueDate: null, recurring: 'none', subtasks: []
    };
    await fetch(`${DATABASE_URL}/${getUserPath()}.json`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newTodo)
    });
    const message = t('voiceAdded') + ': ' + title;
    speak(message);
    showVoiceStatus(message, 'success');
    showMessage(t('addSuccess') + ': ' + title, 'success');
    fetchTodos();
  } catch (error) { speak(currentLang === 'zh' ? '添加失败' : 'Failed'); }
}

async function showTodosByVoice() {
  if (!authToken) { speak(currentLang === 'zh' ? '请先登录' : 'Please login first'); return; }
  try {
    const todos = await fetchTodosRaw();
    if (todos.length === 0) { speak(t('voiceEmpty')); showVoiceStatus(t('voiceEmpty'), 'info'); return; }
    const pending = todos.filter(t => !t.completed);
    const completed = todos.filter(t => t.completed);
    let message = '';
    if (pending.length > 0) {
      message += `${t('voicePending')}: ${pending.length}. `;
      if (pending.length <= 3) message += pending.map(t => t.title).join(', ');
      else { message += pending.slice(0, 3).map(t => t.title).join(', '); message += `, ${pending.length - 3} more`; }
    }
    if (completed.length > 0) message += `. ${t('voiceCompleted')}: ${completed.length}`;
    speak(message);
    showVoiceStatus(message, 'info');
  } catch (error) { speak(currentLang === 'zh' ? '读取失败' : 'Failed to load'); }
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
let showShortcuts = false;

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

function generateUserId() { return 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9); }
function generateShareCode() { return Math.random().toString(36).substring(2, 8).toUpperCase(); }
function escapeHtml(text) { const div = document.createElement('div'); div.textContent = text; return div.innerHTML; }
function escapeRegex(string) { return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

function getRepeatDate(recurring, currentDate) {
  if (!recurring || recurring === 'none') return null;
  const date = currentDate ? new Date(currentDate) : new Date();
  if (recurring === 'daily') date.setDate(date.getDate() + 1);
  else if (recurring === 'weekly') date.setDate(date.getDate() + 7);
  else if (recurring === 'monthly') date.setMonth(date.getMonth() + 1);
  return date.toISOString().split('T')[0];
}

// ==================== 通知系统 ====================

async function requestNotificationPermission() {
  if (!('Notification' in window)) { showMessage(t('browserNotSupport'), 'error'); return false; }
  if (Notification.permission === 'granted') return true;
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
  } else requestNotificationPermission();
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
  } catch (e) {}
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
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, passwordHash: hashPassword(password), created: new Date().toISOString() })
    });
    login(email, password);
  } catch (error) { showMessage(error.message, 'error'); }
}

async function login(email, password) {
  try {
    const response = await fetch(`${DATABASE_URL}/users.json`);
    const usersData = await response.json();
    let foundUser = null, foundUserId = null;
    for (const [userId, user] of Object.entries(usersData || {})) {
      if (user.email === email && user.passwordHash === hashPassword(password)) {
        foundUser = user; foundUserId = userId; break;
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
  } catch (error) { showMessage(error.message, 'error'); }
}

function logout() {
  currentUser = null; authToken = null; userEmail = null;
  localStorage.removeItem('todo_auth_token');
  localStorage.removeItem('todo_user_email');
  isSharedMode = false; currentShareCode = null;
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
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ todos: [], created: new Date().toISOString(), owner: authToken })
    });
    const cats = await fetchCategories();
    for (const cat of cats) {
      await fetch(`${DATABASE_URL}/shared_cat_${shareCode}/${cat.id}.json`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cat)
      });
    }
    const todos = await fetchTodosRaw();
    for (const todo of todos) {
      const newTodo = { ...todo }; delete newTodo.id;
      await fetch(`${DATABASE_URL}/shared_${shareCode}/todos.json`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newTodo)
      });
    }
    currentShareCode = shareCode;
    isSharedMode = true;
    localStorage.setItem('todo_share_code', shareCode);
    const shareUrl = `https://danieldeng978.github.io/my-todo-app/?share=${shareCode}&lang=${currentLang}&dark=${isDarkMode}`;
    if (confirm(`${t('shareCode')}: ${shareCode}\n\nURL: ${shareUrl}\n\n${t('copyLink')}?`)) {
      navigator.clipboard.writeText(shareUrl);
      showMessage(t('shareLinkCopied'), 'success');
    }
    showApp();
  } catch (error) { showMessage(t('shareFailed'), 'error'); }
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
  } catch (error) { showMessage(t('shareCodeInvalid'), 'error'); }
}

function exitShare() {
  isSharedMode = false; currentShareCode = null;
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
  } catch (error) { categories = []; return categories; }
}

async function addCategory(name, icon = '📁', color = '#667eea') {
  const path = getCategoriesPath();
  if (!path) return;
  const id = 'cat_' + Date.now().toString(36);
  await fetch(`${DATABASE_URL}/${path}/${id}.json`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, icon, color })
  });
  await loadCategories();
}

async function deleteCategory(catId) {
  if (!authToken || catId === 'all' || isSharedMode) return;
  const todos = await fetchTodosRaw();
  for (const todo of todos) {
    if (todo.category === catId) await fetch(`${DATABASE_URL}/${getUserPath()}/${todo.id}.json`, { method: 'DELETE' });
  }
  await fetch(`${DATABASE_URL}/${getCategoriesPath()}/${catId}.json`, { method: 'DELETE' });
  currentCategory = 'all';
  await loadCategories();
}

// ==================== Todo CRUD ====================

async function fetchTodosRaw() {
  const path = getUserPath();
  if (!path) return [];
  try {
    const response = await fetch(`${DATABASE_URL}/${path}.json`);
    if (!response.ok) { if (response.status === 403) showMessage('⚠️ Firebase 权限不足', 'error'); return []; }
    const data = await response.json();
    if (isSharedMode) return data && data.todos ? Object.entries(data.todos).map(([id, todo]) => ({ id, ...todo })) : [];
    return data ? Object.entries(data).map(([id, todo]) => ({ id, ...todo })) : [];
  } catch (error) {
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) showMessage('⚠️ 网络问题，请检查网络后刷新', 'error');
    return [];
  }
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
    if (a.dueDate && b.dueDate && a.dueDate !== b.dueDate) return new Date(a.dueDate) - new Date(b.dueDate);
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
  const recurringOptions = `1. ${t('none')}\n2. ${t('daily')}\n3. ${t('weekly')}\n4. ${t('monthly')}`;
  const recurringChoice = prompt(`${t('recurring')}:\n${recurringOptions}`, '1');
  const recurringMap = { '1': 'none', '2': 'daily', '3': 'weekly', '4': 'monthly' };
  const recurring = recurringMap[recurringChoice] || 'none';
  
  try {
    const newTodo = {
      title, completed: false, created_at: new Date().toISOString(),
      category: currentCategory === 'all' ? null : currentCategory,
      priority: currentPriority === 'all' ? 'medium' : currentPriority,
      dueDate: dueDate ? dueDate : null, recurring: recurring, subtasks: []
    };
    
    if (isSharedMode) {
      await fetch(`${DATABASE_URL}/${getUserPath()}/todos.json`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newTodo)
      });
    } else {
      await fetch(`${DATABASE_URL}/${getUserPath()}.json`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newTodo)
      });
    }
    
    showMessage(t('addSuccess'), 'success');
    todoInput.value = '';
    fetchTodos();
  } catch (error) { showMessage(error.message, 'error'); }
}

async function toggleTodo(id) {
  try {
    let url = `${DATABASE_URL}/${getUserPath()}`;
    if (isSharedMode) url += `/todos/${id}`; else url += `/${id}`;
    
    const getResponse = await fetch(url + '.json');
    const todo = await getResponse.json();
    
    if (!todo.completed && todo.recurring && todo.recurring !== 'none') {
      const nextDate = getRepeatDate(todo.recurring, todo.dueDate);
      const newTodo = {
        title: todo.title, completed: false, created_at: new Date().toISOString(),
        category: todo.category, priority: todo.priority, dueDate: nextDate, recurring: todo.recurring, subtasks: []
      };
      if (isSharedMode) {
        await fetch(`${DATABASE_URL}/${getUserPath()}/todos.json`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newTodo)
        });
      } else {
        await fetch(`${DATABASE_URL}/${getUserPath()}.json`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newTodo)
        });
      }
      showMessage(`${t('completed')} - ${t('recurring')}: ${nextDate}`, 'success');
    } else {
      if (!todo.completed && notificationsEnabled) sendNotification('✅ ' + t('completed'), `"${todo.title.slice(0, 20)}..." ${t('completed')}`, '🎉');
    }
    
    await fetch(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ completed: !todo.completed }) });
    fetchTodos();
  } catch (error) { showMessage(error.message, 'error'); }
}

async function deleteTodo(id) {
  if (isSharedMode) { showMessage(t('shareReadOnly'), 'error'); return; }
  try {
    await fetch(`${DATABASE_URL}/${getUserPath()}/${id}.json`, { method: 'DELETE' });
    showMessage(t('deleteSuccess'), 'success');
    fetchTodos();
  } catch (error) { showMessage(error.message, 'error'); }
}

async function setDueDate(id, currentDate) {
  const newDate = prompt(`${t('changeDate')} (${t('dateFormat')})\n${t('deleteDate')}:`, currentDate || '');
  try {
    let url = `${DATABASE_URL}/${getUserPath()}`;
    if (isSharedMode) url += `/todos/${id}`; else url += `/${id}`;
    
    if (newDate === '') {
      await fetch(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ dueDate: null }) });
      showMessage(t('dateDeleted'), 'success');
    } else if (newDate) {
      await fetch(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ dueDate: newDate }) });
      showMessage(t('setDateSuccess'), 'success');
    }
    fetchTodos();
  } catch (error) { showMessage(error.message, 'error'); }
}

// ==================== 子任务 ====================

async function addSubtask(todoId) {
  if (isSharedMode) { showMessage(t('shareReadOnly'), 'error'); return; }
  const subtaskTitle = prompt(t('subtaskPlaceholder'), '');
  if (!subtaskTitle || !subtaskTitle.trim()) return;
  try {
    let url = `${DATABASE_URL}/${getUserPath()}/${todoId}.json`;
    const response = await fetch(url);
    const todo = await response.json();
    const subtasks = todo.subtasks || [];
    subtasks.push({ id: 'st_' + Date.now(), title: subtaskTitle.trim(), completed: false });
    await fetch(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subtasks }) });
    fetchTodos();
  } catch (error) { showMessage(error.message, 'error'); }
}

async function toggleSubtask(todoId, subtaskId) {
  if (isSharedMode) return;
  try {
    let url = `${DATABASE_URL}/${getUserPath()}/${todoId}.json`;
    const response = await fetch(url);
    const todo = await response.json();
    const subtasks = todo.subtasks || [];
    const subtask = subtasks.find(st => st.id === subtaskId);
    if (subtask) {
      subtask.completed = !subtask.completed;
      await fetch(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subtasks }) });
      fetchTodos();
    }
  } catch (error) { showMessage(error.message, 'error'); }
}

async function deleteSubtask(todoId, subtaskId) {
  if (isSharedMode) return;
  try {
    let url = `${DATABASE_URL}/${getUserPath()}/${todoId}.json`;
    const response = await fetch(url);
    const todo = await response.json();
    const subtasks = (todo.subtasks || []).filter(st => st.id !== subtaskId);
    await fetch(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subtasks }) });
    fetchTodos();
  } catch (error) { showMessage(error.message, 'error'); }
}

// ==================== 统计功能 ====================

async function getStats() {
  const todos = await fetchTodosRaw();
  const stats = {
    total: todos.length, completed: todos.filter(t => t.completed).length, pending: todos.filter(t => !t.completed).length,
    byPriority: { high: todos.filter(t => t.priority === 'high').length, medium: todos.filter(t => t.priority === 'medium').length, low: todos.filter(t => t.priority === 'low').length },
    byCategory: {},
    overdue: todos.filter(t => t.dueDate && !t.completed && t.dueDate < new Date().toISOString().split('T')[0]).length,
    dueToday: todos.filter(t => t.dueDate && !t.completed && t.dueDate === new Date().toISOString().split('T')[0]).length, dueThisWeek: 0
  };
  const today = new Date();
  const weekEnd = new Date(today);
  weekEnd.setDate(weekEnd.getDate() + 7);
  todos.filter(t => t.dueDate && !t.completed).forEach(t => {
    if (t.dueDate >= new Date().toISOString().split('T')[0] && t.dueDate <= weekEnd.toISOString().split('T')[0]) stats.dueThisWeek++;
  });
  categories.forEach(cat => { stats.byCategory[cat.id] = todos.filter(t => t.category === cat.id).length; });
  return stats;
}

async function toggleStats() { showStats = !showStats; if (showStats) renderStats(); else hideStats(); }

async function renderStats() {
  const existing = document.querySelector('.stats-dashboard');
  if (existing) existing.remove();
  const stats = await getStats();
  const dashboard = document.createElement('div');
  dashboard.className = 'stats-dashboard';
  dashboard.innerHTML = `
    <div class="stats-header"><h3>📊 ${t('statsOverview')}</h3><button onclick="toggleStats()" class="close-stats">×</button></div>
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

function hideStats() { const existing = document.querySelector('.stats-dashboard'); if (existing) existing.remove(); }

// ==================== 快捷键 ====================

function toggleShortcuts() {
  showShortcuts = !showShortcuts;
  const existing = document.querySelector('.shortcuts-panel');
  if (existing) existing.remove();
  if (showShortcuts) {
    const panel = document.createElement('div');
    panel.className = 'shortcuts-panel';
    panel.innerHTML = `
      <div class="shortcuts-header"><h3>⌨️ ${t('keyboardShortcuts')}</h3><button onclick="toggleShortcuts()" class="close-stats">×</button></div>
      <div class="shortcuts-list">
        <div class="shortcut-item"><kbd>Enter</kbd> <span>${currentLang === 'zh' ? '添加待办' : 'Add todo'}</span></div>
        <div class="shortcut-item"><kbd>/</kbd> <span>${currentLang === 'zh' ? '聚焦搜索' : 'Focus search'}</span></div>
        <div class="shortcut-item"><kbd>Esc</kbd> <span>${currentLang === 'zh' ? '清除搜索' : 'Clear search'}</span></div>
        <div class="shortcut-item"><kbd>D</kbd> <span>${currentLang === 'zh' ? '切换深色模式' : 'Toggle dark mode'}</span></div>
        <div class="shortcut-item"><kbd>L</kbd> <span>${currentLang === 'zh' ? '切换语言' : 'Toggle language'}</span></div>
        <div class="shortcut-item"><kbd>S</kbd> <span>${currentLang === 'zh' ? '统计面板' : 'Stats panel'}</span></div>
        <div class="shortcut-item"><kbd>V</kbd> <span>${currentLang === 'zh' ? '语音助手' : 'Voice assistant'}</span></div>
        <div class="shortcut-item"><kbd>?</kbd> <span>${currentLang === 'zh' ? '显示帮助' : 'Show help'}</span></div>
      </div>
    `;
    document.querySelector('.container').prepend(panel);
  }
}

function handleKeyboardShortcuts(e) {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
    if (e.key === 'Escape') e.target.blur();
    return;
  }
  switch (e.key) {
    case '/': e.preventDefault(); document.getElementById('searchInput')?.focus(); break;
    case 'Escape': clearSearch(); const sp = document.querySelector('.shortcuts-panel'); if (sp) sp.remove(); showShortcuts = false; break;
    case 'd': case 'D': toggleDarkMode(); break;
    case 'l': case 'L': toggleLanguage(); break;
    case 's': case 'S': toggleStats(); break;
    case 'v': case 'V': toggleVoiceRobot(); break;
    case '?': toggleShortcuts(); break;
  }
}

// ==================== 语音机器人 UI ====================

function toggleVoiceRobot() {
  startListening();
}

function renderVoiceRobot() {
  const existing = document.querySelector('.voice-robot-container');
  if (existing) existing.remove();
  const container = document.createElement('div');
  container.className = 'voice-robot-container';
  container.innerHTML = `
    <div class="voice-robot ${voiceRobotExpanded ? 'expanded' : ''}">
      <button id="voiceBtn" class="voice-robot-btn" onclick="toggleVoiceRobot()">🤖</button>
      <div class="voice-content">
        <div class="voice-header">
          <span class="voice-title">${t('voiceRobot')}</span>
          <button class="voice-close" onclick="toggleVoiceRobot()">×</button>
        </div>
        <div class="voice-body">
          <div class="voice-hint">
            <p>${t('voiceHint')}</p>
            <p class="voice-commands">${currentLang === 'zh' ? '• "添加待办吃饭"<br>• "显示我的待办"<br>• "帮助"' : '• "add todo eat"<br>• "show my todos"<br>• "help"'}</p>
          </div>
          <button id="voiceRecordBtn" class="voice-record-btn" onclick="startListening()">
            <span class="voice-icon">🎤</span>
            <span class="voice-label">${t('voiceHint')}</span>
          </button>
        </div>
      </div>
      <div class="voice-listening-overlay" id="voiceOverlay" style="display:none">
        <div class="voice-wave-anim">🎤</div>
        <p>${t('voiceListening')}</p>
      </div>
    </div>
  `;
  document.body.appendChild(container);
}

// ==================== 导出/导入 ====================

async function exportData() {
  if (!authToken || isSharedMode) return;
  try {
    const todos = await fetchTodosRaw();
    const cats = await fetchCategories();
    const exportData = { version: 'V11+Voice', exportDate: new Date().toISOString(), userEmail: userEmail, todos: todos, categories: cats };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `todo-backup-${new Date().toISOString().split('T')[0]}.json`; a.click();
    URL.revokeObjectURL(url);
    showMessage(`${t('exportSuccess')} ${todos.length} ${t('total')}`, 'success');
  } catch (error) { showMessage(t('exportFailed'), 'error'); }
}

async function importData() {
  if (!authToken || isSharedMode) return;
  const input = document.createElement('input'); input.type = 'file'; input.accept = '.json';
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
        for (const todo of existingTodos) await fetch(`${DATABASE_URL}/${getUserPath()}/${todo.id}.json`, { method: 'DELETE' });
      }
      let imported = 0;
      for (const todo of data.todos) {
        const newTodo = {
          title: todo.title, completed: todo.completed || false, created_at: todo.created_at || new Date().toISOString(),
          category: todo.category || null, priority: todo.priority || 'medium', dueDate: todo.dueDate || null, recurring: todo.recurring || 'none', subtasks: todo.subtasks || []
        };
        await fetch(`${DATABASE_URL}/${getUserPath()}.json`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newTodo) });
        imported++;
      }
      showMessage(`${t('importSuccess')} ${imported} ${t('total')}`, 'success');
      loadCategories(); fetchTodos();
    } catch (error) { showMessage(t('importFailed') + ': ' + error.message, 'error'); }
  };
  input.click();
}

// ==================== 搜索 ====================

function performSearch(query) { searchQuery = query.trim(); renderSearchResults(); fetchTodos(); }

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
  if (todos.length === 0) { todoList.innerHTML = `<li class="empty-state"><span>📋</span><p>${searchQuery ? t('noResults') : t('noTodosYet')}</p></li>`; return; }
  const today = new Date().toISOString().split('T')[0];
  todos.forEach(todo => {
    const cat = categories.find(c => c.id === todo.category);
    const priority = PRIORITIES.find(p => p.id === todo.priority) || PRIORITIES[1];
    let overdueClass = '', overdueText = '';
    if (todo.dueDate && !todo.completed) {
      if (todo.dueDate < today) { overdueClass = 'overdue'; overdueText = '🔴 ' + t('overdueTask'); }
      else if (todo.dueDate === today) { overdueText = '🟡 ' + t('dueTodayTask'); }
    }
    let recurringIcon = '';
    if (todo.recurring && todo.recurring !== 'none') {
      const m = { daily: '🔁', weekly: '🔂', monthly: '🔄' };
      recurringIcon = m[todo.recurring] || '';
    }
    let subtasksHtml = '';
    const subtasks = todo.subtasks || [];
    if (subtasks.length > 0) {
      const completedSubtasks = subtasks.filter(st => st.completed).length;
      subtasksHtml = `
        <div class="subtasks-section">
          <div class="subtasks-header" onclick="toggleSubtasksVisibility('${todo.id}')">
            <span class="subtasks-toggle">▶</span>
            <span>${t('subtasks')} (${completedSubtasks}/${subtasks.length})</span>
          </div>
          <div class="subtasks-list" id="subtasks-${todo.id}">
            ${subtasks.map(st => `
              <div class="subtask-item ${st.completed ? 'completed' : ''}">
                <input type="checkbox" ${st.completed ? 'checked' : ''} onchange="toggleSubtask('${todo.id}', '${st.id}')">
                <span>${escapeHtml(st.title)}</span>
                ${!isSharedMode ? `<button onclick="deleteSubtask('${todo.id}', '${st.id}')">×</button>` : ''}
              </div>
            `).join('')}
            ${!isSharedMode ? `<div class="add-subtask" onclick="addSubtask('${todo.id}')">➕ ${t('addSubtask')}</div>` : ''}
          </div>
        </div>
      `;
    } else if (!isSharedMode) {
      subtasksHtml = `<div class="add-subtask-inline" onclick="addSubtask('${todo.id}')">➕ ${t('subtasks')}</div>`;
    }
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''} ${overdueClass}`;
    li.style.borderLeft = `4px solid ${priority.color}`;
    li.innerHTML = `
      <div class="todo-main">
        <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleTodo('${todo.id}')">
        <span class="todo-text">${highlightMatch(escapeHtml(todo.title), searchQuery)} ${recurringIcon}</span>
        ${todo.dueDate ? `<span class="todo-date" onclick="setDueDate('${todo.id}', '${todo.dueDate}')">📅 ${todo.dueDate} ${overdueText}</span>` : `<span class="todo-date add-date" onclick="setDueDate('${todo.id}')">➕ ${t('addDate')}</span>`}
        <span class="todo-priority" style="background:${priority.bgColor};color:${priority.color}">${priority.icon} ${priority.name}</span>
        ${cat ? `<span class="todo-category" style="background:${cat.color}20;color:${cat.color}">${cat.icon} ${cat.name}</span>` : ''}
        ${!isSharedMode ? `<button class="delete-btn" onclick="deleteTodo('${todo.id}')">${t('delete')}</button>` : ''}
      </div>
      ${subtasksHtml}
    `;
    todoList.appendChild(li);
  });
}

function toggleSubtasksVisibility(todoId) {
  const list = document.getElementById(`subtasks-${todoId}`);
  if (list) list.style.display = list.style.display === 'none' ? 'block' : 'none';
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
  messageEl.style.opacity = '1';
  messageEl.style.display = 'block';
  clearTimeout(messageEl.hideTimer);
  messageEl.hideTimer = setTimeout(() => {
    messageEl.style.opacity = '0';
    setTimeout(() => {
      messageEl.style.display = 'none';
      messageEl.textContent = '';
      messageEl.className = 'message';
    }, 300);
  }, 1500);
}

// ==================== UI ====================

async function loadCategories() { await fetchCategories(); renderCategoryTabs(); renderPriorityTabs(); renderSearchResults(); fetchTodos(); }

function renderCategoryTabs() {
  const existing = document.querySelector('.category-tabs');
  if (existing) existing.remove();
  const tabs = document.createElement('div');
  tabs.className = 'category-tabs';
  tabs.innerHTML = `<div class="category-tab ${currentCategory === 'all' ? 'active' : ''}" onclick="switchCategory('all')">📋 ${t('all')}</div>`;
  categories.forEach(cat => {
    tabs.innerHTML += `<div class="category-tab ${currentCategory === cat.id ? 'active' : ''}" onclick="switchCategory('${cat.id}')" style="${currentCategory === cat.id ? `background:${cat.color}20;border-color:${cat.color}` : ''}">${cat.icon} ${cat.name}${!isSharedMode ? `<span class="delete-cat" onclick="event.stopPropagation(); deleteCategory('${cat.id}')">×</span>` : ''}</div>`;
  });
  if (!isSharedMode) tabs.innerHTML += `<div class="category-tab add-cat" onclick="showAddCategory()">➕ ${t('addCategory')}</div>`;
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

function switchCategory(catId) { currentCategory = catId; loadCategories(); }
function switchPriority(priority) { currentPriority = priority; renderPriorityTabs(); fetchTodos(); }

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
    <p>🎤 ${t('version')}</p>
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
  totalCount.textContent = '0'; completedCount.textContent = '0'; pendingCount.textContent = '0';
}

function showApp() {
  PRIORITIES[0].name = t('urgent'); PRIORITIES[1].name = t('important'); PRIORITIES[2].name = t('normal');
  const searchHTML = `<div class="search-box"><input type="text" id="searchInput" placeholder="🔍 ${t('search')}" oninput="performSearch(this.value)"></div>`;
  let shareHTML = '';
  if (isSharedMode) shareHTML = `<div class="share-mode-banner"><span>🤝 ${t('sharedMode')}: ${currentShareCode}</span><button onclick="exitShare()" class="exit-share-btn">${t('exitShare')}</button></div>`;
  else if (authToken) shareHTML = `<div class="share-bar"><button onclick="createShare()" class="share-btn">🔗 ${t('createShare')}</button><button onclick="joinShare()" class="join-btn">🤝 ${t('joinShare')}</button></div>`;
  const exportHTML = !isSharedMode ? `
    <div class="export-import-bar">
      <button onclick="exportData()" class="export-btn">📤 ${t('export')}</button>
      <button onclick="importData()" class="import-btn">📥 ${t('import')}</button>
      <button onclick="toggleStats()" class="stats-btn">📊 ${t('stats')}</button>
      <button onclick="toggleNotifications()" id="notificationBtn" class="notification-btn ${notificationsEnabled ? 'enabled' : 'disabled'}">${notificationsEnabled ? '🔔 ' + t('notificationsOn') : '🔕 ' + t('notificationsOff')}</button>
    </div>
  ` : `<div class="export-import-bar"><button onclick="toggleStats()" class="stats-btn">📊 ${t('stats')}</button></div>`;
  document.querySelector('header').innerHTML = `
    <div class="header-top">
      <div>
        <h1>📝 ${t('appName')}</h1>
        <p>${t('welcome')}，${userEmail || t('guest')}</p>
      </div>
      <div class="header-actions">
        <button onclick="toggleDarkMode()" class="theme-btn" title="${isDarkMode ? t('lightMode') : t('darkMode')}">${isDarkMode ? '☀️' : '🌙'}</button>
        <button onclick="toggleLanguage()" class="lang-btn-sm">🌍 ${currentLang === 'zh' ? '中文' : 'EN'}</button>
        <button onclick="toggleShortcuts()" class="shortcut-btn" title="?">⌨️</button>
        ${authToken && !isSharedMode ? `<button onclick="logout()" class="logout-btn">${t('logout')}</button>` : ''}
      </div>
    </div>
    <p style="font-size: 12px; color: #888; margin-top: 5px;">🎤 ${t('version')}</p>
    ${shareHTML}
    ${searchHTML}
    ${exportHTML}
  `;
  loadCategories();
  renderVoiceRobot();
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
  applyDarkMode();
  initVoiceRecognition();
  if (voiceSynthesis) voiceSynthesis.onvoiceschanged = () => {};
  const urlParams = new URLSearchParams(window.location.search);
  const shareCode = urlParams.get('share');
  const langParam = urlParams.get('lang');
  const darkParam = urlParams.get('dark');
  if (langParam && (langParam === 'zh' || langParam === 'en')) { currentLang = langParam; localStorage.setItem('todo_lang', currentLang); }
  if (darkParam === 'true') { isDarkMode = true; localStorage.setItem('todo_dark_mode', 'true'); applyDarkMode(); }
  if (shareCode) { currentShareCode = shareCode.toUpperCase(); isSharedMode = true; localStorage.setItem('todo_share_code', currentShareCode); showMessage(t('joinedShare'), 'success'); }
  if (authToken && userEmail) { currentUser = { id: authToken, email: userEmail }; showApp(); }
  else if (currentShareCode) showApp();
  else showLogin();
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && authToken) checkDueNotifications(); });
  document.addEventListener('keydown', handleKeyboardShortcuts);
}

addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => { if (e.key === 'Enter' && todoInput.value.trim()) addTodo(); });
document.addEventListener('DOMContentLoaded', init);

// 全局函数
window.toggleTodo = toggleTodo; window.deleteTodo = deleteTodo; window.setDueDate = setDueDate;
window.performSearch = performSearch; window.clearSearch = clearSearch; window.handleAuth = handleAuth;
window.logout = logout; window.switchCategory = switchCategory; window.switchPriority = switchPriority;
window.deleteCategory = deleteCategory; window.showAddCategory = showAddCategory;
window.exportData = exportData; window.importData = importData;
window.toggleStats = toggleStats; window.toggleNotifications = toggleNotifications;
window.toggleLanguage = toggleLanguage; window.toggleDarkMode = toggleDarkMode; window.toggleShortcuts = toggleShortcuts;
window.toggleVoiceRobot = toggleVoiceRobot; window.startListening = startListening;
window.createShare = createShare; window.joinShare = joinShare; window.exitShare = exitShare;
window.addSubtask = addSubtask; window.toggleSubtask = toggleSubtask; window.deleteSubtask = deleteSubtask;
window.toggleSubtasksVisibility = toggleSubtasksVisibility;
