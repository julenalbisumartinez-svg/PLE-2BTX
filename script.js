// ============================================================
//  IAK OS — script.js
// ============================================================

// ─── STATE ──────────────────────────────────────────────────
const STATE = {
  currentPage: 'home',
  currentSubject: null,
  currentNote: null,
  timerInterval: null,
  timerSeconds: 25 * 60,
  timerRunning: false,
  timerMode: 'work',
  pomodoros: 0,
  darkMode: false,
  streak: parseInt(localStorage.getItem('iak_streak') || '0'),
  lastVisit: localStorage.getItem('iak_last_visit') || '',
};

const SUBJECTS = [
  { id:"mate", n:"Matematika II", color:"#ff6b35", icon:"∑", d:"Aljebra, Analisia eta Geometria espazioan.", res:[
    { t:"Deribatuak — azalpena hasieratik (El Traductor)",  type:"video", l:"https://www.youtube.com/watch?v=_6-zwdrqD3U" },
    { t:"Integralen kalkulua — clase osoa (El Traductor)",  type:"video", l:"https://www.youtube.com/watch?v=Ec-cGjh0Fr0" },
    { t:"100 integral ebatzita — pausoz pauso",             type:"video", l:"https://www.youtube.com/watch?v=xB19hvvskSs" },
    { t:"Matrize eta determinanteak — 2. Batx (PAU 2025)",  type:"video", l:"https://www.youtube.com/watch?v=Q4EdMK9-Ejw" },
    { t:"Khan Academy — Kalkulu diferentziala",             type:"doc",   l:"https://es.khanacademy.org/math/differential-calculus" },
  ]},
  { id:"fisika", n:"Fisika", color:"#4ecdc4", icon:"⚡", d:"Eremu grabitatorioa eta elektromagnetismoa.", res:[
    { t:"Elektromagnetismoa 1. zatia — laburpena 2. Batx",  type:"video", l:"https://www.youtube.com/watch?v=mGJPiqAdFi4" },
    { t:"Elektromagnetismoa 2. zatia — laburpena 2. Batx",  type:"video", l:"https://www.youtube.com/watch?v=nBKBPsW9s3o" },
    { t:"Eremu magnetikoa 1 — Lorentz legea",               type:"video", l:"https://www.youtube.com/watch?v=fII0eibvKPg" },
    { t:"Indukzio elektromagnetikoa",                       type:"video", l:"https://www.youtube.com/watch?v=TX4xVVRt5gw" },
    { t:"Fisikalab — teoria eta ariketak",                  type:"doc",   l:"https://www.fisicalab.com" },
  ]},
  { id:"info", n:"Informatika", color:"#a8e6cf", icon:"⌨", d:"Programazioa Python-en eta Web garapena.", res:[
    { t:"Python hasieratik — kurtso osoa",                  type:"video", l:"https://www.youtube.com/watch?v=nKPbfIU442g" },
    { t:"HTML eta CSS — hasieratik adituraino",             type:"video", l:"https://www.youtube.com/watch?v=ELSm-G201Ls" },
    { t:"Git eta GitHub — kurtso osoa (MoureDev)",          type:"video", l:"https://www.youtube.com/watch?v=3GymExBkKjE" },
    { t:"HTML eta CSS freeCodeCamp — 5 ordu",               type:"video", l:"https://www.youtube.com/watch?v=XqFR2lqBYPs" },
    { t:"W3Schools — dokumentazio ofiziala",                type:"doc",   l:"https://www.w3schools.com" },
  ]},
  { id:"eusk", n:"Euskara", color:"#ffd93d", icon:"✍", d:"Sintaxia eta XX. mendeko literatura.", res:[
    { t:"Testu komentarioa nola egin — pausoak",            type:"video", l:"https://www.youtube.com/watch?v=9Pe-eSVPwCE" },
    { t:"Testu komentarioa — trikimailuak",                 type:"video", l:"https://www.youtube.com/watch?v=g7ryWRXY6H8" },
    { t:"HABE — Euskara baliabide ofizialak",               type:"doc",   l:"https://www.habe.euskadi.eus" },
    { t:"Euskaltzaindia — gramatika arauak",                type:"doc",   l:"https://www.euskaltzaindia.eus" },
  ]},
  { id:"hist", n:"Historia", color:"#c77dff", icon:"📜", d:"Espainiako eta Euskal Herriko historia garaikidea.", res:[
    { t:"Gerra Zibila — 10 minututan laburpena",            type:"video", l:"https://www.youtube.com/watch?v=fVehiOlgoUA" },
    { t:"Gerra Zibila — 13 minututan (Memorias de Pez)",    type:"video", l:"https://www.youtube.com/watch?v=5Zwv43MUA7s" },
    { t:"Frankismoa (1939-1975) — Historia de España",      type:"video", l:"https://www.youtube.com/watch?v=vO2sW48YNuk" },
    { t:"Trantsizioa demokraziara — Historia de España",    type:"video", l:"https://www.youtube.com/watch?v=vDCjvkS_yUw" },
    { t:"Khan Academy — Mundu Historia",                    type:"doc",   l:"https://es.khanacademy.org/humanities/world-history" },
  ]},
  { id:"hizkunt", n:"Gaztelania", color:"#ff8fab", icon:"📖", d:"Literatura hispanikoa eta idazketa teknikak.", res:[
    { t:"Testu komentarioa — hasieratik Selectividad",      type:"video", l:"https://www.youtube.com/watch?v=9Pe-eSVPwCE" },
    { t:"Testu komentarioa — trikimailuak",                 type:"video", l:"https://www.youtube.com/watch?v=g7ryWRXY6H8" },
    { t:"Komentario literarioa Selectividad EVAU",          type:"video", l:"https://www.youtube.com/watch?v=iPNppIwgp7o" },
    { t:"RAE — Hiztegia ofiziala",                          type:"doc",   l:"https://www.rae.es" },
  ]},
  { id:"ing", n:"Ingelesa", color:"#74b9ff", icon:"🌐", d:"B2 maila, Writing eta Speaking trebetasunak.", res:[
    { t:"B2 First essay writing — FCE pausoak",             type:"video", l:"https://www.youtube.com/watch?v=TAbNTFT0wcU" },
    { t:"B2 essay egitura nola antolatu — FCE",             type:"video", l:"https://www.youtube.com/watch?v=fgt_JH4xzjo" },
    { t:"B2 essay nola planifikatu — FCE",                  type:"video", l:"https://www.youtube.com/watch?v=K9UL9rsD-_8" },
    { t:"BBC Learning English — baliabide ofizialak",       type:"doc",   l:"https://www.bbc.co.uk/learningenglish" },
  ]},
];

