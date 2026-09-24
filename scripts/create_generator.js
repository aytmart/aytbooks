const fs = require('fs');
const path = require('path');

// We have the detailed chapter outlines and contents for all 112 chapters
// Let's create the script that builds the comprehensive srishtikartaData.ts
const scriptContent = `
const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '../src/data/srishtikartaData.ts');

// Read existing chapters 1 to 22 from current file
const oldFile = fs.readFileSync(targetFile, 'utf8');

// Build the full 112 dataset
const { generateAll112Chapters } = require('./build_112_chapters.js');
const allChapters = generateAll112Chapters();

console.log('Generated total chapters:', allChapters.length);

const tocLines = allChapters.map((ch, idx) => {
  return "  '" + (idx + 1) + ". " + ch.title + " (পৃষ্ঠা " + ch.pages + ")'";
}).join(',\\n');

const chapterLines = allChapters.map((ch, idx) => {
  return "  // অধ্যায় " + (idx + 1) + ": " + ch.title + " (পৃষ্ঠা " + ch.pages + ")\\n" +
  "  {\\n" +
  "    number: " + (idx + 1) + ",\\n" +
  "    title: " + JSON.stringify(ch.title) + ",\\n" +
  "    subtitle: " + JSON.stringify(ch.subtitle || ('পৃষ্ঠা ' + ch.pages + ' · বিষয়ভিত্তিক আলোচনা ও নির্যাস')) + ",\\n" +
  "    content: [\\n" +
  ch.content.map(p => "      " + JSON.stringify(p)).join(',\\n') + "\\n" +
  "    ],\\n" +
  (ch.quranVerse ? "    quranVerse: " + JSON.stringify(ch.quranVerse) + ",\\n" : "") +
  "    lesson: " + JSON.stringify(ch.lesson || 'আল্লাহর দেওয়া প্রতিটি নিয়ামতের জন্য শুকরিয়া আদায় করা এবং সঠিক পথে জীবন পরিচালনা করাই প্রকৃত জ্ঞানীর কাজ।') + "\\n" +
  "  }";
}).join(',\\n\\n');

const fileData = "import { StoryChapter } from '../types';\\n\\n" +
"export const SRISHTIKARTA_TABLE_OF_CONTENTS: string[] = [\\n" +
tocLines + "\\n" +
"];\\n\\n" +
"export const SRISHTIKARTA_CHAPTERS: StoryChapter[] = [\\n" +
chapterLines + "\\n" +
"];\\n";

fs.writeFileSync(targetFile, fileData, 'utf8');
console.log('Successfully wrote', targetFile);
`;

fs.writeFileSync(path.join(__dirname, 'run_build_112.js'), scriptContent, 'utf8');
console.log('Runner script created.');
