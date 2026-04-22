/* ============================
   Study Planner — Frontend App
   ============================ */

const API = '';  // same origin

// ---- State ----
let token = localStorage.getItem('sp_token') || null;
let subjects = [];
let tasks = [];
let sessions = [];
let activeSession = null;
let timerInterval = null;

// ---- Utility ----
function headers() {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

async function api(method, url, body) {
    const opts = { method, headers: headers() };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(API + url, opts);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Something went wrong');
    return data;
}

function showToast(msg, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.className = `toast ${type}`;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
}

function formatDuration(seconds) {
    if (!seconds && seconds !== 0) return '—';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// ===================================
// AUTH
// ===================================
function initAuth() {
    const tabs = document.querySelectorAll('.auth-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const authError = document.getElementById('auth-error');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            authError.classList.add('hidden');
            if (tab.dataset.tab === 'login') {
                loginForm.classList.remove('hidden');
                registerForm.classList.add('hidden');
            } else {
                loginForm.classList.add('hidden');
                registerForm.classList.remove('hidden');
            }
        });
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        authError.classList.add('hidden');
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        try {
            const data = await api('POST', '/api/auth/login', { email, password });
            token = data.token;
            localStorage.setItem('sp_token', token);
            showApp();
        } catch (err) {
            authError.textContent = err.message;
            authError.classList.remove('hidden');
        }
    });

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        authError.classList.add('hidden');
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        try {
            await api('POST', '/api/auth/register', { name, email, password });
            showToast('Account created! Please login.');
            // Switch to login tab
            tabs[0].click();
        } catch (err) {
            authError.textContent = err.message;
            authError.classList.remove('hidden');
        }
    });
}

// ===================================
// NAVIGATION
// ===================================
function initNav() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            const page = link.dataset.page;
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            document.getElementById(`page-${page}`).classList.add('active');
            if (page === 'dashboard') loadDashboard();
            if (page === 'subjects') loadSubjects();
            if (page === 'tasks') loadTasks();
            if (page === 'sessions') loadSessions();
        });
    });

    document.getElementById('logout-btn').addEventListener('click', () => {
        token = null;
        localStorage.removeItem('sp_token');
        stopTimer();
        showAuth();
    });
}

// ===================================
// SHOW AUTH / APP
// ===================================
function showAuth() {
    document.getElementById('auth-view').classList.add('active');
    document.getElementById('app-view').classList.remove('active');
}

function showApp() {
    document.getElementById('auth-view').classList.remove('active');
    document.getElementById('app-view').classList.add('active');
    loadDashboard();
}

// ===================================
// DASHBOARD
// ===================================
async function loadDashboard() {
    try {
        [subjects, tasks, sessions] = await Promise.all([
            api('GET', '/api/subjects'),
            api('GET', '/api/tasks'),
            api('GET', '/api/sessions')
        ]);

        document.getElementById('stat-subjects').textContent = subjects.length;
        document.getElementById('stat-tasks').textContent = tasks.length;
        document.getElementById('stat-completed').textContent = tasks.filter(t => t.completed).length;
        document.getElementById('stat-sessions').textContent = sessions.length;

        // Recent subjects
        const recentSubjects = document.getElementById('recent-subjects');
        if (subjects.length === 0) {
            recentSubjects.innerHTML = '<li class="empty-state">No subjects yet</li>';
        } else {
            recentSubjects.innerHTML = subjects.slice(0, 5).map(s =>
                `<li><span class="dot"></span>${s.name}</li>`
            ).join('');
        }

        // Recent tasks
        const recentTasks = document.getElementById('recent-tasks');
        if (tasks.length === 0) {
            recentTasks.innerHTML = '<li class="empty-state">No tasks yet</li>';
        } else {
            recentTasks.innerHTML = tasks.slice(0, 5).map(t =>
                `<li><span class="dot" style="background:${t.completed ? 'var(--success)' : 'var(--accent)'}"></span>
         <span style="${t.completed ? 'text-decoration:line-through;color:var(--text-muted)' : ''}">${t.title}</span></li>`
            ).join('');
        }
    } catch (err) {
        if (err.message === 'Invalid token' || err.message === 'No token') {
            showAuth();
        }
    }
}

