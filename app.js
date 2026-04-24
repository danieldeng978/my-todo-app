// public/app.js - Firebase 版本
// 使用 Firebase Realtime Database REST API

const DATABASE_URL = 'https://first-ad067-default-rtdb.asia-southeast1.firebasedatabase.app';
const API_KEY = 'AIzaSyDexample123456789';  // 临时用，实际从Firebase获取

// DOM 元素
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const totalCount = document.getElementById('totalCount');
const completedCount = document.getElementById('completedCount');
const pendingCount = document.getElementById('pendingCount');
const messageEl = document.getElementById('message');

// ==================== Firebase REST API ====================

// 获取所有待办
async function fetchTodos() {
  try {
    const response = await fetch(`${DATABASE_URL}/todos.json`);
    const data = await response.json();
    const todos = data ? Object.entries(data).map(([id, todo]) => ({ id, ...todo })) : [];
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
    const newTodo = {
      title: title.trim(),
      completed: false,
      created_at: new Date().toISOString()
    };
    
    const response = await fetch(`${DATABASE_URL}/todos.json`, {
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
async function toggleTodo(id, currentCompleted) {
  try {
    // 先获取当前数据
    const getResponse = await fetch(`${DATABASE_URL}/todos/${id}.json`);
    const todo = await getResponse.json();
    
    // 更新
    const updateResponse = await fetch(`${DATABASE_URL}/todos/${id}.json`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !currentCompleted })
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
    const response = await fetch(`${DATABASE_URL}/todos/${id}.json`, {
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
        onchange="toggleTodo('${todo.id}', ${todo.completed})"
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

document.addEventListener('DOMContentLoaded', fetchTodos);

window.toggleTodo = toggleTodo;
window.deleteTodo = deleteTodo;
