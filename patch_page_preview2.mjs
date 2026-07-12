import fs from 'fs';

const pagePreviewPath = 'src/components/PagePreview.tsx';
let content = fs.readFileSync(pagePreviewPath, 'utf8');

content = content.replace(
  "    </div>\n  )\n}",
  "      </div>\n    </div>\n  )\n}"
);

fs.writeFileSync(pagePreviewPath, content);
console.log('PagePreview.tsx updated successfully WITH closing tag');
