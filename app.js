// public/app.js - 前端逻辑（改用 localStorage 存储数据）
// 这样就不需要后端了，可以直接部署到 GitHub Pages

const STORAGE_KEY = 'todos_data';

// DOM 元素
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const totalCount = document.getElementById('totalCount');
const completedCount = document.getElementById('completedCount');
const pendingCount = document.getElementById('pendingCount');
const messageEl = document.getElementById('message');

// ==================== 数据操作 ====================

// 生成唯一 ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 从 localStorage 读取数据
function getTodos() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// 保存数据到 localStorage
function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// ==================== CRUD 操作 ====================

function addTodo(title) {
  if (!title.trim()) return;
  
  const todos = getTodos();
  const newTodo = {
    id: generateId(),
    title: title.trim(),
    completed: false,
    created_at: new Date().toISOString()
  };
  
  todos.unshift(newTodo);
  saveTodos(todos);
  renderTodos();
  updateStats();
  showMessage('添加成功！', 'success');
}

function toggleTodo(id) {
  const todos = getTodos();
  const todo = todos.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    saveTodos(todos);
    renderTodos();
    updateStats();
  }
}

function deleteTodo(id) {
  let todos = getTodos();
  todos = todos.filter(t => t.id !== id);
  saveTodos(todos);
  renderTodos();
  updateStats();
  showMessage('删除成功！', 'success');
}

// ==================== 渲染函数 ====================

function renderTodos() {
  const todos = getTodos();
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

function updateStats() {
  const todos = getTodos();
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
  if (title) {
    addTodo(title);
    todoInput.value = '';
    todoInput.focus();
  }
});

todoInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const title = todoInput.value.trim();
    if (title) {
      addTodo(title);
      todoInput.value = '';
    }
  }
});

// ==================== 初始化 ====================

document.addEventListener('DOMContentLoaded', () => {
  renderTodos();
  updateStats();
});

// 暴露函数到全局
window.toggleTodo = toggleTodo;
window.deleteTodo = deleteTodo;
