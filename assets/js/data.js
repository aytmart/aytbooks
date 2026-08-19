/* =========================================================================
   AYT Books — বই ও ক্যাটাগরি ডাটা
   =========================================================================
   নতুন বই যোগ করতে চাইলে নিচের BOOKS অ্যারেতে একটি নতুন অবজেক্ট যোগ করুন।
   নতুন ক্যাটাগরি যোগ করতে CATEGORIES অ্যারেতে একটি নতুন অবজেক্ট যোগ করুন,
   তারপর বইয়ের "category" ফিল্ডে সেই ক্যাটাগরির id ব্যবহার করুন।

   ধাপে ধাপে নির্দেশনা README.md ফাইলে বাংলা ও ইংরেজি দুই ভাষায় দেওয়া আছে।
   ========================================================================= */

const CATEGORIES = [
  {
    id: "islamic",
    label: "ইসলামিক বই",
    labelEn: "Islamic",
    icon: "🕌",
    desc: "কুরআন, হাদিস, আকিদা ও ইসলামি জীবনদর্শন বিষয়ক বই"
  },
  {
    id: "novel",
    label: "উপন্যাস",
    labelEn: "Novel",
    icon: "📖",
    desc: "বাংলা ও অনুবাদ উপন্যাস সংগ্রহ"
  },
  {
    id: "science",
    label: "বিজ্ঞান",
    labelEn: "Science",
    icon: "🔬",
    desc: "বিজ্ঞান, মহাকাশ ও প্রযুক্তি বিষয়ক বই"
  },
  {
    id: "poetry",
    label: "কবিতা ও সাহিত্য",
    labelEn: "Poetry",
    icon: "🖋️",
    desc: "কবিতা, ছড়া ও সাহিত্য সংকলন"
  },
  {
    id: "self-help",
    label: "শিক্ষামূলক বই",
    labelEn: "Educational / Self Help",
    icon: "🎓",
    desc: "আত্ম-উন্নয়ন, দক্ষতা ও শিক্ষামূলক বই"
  },
  {
    id: "kids",
    label: "শিশু-কিশোর বই",
    labelEn: "Kids",
    icon: "🧒",
    desc: "শিশু-কিশোরদের জন্য গল্প ও শিক্ষামূলক বই"
  },
  {
    id: "life",
    label: "জীবন ঘনিষ্ঠ বই",
    labelEn: "Life",
    icon: "💗",
    desc: "পারিবারিক জীবন, মানসিক প্রশান্তি ও জীবনধারা বিষয়ক বই"
  },
  {
    id: "history",
    label: "ইতিহাস",
    labelEn: "History",
    icon: "🏛️",
    desc: "ইতিহাস ও ঐতিহ্য বিষয়ক বই"
  }
];