// ===================================
// SUBJECTS
// ===================================
function initSubjects() {
    const modal = document.getElementById('subject-modal');
    const form = document.getElementById('subject-form');

    document.getElementById('add-subject-btn').addEventListener('click', () => {
        modal.classList.remove('hidden');
        document.getElementById('subject-name').focus();
    });

    document.getElementById('cancel-subject').addEventListener('click', () => {
        modal.classList.add('hidden');
        form.reset();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
            form.reset();
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('subject-name').value.trim();
        if (!name) return;
        try {
            await api('POST', '/api/subjects', { name });
            showToast('Subject created!');
            modal.classList.add('hidden');
            form.reset();
            loadSubjects();
        } catch (err) {
            showToast(err.message, 'error');
        }
    });
}

async function loadSubjects() {
    try {
        subjects = await api('GET', '/api/subjects');
        const list = document.getElementById('subjects-list');
        if (subjects.length === 0) {
            list.innerHTML = '<div class="empty-state-large glass-card"><span>📖</span><p>No subjects yet. Create your first one!</p></div>';
            return;
        }
        list.innerHTML = subjects.map(s => `
      <div class="subject-card glass-card">
        <div class="subject-card-info">
          <div class="subject-card-icon">📖</div>
          <span class="subject-card-name">${s.name}</span>
        </div>
        <button class="btn-icon" onclick="deleteSubject('${s._id}')" title="Delete">🗑️</button>
      </div>
    `).join('');
    } catch (err) {
        showToast(err.message, 'error');
    }
}

window.deleteSubject = async function (id) {
    if (!confirm('Delete this subject? Associated tasks will remain.')) return;
    try {
        await api('DELETE', `/api/subjects/${id}`);
        showToast('Subject deleted');
        loadSubjects();
    } catch (err) {
        showToast(err.message, 'error');
    }
};

// ===================================
// TASKS
// ===================================
function initTasks() {
    const modal = document.getElementById('task-modal');
    const form = document.getElementById('task-form');

    document.getElementById('add-task-btn').addEventListener('click', () => {
        document.getElementById('task-modal-title').textContent = 'Add Task';
        document.getElementById('task-edit-id').value = '';
        form.reset();
        populateSubjectDropdown('task-subject');
        modal.classList.remove('hidden');
    });

    document.getElementById('cancel-task').addEventListener('click', () => {
        modal.classList.add('hidden');
        form.reset();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
            form.reset();
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const editId = document.getElementById('task-edit-id').value;
        const title = document.getElementById('task-title').value.trim();
        const subjectId = document.getElementById('task-subject').value;
        if (!title || !subjectId) return;

        try {
            if (editId) {
                await api('PUT', `/api/tasks/${editId}`, { title, subjectId });
                showToast('Task updated!');
            } else {
                await api('POST', '/api/tasks', { title, subjectId });
                showToast('Task created!');
            }
            modal.classList.add('hidden');
            form.reset();
            loadTasks();
        } catch (err) {
            showToast(err.message, 'error');
        }
    });
}

function populateSubjectDropdown(selectId) {
    const select = document.getElementById(selectId);
    const currentVal = select.value;
    const opts = selectId === 'session-subject'
        ? '<option value="">No subject (general)</option>'
        : '<option value="">Select a subject</option>';
    select.innerHTML = opts + subjects.map(s =>
        `<option value="${s._id}">${s.name}</option>`
    ).join('');
    if (currentVal) select.value = currentVal;
}

async function loadTasks() {
    try {
        [tasks, subjects] = await Promise.all([
            api('GET', '/api/tasks'),
            api('GET', '/api/subjects')
        ]);

        const list = document.getElementById('tasks-list');
        if (tasks.length === 0) {
            list.innerHTML = '<div class="empty-state-large glass-card"><span>✅</span><p>No tasks yet. Create your first one!</p></div>';
            return;
        }

        const subjectMap = {};
        subjects.forEach(s => subjectMap[s._id] = s.name);

        list.innerHTML = tasks.map(t => `
      <div class="task-item glass-card">
        <button class="task-checkbox ${t.completed ? 'checked' : ''}" onclick="toggleTask('${t._id}', ${!t.completed})">
          ${t.completed ? '✓' : ''}
        </button>
        <div class="task-info">
          <div class="task-title ${t.completed ? 'completed' : ''}">${t.title}</div>
          <div class="task-subject-badge">${subjectMap[t.subjectId] || 'Unknown subject'}</div>
        </div>
        <div class="task-actions">
          <button class="btn-icon btn-success" onclick="editTask('${t._id}')" title="Edit">✏️</button>
          <button class="btn-icon" onclick="deleteTask('${t._id}')" title="Delete">🗑️</button>
        </div>
      </div>
    `).join('');
    } catch (err) {
        showToast(err.message, 'error');
    }
}

