/*
 * WBPSC Clerkship Study Hub — app logic.
 * Plain browser JavaScript (no framework, no network calls). Works from file:// and from any static server.
 * All user data is kept in localStorage under one key.
 */
(function () {
  'use strict';

  var NS = window.WBPSC;
  var STORE_KEY = 'wbpsc-clerkship-v1';
  var DAY = 86400000;
  var NEG = 0.25;
  var FULL_MINUTES = 90;

  // ---------- small helpers ----------
  function esc(s) {
    return String(s === undefined || s === null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function toISO(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function parseISO(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || ''));
    if (!m) return null;
    var d = new Date(+m[1], +m[2] - 1, +m[3]);
    return isNaN(d.getTime()) ? null : d;
  }
  function today() { var d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
  function daysBetween(a, b) { return Math.round((b.getTime() - a.getTime()) / DAY); }
  function addDays(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); }
  function fmtDate(d) { return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); }
  function fmtTime(sec) {
    sec = Math.max(0, Math.floor(sec));
    return pad(Math.floor(sec / 60)) + ':' + pad(sec % 60);
  }
  function round2(x) { return Math.round(x * 100) / 100; }
  function round1(x) { return Math.round(x * 10) / 10; }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
  function chapterById(id) { return NS.chapterById[id]; }
  function chapterTitle(id) { var c = chapterById(id); return c ? c.title : id; }
  var SUBJECT_NAMES = {
    arith: 'Arithmetic', english: 'English', gs: 'General Studies',
    p2a: 'Part-II Group-A (English)', p2b: 'Part-II Group-B (chosen language)'
  };
  var SECTION_NAMES = { english: 'English', gs: 'General Studies', arith: 'Arithmetic' };
  var SECTION_MAX = { english: 30, gs: 40, arith: 30 };

  // Pick n questions, rotating across topics so each topic is represented.
  function pickStratified(items, n) {
    var groups = {};
    items.forEach(function (it) { (groups[it.topic] = groups[it.topic] || []).push(it); });
    var topics = shuffle(Object.keys(groups));
    topics.forEach(function (t) { groups[t] = shuffle(groups[t]); });
    var out = [];
    var idx = {};
    topics.forEach(function (t) { idx[t] = 0; });
    var progressed = true;
    while (out.length < n && progressed) {
      progressed = false;
      for (var k = 0; k < topics.length && out.length < n; k++) {
        var t = topics[k];
        if (idx[t] < groups[t].length) { out.push(groups[t][idx[t]++]); progressed = true; }
      }
    }
    return shuffle(out);
  }

  // ---------- persistent state ----------
  var DEFAULT_STATE = {
    examDate: '2026-12-01',  // assumption: official Part-I is "tentatively December 2026"
    checklist: {},
    chapterDone: {},
    practice: {},            // topic id -> { a: attempted, c: correct }
    mocks: [],               // completed tests, newest first
    activeMock: null,        // test in progress (survives reloads)
    typing: { en: [], bn: [] },
    planDone: {},
    affairs: []
  };

  function loadState() {
    var base = clone(DEFAULT_STATE);
    try {
      var raw = window.localStorage.getItem(STORE_KEY);
      if (raw) {
        var saved = JSON.parse(raw);
        Object.keys(base).forEach(function (k) { if (saved[k] !== undefined) base[k] = saved[k]; });
      }
    } catch (e) { /* storage blocked or corrupt: start fresh */ }
    return base;
  }
  var state = loadState();
  function saveState() {
    try { window.localStorage.setItem(STORE_KEY, JSON.stringify(state)); }
    catch (e) { toast('Could not save in this browser. Your latest change is only in this open page.'); }
  }

  // ---------- toast and tickers ----------
  var toastTimer = null;
  function toast(msg) {
    var el = document.getElementById('toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toast';
      el.className = 'toast';
      el.setAttribute('role', 'status');
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, 2600);
  }
  var tickers = [];
  function addTicker(id) { tickers.push(id); }
  function clearTickers() { tickers.forEach(clearInterval); tickers = []; }

  // ---------- practice / mock / typing module state (in memory) ----------
  var practice = { subject: 'arith', chapter: 'all', count: 10 };
  var session = null;
  var resultFilter = 'all';
  var affairFilter = 'all';
  var typing = { lang: 'en', minutes: 3, order: 0, status: 'idle', startAt: 0, typed: '', result: null };

  // ---------- routing ----------
  var ROUTES = [
    { id: 'home', label: 'Dashboard', render: viewHome },
    { id: 'syllabus', label: 'Syllabus', render: viewSyllabus },
    { id: 'notes', label: 'Notes', render: viewNotes },
    { id: 'practice', label: 'Practice', render: viewPractice },
    { id: 'mock', label: 'Mock test', render: viewMock },
    { id: 'writing', label: 'Part-II writing', render: viewWriting },
    { id: 'typing', label: 'Typing', render: viewTyping },
    { id: 'planner', label: 'Study planner', render: viewPlanner },
    { id: 'affairs', label: 'Current affairs', render: viewAffairs },
    { id: 'resources', label: 'Resources', render: viewResources }
  ];

  function parseHash() {
    var h = (window.location.hash || '#/home').replace(/^#\/?/, '');
    var i = h.indexOf('/');
    var page = i < 0 ? h : h.slice(0, i);
    var arg = i < 0 ? '' : h.slice(i + 1);
    try { arg = decodeURIComponent(arg); } catch (e) { /* keep raw */ }
    return { page: page || 'home', arg: arg };
  }

  function renderNav(active) {
    var nav = document.getElementById('nav');
    nav.innerHTML = ROUTES.map(function (r) {
      return '<a href="#/' + r.id + '"' + (r.id === active ? ' class="active" aria-current="page"' : '') + '>' + esc(r.label) + '</a>';
    }).join('');
  }

  function route(scroll) {
    clearTickers();
    var r = parseHash();
    var def = ROUTES.filter(function (x) { return x.id === r.page; })[0] || ROUTES[0];
    if (def.id !== 'practice') presetArg = null; // leaving Practice: next visit starts afresh
    renderNav(def.id);
    var app = document.getElementById('app');
    app.innerHTML = def.render(r.arg);
    document.title = def.label + ' · WBPSC Clerkship Study Hub';
    afterRender(def.id);
    if (scroll) window.scrollTo(0, 0);
  }
  function rerender() { route(false); }

  function afterRender(page) {
    if (page === 'mock' && state.activeMock && !state.activeMock.finished) startMockTicker();
    if (page === 'typing' && typing.status === 'running') startTypingTicker();
  }

  // ---------- shared views ----------
  function card(title, body, cls) {
    return '<section class="card' + (cls ? ' ' + cls : '') + '">' + (title ? '<h2>' + title + '</h2>' : '') + body + '</section>';
  }
  function badgeFor(c) {
    if (c && c.official === false) return '<span class="badge extra">extra</span>';
    return '';
  }
  function doneBadge(id) { return state.chapterDone[id] ? ' <span class="badge done">read</span>' : ''; }
  function notFound(msg) {
    return card('Not found', '<p>' + esc(msg || 'This page does not exist.') + '</p><p><a class="btn" href="#/home">Back to dashboard</a></p>');
  }

  // Render one MCQ with options. o: { selected, reveal, act, disabled }.
  function renderQuestion(it, o) {
    var meta = (SUBJECT_NAMES[it.subject] || '') + (it.topic ? ' · ' + chapterTitle(it.topic) : '');
    var opts = it.options.map(function (text, i) {
      var cls = 'opt';
      if (o.reveal) {
        if (i === it.answer) cls += ' correct';
        else if (i === o.selected) cls += ' wrong';
      } else if (o.selected === i) {
        cls += ' selected';
      }
      var attrs = o.act ? ' data-act="' + o.act + '" data-i="' + i + '"' : '';
      return '<button type="button" class="' + cls + '"' + attrs + (o.disabled ? ' disabled' : '') + '>' +
        '<span class="letter">' + 'ABCD'.charAt(i) + '</span><span>' + esc(text) + '</span></button>';
    }).join('');
    var verdict = '';
    if (o.reveal) {
      verdict = o.selected === it.answer
        ? '<div class="verdict ok">Correct.</div>'
        : '<div class="verdict bad">' + (o.selected === undefined || o.selected === null ? 'Not answered.' : 'Wrong. The correct answer is ' + 'ABCD'.charAt(it.answer) + ': ' + esc(it.options[it.answer]) + '.') + '</div>';
    }
    var exp = o.reveal ? '<div class="explain"><strong>Explanation:</strong> ' + esc(it.exp) + '</div>' : '';
    return '<div class="qcard"><div class="qmeta">' + esc(meta) + '</div>' +
      '<p class="qtext">' + esc(it.q) + '</p><div class="options">' + opts + '</div>' + verdict + exp + '</div>';
  }

  // ---------- VIEW: dashboard ----------
  function practiceTotals() {
    var a = 0, c = 0;
    Object.keys(state.practice).forEach(function (k) { a += state.practice[k].a; c += state.practice[k].c; });
    return { a: a, c: c };
  }
  function bestTyping(lang) {
    return (state.typing[lang] || []).reduce(function (m, r) { return Math.max(m, r.net); }, 0);
  }

  function viewHome() {
    var ex = NS.exam;
    var examDay = parseISO(state.examDate);
    var t = today();
    var daysLeft = examDay ? daysBetween(t, examDay) : null;
    var applyDeadline = new Date(2026, 9, 26);
    var daysToApply = daysBetween(t, applyDeadline);
    var doneCount = Object.keys(state.chapterDone).filter(function (k) { return state.chapterDone[k] && chapterById(k); }).length;
    var pt = practiceTotals();
    var acc = pt.a ? Math.round(pt.c / pt.a * 100) : null;
    var mocks = state.mocks;
    var lastMock = mocks[0];
    var activeBanner = (state.activeMock && !state.activeMock.finished)
      ? card('', '<p><strong>You have a test in progress.</strong> <a class="btn primary small" href="#/mock">Resume test</a></p>', 'warn-card')
      : '';

    var dateRows = ex.dates.map(function (d) {
      var tag = d.tag === 'tentative' ? '<span class="badge tentative">tentative</span>' : '<span class="badge official">official</span>';
      var note = d.note ? '<div class="small" style="margin-top:6px;color:#7a4a00">' + esc(d.note) + '</div>' : '';
      return '<tr><td>' + esc(d.label) + '</td><td><strong>' + esc(d.value) + '</strong> ' + tag + note + '</td></tr>';
    }).join('');

    var checks = ex.actions.map(function (a) {
      var done = !!state.checklist[a.id];
      var link = a.url ? ' <a href="' + esc(a.url) + '" target="_blank" rel="noopener">Open the official notice ↗</a>' : '';
      return '<label class="check' + (done ? ' done' : '') + '"><input type="checkbox" data-change="check-action" data-id="' + esc(a.id) + '"' + (done ? ' checked' : '') + '><span>' + esc(a.text) + link + '</span></label>';
    }).join('');

    var glance = '<ul>' +
      '<li><strong>Part-I:</strong> 100 MCQs, 100 marks, 90 minutes. Negative marking: 0.25 per wrong answer. Unattempted = 0.</li>' +
      '<li><strong>Sections:</strong> English 30 · General Studies 40 · Arithmetic 30.</li>' +
      '<li><strong>Part-II:</strong> descriptive, 100 marks, 60 minutes. Only a limited number of Part-I qualifiers go on to Part-II.</li>' +
      '<li><strong>Typing:</strong> qualifying. English 20 wpm or Bengali 10 wpm (as chosen in application).</li>' +
      '<li><strong>Final merit:</strong> Part-I + Part-II marks, for those who also qualify the typing test.</li>' +
      '<li><strong>Pay:</strong> Level 6 (₹22,700 – ₹58,500) plus allowances, initial appointment temporary.</li></ul>';

    var progress = '<table>' +
      '<tr><td>Chapters marked as read</td><td><strong>' + doneCount + ' / ' + NS.chapters.length + '</strong></td></tr>' +
      '<tr><td>Practice questions answered</td><td><strong>' + pt.a + '</strong>' + (acc !== null ? ' (' + acc + '% correct)' : '') + '</td></tr>' +
      '<tr><td>Full mock tests done</td><td><strong>' + mocks.filter(function (m) { return m.type === 'full'; }).length + '</strong>' +
        (lastMock ? ' · last: ' + lastMock.score + ' / ' + maxFor(lastMock.type) : '') + '</td></tr>' +
      '<tr><td>Best typing (net wpm)</td><td>English <strong>' + round1(bestTyping('en')) + '</strong> · Bengali <strong>' + round1(bestTyping('bn')) + '</strong></td></tr>' +
      '</table>';

    var quick = '<div class="row">' +
      '<a class="btn" href="#/syllabus">Syllabus</a>' +
      '<a class="btn" href="#/notes">Notes</a>' +
      '<a class="btn" href="#/practice">Practice MCQs</a>' +
      '<a class="btn" href="#/mock">Full mock test</a>' +
      '<a class="btn" href="#/writing">Part-II writing</a>' +
      '<a class="btn" href="#/typing">Typing</a>' +
      '<a class="btn" href="#/planner">Study planner</a>' +
      '<a class="btn" href="#/affairs">Current affairs</a>' +
      '</div>';

    return '' +
      '<section class="hero"><h1>' + esc(ex.name) + '</h1>' +
      '<p>' + esc(ex.advt) + ' · ' + esc(ex.posts) + '. Plan your study, learn the chapters, practise, and take full mock tests.</p></section>' +
      activeBanner +
      '<div class="grid">' +
        card('Days to the Part-I exam', '<div class="countdown">' + (daysLeft === null ? '—' : (daysLeft >= 0 ? daysLeft : 'Passed')) + '</div>' +
          '<p class="muted">Counting to <strong>' + (examDay ? fmtDate(examDay) : 'no date set') + '</strong>. This is <strong>your assumption</strong>: the official notice says Part-I is “tentatively December 2026, or thereabout”. Change the date when the Commission announces the exact date.</p>' +
          '<label class="field">Exam date (your assumption)<input type="date" value="' + esc(state.examDate) + '" data-change="exam-date"></label>') +
        card('Application deadline', '<div class="countdown">' + (daysToApply >= 0 ? daysToApply : 'Closed') + '</div>' +
          '<p>Apply online <strong>and</strong> pay the fee by <strong>26 Oct 2026, 3:30 PM</strong>.</p>' +
          '<p>Edit window: <strong>28 Oct – 1 Nov 2026</strong> (one edit only). Upload the category certificate in this window if required.</p>', 'warn-card') +
      '</div>' +
      '<div class="grid">' +
        card('Official dates', '<table>' + dateRows + '</table><p class="small muted">Source: official detailed advertisement dated 06.10.2026 (psc.wb.gov.in). The official notice overrides this site.</p>') +
        card('Your action checklist', checks + '<p class="small muted">Ticks are saved in this browser.</p>') +
      '</div>' +
      '<div class="grid">' +
        card('Exam at a glance', glance) +
        card('Your progress', progress + '<div class="row" style="margin-top:8px"><a class="btn small" href="#/planner">Open study plan</a></div>') +
      '</div>' +
      card('Start here', quick, 'soft');
  }

  function maxFor(type) {
    if (type === 'full') return 100;
    return SECTION_MAX[type] || 100;
  }

  // ---------- VIEW: syllabus ----------
  function chapterRow(id) {
    var c = chapterById(id);
    if (!c) return '';
    var links;
    if (c.subject === 'p2a' || c.subject === 'p2b') {
      links = '<a href="#/notes/' + id + '">Notes</a> · <a href="#/writing">Writing practice</a>';
    } else {
      links = '<a href="#/notes/' + id + '">Notes</a> · <a href="#/practice/' + id + '">Practice</a>';
    }
    return '<tr><td><input type="checkbox" data-change="chapter-done" data-id="' + id + '"' + (state.chapterDone[id] ? ' checked' : '') + ' aria-label="Mark ' + esc(c.title) + ' as read"></td>' +
      '<td><strong>' + esc(c.title) + '</strong> ' + badgeFor(c) + doneBadge(id) + '</td>' +
      '<td><ul class="small" style="margin:0;padding-left:18px">' + c.topics.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></td>' +
      '<td class="small">' + links + '</td></tr>';
  }

  function viewSyllabus() {
    var ex = NS.exam;
    var pattern = '<div style="overflow-x:auto"><table><tr><th>Part</th><th>Type</th><th>Questions / marks</th><th>Time</th><th>Marking</th></tr>' +
      '<tr><td>Part-I</td><td>Objective MCQs</td><td>100 questions · 100 marks</td><td class="nowrap">90 min</td><td>−0.25 per wrong answer; unattempted = 0</td></tr>' +
      '<tr><td>Part-II</td><td>Descriptive (writing)</td><td>100 marks (50 + 50)</td><td class="nowrap">60 min</td><td>10% of a paper’s marks deducted for identity disclosure</td></tr>' +
      '<tr><td>Typing and computer</td><td>Qualifying test</td><td>English 20 wpm or Bengali 10 wpm</td><td>—</td><td>Judged after Part-I and Part-II</td></tr></table></div>';

    var subjects = ex.subjects.map(function (s) {
      var rows = s.chapters.map(chapterRow).join('');
      var counts = s.questions ? ' · ' + s.questions + ' questions' : '';
      return '<section class="card"><h2>' + esc(s.name) + ' <span class="badge">' + esc(s.part) + '</span></h2>' +
        '<p><strong>Official scope:</strong> ' + esc(s.official) + '</p>' +
        '<p class="small muted">Marks: ' + s.marks + counts + '</p>' +
        '<div style="overflow-x:auto"><table><tr><th>Read</th><th>Chapter</th><th>What is covered</th><th>Study</th></tr>' + rows + '</table></div></section>';
    }).join('');

    var qual = '<div style="overflow-x:auto"><table><tr><th>Category</th><th>Minimum % in aggregate (Part-I + Part-II)</th></tr>' +
      ex.qualifying.map(function (q) { return '<tr><td>' + esc(q.cat) + '</td><td>' + q.pct + '%</td></tr>'; }).join('') +
      '</table></div><p class="small muted">The Commission fixes qualifying marks for each part and may relax them for reserved categories. ' + esc(ex.tieBreak) + '</p>';

    return '<h1>Syllabus and exam pattern</h1>' +
      '<p class="muted">Official scope is taken from the Scheme &amp; Syllabus. Chapters marked <span class="badge extra">extra</span> are not in the official line, but they are commonly asked. Tick a chapter when you have read its notes.</p>' +
      card('Exam pattern', pattern) +
      card('How the selection works', '<ol>' + ex.stages.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('') + '</ol>') +
      subjects +
      card('Qualifying marks (aggregate)', qual) +
      card('Eligibility and basic facts', '<ul>' +
        '<li><strong>Qualification:</strong> ' + esc(ex.eligibility[0]) + '</li>' +
        '<li><strong>Computer and typing:</strong> ' + esc(ex.eligibility[1]) + '</li>' +
        '<li><strong>Bengali:</strong> ' + esc(ex.eligibility[2]) + '</li>' +
        '<li><strong>Age:</strong> ' + esc(ex.age) + '</li>' +
        '<li><strong>Reservation:</strong> ' + esc(ex.reservation) + '</li>' +
        '<li><strong>Centres:</strong> ' + esc(ex.centres) + '</li>' +
        '<li><strong>Fee:</strong> ' + esc(ex.fee) + '</li>' +
        '<li><strong>Pay:</strong> ' + esc(ex.pay) + '</li></ul>') +
      card('Exam-day rules (from the notice)', '<ul>' + ex.rules.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ul>');
  }

  // ---------- VIEW: notes ----------
  function viewNotes(arg) {
    if (!arg) {
      var groups = NS.exam.subjects.map(function (s) {
        var cards = s.chapters.map(function (id) {
          var c = chapterById(id);
          if (!c) return '';
          return '<div class="card"><h3>' + esc(c.title) + ' ' + badgeFor(c) + doneBadge(id) + '</h3>' +
            '<p class="small muted">' + esc(c.topics.join(' · ')) + '</p>' +
            '<a class="btn small" href="#/notes/' + id + '">Read notes</a></div>';
        }).join('');
        return '<h2 style="margin-top:20px">' + esc(s.name) + '</h2><div class="grid">' + cards + '</div>';
      }).join('');
      return '<h1>Notes</h1><p class="muted">Short, exam-focused notes. Formulas and worked examples are shaded. Read a chapter, then practise it.</p>' + groups;
    }
    var c = chapterById(arg);
    if (!c || !NS.notes[arg]) return notFound('No notes for “' + arg + '”.');
    var idx = NS.chapters.indexOf(c);
    var prev = NS.chapters[idx - 1];
    var next = NS.chapters[idx + 1];
    var practiceLink = (c.subject === 'p2a' || c.subject === 'p2b')
      ? '<a class="btn primary" href="#/writing">Writing practice</a>'
      : '<a class="btn primary" href="#/practice/' + arg + '">Practise this chapter</a>';
    return '<div class="crumbs"><a href="#/notes">Notes</a> › ' + esc(SUBJECT_NAMES[c.subject]) + ' › ' + esc(c.title) + '</div>' +
      '<h1>' + esc(c.title) + ' ' + badgeFor(c) + '</h1>' +
      '<div class="card"><div class="row">' +
      '<label class="check" style="margin:0"><input type="checkbox" data-change="chapter-done" data-id="' + arg + '"' + (state.chapterDone[arg] ? ' checked' : '') + '><span>I have read these notes</span></label>' +
      '<div class="spacer"></div>' + practiceLink + '</div></div>' +
      '<article class="card notes">' + NS.notes[arg] + '</article>' +
      '<div class="row">' +
      (prev ? '<a class="btn" href="#/notes/' + prev.id + '">← ' + esc(prev.title) + '</a>' : '') +
      '<div class="spacer"></div>' +
      (next ? '<a class="btn" href="#/notes/' + next.id + '">' + esc(next.title) + ' →</a>' : '') +
      '</div>';
  }

  // ---------- VIEW: practice ----------
  function chapterOptions(subject, selected) {
    var list = NS.exam.subjects.filter(function (s) { return s.id === subject; })[0];
    var ids = list ? list.chapters : [];
    var opts = '<option value="all"' + (selected === 'all' ? ' selected' : '') + '>All chapters</option>';
    return opts + ids.map(function (id) {
      return '<option value="' + id + '"' + (selected === id ? ' selected' : '') + '>' + esc(chapterTitle(id)) + '</option>';
    }).join('');
  }

  function poolFor(subject, chapter) {
    if (subject === 'arith') return null;
    return NS.bank.filter(function (q) {
      return q.subject === subject && (chapter === 'all' || q.topic === chapter);
    });
  }

  var presetArg = null;
  function viewPractice(arg) {
    // Entering the page (or a different chapter link) starts from setup; re-renders keep the session.
    if (arg !== presetArg) {
      presetArg = arg;
      session = null;
      if (arg && chapterById(arg)) {
        var c = chapterById(arg);
        if (c.subject === 'arith' || c.subject === 'english' || c.subject === 'gs') {
          practice.subject = c.subject;
          practice.chapter = arg;
          session = null;
        } else {
          return card('Part-II practice', '<p>Part-II is practised in the Writing section.</p><a class="btn primary" href="#/writing">Go to Part-II writing</a>');
        }
      }
    }
    if (session) return renderSession();
    var available = practice.subject === 'arith'
      ? 'Unlimited (generated fresh every time)'
      : poolFor(practice.subject, practice.chapter).length + ' questions available';
    var subjectSel = '<label class="field">Subject<select data-change="practice-subject">' +
      ['arith', 'english', 'gs'].map(function (s) {
        return '<option value="' + s + '"' + (practice.subject === s ? ' selected' : '') + '>' + esc(SUBJECT_NAMES[s]) + '</option>';
      }).join('') + '</select></label>';
    var chapterSel = '<label class="field">Chapter<select data-change="practice-chapter">' + chapterOptions(practice.subject, practice.chapter) + '</select></label>';
    var countSel = '<label class="field">Questions<select data-change="practice-count">' +
      [10, 20, 30].map(function (n) { return '<option value="' + n + '"' + (practice.count === n ? ' selected' : '') + '>' + n + '</option>'; }).join('') +
      '</select></label>';

    var rec = Object.keys(state.practice).filter(function (k) { return state.practice[k].a > 0; }).map(function (k) {
      var r = state.practice[k];
      var c2 = chapterById(k);
      return '<tr><td>' + esc(c2 ? SUBJECT_NAMES[c2.subject] : '') + '</td><td>' + esc(chapterTitle(k)) + '</td><td>' + r.a + '</td><td>' + r.c + '</td><td>' + Math.round(r.c / r.a * 100) + '%</td></tr>';
    });
    var recTable = rec.length
      ? '<table><tr><th>Subject</th><th>Chapter</th><th>Attempted</th><th>Correct</th><th>Accuracy</th></tr>' + rec.join('') + '</table>'
      : '<p class="muted">No practice yet. Your results by chapter will appear here.</p>';

    return '<h1>Practice MCQs</h1>' +
      '<p class="muted">You get the answer and an explanation after each question. Arithmetic questions are generated fresh, so you never run out. Negative marking is not applied in practice mode.</p>' +
      card('Start a practice set', '<div class="row">' + subjectSel + chapterSel + countSel + '</div>' +
        '<p class="small muted">' + esc(available) + '.</p>' +
        '<button class="btn primary" data-act="practice-start">Start practice</button>') +
      card('Your practice record', recTable);
  }

  function renderSession() {
    var n = session.items.length;
    var i = session.index;
    var it = session.items[i];
    var answered = session.answers[i] !== undefined;
    var correctSoFar = session.answers.filter(function (a, k) { return a !== undefined && a === session.items[k].answer; }).length;
    var answeredCount = session.answers.filter(function (a) { return a !== undefined; }).length;
    if (session.finished) return renderPracticeSummary();
    return '<div class="row"><div class="muted">Question ' + (i + 1) + ' of ' + n + '</div><div class="spacer"></div>' +
      '<div class="muted">Correct so far: ' + correctSoFar + ' / ' + answeredCount + '</div></div>' +
      '<div class="progressbar" style="margin:6px 0 12px"><div style="width:' + Math.round((i / n) * 100) + '%"></div></div>' +
      renderQuestion(it, { selected: session.answers[i], reveal: answered, act: 'practice-answer', disabled: answered }) +
      '<div class="row" style="margin-top:12px">' +
      '<button class="btn ghost" data-act="practice-end">End session</button><div class="spacer"></div>' +
      (answered ? '<button class="btn primary" data-act="practice-next">' + (i + 1 < n ? 'Next question →' : 'See result') + '</button>' : '') +
      '</div>';
  }

  function renderPracticeSummary() {
    var n = session.items.length;
    var answered = session.answers.filter(function (a) { return a !== undefined; }).length;
    var correct = session.answers.filter(function (a, k) { return a !== undefined && a === session.items[k].answer; }).length;
    var wrongs = session.items.map(function (it, k) { return { it: it, k: k }; }).filter(function (x) {
      return session.answers[x.k] !== undefined && session.answers[x.k] !== x.it.answer;
    });
    var list = wrongs.length
      ? wrongs.map(function (x) { return renderQuestion(x.it, { selected: session.answers[x.k], reveal: true, disabled: true }); }).join('')
      : '<p class="muted">No wrong answers in this set.</p>';
    return card('Practice result', '<p><strong>' + correct + ' correct</strong> out of ' + answered + ' answered (' + n + ' in the set).' +
      (answered ? ' Accuracy: ' + Math.round(correct / answered * 100) + '%.' : '') + ' Practice has no negative marking.</p>' +
      '<div class="row"><button class="btn primary" data-act="practice-new">New practice set</button>' +
      '<a class="btn" href="#/notes' + (practice.chapter !== 'all' ? '/' + practice.chapter : '') + '">Revise notes</a></div>') +
      '<h2>Review wrong answers</h2>' + list;
  }

  // ---------- practice recording ----------
  function recordPractice(topic, correct) {
    var r = state.practice[topic] || { a: 0, c: 0 };
    r.a += 1;
    if (correct) r.c += 1;
    state.practice[topic] = r;
    saveState();
  }

  // ---------- VIEW: mock test ----------
  function buildMockItems(type) {
    var eng = pickStratified(NS.bank.filter(function (q) { return q.subject === 'english'; }), 30)
      .map(function (q) { return Object.assign({}, q, { section: 'english' }); });
    var gs = pickStratified(NS.bank.filter(function (q) { return q.subject === 'gs'; }), 40)
      .map(function (q) { return Object.assign({}, q, { section: 'gs' }); });
    var ar = NS.arith.mixed(30).map(function (q) { return Object.assign({}, q, { section: 'arith' }); });
    var parts = {
      full: [eng, gs, ar],
      english: [eng],
      gs: [gs],
      arith: [ar]
    }[type];
    var out = [];
    parts.forEach(function (p) { out = out.concat(p); });
    return out;
  }

  function mockTypeTitle(type) {
    return {
      full: 'Full mock (100 questions, 90 minutes)',
      english: 'English section test (30 questions)',
      gs: 'General Studies section test (40 questions)',
      arith: 'Arithmetic section test (30 questions)'
    }[type] || 'Test';
  }

  function viewMock(arg) {
    if (arg.indexOf('result/') === 0) return renderMockResult(arg.slice(7));
    if (state.activeMock && !state.activeMock.finished) return renderMockExam();
    return renderMockSetup();
  }

  function renderMockSetup() {
    var rows = state.mocks.slice(0, 15).map(function (m) {
      return '<tr><td>' + esc(m.date) + '</td><td>' + esc(mockTypeTitle(m.type)) + '</td><td><strong>' + m.score + '</strong> / ' + maxFor(m.type) + '</td>' +
        '<td>' + fmtTime(m.timeUsedSec) + '</td><td>' + m.correct + ' / ' + m.wrong + ' / ' + m.skipped + '</td>' +
        '<td><a href="#/mock/result/' + m.id + '">Review</a></td></tr>';
    }).join('');
    var hist = rows
      ? '<div style="overflow-x:auto"><table><tr><th>Date</th><th>Test</th><th>Score</th><th>Time used</th><th>Correct / wrong / skipped</th><th></th></tr>' + rows + '</table></div>'
      : '<p class="muted">No tests taken yet.</p>';
    return '<h1>Mock test</h1>' +
      '<p class="muted">Practise under exam conditions. The timer runs in the background, so you can leave and come back. Your test is saved until you submit it.</p>' +
      card('Rules used in this mock', '<ul>' +
        '<li>100 MCQs: English 30, General Studies 40, Arithmetic 30 (as in the official pattern).</li>' +
        '<li>Each right answer: +1. Each wrong answer: −0.25. Unattempted: 0.</li>' +
        '<li>The test auto-submits when the time runs out.</li>' +
        '<li>Time for section tests is in proportion to the full test (our assumption; the notice does not give section times).</li></ul>') +
      '<div class="grid">' +
        card('Full mock', '<p>100 questions · 90 minutes</p><button class="btn primary" data-act="mock-start" data-type="full">Start full mock</button>') +
        card('English section', '<p>30 questions · about 27 minutes</p><button class="btn" data-act="mock-start" data-type="english">Start English test</button>') +
        card('General Studies section', '<p>40 questions · about 36 minutes</p><button class="btn" data-act="mock-start" data-type="gs">Start GS test</button>') +
        card('Arithmetic section', '<p>30 questions · about 27 minutes</p><button class="btn" data-act="mock-start" data-type="arith">Start Arithmetic test</button>') +
      '</div>' +
      card('Your test history', hist);
  }

  function remainingSec(m) {
    return Math.max(0, m.durationSec - Math.floor((Date.now() - m.startedAt) / 1000));
  }

  function renderMockExam() {
    var m = state.activeMock;
    var n = m.items.length;
    var it = m.items[m.index];
    var sel = m.answers[m.index];
    var marked = !!m.marks[m.index];
    var opts = it.options.map(function (text, i) {
      return '<button type="button" class="opt' + (sel === i ? ' selected' : '') + '" data-act="mock-answer" data-i="' + i + '">' +
        '<span class="letter">' + 'ABCD'.charAt(i) + '</span><span>' + esc(text) + '</span></button>';
    }).join('');
    var palette = m.items.map(function (x, i) {
      var cls = 'pal';
      if (m.answers[i] !== undefined) cls += ' answered';
      if (m.marks[i]) cls += ' marked';
      if (i === m.index) cls += ' current';
      return '<button type="button" class="' + cls + '" data-act="mock-goto" data-i="' + i + '" aria-label="Question ' + (i + 1) + '">' + (i + 1) + '</button>';
    }).join('');
    var left = remainingSec(m);
    return '<div class="examhead">' +
      '<div><div class="muted small">' + esc(mockTypeTitle(m.type)) + '</div>' +
      '<div><strong>Question ' + (m.index + 1) + ' of ' + n + '</strong> · ' + esc(SECTION_NAMES[it.section]) + '</div></div>' +
      '<div class="timer' + (left <= 300 ? ' low' : '') + '" id="timer" aria-live="off">' + fmtTime(left) + '</div>' +
      '<button class="btn danger" data-act="mock-submit">Submit test</button></div>' +
      '<div class="exam-grid"><div>' +
      '<div class="qcard"><div class="qmeta">Question ' + (m.index + 1) + '</div>' +
      '<p class="qtext">' + esc(it.q) + '</p><div class="options">' + opts + '</div></div>' +
      '<div class="row" style="margin-top:12px">' +
      '<button class="btn" data-act="mock-prev"' + (m.index === 0 ? ' disabled' : '') + '>← Previous</button>' +
      '<button class="btn" data-act="mock-clear">Clear response</button>' +
      '<button class="btn" data-act="mock-mark">' + (marked ? 'Unmark review' : 'Mark for review') + '</button>' +
      '<div class="spacer"></div>' +
      '<button class="btn primary" data-act="mock-next"' + (m.index === n - 1 ? ' disabled' : '') + '>Save &amp; next →</button>' +
      '</div></div>' +
      '<aside class="card"><strong>Question palette</strong>' +
      '<div class="palette" style="margin-top:8px">' + palette + '</div>' +
      '<div class="legend"><span><i style="background:#2e7d32"></i>Answered</span><span><i style="background:#6a1b9a"></i>Marked</span><span><i></i>Not answered</span></div>' +
      '<p class="small muted" style="margin-top:10px">Answered: ' + Object.keys(m.answers).length + ' of ' + n + '. Wrong answer costs 0.25; blank costs nothing.</p>' +
      '</aside></div>';
  }

  function startMockTicker() {
    var m = state.activeMock;
    var tick = function () {
      var cur = state.activeMock;
      if (!cur || cur.finished) return;
      var left = remainingSec(cur);
      var el = document.getElementById('timer');
      if (el) {
        el.textContent = fmtTime(left);
        el.classList.toggle('low', left <= 300);
      }
      if (left <= 0) finishMock(true);
    };
    tick();
    addTicker(setInterval(tick, 1000));
    return m;
  }

  function scoreMock(m) {
    var out = { correct: 0, wrong: 0, skipped: 0, score: 0, sections: {} };
    m.items.forEach(function (it, i) {
      var s = out.sections[it.section] || (out.sections[it.section] = { total: 0, correct: 0, wrong: 0, skipped: 0, score: 0 });
      s.total += 1;
      var chosen = m.answers[i];
      if (chosen === undefined) { s.skipped += 1; out.skipped += 1; }
      else if (chosen === it.answer) { s.correct += 1; out.correct += 1; s.score += 1; out.score += 1; }
      else { s.wrong += 1; out.wrong += 1; s.score -= NEG; out.score -= NEG; }
    });
    out.score = round2(out.score);
    Object.keys(out.sections).forEach(function (k) { out.sections[k].score = round2(out.sections[k].score); });
    return out;
  }

  function finishMock(auto) {
    var m = state.activeMock;
    if (!m || m.finished) return;
    m.finished = true;
    var used = Math.min(m.durationSec, Math.round((Date.now() - m.startedAt) / 1000));
    var sc = scoreMock(m);
    var record = {
      id: m.id,
      date: toISO(new Date()),
      type: m.type,
      durationSec: m.durationSec,
      timeUsedSec: used,
      autoSubmitted: !!auto,
      total: m.items.length,
      score: sc.score,
      correct: sc.correct,
      wrong: sc.wrong,
      skipped: sc.skipped,
      sections: sc.sections,
      review: m.items.map(function (it, i) {
        return {
          id: it.id, topic: it.topic, section: it.section, q: it.q, options: it.options,
          answer: it.answer, exp: it.exp,
          chosen: m.answers[i] === undefined ? null : m.answers[i],
          marked: !!m.marks[i]
        };
      })
    };
    state.mocks.unshift(record);
    state.mocks = state.mocks.slice(0, 30);
    state.mocks.forEach(function (r, i) { if (i >= 10) r.review = null; }); // keep detail for the 10 newest
    state.activeMock = null;
    saveState();
    resultFilter = 'all';
    window.location.hash = '#/mock/result/' + record.id;
  }

  function renderMockResult(id) {
    var r = state.mocks.filter(function (x) { return x.id === id; })[0];
    if (!r) return notFound('That test result was not found.');
    var secRows = Object.keys(r.sections).map(function (k) {
      var s = r.sections[k];
      return '<tr><td>' + esc(SECTION_NAMES[k]) + '</td><td>' + s.total + '</td><td>' + s.correct + '</td><td>' + s.wrong + '</td><td>' + s.skipped + '</td><td><strong>' + s.score + '</strong> / ' + SECTION_MAX[k] + '</td></tr>';
    }).join('');
    var weak = {};
    if (r.review) {
      r.review.forEach(function (x) { if (x.chosen !== null && x.chosen !== x.answer) weak[x.topic] = (weak[x.topic] || 0) + 1; });
    }
    var weakList = Object.keys(weak).sort(function (a, b) { return weak[b] - weak[a]; }).slice(0, 5);
    var weakHtml = weakList.length
      ? '<ul>' + weakList.map(function (t) { return '<li><a href="#/notes/' + t + '">' + esc(chapterTitle(t)) + '</a> — ' + weak[t] + ' wrong</li>'; }).join('') + '</ul>'
      : '<p class="muted">' + (r.review ? 'No wrong answers to analyse.' : 'Detailed review is kept only for the 10 most recent tests.') + '</p>';
    var summary = '<div class="stats">' +
      '<div><div class="stat">' + r.score + '</div><div class="stat-label">Score out of ' + maxFor(r.type) + '</div></div>' +
      '<div><div class="stat">' + r.correct + '</div><div class="stat-label">Correct (+1 each)</div></div>' +
      '<div><div class="stat">' + r.wrong + '</div><div class="stat-label">Wrong (−0.25 each)</div></div>' +
      '<div><div class="stat">' + r.skipped + '</div><div class="stat-label">Not answered (0)</div></div>' +
      '<div><div class="stat">' + fmtTime(r.timeUsedSec) + '</div><div class="stat-label">Time used' + (r.autoSubmitted ? ' (auto-submitted)' : '') + '</div></div>' +
      '</div>';
    var review = '';
    if (r.review) {
      var list = r.review.map(function (x, i) { return { x: x, i: i }; }).filter(function (o) {
        if (resultFilter === 'wrong') return o.x.chosen !== null && o.x.chosen !== o.x.answer;
        if (resultFilter === 'skipped') return o.x.chosen === null;
        return true;
      });
      review = list.map(function (o) {
        var it = { subject: o.x.section === 'arith' ? 'arith' : (o.x.section === 'gs' ? 'gs' : 'english'), topic: o.x.topic, q: o.x.q, options: o.x.options, answer: o.x.answer, exp: o.x.exp };
        var head = '<div class="muted small">Q' + (o.i + 1) + ' · ' + esc(SECTION_NAMES[o.x.section]) + (o.x.marked ? ' · marked for review' : '') + '</div>';
        return '<div style="margin-bottom:12px">' + head + renderQuestion(it, { selected: o.x.chosen === null ? undefined : o.x.chosen, reveal: true, disabled: true }) + '</div>';
      }).join('') || '<p class="muted">Nothing to show for this filter.</p>';
    }
    var filters = '<div class="row" style="margin:8px 0">' +
      ['all', 'wrong', 'skipped'].map(function (f) {
        return '<button class="btn small' + (resultFilter === f ? ' primary' : '') + '" data-act="mock-filter" data-f="' + f + '">' +
          (f === 'all' ? 'All questions' : f === 'wrong' ? 'Wrong only' : 'Not answered') + '</button>';
      }).join('') + '</div>';
    return '<div class="crumbs"><a href="#/mock">Mock test</a> › Result</div>' +
      '<h1>' + esc(mockTypeTitle(r.type)) + '</h1><p class="muted">Taken on ' + esc(r.date) + '. Total questions: ' + r.total + '.</p>' +
      card('Result', summary + '<div style="overflow-x:auto"><table><tr><th>Section</th><th>Questions</th><th>Correct</th><th>Wrong</th><th>Not answered</th><th>Score</th></tr>' + secRows + '</table></div>') +
      card('Where to focus next', weakHtml) +
      card('Review', filters + review) +
      '<div class="row"><a class="btn primary" href="#/mock">Take another test</a></div>';
  }

  // ---------- VIEW: Part-II writing ----------
  function promptBlock(p) {
    var body = '';
    if (p.passage) body += '<p class="small muted">Passage:</p><div class="typing-passage" style="font-size:1rem;line-height:1.6">' + esc(p.passage) + '</div>';
    body += '<pre class="prompt-pre">' + esc(p.prompt) + '</pre>';
    return '<details class="card"><summary><strong>' + esc(p.title) + '</strong> <span class="badge">' + esc(p.kind) + '</span></summary>' +
      body + '<details style="margin-top:8px"><summary>Show model answer</summary><pre class="prompt-pre">' + esc(p.model) + '</pre></details></details>';
  }

  function viewWriting() {
    var reports = NS.writingPrompts.filter(function (p) { return p.lang === 'en'; });
    var bnReport = NS.writingPrompts.filter(function (p) { return p.lang === 'bn'; });
    var precis = NS.precisPrompts;
    var trEnBn = NS.translationPrompts.filter(function (p) { return p.direction === 'English → Bengali'; });
    var trEnHi = NS.translationPrompts.filter(function (p) { return p.direction === 'English → Hindi'; });
    var trBnEn = NS.translationPrompts.filter(function (p) { return p.direction === 'Bengali → English'; });

    var trTable = function (rows) {
      return '<table><tr><th>Source</th><th>Model answer</th></tr>' + rows.map(function (r) {
        return '<tr><td>' + esc(r.source) + '</td><td><details><summary>Show</summary>' + esc(r.model) + '</details></td></tr>';
      }).join('') + '</table>';
    };

    var groupA = '<h2>Group-A: English (50 marks)</h2>' +
      '<p class="small muted">Report from points · précis · translation from Bengali, Hindi, Urdu, Nepali or Santali into English.</p>' +
      '<ul>' + ['p2a-report', 'p2a-precis', 'p2a-translation'].map(function (id) {
        return '<li><a href="#/notes/' + id + '">' + esc(chapterTitle(id)) + '</a></li>';
      }).join('') + '</ul>' +
      '<h3>Report practice</h3>' + reports.map(promptBlock).join('') +
      '<h3>Précis practice</h3>' + precis.map(promptBlock).join('') +
      '<h3>Translation into English (from Bengali)</h3>' + trTable(trBnEn);

    var groupB = '<h2>Group-B: your chosen language (50 marks)</h2>' +
      '<p class="small muted">Report · précis · translation from English into the language you chose. In depth: Bengali and Hindi. General guidance: Urdu, Nepali, Santali.</p>' +
      '<div class="warn">If you choose Hindi, Urdu, Nepali or Santali instead of Bengali, you must pass a departmental Bengali exam during probation (as per the notice).</div>' +
      '<ul>' + ['p2b-report', 'p2b-precis', 'p2b-translation'].map(function (id) {
        return '<li><a href="#/notes/' + id + '">' + esc(chapterTitle(id)) + '</a></li>';
      }).join('') + '</ul>' +
      '<h3>Report practice (Bengali)</h3>' + bnReport.map(promptBlock).join('') +
      '<h3>Translation from English into Bengali</h3>' + trTable(trEnBn) +
      '<h3>Translation from English into Hindi</h3>' + trTable(trEnHi);

    return '<h1>Part-II writing</h1>' +
      '<p class="muted">Part-II is descriptive: 100 marks in 60 minutes, split into two groups of 50. Only a limited number of Part-I qualifiers go on to Part-II.</p>' +
      '<div class="warn"><strong>Identity rule:</strong> writing your name, roll number or any identifying mark deducts 10% of that paper’s full marks (5 marks on a 50-mark group).</div>' +
      '<div class="grid"><div class="card">' + groupA + '</div><div class="card">' + groupB + '</div></div>' +
      card('Before you submit a practice answer', '<ul>' +
        '<li>Did I cover every point given, in order?</li>' +
        '<li>Is the format right (title, date and place if given, body, conclusion or suggestion, signature with a general designation)?</li>' +
        '<li>Did I avoid my name, roll number and school name?</li>' +
        '<li>Are tenses and subject–verb agreement correct?</li>' +
        '<li>Did I avoid invented facts and personal opinions?</li></ul>', 'soft');
  }

  // ---------- VIEW: typing ----------
  function typingPassage() {
    var parts = (NS.typingPassages[typing.lang] || []).slice();
    if (typing.order % 2 === 1) parts.reverse();
    return parts.join(' ');
  }

  function typingMetrics(passage, typed, seconds) {
    var minutes = Math.max(seconds / 60, 1 / 60);
    var len = typed.length;
    var correct = 0;
    for (var i = 0; i < len; i++) { if (typed.charAt(i) === passage.charAt(i)) correct++; }
    var errors = len - correct;
    var gross = (len / 5) / minutes;
    var net = Math.max(0, (len / 5 - errors) / minutes);
    var acc = len ? (correct / len) * 100 : 0;
    return { gross: round1(gross), net: round1(net), accuracy: round1(acc), typedLen: len, errors: errors, seconds: Math.round(seconds) };
  }

  function renderPassageHTML(passage, typed) {
    var out = '';
    for (var i = 0; i < passage.length; i++) {
      var ch = passage.charAt(i);
      if (i < typed.length) {
        out += '<span class="' + (typed.charAt(i) === ch ? 'ok' : 'bad') + '">' + esc(ch) + '</span>';
      } else if (i === typed.length) {
        out += '<span class="cursor todo">' + esc(ch) + '</span>';
      } else {
        out += '<span class="todo">' + esc(ch) + '</span>';
      }
    }
    return out;
  }

  function elapsedSec() {
    if (typing.status === 'idle') return 0;
    var end = typing.status === 'done' ? typing.endAt : Date.now();
    return Math.max(0, (end - typing.startAt) / 1000);
  }

  function updateTypingLive() {
    var passage = typingPassage();
    var secs = Math.max(1, elapsedSec());
    var m = typingMetrics(passage, typing.typed, secs);
    var setText = function (id, v) { var el = document.getElementById(id); if (el) el.textContent = v; };
    var left = Math.max(0, typing.minutes * 60 - elapsedSec());
    setText('tp-time', fmtTime(left));
    setText('tp-net', m.net.toFixed(1));
    setText('tp-gross', m.gross.toFixed(1));
    setText('tp-acc', m.accuracy.toFixed(1) + '%');
    var p = document.getElementById('tp-passage');
    if (p) p.innerHTML = renderPassageHTML(passage, typing.typed);
  }

  function startTypingTicker() {
    var tick = function () {
      if (typing.status !== 'running') return;
      if (elapsedSec() >= typing.minutes * 60) { finishTyping(); return; }
      updateTypingLive();
    };
    addTicker(setInterval(tick, 250));
  }

  function finishTyping() {
    if (typing.status !== 'running') return;
    clearTickers();
    typing.status = 'done';
    typing.endAt = Date.now();
    var passage = typingPassage();
    var secs = Math.min(typing.minutes * 60, elapsedSec());
    var m = typingMetrics(passage, typing.typed, Math.max(secs, 1));
    typing.result = m;
    var list = state.typing[typing.lang] || [];
    list.unshift({ date: toISO(new Date()), lang: typing.lang, minutes: typing.minutes, net: m.net, gross: m.gross, accuracy: m.accuracy, errors: m.errors, typed: m.typedLen });
    state.typing[typing.lang] = list.slice(0, 20);
    saveState();
    rerender();
  }

  function resetTyping() {
    clearTickers();
    typing = {
      lang: typing.lang,
      minutes: typing.minutes,
      order: typing.order + 1,
      status: 'idle',
      startAt: 0,
      typed: '',
      result: null
    };
  }

  function viewTyping() {
    var passage = typingPassage();
    var target = typing.lang === 'en' ? NS.exam.typing.english : NS.exam.typing.bengali;
    var locked = typing.status === 'done';
    var list = state.typing[typing.lang] || [];
    var best = bestTyping(typing.lang);
    var res = '';
    if (locked && typing.result) {
      var r = typing.result;
      var meets = r.net >= target;
      res = '<div class="card soft" style="margin-top:12px"><h2>Result</h2>' +
        '<p><strong>Net WPM: ' + r.net.toFixed(1) + '</strong> (gross ' + r.gross.toFixed(1) + ') · Accuracy ' + r.accuracy.toFixed(1) + '% · ' + r.errors + ' errors in ' + r.typedLen + ' characters.</p>' +
        '<p>' + (meets ? 'You reached the ' + target + ' wpm target for this practice run.' : 'Target for this language: ' + target + ' wpm. Keep practising and aim for accuracy first.') + '</p>' +
        '<p class="small muted">Practice method: 5 characters (including spaces) count as one word. Net WPM = gross WPM − errors per minute. The official typing criteria are in the notice.</p></div>';
    }
    var hist = list.length
      ? '<div style="overflow-x:auto"><table><tr><th>Date</th><th>Language</th><th>Minutes</th><th>Net WPM</th><th>Gross WPM</th><th>Accuracy</th></tr>' +
        list.slice(0, 10).map(function (x) {
          return '<tr><td>' + esc(x.date) + '</td><td>' + (x.lang === 'en' ? 'English' : 'Bengali') + '</td><td>' + x.minutes + '</td><td>' + x.net.toFixed(1) + '</td><td>' + x.gross.toFixed(1) + '</td><td>' + x.accuracy.toFixed(1) + '%</td></tr>';
        }).join('') + '</table></div>'
      : '<p class="muted">No runs yet.</p>';
    var timeLeft = fmtTime(typing.minutes * 60 - elapsedSec());
    var liveNet = typing.result ? typing.result.net.toFixed(1) : '0.0';
    var liveGross = typing.result ? typing.result.gross.toFixed(1) : '0.0';
    var liveAcc = typing.result ? typing.result.accuracy.toFixed(1) + '%' : '0%';
    return '<h1>Typing practice</h1>' +
      '<p class="muted">The typing test is qualifying. Target: <strong>' + target + ' wpm</strong> in ' + (typing.lang === 'en' ? 'English' : 'Bengali') +
      '. The notice says the test is judged after Part-I and Part-II; check the official notice for the exact method.</p>' +
      '<div class="card">' +
        '<div class="row">' +
          '<label class="field">Language<select data-change="typing-lang">' +
            '<option value="en"' + (typing.lang === 'en' ? ' selected' : '') + '>English (target 20 wpm)</option>' +
            '<option value="bn"' + (typing.lang === 'bn' ? ' selected' : '') + '>Bengali (target 10 wpm)</option></select></label>' +
          '<label class="field">Duration<select data-change="typing-minutes">' +
            [1, 3, 5].map(function (mn) { return '<option value="' + mn + '"' + (typing.minutes === mn ? ' selected' : '') + '>' + mn + ' minute' + (mn > 1 ? 's' : '') + '</option>'; }).join('') +
          '</select></label>' +
          '<div class="spacer"></div><button class="btn" data-act="typing-new">New passage</button>' +
        '</div>' +
        '<p class="small muted">Click in the box and start typing. The clock starts with your first key. For Bengali, switch your keyboard to Bengali (Unicode) first. Correct letters turn green, wrong ones red.</p>' +
        '<div class="stats">' +
          '<div><div class="stat" id="tp-time">' + timeLeft + '</div><div class="stat-label">Time left</div></div>' +
          '<div><div class="stat" id="tp-net">' + liveNet + '</div><div class="stat-label">Net WPM</div></div>' +
          '<div><div class="stat" id="tp-gross">' + liveGross + '</div><div class="stat-label">Gross WPM</div></div>' +
          '<div><div class="stat" id="tp-acc">' + liveAcc + '</div><div class="stat-label">Accuracy</div></div>' +
        '</div>' +
        '<div class="typing-passage" id="tp-passage" style="margin:10px 0">' + renderPassageHTML(passage, typing.typed) + '</div>' +
        '<textarea class="typing-area" id="tp-input" data-input="typing" aria-label="Type the passage here"' + (locked ? ' disabled' : '') + ' placeholder="Start typing the passage here…">' + esc(typing.typed) + '</textarea>' +
        '<div class="row" style="margin-top:8px">' +
          '<button class="btn" data-act="typing-finish"' + (typing.status === 'running' ? '' : ' disabled') + '>Finish now</button>' +
          '<button class="btn" data-act="typing-restart">Restart</button>' +
          '<div class="spacer"></div><span class="muted small">Best net WPM (' + (typing.lang === 'en' ? 'English' : 'Bengali') + '): <strong>' + round1(best) + '</strong></span>' +
        '</div>' +
        res +
      '</div>' +
      card('Your recent runs', hist);
  }

  // ---------- VIEW: planner ----------
  function buildPlan(start, exam) {
    var days = daysBetween(start, exam);
    var weeks = Math.ceil(days / 7);
    var remaining = weeks - 1; // the last week is always the final revision week
    var learnW = Math.max(1, Math.round(remaining * 0.5));
    var pracW = Math.max(0, Math.round(remaining * 0.3));
    var mockW = Math.max(0, remaining - learnW - pracW);
    var phases = [];
    for (var a = 0; a < learnW; a++) phases.push('learn');
    for (var b = 0; b < pracW; b++) phases.push('practise');
    for (var c = 0; c < mockW; c++) phases.push('mock');
    phases.push('final');
    var units = NS.chapters.slice();
    var perWeek = Math.ceil(units.length / learnW);
    var out = [];
    var learnIndex = 0;
    phases.forEach(function (phase, w) {
      var from = addDays(start, w * 7);
      var to = new Date(Math.min(exam.getTime(), addDays(from, 6).getTime()));
      var tasks = [];
      if (phase === 'learn') {
        var slice = units.slice(learnIndex * perWeek, (learnIndex + 1) * perWeek);
        learnIndex++;
        slice.forEach(function (ch) {
          if (ch.subject === 'p2a' || ch.subject === 'p2b') tasks.push('Part-II: read “' + ch.title + '” and write one practice answer');
          else tasks.push('Study “' + ch.title + '”: read notes, then do 15 practice questions');
        });
        tasks.push('Typing practice: 15 minutes (aim for accuracy first)');
        tasks.push('Current affairs: 20 minutes; add items to the tracker');
      } else if (phase === 'practise') {
        tasks.push('Section test: Arithmetic (30 questions, about 27 min)');
        tasks.push('Section test: English (30 questions, about 27 min)');
        tasks.push('Section test: General Studies (40 questions, about 36 min)');
        tasks.push('Review every wrong answer; write the chapter on your revision list');
        tasks.push('Part-II: one report and one translation practice');
        tasks.push('Typing practice: 15 minutes');
      } else if (phase === 'mock') {
        tasks.push('Full mock (100 questions, 90 minutes), then review every answer');
        tasks.push('Revise the two weakest chapters from the mock review');
        tasks.push('Typing practice: 15 minutes');
      } else {
        tasks.push('Light revision only: formulas, rules, one-word lists, idioms');
        tasks.push('One full mock early in the week; no new chapters after that');
        tasks.push('Check the admit card, photo ID and exam venue (once released)');
      }
      out.push({ no: w + 1, from: from, to: to, phase: phase, tasks: tasks });
    });
    return { weeks: weeks, learnW: learnW, perWeek: perWeek, plan: out };
  }

  function viewPlanner() {
    var exam = parseISO(state.examDate);
    var start = today();
    if (!exam || daysBetween(start, exam) < 7) {
      return card('Study planner', '<p>Set an exam date at least 7 days ahead on the <a href="#/home">dashboard</a>. The planner counts from today to that date.</p>');
    }
    var p = buildPlan(start, exam);
    var total = 0, done = 0;
    p.plan.forEach(function (wk) { wk.tasks.forEach(function (t, ti) {
      total++;
      if (state.planDone[planKey(exam, wk.no, ti)]) done++;
    }); });
    var pct = total ? Math.round(done / total * 100) : 0;
    var phaseLabel = { learn: 'Learn', practise: 'Practise', mock: 'Mock & revise', final: 'Final revision' };
    var rows = p.plan.map(function (wk) {
      var tasks = wk.tasks.map(function (t, ti) {
        var key = planKey(exam, wk.no, ti);
        return '<label class="check' + (state.planDone[key] ? ' done' : '') + '"><input type="checkbox" data-change="plan-task" data-key="' + esc(key) + '"' + (state.planDone[key] ? ' checked' : '') + '><span>' + esc(t) + '</span></label>';
      }).join('');
      return '<tr><td><strong>Week ' + wk.no + '</strong><br><span class="small muted">' + fmtDate(wk.from) + ' – ' + fmtDate(wk.to) + '</span></td>' +
        '<td><span class="phase ' + (wk.phase === 'learn' ? 'learn' : wk.phase === 'practise' ? 'practise' : wk.phase === 'mock' ? 'mock' : 'final') + '">' + phaseLabel[wk.phase] + '</span></td>' +
        '<td>' + tasks + '</td></tr>';
    }).join('');
    return '<h1>Study planner</h1>' +
      '<p class="muted">A plan from today to your exam date (<strong>' + fmtDate(exam) + '</strong>, your assumption). Change it on the dashboard. Tick tasks as you finish them.</p>' +
      card('Overview', '<div class="stats">' +
        '<div><div class="stat">' + daysBetween(start, exam) + '</div><div class="stat-label">days left</div></div>' +
        '<div><div class="stat">' + p.weeks + '</div><div class="stat-label">weeks in plan</div></div>' +
        '<div><div class="stat">' + p.learnW + '</div><div class="stat-label">learning weeks</div></div>' +
        '<div><div class="stat">' + p.perWeek + '</div><div class="stat-label">chapters a week (learning)</div></div>' +
        '</div>' +
        (p.perWeek > 6
          ? '<div class="warn"><strong>Heavy load:</strong> ' + p.perWeek + ' chapters a week in the learning weeks is a lot if you also work. Consider a later exam date on the dashboard (the plan then spreads the same 40 chapters over more weeks), or give the learning weeks more hours.</div>'
          : '<p class="small muted">Learning load: about ' + p.perWeek + ' chapters a week. Adjust the exam date on the dashboard if you need more time.</p>') +
        '<div class="row" style="margin-top:8px"><div class="progressbar" style="flex:1"><div style="width:' + pct + '%"></div></div><strong>' + pct + '%</strong></div>' +
        '<div class="row" style="margin-top:8px"><button class="btn small" data-act="plan-reset">Clear all ticks</button></div>') +
      '<div style="overflow-x:auto"><table><tr><th>Week</th><th>Phase</th><th>Tasks</th></tr>' + rows + '</table></div>';
  }
  function planKey(exam, weekNo, ti) { return toISO(exam) + '|w' + weekNo + '|t' + ti; }

  // ---------- VIEW: current affairs ----------
  var AFFAIR_CATS = ['Schemes', 'Awards and people', 'Reports and indices', 'Places and events', 'Sports', 'Other'];

  function viewAffairs() {
    var items = state.affairs.slice().sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; });
    var shown = affairFilter === 'all' ? items : items.filter(function (x) { return x.cat === affairFilter; });
    var rows = shown.map(function (x) {
      return '<tr><td>' + esc(x.date) + '</td><td>' + esc(x.cat) + '</td><td><strong>' + esc(x.title) + '</strong>' + (x.note ? '<br><span class="small muted">' + esc(x.note) + '</span>' : '') + '</td>' +
        '<td><button class="btn small danger" data-act="affair-del" data-id="' + esc(x.id) + '">Delete</button></td></tr>';
    }).join('');
    var sources = '<ul>' +
      '<li><a href="https://psc.wb.gov.in" target="_blank" rel="noopener">psc.wb.gov.in</a> — official notices, dates and answer keys</li>' +
      '<li><a href="https://pib.gov.in" target="_blank" rel="noopener">pib.gov.in</a> — Press Information Bureau: government releases</li>' +
      '<li><a href="https://www.wb.gov.in" target="_blank" rel="noopener">wb.gov.in</a> — West Bengal government portal (state schemes)</li>' +
      '<li>Yojana and Employment News (monthly and weekly government publications)</li></ul>' +
      '<p class="small muted">Check dates and numbers in the official source before you rely on them in the exam.</p>';
    var catOpts = ['all'].concat(AFFAIR_CATS).map(function (c) {
      return '<option value="' + esc(c) + '"' + (affairFilter === c ? ' selected' : '') + '>' + (c === 'all' ? 'All categories' : esc(c)) + '</option>';
    }).join('');
    var catSelect = AFFAIR_CATS.map(function (c) { return '<option value="' + esc(c) + '">' + esc(c) + '</option>'; }).join('');
    return '<h1>Current affairs tracker</h1>' +
      '<p class="muted">Log items you read from official sources. This page does not fetch news. Revise the last 30 days every week, and use the list for the Current events part of General Studies.</p>' +
      '<div class="grid">' +
        '<form class="card" data-submit="affair-add"><h2>Add an item</h2>' +
          '<label class="field">Date<input type="date" name="date" value="' + toISO(today()) + '" required></label>' +
          '<label class="field">Category<select name="cat">' + catSelect + '</select></label>' +
          '<label class="field">What happened<input type="text" name="title" maxlength="200" required placeholder="Short title"></label>' +
          '<label class="field">Note or source<input type="text" name="note" maxlength="300" placeholder="Where you read it"></label>' +
          '<div style="margin-top:8px"><button class="btn primary" type="submit">Add item</button></div></form>' +
        card('Official sources', sources) +
      '</div>' +
      '<div class="card"><div class="row"><h2 style="margin:0">Your items (' + items.length + ')</h2><div class="spacer"></div>' +
        '<select data-change="affair-filter" aria-label="Filter by category">' + catOpts + '</select>' +
        '<button class="btn" data-act="affair-export">Download as text</button></div>' +
        '<div style="overflow-x:auto;margin-top:8px"><table><tr><th>Date</th><th>Category</th><th>Item</th><th></th></tr>' + (rows || '<tr><td colspan="4" class="muted">Nothing logged yet.</td></tr>') + '</table></div></div>';
  }

  // ---------- VIEW: resources ----------
  function viewResources() {
    var ex = NS.exam;
    var links = '<ul>' + ex.links.map(function (l) {
      return '<li><a href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + '</a></li>';
    }).join('') + '</ul>';
    var idCard = '<ul>' +
      '<li>Admit card: download from the official site (Candidate’s Corner). Carry a valid photo ID.</li>' +
      '<li>Photo ID options in the notice: Madhyamik certificate with photo, passport, PAN, EPIC, driving licence, or another government photo ID.</li>' +
      '<li>No mobile phone, smartwatch or Bluetooth device is allowed in the exam premises. Frisking is done at entry.</li>' +
      '<li>General advice (not from the notice): reach the venue early and check the admit card for anything it asks you to carry.</li></ul>';
    var tips = '<ul>' +
      '<li><strong>Time per question:</strong> 90 minutes ÷ 100 questions ≈ 54 seconds each. Keep a rough check every 20 questions.</li>' +
      '<li><strong>Negative marking:</strong> each wrong answer costs 0.25. With four options, a blind guess has an expected value of 1/4 × 1 − 3/4 × 0.25 = +0.06, which is small and risky. Eliminate options first: a guess between two or three remaining options is clearly positive. Answer sure questions first.</li>' +
      '<li><strong>Arithmetic:</strong> learn the formulas and do the easy ones first. Use the shortcuts in the notes.</li>' +
      '<li><strong>English:</strong> grammar rules and common word lists repay daily reading of short passages.</li>' +
      '<li><strong>Part-II:</strong> never write your name or roll number. Practise each format until it feels routine.</li></ul>';
    return '<h1>Resources and exam-day guide</h1>' +
      card('Negative marking calculator', '<p class="small muted">Part-I: each right answer +1, each wrong answer −0.25, unattempted 0.</p>' +
        '<div class="row"><label class="field">Questions attempted<input type="number" id="calc-att" min="0" max="100" value="80" data-input="calc"></label>' +
        '<label class="field">Correct answers<input type="number" id="calc-cor" min="0" max="100" value="60" data-input="calc"></label></div>' +
        '<p id="calc-out" style="margin-top:10px"><strong></strong></p>') +
      card('Official links', links) +
      card('Exam-day and identity rules', idCard) +
      card('How to use the time', tips) +
      card('About this site', '<p>This is an unofficial study aid built only from the official notice (Advertisement No. 12/2024, dated 06.10.2026) and the official Scheme &amp; Syllabus. The questions and notes are original. Items marked “extra” are commonly asked but are not in the official syllabus line.</p>' +
        '<p class="small muted">If the official notice and this site differ, follow the notice. Dates after 6 October 2026 (for example, the 7 October 2026 edit-option notice) must be checked directly on psc.wb.gov.in.</p>', 'soft');
  }

  // ---------- actions (clicks) ----------
  var ACTIONS = {
    'practice-start': function () {
      var items;
      if (practice.subject === 'arith') {
        items = practice.chapter === 'all'
          ? NS.arith.mixed(practice.count)
          : Array.apply(null, new Array(practice.count)).map(function () { return NS.arith.generate(practice.chapter); });
      } else {
        items = pickStratified(poolFor(practice.subject, practice.chapter), practice.count);
      }
      if (!items.length) { toast('No questions available for this choice.'); return; }
      session = { items: items, index: 0, answers: [], finished: false };
      rerender();
    },
    'practice-answer': function (el) {
      if (!session || session.finished) return;
      var i = session.index;
      if (session.answers[i] !== undefined) return;
      var choice = Number(el.getAttribute('data-i'));
      session.answers[i] = choice;
      var it = session.items[i];
      recordPractice(it.topic, choice === it.answer);
      rerender();
    },
    'practice-next': function () {
      if (!session) return;
      if (session.index + 1 < session.items.length) session.index++;
      else session.finished = true;
      rerender();
    },
    'practice-end': function () {
      if (!session) return;
      session.finished = true;
      rerender();
    },
    'practice-new': function () { session = null; rerender(); },

    'mock-start': function (el) {
      var type = el.getAttribute('data-type');
      if (state.activeMock && !state.activeMock.finished) { toast('Finish or submit the test in progress first.'); return; }
      var secs = { full: FULL_MINUTES * 60, english: 27 * 60, gs: 36 * 60, arith: 27 * 60 }[type];
      if (!secs) return;
      state.activeMock = {
        id: uid(), type: type, startedAt: Date.now(), durationSec: secs,
        items: buildMockItems(type), answers: {}, marks: {}, index: 0, finished: false
      };
      saveState();
      rerender();
    },
    'mock-answer': function (el) {
      var m = state.activeMock; if (!m || m.finished) return;
      m.answers[m.index] = Number(el.getAttribute('data-i'));
      saveState(); rerender();
    },
    'mock-goto': function (el) {
      var m = state.activeMock; if (!m || m.finished) return;
      m.index = Number(el.getAttribute('data-i'));
      saveState(); rerender();
    },
    'mock-next': function () {
      var m = state.activeMock; if (!m || m.finished) return;
      m.index = Math.min(m.items.length - 1, m.index + 1);
      saveState(); rerender();
    },
    'mock-prev': function () {
      var m = state.activeMock; if (!m || m.finished) return;
      m.index = Math.max(0, m.index - 1);
      saveState(); rerender();
    },
    'mock-clear': function () {
      var m = state.activeMock; if (!m || m.finished) return;
      delete m.answers[m.index];
      saveState(); rerender();
    },
    'mock-mark': function () {
      var m = state.activeMock; if (!m || m.finished) return;
      m.marks[m.index] = !m.marks[m.index];
      saveState(); rerender();
    },
    'mock-submit': function () {
      var m = state.activeMock; if (!m || m.finished) return;
      var left = remainingSec(m);
      var msg = 'Submit the test now? ' + (m.items.length - Object.keys(m.answers).length) + ' question(s) are not answered and score 0.' + (left > 0 ? ' ' + fmtTime(left) + ' is left.' : '');
      if (window.confirm(msg)) finishMock(false);
    },
    'mock-filter': function (el) {
      resultFilter = el.getAttribute('data-f') || 'all';
      rerender();
    },

    'typing-finish': function () { finishTyping(); },
    'typing-restart': function () { resetTyping(); rerender(); },
    'typing-new': function () { resetTyping(); rerender(); },

    'plan-reset': function () {
      if (!window.confirm('Clear all ticks in the study plan?')) return;
      state.planDone = {};
      saveState(); rerender();
    },
    'affair-del': function (el) {
      var id = el.getAttribute('data-id');
      state.affairs = state.affairs.filter(function (x) { return x.id !== id; });
      saveState(); rerender();
    },
    'affair-export': function () {
      var items = state.affairs.slice().sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; });
      var text = 'WBPSC Clerkship — current affairs log\n\n' + items.map(function (x) {
        return x.date + ' | ' + x.cat + ' | ' + x.title + (x.note ? ' | ' + x.note : '');
      }).join('\n') + '\n';
      var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'current-affairs-log.txt';
      document.body.appendChild(a);
      a.click();
      setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 1000);
    }
  };

  // ---------- changes (selects, checkboxes) ----------
  var CHANGES = {
    'check-action': function (el) {
      state.checklist[el.getAttribute('data-id')] = el.checked;
      saveState(); rerender();
    },
    'chapter-done': function (el) {
      state.chapterDone[el.getAttribute('data-id')] = el.checked;
      saveState(); rerender();
    },
    'exam-date': function (el) {
      var d = parseISO(el.value);
      if (!d) { toast('Enter a valid date.'); return; }
      state.examDate = el.value;
      saveState(); rerender();
    },
    'practice-subject': function (el) {
      practice.subject = el.value; practice.chapter = 'all'; session = null; rerender();
    },
    'practice-chapter': function (el) {
      practice.chapter = el.value; session = null; rerender();
    },
    'practice-count': function (el) {
      practice.count = Number(el.value) || 10; rerender();
    },
    'plan-task': function (el) {
      var key = el.getAttribute('data-key');
      if (el.checked) state.planDone[key] = true; else delete state.planDone[key];
      saveState(); rerender();
    },
    'affair-filter': function (el) {
      affairFilter = el.value; rerender();
    },
    'typing-lang': function (el) {
      typing.lang = el.value; resetTyping(); rerender();
    },
    'typing-minutes': function (el) {
      typing.minutes = Number(el.value) || 3; resetTyping(); rerender();
    }
  };

  // ---------- live inputs ----------
  var INPUTS = {
    'typing': function (el) {
      if (typing.status === 'done') return;
      if (typing.status === 'idle') {
        if (!el.value.length) return;
        typing.status = 'running';
        typing.startAt = Date.now();
        startTypingTicker();
        var finishBtn = document.querySelector('[data-act="typing-finish"]');
        if (finishBtn) finishBtn.disabled = false;
      }
      typing.typed = el.value;
      updateTypingLive();
      if (typing.typed.length >= typingPassage().length) finishTyping();
    },
    'calc': function () {
      var att = Number(document.getElementById('calc-att').value) || 0;
      var cor = Number(document.getElementById('calc-cor').value) || 0;
      var out = document.getElementById('calc-out');
      if (cor > att) { out.innerHTML = '<strong>Correct answers cannot be more than attempted.</strong>'; return; }
      var wrong = att - cor;
      var score = round2(cor - NEG * wrong);
      out.innerHTML = '<strong>Score: ' + score + '</strong> (' + cor + ' × 1 − ' + wrong + ' × 0.25). Unattempted questions add 0.';
    }
  };

  // ---------- submits ----------
  var SUBMITS = {
    'affair-add': function (form) {
      var fd = new FormData(form);
      var title = String(fd.get('title') || '').trim();
      var date = String(fd.get('date') || '');
      if (!title) { toast('Please enter a title.'); return; }
      if (!parseISO(date)) { toast('Please enter a valid date.'); return; }
      state.affairs.push({
        id: uid(), date: date, cat: String(fd.get('cat') || 'Other'),
        title: title, note: String(fd.get('note') || '').trim()
      });
      saveState();
      toast('Added.');
      rerender();
    }
  };

  // ---------- event wiring ----------
  document.addEventListener('click', function (ev) {
    var el = ev.target && ev.target.closest ? ev.target.closest('[data-act]') : null;
    if (!el || el.disabled) return;
    var fn = ACTIONS[el.getAttribute('data-act')];
    if (fn) { ev.preventDefault(); fn(el, ev); }
  });
  document.addEventListener('change', function (ev) {
    var el = ev.target && ev.target.closest ? ev.target.closest('[data-change]') : null;
    if (!el) return;
    var fn = CHANGES[el.getAttribute('data-change')];
    if (fn) fn(el, ev);
  });
  document.addEventListener('input', function (ev) {
    var el = ev.target && ev.target.closest ? ev.target.closest('[data-input]') : null;
    if (!el) return;
    var fn = INPUTS[el.getAttribute('data-input')];
    if (fn) fn(el, ev);
  });
  document.addEventListener('submit', function (ev) {
    var form = ev.target;
    var name = form && form.getAttribute ? form.getAttribute('data-submit') : null;
    if (name && SUBMITS[name]) { ev.preventDefault(); SUBMITS[name](form, ev); }
  });
  // Clicking the nav item for the page you are already on does not change the hash,
  // so reset that page to its starting view ourselves.
  document.getElementById('nav').addEventListener('click', function (ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest('a') : null;
    if (!a || a.getAttribute('href') !== window.location.hash) return;
    session = null;
    presetArg = null;
    route(true);
  });
  window.addEventListener('hashchange', function () { route(true); });
  window.addEventListener('beforeunload', function () { saveState(); });

  // ---------- start ----------
  if (!window.location.hash) window.location.replace('#/home');
  route(true);
})();
