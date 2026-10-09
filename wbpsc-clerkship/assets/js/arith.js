/*
 * WBPSC Clerkship Part-I — Arithmetic question generator.
 *
 * Every question is built in code with its answer computed from the numbers used,
 * so practice and mock tests never run out and the answer key cannot drift.
 *
 *   WBPSC.arith.topics        -> [{ id, title }]  (matches the Arithmetic chapters)
 *   WBPSC.arith.generate(id)  -> one question { id, subject, topic, q, options, answer, exp }
 *   WBPSC.arith.mixed(n)      -> n questions spread across all Arithmetic topics
 */
(function (root) {
  'use strict';
  var NS = (root.WBPSC = root.WBPSC || {});

  var defaultRng = Math.random;

  // ---------- helpers ----------
  function rint(rng, lo, hi) { return lo + Math.floor(rng() * (hi - lo + 1)); } // inclusive
  function pick(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }
  function shuffle(rng, arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
  function lcm(a, b) { return (a / gcd(a, b)) * b; }
  function gcdAll(arr) { return arr.reduce(function (x, y) { return gcd(x, y); }); }
  function lcmAll(arr) { return arr.reduce(function (x, y) { return lcm(x, y); }); }
  function fracText(n, d) {
    if (d < 0) { n = -n; d = -d; }
    var g = gcd(n, d) || 1;
    n = n / g; d = d / g;
    return d === 1 ? String(n) : n + '/' + d;
  }
  function ratioText(a, b) { var g = gcd(a, b) || 1; return (a / g) + ':' + (b / g); }
  function divisors(n) { var out = []; for (var i = 1; i <= n; i++) { if (n % i === 0) out.push(i); } return out; }
  function num(v) { return Number(v).toLocaleString('en-IN'); }
  function rupee(v) { return '₹' + num(v); }
  function pct(v) { return (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v) + '%'; }
  var SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
  function factorStr(n) {
    var parts = [];
    var x = n;
    for (var p = 2; p * p <= x; p++) {
      var e = 0;
      while (x % p === 0) { x = x / p; e++; }
      if (e) parts.push(p + (e > 1 ? String(e).split('').map(function (c) { return SUP[c]; }).join('') : ''));
    }
    if (x > 1) parts.push(String(x));
    return parts.join(' × ');
  }
  // Distinct integers close to c (used as plausible wrong options).
  function nearInts(rng, c, count, min, span) {
    var s = span || Math.max(3, Math.round(Math.abs(c) * 0.2));
    var out = [];
    var guard = 0;
    var lo = typeof min === 'number' ? min : -Infinity;
    while (out.length < count && guard++ < 5000) {
      var v = c + rint(rng, 1, s) * (rng() < 0.5 ? -1 : 1);
      if (v !== c && v >= lo && out.indexOf(v) === -1) out.push(v);
    }
    return out;
  }
  // Build a 4-option MCQ. `correct` and `wrongs` are display strings.
  function mcq(rng, topic, q, correct, wrongs, exp) {
    var uniq = [];
    for (var i = 0; i < wrongs.length && uniq.length < 3; i++) {
      var w = wrongs[i];
      if (w !== correct && uniq.indexOf(w) === -1) uniq.push(w);
    }
    if (uniq.length < 3) throw new Error('Not enough distinct options for ' + topic + ': ' + q);
    var options = shuffle(rng, [correct].concat(uniq));
    return {
      id: topic + '-' + Math.floor(rng() * 1e9).toString(36),
      subject: 'arith',
      topic: topic,
      q: q,
      options: options,
      answer: options.indexOf(correct),
      exp: exp
    };
  }

  var G = {};

  // 1. Divisibility ----------------------------------------------------------
  var TOPIC_DIV = 'arith-divisibility';
  var DIV_HINT = {
    4: 'a number is divisible by 4 if its last two digits are',
    6: 'a number is divisible by 6 if it is divisible by both 2 and 3',
    7: 'double the last digit, subtract it from the rest, and repeat',
    8: 'a number is divisible by 8 if its last three digits are',
    9: 'a number is divisible by 9 if its digit sum is',
    11: 'alternate the digits (add odd-place, subtract even-place) and check',
    12: 'a number is divisible by 12 if it is divisible by both 3 and 4'
  };
  G[TOPIC_DIV] = function (rng) {
    var kind = rint(rng, 0, 2);
    if (kind === 0) {
      var d = pick(rng, [4, 6, 7, 8, 9, 11, 12]);
      var n = rint(rng, 1000, 999999);
      var r = n % d;
      var others = [];
      for (var x = 0; x < d; x++) { if (x !== r) others.push(String(x)); }
      var wr = shuffle(rng, others).slice(0, 3);
      return mcq(rng, TOPIC_DIV,
        'What is the remainder when ' + num(n) + ' is divided by ' + d + '?',
        String(r), wr,
        num(n) + ' ÷ ' + d + ' leaves remainder ' + r + '. (Tip: ' + DIV_HINT[d] + '.)');
    }
    if (kind === 1) {
      var k = rint(rng, 100, 9000);
      var m = 11 * k;
      var digits = String(m).split('').reverse().map(Number);
      var alt = digits.reduce(function (acc, dg, i) { return acc + (i % 2 === 0 ? dg : -dg); }, 0);
      return mcq(rng, TOPIC_DIV,
        'Which of the following numbers is divisible by 11?',
        num(m), [num(m + 1), num(m + 2), num(m + 4), num(m + 5)],
        'Alternating sum of ' + num(m) + ' = ' + alt + ', which is a multiple of 11 (0 included). So ' + num(m) + ' is divisible by 11.');
    }
    // missing digit so that a 4-digit number is divisible by 9
    var len = 4;
    var digs, known, pos, tries = 0;
    do {
      digs = [rint(rng, 1, 9)];
      for (var i = 1; i < len; i++) digs.push(rint(rng, 0, 9));
      pos = rint(rng, 1, len - 1);
      known = digs.reduce(function (s, dg, idx) { return idx === pos ? s : s + dg; }, 0);
    } while (known % 9 === 0 && ++tries < 1000);
    var missing = (9 - (known % 9)) % 9; // unique digit 1..8
    var shown = digs.map(function (dg, idx) { return idx === pos ? '_' : String(dg); }).join('');
    var wrongDigits = [];
    for (var dd = 0; dd <= 9; dd++) { if (dd !== missing) wrongDigits.push(String(dd)); }
    return mcq(rng, TOPIC_DIV,
      'The number ' + shown + ' is divisible by 9. Which digit should replace the blank (_)?',
      String(missing), shuffle(rng, wrongDigits).slice(0, 3),
      'Sum of the known digits = ' + known + '. We need ' + known + ' + x to be a multiple of 9, so x = ' + missing + ' (' + known + ' + ' + missing + ' = ' + (known + missing) + ').');
  };

  // 2. HCF and LCM -----------------------------------------------------------
  var TOPIC_HL = 'arith-hcf-lcm';
  G[TOPIC_HL] = function (rng) {
    var kind = rint(rng, 0, 3);
    if (kind === 0) {
      var g = rint(rng, 2, 12);
      var a = g * rint(rng, 2, 9), b = g * rint(rng, 2, 9), c = g * rint(rng, 2, 9);
      var h = gcdAll([a, b, c]);
      return mcq(rng, TOPIC_HL,
        'Find the HCF (highest common factor) of ' + a + ', ' + b + ' and ' + c + '.',
        String(h), nearInts(rng, h, 4, 1).map(String),
        a + ' = ' + h + ' × ' + (a / h) + ', ' + b + ' = ' + h + ' × ' + (b / h) + ', ' + c + ' = ' + h + ' × ' + (c / h) +
        '. The remaining quotients have no common factor, so HCF = ' + h + '.');
    }
    if (kind === 1) {
      var p = rint(rng, 4, 36), q = rint(rng, 4, 36);
      if (p === q) q = p + 3;
      var L = lcm(p, q);
      return mcq(rng, TOPIC_HL,
        'Find the LCM (least common multiple) of ' + p + ' and ' + q + '.',
        String(L), [String(p * q), String(gcd(p, q))].concat(nearInts(rng, L, 4, 1).map(String)),
        p + ' = ' + factorStr(p) + ', ' + q + ' = ' + factorStr(q) + '. LCM takes each prime at its highest power, so LCM = ' + L + '. (Check: HCF × LCM = product, ' + gcd(p, q) + ' × ' + L + ' = ' + (p * q) + '.)');
    }
    if (kind === 2) {
      var H = rint(rng, 2, 15), r = rint(rng, 1, H - 1);
      var q1, q2, q3, t = 0;
      do { q1 = rint(rng, 3, 12); q2 = rint(rng, 3, 12); q3 = rint(rng, 3, 12); } while ((gcdAll([q1, q2, q3]) !== 1 || q1 === q2 || q2 === q3 || q1 === q3) && ++t < 500);
      var ans = H * gcdAll([q1, q2, q3]);
      var A = H * q1 + r, B = H * q2 + r, C = H * q3 + r;
      return mcq(rng, TOPIC_HL,
        'What is the greatest number that divides ' + A + ', ' + B + ' and ' + C + ' and leaves remainder ' + r + ' in each case?',
        String(ans), nearInts(rng, ans, 4, 1).map(String),
        'Subtract the remainder ' + r + ' from each: ' + (A - r) + ', ' + (B - r) + ', ' + (C - r) + '. Their HCF = ' + ans + ', which is the required number.');
    }
    var x1 = rint(rng, 4, 12), x2 = rint(rng, 4, 12), x3 = rint(rng, 4, 12);
    var LL = lcmAll([x1, x2, x3]);
    var rr = rint(rng, 1, Math.min(x1, x2, x3) - 1);
    var least = LL + rr;
    return mcq(rng, TOPIC_HL,
      'What is the least number which, when divided by ' + x1 + ', ' + x2 + ' and ' + x3 + ', leaves remainder ' + rr + ' in each case?',
      String(least), [String(LL), String(LL - rr), String(least + 1), String(least - 1)].concat(nearInts(rng, least, 2, 1).map(String)),
      'LCM(' + x1 + ', ' + x2 + ', ' + x3 + ') = ' + LL + '. Least number = LCM + remainder = ' + LL + ' + ' + rr + ' = ' + least + '.');
  };

  // 3. Fractions -------------------------------------------------------------
  var TOPIC_FR = 'arith-fractions';
  G[TOPIC_FR] = function (rng) {
    var kind = rint(rng, 0, 3);
    if (kind === 0) {
      var a = rint(rng, 1, 9), b = rint(rng, 2, 12), c = rint(rng, 1, 9), d = rint(rng, 2, 12);
      if (a >= b) a = b - 1;
      if (c >= d) c = d - 1;
      var num1 = a * d + c * b, den1 = b * d;
      var ans = fracText(num1, den1);
      return mcq(rng, TOPIC_FR,
        'Simplify: ' + a + '/' + b + ' + ' + c + '/' + d + ' (give the answer in lowest terms)',
        ans,
        [fracText(a + c, b + d), fracText(a * c, b * d), fracText(num1 + 1, den1), fracText(num1, den1 + 1), fracText(num1 - 1, den1)],
        a + '/' + b + ' + ' + c + '/' + d + ' = (' + a + '×' + d + ' + ' + c + '×' + b + ')/(' + b + '×' + d + ') = ' + num1 + '/' + den1 + (ans !== num1 + '/' + den1 ? ' = ' + ans : '') + '.');
    }
    if (kind === 1) {
      var a2 = rint(rng, 1, 9), b2 = rint(rng, 2, 12), c2 = rint(rng, 1, 12), d2 = rint(rng, 2, 12);
      if (a2 >= b2) a2 = b2 - 1;
      var ans2 = fracText(a2 * c2, b2 * d2);
      return mcq(rng, TOPIC_FR,
        'What is ' + a2 + '/' + b2 + ' of ' + c2 + '/' + d2 + '?',
        ans2,
        [fracText(a2 * d2, b2 * c2), fracText(a2 + c2, b2 + d2), fracText(a2 * c2 + 1, b2 * d2), fracText(a2 * c2, b2 * d2 + 1), fracText(a2 * c2 - 1, b2 * d2)],
        '"Of" means multiply: ' + a2 + '/' + b2 + ' × ' + c2 + '/' + d2 + ' = ' + (a2 * c2) + '/' + (b2 * d2) + (ans2 !== (a2 * c2) + '/' + (b2 * d2) ? ' = ' + ans2 : '') + '.');
    }
    if (kind === 2) {
      var a3 = rint(rng, 1, 9), b3 = rint(rng, 2, 12), c3 = rint(rng, 1, 9), d3 = rint(rng, 2, 12);
      if (a3 >= b3) a3 = b3 - 1;
      if (c3 >= d3) c3 = d3 - 1;
      var ans3 = fracText(a3 * d3, b3 * c3);
      return mcq(rng, TOPIC_FR,
        'Find the value of (' + a3 + '/' + b3 + ') ÷ (' + c3 + '/' + d3 + ').',
        ans3,
        [fracText(a3 * c3, b3 * d3), fracText(b3 * c3, a3 * d3), fracText(a3 * d3 + 1, b3 * c3), fracText(a3 + d3, b3 + c3)],
        'Division = multiply by the reciprocal: ' + a3 + '/' + b3 + ' × ' + d3 + '/' + c3 + ' = ' + (a3 * d3) + '/' + (b3 * c3) + (ans3 !== (a3 * d3) + '/' + (b3 * c3) ? ' = ' + ans3 : '') + '.');
    }
    // largest of four proper fractions
    var pool = [], vals = [], tries = 0;
    while (pool.length < 4 && tries++ < 2000) {
      var den = rint(rng, 2, 12), numr = rint(rng, 1, den - 1);
      var dupe = pool.some(function (f) { return f[0] * den === numr * f[1]; });
      if (!dupe) pool.push([numr, den]);
    }
    vals = pool.map(function (f) { return f[0] / f[1]; });
    var best = 0;
    for (var i = 1; i < pool.length; i++) { if (vals[i] > vals[best]) best = i; }
    var bestStr = pool[best][0] + '/' + pool[best][1];
    var others = pool.filter(function (f, idx) { return idx !== best; }).map(function (f) { return f[0] + '/' + f[1]; });
    return mcq(rng, TOPIC_FR,
      'Which of these fractions is the largest?',
      bestStr, others,
      'Convert to decimals: ' + pool.map(function (f) { return f[0] + '/' + f[1] + ' = ' + (f[0] / f[1]).toFixed(3); }).join(', ') + '. The largest is ' + bestStr + '.');
  };

  // 4. Decimals and recurring decimals ---------------------------------------
  var TOPIC_DEC = 'arith-decimals';
  // Build a decimal string from an integer scaled by 10^scale.
  function decStr(v, scale) {
    if (scale <= 0) return String(v);
    var neg = v < 0;
    var s = String(Math.abs(v));
    while (s.length < scale + 1) s = '0' + s;
    var ip = s.slice(0, s.length - scale);
    var fp = s.slice(s.length - scale).replace(/0+$/, '');
    return (neg ? '-' : '') + ip + (fp ? '.' + fp : '');
  }
  G[TOPIC_DEC] = function (rng) {
    var kind = rint(rng, 0, 3);
    if (kind === 0) {
      var ab = rint(rng, 10, 98);
      var ans = fracText(ab, 99);
      return mcq(rng, TOPIC_DEC,
        'Express 0.(' + ab + ') as a fraction in lowest terms. (The bracket shows the repeating part.)',
        ans,
        [ab + '/100', ab + '/90', ab + '/9', fracText(ab + 1, 99)],
        '0.(' + ab + ') = ' + ab + '/99 (repeating block over 99) = ' + ans + '.');
    }
    if (kind === 1) {
      var dd = rint(rng, 1, 9), xx = rint(rng, 1, 9);
      var numr = 10 * dd + xx - dd; // (dx - d) / 90
      var ans2 = fracText(numr, 90);
      return mcq(rng, TOPIC_DEC,
        'Express 0.' + dd + '(' + xx + ') as a fraction in lowest terms.',
        ans2,
        [fracText(10 * dd + xx, 90), fracText(10 * dd + xx, 99), fracText(numr, 100), fracText(10 * dd + xx - 1, 90)],
        '0.' + dd + '(' + xx + ') = (' + dd + xx + ' − ' + dd + ') / 90 = ' + numr + '/90 = ' + ans2 + '. (Subtract the non-repeating part before dividing by 90.)');
    }
    // exact decimal addition or multiplication
    var da = rint(rng, 1, 2), db = rint(rng, 1, 2);
    var A = rint(rng, 1, Math.pow(10, da) - 1), B = rint(rng, 1, Math.pow(10, db) - 1);
    var aStr = decStr(A, da), bStr = decStr(B, db);
    var val, scale, op, step;
    if (kind === 2) {
      var k = Math.max(da, db);
      var A2 = A * Math.pow(10, k - da), B2 = B * Math.pow(10, k - db);
      val = A2 + B2; scale = k; op = '+';
      step = aStr + ' + ' + bStr + ' = ' + decStr(A2, k) + ' + ' + decStr(B2, k) + ' = ' + decStr(val, k) + '.';
    } else {
      val = A * B; scale = da + db; op = '×';
      step = aStr + ' × ' + bStr + ' = ' + A + ' × ' + B + ' = ' + val + ', then place the decimal point ' + scale + ' places from the right: ' + decStr(val, scale) + '.';
    }
    var correct = decStr(val, scale);
    var wrongs = [decStr(val, scale + 1), decStr(val + 1, scale)];
    if (scale >= 1) wrongs.push(decStr(val, scale - 1));
    wrongs.push(decStr(val - 1, scale));
    return mcq(rng, TOPIC_DEC,
      'Find the value of ' + aStr + ' ' + op + ' ' + bStr + '.',
      correct, wrongs, step);
  };

  // 5. Simplification (BODMAS) -----------------------------------------------
  var TOPIC_SIMP = 'arith-simplification';
  G[TOPIC_SIMP] = function (rng) {
    var kind = rint(rng, 0, 2);
    if (kind === 0) {
      var a = rint(rng, 2, 40), b = rint(rng, 2, 12), c = rint(rng, 2, 12);
      var e = rint(rng, 2, 9), k = rint(rng, 2, 12);
      var d = e * k;
      var ans = a + b * c - k;
      var ltr = (a + b) * c - k; // what a left-to-right mistake gives
      return mcq(rng, TOPIC_SIMP,
        'Simplify: ' + a + ' + ' + b + ' × ' + c + ' − ' + d + ' ÷ ' + e,
        String(ans),
        [String(ltr), String(a + b * c + k), String(ans + 1), String(ans - 1), String(ans + e)],
        'BODMAS: do × and ÷ first. ' + b + ' × ' + c + ' = ' + (b * c) + ' and ' + d + ' ÷ ' + e + ' = ' + k + '. Then ' + a + ' + ' + (b * c) + ' − ' + k + ' = ' + ans + '. (Doing it strictly left to right gives ' + ltr + ', which is wrong.)');
    }
    if (kind === 1) {
      var tries = 0, aa, bb, cc, dd, N, ee, res;
      do {
        aa = rint(rng, 1, 20); bb = rint(rng, 1, 20); cc = rint(rng, 2, 9);
        N = (aa + bb) * cc;
        var divs = divisors(N).filter(function (x) { return x > 1 && x < N; });
        if (!divs.length) { tries++; continue; }
        dd = pick(rng, divs);
        var quot = N / dd;
        if (quot < 3) { tries++; continue; }
        ee = rint(rng, 1, quot - 2);
        res = quot - ee;
        break;
      } while (++tries < 2000);
      return mcq(rng, TOPIC_SIMP,
        'Simplify: (' + aa + ' + ' + bb + ') × ' + cc + ' ÷ ' + dd + ' − ' + ee,
        String(res),
        [String(N / dd + ee), String(aa + bb * cc - ee), String(res + 1), String(res - 2), String(N - dd - ee)],
        'Brackets first: ' + aa + ' + ' + bb + ' = ' + (aa + bb) + '. Then × ' + cc + ' = ' + N + ', ÷ ' + dd + ' = ' + (N / dd) + ', − ' + ee + ' = ' + res + '.');
    }
    var s = rint(rng, 2, 12), p = rint(rng, 2, 12), q = rint(rng, 2, 12);
    var r2 = s + p * q - q;
    return mcq(rng, TOPIC_SIMP,
      'Simplify: √' + (s * s) + ' + ' + p + ' × ' + q + ' − ' + q,
      String(r2),
      [String((s + p) * q - q), String(s + p * q + q), String(r2 + 2), String(s * s + p * q - q)],
      '√' + (s * s) + ' = ' + s + '. Then ' + s + ' + ' + p + ' × ' + q + ' − ' + q + ' = ' + s + ' + ' + (p * q) + ' − ' + q + ' = ' + r2 + '.');
  };

  // 6. Average ----------------------------------------------------------------
  var TOPIC_AVG = 'arith-average';
  G[TOPIC_AVG] = function (rng) {
    var kind = rint(rng, 0, 2);
    if (kind === 0) {
      var n = rint(rng, 4, 8), A = rint(rng, 10, 60);
      var x, t = 0;
      do { x = rint(rng, 1, A + 20); } while (((n * A - x) % (n - 1)) !== 0 && ++t < 5000);
      if (((n * A - x) % (n - 1)) !== 0) return G[TOPIC_AVG](rng);
      var newAvg = (n * A - x) / (n - 1);
      return mcq(rng, TOPIC_AVG,
        'The average of ' + n + ' numbers is ' + A + '. If one number ' + x + ' is removed, what is the average of the remaining numbers?',
        String(newAvg), nearInts(rng, newAvg, 4, 0).map(String),
        'Total of ' + n + ' numbers = ' + n + ' × ' + A + ' = ' + (n * A) + '. After removing ' + x + ', total = ' + (n * A - x) + ' for ' + (n - 1) + ' numbers. New average = ' + (n * A - x) + ' ÷ ' + (n - 1) + ' = ' + newAvg + '.');
    }
    if (kind === 1) {
      var n2 = rint(rng, 3, 9), A2 = rint(rng, 10, 60), B2 = A2 + rint(rng, -6, 6);
      if (B2 === A2) B2 = A2 + 2;
      var y = (n2 + 1) * B2 - n2 * A2;
      if (y <= 0) return G[TOPIC_AVG](rng);
      return mcq(rng, TOPIC_AVG,
        'The average of ' + n2 + ' numbers is ' + A2 + '. When one more number is added, the average becomes ' + B2 + '. What is the added number?',
        String(y), nearInts(rng, y, 4, 0).map(String),
        'Sum before = ' + n2 + ' × ' + A2 + ' = ' + (n2 * A2) + '. Sum after = ' + (n2 + 1) + ' × ' + B2 + ' = ' + ((n2 + 1) * B2) + '. Added number = ' + ((n2 + 1) * B2) + ' − ' + (n2 * A2) + ' = ' + y + '.');
    }
    var odd = pick(rng, [9, 11, 13, 15, 17, 19, 21, 25, 29]);
    var avg = (odd + 1) / 2;
    return mcq(rng, TOPIC_AVG,
      'What is the average of the first ' + odd + ' natural numbers (1, 2, 3, ...)?',
      String(avg), nearInts(rng, avg, 4, 1).map(String),
      'Sum of first n natural numbers = n(n+1)/2 = ' + odd + ' × ' + (odd + 1) + ' / 2. Average = sum / n = (n+1)/2 = ' + avg + '.');
  };

  // 7. Ratio and proportion ---------------------------------------------------
  var TOPIC_RAT = 'arith-ratio';
  G[TOPIC_RAT] = function (rng) {
    var kind = rint(rng, 0, 4);
    if (kind === 0) {
      var a = rint(rng, 1, 9), b = rint(rng, 1, 9);
      if (a === b) b = a + 1;
      var gg = gcd(a, b);
      a = a / gg; b = b / gg; // keep the given ratio in lowest terms
      if (a === b) b = a + 1;
      var k = rint(rng, 2, 12);
      var S = (a + b) * k, big = Math.max(a, b) * k;
      return mcq(rng, TOPIC_RAT,
        'The sum of two numbers is ' + S + ' and their ratio is ' + a + ':' + b + '. What is the larger number?',
        String(big), [String(Math.min(a, b) * k), String(S - big + 1), String(big + k), String(big - k)],
        'Total parts = ' + a + ' + ' + b + ' = ' + (a + b) + '. One part = ' + S + ' ÷ ' + (a + b) + ' = ' + k + '. Larger = ' + Math.max(a, b) + ' × ' + k + ' = ' + big + '.');
    }
    if (kind === 1) {
      var p = rint(rng, 2, 9), q1 = rint(rng, 2, 9), r = rint(rng, 2, 9), s = rint(rng, 2, 9);
      if (p === q1) q1 = p + 1;
      var ans = ratioText(p * r, q1 * s);
      return mcq(rng, TOPIC_RAT,
        'If A : B = ' + p + ' : ' + q1 + ' and B : C = ' + r + ' : ' + s + ', find A : C (in lowest terms).',
        ans, [ratioText(p + r, q1 + s), ratioText(p * s, q1 * r), ratioText(q1 * s, p * r), ratioText(p, s)],
        'Make B equal in both: A : B = ' + (p * r) + ' : ' + (q1 * r) + ' and B : C = ' + (q1 * r) + ' : ' + (q1 * s) + '. So A : C = ' + (p * r) + ' : ' + (q1 * s) + ' = ' + ans + '.');
    }
    if (kind === 2) {
      var a2 = rint(rng, 2, 6), b2 = rint(rng, 2, 6), x2 = rint(rng, 2, 8);
      if (a2 === b2) b2 = a2 + 1;
      var A2 = a2 * x2, B2 = b2 * x2, n2 = rint(rng, 2, 10);
      var ans2 = ratioText(A2 + n2, B2 + n2);
      return mcq(rng, TOPIC_RAT,
        'The present ages of A and B are in the ratio ' + a2 + ' : ' + b2 + '. If A is ' + A2 + ' years old now, what will be the ratio of their ages after ' + n2 + ' years?',
        ans2, [ratioText(A2, B2 + n2), ratioText(a2 + n2, b2 + n2), ratioText(B2 + n2, A2 + n2), ratioText(A2 + 2 * n2, B2 + 2 * n2)],
        'B is now ' + b2 + ' × ' + x2 + ' = ' + B2 + ' years. After ' + n2 + ' years: A = ' + (A2 + n2) + ', B = ' + (B2 + n2) + '. Ratio = ' + ans2 + '.');
    }
    if (kind === 3) {
      var a3 = rint(rng, 1, 6), b3 = rint(rng, 2, 7), c3 = rint(rng, 3, 9), k3 = rint(rng, 10, 60);
      var T = (a3 + b3 + c3) * k3;
      return mcq(rng, TOPIC_RAT,
        'Divide ' + rupee(T) + ' among A, B and C in the ratio ' + a3 + ' : ' + b3 + ' : ' + c3 + '. What is the share of C?',
        rupee(c3 * k3), [rupee(a3 * k3), rupee(b3 * k3), rupee((a3 + b3) * k3), rupee(T - c3 * k3 - k3)],
        'Total parts = ' + a3 + ' + ' + b3 + ' + ' + c3 + ' = ' + (a3 + b3 + c3) + '. One part = ' + rupee(T) + ' ÷ ' + (a3 + b3 + c3) + ' = ' + rupee(k3) + '. C gets ' + c3 + ' parts = ' + rupee(c3 * k3) + '.');
    }
    // inverse proportion (men x days = constant)
    var m1 = rint(rng, 6, 20), d1 = rint(rng, 4, 15), N = m1 * d1, m2, tr = 0;
    var cands = divisors(N).filter(function (x) { return x !== m1 && x > 1 && N / x >= 2; });
    while (!cands.length && tr++ < 100) { m1 = rint(rng, 6, 20); d1 = rint(rng, 4, 15); N = m1 * d1; cands = divisors(N).filter(function (x) { return x !== m1 && x > 1 && N / x >= 2; }); }
    m2 = pick(rng, cands);
    var days = N / m2;
    return mcq(rng, TOPIC_RAT,
      m1 + ' men can finish a piece of work in ' + d1 + ' days. In how many days will ' + m2 + ' men finish the same work at the same rate?',
      String(days), nearInts(rng, days, 4, 1).map(String),
      'Work is inversely proportional to number of men: ' + m1 + ' × ' + d1 + ' = ' + N + ' man-days. For ' + m2 + ' men: days = ' + N + ' ÷ ' + m2 + ' = ' + days + '.');
  };

  // 8. Percentage ------------------------------------------------------------
  var TOPIC_PCT = 'arith-percentage';
  G[TOPIC_PCT] = function (rng) {
    var kind = rint(rng, 0, 3);
    if (kind === 0) {
      var p = pick(rng, [5, 10, 12, 15, 20, 25, 30, 35, 40, 45, 50, 60, 75, 80]);
      var N = 100 * rint(rng, 2, 30);
      var ans = p * N / 100;
      return mcq(rng, TOPIC_PCT,
        'What is ' + p + '% of ' + num(N) + '?',
        num(ans), nearInts(rng, ans, 4, 0).map(function (v) { return num(v); }),
        p + '% of ' + num(N) + ' = ' + p + ' / 100 × ' + num(N) + ' = ' + num(ans) + '.');
    }
    if (kind === 1) {
      var B = 20 * rint(rng, 2, 25), P = 5 * rint(rng, 1, 19);
      var A = B * P / 100;
      return mcq(rng, TOPIC_PCT,
        A + ' is what percent of ' + B + '?',
        P + '%', nearInts(rng, P, 4, 1).map(function (v) { return v + '%'; }),
        '(' + A + ' ÷ ' + B + ') × 100 = ' + P + '%.');
    }
    if (kind === 2) {
      var p2 = 10 * rint(rng, 1, 5), q2 = 10 * rint(rng, 1, 5);
      var net = p2 - q2 - (p2 * q2) / 100;
      if (net === 0) return G[TOPIC_PCT](rng);
      return mcq(rng, TOPIC_PCT,
        'The price of an item is first increased by ' + p2 + '% and then decreased by ' + q2 + '%. What is the net change in its price?',
        pct(net), [pct(p2 - q2), pct(-net), pct(p2 + q2), pct(net + 10)],
        'Take the price as 100. After +' + p2 + '%: 100 + ' + p2 + ' = ' + (100 + p2) + '. After −' + q2 + '%: ' + (100 + p2) + ' × (100 − ' + q2 + ')/100 = ' + ((100 + p2) * (100 - q2) / 100) + '. Net change = ' + ((100 + p2) * (100 - q2) / 100) + ' − 100 = ' + pct(net) + '. (Successive changes do not simply add.)');
    }
    var m = rint(rng, 2, 20), p3 = 10 * rint(rng, 1, 5), kk = (100 + p3) / 10;
    var N3 = 100 * m;
    var N1 = N3 * (100 + p3) / 100, N2 = N1 * (100 + p3) / 100;
    return mcq(rng, TOPIC_PCT,
      'The population of a town is ' + num(N3) + ' now. If it increases by ' + p3 + '% every year, what will be the population after 2 years?',
      num(N2), [num(N3 + 2 * p3 * N3 / 100), num(N3 + p3 * N3 / 100), num(N1), num(N3 * (100 + 2 * p3) / 100 + 1)],
      'Year 1: ' + num(N3) + ' × ' + (100 + p3) + '/100 = ' + num(N1) + '. Year 2: ' + num(N1) + ' × ' + (100 + p3) + '/100 = ' + num(N2) + '. (Growth compounds on the new value.)');
  };

  // 9. Profit and loss -------------------------------------------------------
  var TOPIC_PL = 'arith-profit-loss';
  G[TOPIC_PL] = function (rng) {
    var kind = rint(rng, 0, 3);
    if (kind === 0) {
      var c = 100 * rint(rng, 2, 50), p = 5 * rint(rng, 1, 12);
      var sp = c * (100 + p) / 100;
      return mcq(rng, TOPIC_PL,
        'An article is bought for ' + rupee(c) + ' and sold at a profit of ' + p + '%. What is its selling price?',
        rupee(sp), nearInts(rng, sp, 4, 1).map(rupee),
        'SP = CP × (100 + profit%) / 100 = ' + num(c) + ' × ' + (100 + p) + ' / 100 = ' + rupee(sp) + '.');
    }
    if (kind === 1) {
      var c2 = 100 * rint(rng, 2, 50), l = 10 * rint(rng, 1, 5);
      var sp2 = c2 * (100 - l) / 100;
      return mcq(rng, TOPIC_PL,
        'An article is sold for ' + rupee(sp2) + ' at a loss of ' + l + '%. What is its cost price?',
        rupee(c2), [rupee(sp2), rupee(Math.round(sp2 * (100 + l) / 100)), rupee(c2 + l), rupee(c2 - 100)].concat(nearInts(rng, c2, 2, 1).map(rupee)),
        'CP = SP × 100 / (100 − loss%) = ' + num(sp2) + ' × 100 / ' + (100 - l) + ' = ' + rupee(c2) + '.');
    }
    if (kind === 2) {
      var c3 = 100 * rint(rng, 2, 40), g = 5 * rint(rng, 1, 10);
      var s3 = c3 * (100 + g) / 100;
      return mcq(rng, TOPIC_PL,
        'The cost price of an article is ' + rupee(c3) + ' and its selling price is ' + rupee(s3) + '. Find the profit percent.',
        g + '%', [(s3 - c3) + '%', (c3 / 100) + '%'].concat(nearInts(rng, g, 3, 1).map(function (v) { return v + '%'; })),
        'Profit = ' + num(s3) + ' − ' + num(c3) + ' = ' + rupee(s3 - c3) + '. Profit% = profit / CP × 100 = ' + (s3 - c3) + ' / ' + num(c3) + ' × 100 = ' + g + '%.');
    }
    var M = 100 * rint(rng, 2, 40), d = 10 * rint(rng, 1, 4);
    var sp4 = M * (100 - d) / 100;
    return mcq(rng, TOPIC_PL,
      'A shopkeeper marks an article at ' + rupee(M) + ' and gives a discount of ' + d + '%. What is the selling price?',
      rupee(sp4), nearInts(rng, sp4, 4, 1).map(rupee),
      'Discount = ' + num(M) + ' × ' + d + '/100 = ' + rupee(M * d / 100) + '. SP = ' + num(M) + ' − ' + num(M * d / 100) + ' = ' + rupee(sp4) + '.');
  };

  // 10. Simple interest ------------------------------------------------------
  var TOPIC_SI = 'arith-simple-interest';
  G[TOPIC_SI] = function (rng) {
    var P = 100 * rint(rng, 2, 60), R = rint(rng, 3, 15), T = rint(rng, 2, 10);
    var SI = P * R * T / 100;
    var kind = rint(rng, 0, 3);
    if (kind === 0) {
      return mcq(rng, TOPIC_SI,
        'Find the simple interest on ' + rupee(P) + ' at ' + R + '% per annum for ' + T + ' years.',
        rupee(SI), [rupee(P * R / 100), rupee(SI + P / 100), rupee(P + SI)].concat(nearInts(rng, SI, 2, 1).map(rupee)),
        'SI = P × R × T / 100 = ' + num(P) + ' × ' + R + ' × ' + T + ' / 100 = ' + rupee(SI) + '.');
    }
    if (kind === 1) {
      return mcq(rng, TOPIC_SI,
        'What is the amount (principal + interest) on ' + rupee(P) + ' at ' + R + '% simple interest per annum for ' + T + ' years?',
        rupee(P + SI), [rupee(SI), rupee(P), rupee(P + P * R / 100)].concat(nearInts(rng, P + SI, 2, 1).map(rupee)),
        'SI = ' + num(P) + ' × ' + R + ' × ' + T + ' / 100 = ' + rupee(SI) + '. Amount = ' + num(P) + ' + ' + num(SI) + ' = ' + rupee(P + SI) + '.');
    }
    if (kind === 2) {
      return mcq(rng, TOPIC_SI,
        'A sum of ' + rupee(P) + ' earns a simple interest of ' + rupee(SI) + ' in ' + T + ' years. What is the rate of interest per annum?',
        R + '%', [(R + 1) + '%', (R + 2) + '%', (R * 2) + '%'].concat(nearInts(rng, R, 2, 1).map(function (v) { return v + '%'; })),
        'R = SI × 100 / (P × T) = ' + SI + ' × 100 / (' + num(P) + ' × ' + T + ') = ' + R + '%.');
    }
    return mcq(rng, TOPIC_SI,
      'A sum of ' + rupee(P) + ' earns a simple interest of ' + rupee(SI) + ' at ' + R + '% per annum. For how many years was it invested?',
      T + ' years', [(T + 1) + ' years', (T + 2) + ' years', (T * 2) + ' years'].concat(nearInts(rng, T, 2, 1).map(function (v) { return v + ' years'; })),
      'T = SI × 100 / (P × R) = ' + SI + ' × 100 / (' + num(P) + ' × ' + R + ') = ' + T + ' years.');
  };

  // 11. Partnership ----------------------------------------------------------
  var TOPIC_PART = 'arith-partnership';
  G[TOPIC_PART] = function (rng) {
    var kind = rint(rng, 0, 2);
    var a = 1000 * rint(rng, 1, 9), b = 1000 * rint(rng, 1, 9);
    var x = rint(rng, 2, 12), y = rint(rng, 2, 12);
    if (kind === 0) {
      if (a === b) b = a + 1000;
      if (x === y) y = x + 1;
      var k = rint(rng, 10, 90);
      var ax = a * x, by = b * y, P = k * (ax + by);
      var shareA = k * ax;
      return mcq(rng, TOPIC_PART,
        'A invests ' + rupee(a) + ' for ' + x + ' months and B invests ' + rupee(b) + ' for ' + y + ' months in a business. If the total profit is ' + rupee(P) + ', what is A\u2019s share?',
        rupee(shareA), [rupee(k * by), rupee(Math.round(P / 2)), rupee(Math.round(P * a / (a + b)))].concat(nearInts(rng, shareA, 2, 1).map(rupee)),
        'Profit ratio = (' + a + ' × ' + x + ') : (' + b + ' × ' + y + ') = ' + ax + ' : ' + by + '. A\u2019s share = ' + num(P) + ' × ' + ax + ' / ' + (ax + by) + ' = ' + rupee(shareA) + '.');
    }
    if (kind === 1) {
      if (a === b) b = a + 1000;
      if (x === y) y = x + 1;
      return mcq(rng, TOPIC_PART,
        'A invests ' + rupee(a) + ' for ' + x + ' months and B invests ' + rupee(b) + ' for ' + y + ' months. What is the ratio of their profit shares (A : B)?',
        ratioText(a * x, b * y), [ratioText(a, b), ratioText(x, y), ratioText(a * y, b * x), ratioText(b * x, a * y)],
        'Profit is shared in the ratio of capital × time: ' + (a * x) + ' : ' + (b * y) + ' = ' + ratioText(a * x, b * y) + '.');
    }
    var c = 1000 * rint(rng, 1, 9), kk = rint(rng, 10, 90);
    var PP = kk * (a + b + c);
    return mcq(rng, TOPIC_PART,
      'A, B and C invest ' + rupee(a) + ', ' + rupee(b) + ' and ' + rupee(c) + ' respectively for the same period. If the total profit is ' + rupee(PP) + ', what is C\u2019s share?',
      rupee(kk * c), [rupee(kk * a), rupee(kk * b), rupee(Math.round(PP / 3))].concat(nearInts(rng, kk * c, 2, 1).map(rupee)),
      'Ratio = ' + a + ' : ' + b + ' : ' + c + '. Parts = ' + (a + b + c) + '. One part = ' + num(PP) + ' ÷ ' + num(a + b + c) + ' = ' + rupee(kk) + '. C\u2019s share = ' + c + ' × ' + kk + ' = ' + rupee(kk * c) + '.');
  };

  // 12. Time and distance ----------------------------------------------------
  var TOPIC_TD = 'arith-time-distance';
  G[TOPIC_TD] = function (rng) {
    var kind = rint(rng, 0, 5);
    if (kind === 0) {
      var S = 10 * rint(rng, 3, 12), T = rint(rng, 2, 9), D = S * T;
      return mcq(rng, TOPIC_TD,
        'A car travels at ' + S + ' km/h for ' + T + ' hours. How far does it travel?',
        D + ' km', nearInts(rng, D, 4, 1).map(function (v) { return v + ' km'; }),
        'Distance = speed × time = ' + S + ' × ' + T + ' = ' + D + ' km.');
    }
    if (kind === 1) {
      var v1 = 5 * rint(rng, 1, 7), S1 = v1 * 18 / 5;
      return mcq(rng, TOPIC_TD,
        'Convert ' + S1 + ' km/h into m/s.',
        v1 + ' m/s', nearInts(rng, v1, 4, 1).map(function (v) { return v + ' m/s'; }),
        '1 km/h = 5/18 m/s. So ' + S1 + ' km/h = ' + S1 + ' × 5/18 = ' + v1 + ' m/s.');
    }
    if (kind === 2) {
      var v2 = 5 * rint(rng, 1, 7), S2 = v2 * 18 / 5;
      return mcq(rng, TOPIC_TD,
        'Convert ' + v2 + ' m/s into km/h.',
        S2 + ' km/h', nearInts(rng, S2, 4, 1).map(function (v) { return v + ' km/h'; }),
        '1 m/s = 18/5 km/h = 3.6 km/h. So ' + v2 + ' × 18/5 = ' + S2 + ' km/h.');
    }
    if (kind === 3) {
      var vv = pick(rng, [10, 15, 20, 25, 30]), tt = rint(rng, 8, 30), LL = vv * tt;
      var SS = vv * 18 / 5;
      return mcq(rng, TOPIC_TD,
        'A train ' + LL + ' m long runs at ' + SS + ' km/h. In how many seconds will it cross a pole?',
        tt + ' s', nearInts(rng, tt, 4, 1).map(function (v) { return v + ' s'; }),
        'Speed = ' + SS + ' × 5/18 = ' + vv + ' m/s. Time = length / speed = ' + LL + ' / ' + vv + ' = ' + tt + ' seconds.');
    }
    if (kind === 4) {
      var w = pick(rng, [10, 15, 20, 25, 30]), t4 = rint(rng, 8, 25);
      var total = w * t4;
      var Stot = w * 18 / 5;
      var va = rint(rng, 10, Stot - 10), vb = Stot - va;
      var L1 = 5 * rint(rng, 2, total / 5 - 2), L2 = total - L1;
      return mcq(rng, TOPIC_TD,
        'Two trains of lengths ' + L1 + ' m and ' + L2 + ' m run towards each other at ' + va + ' km/h and ' + vb + ' km/h. In how many seconds will they completely cross each other?',
        t4 + ' s', nearInts(rng, t4, 4, 1).map(function (v) { return v + ' s'; }),
        'Relative speed = ' + va + ' + ' + vb + ' = ' + Stot + ' km/h = ' + Stot + ' × 5/18 = ' + w + ' m/s. Total length = ' + L1 + ' + ' + L2 + ' = ' + total + ' m. Time = ' + total + ' / ' + w + ' = ' + t4 + ' s.');
    }
    var s1, s2, avg, tries = 0;
    do {
      s1 = rint(rng, 20, 90); s2 = rint(rng, 20, 90);
      avg = (2 * s1 * s2) / (s1 + s2);
    } while ((s1 === s2 || avg !== Math.floor(avg)) && ++tries < 5000);
    if (s1 === s2 || avg !== Math.floor(avg)) return G[TOPIC_TD](rng);
    return mcq(rng, TOPIC_TD,
      'A person goes from town X to town Y at ' + s1 + ' km/h and returns by the same road at ' + s2 + ' km/h. What is the average speed for the whole journey?',
      avg + ' km/h', [((s1 + s2) / 2) + ' km/h'].concat(nearInts(rng, avg, 3, 1).map(function (v) { return v + ' km/h'; })),
      'Average speed = 2 × ' + s1 + ' × ' + s2 + ' / (' + s1 + ' + ' + s2 + ') = ' + avg + ' km/h. (Do not simply average the two speeds.)');
  };

  // 13. Area of rectangles and squares ---------------------------------------
  var TOPIC_AREA = 'arith-area';
  var TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [9, 40, 41], [20, 21, 29]];
  G[TOPIC_AREA] = function (rng) {
    var kind = rint(rng, 0, 8);
    if (kind === 0) {
      var l = rint(rng, 4, 30), b = rint(rng, 4, 30);
      return mcq(rng, TOPIC_AREA,
        'What is the area of a rectangle that is ' + l + ' m long and ' + b + ' m broad?',
        (l * b) + ' m²', [(2 * (l + b)) + ' m²', (l + b) + ' m²'].concat(nearInts(rng, l * b, 2, 1).map(function (v) { return v + ' m²'; })),
        'Area = length × breadth = ' + l + ' × ' + b + ' = ' + (l * b) + ' m².');
    }
    if (kind === 1) {
      var l2 = rint(rng, 4, 30), b2 = rint(rng, 4, 30);
      return mcq(rng, TOPIC_AREA,
        'What is the perimeter of a rectangle that is ' + l2 + ' m long and ' + b2 + ' m broad?',
        (2 * (l2 + b2)) + ' m', [(l2 * b2) + ' m', (l2 + b2) + ' m'].concat(nearInts(rng, 2 * (l2 + b2), 2, 1).map(function (v) { return v + ' m'; })),
        'Perimeter = 2 × (length + breadth) = 2 × (' + l2 + ' + ' + b2 + ') = ' + (2 * (l2 + b2)) + ' m.');
    }
    if (kind === 2) {
      var tr = pick(rng, TRIPLES);
      var maxK = Math.floor(100 / tr[1]);
      var kk = rint(rng, 1, Math.max(1, maxK));
      var A = tr[0] * kk, B = tr[1] * kk, C = tr[2] * kk;
      return mcq(rng, TOPIC_AREA,
        'Find the length of the diagonal of a rectangle that is ' + A + ' cm long and ' + B + ' cm broad.',
        C + ' cm', [((A + B) * 1) + ' cm'].concat(nearInts(rng, C, 3, 1).map(function (v) { return v + ' cm'; })),
        'Diagonal² = ' + A + '² + ' + B + '² = ' + (A * A) + ' + ' + (B * B) + ' = ' + (C * C) + ', so diagonal = √' + (C * C) + ' = ' + C + ' cm.');
    }
    if (kind === 3) {
      var s = rint(rng, 3, 25);
      return mcq(rng, TOPIC_AREA,
        'What is the area of a square whose side is ' + s + ' cm?',
        (s * s) + ' cm²', [(4 * s) + ' cm²', (4 * s) + ' cm'].concat(nearInts(rng, s * s, 2, 1).map(function (v) { return v + ' cm²'; })),
        'Area of a square = side² = ' + s + ' × ' + s + ' = ' + (s * s) + ' cm².');
    }
    if (kind === 4) {
      var s2 = rint(rng, 3, 25);
      return mcq(rng, TOPIC_AREA,
        'The perimeter of a square is ' + (4 * s2) + ' m. What is its area?',
        (s2 * s2) + ' m²', [(4 * s2) + ' m²', (2 * s2 * s2) + ' m²'].concat(nearInts(rng, s2 * s2, 2, 1).map(function (v) { return v + ' m²'; })),
        'Side = perimeter / 4 = ' + (4 * s2) + ' / 4 = ' + s2 + ' m. Area = ' + s2 + '² = ' + (s2 * s2) + ' m².');
    }
    if (kind === 5) {
      var s3 = rint(rng, 3, 25);
      return mcq(rng, TOPIC_AREA,
        'What is the length of the diagonal of a square of side ' + s3 + ' cm?',
        s3 + '√2 cm', [(2 * s3) + '√2 cm', s3 + '√3 cm', (s3 * s3) + ' cm'],
        'Diagonal of a square = side × √2 = ' + s3 + '√2 cm.');
    }
    if (kind === 6) {
      var L = rint(rng, 6, 30), Bd = rint(rng, 3, 20);
      var P = 2 * (L + Bd);
      return mcq(rng, TOPIC_AREA,
        'The perimeter of a rectangle is ' + P + ' m and its length is ' + L + ' m. What is its breadth?',
        Bd + ' m', nearInts(rng, Bd, 4, 1).map(function (v) { return v + ' m'; }),
        'Breadth = perimeter / 2 − length = ' + P + ' / 2 − ' + L + ' = ' + (P / 2) + ' − ' + L + ' = ' + Bd + ' m.');
    }
    if (kind === 7) {
      var l3 = rint(rng, 3, 12), b3 = rint(rng, 3, 10), r = 10 * rint(rng, 1, 9);
      return mcq(rng, TOPIC_AREA,
        'A room ' + l3 + ' m long and ' + b3 + ' m broad is to be covered with carpet at ' + rupee(r) + ' per square metre. What is the total cost?',
        rupee(l3 * b3 * r), [rupee(2 * (l3 + b3) * r), rupee((l3 + b3) * r)].concat(nearInts(rng, l3 * b3 * r, 2, 1).map(rupee)),
        'Area = ' + l3 + ' × ' + b3 + ' = ' + (l3 * b3) + ' m². Cost = ' + (l3 * b3) + ' × ' + rupee(r) + ' = ' + rupee(l3 * b3 * r) + '.');
    }
    var s4 = rint(rng, 3, 30);
    return mcq(rng, TOPIC_AREA,
      'The area of a square is ' + (s4 * s4) + ' cm². What is its side?',
      s4 + ' cm', nearInts(rng, s4, 4, 1).map(function (v) { return v + ' cm'; }),
      'Side = √area = √' + (s4 * s4) + ' = ' + s4 + ' cm.');
  };

  // ---------- public API ----------
  var TOPICS = [
    { id: TOPIC_DIV, title: 'Divisibility' },
    { id: TOPIC_HL, title: 'HCF and LCM' },
    { id: TOPIC_FR, title: 'Fractions' },
    { id: TOPIC_DEC, title: 'Decimals and recurring decimals' },
    { id: TOPIC_SIMP, title: 'Simplification (BODMAS)' },
    { id: TOPIC_AVG, title: 'Average' },
    { id: TOPIC_RAT, title: 'Ratio and proportion' },
    { id: TOPIC_PCT, title: 'Percentage' },
    { id: TOPIC_PL, title: 'Profit and loss' },
    { id: TOPIC_SI, title: 'Simple interest' },
    { id: TOPIC_PART, title: 'Partnership' },
    { id: TOPIC_TD, title: 'Time and distance' },
    { id: TOPIC_AREA, title: 'Area of rectangles and squares' }
  ];

  // Retries a generator a few times if a random draw happens to be degenerate.
  function generate(topicId, rng) {
    var fn = G[topicId];
    if (!fn) throw new Error('Unknown arithmetic topic: ' + topicId);
    var rg = rng || defaultRng;
    var lastErr = null;
    for (var i = 0; i < 25; i++) {
      try { return fn(rg); } catch (e) { lastErr = e; }
    }
    throw lastErr;
  }

  function mixed(n, rng) {
    var rg = rng || defaultRng;
    var ids = TOPICS.map(function (t) { return t.id; });
    var bag = [];
    while (bag.length < n) bag = bag.concat(shuffle(rg, ids));
    return bag.slice(0, n).map(function (id) { return generate(id, rg); });
  }

  NS.arith = { topics: TOPICS, generate: generate, mixed: mixed, _gcd: gcd, _fracText: fracText };
})(typeof window !== 'undefined' ? window : globalThis);
