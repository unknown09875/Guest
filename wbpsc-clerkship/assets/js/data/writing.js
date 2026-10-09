/* Part-II writing practice: report, précis and translation prompts with model answers,
 * and the passages used by the typing test. Model answers are for practice, not for copying
 * into the exam. Plain text only (line breaks are shown as written). */
(function (root) {
  'use strict';
  var NS = (root.WBPSC = root.WBPSC || {});

  NS.writingPrompts = [
    {
      id: 'w-report-1', chapter: 'p2a-report', group: 'Group-A (English)', kind: 'Report', lang: 'en',
      title: 'Report on the Blood Donation Camp',
      prompt: 'Write a report in English from these points:\n' +
        '• Organised by the Youth Club, Shyamnagar village\n' +
        '• Held on 15 March at the village high school\n' +
        '• Doctors and nurses from the district hospital took part\n' +
        '• 120 people donated blood; 15 of them were first-time donors\n' +
        '• Refreshments were served to all donors\n' +
        '• The programme ran smoothly with no major problem\n' +
        '• Suggest holding such camps every three months',
      model: 'REPORT ON THE BLOOD DONATION CAMP\n\n' +
        'Introduction\n' +
        'This report describes the blood donation camp organised by the Youth Club, Shyamnagar village, on 15 March at the village high school.\n\n' +
        'Arrangements and Participation\n' +
        'Doctors and nurses from the district hospital conducted the camp. In all, 120 people donated blood, and 15 of them were donating blood for the first time. Refreshments were served to every donor.\n\n' +
        'Observations\n' +
        'The programme ran smoothly and no major problem was reported.\n\n' +
        'Recommendation\n' +
        'In view of the response, it is suggested that such camps be organised every three months.\n\n' +
        'Secretary, Youth Club, Shyamnagar'
    },
    {
      id: 'w-report-2', chapter: 'p2a-report', group: 'Group-A (English)', kind: 'Report', lang: 'en',
      title: 'Report on waterlogging in Ward No. 7',
      prompt: 'Write a report in English from these points:\n' +
        '• Heavy rain for two days; water stood on the roads for three days\n' +
        '• Two primary schools were closed for three days\n' +
        '• Garbage had clogged the drains\n' +
        '• The councillor informed the municipality\n' +
        '• The municipality promised to clean the drains by the end of the month\n' +
        '• Residents demand a permanent solution',
      model: 'REPORT ON WATERLOGGING IN WARD NO. 7\n\n' +
        'Introduction\n' +
        'This report describes the waterlogging problem in Ward No. 7 after recent heavy rain.\n\n' +
        'Situation\n' +
        'Heavy rain fell for two days, and water stood on the roads of the ward for three days. As a result, two primary schools were closed for three days. Garbage had clogged the drains and stopped the water from flowing away.\n\n' +
        'Action Taken\n' +
        'The councillor informed the municipality about the problem. The municipality has promised to clean the drains by the end of the month.\n\n' +
        'Recommendation\n' +
        'Residents have demanded a permanent solution. It is recommended that the drains be cleaned regularly and that a long-term drainage plan be prepared.'
    },
    {
      id: 'w-report-bn', chapter: 'p2b-report', group: 'Group-B (Bengali)', kind: 'Report', lang: 'bn',
      title: 'প্রতিবেদন: বৃক্ষরোপণ কর্মসূচি',
      prompt: 'বাংলায় প্রতিবেদন লিখুন। পয়েন্ট:\n' +
        '• বিদ্যালয় প্রাঙ্গণে ৫ জুলাই বৃক্ষরোপণ কর্মসূচি\n' +
        '• ২০০টি চারা রোপণ করা হয়\n' +
        '• ছাত্রছাত্রী ও শিক্ষকেরা অংশ নেন\n' +
        '• স্থানীয় একটি ক্লাব চারা সরবরাহ করে\n' +
        '• ছাত্রছাত্রীরা পালাক্রমে গাছে জল দেবে\n' +
        '• এই ধরনের কর্মসূচি আরও নিয়মিত করার সুপারিশ',
      model: 'প্রতিবেদন: বৃক্ষরোপণ কর্মসূচি\n\n' +
        'ভূমিকা\n' +
        '৫ জুলাই বিদ্যালয় প্রাঙ্গণে একটি বৃক্ষরোপণ কর্মসূচি অনুষ্ঠিত হয়। এই প্রতিবেদনে সেই কর্মসূচির বিবরণ দেওয়া হলো।\n\n' +
        'মূল বিবরণ\n' +
        'স্থানীয় একটি ক্লাবের সহযোগিতায় ২০০টি চারা রোপণ করা হয়। কর্মসূচিতে ছাত্রছাত্রী ও শিক্ষকেরা উৎসাহের সঙ্গে অংশ নেন। ক্লাবটি চারাগুলি সরবরাহ করে। চারাগুলির পরিচর্যার জন্য ছাত্রছাত্রীরা পালাক্রমে গাছে জল দেবে।\n\n' +
        'উপসংহার ও সুপারিশ\n' +
        'এই ধরনের কর্মসূচি আরও নিয়মিতভাবে আয়োজন করা উচিত। তাতে পরিবেশ রক্ষার প্রতি শিক্ষার্থীদের আগ্রহ বাড়বে।\n\n' +
        'সম্পাদক, বিদ্যালয় পরিবেশ ক্লাব'
    }
  ];

  NS.precisPrompts = [
    {
      id: 'w-precis-1', chapter: 'p2a-precis', group: 'Group-A (English)', kind: 'Précis', lang: 'en',
      title: 'Reading habits (précis)',
      prompt: 'Write a précis of the passage below in about one-third of its length. Give it a title.',
      passage: 'Reading is one of the most valuable habits a person can develop. Books expand our knowledge, improve our vocabulary and help us understand people whose lives are very different from ours. Unlike television, reading requires active attention, and this strengthens concentration over time. Yet many students today read only what their examinations demand. They skip novels, poems and newspapers, and so they miss the pleasure and perspective that wider reading brings. Parents and teachers can help by keeping books within easy reach at home and in school, and by talking with children about what they read.',
      model: 'Title: The Value of Wider Reading\n\n' +
        'Reading builds knowledge, vocabulary and understanding of others, and it needs more active attention than television. However, students often read only for examinations and miss the pleasure and wider outlook of novels, poems and newspapers. Parents and teachers can encourage reading by keeping books at hand and discussing them.'
    }
  ];

  NS.translationPrompts = [
    { id: 'w-tr-bn-1', chapter: 'p2a-translation', direction: 'Bengali → English', source: 'আমি গত রবিবার আমার বন্ধুর বাড়ি গিয়েছিলাম।', model: 'I went to my friend’s house last Sunday.' },
    { id: 'w-tr-bn-2', chapter: 'p2a-translation', direction: 'Bengali → English', source: 'শিক্ষক ছাত্রদের সততার গুরুত্ব বুঝিয়ে দিলেন।', model: 'The teacher explained to the students the importance of honesty.' },
    { id: 'w-tr-bn-3', chapter: 'p2a-translation', direction: 'Bengali → English', source: 'যদি তুমি সময়মতো না আসো, তবে তোমাকে অপেক্ষা করতে হবে।', model: 'If you do not come on time, you will have to wait.' },
    { id: 'w-tr-bn-4', chapter: 'p2a-translation', direction: 'Bengali → English', source: 'গ্রামের মানুষ নদীর জল দিয়ে চাষ করে।', model: 'The villagers cultivate their land with river water.' },
    { id: 'w-tr-en-bn-1', chapter: 'p2b-translation', direction: 'English → Bengali', source: 'The sun rises in the east.', model: 'সূর্য পূর্ব দিকে ওঠে।' },
    { id: 'w-tr-en-bn-2', chapter: 'p2b-translation', direction: 'English → Bengali', source: 'She has completed her homework.', model: 'সে তার বাড়ির কাজ শেষ করেছে।' },
    { id: 'w-tr-en-bn-3', chapter: 'p2b-translation', direction: 'English → Bengali', source: 'We shall visit the museum tomorrow.', model: 'আমরা আগামীকাল যাদুঘরটি দেখতে যাব।' },
    { id: 'w-tr-en-bn-4', chapter: 'p2b-translation', direction: 'English → Bengali', source: 'The meeting was postponed due to heavy rain.', model: 'ভারী বৃষ্টির কারণে সভাটি স্থগিত রাখা হয়েছে।' },
    { id: 'w-tr-en-hi-1', chapter: 'p2b-translation', direction: 'English → Hindi', source: 'The children are playing in the park.', model: 'बच्चे पार्क में खेल रहे हैं।' },
    { id: 'w-tr-en-hi-2', chapter: 'p2b-translation', direction: 'English → Hindi', source: 'She will complete the project next week.', model: 'वह अगले सप्ताह परियोजना पूरी करेगी।' },
    { id: 'w-tr-en-hi-3', chapter: 'p2b-translation', direction: 'English → Hindi', source: 'Water is essential for all living beings.', model: 'सभी जीवों के लिए पानी आवश्यक है।' }
  ];

  // Typing passages. Use plain text; the typing test compares what you type with these.
  NS.typingPassages = {
    en: [
      'Typing is a skill that improves with regular practice. Sit upright, keep your wrists relaxed, and place your fingers on the home row. Look at the screen rather than the keyboard. Accuracy matters more than speed at the beginning, so type each word carefully. Practise for a few minutes every day and record your progress. Within a few weeks, your speed and confidence will grow.',
      'Government examinations test accuracy as well as speed. Read each line before you start typing. Keep your eyes on the copy, not on your hands. Correct mistakes at once if the software allows it. Stay calm, keep a steady rhythm, and do not stop until the time is over.'
    ],
    bn: [
      'বাংলা ভাষা একটি সমৃদ্ধ ভাষা। এটি পশ্চিমবঙ্গ ও বাংলাদেশের প্রধান ভাষা। রবীন্দ্রনাথ ঠাকুর এই ভাষায় অসংখ্য কবিতা ও গান লিখেছেন। প্রতিদিন বাংলা বই পড়লে ভাষার উপর দখল বাড়ে। নিয়মিত অনুশীলনে টাইপের গতিও বাড়ে।',
      'সরকারি চাকরির পরীক্ষায় গতির চেয়ে নির্ভুলতা বেশি গুরুত্বপূর্ণ। প্রতিটি শব্দ ধীরে ও সঠিকভাবে লিখুন। শুদ্ধ বানান ও যতিচিহ্নের দিকে নজর রাখুন। ধীরে ধীরে গতি বাড়বে। প্রতিদিন নির্দিষ্ট সময় অনুশীলন করলে ফল পাওয়া যায়।'
    ]
  };
})(typeof window !== 'undefined' ? window : globalThis);
