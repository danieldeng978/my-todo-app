// public/app.js - Firebase 版本 + 匿名认证
// 使用 Firebase Anonymous Auth，无需注册登录

const DATABASE_URL = 'https://first-ad067-default-rtdb.asia-southeast1.firebasedatabase.app';

// Firebase Web App 配置 (从 Firebase Console 获取)
const firebaseConfig = {
  apiKey: "AIzaSyDexample123456789placeholder",
  authDomain: "first-ad067.firebaseapp.com",
  databaseURL: "https://first-ad067-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "first-ad067",
  storageBucket: "first-ad067.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:placeholder"
};

// 当前用户 ID
let currentUserId = localStorage.getItem('todo_user_id');

// DOM 元素
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const totalCount = document.getElementById('totalCount');
const completedCount = document.getElementById('completedCount');
const pendingCount = document.getElementById('pendingCount');
const messageEl = document.getElementById('message');

// ==================== 匿名用户系统 ====================

// 生成或获取匿名用户 ID
function getAnonymousUserId() {
  let userId = localStorage.getItem('todo_anon_user');
  if (!userId) {
    userId = 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('todo_anon_user', userId);
  }
  return userId;
}

// 获取当前用户的数据路径
function getUserPath() {
  const userId = getAnonymousUserId();
  return `todos_${userId}`;
}

// ==================== Firebase REST API ====================

// 获取当前用户所有待办
async function fetchTodos() {
  try {
    const path = getUserPath();
    const response = await fetch(`${DATABASE_URL}/${path}.json`);
    
    if (!response.ok) {
      throw new Error('连接失败');
    }
    
    const data = await response.json();
    const todos = data ? Object.entries(data).map(([id, todo]) => ({ id, ...todo })) : [];
    todos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    renderTodos(todos);
    updateStats(todos);
  } catch (error) {
    showMessage('获取数据失败: ' + error.message, 'error');
  }
}

// 添加待办
async function addTodo(title) {
  if (!title.trim()) return;
  
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
    showMessage('添加失败: ' + error.message, 'error');
  }
}

// 切换完成状态
async function toggleTodo(id) {
  try {
    const path = getUserPath();
    
    // 获取当前状态
    const getResponse = await fetch(`${DATABASE_URL}/${path}/${id}.json`);
    const todo = await getResponse.json();
    
    if (!todo) throw new Error('未找到');
    
    // 更新
    const updateResponse = await fetch(`${DATABASE_URL}/${path}/${id}.json`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !todo.completed })
    });
    
    if (!updateResponse.ok) throw new Error('更新失败');
    
    fetchTodos();
  } catch (error) {
    showMessage('更新失败: ' + error.message, 'error');
  }
}

// 删除待办
async function deleteTodo(id) {
  try {
    const path = getUserPath();
    
    const response = await fetch(`${DATABASE_URL}/${path}/${id}.json`, {
      method: 'DELETE'
    });
    
    if (!response.ok) throw new Error('删除失败');
    
    showMessage('删除成功！', 'success');
    fetchTodos();
  } catch (error) {
    showMessage('删除失败: ' + error.message, 'error');
  }
}

// ==================== 渲染函数 ====================

function renderTodos(todos) {
  todoList.innerHTML = '';
  
  if (todos.length === 0) {
    todoList.innerHTML = `
      <li class="empty-state">
        <span>📋</span>
        <p>暂无待办事项，添加一个吧！</p>
      </li>
    `;
    return;
  }
  
  todos.forEach(todo => {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    
    li.innerHTML = `
      <input 
        type="checkbox" 
        class="todo-checkbox" 
        ${todo.completed ? 'checked' : ''}
        onchange="toggleTodo('${todo.id}')"
      >
      <span class="todo-text">${escapeHtml(todo.title)}</span>
      <button class="delete-btn" onclick="deleteTodo('${todo.id}')">删除</button>
    `;
    
    todoList.appendChild(li);
  });
}

function updateStats(todos) {
  const total = todos.length;
  const completed = todos.filter(t => t.completed).length;
  const pending = total - completed;
  
  totalCount.textContent = total;
  completedCount.textContent = completed;
  pendingCount.textContent = pending;
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
  fetchTodos();
});

window.toggleTodo = toggleTodo;
window.deleteTodo = deleteTodo;