window.toggleTask = async function (id, completed) {
    try {
        await api('PUT', `/api/tasks/${id}`, { completed });
        loadTasks();
    } catch (err) {
        showToast(err.message, 'error');
    }
};

window.editTask = function (id) {
    const task = tasks.find(t => t._id === id);
    if (!task) return;
    document.getElementById('task-modal-title').textContent = 'Edit Task';
    document.getElementById('task-edit-id').value = id;
    document.getElementById('task-title').value = task.title;
    populateSubjectDropdown('task-subject');
    document.getElementById('task-subject').value = task.subjectId;
    document.getElementById('task-modal').classList.remove('hidden');
};

window.deleteTask = async function (id) {
    if (!confirm('Delete this task?')) return;
    try {
        await api('DELETE', `/api/tasks/${id}`);
        showToast('Task deleted');
        loadTasks();
    } catch (err) {
        showToast(err.message, 'error');
    }
};

// ===================================
// SESSIONS
// ===================================
function initSessions() {
    document.getElementById('start-session-btn').addEventListener('click', startSession);
    document.getElementById('stop-session-btn').addEventListener('click', stopSession);
}

async function startSession() {
    const subjectId = document.getElementById('session-subject').value;
    const body = subjectId ? { subjectId } : {};
    try {
        const session = await api('POST', '/api/sessions/start', body);
        activeSession = session;
        showToast('Session started!');
        document.getElementById('start-session-btn').classList.add('hidden');
        document.getElementById('stop-session-btn').classList.remove('hidden');
        startTimer();
        loadSessions();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

async function stopSession() {
    if (!activeSession) return;
    try {
        await api('PUT', `/api/sessions/${activeSession._id}/end`);
        showToast('Session ended!');
        stopTimer();
        activeSession = null;
        document.getElementById('start-session-btn').classList.remove('hidden');
        document.getElementById('stop-session-btn').classList.add('hidden');
        loadSessions();
    } catch (err) {
        showToast(err.message, 'error');
    }
}

function startTimer() {
    const start = new Date(activeSession.startTime).getTime();
    const display = document.getElementById('timer-display');
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - start) / 1000);
        display.textContent = formatDuration(elapsed);
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    document.getElementById('timer-display').textContent = '00:00:00';
}

async function loadSessions() {
    try {
        [sessions, subjects] = await Promise.all([
            api('GET', '/api/sessions'),
            api('GET', '/api/subjects')
        ]);

        populateSubjectDropdown('session-subject');

        const list = document.getElementById('sessions-list');
        if (sessions.length === 0) {
            list.innerHTML = '<div class="empty-state-large glass-card"><span>⏱️</span><p>No sessions yet. Start studying!</p></div>';
            return;
        }

        const subjectMap = {};
        subjects.forEach(s => subjectMap[s._id] = s.name);

        // Check for an active session (no endTime)
        const active = sessions.find(s => !s.endTime);
        if (active && !activeSession) {
            activeSession = active;
            document.getElementById('start-session-btn').classList.add('hidden');
            document.getElementById('stop-session-btn').classList.remove('hidden');
            startTimer();
        }

        list.innerHTML = sessions.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()).map(s => `
      <div class="session-item glass-card">
        <div class="session-item-info">
          <span class="session-item-subject">${subjectMap[s.subjectId] || 'General Study'}</span>
          <span class="session-item-time">${formatDate(s.startTime)}${s.endTime ? ' — ' + formatDate(s.endTime) : ''}</span>
        </div>
        ${s.endTime
                ? `<span class="session-item-duration">${formatDuration(s.duration)}</span>`
                : `<span class="session-active-badge">● Active</span>`
            }
      </div>
    `).join('');
    } catch (err) {
        showToast(err.message, 'error');
    }
}

// ===================================
// INIT
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    initNav();
    initSubjects();
    initTasks();
    initSessions();

    // Auto-login check
    if (token) {
        showApp();
    } else {
        showAuth();
    }
});