// ─── DATA ────────────────────────────────────────────────────
let gradeData  = JSON.parse(localStorage.getItem('iak_grades'))  || {};
let notes      = JSON.parse(localStorage.getItem('iak_notes'))   || [{id:1, t:'Ongi etorri', b:'Hau zure lehen oharra da. Hasi idazten!', color:'#ffd93d', created: Date.now()}];
let tasks      = JSON.parse(localStorage.getItem('iak_tasks'))   || [];
let events     = JSON.parse(localStorage.getItem('iak_events'))  || [];
let habits     = JSON.parse(localStorage.getItem('iak_habits'))  || [{id:1, name:'Ura edan (8 baso)', done:false, streak:0},{id:2, name:'Azterketa gaia errepasatu', done:false, streak:0},{id:3, name:'Klaseak berrikusi', done:false, streak:0}];
let currentNoteId = notes[0]?.id;
let currentNoteColor = '#ffd93d';

// ─── SAVE ─────────────────────────────────────────────────────
function save() {
  localStorage.setItem('iak_grades', JSON.stringify(gradeData));
  localStorage.setItem('iak_notes',  JSON.stringify(notes));
  localStorage.setItem('iak_tasks',  JSON.stringify(tasks));
  localStorage.setItem('iak_events', JSON.stringify(events));
  localStorage.setItem('iak_habits', JSON.stringify(habits));
}

// ─── STREAK ───────────────────────────────────────────────────
function updateStreak() {
  const today = new Date().toDateString();
  if (STATE.lastVisit === today) return;
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  if (STATE.lastVisit === yesterday) STATE.streak++;
  else STATE.streak = 1;
  STATE.lastVisit = today;
  localStorage.setItem('iak_streak', STATE.streak);
  localStorage.setItem('iak_last_visit', today);
}

// ─── NAVIGATION ───────────────────────────────────────────────
function navigate(id) {
  document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
  const sec = document.getElementById(id);
  if (!sec) return;
  sec.classList.add('active');
  const navEl = document.getElementById('nav-' + id);
  if (navEl) navEl.classList.add('active');
  STATE.currentPage = id;
  window.scrollTo(0,0);
  const handlers = {
    home: renderHome, grades: initGrades, academy: loadAcademy,
    notes: () => { renderNotes(); if(notes.length) selectNote(notes[0].id); },
    tasks: renderTasks, calendar: renderCalendar, stats: renderStats,
    pomodoro: initPomodoro, habits: renderHabits,
  };
  if (handlers[id]) handlers[id]();
}

// ─── HOME ─────────────────────────────────────────────────────
function renderHome() {
  calcTotal();
  const now = new Date();
  const hour = now.getHours();
  let greeting = hour < 6 ? 'Gabon.' : hour < 12 ? 'Egun on.' : hour < 20 ? 'Arratsalde on.' : 'Gabon.';
  const greetEl = document.getElementById('home-greeting');
  if (greetEl) greetEl.innerText = greeting;

  const streakEl = document.getElementById('home-streak');
  if (streakEl) streakEl.innerText = STATE.streak;

  const pendingTasks = tasks.filter(t => !t.done).length;
  const pendEl = document.getElementById('home-pending');
  if (pendEl) pendEl.innerText = pendingTasks;

  // Upcoming events
  const upcomingEl = document.getElementById('home-upcoming');
  if (upcomingEl) {
    const upcoming = events.filter(e => new Date(e.date) >= now).slice(0,3);
    upcomingEl.innerHTML = upcoming.length
      ? upcoming.map(e => `<div class="home-event-item"><span class="event-dot" style="background:${e.color||'#000'}"></span><span>${e.title}</span><small>${e.date}</small></div>`).join('')
      : '<p style="color:var(--sub);font-size:13px;">Ez dago gertaerarik.</p>';
  }

  // Recent notes
  const recentNotesEl = document.getElementById('home-recent-notes');
  if (recentNotesEl) {
    recentNotesEl.innerHTML = notes.slice(0,3).map(n => `
      <div class="home-note-chip" style="background:${n.color||'#ffd93d'}22;border-left:3px solid ${n.color||'#ffd93d'}" onclick="navigate('notes')">
        <strong>${n.t || 'Hutsik'}</strong>
      </div>`).join('');
  }
}

