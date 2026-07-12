import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('server', (filePath) => {
  if (filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    
    // Match import { ... } from './path' or '../path'
    content = content.replace(/from\s+['"](\.[^'"]+)['"]/g, (match, p1) => {
      // Don't add .js if it already has .js or .json
      if (p1.endsWith('.js') || p1.endsWith('.json') || p1.endsWith('.ts')) {
        return match;
      }
      changed = true;
      return `from '${p1}.js'`;
    });

    // Match import default from './path'
    content = content.replace(/import\s+(\w+)\s+from\s+['"](\.[^'"]+)['"]/g, (match, p1, p2) => {
      if (p2.endsWith('.js') || p2.endsWith('.json') || p2.endsWith('.ts')) {
        return match;
      }
      changed = true;
      return `import ${p1} from '${p2}.js'`;
    });

    if (changed) {
      fs.writeFileSync(filePath, content);
      console.log(`Updated ${filePath}`);
    }
  }
});
