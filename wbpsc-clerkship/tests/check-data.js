#!/usr/bin/env node
/*
 * Data and generator checks for the WBPSC Clerkship Study Hub.
 * No dependencies: run with `node tests/check-data.js` from the wbpsc-clerkship folder.
 * Exit code 0 = all checks passed; 1 = at least one problem found.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const jsDir = path.join(root, 'assets', 'js');
const files = [
  'data/exam.js',
  'data/notes-arith.js',
  'data/notes-english.js',
  'data/notes-gs.js',
  'data/notes-part2.js',
  'data/bank-util.js',
  'data/q-english.js',
  'data/q-gs.js',
  'data/writing.js',
  'arith.js'
];

let failures = 0;
let passes = 0;
function check(cond, msg) {
  if (cond) { passes++; return; }
  failures++;
  console.log('FAIL: ' + msg);
}

// Load every script the way the browser does, in the same order, into one sandbox.
const sandbox = { window: {}, console };
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
for (const f of files) {
  const src = fs.readFileSync(path.join(jsDir, f), 'utf8');
  try {
    vm.runInContext(src, sandbox, { filename: f });
  } catch (e) {
    check(false, `${f} failed to load: ${e.message}`);
  }
}
const NS = sandbox.window.WBPSC || {};
check(!!NS.exam, 'exam data is missing');
check(Array.isArray(NS.chapters) && NS.chapters.length > 0, 'chapter list is missing');
check(Array.isArray(NS.bank), 'question bank is missing');

// ---- chapters ----
const ids = (NS.chapters || []).map((c) => c.id);
check(new Set(ids).size === ids.length, 'duplicate chapter ids');
const expectCounts = { arith: 13, english: 14, gs: 7, p2a: 3, p2b: 3 };
for (const [subject, n] of Object.entries(expectCounts)) {
  const got = (NS.chapters || []).filter((c) => c.subject === subject).length;
  check(got === n, `subject ${subject} should have ${n} chapters, found ${got}`);
}
for (const id of ids) {
  check(typeof (NS.notes || {})[id] === 'string' && NS.notes[id].length > 200, `chapter ${id} has no substantial notes`);
}
for (const subj of NS.exam.subjects) {
  for (const id of subj.chapters) {
    check(!!NS.chapterById[id], `syllabus ${subj.id} lists unknown chapter ${id}`);
  }
}
const listedInSyllabus = new Set(NS.exam.subjects.flatMap((s) => s.chapters));
for (const id of ids) check(listedInSyllabus.has(id), `chapter ${id} is not in the syllabus list`);

// ---- official numbers (from the official notice) ----
const part1 = NS.exam.part1;
check(part1.questions === 100 && part1.minutes === 90 && part1.negativePerWrong === 0.25, 'Part-I pattern does not match the notice');
const secSum = part1.sections.reduce((a, s) => a + s.questions, 0);
check(secSum === 100, 'Part-I section question counts do not add up to 100');
check(part1.sections.map((s) => s.questions).join(',') === '30,40,30', 'Part-I sections should be English 30, GS 40, Arithmetic 30');
check(NS.exam.part2.marks === 100 && NS.exam.part2.minutes === 60, 'Part-II pattern does not match the notice');
check(NS.exam.typing.english === 20 && NS.exam.typing.bengali === 10, 'typing targets should be 20 wpm English and 10 wpm Bengali');
check(NS.exam.dates.some((d) => /26 October 2026, 3:30 PM/.test(d.value)), 'application deadline missing');
check(NS.exam.dates.some((d) => /28 October – 1 November 2026/.test(d.value)), 'edit window missing');

// ---- question bank ----
const bank = NS.bank || [];
const seenIds = new Set();
for (const q of bank) {
  const where = `question ${q.id}`;
  check(!seenIds.has(q.id), `duplicate question id ${q.id}`);
  seenIds.add(q.id);
  check(typeof q.q === 'string' && q.q.trim().length > 5, `${where} has no text`);
  check(Array.isArray(q.options) && q.options.length === 4, `${where} must have 4 options`);
  check(new Set(q.options).size === q.options.length, `${where} has duplicate options`);
  check(Number.isInteger(q.answer) && q.answer >= 0 && q.answer <= 3, `${where} has an invalid answer index`);
  check(typeof q.exp === 'string' && q.exp.trim().length > 10, `${where} has no explanation`);
  check(!!NS.chapterById[q.topic], `${where} points to unknown chapter ${q.topic}`);
  if (NS.chapterById[q.topic]) check(NS.chapterById[q.topic].subject === q.subject, `${where} subject does not match its chapter`);
}
for (const c of NS.chapters || []) {
  if (c.subject === 'english' || c.subject === 'gs') {
    const n = bank.filter((q) => q.topic === c.id).length;
    check(n >= 5, `chapter ${c.id} has only ${n} questions (need at least 5)`);
  }
}
check(bank.filter((q) => q.subject === 'english').length >= 30, 'need at least 30 English questions for a full mock');
check(bank.filter((q) => q.subject === 'gs').length >= 40, 'need at least 40 GS questions for a full mock');

// ---- writing and typing content ----
check((NS.writingPrompts || []).length >= 2, 'need at least two report prompts');
check((NS.precisPrompts || []).length >= 1, 'need at least one precis prompt');
check((NS.translationPrompts || []).length >= 8, 'need at least eight translation prompts');
check((NS.typingPassages.en || []).length >= 2 && (NS.typingPassages.bn || []).length >= 2, 'need two passages for each typing language');

// ---- arithmetic generator ----
const arith = NS.arith;
check(!!arith, 'arithmetic generator is missing');
if (arith) {
  check(arith.topics.length === 13, 'arithmetic should have 13 topics');
  let generated = 0;
  for (const t of arith.topics) {
    check(!!NS.chapterById[t.id], `arithmetic topic ${t.id} has no chapter`);
    for (let i = 0; i < 200; i++) {
      let q;
      try { q = arith.generate(t.id); } catch (e) { check(false, `${t.id} generator threw: ${e.message}`); break; }
      generated++;
      check(q.options.length === 4 && new Set(q.options).size === 4, `${t.id} produced bad options: ${q.options.join(' | ')}`);
      check(q.answer >= 0 && q.answer <= 3, `${t.id} answer index out of range`);
      const correct = q.options[q.answer];
      check(q.exp.includes(correct), `${t.id} explanation does not show the answer "${correct}"`);
      check(!/NaN|undefined|Infinity/.test(q.q + q.exp + q.options.join('|')), `${t.id} printed a bad value`);
    }
  }
  const mixed = arith.mixed(30);
  check(mixed.length === 30, 'mixed(30) should return 30 questions');
  check(new Set(mixed.map((q) => q.topic)).size >= 10, 'mixed set should cover most arithmetic topics');
  check(generated > 2000, 'generator sample too small');
}

console.log(`Checks passed: ${passes}, failed: ${failures}`);
console.log(`Questions in bank: ${bank.length} (English ${bank.filter((q) => q.subject === 'english').length}, GS ${bank.filter((q) => q.subject === 'gs').length}); arithmetic is generated.`);
process.exit(failures ? 1 : 0);
