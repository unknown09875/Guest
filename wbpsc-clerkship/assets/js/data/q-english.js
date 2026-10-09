/* English practice questions (Part-I, English). Original items, each with an explanation.
 * Written with the correct answer first (c); bank-util.js shuffles the options. */
(function (root) {
  'use strict';
  var NS = (root.WBPSC = root.WBPSC || {});
  var R = [];
  function Q(topic, q, c, w1, w2, w3, exp) { R.push({ topic: topic, q: q, c: c, w: [w1, w2, w3], exp: exp }); }

  // ---- Parts of speech ----
  Q('eng-parts-of-speech', 'In the sentence “She sings beautifully at the concert”, the word “beautifully” is a(n):',
    'adverb', 'adjective', 'noun', 'pronoun',
    '“Beautifully” tells how she sings, so it modifies the verb “sings”. Words that modify verbs are adverbs.');
  Q('eng-parts-of-speech', 'Which word is a pronoun?',
    'they', 'quickly', 'happy', 'under',
    '“They” replaces a noun (for example, “the students”). “Quickly” is an adverb, “happy” an adjective and “under” a preposition.');
  Q('eng-parts-of-speech', 'Which of these is an interjection?',
    'Alas!', 'beautiful', 'quickly', 'under',
    'Interjections express sudden emotion and sit outside the grammar of the sentence. “Alas!” expresses sorrow.');
  Q('eng-parts-of-speech', 'In “He is a fast runner”, the word “fast” is a(n):',
    'adjective', 'adverb', 'verb', 'noun',
    '“Fast” describes the noun “runner”, so it is an adjective. In “He runs fast”, it would be an adverb.');
  Q('eng-parts-of-speech', 'Choose the conjunction in: “I wanted to go out, but it was raining.”',
    'but', 'wanted', 'out', 'to',
    '“But” joins two clauses. “Wanted” is a verb, “out” an adverb and “to” part of an infinitive.');
  Q('eng-parts-of-speech', 'Which of these is a proper noun?',
    'Kolkata', 'river', 'city', 'beauty',
    'Proper nouns name a particular person, place or thing and begin with a capital letter.');

  // ---- Tenses ----
  Q('eng-tenses', 'By the time we reached the station, the train ______.',
    'had left', 'left', 'has left', 'is leaving',
    'The leaving happened before the reaching, so the earlier past action takes the past perfect: “had left”.');
  Q('eng-tenses', 'She ______ English for five years, and she still studies it.',
    'has been learning', 'learned', 'learns', 'will learn',
    'An action that started in the past and continues now, with “for five years”, takes the present perfect continuous: “has been learning”.');
  Q('eng-tenses', 'Look! The children ______ in the garden.',
    'are playing', 'play', 'have played', 'played',
    '“Look!” signals an action happening now, so the present continuous is used.');
  Q('eng-tenses', 'I ______ my homework yet.',
    'haven’t finished', 'didn’t finish', 'don’t finish', 'wasn’t finishing',
    '“Yet” is used with the present perfect in negatives: “haven’t finished”.');
  Q('eng-tenses', 'They ______ to Darjeeling next week.',
    'are going', 'go', 'will going', 'went',
    'A fixed arrangement in the near future uses the present continuous: “are going”. “Will going” is never correct.');
  Q('eng-tenses', 'He ______ TV when the power went off.',
    'was watching', 'watched', 'has watched', 'watches',
    'A longer past action (watching) interrupted by a shorter past action (went off) uses the past continuous: “was watching”.');

  // ---- Articles ----
  Q('eng-articles', 'She is ______ honest girl.',
    'an', 'a', 'the', 'no article',
    '“Honest” starts with a silent h, so the next word begins with a vowel sound: “an honest girl”.');
  Q('eng-articles', 'He is ______ University student.',
    'a', 'an', 'the', 'no article',
    '“University” begins with a “y” consonant sound (“yoo-”), so “a” is correct.');
  Q('eng-articles', '______ sun rises in the east.',
    'The', 'A', 'An', 'No article',
    'The sun is unique, so the definite article “the” is used.');
  Q('eng-articles', 'It takes ______ hour to reach the town by bus.',
    'an', 'a', 'the', 'no article',
    '“Hour” begins with a silent h, so the sound is a vowel: “an hour”.');
  Q('eng-articles', 'He is ______ one-eyed man.',
    'a', 'an', 'the', 'no article',
    '“One” begins with a “w” consonant sound, so “a” is correct.');
  Q('eng-articles', 'I like ______ tea very much.',
    'no article', 'the', 'a', 'an',
    'Tea used in a general sense (an uncountable noun) takes no article.');

  // ---- Subject–verb agreement ----
  Q('eng-sva', 'Neither the teacher nor the students ______ present.',
    'were', 'was', 'is', 'has been',
    'With “neither … nor”, the verb agrees with the nearer subject, “the students” (plural): “were”.');
  Q('eng-sva', 'The number of students in the class ______ 40.',
    'is', 'are', 'were', 'have been',
    '“The number of” + noun takes a singular verb: “The number of students is 40.”');
  Q('eng-sva', 'A number of students ______ absent today.',
    'are', 'is', 'was', 'has',
    '“A number of” means “several”, so the verb is plural: “are absent”.');
  Q('eng-sva', 'Each of the boys ______ a book.',
    'has', 'have', 'are', 'were',
    '“Each” is singular, so “each of the boys” takes the singular verb “has”.');
  Q('eng-sva', 'Everyone in the hall ______ asked to stand up.',
    'is', 'are', 'were', 'have',
    '“Everyone” is singular, so the verb is “is”.');
  Q('eng-sva', 'One of the boys ______ absent.',
    'is', 'are', 'were', 'have been',
    '“One of the + plural noun” takes a singular verb: “One of the boys is absent.”');

  // ---- Prepositions ----
  Q('eng-prepositions', 'She was born ______ 12 March 1995.',
    'on', 'in', 'at', 'to',
    'Use “on” with a specific date: “on 12 March 1995”.');
  Q('eng-prepositions', 'The meeting will be held ______ 10 a.m.',
    'at', 'on', 'in', 'by',
    'Use “at” with clock times: “at 10 a.m.”.');
  Q('eng-prepositions', 'I am interested ______ music.',
    'in', 'on', 'at', 'for',
    '“Interested in” is the fixed combination.');
  Q('eng-prepositions', 'She is good ______ mathematics.',
    'at', 'in', 'on', 'with',
    '“Good at” is the fixed combination.');
  Q('eng-prepositions', 'He lives ______ Kolkata.',
    'in', 'at', 'on', 'to',
    'Use “in” for cities and other enclosed places.');
  Q('eng-prepositions', 'Success depends ______ hard work.',
    'on', 'of', 'to', 'with',
    '“Depend on” is the fixed combination.');

  // ---- Conjunctions and modal verbs ----
  Q('eng-conj-modals', '______ he is rich, he is not happy.',
    'Although', 'Because', 'So', 'And',
    'The idea is contrast, so “although” is needed. “Because” gives a reason and “so” gives a result.');
  Q('eng-conj-modals', 'Neither Ravi ______ Sohan came to the party.',
    'nor', 'or', 'and', 'but',
    '“Neither” is always followed by “nor”.');
  Q('eng-conj-modals', 'Students ______ bring their admit card to the exam hall.',
    'must', 'may', 'might', 'could',
    'It is a compulsory requirement, so “must” (obligation) is the right modal.');
  Q('eng-conj-modals', 'I ______ swim when I was five.',
    'could', 'can', 'may', 'must',
    'Past ability is expressed with “could”.');
  Q('eng-conj-modals', 'Both Rita ______ Mina are good singers.',
    'and', 'or', 'nor', 'but',
    '“Both” is always followed by “and”.');
  Q('eng-conj-modals', 'She is poor, ______ she is honest.',
    'but', 'and', 'so', 'or',
    'The second clause contrasts with the first, so “but” is needed.');

  // ---- Active and passive voice ----
  Q('eng-voice', 'Change to passive: “The teacher teaches the lesson.”',
    'The lesson is taught by the teacher.', 'The lesson was taught by the teacher.', 'The lesson is being taught by the teacher.', 'The lesson has been taught by the teacher.',
    'Simple present active becomes passive with “is/are + V3”: “The lesson is taught by the teacher.”');
  Q('eng-voice', 'Change to passive: “They have completed the project.”',
    'The project has been completed by them.', 'The project have been completed by them.', 'The project was completed by them.', 'The project is completed by them.',
    'Present perfect passive is “has/have been + V3”. The subject “project” is singular, so “has been” is used.');
  Q('eng-voice', 'Change to passive: “Someone broke the window.”',
    'The window was broken by someone.', 'The window was broke by someone.', 'The window is broken by someone.', 'The window has broken by someone.',
    'Simple past passive is “was/were + V3”. The V3 of “break” is “broken”.');
  Q('eng-voice', 'Change to passive: “Let him finish the work.”',
    'Let the work be finished by him.', 'The work should be finished by him.', 'Let him be finished the work.', 'The work is let finished by him.',
    'The structure for “let” is: Let + object + be + V3 + by + subject.');
  Q('eng-voice', 'Change to passive: “She is writing a letter.”',
    'A letter is being written by her.', 'A letter is written by her.', 'A letter was being written by her.', 'A letter has been written by her.',
    'Present continuous passive is “is/are being + V3”.');
  Q('eng-voice', 'Change to passive: “The farmer grows rice.”',
    'Rice is grown by the farmer.', 'Rice is grown by farmer.', 'Rice are grown by the farmer.', 'Rice was grows by the farmer.',
    'Simple present passive is “is/are + V3”. “Rice” is uncountable and takes “is”, and the article “the” is kept.');

  // ---- Direct and indirect speech ----
  Q('eng-narration', 'Change to indirect speech: He said, “I am happy.”',
    'He said that he was happy.', 'He said that he is happy.', 'He said he were happy.', 'He told that he was happy.',
    'The present tense “am” changes to the past “was”. “Told” needs an object (told me), so “said” is correct here.');
  Q('eng-narration', 'Change to indirect speech: She said to me, “Where do you live?”',
    'She asked me where I lived.', 'She asked me where do I live.', 'She asked me where I live.', 'She told me where I lived.',
    'A wh-question becomes a statement after “asked”, with the tense moved back and the pronoun changed: “where I lived”.');
  Q('eng-narration', 'Change to indirect speech: He said, “Let us go out.”',
    'He suggested that we should go out.', 'He said that let us go out.', 'He said us to go out.', 'He told that we go out.',
    'A “Let us …” suggestion is reported with “suggested that … should”.');
  Q('eng-narration', 'Change to indirect speech: The teacher said, “The earth moves round the sun.”',
    'The teacher said that the earth moves round the sun.', 'The teacher said that the earth moved round the sun.', 'The teacher said that the earth is moving round the sun.', 'The teacher said that the earth has moved round the sun.',
    'A universal truth keeps its present tense in reported speech.');
  Q('eng-narration', 'Change to indirect speech: “Close the door,” he said to me.',
    'He ordered me to close the door.', 'He told me close the door.', 'He said me to close the door.', 'He requested me close the door.',
    'Commands use “ordered/told + object + to + base verb”: “ordered me to close”.');
  Q('eng-narration', 'Change to indirect speech: He said to me, “I will help you tomorrow.”',
    'He told me that he would help me the next day.', 'He told me that he will help me the next day.', 'He told me that he would help you the next day.', 'He told me that he would help me tomorrow.',
    '“Will” becomes “would”, “tomorrow” becomes “the next day”, and “you” becomes “me” (the listener).');

  // ---- Sentence transformation ----
  Q('eng-transformation', 'Change to positive degree: “He is too young to drive.”',
    'He is not old enough to drive.', 'He is old enough to drive.', 'He is young enough to drive.', 'He is not young enough to drive.',
    '“Too young” means “not old enough”.');
  Q('eng-transformation', 'Change to comparative: “No other mountain is as high as Everest.”',
    'Everest is higher than any other mountain.', 'Everest is as high as any other mountain.', 'Everest is not higher than other mountains.', 'Everest is the lowest mountain.',
    'A negative “as … as” sentence becomes a positive comparative: “higher than any other”.');
  Q('eng-transformation', 'Change to a simple sentence: “Although he is poor, he is honest.”',
    'In spite of being poor, he is honest.', 'Despite poor, he is honest.', 'He is poor but dishonest.', 'Poor, he is honest although.',
    '“In spite of” + -ing (“being poor”) is the correct simple form. “Despite poor” is not grammatical.');
  Q('eng-transformation', 'Change using “too … to”: “He is so weak that he cannot walk.”',
    'He is too weak to walk.', 'He is weak enough to walk.', 'He is not weak enough to walk.', 'He is so weak to walk.',
    '“So … that … cannot” is the same as “too … to”.');
  Q('eng-transformation', 'Rewrite using “no sooner”: “I had hardly reached the station when the train left.”',
    'No sooner had I reached the station than the train left.', 'No sooner had I reached the station when the train left.', 'No sooner I had reached the station than the train left.', 'No sooner had I reached the station but the train left.',
    '“Hardly … when” becomes “no sooner … than”. The inversion “had I reached” is kept.');
  Q('eng-transformation', 'Change to a positive sentence: “Unless you work hard, you will not pass.”',
    'If you do not work hard, you will not pass.', 'If you work hard, you will pass.', 'Unless you work hard, you pass.', 'If you work hard you will not pass.',
    '“Unless” means “if … not”. The meaning stays the same.');

  // ---- Synonyms and antonyms ----
  Q('eng-syn-ant', 'Synonym of “ABUNDANT”:',
    'plentiful', 'scarce', 'empty', 'rare',
    '“Abundant” means present in large amounts. “Plentiful” has the same meaning. “Scarce” and “rare” are opposites.');
  Q('eng-syn-ant', 'Synonym of “BRAVE”:',
    'fearless', 'coward', 'weak', 'timid',
    '“Fearless” means without fear, which is the same as brave.');
  Q('eng-syn-ant', 'Synonym of “BEGIN”:',
    'start', 'finish', 'stop', 'end',
    '“Begin” and “start” have the same meaning. Finish, stop and end are opposites.');
  Q('eng-syn-ant', 'Synonym of “ENORMOUS”:',
    'huge', 'tiny', 'narrow', 'light',
    '“Enormous” means very large, so “huge” is the synonym.');
  Q('eng-syn-ant', 'Antonym of “GENEROUS”:',
    'miserly', 'liberal', 'kind', 'bountiful',
    '“Generous” means giving freely. “Miserly” (stingy) is the opposite. Liberal, kind and bountiful are similar in meaning.');
  Q('eng-syn-ant', 'Antonym of “EXPAND”:',
    'contract', 'grow', 'widen', 'enlarge',
    '“Expand” means become larger. “Contract” means become smaller.');

  // ---- One-word substitution ----
  Q('eng-one-word', 'One who knows everything:',
    'Omniscient', 'Omnipresent', 'Omnivorous', 'Omnibus',
    'Omniscient means all-knowing. Omnipresent means present everywhere. Omnivorous means eating everything.');
  Q('eng-one-word', 'One who speaks many languages:',
    'Polyglot', 'Monologue', 'Glossary', 'Dialect',
    'A polyglot knows many languages. A monologue is a speech by one person; a glossary is a list of words.');
  Q('eng-one-word', 'A place where birds are kept:',
    'Aviary', 'Apiary', 'Aquarium', 'Kennel',
    'An aviary is for birds. An apiary is for bees, an aquarium for fish and a kennel for dogs.');
  Q('eng-one-word', 'Study of birds:',
    'Ornithology', 'Entomology', 'Cardiology', 'Geology',
    'Ornithology is the study of birds. Entomology is insects, cardiology the heart and geology the earth.');
  Q('eng-one-word', 'A speech delivered without any preparation:',
    'Impromptu', 'Prologue', 'Epilogue', 'Sermon',
    '“Impromptu” (or extempore) means done without preparation. A prologue opens a play; an epilogue closes it.');
  Q('eng-one-word', 'One who eats too much:',
    'Glutton', 'Vegetarian', 'Ascetic', 'Miser',
    'A glutton eats too much. An ascetic avoids luxuries and a miser hoards money.');

  // ---- Idioms and phrases ----
  Q('eng-idioms', 'Meaning of “break the ice”:',
    'start a conversation or ease tension', 'break something by accident', 'feel very cold', 'take a holiday',
    'To “break the ice” means to start a friendly conversation or reduce the tension in a group.');
  Q('eng-idioms', 'Meaning of “once in a blue moon”:',
    'very rarely', 'very often', 'at night', 'in the morning',
    '“Once in a blue moon” means very rarely.');
  Q('eng-idioms', 'Meaning of “a piece of cake”:',
    'very easy', 'a dessert', 'very expensive', 'very difficult',
    'A task that is “a piece of cake” is very easy.');
  Q('eng-idioms', 'Meaning of “hit the nail on the head”:',
    'say or do exactly the right thing', 'make a mistake', 'hammer something', 'be very angry',
    'To “hit the nail on the head” means to be exactly right.');
  Q('eng-idioms', 'Meaning of “beat about the bush”:',
    'avoid the main point', 'speak directly and plainly', 'work in a garden', 'win a race',
    'To “beat about the bush” means to avoid coming to the point.');
  Q('eng-idioms', 'Meaning of “under the weather”:',
    'slightly ill', 'very happy', 'outdoors in the rain', 'lost in a crowd',
    '“Under the weather” means feeling slightly ill.');

  // ---- Spelling and words often confused ----
  Q('eng-spelling-usage', 'Choose the correct spelling:',
    'accommodation', 'acommodation', 'accomodation', 'acomodation',
    'The correct spelling has double c and double m: accommodation.');
  Q('eng-spelling-usage', 'Choose the correct spelling:',
    'necessary', 'neccessary', 'necesary', 'necessery',
    'The correct spelling is one c and two s: necessary.');
  Q('eng-spelling-usage', 'The ______ of the medicine was immediate.',
    'effect', 'affect', 'affection', 'effort',
    '“Effect” is a noun meaning result. “Affect” is usually a verb.');
  Q('eng-spelling-usage', '______ going to rain today.',
    'It’s', 'Its', 'Its’', 'Itz',
    '“It’s” is short for “it is”.');
  Q('eng-spelling-usage', 'The school ______ is a kind and strict man.',
    'principal', 'principle', 'principles', 'principality',
    '“Principal” means the head of an institution (a person).');
  Q('eng-spelling-usage', 'All students ______ Ram were present.',
    'except', 'accept', 'expect', 'excess',
    '“Except” means excluding. “Accept” means receive or agree.');
  Q('eng-spelling-usage', 'Be careful not to ______ your ticket.',
    'lose', 'loose', 'losse', 'loss',
    '“Lose” is the verb meaning to misplace something. “Loose” means not tight.');

  // ---- Error spotting and sentence correction ----
  Q('eng-error-correction', 'Which sentence is grammatically correct?',
    'He doesn’t know the answer.', 'He don’t know the answer.', 'He doesn’t knows the answer.', 'He not know the answer.',
    'With he, she and it, use “doesn’t” followed by the base verb: “doesn’t know”.');
  Q('eng-error-correction', 'Which sentence is correct?',
    'Neither of the two boys is honest.', 'Neither of the two boys are honest.', 'Neither of the two boys were honest.', 'Neither of the two boys have honest.',
    '“Neither” is singular, so the verb is “is”.');
  Q('eng-error-correction', 'Which sentence is correct?',
    'I have been living here since 2010.', 'I am living here since 2010.', 'I live here since 2010.', 'I was living here since 2010.',
    'An action that started in 2010 and continues now uses the present perfect continuous with “since”.');
  Q('eng-error-correction', 'Which sentence is correct?',
    'She is taller than her sister.', 'She is more taller than her sister.', 'She is most taller than her sister.', 'She is tallest than her sister.',
    'Use the comparative “taller”. Do not add “more” to a comparative form.');
  Q('eng-error-correction', 'Which sentence is correct?',
    'The boy, along with his friends, is going.', 'The boy, along with his friends, are going.', 'The boys, along with his friends, is going.', 'The boy and his friends is going.',
    '“Along with” does not change the number, so the verb agrees with “the boy” (singular): “is going”.');
  Q('eng-error-correction', 'Which sentence is correct?',
    'Between you and me, the plan is bad.', 'Between you and I, the plan is bad.', 'Between you and myself, the plan is bad.', 'Between you and me, the plan are bad.',
    'After a preposition, use the object pronoun “me”. “Between you and I” is a common error.');

  NS.addQuestions('english', R);
})(typeof window !== 'undefined' ? window : globalThis);
