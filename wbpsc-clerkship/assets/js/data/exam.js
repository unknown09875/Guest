/*
 * Official facts for WBPSC Clerkship Examination 2024 (Advertisement No. 12/2024).
 * Source: psc.wb.gov.in — Detailed Advertisement dated 06.10.2026 and Scheme & Syllabus.
 * If the official notice changes, the official notice wins: update this file.
 */
(function (root) {
  'use strict';
  var NS = (root.WBPSC = root.WBPSC || {});

  NS.exam = {
    name: 'WBPSC Clerkship Examination, 2024',
    advt: 'Advertisement No. 12/2024',
    conductedBy: 'Public Service Commission, West Bengal (WBPSC)',
    posts: 'Lower Division Assistant / Lower Division Clerk and similar posts (Secretariat, Directorates, district offices and regional offices)',
    sourceNote: 'Based on the official detailed advertisement (dated 06.10.2026) and the official Scheme & Syllabus. The official notice overrides this website.',

    // Dates from the official notice. "tentative" items are not final.
    dates: [
      { label: 'Online application opens', value: '6 October 2026', tag: 'official' },
      { label: 'Last date to submit the online application', value: '26 October 2026, 3:30 PM', tag: 'official' },
      { label: 'Last date to pay the fee (online)', value: '26 October 2026, 3:30 PM', tag: 'official' },
      { label: 'Edit window (one edit only; upload documents here)', value: '28 October – 1 November 2026', tag: 'official', note: 'A notice dated 7 Oct 2026 on psc.wb.gov.in is titled “edit option for updating OBC sub-category / UR category details”. Its file name suggests the window may have been extended. Read it before relying on these dates.' },
      { label: 'Part-I (objective) examination', value: 'Tentatively December 2026, "or thereabout"', tag: 'tentative' },
      { label: 'Part-II (descriptive) examination', value: 'To be notified by the Commission', tag: 'tentative' }
    ],

    // Checklist shown on the dashboard. Ticks are saved in the browser.
    actions: [
      { id: 'apply', text: 'Submit the online application before 26 Oct 2026, 3:30 PM. Only one application is allowed.' },
      { id: 'fee', text: 'Pay the fee online before 26 Oct 2026, 3:30 PM. Fee payment closes at the same time. Check the payment receipt.' },
      { id: 'docs', text: 'Keep ready the documents the form asks for, including your Madhyamik certificate and the caste/category certificate (PDF, max 100 KB) issued by a West Bengal authority on or before the closing date.' },
      { id: 'edit', text: 'In the edit window (28 Oct – 1 Nov 2026) you can edit once. Required documents, including the caste/category certificate PDF (max 100 KB), can be uploaded only in this window. Missing documents can lead to rejection.' },
      { id: 'notice7oct', text: 'Read the official notice dated 7 Oct 2026 (edit option for updating OBC sub-category / UR category details). Its file name suggests the edit window may be extended. This site could not open the PDF, so its details are not included here.', url: 'https://psc.wb.gov.in/Download?param1=An_20261007163709_Extended_Edit_window.pdf&param2=advertisement' },
      { id: 'address', text: 'If your address has changed, update it in your Profile first (the notice asks for this before the edit window).' },
      { id: 'admit', text: 'Watch psc.wb.gov.in (Candidate\u2019s Corner) for the admit card download before Part-I.' },
      { id: 'typing', text: 'Confirm which typing option you chose in the application (English 20 wpm or Bengali 10 wpm) and start typing practice now.' }
    ],

    fee: '₹110 plus service charges. Exempt: West Bengal SC/ST candidates and persons with disability (40% or more). Fee is non-refundable.',
    pay: 'Level 6: ₹22,700 – ₹58,500 plus DA, MA and HRA (as per ROPA 2019). Vacancies will be announced separately. Initial appointment is temporary.',
    age: 'Not below 18 and not above 45 years as on 01.01.2024 (born between 2 January 1979 and 1 January 2006). Age as recorded in the Madhyamik or equivalent certificate is accepted. Relaxation: SC/ST +5 years; OBC (non-creamy layer, West Bengal) +3 years; Ex-Servicemen as per the notice.',
    eligibility: [
      'Madhyamik (WBBSE) pass, or an equivalent qualification.',
      'Elementary computer knowledge, and typing at 20 wpm in English or 10 wpm in Bengali (choose at the time of application).',
      'Ability to read, write and speak Bengali. This is not required for candidates whose mother tongue is Nepali. Non-Bengali candidates are tested for Bengali at the computer/typing stage.'
    ],

    // Part-I: objective, from the official notice.
    part1: {
      questions: 100,
      marks: 100,
      minutes: 90,
      negativePerWrong: 0.25,
      sections: [
        { id: 'english', name: 'English', questions: 30, marks: 30 },
        { id: 'gs', name: 'General Studies', questions: 40, marks: 40 },
        { id: 'arith', name: 'Arithmetic', questions: 30, marks: 30 }
      ]
    },

    // Part-II: conventional (descriptive), from the official notice.
    part2: {
      marks: 100,
      minutes: 60,
      groups: [
        {
          id: 'p2a',
          name: 'Group-A: English',
          marks: 50,
          tasks: [
            'Drafting a report in English from points or materials supplied',
            'Condensing a prose passage (summary / précis)',
            'Translation from Bengali, Hindi, Urdu, Nepali or Santali into English'
          ]
        },
        {
          id: 'p2b',
          name: 'Group-B: Bengali, Hindi, Urdu, Nepali or Santali (chosen language)',
          marks: 50,
          tasks: [
            'Drafting a report in the chosen language from points or materials supplied',
            'Condensing a prose passage (summary / précis) in the chosen language',
            'Translation from English into the chosen language'
          ]
        }
      ]
    },

    typing: {
      english: 20,
      bengali: 10,
      note: 'Computer knowledge and typing test. It is qualifying only and is judged after Part-I and Part-II.'
    },

    // Qualifying marks for the aggregate (Part-I + Part-II), from the notice.
    qualifying: [
      { cat: 'UR (General)', pct: 40 },
      { cat: 'EWS', pct: 40 },
      { cat: 'OBC (non-creamy layer)', pct: 38 },
      { cat: 'SC', pct: 35 },
      { cat: 'ST', pct: 30 },
      { cat: 'PwBD', pct: 30 },
      { cat: 'Ex-Servicemen', pct: 30 },
      { cat: 'Meritorious Sports Person', pct: 40 }
    ],

    tieBreak: 'Higher marks in English plus Group-A language, then in English, then older age (as per notice).',
    reservation: 'SC, ST and OBC (non-creamy layer) benefits are for West Bengal candidates only. Other states’ SC/ST/OBC candidates are treated as general candidates. Also covered: PwBD (40% and above), Ex-Servicemen, Meritorious Sportspersons (listed sports) and EWS of West Bengal.',
    centres: 'Part-I is held at centres in Kolkata and certain other districts. Darjeeling and Kalimpong candidates have special centre rules; read the notice and your admit card.',

    stages: [
      'Part-I: 100 MCQs, 90 minutes, negative marking 0.25 per wrong answer. Only a limited number of qualifiers go on to Part-II.',
      'Part-II: descriptive, 100 marks, 60 minutes (Group A English 50 + Group B language 50).',
      'Computer knowledge and typing test: qualifying only.',
      'Final merit = Part-I + Part-II marks, for candidates who also qualify the typing test.'
    ],

    rules: [
      'Negative marking: 0.25 marks are deducted for each wrong MCQ in Part-I. Unattempted questions score 0.',
      'Part-II: if you write your name, roll number or any identifying mark, 10% of that paper\u2019s full marks is deducted (5 marks on a 50-mark group).',
      'Mobile phones, smartwatches and Bluetooth devices are not allowed. Frisking is done at entry.',
      'The Commission has not published a Part-I cut-off in the notice. It fixes qualifying marks for each part.',
      'Admit card: download from psc.wb.gov.in (Candidate\u2019s Corner). Carry a valid photo ID.',
      'Photo ID accepted: Madhyamik certificate with photo, passport, PAN card, EPIC (voter ID), driving licence, or any other government photo ID.'
    ],

    links: [
      { label: 'Official website (psc.wb.gov.in)', url: 'https://psc.wb.gov.in' },
      { label: 'Detailed advertisement, 06.10.2026 (PDF)', url: 'https://psc.wb.gov.in/Download?param1=CLERKSHIP2024.pdf&param2=advertisement' },
      { label: 'Scheme and syllabus (PDF)', url: 'https://psc.wb.gov.in/Download?param1=Clerkship2024-SchemeSyllabus.pdf&param2=advertisement' },
      { label: 'Download admit card (Candidate’s Corner)', url: 'https://psc.wb.gov.in/admit_card_download.jsp' },
      { label: 'One Time Registration', url: 'https://psc.wb.gov.in/candidateOTRegistration.jsp' },
      { label: 'Current applications', url: 'https://psc.wb.gov.in/current-application.jsp' },
      { label: 'Answer key response', url: 'https://psc.wb.gov.in/AnswerKeyResponse.jsp' },
      { label: 'FAQs', url: 'https://psc.wb.gov.in/faq.jsp' }
    ],

    // Official syllabus wording (Scheme and Syllabus), per subject.
    subjects: [
      {
        id: 'english', part: 'Part-I', name: 'English', marks: 30, questions: 30,
        official: 'Fundamentals of the English language such as vocabulary, grammar, sentence structure, synonyms, antonyms and its correct usage, etc.',
        chapters: ['eng-parts-of-speech', 'eng-tenses', 'eng-articles', 'eng-sva', 'eng-prepositions', 'eng-conj-modals', 'eng-voice', 'eng-narration', 'eng-transformation', 'eng-syn-ant', 'eng-one-word', 'eng-idioms', 'eng-spelling-usage', 'eng-error-correction']
      },
      {
        id: 'gs', part: 'Part-I', name: 'General Studies', marks: 40, questions: 40,
        official: 'Matters of everyday observation and everyday science; current events and problems with special reference to India; elementary knowledge of Indian History and Indian Geography.',
        chapters: ['gs-science', 'gs-current', 'gs-history', 'gs-geography', 'gs-polity', 'gs-wb', 'gs-ga']
      },
      {
        id: 'arith', part: 'Part-I', name: 'Arithmetic', marks: 30, questions: 30,
        official: 'Divisibility; fractions; decimals; recurring decimals; simplification; HCF; LCM; partnership; average; ratio and proportion; percentage; simple interest; profit and loss; time and distance; area of rectangles and squares.',
        chapters: ['arith-divisibility', 'arith-hcf-lcm', 'arith-fractions', 'arith-decimals', 'arith-simplification', 'arith-average', 'arith-ratio', 'arith-percentage', 'arith-profit-loss', 'arith-simple-interest', 'arith-partnership', 'arith-time-distance', 'arith-area']
      },
      {
        id: 'p2a', part: 'Part-II', name: 'Group-A: English', marks: 50, questions: null,
        official: 'Drafting a report in English from points or materials; condensing a prose passage (summary / précis); translation from Bengali, Hindi, Urdu, Nepali or Santali into English.',
        chapters: ['p2a-report', 'p2a-precis', 'p2a-translation']
      },
      {
        id: 'p2b', part: 'Part-II', name: 'Group-B: Bengali / Hindi / Urdu / Nepali / Santali', marks: 50, questions: null,
        official: 'Drafting a report in the chosen language; condensing a prose passage in that language; translation from English into the chosen language.',
        chapters: ['p2b-report', 'p2b-precis', 'p2b-translation']
      }
    ]
  };

  // Chapter catalogue. Notes are in notes-*.js, questions in q-*.js, keyed by these IDs.
  // `official` = true when the topic is listed in the official syllabus; false = helpful extra.
  NS.chapters = [
    // ---- Arithmetic ----
    { id: 'arith-divisibility', subject: 'arith', title: 'Divisibility', official: true,
      topics: ['Divisibility rules for 2, 3, 4, 5, 6, 8, 9, 10, 11 (and 7, 12 tricks)', 'Remainders', 'Missing-digit problems'] },
    { id: 'arith-hcf-lcm', subject: 'arith', title: 'HCF and LCM', official: true,
      topics: ['Prime factorisation', 'HCF and LCM of numbers', 'Greatest / least number with remainders', 'Bells and tiles type problems'] },
    { id: 'arith-fractions', subject: 'arith', title: 'Fractions', official: true,
      topics: ['Proper, improper and mixed fractions', 'Addition, subtraction, multiplication, division', '"Of" and comparison of fractions'] },
    { id: 'arith-decimals', subject: 'arith', title: 'Decimals and recurring decimals', official: true,
      topics: ['Place value and operations', 'Converting recurring decimals to fractions'] },
    { id: 'arith-simplification', subject: 'arith', title: 'Simplification (BODMAS)', official: true,
      topics: ['BODMAS order', 'Brackets, "of", powers and square roots'] },
    { id: 'arith-average', subject: 'arith', title: 'Average', official: true,
      topics: ['Average of n items', 'Adding or removing an item', 'Average of natural numbers'] },
    { id: 'arith-ratio', subject: 'arith', title: 'Ratio and proportion', official: true,
      topics: ['Simplifying ratios', 'Compound ratio', 'Sharing an amount in a ratio', 'Ages', 'Direct and inverse proportion (men and days)'] },
    { id: 'arith-percentage', subject: 'arith', title: 'Percentage', official: true,
      topics: ['Percentage of a number', 'Percentage change', 'Successive increase and decrease', 'Compound growth'] },
    { id: 'arith-profit-loss', subject: 'arith', title: 'Profit and loss', official: true,
      topics: ['CP, SP, profit and loss percent', 'Marked price and discount'] },
    { id: 'arith-simple-interest', subject: 'arith', title: 'Simple interest', official: true,
      topics: ['SI and amount', 'Finding rate and time'] },
    { id: 'arith-partnership', subject: 'arith', title: 'Partnership', official: true,
      topics: ['Capital × time', 'Sharing profit'] },
    { id: 'arith-time-distance', subject: 'arith', title: 'Time and distance', official: true,
      topics: ['Speed, distance, time', 'km/h and m/s conversion', 'Trains and poles', 'Average speed'] },
    { id: 'arith-area', subject: 'arith', title: 'Area of rectangles and squares', official: true,
      topics: ['Area and perimeter', 'Diagonal (Pythagoras)', 'Square', 'Cost of flooring'] },

    // ---- English ----
    { id: 'eng-parts-of-speech', subject: 'english', title: 'Parts of speech', official: true,
      topics: ['Noun, pronoun, verb, adjective, adverb', 'Preposition, conjunction, interjection'] },
    { id: 'eng-tenses', subject: 'english', title: 'Tenses', official: true,
      topics: ['Simple, continuous, perfect, perfect continuous', 'Signal words'] },
    { id: 'eng-articles', subject: 'english', title: 'Articles', official: true,
      topics: ['a / an / the', 'Zero article'] },
    { id: 'eng-sva', subject: 'english', title: 'Subject–verb agreement', official: true,
      topics: ['Tricky subjects', 'Either/neither, number of / a number of'] },
    { id: 'eng-prepositions', subject: 'english', title: 'Prepositions', official: true,
      topics: ['Time and place', 'Verb and adjective + preposition'] },
    { id: 'eng-conj-modals', subject: 'english', title: 'Conjunctions and modal verbs', official: true,
      topics: ['Coordinating, subordinating, correlative', 'Modal verbs and their uses'] },
    { id: 'eng-voice', subject: 'english', title: 'Active and passive voice', official: true,
      topics: ['Tense-wise change', 'Modals, let, questions'] },
    { id: 'eng-narration', subject: 'english', title: 'Direct and indirect speech', official: true,
      topics: ['Tense back-shift', 'Pronoun, time and place changes', 'Commands, requests, questions'] },
    { id: 'eng-transformation', subject: 'english', title: 'Sentence transformation', official: true,
      topics: ['Degrees of comparison', 'Too…to, so…that, enough', 'Simple, compound, complex'] },
    { id: 'eng-syn-ant', subject: 'english', title: 'Synonyms and antonyms', official: true,
      topics: ['Word lists', 'Context clues'] },
    { id: 'eng-one-word', subject: 'english', title: 'One-word substitution', official: true,
      topics: ['Common one-word substitutes'] },
    { id: 'eng-idioms', subject: 'english', title: 'Idioms and phrases', official: true,
      topics: ['Common idioms and their meanings'] },
    { id: 'eng-spelling-usage', subject: 'english', title: 'Spelling and words often confused', official: true,
      topics: ['Common spelling errors', 'Words often confused', 'Correct usage'] },
    { id: 'eng-error-correction', subject: 'english', title: 'Error spotting and sentence correction', official: true,
      topics: ['Common grammar errors', 'Choosing the correct sentence'] },

    // ---- General Studies ----
    { id: 'gs-science', subject: 'gs', title: 'Everyday science', official: true,
      topics: ['Physics, chemistry and biology basics', 'Health and diseases', 'Environment and technology'] },
    { id: 'gs-current', subject: 'gs', title: 'Current events and contemporary issues', official: true,
      topics: ['How to prepare with a monthly file', 'Static facts that current-events questions use', 'Official sources'] },
    { id: 'gs-history', subject: 'gs', title: 'Indian history (elementary)', official: true,
      topics: ['Ancient, medieval and modern timeline', 'Freedom movement'] },
    { id: 'gs-geography', subject: 'gs', title: 'Indian geography (elementary)', official: true,
      topics: ['Location, physiography, rivers', 'Climate, soils, agriculture and minerals'] },
    { id: 'gs-polity', subject: 'gs', title: 'Indian polity and Constitution (basics)', official: false,
      topics: ['Preamble, Fundamental Rights and Duties', 'Key Articles and amendments'] },
    { id: 'gs-wb', subject: 'gs', title: 'West Bengal special', official: false,
      topics: ['Geography and districts', 'History and reformers', 'Culture and famous people'] },
    { id: 'gs-ga', subject: 'gs', title: 'General awareness', official: false,
      topics: ['National symbols and awards', 'Important days and organisations'] },

    // ---- Part-II, Group A (English) ----
    { id: 'p2a-report', subject: 'p2a', title: 'Report writing in English', official: true,
      topics: ['Format of a report', 'Writing from points', 'Avoiding identity disclosure'] },
    { id: 'p2a-precis', subject: 'p2a', title: 'Précis (summary) writing in English', official: true,
      topics: ['Method of condensing', 'Title and length'] },
    { id: 'p2a-translation', subject: 'p2a', title: 'Translation into English', official: true,
      topics: ['Bengali to English', 'Hindi to English (general method)', 'Urdu, Nepali, Santali (general method)'] },

    // ---- Part-II, Group B (chosen language) ----
    { id: 'p2b-report', subject: 'p2b', title: 'Report writing in your language', official: true,
      topics: ['Bengali report format', 'Hindi report format', 'General method for Urdu, Nepali, Santali'] },
    { id: 'p2b-precis', subject: 'p2b', title: 'Précis writing in your language', official: true,
      topics: ['Bengali précis method', 'Hindi précis method', 'General method for Urdu, Nepali, Santali'] },
    { id: 'p2b-translation', subject: 'p2b', title: 'Translation from English', official: true,
      topics: ['English to Bengali', 'English to Hindi', 'General method for Urdu, Nepali, Santali'] }
  ];

  NS.chapterById = {};
  NS.chapters.forEach(function (c) { NS.chapterById[c.id] = c; });
})(typeof window !== 'undefined' ? window : globalThis);
