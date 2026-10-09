/* English chapter notes (Part-I, English, 30 questions). Plain HTML, no external resources. */
(function (root) {
  'use strict';
  var NS = (root.WBPSC = root.WBPSC || {});
  NS.notes = NS.notes || {};
  Object.assign(NS.notes, {

    'eng-parts-of-speech': `
<p>There are eight parts of speech. Identify a word by its <strong>job in the sentence</strong>, not by its spelling.</p>
<table>
<tr><th>Part</th><th>Job</th><th>Example</th></tr>
<tr><td>Noun</td><td>Names a person, place, thing or idea</td><td>Kolkata, honesty, book</td></tr>
<tr><td>Pronoun</td><td>Replaces a noun</td><td>he, they, which, myself</td></tr>
<tr><td>Verb</td><td>Shows action or state</td><td>run, is, become</td></tr>
<tr><td>Adjective</td><td>Describes a noun or pronoun</td><td>tall, honest, three</td></tr>
<tr><td>Adverb</td><td>Describes a verb, adjective or another adverb (how, when, where, how often)</td><td>quickly, very, yesterday</td></tr>
<tr><td>Preposition</td><td>Shows the relation of a noun to another word</td><td>in, on, under, at</td></tr>
<tr><td>Conjunction</td><td>Joins words, phrases or clauses</td><td>and, but, because</td></tr>
<tr><td>Interjection</td><td>Shows strong emotion, sits outside grammar</td><td>alas, wow, oh</td></tr>
</table>
<div class="example">"She sings beautifully." — "beautifully" describes how she sings (the verb), so it is an <em>adverb</em>.<br>"She is a beautiful singer." — "beautiful" describes the noun "singer", so it is an <em>adjective</em>.</div>
<div class="example">"He is a fast runner" (adjective, describes runner). "He runs fast" (adverb, describes runs). Same word, different job.</div>
<div class="tip">Ask: which word does this one describe or replace? That usually settles the part of speech.</div>`,

    'eng-tenses': `
<table>
<tr><th></th><th>Present</th><th>Past</th><th>Future</th></tr>
<tr><th>Simple</th><td>I write</td><td>I wrote</td><td>I will write</td></tr>
<tr><th>Continuous</th><td>I am writing</td><td>I was writing</td><td>I will be writing</td></tr>
<tr><th>Perfect</th><td>I have written</td><td>I had written</td><td>I will have written</td></tr>
<tr><th>Perfect continuous</th><td>I have been writing</td><td>I had been writing</td><td>I will have been writing</td></tr>
</table>
<h3>Signal words</h3>
<ul>
<li><strong>Simple present:</strong> always, usually, every day, never (habits and facts).</li>
<li><strong>Present continuous:</strong> now, at present, look!, listen! (happening now, or a fixed plan for the near future: "We are going to Darjeeling next week").</li>
<li><strong>Present perfect:</strong> already, yet, just, ever, never, since, for (action connected to now).</li>
<li><strong>Past simple:</strong> yesterday, ago, last year, in 2010 (finished time). Do not use present perfect with these.</li>
<li><strong>Past perfect:</strong> before, after, by the time, when (for the earlier of two past actions).</li>
</ul>
<div class="example">"By the time we reached the station, the train had left." (The leaving came first, so past perfect.)</div>
<div class="example">"I have lived here since 2010." (Since + point in time with present perfect.) "I have lived here for ten years." (For + period.)</div>
<div class="tip">Exam trap: "I am living here since 2010" is wrong. Use "I have been living here since 2010."</div>`,

    'eng-articles': `
<h3>a / an</h3>
<ul>
<li>Use <strong>a</strong> before a consonant <em>sound</em>: a university (yoo), a European, a one-way ticket.</li>
<li>Use <strong>an</strong> before a vowel <em>sound</em>: an hour (silent h), an honest man, an MBA (em-bee-ay), an umbrella.</li>
</ul>
<h3>the</h3>
<ul>
<li>Something unique or known: the sun, the Ganges, the Himalayas, the Pacific.</li>
<li>Superlatives and ordinals: the best, the first, the tallest.</li>
<li>Something already mentioned: "A boy came. The boy was tall."</li>
</ul>
<h3>No article (zero article)</h3>
<ul>
<li>Plural or uncountable nouns used in general: Milk is healthy. Dogs are loyal.</li>
<li>Names of most countries, cities and people: India, Kolkata, Rahul. (Exceptions: the UK, the USA.)</li>
<li>Meals and games: have breakfast, play cricket. (But: a good breakfast.)</li>
</ul>
<div class="example">"He is an honest man." "She is a university student." "It takes an hour." "He is a one-eyed man."</div>
<div class="tip">The article depends on the sound of the next word, not its spelling. Ask: does it start with a vowel sound?</div>`,

    'eng-sva': `
<ul>
<li>Singular subject → singular verb. Plural subject → plural verb.</li>
<li>Two subjects joined by <em>and</em> take a plural verb. Exception: when they mean one thing ("Bread and butter is my breakfast").</li>
<li><em>Either…or</em> and <em>neither…nor</em>: the verb agrees with the nearer subject. "Neither the teacher nor the students <strong>were</strong> present."</li>
<li><em>Each, every, everyone, everybody, anyone, nobody, somebody</em> → singular: "Everyone in the hall <strong>is</strong> asked to stand."</li>
<li><em>The number of</em> → singular. <em>A number of</em> → plural. "The number of students is 40." "A number of students are absent."</li>
<li><em>One of the + plural noun</em> → singular verb: "One of the boys <strong>is</strong> absent."</li>
<li><em>Along with, as well as, together with</em>: the verb agrees with the first subject.</li>
<li>Subjects like <em>news, mathematics, politics, physics</em> take a singular verb.</li>
<li>Collective nouns (committee, team, government) usually take a singular verb.</li>
</ul>
<div class="tip">Find the true subject first. Words placed between the subject and verb ("The bag of apples…") do not change the agreement.</div>`,

    'eng-prepositions': `
<table>
<tr><th>Use</th><th>At</th><th>On</th><th>In</th></tr>
<tr><td>Time</td><td>clock times, at night, at noon</td><td>days and dates: on Monday, on 12 March</td><td>months, years, seasons, parts of day: in July, in 2010, in the morning</td></tr>
<tr><td>Place</td><td>a point: at the station</td><td>a surface: on the table</td><td>an enclosed space or city: in the room, in Kolkata</td></tr>
</table>
<h3>Common verb and adjective + preposition</h3>
<ul>
<li>good at, bad at, skilled at: "She is good at mathematics."</li>
<li>interested in, fond of, afraid of, capable of, responsible for</li>
<li>depend on, rely on, wait for, listen to, apologise for, protect from, prevent from</li>
<li>consist of, different from (or to), married to, congratulate on</li>
<li><strong>Discuss</strong> takes no preposition: "We discussed the matter" (not "discussed about").</li>
</ul>
<div class="tip">When a question offers "in / on / at", check the rule for time and place first. For verb + preposition questions, memorise the common pairs above.</div>`,

    'eng-conj-modals': `
<h3>Conjunctions</h3>
<ul>
<li><strong>Coordinating</strong> (joins equal parts): and, but, or, nor, for, yet, so.</li>
<li><strong>Subordinating</strong> (joins main and dependent clause): although / though (contrast), because / since (reason), if / unless (condition), so that (purpose), while (contrast or time).</li>
<li><strong>Correlative pairs:</strong> either…or, neither…nor, both…and, not only…but also, whether…or, no sooner…than, hardly…when.</li>
</ul>
<div class="example">"She is poor, but she is honest." "Both Rita and Mina are good singers." "Neither Ravi nor Sohan came."</div>
<h3>Modal verbs</h3>
<table>
<tr><th>Modal</th><th>Main uses</th><th>Example</th></tr>
<tr><td>can / could</td><td>ability, permission (could = past ability)</td><td>I could swim at five.</td></tr>
<tr><td>may / might</td><td>possibility, polite permission</td><td>It may rain today.</td></tr>
<tr><td>must</td><td>obligation or strong necessity</td><td>Students must bring the admit card.</td></tr>
<tr><td>should / ought to</td><td>advice, duty</td><td>You should rest.</td></tr>
<tr><td>will / would</td><td>future, polite request, habit in the past</td><td>Would you help me?</td></tr>
<tr><td>used to</td><td>past habit no longer true</td><td>I used to walk to school.</td></tr>
</table>
<div class="tip">After a modal, always use the base verb: "She can <em>swim</em>" (not "swims" or "to swim").</div>`,

    'eng-voice': `
<table>
<tr><th>Tense</th><th>Active</th><th>Passive</th></tr>
<tr><td>Simple present</td><td>They write letters.</td><td>Letters are written by them.</td></tr>
<tr><td>Present continuous</td><td>She is writing a letter.</td><td>A letter is being written by her.</td></tr>
<tr><td>Present perfect</td><td>They have completed the project.</td><td>The project has been completed by them.</td></tr>
<tr><td>Simple past</td><td>Someone broke the window.</td><td>The window was broken by someone.</td></tr>
<tr><td>Simple future</td><td>He will finish the work.</td><td>The work will be finished by him.</td></tr>
<tr><td>Modal</td><td>You can solve it.</td><td>It can be solved by you.</td></tr>
</table>
<h3>Special cases</h3>
<ul>
<li><strong>Let:</strong> "Let him finish the work" → "Let the work be finished by him."</li>
<li><strong>Questions:</strong> "Do you know him?" → "Is he known to you?" "Who broke the glass?" → "By whom was the glass broken?"</li>
<li><strong>Intransitive verbs</strong> (no object: go, come, sleep, die, arrive, happen) cannot be made passive.</li>
<li>Change the pronouns: I → me, we → us, he → him, she → her, they → them.</li>
</ul>
<div class="tip">Passive = be + past participle (V3). Find the tense in the active sentence, then keep the same tense with "be".</div>`,

    'eng-narration': `
<h3>Tense change (back-shift)</h3>
<table>
<tr><th>Direct</th><th>Indirect</th></tr>
<tr><td>Simple present → simple past</td><td>"I am happy" → was happy</td></tr>
<tr><td>Present continuous → past continuous</td><td>"I am reading" → was reading</td></tr>
<tr><td>Simple past / present perfect → past perfect</td><td>"I wrote" / "I have written" → had written</td></tr>
<tr><td>will → would, can → could, may → might, shall → should, must → had to</td><td>"I will go" → would go</td></tr>
<tr><td>Universal truths stay in the present</td><td>"The earth moves round the sun" → moves round the sun</td></tr>
</table>
<h3>Other changes</h3>
<ul>
<li>today → that day; tomorrow → the next day; yesterday → the day before; now → then; here → there; this → that; ago → before; last night → the previous night.</li>
<li><strong>Statements:</strong> said / says → said that, or told me that.</li>
<li><strong>Questions (yes/no):</strong> "Do you know him?" → He asked me if I knew him.</li>
<li><strong>Questions (wh-):</strong> "Where do you live?" → He asked me where I lived. (Statement word order, no question mark.)</li>
<li><strong>Commands:</strong> "Close the door" → He told me to close the door. "Don't be late" → He told me not to be late.</li>
<li><strong>Suggestions:</strong> "Let us go out" → He suggested that we should go out.</li>
<li><strong>Exclamations:</strong> "Alas! I have lost my pen" → He exclaimed with sorrow that he had lost his pen.</li>
</ul>
<div class="example">"He said to me, 'I will help you tomorrow.'" → "He told me that he would help me the next day."</div>`,

    'eng-transformation': `
<h3>Common equivalent structures</h3>
<table>
<tr><th>Given</th><th>Equivalent</th></tr>
<tr><td>He is too weak to walk.</td><td>He is so weak that he cannot walk.</td></tr>
<tr><td>He is not rich enough to buy a car.</td><td>He is too poor to buy a car.</td></tr>
<tr><td>Although he was ill, he went to school.</td><td>In spite of being ill, he went to school. (Despite being ill…)</td></tr>
<tr><td>Unless you work hard, you will not pass.</td><td>If you do not work hard, you will not pass.</td></tr>
<tr><td>No other mountain is as high as Everest.</td><td>Everest is higher than any other mountain.</td></tr>
<tr><td>No sooner had I reached the station than the train left.</td><td>Hardly had I reached the station when the train left.</td></tr>
<tr><td>He was tired but he went on.</td><td>Tired as he was, he went on.</td></tr>
</table>
<div class="tip">Keep the same meaning. Watch for "no sooner… than" (not "when") and for "hardly/scarcely… when" (not "than"). Also watch for "in spite of" + noun or -ing, never "in spite of" + a full clause.</div>`,

    'eng-syn-ant': `
<h3>Synonyms (same meaning)</h3>
<table>
<tr><th>Word</th><th>Synonym</th><th>Word</th><th>Synonym</th></tr>
<tr><td>Abundant</td><td>plentiful</td><td>Obstinate</td><td>stubborn</td></tr>
<tr><td>Brave</td><td>fearless</td><td>Ancient</td><td>old</td></tr>
<tr><td>Begin</td><td>start</td><td>Benevolent</td><td>kind</td></tr>
<tr><td>Enormous</td><td>huge</td><td>Lucid</td><td>clear</td></tr>
<tr><td>Eager</td><td>keen</td><td>Modest</td><td>humble</td></tr>
<tr><td>Fragile</td><td>delicate</td><td>Precise</td><td>exact</td></tr>
</table>
<h3>Antonyms (opposite meaning)</h3>
<table>
<tr><th>Word</th><th>Antonym</th><th>Word</th><th>Antonym</th></tr>
<tr><td>Ancient</td><td>modern</td><td>Expand</td><td>contract</td></tr>
<tr><td>Generous</td><td>miserly</td><td>Victory</td><td>defeat</td></tr>
<tr><td>Optimist</td><td>pessimist</td><td>Permanent</td><td>temporary</td></tr>
<tr><td>Bold</td><td>timid</td><td>Harsh</td><td>gentle</td></tr>
<tr><td>Increase</td><td>decrease</td><td>Guilty</td><td>innocent</td></tr>
</table>
<div class="tip">Check the word's meaning in the sentence, not just its common meaning. Negative prefixes help too: un-, dis-, in-/im-/il-/ir-, mis-, non- often make antonyms (honest → dishonest).</div>`,

    'eng-one-word': `
<table>
<tr><th>Phrase</th><th>One word</th></tr>
<tr><td>One who knows everything</td><td>Omniscient</td></tr>
<tr><td>One who does not believe in God</td><td>Atheist</td></tr>
<tr><td>One who speaks many languages</td><td>Polyglot</td></tr>
<tr><td>Study of birds</td><td>Ornithology</td></tr>
<tr><td>Study of insects</td><td>Entomology</td></tr>
<tr><td>Study of stars and planets</td><td>Astronomy</td></tr>
<tr><td>Speech made without preparation</td><td>Impromptu (or extempore)</td></tr>
<tr><td>One who eats too much</td><td>Glutton</td></tr>
<tr><td>One who loves books</td><td>Bibliophile</td></tr>
<tr><td>A place where birds are kept</td><td>Aviary</td></tr>
<tr><td>Killing of a human being</td><td>Homicide</td></tr>
<tr><td>Government by the people</td><td>Democracy</td></tr>
<tr><td>Rule by one person with absolute power</td><td>Autocracy</td></tr>
<tr><td>Fear of heights</td><td>Acrophobia</td></tr>
<tr><td>One who writes the life story of another person</td><td>Biographer</td></tr>
<tr><td>One who draws maps</td><td>Cartographer</td></tr>
<tr><td>One who studies rocks and the earth</td><td>Geologist</td></tr>
<tr><td>One who saves money to an excessive degree</td><td>Miser</td></tr>
<tr><td>One who lives alone away from society</td><td>Recluse (or hermit)</td></tr>
<tr><td>Unable to read or write</td><td>Illiterate</td></tr>
<tr><td>Cannot be defeated</td><td>Invincible</td></tr>
</table>
<div class="tip">Learn the "study of" words (-ology) and the "fear of" words (-phobia). They repeat often in exams.</div>`,

    'eng-idioms': `
<table>
<tr><th>Idiom / phrase</th><th>Meaning</th></tr>
<tr><td>Break the ice</td><td>start a conversation; ease tension</td></tr>
<tr><td>Once in a blue moon</td><td>very rarely</td></tr>
<tr><td>Bite the bullet</td><td>face a painful situation bravely</td></tr>
<tr><td>Hit the nail on the head</td><td>say or do exactly the right thing</td></tr>
<tr><td>A piece of cake</td><td>very easy</td></tr>
<tr><td>Beat about the bush</td><td>avoid the main point</td></tr>
<tr><td>Under the weather</td><td>slightly ill</td></tr>
<tr><td>Spill the beans</td><td>reveal a secret</td></tr>
<tr><td>Call it a day</td><td>stop working on something</td></tr>
<tr><td>Cut corners</td><td>do something badly to save time or money</td></tr>
<tr><td>Let the cat out of the bag</td><td>reveal a secret by mistake</td></tr>
<tr><td>Burn the midnight oil</td><td>work or study late into the night</td></tr>
<tr><td>Once and for all</td><td>finally, for the last time</td></tr>
<tr><td>A blessing in disguise</td><td>something bad that turns out to be good</td></tr>
<tr><td>To kill two birds with one stone</td><td>solve two problems with one action</td></tr>
<tr><td>Get cold feet</td><td>become too nervous to do something</td></tr>
<tr><td>Speak of the devil</td><td>the person we were just talking about appears</td></tr>
<tr><td>Caught between two stools</td><td>unable to choose between two options</td></tr>
<tr><td>In the same boat</td><td>in the same difficult situation as others</td></tr>
<tr><td>To pull someone’s leg</td><td>tease someone, joke with them</td></tr>
</table>
<div class="tip">Learn idioms with a short example sentence. Many exam questions ask for the meaning only.</div>`,

    'eng-spelling-usage': `
<h3>Frequently misspelt words</h3>
<p>accommodation · necessary · separate · definitely · occurrence · embarrass · government · receive · believe · achieve · library · February · business · parallel · harass · privilege · rhythm · separate</p>
<h3>Words often confused</h3>
<table>
<tr><th>Word</th><th>Meaning / use</th></tr>
<tr><td>affect (verb) / effect (noun)</td><td>The rain will affect the match. The effect was great.</td></tr>
<tr><td>accept (receive) / except (excluding)</td><td>Please accept my thanks. All except Ram came.</td></tr>
<tr><td>advice (noun) / advise (verb)</td><td>Take my advice. I advise you to rest.</td></tr>
<tr><td>its (possessive) / it’s (it is)</td><td>The dog wagged its tail. It’s late.</td></tr>
<tr><td>principal (head, main) / principle (rule)</td><td>The principal spoke. A principle of honesty.</td></tr>
<tr><td>complement (complete) / compliment (praise)</td><td>The shirt complements the tie. She gave me a compliment.</td></tr>
<tr><td>stationary (not moving) / stationery (paper, pens)</td><td>The car is stationary. Buy stationery.</td></tr>
<tr><td>lose (verb) / loose (not tight)</td><td>Do not lose your ticket. The screw is loose.</td></tr>
<tr><td>desert (dry land) / dessert (sweet)</td><td>The Thar desert. Ice cream is a dessert.</td></tr>
<tr><td>quiet (silent) / quite (very, fairly)</td><td>Please be quiet. It is quite cold.</td></tr>
<tr><td>than (comparison) / then (time)</td><td>Taller than me. First this, then that.</td></tr>
<tr><td>practice (noun) / practise (verb)</td><td>Daily practice. Practise every day.</td></tr>
<tr><td>fewer (countable) / less (uncountable)</td><td>Fewer students. Less water.</td></tr>
</table>
<h3>Correct usage</h3>
<ul>
<li>between you and me (object of the preposition, not "I").</li>
<li>different from (preferred), compare with (detailed comparison), compare to (show similarity).</li>
<li>married to, good at, interested in.</li>
</ul>
<div class="tip">Say the word in a sentence aloud. If the sentence sounds wrong, try the other word in the pair.</div>`,

    'eng-error-correction': `
<p>In error-spotting questions, read each part separately. The most common error types are:</p>
<table>
<tr><th>Error type</th><th>Wrong</th><th>Correct</th></tr>
<tr><td>Subject–verb agreement</td><td>The boys is playing.</td><td>The boys are playing.</td></tr>
<tr><td>Tense</td><td>I am living here since 2010.</td><td>I have been living here since 2010.</td></tr>
<tr><td>Article</td><td>He is honest man.</td><td>He is an honest man.</td></tr>
<tr><td>Preposition</td><td>She is good in English.</td><td>She is good at English.</td></tr>
<tr><td>Pronoun case</td><td>Between you and I, the plan is good.</td><td>Between you and me, the plan is good.</td></tr>
<tr><td>Degree</td><td>She is more taller than her sister.</td><td>She is taller than her sister.</td></tr>
<tr><td>Parallel structure</td><td>She likes swimming and to read.</td><td>She likes swimming and reading.</td></tr>
<tr><td>Comparison wording</td><td>I prefer tea than coffee.</td><td>I prefer tea to coffee.</td></tr>
<tr><td>Spelling / word choice</td><td>The effect of the rain was clear. (affect vs effect)</td><td>Check which word fits</td></tr>
</table>
<div class="tip">Strategy: read the whole sentence once, then check the subject–verb, tense, article and preposition in that order. If no part is wrong, the answer is "No error" (if that option is given).</div>`
  });
})(typeof window !== 'undefined' ? window : globalThis);
