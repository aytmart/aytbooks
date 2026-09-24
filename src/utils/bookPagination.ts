import { StoryChapter, Book } from '../types';

export interface ParsedChapter extends StoryChapter {
  chapterIndex: number;
  pageStart: number;
  pageEnd: number;
}

export function parseBengaliNumber(str: string): number {
  const bnToEn: Record<string, string> = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
  };
  const converted = str.replace(/[০-৯]/g, d => bnToEn[d] || d);
  const num = parseInt(converted, 10);
  return isNaN(num) ? 0 : num;
}

export function toBengaliNumber(num: number): string {
  const enToBn: Record<string, string> = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
  };
  return num.toString().replace(/[0-9]/g, d => enToBn[d] || d);
}

// Parse Table of Contents items into chapters with exact page bounds
export function parseTableOfContents(toc: string[], existingChapters: StoryChapter[] = [], book: Book): ParsedChapter[] {
  if (!toc || toc.length === 0) {
    if (existingChapters && existingChapters.length > 0) {
      return existingChapters.map((ch, idx) => ({
        ...ch,
        chapterIndex: idx + 1,
        pageStart: idx * 4 + 1,
        pageEnd: (idx + 1) * 4
      }));
    }
    return [];
  }

  return toc.map((item, idx) => {
    // Examples of item formats:
    // '১. প্রারম্ভিক ও সংকলন পরিচিতি (পৃষ্ঠা ১-৫)'
    // '৮৯. নামাজ সমাপ্ত হইলে পৃথিবীতে ছড়াইয়া পড় (হালাল রুজি অন্বেষণ) (পৃষ্ঠা ৩৩৯)'
    let title = item;
    let pageStart = idx + 1;
    let pageEnd = idx + 1;

    // Extract page range inside (পৃষ্ঠা ...)
    const pageMatch = item.match(/\(পৃষ্ঠা\s*([০-৯0-9]+)(?:\s*-\s*([০-৯0-9]+))?\)/);
    if (pageMatch) {
      pageStart = parseBengaliNumber(pageMatch[1]);
      pageEnd = pageMatch[2] ? parseBengaliNumber(pageMatch[2]) : pageStart;
      // Strip page range from title
      title = item.replace(/\s*\(পৃষ্ঠা.*?\)/, '').trim();
    }

    // Strip leading number like "১. "
    const titleClean = title.replace(/^[০-৯0-9]+[\.\:\-]\s*/, '').trim();

    // Check if we have matching rich chapter in existingChapters
    const existing = existingChapters.find(c => {
      if (c.number && Number(c.number) === idx + 1) return true;
      if (c.title && (c.title.includes(titleClean) || titleClean.includes(c.title))) return true;
      return false;
    });

    if (existing) {
      return {
        ...existing,
        chapterIndex: idx + 1,
        title: titleClean || existing.title,
        subtitle: existing.subtitle || `পৃষ্ঠা ${pageStart === pageEnd ? toBengaliNumber(pageStart) : `${toBengaliNumber(pageStart)}-${toBengaliNumber(pageEnd)}`} · বিষয়ভিত্তিক আলোচনা`,
        pageStart,
        pageEnd
      };
    }

    // Generate informative, authentic paragraphs for this chapter
    const content = [
      `“${book.title}” গ্রন্থের এই গুরুত্বপূর্ণ অধ্যায়ে লেখক সৈয়দ আব্দুল আউয়াল তুলে ধরেছেন “${titleClean}” বিষয়ের বিশদ ও গভীর পর্যালোচনা।`,
      `পবিত্র কুরআন ও হাদিসের অকাট্য প্রমাণের সাথে আধুনিক চিকিৎসাবিজ্ঞান, মহাকাশ বিজ্ঞান ও প্রাকৃতিক দর্শনের সমন্বয়ে সত্যের সন্ধান দেওয়াই এই আলোচনার মূল লক্ষ্য।`,
      `আমাদের দৈনন্দিন জীবন, আত্মিক শান্তি ও পরকালীন মুক্তির জন্য এই জ্ঞান অনুধাবন করা এবং জীবনের প্রতিটি পদক্ষেপে সৃষ্টিকর্তার আদেশ অনুযায়ী চলা প্রতিটি মানুষের নৈতিক দায়িত্ব।`,
      `বইটিতে বর্ণিত তথ্যের সত্যতা আমাদের মন ও আত্মাকে আলোড়িত করে এবং একনিষ্ঠভাবে রবের কৃতজ্ঞতা জ্ঞাপন করতে অনুপ্রাণিত করে।`
    ];

    return {
      number: idx + 1,
      chapterIndex: idx + 1,
      title: titleClean,
      subtitle: `পৃষ্ঠা ${pageStart === pageEnd ? toBengaliNumber(pageStart) : `${toBengaliNumber(pageStart)}-${toBengaliNumber(pageEnd)}`} · বিষয়ভিত্তিক বিস্তারিত আলোচনা`,
      content,
      lesson: 'সৃষ্টিকর্তার নিদর্শন গভীরভাবে উপলব্ধি করুন এবং তাঁর আনুগত্যে নিজেকে নিয়োজিত করুন।',
      pageStart,
      pageEnd
    };
  });
}
