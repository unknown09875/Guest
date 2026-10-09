/* General Studies practice questions. Original items with explanations.
 * Static facts only; for current events, check the official sources linked in the app. */
(function (root) {
  'use strict';
  var NS = (root.WBPSC = root.WBPSC || {});
  var R = [];
  function Q(topic, q, c, w1, w2, w3, exp) { R.push({ topic: topic, q: q, c: c, w: [w1, w2, w3], exp: exp }); }

  // ---- Everyday science ----
  Q('gs-science', 'The SI unit of force is:', 'newton', 'joule', 'pascal', 'watt',
    'Force is measured in newtons (N). Joule is the unit of energy, pascal of pressure and watt of power.');
  Q('gs-science', 'The gas most abundant in Earth’s atmosphere is:', 'nitrogen', 'oxygen', 'carbon dioxide', 'argon',
    'Nitrogen makes up about 78% of dry air. Oxygen is about 21%.');
  Q('gs-science', 'The chemical formula of common salt is:', 'NaCl', 'KCl', 'NaOH', 'Na₂CO₃',
    'Common salt is sodium chloride, NaCl. NaOH is caustic soda.');
  Q('gs-science', 'Vitamin D is produced in the skin on exposure to:', 'sunlight', 'water', 'salt', 'darkness',
    'Ultraviolet rays from sunlight help the skin produce vitamin D.');
  Q('gs-science', 'The powerhouse of the cell is:', 'mitochondrion', 'nucleus', 'ribosome', 'chloroplast',
    'Mitochondria release energy from food through respiration. Chloroplasts carry out photosynthesis in plants.');
  Q('gs-science', 'Which blood component helps in clotting?', 'platelets', 'red blood cells', 'white blood cells', 'haemoglobin',
    'Platelets help the blood to clot. Red cells carry oxygen, white cells fight infection.');
  Q('gs-science', 'The organ that produces insulin is:', 'pancreas', 'liver', 'kidney', 'spleen',
    'Insulin is made in the pancreas. The liver makes bile.');
  Q('gs-science', 'Which metal is liquid at ordinary room temperature?', 'mercury', 'iron', 'aluminium', 'copper',
    'Mercury is the metal that is liquid at ordinary room temperature. It melts at about −39 °C.');
  Q('gs-science', 'The ozone layer mainly protects us from:', 'ultraviolet radiation', 'X-rays', 'radio waves', 'microwaves',
    'The ozone layer in the stratosphere absorbs most of the harmful ultraviolet (UV) radiation from the sun.');
  Q('gs-science', 'The disease caused by a deficiency of vitamin C is:', 'scurvy', 'rickets', 'beriberi', 'night blindness',
    'Scurvy is caused by lack of vitamin C. Rickets is linked to vitamin D, beriberi to vitamin B1, night blindness to vitamin A.');
  Q('gs-science', 'The pH of pure water at 25 °C is:', '7', '0', '10', '14',
    'Pure water is neutral, with pH 7. Values below 7 are acidic and above 7 are basic.');
  Q('gs-science', 'Sound travels fastest in:', 'steel', 'air', 'water', 'vacuum',
    'Sound needs a medium to travel and moves fastest in solids such as steel, where particles are closely packed. It cannot travel through a vacuum.');

  // ---- Current events and contemporary issues (static facts) ----
  Q('gs-current', 'The Digital India programme was launched in:', '2015', '2011', '2013', '2017',
    'Digital India was launched on 1 July 2015.');
  Q('gs-current', 'The Swachh Bharat Mission was launched on 2 October in:', '2014', '2012', '2016', '2018',
    'Swachh Bharat Mission was launched on 2 October 2014, on Gandhi Jayanti.');
  Q('gs-current', 'The Ayushman Bharat (PM-JAY) health insurance scheme was launched in:', '2018', '2014', '2016', '2020',
    'PM-JAY was launched in September 2018.');
  Q('gs-current', 'International Yoga Day is observed on:', '21 June', '21 May', '21 July', '21 August',
    'The UN recognised 21 June as International Yoga Day. It was first observed in 2015.');
  Q('gs-current', 'World Environment Day is observed on:', '5 June', '22 April', '22 March', '7 April',
    '22 April is Earth Day, 22 March is World Water Day and 7 April is World Health Day.');
  Q('gs-current', 'The headquarters of the United Nations is in:', 'New York', 'Geneva', 'Paris', 'London',
    'UN headquarters is in New York. Geneva hosts many UN agencies, and Paris hosts UNESCO.');

  // ---- Indian history (elementary) ----
  Q('gs-history', 'Lothal, a famous dockyard of the Indus Valley Civilisation, is in:', 'Gujarat', 'Rajasthan', 'Punjab', 'Haryana',
    'Lothal is in Gujarat. Kalibangan is in Rajasthan.');
  Q('gs-history', 'The Battle of Plassey was fought in:', '1757', '1764', '1761', '1857',
    'Clive defeated Siraj-ud-Daulah at Plassey in 1757. The Battle of Buxar was in 1764.');
  Q('gs-history', 'Who founded the Mauryan Empire?', 'Chandragupta Maurya', 'Ashoka', 'Bindusara', 'Brihadratha',
    'Chandragupta Maurya founded the empire around 321 BCE. Ashoka was his grandson.');
  Q('gs-history', 'The Kalinga War, after which the ruler adopted Dhamma, involved:', 'Ashoka', 'Harsha', 'Akbar', 'Samudragupta',
    'After the Kalinga War, Ashoka adopted Dhamma and issued edicts promoting it.');
  Q('gs-history', 'The Indian National Congress was founded in:', '1885', '1857', '1905', '1920',
    'The Indian National Congress was founded in 1885. The revolt of 1857 was earlier, and the partition of Bengal was in 1905.');
  Q('gs-history', 'The Quit India Movement was launched in:', '1942', '1920', '1930', '1947',
    'The Quit India Movement was launched in August 1942.');
  Q('gs-history', 'The first Battle of Panipat (1526) was fought between Babur and:', 'Ibrahim Lodi', 'Rana Sanga', 'Hemu', 'Sher Shah Suri',
    'Babur defeated Ibrahim Lodi at Panipat in 1526, which marked the beginning of Mughal rule in India.');
  Q('gs-history', 'Who was the first Governor-General of independent India?', 'Lord Mountbatten', 'C. Rajagopalachari', 'Lord Wavell', 'Lord Curzon',
    'Lord Mountbatten served as Governor-General from 1947 to 1948. C. Rajagopalachari succeeded him.');

  // ---- Indian geography (elementary) ----
  Q('gs-geography', 'The highest peak in India is:', 'Kangchenjunga', 'Nanda Devi', 'Kamet', 'Mount Everest',
    'Kangchenjunga (8,586 m) is the highest peak in India. Mount Everest lies outside India, on the Nepal–China border.');
  Q('gs-geography', 'The Tropic of Cancer passes through how many Indian states?', '8', '5', '6', '10',
    'The Tropic of Cancer passes through Gujarat, Rajasthan, Madhya Pradesh, Chhattisgarh, Jharkhand, West Bengal, Tripura and Mizoram.');
  Q('gs-geography', 'Which is the largest desert in India?', 'Thar', 'Deccan', 'Ladakh', 'Kutch',
    'The Thar Desert in Rajasthan is the largest desert in India.');
  Q('gs-geography', 'The Sundarbans is a delta formed by which rivers?', 'Ganga and Brahmaputra', 'Godavari and Krishna', 'Narmada and Tapti', 'Kaveri and Mahanadi',
    'The Sundarbans delta is built by the Ganga and Brahmaputra rivers.');
  Q('gs-geography', 'The largest plateau in India is:', 'Deccan Plateau', 'Malwa Plateau', 'Chota Nagpur Plateau', 'Meghalaya Plateau',
    'The Deccan Plateau is the largest plateau in India.');
  Q('gs-geography', 'The Western Ghats are located along the:', 'west coast', 'east coast', 'northern border', 'central India',
    'The Western Ghats run along the western edge of the Deccan Plateau, parallel to the west coast.');
  Q('gs-geography', 'Indian Standard Time is based on the meridian at:', '82°30′E', '77°30′E', '80°E', '90°E',
    'IST is based on the Standard Meridian of 82°30′E, which is 5 hours 30 minutes ahead of GMT.');
  Q('gs-geography', 'Which river flows westwards through Madhya Pradesh and Gujarat into the Arabian Sea?', 'Narmada', 'Godavari', 'Krishna', 'Kaveri',
    'The Narmada flows west to the Arabian Sea. The Godavari, Krishna and Kaveri flow east into the Bay of Bengal.');

  // ---- Indian polity and Constitution (basics) ----
  Q('gs-polity', 'The Preamble of the Constitution begins with the words:', 'We, the people of India', 'We, the Constitution', 'Government of the people', 'Republic of India',
    'The Preamble begins with “We, the people of India”.');
  Q('gs-polity', 'Fundamental Duties are contained in:', 'Part IV-A (Article 51A)', 'Part III', 'Part IV', 'Part V',
    'Fundamental Duties were added in Part IV-A by the 42nd Amendment, through Article 51A.');
  Q('gs-polity', 'The Right to Education was added as a Fundamental Right under Article:', '21A', '19', '21', '32',
    'Article 21A was added by the 86th Amendment in 2002.');
  Q('gs-polity', 'The Election Commission of India is mentioned in Article:', '324', '280', '368', '370',
    'Article 324 provides for the Election Commission. Article 280 is about the Finance Commission.');
  Q('gs-polity', 'Who presides over a joint sitting of the two Houses of Parliament?', 'Speaker of the Lok Sabha', 'Vice-President', 'President', 'Prime Minister',
    'The Speaker of the Lok Sabha presides over joint sittings of Parliament.');
  Q('gs-polity', 'The 73rd Constitutional Amendment deals with:', 'Panchayati Raj institutions', 'Municipalities', 'Judiciary', 'Elections to Parliament',
    'The 73rd Amendment (1992) gives constitutional status to Panchayati Raj institutions. The 74th deals with urban local bodies.');

  // ---- West Bengal special ----
  Q('gs-wb', 'The highest peak of West Bengal is:', 'Sandakphu', 'Jalpahar', 'Senchal', 'Mirik',
    'Sandakphu (3,636 m) on the Singalila range in Darjeeling district is the highest peak in West Bengal.');
  Q('gs-wb', 'Which district is famous for its tea gardens and the Toy Train?', 'Darjeeling', 'Murshidabad', 'Bankura', 'Purulia',
    'Darjeeling is known for its tea gardens and the Darjeeling Himalayan Railway (Toy Train).');
  Q('gs-wb', 'The Ganga is known by which name in Bangladesh?', 'Padma', 'Meghna', 'Jamuna', 'Brahmaputra',
    'In Bangladesh the Ganga is called the Padma. The Jamuna is the local name for the Brahmaputra.');
  Q('gs-wb', 'Visva-Bharati University was founded by:', 'Rabindranath Tagore', 'Bankim Chandra Chattopadhyay', 'Raja Ram Mohan Roy', 'Swami Vivekananda',
    'Rabindranath Tagore founded Visva-Bharati at Santiniketan in 1921.');
  Q('gs-wb', 'Vande Mataram first appeared in which novel?', 'Anandamath', 'Durgesh Nandini', 'Kapalkundala', 'Bishabriksha',
    'Vande Mataram appeared in Anandamath (1882), written by Bankim Chandra Chattopadhyay.');
  Q('gs-wb', 'The first Indian to win the Nobel Prize in Literature was:', 'Rabindranath Tagore', 'Kazi Nazrul Islam', 'Satyajit Ray', 'Sarat Chandra Chattopadhyay',
    'Tagore won the Nobel Prize in Literature in 1913 for Gitanjali.');
  Q('gs-wb', 'The Partition of Bengal (1905) was announced by which Viceroy?', 'Lord Curzon', 'Lord Minto', 'Lord Dalhousie', 'Lord Wellesley',
    'Lord Curzon announced the partition of Bengal in 1905. It was annulled in 1911.');
  Q('gs-wb', 'Raja Ram Mohan Roy founded which organisation?', 'Brahmo Sabha (later Brahmo Samaj)', 'Arya Samaj', 'Ramakrishna Mission', 'Prarthana Samaj',
    'Raja Ram Mohan Roy founded the Brahmo Sabha in 1828. Arya Samaj was founded by Dayananda Saraswati, and Ramakrishna Mission by Vivekananda.');
  Q('gs-wb', 'The Tebhaga movement (1946–47) was about:', 'sharecroppers’ share of the crop', 'tea garden workers’ wages', 'jute mill workers’ strike', 'salt satyagraha',
    'The Tebhaga movement demanded that sharecroppers (bargadars) get two-thirds of the crop instead of half.');

  // ---- General awareness ----
  Q('gs-ga', 'The national animal of India is:', 'Royal Bengal Tiger', 'Asiatic Lion', 'Indian Elephant', 'Indian Rhinoceros',
    'The Royal Bengal Tiger is the national animal of India.');
  Q('gs-ga', 'The national bird of India is:', 'Indian Peafowl', 'Sparrow', 'Parrot', 'Crow',
    'The Indian Peafowl (peacock) is the national bird.');
  Q('gs-ga', 'The national flower of India is:', 'Lotus', 'Rose', 'Marigold', 'Jasmine',
    'The lotus is the national flower.');
  Q('gs-ga', 'The national song of India is:', 'Vande Mataram', 'Jana Gana Mana', 'Saare Jahan Se Achha', 'Ekla Cholo Re',
    'Vande Mataram is the national song. It was written by Bankim Chandra Chattopadhyay.');
  Q('gs-ga', 'Who composed the national anthem “Jana Gana Mana”?', 'Rabindranath Tagore', 'Bankim Chandra Chattopadhyay', 'Muhammad Iqbal', 'Sarojini Naidu',
    'Tagore composed Jana Gana Mana, which was first sung in 1911.');
  Q('gs-ga', 'The national game of India is:', 'Hockey', 'Cricket', 'Kabaddi', 'Football',
    'Hockey is India’s national game.');
  Q('gs-ga', 'The Bharat Ratna award was first given in:', '1954', '1947', '1950', '1960',
    'The Bharat Ratna was first awarded in 1954.');
  Q('gs-ga', 'The headquarters of the World Health Organization is in:', 'Geneva', 'New York', 'Paris', 'Vienna',
    'WHO is headquartered in Geneva, Switzerland.');
  Q('gs-ga', 'The Reserve Bank of India was established in:', '1935', '1921', '1947', '1950',
    'The Reserve Bank of India was established in 1935, and its head office is in Mumbai.');

  NS.addQuestions('gs', R);
})(typeof window !== 'undefined' ? window : globalThis);
