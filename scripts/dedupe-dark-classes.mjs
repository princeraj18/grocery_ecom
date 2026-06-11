import fs from "fs";
import path from "path";

const roots = process.argv.slice(2);

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fullPath, files);
    else if (/\.(jsx|tsx|js|ts|css)$/.test(entry.name)) files.push(fullPath);
  }
  return files;
}

function dedupeClassString(classString) {
  const parts = classString.split(/\s+/).filter(Boolean);
  const seen = new Set();
  const result = [];
  for (const part of parts) {
    if (seen.has(part)) continue;
    seen.add(part);
    result.push(part);
  }
  return result.join(" ");
}

function processFile(file) {
  let content = fs.readFileSync(file, "utf8");
  const updated = content.replace(/className=(["'`])([\s\S]*?)\1/g, (match, quote, classes) => {
    if (classes.includes("${")) return match;
    return `className=${quote}${dedupeClassString(classes)}${quote}`;
  });

  if (updated !== content) {
    fs.writeFileSync(file, updated);
    console.log(`deduped: ${file}`);
  }
}

for (const root of roots) {
  for (const file of walk(root)) processFile(file);
}
