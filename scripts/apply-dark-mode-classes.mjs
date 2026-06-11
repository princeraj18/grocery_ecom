import fs from "fs";
import path from "path";

const replacements = [
  [/\bbg-white\b(?! dark:)/g, "bg-white dark:bg-slate-900"],
  [/\bbg-gray-50\b(?!\/| dark:)/g, "bg-gray-50 dark:bg-slate-900"],
  [/\bbg-gray-100\b(?! dark:)/g, "bg-gray-100 dark:bg-slate-950"],
  [/\bbg-slate-50\b(?! dark:)/g, "bg-slate-50 dark:bg-slate-900"],
  [/\bbg-gray-200\b(?! dark:)/g, "bg-gray-200 dark:bg-slate-800"],
  [/\btext-slate-900\b(?! dark:)/g, "text-slate-900 dark:text-white"],
  [/\btext-slate-800\b(?! dark:)/g, "text-slate-800 dark:text-slate-100"],
  [/\btext-gray-900\b(?! dark:)/g, "text-gray-900 dark:text-white"],
  [/\btext-gray-800\b(?! dark:)/g, "text-gray-800 dark:text-slate-100"],
  [/\btext-gray-700\b(?! dark:)/g, "text-gray-700 dark:text-slate-300"],
  [/\btext-gray-600\b(?! dark:)/g, "text-gray-600 dark:text-slate-400"],
  [/\btext-gray-500\b(?! dark:)/g, "text-gray-500 dark:text-slate-400"],
  [/\btext-gray-400\b(?! dark:)/g, "text-gray-400 dark:text-slate-500"],
  [/\btext-slate-700\b(?! dark:)/g, "text-slate-700 dark:text-slate-300"],
  [/\btext-slate-600\b(?! dark:)/g, "text-slate-600 dark:text-slate-400"],
  [/\btext-slate-500\b(?! dark:)/g, "text-slate-500 dark:text-slate-400"],
  [/\bborder-gray-200\b(?! dark:)/g, "border-gray-200 dark:border-slate-800"],
  [/\bborder-gray-300\b(?! dark:)/g, "border-gray-300 dark:border-slate-700"],
  [/\bborder-slate-200\b(?! dark:)/g, "border-slate-200 dark:border-slate-800"],
  [/\bborder-slate-100\b(?! dark:)/g, "border-slate-100 dark:border-slate-800"],
  [/\bhover:bg-gray-100\b(?! dark:)/g, "hover:bg-gray-100 dark:hover:bg-slate-800"],
  [/\bhover:bg-slate-50\b(?! dark:)/g, "hover:bg-slate-50 dark:hover:bg-slate-800"],
  [/\bhover:bg-gray-50\b(?! dark:)/g, "hover:bg-gray-50 dark:hover:bg-slate-800"],
  [/\bhover:text-gray-900\b(?! dark:)/g, "hover:text-gray-900 dark:hover:text-white"],
  [/\bhover:text-slate-900\b(?! dark:)/g, "hover:text-slate-900 dark:hover:text-white"],
  [/\bbg-\[#f6f7f1\]\b/g, "bg-[#f6f7f1] dark:bg-slate-950"],
];

const targetDirs = process.argv.slice(2);

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else if (/\.(jsx|tsx|js|ts)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

function shouldSkip(filePath) {
  return /ThemeToggle|theme\.js|apply-dark-mode-classes/.test(filePath);
}

let changedFiles = 0;

for (const dir of targetDirs) {
  const files = walk(dir);
  for (const file of files) {
    if (shouldSkip(file)) continue;
    const original = fs.readFileSync(file, "utf8");
    let updated = original;
    for (const [pattern, replacement] of replacements) {
      updated = updated.replace(pattern, replacement);
    }
    if (updated !== original) {
      fs.writeFileSync(file, updated);
      changedFiles += 1;
      console.log(`updated: ${file}`);
    }
  }
}

console.log(`Done. Updated ${changedFiles} files.`);
