/* Shared helper for the hand-written question banks (q-english.js, q-gs.js).
 * Each question is written with its correct answer first. This helper shuffles the options
 * with a seed taken from the question ID, so the order is stable across reloads and the
 * correct answer is not always in the same position.
 */
(function (root) {
  'use strict';
  var NS = (root.WBPSC = root.WBPSC || {});
  NS.bank = NS.bank || [];

  function hash(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function seeded(seed) {
    var a = seed;
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  // rows: [{ topic, q, c (correct), w (array of 3 wrong), exp }]
  NS.addQuestions = function (subject, rows) {
    var counts = {};
    rows.forEach(function (r) {
      counts[r.topic] = (counts[r.topic] || 0) + 1;
      var id = r.topic + '-' + (counts[r.topic] < 10 ? '0' : '') + counts[r.topic];
      var rng = seeded(hash(id));
      var opts = [r.c].concat(r.w);
      for (var i = opts.length - 1; i > 0; i--) {
        var j = Math.floor(rng() * (i + 1));
        var t = opts[i]; opts[i] = opts[j]; opts[j] = t;
      }
      NS.bank.push({
        id: id,
        subject: subject,
        topic: r.topic,
        q: r.q,
        options: opts,
        answer: opts.indexOf(r.c),
        exp: r.exp
      });
    });
  };
})(typeof window !== 'undefined' ? window : globalThis);