const BOOKS = [
  {
    id: "srishtikarta-ke",
    title: "সৃষ্টিকর্তা কে?",
    titleEn: "Who Is Creator?",
    author: "সংকলনে: সৈয়দ আব্দুল আওয়াল",
    editor: "সম্পাদনা: মাওলানা কাজী ফজলুল করিম",
    publisher: "দ্বীনের দাওয়াত প্রকাশনী",
    category: "islamic",
    language: "বাংলা",
    pages: 191,
    isbn: "984-32-0416-0",
    edition: "তৃতীয় সংস্করণ — ইসলামী বইমেলা ২০২২",
    price: 450,
    currency: "৳",
    coverColor: "#0f3d3e",
    coverAccent: "#c9a227",
    description:
      "মহাকাশ এবং মানুষসহ পৃথিবীর যাবতীয় সৃষ্টবস্তু কবে, কীভাবে, কেন সৃষ্টি হয়েছে? বিশ্বজগৎ কে সৃষ্টি করেছেন? কে পরিচালনা করেন? মানুষের দেহ ও রুহ কীভাবে সৃষ্টি হয়েছে? ইহকাল-পরকালে মানব জীবনের করণীয় কাজ কী? কম্পিউটার, স্যাটেলাইট, ইন্টারনেট, মোবাইল ফোন থেকে শুরু করে মহাকাশ পর্যন্ত সৃষ্টির সকল বিষয়াবলীর ধারণা ও সুস্থ-সুন্দরভাবে জীবন পরিচালনার জন্য গুরুত্বপূর্ণ তথ্য সম্বলিত একটি জীবনের গাইড।",
    tags: ["ইসলাম", "সৃষ্টিতত্ত্ব", "আকিদা", "কুরআন"],
    pdf: "assets/pdfs/srishtikarta-ke.pdf",
    cover: "",
    featured: true
  },
  {
    id: "sheshbarer-moto",
    title: "শেষবারের মতো",
    titleEn: "Sheshbarer Moto",
    author: "AYT Books",
    editor: "",
    publisher: "AYT Books",
    category: "islamic",
    language: "বাংলা",
    pages: 26,
    isbn: "",
    edition: "প্রথম সংস্করণ",
    price: 150,
    currency: "৳",
    coverColor: "#0f3d3e",
    coverAccent: "#c9a227",
    description:
      "১০টি হৃদয়ছোঁয়া ইসলামিক গল্পের সংকলন — মৃত্যু, অনুশোচনা আর ফিরে না আসা মুহূর্তগুলো নিয়ে। কিছু মানুষকে হারানোর আগে আমরা তাদের মূল্য বুঝি না — এই সত্যকে ঘিরে সাজানো ছোট ছোট গল্প, যা মনে করিয়ে দেয় প্রিয়জনের সাথে কাটানো প্রতিটি মুহূর্তের মূল্য।",
    tags: ["ইসলাম", "মৃত্যু", "উপদেশ", "ছোটগল্প"],
    pdf: "assets/pdfs/sheshbarer-moto.pdf",
    cover: "",
    featured: true
  },
  {
    id: "somoy-mrittu-o-jiboner-ayna",
    title: "সময়, মৃত্যু ও জীবনের আয়না",
    titleEn: "Somoy, Mrittu O Jiboner Ayna",
    author: "AYT Books",
    editor: "",
    publisher: "AYT Books",
    category: "islamic",
    language: "বাংলা",
    pages: 28,
    isbn: "",
    edition: "প্রথম সংস্করণ",
    price: 150,
    currency: "৳",
    coverColor: "#0f3d3e",
    coverAccent: "#c9a227",
    description:
      "১০টি হৃদয়ছোঁয়া ইসলামিক গল্পের সংকলন, যেখানে সময়, মৃত্যু আর জীবনের ক্ষণস্থায়ীত্ব নিয়ে ভাবতে বাধ্য করে এমন কিছু গল্প বলা হয়েছে। প্রতিটি গল্প পাঠককে থামিয়ে নিজের জীবনের দিকে তাকাতে শেখায় — আজকের কাজ কালকের জন্য ফেলে না রাখার শিক্ষা দেয়।",
    tags: ["ইসলাম", "মৃত্যু", "জীবনদর্শন", "ছোটগল্প"],
    pdf: "assets/pdfs/somoy-mrittu-o-jiboner-ayna.pdf",
    cover: "",
    featured: true
  },
  {
    id: "duniyar-pichhone-chhute-shanti-harano",
    title: "দুনিয়ার পেছনে ছুটে শান্তি হারানো",
    titleEn: "Duniyar Pichhone Chhute Shanti Harano",
    author: "AYT Books",
    editor: "",
    publisher: "AYT Books",
    category: "islamic",
    language: "বাংলা",
    pages: 21,
    isbn: "",
    edition: "প্রথম সংস্করণ",
    price: 150,
    currency: "৳",
    coverColor: "#0f3d3e",
    coverAccent: "#c9a227",
    description:
      "১০টি হৃদয়ছোঁয়া ইসলামিক গল্প — টাকা, সাফল্য আর ব্যস্ততার পেছনে ছুটতে ছুটতে হারিয়ে যাওয়া মানসিক শান্তি নিয়ে। প্রতিটি গল্প মনে করিয়ে দেয়, দুনিয়ার সবকিছু পাওয়ার পরও আল্লাহর স্মরণ ছাড়া অন্তরের অস্থিরতা কখনো ঘোচে না।",
    tags: ["ইসলাম", "শান্তি", "জীবনদর্শন", "ছোটগল্প"],
    pdf: "assets/pdfs/duniyar-pichhone-chhute-shanti-harano.pdf",
    cover: "",
    featured: true
  },
  {
    id: "byoystotar-arale-harano-shanti",
    title: "দুনিয়ার ব্যস্ততার আড়ালে হারিয়ে যাওয়া শান্তি",
    titleEn: "Byostotar Arale Harano Shanti",
    author: "AYT Books",
    editor: "",
    publisher: "AYT Books",
    category: "islamic",
    language: "বাংলা",
    pages: 18,
    isbn: "",
    edition: "প্রথম সংস্করণ",
    price: 150,
    currency: "৳",
    coverColor: "#0f3d3e",
    coverAccent: "#c9a227",
    description:
      "১০টি হৃদয়ছোঁয়া ইসলামিক গল্পের সংকলন, যেখানে বড় বাড়ি, বেশি আয়, ব্যস্ত ক্যারিয়ারের পেছনে ছুটতে গিয়ে হারিয়ে যাওয়া প্রকৃত শান্তির খোঁজ করা হয়েছে। প্রতিটি গল্প শেখায় — দুনিয়া বদলালেই শান্তি আসে না, শান্তির শুরু হয় নিজের ভেতরটাকে আল্লাহর দিকে ফিরিয়ে দেওয়া থেকে।",
    tags: ["ইসলাম", "শান্তি", "জীবনদর্শন", "ছোটগল্প"],
    pdf: "assets/pdfs/byoystotar-arale-harano-shanti.pdf",
    cover: "",
    featured: true
  }
];