// ─── GRADES ───────────────────────────────────────────────────
function initGrades() {
  const body = document.getElementById('grades-table-body');
  if (!body) return;
  SUBJECTS.forEach(s => { if (!gradeData[s.id]) gradeData[s.id] = [0,0,0]; });
  body.innerHTML = SUBJECTS.map(s => {
    const g = gradeData[s.id];
    const avg = ((g[0]+g[1]+g[2])/3).toFixed(1);
    const color = avg >= 7 ? '#2ecc71' : avg >= 5 ? '#f39c12' : '#e74c3c';
    return `
      <tr class="grade-row" style="border-bottom:1px solid var(--border);">
        <td style="padding:22px 20px;">
          <div style="display:flex;align-items:center;gap:12px;">
            <span style="width:36px;height:36px;border-radius:10px;background:${s.color}22;display:flex;align-items:center;justify-content:center;font-size:18px;">${s.icon}</span>
            <span style="font-weight:700;">${s.n}</span>
          </div>
        </td>
        <td><input type="number" class="grade-input" min="0" max="10" step="0.1" value="${g[0]}" onchange="upGrade('${s.id}',0,this.value)"></td>
        <td><input type="number" class="grade-input" min="0" max="10" step="0.1" value="${g[1]}" onchange="upGrade('${s.id}',1,this.value)"></td>
        <td><input type="number" class="grade-input" min="0" max="10" step="0.1" value="${g[2]}" onchange="upGrade('${s.id}',2,this.value)"></td>
        <td>
          <div style="display:flex;align-items:center;gap:10px;">
            <div class="grade-bar-wrap"><div class="grade-bar" style="width:${avg*10}%;background:${color}"></div></div>
            <span style="font-weight:800;color:${color};font-size:18px;min-width:36px;">${avg}</span>
          </div>
        </td>
      </tr>`;
  }).join('');
  calcTotal();
}

function upGrade(id, idx, val) {
  gradeData[id][idx] = Math.min(10, Math.max(0, parseFloat(val) || 0));
  save();
  initGrades();
}

function calcTotal() {
  let sum = 0;
  SUBJECTS.forEach(s => {
    const g = gradeData[s.id] || [0,0,0];
    sum += (g[0]+g[1]+g[2]) / 3;
  });
  const final = (sum / SUBJECTS.length).toFixed(2);
  ['final-gpa-display','home-gpa'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerText = final;
  });
  return final;
}

// ─── ACADEMY ──────────────────────────────────────────────────
function loadAcademy() {
  const list = document.getElementById('subj-list');
  if (!list) return;
  list.innerHTML = SUBJECTS.map(s => `
    <div class="subj-tab" onclick="openSubject('${s.id}')" id="tab-${s.id}" style="--accent:${s.color}">
      <div class="subj-icon">${s.icon}</div>
      <div class="subj-name">${s.n}</div>
    </div>`).join('');
}

function openSubject(id) {
  const s = SUBJECTS.find(x => x.id === id);
  document.querySelectorAll('.subj-tab').forEach(t => t.classList.remove('active'));
  const tab = document.getElementById('tab-'+id);
  if (tab) tab.classList.add('active');

  const detail = document.getElementById('subject-detail');
  if (!detail) return;
  detail.style.display = 'block';
  document.getElementById('det-title').innerText = s.n;
  document.getElementById('det-desc').innerText = s.d;
  document.getElementById('det-color-bar').style.background = s.color;

  document.getElementById('det-resources').innerHTML = s.res.map(r => {
    const isVideo = r.type === 'video';
    const icon    = isVideo ? '▶' : '📄';
    const label   = isVideo ? 'Bideoa ikusi' : 'Deskargatu →';
    const btnStyle = isVideo
      ? 'background:#cc0000;color:#fff;padding:8px 16px;border-radius:20px;text-decoration:none;font-size:11px;font-weight:700;letter-spacing:.5px;transition:.2s;white-space:nowrap;'
      : 'background:var(--text);color:var(--bg);padding:8px 16px;border-radius:20px;text-decoration:none;font-size:11px;font-weight:700;letter-spacing:.5px;transition:.2s;white-space:nowrap;';
    return `
    <div class="resource-card">
      <div style="display:flex;align-items:center;gap:10px;">
        <span style="font-size:18px;">${isVideo ? '🎬' : '📄'}</span>
        <span style="font-size:13px;">${r.t}</span>
      </div>
      <a href="${r.l}" target="_blank" rel="noopener noreferrer" style="${btnStyle}">${icon} ${label}</a>
    </div>`;
  }).join('');

  const g = gradeData[s.id] || [0,0,0];
  const avg = ((g[0]+g[1]+g[2])/3).toFixed(2);
  document.getElementById('det-avg').innerText = avg;

  // Radar mini chart (CSS only)
  const bars = [g[0], g[1], g[2]];
  document.getElementById('det-mini-bars').innerHTML = bars.map((v,i) => `
    <div style="display:flex;flex-direction:column;align-items:center;gap:6px;">
      <div style="height:80px;width:28px;background:#f0f0f0;border-radius:8px;display:flex;align-items:flex-end;overflow:hidden;">
        <div style="width:100%;height:${v*10}%;background:${s.color};border-radius:8px;transition:height 0.8s cubic-bezier(.4,0,.2,1);"></div>
      </div>
      <small style="color:var(--sub);font-size:10px;">${i+1}. EBA</small>
    </div>`).join('');

  detail.scrollIntoView({behavior:'smooth', block:'start'});
}

