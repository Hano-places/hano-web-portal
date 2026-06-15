import fs from "node:fs";
import path from "node:path";

const replacements = [
  [/fill-hano- text-hano-/g, "fill-hano-primary-500 text-hano-primary-500"],
  [/fill-hano-/g, "fill-hano-primary-500"],
  [/text-hano-"\}/g, 'text-hano-border"}'],
  [/text-hano- hover/g, "text-hano-muted hover"],
  [/text-hano-"/g, 'text-hano-muted"'],
  [/text-hano-\{/g, "text-hano-muted{"],
  [/text-hano-\}/g, "text-hano-green-300}"],
  [/text-hano-\)/g, "text-hano-muted)"],
  [/bg-hano- px/g, "bg-hano-primary-500 px"],
  [/bg-hano- text-white/g, "bg-hano-green-500 text-white"],
  [/bg-hano-"\}/g, 'bg-hano-surface"}'],
  [/border-hano- p/g, "border-hano-border p"],
  [/border-hano- bg/g, "border-hano-border bg"],
];

function walk(dir) {
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) walk(full);
    else if (/\.tsx?$/.test(entry)) {
      let content = fs.readFileSync(full, "utf8");
      if (!content.includes("hano-\"") && !content.includes("hano-`") && !content.includes("fill-hano- ")) {
        continue;
      }
      for (const [pattern, replacement] of replacements) {
        content = content.replace(pattern, replacement);
      }
      fs.writeFileSync(full, content);
      console.log("fixed:", full);
    }
  }
}

walk(path.join(process.cwd(), "src"));
