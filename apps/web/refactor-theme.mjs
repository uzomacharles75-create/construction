import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else {
      if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        results.push(filePath);
      }
    }
  });
  return results;
}

const files = walk('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Backgrounds
  content = content.replace(/bg-brand-navy-card/g, 'bg-card');
  content = content.replace(/bg-brand-navy-light/g, 'bg-muted');
  content = content.replace(/bg-brand-navy/g, 'bg-background');

  // Text colors
  // Replace text-white unless it's explicitly needed (e.g., inside a colored badge).
  // This is tricky, but let's replace text-white with text-foreground, 
  // text-white/50 with text-muted-foreground, etc.
  content = content.replace(/text-white\/50/g, 'text-muted-foreground');
  content = content.replace(/text-white\/70/g, 'text-foreground/70');
  content = content.replace(/text-white\/25/g, 'text-muted-foreground/50');
  content = content.replace(/text-white\/80/g, 'text-foreground/80');
  content = content.replace(/text-white/g, 'text-foreground');
  
  // Also handle text-brand-white if it exists
  content = content.replace(/text-brand-white/g, 'text-foreground');

  // Borders
  content = content.replace(/border-brand-border/g, 'border-border');

  // Yellow to Primary
  content = content.replace(/bg-brand-yellow-pale/g, 'bg-primary-pale');
  content = content.replace(/bg-brand-yellow-dim/g, 'bg-primary-dim');
  content = content.replace(/bg-brand-yellow/g, 'bg-primary');
  content = content.replace(/text-brand-yellow/g, 'text-primary');
  content = content.replace(/ring-brand-yellow/g, 'ring-primary');
  content = content.replace(/border-brand-yellow/g, 'border-primary');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});

console.log("Refactoring complete.");