// ─── TASKS ────────────────────────────────────────────────────
function renderTasks() {
  const container = document.getElementById('tasks-list');
  if (!container) return;
  const filter = document.getElementById('task-filter')?.value || 'all';
  let filtered = tasks;
  if (filter === 'pending') filtered = tasks.filter(t => !t.done);
  if (filter === 'done')    filtered = tasks.filter(t => t.done);

  container.innerHTML = filtered.length ? filtered.map(t => `
    <div class="task-item ${t.done ? 'done' : ''}" id="task-${t.id}">
      <div class="task-check" onclick="toggleTask(${t.id})">
        ${t.done ? '✓' : ''}
      </div>
      <div class="task-content">
        <div class="task-title">${t.text}</div>
        ${t.subject ? `<span class="task-tag" style="background:${SUBJECTS.find(s=>s.id===t.subject)?.color||'#eee'}22;color:${SUBJECTS.find(s=>s.id===t.subject)?.color||'#333'}">${SUBJECTS.find(s=>s.id===t.subject)?.n||t.subject}</span>` : ''}
        ${t.due ? `<span class="task-due">📅 ${t.due}</span>` : ''}
      </div>
      <div class="task-priority priority-${t.priority||'low'}">${t.priority||'low'}</div>
      <button class="task-del" onclick="deleteTask(${t.id})">×</button>
    </div>`).join('')
  : '<div style="text-align:center;padding:60px;color:var(--sub);">Ez dago zereginik. ✓</div>';

  updateTaskStats();
}

function addTask() {
  const input = document.getElementById('task-input');
  const subj  = document.getElementById('task-subject-sel');
  const due   = document.getElementById('task-due');
  const prio  = document.getElementById('task-priority');
  if (!input?.value.trim()) return;
  tasks.unshift({
    id: Date.now(), text: input.value.trim(),
    subject: subj?.value || '', due: due?.value || '',
    priority: prio?.value || 'low', done: false,
    created: Date.now()
  });
  input.value = '';
  save(); renderTasks();
}

function toggleTask(id) {
  const t = tasks.find(x => x.id === id);
  if (t) { t.done = !t.done; save(); renderTasks(); }
}

function deleteTask(id) {
  tasks = tasks.filter(x => x.id !== id);
  save(); renderTasks();
}

function updateTaskStats() {
  const total = tasks.length;
  const done  = tasks.filter(t => t.done).length;
  const pct   = total ? Math.round(done/total*100) : 0;
  const el = document.getElementById('task-progress-fill');
  if (el) el.style.width = pct + '%';
  const lbl = document.getElementById('task-progress-label');
  if (lbl) lbl.innerText = `${done}/${total} eginda (${pct}%)`;
}

// ─── NOTES ────────────────────────────────────────────────────
function renderNotes() {
  const list = document.getElementById('notes-sidebar');
  if (!list) return;
  const q = document.getElementById('notes-search')?.value.toLowerCase() || '';
  const filtered = notes.filter(n => n.t.toLowerCase().includes(q) || n.b.toLowerCase().includes(q));
  list.innerHTML = filtered.map(n => `
    <div class="note-preview ${n.id === currentNoteId ? 'active' : ''}" onclick="selectNote(${n.id})" style="${n.id===currentNoteId?'':''}border-left:3px solid ${n.color||'#ffd93d'}">
      <div style="font-weight:700;font-size:14px;">${n.t || 'Hutsik'}</div>
      <div style="font-size:11px;color:var(--sub);margin-top:3px;">${(n.b||'').slice(0,40)}…</div>
      <button class="del-btn" onclick="delNote(event,${n.id})">×</button>
    </div>`).join('');
}

function selectNote(id) {
  currentNoteId = id;
  const n = notes.find(x => x.id === id);
  if (!n) return;
  document.getElementById('note-title').value = n.t;
  document.getElementById('note-body').value  = n.b;
  currentNoteColor = n.color || '#ffd93d';
  document.querySelectorAll('.color-dot').forEach(d => {
    d.classList.toggle('active', d.dataset.color === currentNoteColor);
  });
  renderNotes();
}

function addNote() {
  const n = { id: Date.now(), t:'Ohar berria', b:'', color:'#ffd93d', created: Date.now() };
  notes.unshift(n); save(); selectNote(n.id); renderNotes();
}

function saveNotes() {
  const n = notes.find(x => x.id === currentNoteId);
  if (n) {
    n.t = document.getElementById('note-title').value;
    n.b = document.getElementById('note-body').value;
    n.color = currentNoteColor;
    save(); renderNotes();
  }
}

function delNote(e, id) {
  e.stopPropagation();
  notes = notes.filter(x => x.id !== id);
  save();
  if (currentNoteId === id) currentNoteId = notes[0]?.id;
  renderNotes();
  if (currentNoteId) selectNote(currentNoteId);
}

function setNoteColor(color) {
  currentNoteColor = color;
  document.querySelectorAll('.color-dot').forEach(d => d.classList.toggle('active', d.dataset.color === color));
  saveNotes();
}

// ─── CALENDAR ─────────────────────────────────────────────────
let calViewDate = new Date();

