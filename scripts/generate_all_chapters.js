const fs = require('fs');
const path = require('path');

// Target file
const targetPath = path.join(__dirname, '../src/data/srishtikartaData.ts');

// We have 112 topics corresponding to 414 pages
// Let's create complete and rich content for every single chapter from 1 to 112
const { chaptersData } = require('./all_chapters_content.js');

console.log('Total chapters to write:', chaptersData.length);

const output = `import { StoryChapter } from '../types';

export const SRISHTIKARTA_TABLE_OF_CONTENTS: string[] = [
${chaptersData.map((ch, i) => `  '${i + 1}. ${ch.title} (পৃষ্ঠা ${ch.pages})'`).join(',\n')}
];

export const SRISHTIKARTA_CHAPTERS: StoryChapter[] = [
${chaptersData.map((ch, i) => {
  return `  // অধ্যায় ${i + 1}: ${ch.title} (পৃষ্ঠা ${ch.pages})
  {
    number: ${i + 1},
    title: ${JSON.stringify(ch.title)},
    subtitle: ${JSON.stringify(ch.subtitle || `পৃষ্ঠা ${ch.pages} · বিষয়ভিত্তিক আলোচনা ও নির্যাস`)},
    content: [
${ch.content.map(p => `      ${JSON.stringify(p)}`).join(',\n')}
    ],
${ch.quranVerse ? `    quranVerse: ${JSON.stringify(ch.quranVerse)},\n` : ''}    lesson: ${JSON.stringify(ch.lesson || 'আল্লাহর দেওয়া প্রতিটি নিয়ামতের জন্য শুকরিয়া আদায় করা এবং সঠিক পথে জীবন পরিচালনা করাই প্রকৃত জ্ঞানীর কাজ।')}
  }`;
}).join(',\n\n')}
];
`;

fs.writeFileSync(targetPath, output, 'utf8');
console.log('Successfully wrote src/data/srishtikartaData.ts with all 112 chapters!');
