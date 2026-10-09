/* Arithmetic chapter notes (Part-I, Arithmetic). Plain HTML, no external resources. */
(function (root) {
  'use strict';
  var NS = (root.WBPSC = root.WBPSC || {});
  NS.notes = NS.notes || {};
  Object.assign(NS.notes, {

    'arith-divisibility': `
<p>Divisibility questions test quick checks. Learn the rules once, then use them to find remainders and missing digits.</p>
<table>
<tr><th>Divisible by</th><th>Rule</th><th>Check</th></tr>
<tr><td>2</td><td>Last digit is even</td><td>4,518 → yes</td></tr>
<tr><td>3</td><td>Sum of digits divisible by 3</td><td>4+5+1+8 = 18 → yes</td></tr>
<tr><td>4</td><td>Last two digits divisible by 4</td><td>…18 → no</td></tr>
<tr><td>5</td><td>Last digit is 0 or 5</td><td>4,515 → yes</td></tr>
<tr><td>6</td><td>Divisible by both 2 and 3</td><td>4,518 → yes</td></tr>
<tr><td>8</td><td>Last three digits divisible by 8</td><td>12,344 → 344 = 8 × 43 → yes</td></tr>
<tr><td>9</td><td>Sum of digits divisible by 9</td><td>4,536 → 18 → yes</td></tr>
<tr><td>10</td><td>Last digit is 0</td><td>4,530 → yes</td></tr>
<tr><td>11</td><td>(Sum of digits in odd places) − (sum in even places) is 0 or a multiple of 11</td><td>2,728: (2+2) − (7+8) = −11 → yes</td></tr>
<tr><td>12</td><td>Divisible by both 3 and 4</td><td>…</td></tr>
</table>
<div class="formula">Remainder by 9 or 3: find the digit sum, then take its remainder. Example: 4,536 leaves remainder 0 on ÷ 9.</div>
<h3>Missing digit</h3>
<div class="example">The number 3_5 is divisible by 9. Sum of known digits = 3 + 5 = 8. We need 8 + x to be a multiple of 9, so x = 1 (8 + 1 = 9).</div>
<div class="tip">Tip for 7 (not in the rules table): double the last digit, subtract it from the rest, and repeat. 203 → 20 − 6 = 14, divisible by 7, so 203 is divisible by 7.</div>
<div class="tip">Exam trick: when a question gives four options, test the rule that matches the divisor first. Check the last digit (for 2, 5, 10), then the digit sum (for 3, 9), then the alternating sum (for 11).</div>`,

    'arith-hcf-lcm': `
<p><strong>HCF</strong> (highest common factor) is the greatest number that divides all the given numbers. <strong>LCM</strong> (least common multiple) is the smallest number that all the given numbers divide into.</p>
<h3>Method 1: prime factorisation</h3>
<div class="example">24 = 2³ × 3 and 36 = 2² × 3². HCF = lowest powers of common primes = 2² × 3 = 12. LCM = highest powers of all primes = 2³ × 3² = 72.</div>
<h3>Method 2: division (for HCF)</h3>
<div class="example">HCF of 180 and 48: 180 = 3 × 48 + 36; 48 = 1 × 36 + 12; 36 = 3 × 12 + 0. HCF = 12.</div>
<div class="formula">For two numbers: HCF × LCM = product of the two numbers. Check: 12 × 72 = 864 = 24 × 36.</div>
<h3>Word-problem formulas</h3>
<table>
<tr><th>Question type</th><th>Method</th></tr>
<tr><td>Greatest number dividing a, b, c exactly</td><td>HCF of a, b, c</td></tr>
<tr><td>Greatest number dividing a, b, c leaving remainder r</td><td>HCF of (a − r), (b − r), (c − r)</td></tr>
<tr><td>Least number divisible by a, b, c</td><td>LCM of a, b, c</td></tr>
<tr><td>Least number leaving remainder r on division by a, b, c</td><td>LCM of a, b, c, then add r</td></tr>
<tr><td>Bells ring every a and b minutes; when do they ring together?</td><td>LCM of a and b</td></tr>
<tr><td>Largest square tile for a room of length a and breadth b</td><td>Side = HCF of a and b</td></tr>
</table>
<div class="example">Greatest number dividing 25, 41 and 57 leaving remainder 1: subtract 1 → 24, 40, 56. HCF = 8.</div>
<div class="example">Least number which leaves remainder 2 when divided by 4, 6 and 8: LCM(4, 6, 8) = 24, so the answer is 24 + 2 = 26.</div>`,

    'arith-fractions': `
<h3>Basics</h3>
<ul>
<li>Proper fraction: numerator &lt; denominator (3/4). Improper: numerator ≥ denominator (7/3). Mixed: 2 1/3 = 7/3.</li>
<li>Simplify by dividing numerator and denominator by their HCF. 18/24 = 3/4.</li>
</ul>
<h3>Operations</h3>
<div class="formula">Addition: make the denominators equal (use LCM), then add the numerators.<br>Example: 2/3 + 3/4 = 8/12 + 9/12 = 17/12 = 1 5/12.</div>
<div class="formula">Multiplication: (a/b) × (c/d) = ac/bd.<br>"Of" means multiply: 3/4 of 20 = 3/4 × 20 = 15.</div>
<div class="formula">Division: multiply by the reciprocal. (a/b) ÷ (c/d) = (a/b) × (d/c).<br>Example: (2/3) ÷ (4/9) = 2/3 × 9/4 = 3/2.</div>
<h3>Comparing fractions</h3>
<div class="formula">Cross-multiply: a/b &gt; c/d if ad &gt; bc. Example: 5/7 vs 3/4 → 5 × 4 = 20 and 3 × 7 = 21. So 3/4 is bigger (3/4 = 0.75, 5/7 ≈ 0.714).</div>
<h3>Useful equivalents</h3>
<table>
<tr><th>Fraction</th><th>1/2</th><th>1/3</th><th>1/4</th><th>1/5</th><th>1/6</th><th>1/8</th></tr>
<tr><th>Decimal</th><td>0.5</td><td>0.333…</td><td>0.25</td><td>0.2</td><td>0.1666…</td><td>0.125</td></tr>
</table>
<div class="tip">Exam trick: in a long sum with fractions, first look for a common denominator or a simplification (for example 1/2 + 1/6 + 1/12 = 9/12 = 3/4). Avoid working out every step in full.</div>`,

    'arith-decimals': `
<h3>Decimal operations</h3>
<ul>
<li><strong>Addition/subtraction:</strong> align the decimal points, then calculate.</li>
<li><strong>Multiplication:</strong> multiply as whole numbers. The answer has as many decimal places as both numbers together. 0.18 × 0.8: 18 × 8 = 144 and 2 + 1 = 3 places → 0.144.</li>
<li><strong>Division:</strong> make the divisor a whole number by multiplying both numbers by 10, 100, etc.</li>
</ul>
<h3>Recurring decimals</h3>
<table>
<tr><th>Type</th><th>Formula</th><th>Example</th></tr>
<tr><td>0.(a) — one digit repeats</td><td>a / 9</td><td>0.(3) = 1/3; 0.(7) = 7/9</td></tr>
<tr><td>0.(ab) — two digits repeat</td><td>ab / 99</td><td>0.(36) = 36/99 = 4/11</td></tr>
<tr><td>0.a(b) — one digit, then b repeats</td><td>(ab − a) / 90, where ab is the two-digit number a b</td><td>0.3(6) = (36 − 3)/90 = 33/90 = 11/30</td></tr>
</table>
<div class="formula">Check: 0.1(6) = (16 − 1)/90 = 15/90 = 1/6 = 0.1666…</div>
<div class="tip">Use the formulas above to avoid long division. Always reduce the final fraction to lowest terms.</div>`,

    'arith-simplification': `
<p>Use BODMAS: <strong>B</strong>rackets, <strong>O</strong>f, <strong>D</strong>ivision, <strong>M</strong>ultiplication, <strong>A</strong>ddition, <strong>S</strong>ubtraction. Brackets are opened in this order: ( ) first, then { }, then [ ].</p>
<div class="formula">Division and multiplication have equal priority. Work from left to right: 36 ÷ 4 × 3 = 9 × 3 = 27 (not 36 ÷ 12 = 3).</div>
<div class="example">8 + 4 × 2 ÷ 4 − 1 = 8 + (8 ÷ 4) − 1 = 8 + 2 − 1 = 9.</div>
<div class="example">12 − 2 × (3 + 4) ÷ 7 = 12 − (2 × 7 ÷ 7) = 12 − 2 = 10.</div>
<div class="example">(2/3 of 12) + √64 = 8 + 8 = 16. Here "of" is done before the addition.</div>
<div class="tip">Common mistake: doing the operations strictly left to right. Always check which operators come first under BODMAS, and keep the brackets exact.</div>`,

    'arith-average': `
<div class="formula">Average = sum ÷ number of items. Sum = average × number of items.</div>
<h3>Adding or replacing an item</h3>
<ul>
<li>Average of n numbers is A. A new number x is added and the average becomes B. Then x = (n + 1) × B − n × A.</li>
<li>Average of n numbers is A. One number x is removed. New average = (n × A − x) / (n − 1).</li>
<li>Replacing one number changes the sum by (new − old), so the average changes by (new − old) / n.</li>
</ul>
<div class="example">Average of 4 numbers is 15. A fifth number is added and the average becomes 17. Fifth number = 5 × 17 − 4 × 15 = 85 − 60 = 25.</div>
<div class="example">Average of 5 numbers is 20. Remove 10. New average = (100 − 10) / 4 = 22.5.</div>
<h3>Evenly spaced numbers</h3>
<div class="formula">For consecutive numbers with equal gaps, average = (first + last) / 2. Example: 5, 7, 9, 11, 13 → average = (5 + 13)/2 = 9.</div>
<div class="formula">Average of the first n natural numbers = (n + 1)/2.</div>
<div class="tip">Weighted average: if n₁ items average A₁ and n₂ items average A₂, the combined average = (n₁A₁ + n₂A₂)/(n₁ + n₂).</div>`,

    'arith-ratio': `
<h3>Ratio</h3>
<ul>
<li>Ratio a : b compares two quantities. Simplify it like a fraction: 12 : 18 = 2 : 3.</li>
<li><strong>Sharing:</strong> to share an amount in the ratio a : b : c, find the total parts (a + b + c). One part = amount ÷ total parts.</li>
<li><strong>Compound ratio:</strong> if A : B = p : q and B : C = r : s, then A : C = pr : qs. (Make the B parts equal first.)</li>
</ul>
<div class="example">Divide ₹1,200 in the ratio 2 : 3. Parts = 5; one part = ₹240. Shares: ₹480 and ₹720.</div>
<h3>Proportion</h3>
<div class="formula">a : b = c : d means a × d = b × c (cross products are equal).</div>
<div class="formula">Direct proportion: more workers, more output. Inverse proportion: more workers, fewer days. Work problems use men × days = constant.</div>
<div class="example">12 men finish a job in 8 days. For 16 men: days = 12 × 8 / 16 = 6 days.</div>
<h3>Ages</h3>
<div class="example">Present ages are in the ratio 2 : 3. A is 10 now, so B = 15. After 5 years: A = 15, B = 20, and the new ratio is 3 : 4.</div>
<div class="tip">The ratio does not change by adding the same number to both parts. Always find the actual values first, then add the years.</div>`,

    'arith-percentage': `
<div class="formula">p% of N = p × N / 100. A is what percent of B = A / B × 100.</div>
<div class="formula">Percentage change = (change / original) × 100.</div>
<h3>Successive changes</h3>
<div class="formula">Increase by x%, then decrease by y%: net change = x − y − (x × y)/100 (in %).<br>Example: +20% then −20% gives 20 − 20 − 4 = −4% (1.2 × 0.8 = 0.96).</div>
<h3>Growth</h3>
<div class="formula">Value after n years at r% per year = P × (1 + r/100)ⁿ.<br>Example: 1,000 growing by 10% a year for 2 years = 1,000 × 1.1 × 1.1 = 1,210.</div>
<table>
<tr><th>Fraction</th><th>1/2</th><th>1/4</th><th>1/5</th><th>1/8</th><th>1/3</th></tr>
<tr><th>Percent</th><td>50%</td><td>25%</td><td>20%</td><td>12.5%</td><td>33⅓%</td></tr>
</table>
<div class="tip">Percentage of a percentage: 20% of 30% = 6%, not 50%. Use multiplication for "of".</div>`,

    'arith-profit-loss': `
<div class="formula">Profit = SP − CP. Loss = CP − SP. Profit % = profit / CP × 100. Loss % = loss / CP × 100.</div>
<div class="formula">SP = CP × (100 + profit%) / 100. CP = SP × 100 / (100 + profit%).<br>SP = CP × (100 − loss%) / 100. CP = SP × 100 / (100 − loss%).</div>
<div class="example">CP = ₹400, SP = ₹460. Profit = ₹60. Profit % = 60/400 × 100 = 15%.</div>
<div class="example">SP = ₹800 at a 20% loss: CP = 800 × 100 / 80 = ₹1,000.</div>
<h3>Marked price and discount</h3>
<div class="formula">SP = marked price × (100 − discount%) / 100.</div>
<div class="example">Marked price ₹1,000, discount 10%: SP = ₹900. If CP is ₹750, profit % = (900 − 750)/750 × 100 = 20%.</div>
<div class="tip">Read carefully: profit % is on CP unless the question says otherwise.</div>`,

    'arith-simple-interest': `
<div class="formula">SI = P × R × T / 100. Amount A = P + SI.</div>
<div class="formula">R = SI × 100 / (P × T). T = SI × 100 / (P × R). P = SI × 100 / (R × T).</div>
<div class="example">₹5,000 at 8% per annum for 3 years: SI = 5000 × 8 × 3 / 100 = ₹1,200. Amount = ₹6,200.</div>
<div class="example">₹2,000 earns ₹300 in 3 years. Rate = 300 × 100 / (2000 × 3) = 5% per annum.</div>
<div class="tip">If the time is in months, divide by 12 to get years (for example, 6 months = 0.5 years). Use the convention given in the question for days.</div>`,

    'arith-partnership': `
<div class="formula">Profit is shared in the ratio of (capital × time). If everyone invests for the same time, the ratio is just the ratio of capital.</div>
<div class="example">A invests ₹2,000 for 6 months and B invests ₹3,000 for 4 months. Ratio = 2000 × 6 : 3000 × 4 = 12,000 : 12,000 = 1 : 1. If the total profit is ₹5,000, each gets ₹2,500.</div>
<div class="example">A, B and C invest ₹1,000, ₹2,000 and ₹3,000 for the same time. Ratio = 1 : 2 : 3. If the total profit is ₹6,000, C gets 3 parts = ₹3,000.</div>
<div class="tip">If a partner is paid a salary or commission, first deduct it from the profit and then share the rest.</div>`,

    'arith-time-distance': `
<div class="formula">Distance = speed × time. Speed = distance / time. Time = distance / speed.</div>
<div class="formula">km/h to m/s: multiply by 5/18. m/s to km/h: multiply by 18/5.<br>Example: 54 km/h = 54 × 5/18 = 15 m/s.</div>
<h3>Trains</h3>
<table>
<tr><th>Situation</th><th>Distance to cover</th><th>Speed to use</th></tr>
<tr><td>Crossing a pole or a person</td><td>Train length L</td><td>Train speed</td></tr>
<tr><td>Crossing a platform of length P</td><td>L + P</td><td>Train speed</td></tr>
<tr><td>Two trains in opposite directions</td><td>L₁ + L₂</td><td>v₁ + v₂</td></tr>
<tr><td>Two trains in the same direction</td><td>L₁ + L₂</td><td>v₁ − v₂ (faster minus slower)</td></tr>
</table>
<div class="example">A 150 m train at 54 km/h crosses a pole in 150 / 15 = 10 seconds.</div>
<div class="example">Two trains (100 m and 200 m) run in the same direction at 60 and 40 km/h. Relative speed = 20 km/h = 50/9 m/s. Time = 300 × 9 / 50 = 54 seconds.</div>
<h3>Average speed</h3>
<div class="formula">Same distance covered at speeds a and b: average speed = 2ab / (a + b). Do not simply average a and b.<br>Example: 30 km/h going and 60 km/h returning: 2 × 30 × 60 / 90 = 40 km/h.</div>`,

    'arith-area': `
<table>
<tr><th>Shape</th><th>Area</th><th>Perimeter</th><th>Diagonal</th></tr>
<tr><td>Rectangle (l × b)</td><td>l × b</td><td>2(l + b)</td><td>√(l² + b²)</td></tr>
<tr><td>Square (side a)</td><td>a²</td><td>4a</td><td>a√2</td></tr>
</table>
<div class="formula">Pythagorean triples to remember: (3, 4, 5), (5, 12, 13), (8, 15, 17), (7, 24, 25), (20, 21, 29). Multiply all three numbers by the same k for a bigger case.</div>
<div class="example">Room 8 m × 6 m, carpet at ₹50 per m²: area = 48 m², cost = 48 × 50 = ₹2,400.</div>
<div class="example">Square of area 144 cm²: side = 12 cm, perimeter = 48 cm.</div>
<div class="example">Path of width 2 m around a 20 m × 10 m field: outer size 24 m × 14 m. Path area = 24 × 14 − 20 × 10 = 336 − 200 = 136 m².</div>
<div class="tip">Unit check: 1 m² = 10,000 cm². Keep the same unit throughout before you divide or multiply.</div>`
  });
})(typeof window !== 'undefined' ? window : globalThis);