function renderCalendar() {
  const year  = calViewDate.getFullYear();
  const month = calViewDate.getMonth();
  const monthNames = ['Urtarrila','Otsaila','Martxoa','Apirila','Maiatza','Ekaina','Uztaila','Abuztua','Iraila','Urria','Azaroa','Abendua'];
  const el = document.getElementById('cal-month-title');
  if (el) el.innerText = `${monthNames[month]} ${year}`;

  const grid = document.getElementById('cal-grid');
  if (!grid) return;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const offset = (firstDay + 6) % 7; // Mon start
  const today = new Date();

  let html = '';
  for (let i=0; i<offset; i++) html += '<div class="cal-day empty"></div>';
  for (let d=1; d<=daysInMonth; d++) {
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const dayEvents = events.filter(e => e.date === dateStr);
    const isToday = today.getFullYear()===year && today.getMonth()===month && today.getDate()===d;
    html += `<div class="cal-day ${isToday?'today':''}" onclick="openDay('${dateStr}')">
      <span class="cal-day-num">${d}</span>
      ${dayEvents.map(e => `<div class="cal-event-dot" style="background:${e.color||'#000'}" title="${e.title}"></div>`).join('')}
    </div>`;
  }
  grid.innerHTML = html;

  // Upcoming list
  const listEl = document.getElementById('upcoming-events');
  if (listEl) {
    const now = new Date();
    const upcoming = events.filter(e => new Date(e.date) >= now).sort((a,b)=>new Date(a.date)-new Date(b.date)).slice(0,5);
    listEl.innerHTML = upcoming.length
      ? upcoming.map(e => `<div class="event-list-item"><div class="event-color-bar" style="background:${e.color||'#000'}"></div><div><strong>${e.title}</strong><br><small style="color:var(--sub)">${e.date}</small></div><button onclick="deleteEvent('${e.id}')" style="margin-left:auto;background:none;border:none;color:#ccc;cursor:pointer;font-size:18px;">×</button></div>`).join('')
      : '<p style="color:var(--sub);font-size:13px;">Ez dago gertaerarik.</p>';
  }
}

function calPrev() { calViewDate.setMonth(calViewDate.getMonth()-1); renderCalendar(); }
function calNext() { calViewDate.setMonth(calViewDate.getMonth()+1); renderCalendar(); }

function openDay(dateStr) {
  const modal = document.getElementById('event-modal');
  if (!modal) return;
  document.getElementById('event-date-input').value = dateStr;
  modal.style.display = 'flex';
}

function closeEventModal() {
  const modal = document.getElementById('event-modal');
  if (modal) modal.style.display = 'none';
}

function addEvent() {
  const title = document.getElementById('event-title-input')?.value.trim();
  const date  = document.getElementById('event-date-input')?.value;
  const color = document.getElementById('event-color-input')?.value || '#ff6b35';
  if (!title || !date) return;
  events.push({ id: Date.now().toString(), title, date, color });
  save(); closeEventModal(); renderCalendar();
  document.getElementById('event-title-input').value = '';
}

function deleteEvent(id) {
  events = events.filter(e => e.id !== id);
  save(); renderCalendar();
}

// ─── STATS ────────────────────────────────────────────────────
function renderStats() {
  // GPA per subject bar chart
  const chartEl = document.getElementById('stats-chart');
  if (!chartEl) return;
  chartEl.innerHTML = SUBJECTS.map(s => {
    const g = gradeData[s.id] || [0,0,0];
    const avg = ((g[0]+g[1]+g[2])/3).toFixed(1);
    const color = avg >= 7 ? '#2ecc71' : avg >= 5 ? '#f39c12' : '#e74c3c';
    return `<div class="stats-bar-item">
      <div class="stats-bar-label">${s.icon} ${s.n}</div>
      <div class="stats-bar-wrap">
        <div class="stats-bar-fill" style="width:${avg*10}%;background:${color};"></div>
        <span class="stats-bar-val">${avg}</span>
      </div>
    </div>`;
  }).join('');

  // EBA radar (simplified as 3-column comparison)
  const ebaEl = document.getElementById('stats-eba');
  if (ebaEl) {
    const ebaAvg = [0,0,0];
    SUBJECTS.forEach(s => {
      const g = gradeData[s.id] || [0,0,0];
      ebaAvg[0] += g[0]; ebaAvg[1] += g[1]; ebaAvg[2] += g[2];
    });
    const n = SUBJECTS.length;
    ebaEl.innerHTML = [0,1,2].map(i => {
      const val = (ebaAvg[i]/n).toFixed(2);
      return `<div class="eba-stat-card">
        <div class="eba-stat-num" style="color:${val>=7?'#2ecc71':val>=5?'#f39c12':'#e74c3c'}">${val}</div>
        <div class="eba-stat-label">${i+1}. EBA batez besteko</div>
      </div>`;
    }).join('');
  }

  // Tasks stats
  const totalT = tasks.length, doneT = tasks.filter(t=>t.done).length;
  const taskStatsEl = document.getElementById('stats-tasks');
  if (taskStatsEl) {
    taskStatsEl.innerHTML = `
      <div class="stats-mini-card"><div class="stats-mini-num">${totalT}</div><div class="stats-mini-lbl">Zereginen guztira</div></div>
      <div class="stats-mini-card"><div class="stats-mini-num" style="color:#2ecc71">${doneT}</div><div class="stats-mini-lbl">Eginda</div></div>
      <div class="stats-mini-card"><div class="stats-mini-num" style="color:#e74c3c">${totalT-doneT}</div><div class="stats-mini-lbl">Zain</div></div>
      <div class="stats-mini-card"><div class="stats-mini-num">${STATE.streak}</div><div class="stats-mini-lbl">Egun segida</div></div>
    `;
  }

  // Best & worst subject
  let best = null, worst = null, bestVal = -1, worstVal = 11;
  SUBJECTS.forEach(s => {
    const g = gradeData[s.id] || [0,0,0];
    const avg = (g[0]+g[1]+g[2])/3;
    if (avg > bestVal)  { bestVal = avg; best = s; }
    if (avg < worstVal) { worstVal = avg; worst = s; }
  });
  const bestEl = document.getElementById('stats-best');
  if (bestEl && best) bestEl.innerHTML = `<span style="font-size:28px">${best.icon}</span> <strong>${best.n}</strong> <span style="color:#2ecc71;font-weight:800;">${bestVal.toFixed(1)}</span>`;
  const worstEl = document.getElementById('stats-worst');
  if (worstEl && worst) worstEl.innerHTML = `<span style="font-size:28px">${worst.icon}</span> <strong>${worst.n}</strong> <span style="color:#e74c3c;font-weight:800;">${worstVal.toFixed(1)}</span>`;
}

// ─── POMODORO ─────────────────────────────────────────────────
function initPomodoro() {
  updatePomodoroDisplay();
  const countEl = document.getElementById('pomo-count');
  if (countEl) countEl.innerText = STATE.pomodoros;
}

function updatePomodoroDisplay() {
  const m = String(Math.floor(STATE.timerSeconds / 60)).padStart(2,'0');
  const s = String(STATE.timerSeconds % 60).padStart(2,'0');
  const el = document.getElementById('pomo-timer');
  if (el) el.innerText = `${m}:${s}`;
  const ring = document.getElementById('pomo-ring');
  if (ring) {
    const total = STATE.timerMode === 'work' ? 25*60 : 5*60;
    const pct = STATE.timerSeconds / total;
    const circumference = 2 * Math.PI * 120;
    ring.style.strokeDashoffset = circumference * (1 - pct);
  }
}

function togglePomodoro() {
  if (STATE.timerRunning) {
    clearInterval(STATE.timerInterval);
    STATE.timerRunning = false;
    document.getElementById('pomo-btn').innerText = '▶ Hasi';
  } else {
    STATE.timerRunning = true;
    document.getElementById('pomo-btn').innerText = '⏸ Pausatu';
    STATE.timerInterval = setInterval(() => {
      STATE.timerSeconds--;
      updatePomodoroDisplay();
      if (STATE.timerSeconds <= 0) {
        clearInterval(STATE.timerInterval);
        STATE.timerRunning = false;
        document.getElementById('pomo-btn').innerText = '▶ Hasi';
        if (STATE.timerMode === 'work') {
          STATE.pomodoros++;
          const c = document.getElementById('pomo-count');
          if (c) c.innerText = STATE.pomodoros;
          setTimerMode('break');
        } else {
          setTimerMode('work');
        }
        pomodoroNotify();
      }
    }, 1000);
  }
}

function setTimerMode(mode) {
  if (STATE.timerRunning) { clearInterval(STATE.timerInterval); STATE.timerRunning = false; }
  STATE.timerMode = mode;
  STATE.timerSeconds = mode === 'work' ? 25*60 : 5*60;
  document.getElementById('pomo-btn').innerText = '▶ Hasi';
  document.querySelectorAll('.pomo-mode-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
  document.getElementById('pomo-label').innerText = mode === 'work' ? 'Lan denbora' : 'Atsedenaldia';
  updatePomodoroDisplay();
}

function resetPomodoro() {
  clearInterval(STATE.timerInterval);
  STATE.timerRunning = false;
  STATE.timerSeconds = STATE.timerMode === 'work' ? 25*60 : 5*60;
  document.getElementById('pomo-btn').innerText = '▶ Hasi';
  updatePomodoroDisplay();
}

function pomodoroNotify() {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(STATE.timerMode === 'work' ? '☕ Atseden denbora!' : '💪 Lan denbora!');
  }
  if (window.AudioContext || window.webkitAudioContext) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = 880; g.gain.value = 0.3;
      o.start(); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1); o.stop(ctx.currentTime + 1);
    } catch(e){}
  }
}

// ─── HABITS ───────────────────────────────────────────────────
function renderHabits() {
  const el = document.getElementById('habits-list');
  if (!el) return;
  el.innerHTML = habits.map(h => `
    <div class="habit-item ${h.done ? 'habit-done' : ''}">
      <div class="habit-check" onclick="toggleHabit(${h.id})">${h.done ? '✓' : ''}</div>
      <div class="habit-info">
        <div class="habit-name">${h.name}</div>
        <div class="habit-streak">🔥 ${h.streak} eguneko segida</div>
      </div>
      <button class="habit-del" onclick="deleteHabit(${h.id})">×</button>
    </div>`).join('');

  const doneCount = habits.filter(h=>h.done).length;
  const pct = habits.length ? Math.round(doneCount/habits.length*100) : 0;
  const ring = document.getElementById('habit-ring-fill');
  if (ring) {
    const c = 2*Math.PI*54;
    ring.style.strokeDashoffset = c - (c * pct / 100);
  }
  const pctEl = document.getElementById('habit-pct');
  if (pctEl) pctEl.innerText = pct + '%';
}

function toggleHabit(id) {
  const h = habits.find(x => x.id === id);
  if (h) { h.done = !h.done; if (h.done) h.streak++; save(); renderHabits(); }
}

function deleteHabit(id) {
  habits = habits.filter(x => x.id !== id); save(); renderHabits();
}

function addHabit() {
  const input = document.getElementById('habit-input');
  if (!input?.value.trim()) return;
  habits.push({ id: Date.now(), name: input.value.trim(), done: false, streak: 0 });
  input.value = ''; save(); renderHabits();
}

// ─── DARK MODE ────────────────────────────────────────────────
function toggleDarkMode() {
  STATE.darkMode = !STATE.darkMode;
  document.body.classList.toggle('dark', STATE.darkMode);
  localStorage.setItem('iak_dark', STATE.darkMode);
  const btn = document.getElementById('dark-toggle');
  if (btn) btn.innerText = STATE.darkMode ? '☀' : '☾';
}

// ─── CANVAS BACKGROUNDS ───────────────────────────────────────
function initCanvases() {
  document.querySelectorAll('.section-canvas').forEach(canvas => {
    const ctx = canvas.getContext('2d');
    canvas.width  = canvas.offsetWidth  || window.innerWidth;
    canvas.height = canvas.offsetHeight || 600;
    const type = canvas.dataset.type;
    if (type === 'dots')    animateDots(ctx, canvas);
    if (type === 'waves')   animateWaves(ctx, canvas);
    if (type === 'circles') animateCircles(ctx, canvas);
    if (type === 'lines')   animateLines(ctx, canvas);
    if (type === 'grid')    animateGrid(ctx, canvas);
    if (type === 'blobs')   animateBlobs(ctx, canvas);
    if (type === 'stars')   animateStars(ctx, canvas);
    if (type === 'rings')   animateRings(ctx, canvas);
  });
}

function animateDots(ctx, c) {
  const dots = Array.from({length:40}, () => ({x:Math.random()*c.width, y:Math.random()*c.height, r:Math.random()*3+1, vx:(Math.random()-.5)*.4, vy:(Math.random()-.5)*.4}));
  function draw() {
    ctx.clearRect(0,0,c.width,c.height);
    dots.forEach(d => {
      d.x+=d.vx; d.y+=d.vy;
      if(d.x<0||d.x>c.width)  d.vx*=-1;
      if(d.y<0||d.y>c.height) d.vy*=-1;
      ctx.beginPath(); ctx.arc(d.x,d.y,d.r,0,Math.PI*2);
      ctx.fillStyle='rgba(0,0,0,0.06)'; ctx.fill();
    });
    dots.forEach((a,i) => dots.slice(i+1).forEach(b => {
      const dist = Math.hypot(a.x-b.x, a.y-b.y);
      if (dist < 120) { ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.strokeStyle=`rgba(0,0,0,${0.04*(1-dist/120)})`; ctx.stroke(); }
    }));
    requestAnimationFrame(draw);
  }
  draw();
}

function animateWaves(ctx, c) {
  let t = 0;
  function draw() {
    ctx.clearRect(0,0,c.width,c.height);
    [0.3,0.2,0.1].forEach((alpha, i) => {
      ctx.beginPath();
      for (let x=0; x<=c.width; x+=5) {
        const y = c.height*0.5 + Math.sin(x*0.01 + t + i) * (30+i*20) + Math.sin(x*0.02 - t*0.7)*15;
        i===0 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
      }
      ctx.strokeStyle=`rgba(0,0,0,${alpha})`; ctx.lineWidth=1.5; ctx.stroke();
    });
    t += 0.015;
    requestAnimationFrame(draw);
  }
  draw();
}

function animateCircles(ctx, c) {
  let t = 0;
  const circles = Array.from({length:8},(_,i)=>({cx:c.width*(0.2+Math.random()*0.6), cy:c.height*(0.2+Math.random()*0.6), r:30+i*15, phase:Math.random()*Math.PI*2}));
  function draw() {
    ctx.clearRect(0,0,c.width,c.height);
    circles.forEach(ci => {
      const pulse = ci.r + Math.sin(t + ci.phase)*8;
      ctx.beginPath(); ctx.arc(ci.cx, ci.cy, pulse, 0, Math.PI*2);
      ctx.strokeStyle='rgba(0,0,0,0.05)'; ctx.lineWidth=1; ctx.stroke();
    });
    t += 0.02;
    requestAnimationFrame(draw);
  }
  draw();
}

function animateLines(ctx, c) {
  let t = 0;
  function draw() {
    ctx.clearRect(0,0,c.width,c.height);
    for (let i=0; i<8; i++) {
      ctx.beginPath();
      ctx.moveTo(0, c.height*0.1*i + Math.sin(t+i)*20);
      ctx.bezierCurveTo(c.width*0.33, c.height*0.1*i + Math.cos(t*0.7+i)*30, c.width*0.66, c.height*0.1*i + Math.sin(t*0.5+i)*25, c.width, c.height*0.1*i + Math.cos(t+i)*20);
      ctx.strokeStyle=`rgba(0,0,0,0.04)`; ctx.lineWidth=1; ctx.stroke();
    }
    t+=0.01; requestAnimationFrame(draw);
  }
  draw();
}

function animateGrid(ctx, c) {
  let t = 0;
  function draw() {
    ctx.clearRect(0,0,c.width,c.height);
    const size = 60;
    for(let x=0; x<c.width; x+=size) {
      for(let y=0; y<c.height; y+=size) {
        const wave = Math.sin(x*0.02 + y*0.02 + t) * 5;
        ctx.beginPath(); ctx.arc(x+wave, y+wave, 2, 0, Math.PI*2);
        ctx.fillStyle=`rgba(0,0,0,0.06)`; ctx.fill();
      }
    }
    t+=0.03; requestAnimationFrame(draw);
  }
  draw();
}

function animateBlobs(ctx, c) {
  let t = 0;
  const blobs = [{cx:c.width*.3,cy:c.height*.4,r:80},{cx:c.width*.7,cy:c.height*.6,r:60},{cx:c.width*.5,cy:c.height*.2,r:50}];
  function draw() {
    ctx.clearRect(0,0,c.width,c.height);
    blobs.forEach((b,i) => {
      ctx.beginPath();
      for(let a=0;a<Math.PI*2;a+=0.1){
        const r = b.r + Math.sin(a*3+t+i)*15 + Math.cos(a*2-t*.8)*10;
        const x = b.cx + r*Math.cos(a); const y = b.cy + r*Math.sin(a);
        a<0.1 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
      }
      ctx.closePath(); ctx.fillStyle=`rgba(0,0,0,0.04)`; ctx.fill();
    });
    t+=0.02; requestAnimationFrame(draw);
  }
  draw();
}

function animateStars(ctx, c) {
  const pts = Array.from({length:60},()=>({x:Math.random()*c.width, y:Math.random()*c.height, r:Math.random()*1.5+.5, a:Math.random(), da:(Math.random()-.5)*.01}));
  function draw() {
    ctx.clearRect(0,0,c.width,c.height);
    pts.forEach(p => {
      p.a += p.da; if(p.a<0.02||p.a>0.2) p.da*=-1;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(0,0,0,${p.a})`; ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

function animateRings(ctx, c) {
  let t = 0;
  function draw() {
    ctx.clearRect(0,0,c.width,c.height);
    const cx=c.width/2, cy=c.height/2;
    for(let i=1;i<=6;i++){
      ctx.beginPath();
      ctx.arc(cx,cy, 40*i + Math.sin(t+i)*10, 0, Math.PI*2);
      ctx.strokeStyle=`rgba(0,0,0,${0.04/i*2})`; ctx.lineWidth=1; ctx.stroke();
    }
    t+=0.02; requestAnimationFrame(draw);
  }
  draw();
}

// ─── SEARCH / COMMAND PALETTE ─────────────────────────────────
function openCommandPalette() {
  const pal = document.getElementById('cmd-palette');
  if (pal) { pal.style.display='flex'; document.getElementById('cmd-input').focus(); }
}
function closeCommandPalette() {
  const pal = document.getElementById('cmd-palette'); if(pal) pal.style.display='none';
}
function cmdSearch(e) {
  if (e.key === 'Escape') { closeCommandPalette(); return; }
  const q = e.target.value.toLowerCase();
  const items = [
    {label:'🏠 Hasiera', action:()=>navigate('home')},
    {label:'📊 Notak', action:()=>navigate('grades')},
    {label:'📚 Akademia', action:()=>navigate('academy')},
    {label:'📝 Oharrak', action:()=>navigate('notes')},
    {label:'✅ Zereginak', action:()=>navigate('tasks')},
    {label:'📅 Egutegia', action:()=>navigate('calendar')},
    {label:'📈 Estatistikak', action:()=>navigate('stats')},
    {label:'🍅 Pomodoro', action:()=>navigate('pomodoro')},
    {label:'🌱 Ohiturak', action:()=>navigate('habits')},
    {label:'🌙 Modu iluna', action:toggleDarkMode},
  ];
  const filtered = items.filter(i => i.label.toLowerCase().includes(q));
  const resultsEl = document.getElementById('cmd-results');
  if (resultsEl) {
    resultsEl.innerHTML = filtered.map((item,i) => `
      <div class="cmd-item" onclick="(${item.action.toString()})();closeCommandPalette();">${item.label}</div>`).join('') || '<div style="padding:15px;color:var(--sub);">Ez da ezer aurkitu.</div>';
  }
}

// ─── KEYBOARD SHORTCUTS ───────────────────────────────────────
document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); openCommandPalette(); }
  if (e.key === 'Escape') closeCommandPalette();
});

// ─── INIT ─────────────────────────────────────────────────────
window.onload = () => {
  if (localStorage.getItem('iak_dark') === 'true') { STATE.darkMode = true; document.body.classList.add('dark'); }
  updateStreak();
  initGrades();
  renderNotes();
  if (notes.length) selectNote(notes[0].id);
  renderHome();

  // Populate task subject selector
  const sel = document.getElementById('task-subject-sel');
  if (sel) sel.innerHTML = '<option value="">-- Ikasgaia --</option>' + SUBJECTS.map(s=>`<option value="${s.id}">${s.n}</option>`).join('');

  setTimeout(() => {
    document.getElementById('intro-overlay').style.display='none';
    initCanvases();
    // Stagger entrance animations
    document.querySelectorAll('.card, .subj-tab').forEach((el,i) => {
      el.style.opacity='0'; el.style.transform='translateY(20px)';
      setTimeout(()=>{ el.style.transition='opacity .4s ease, transform .4s ease'; el.style.opacity='1'; el.style.transform='translateY(0)'; }, i*40);
    });
  }, 2800);
};