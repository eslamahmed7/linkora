import fs from 'fs';

const pagePreviewPath = 'src/components/PagePreview.tsx';
let content = fs.readFileSync(pagePreviewPath, 'utf8');

if (!content.includes('import { useState }')) {
  content = content.replace(
    "import { usePageBuilderStore } from '@/stores/pageBuilderStore'",
    "import { useState } from 'react'\nimport { usePageBuilderStore } from '@/stores/pageBuilderStore'"
  );
}

if (!content.includes('Monitor, Smartphone, Tablet')) {
  content = content.replace(
    "import { ExternalLink } from 'lucide-react'",
    "import { ExternalLink, Monitor, Smartphone, Tablet } from 'lucide-react'"
  );
}

// Add state to the component
content = content.replace(
  "const { settings, design, links } = page",
  "const { settings, design, links } = page\n  const [viewMode, setViewMode] = useState<'mobile' | 'tablet' | 'desktop'>('mobile')"
);

const oldRender = `
  return (
    <div className="w-full h-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-900/50 p-4">
      {/* Phone Mockup Frame */}
      <div className="relative w-[320px] h-[650px] bg-black rounded-[45px] shadow-xl overflow-hidden border-[8px] border-black">
        {/* Notch */}
        <div className="absolute top-0 inset-x-0 h-6 bg-black z-50 rounded-b-3xl w-40 mx-auto"></div>
        
        {/* Screen Content */}
        <div
          className="w-full h-full overflow-y-auto relative no-scrollbar"
          style={getBackgroundStyle()}
        >
`;

const newRender = `
  return (
    <div className="w-full h-full flex flex-col bg-neutral-100 dark:bg-neutral-900/50">
      {/* Viewport Toggles */}
      <div className="flex items-center justify-center gap-2 p-3 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shrink-0">
        <button
          onClick={() => setViewMode('mobile')}
          className={\`p-2 rounded-lg transition-colors \${viewMode === 'mobile' ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100' : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'}\`}
          title="Mobile View"
        >
          <Smartphone className="w-5 h-5" />
        </button>
        <button
          onClick={() => setViewMode('tablet')}
          className={\`p-2 rounded-lg transition-colors \${viewMode === 'tablet' ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100' : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'}\`}
          title="Tablet View"
        >
          <Tablet className="w-5 h-5" />
        </button>
        <button
          onClick={() => setViewMode('desktop')}
          className={\`p-2 rounded-lg transition-colors \${viewMode === 'desktop' ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100' : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'}\`}
          title="Desktop View"
        >
          <Monitor className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
        {/* Responsive Frame */}
        <div 
          className={\`relative transition-all duration-300 ease-in-out \${
            viewMode === 'mobile' ? 'w-full max-w-[400px] h-[800px] max-h-full rounded-[40px] shadow-2xl border-[12px] border-neutral-900 dark:border-black' :
            viewMode === 'tablet' ? 'w-[768px] h-[1024px] max-h-full max-w-full rounded-[30px] shadow-xl border-[16px] border-neutral-900 dark:border-black' :
            'w-full max-w-[1200px] h-full rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700'
          } overflow-hidden bg-white dark:bg-black\`}
        >
          {/* Mobile Notch (only in mobile view) */}
          {viewMode === 'mobile' && (
            <div className="absolute top-0 inset-x-0 h-6 bg-neutral-900 dark:bg-black z-50 rounded-b-3xl w-40 mx-auto shadow-sm"></div>
          )}
          
          {/* Screen Content */}
          <div
            className="w-full h-full overflow-y-auto relative no-scrollbar"
            style={getBackgroundStyle()}
          >
`;

content = content.replace(oldRender.trim(), newRender.trim());

// Also need to close the tags properly
// The original ended with:
//         </div>
//       </div>
//     </div>
//   )

// Our new structure is:
//     </div> (Screen Content)
//     </div> (Responsive Frame)
//     </div> (flex-1 wrapper)
//     </div> (Outer container)

// So it's 4 closing divs instead of 3. Wait, I'm replacing exactly what was there, so the rest of the file is unchanged.
// Wait, the original had:
//       </div> (Screen Content)
//       </div> (Phone Frame)
//     </div> (w-full h-full outer wrapper)
// Which is 3 closing divs.

// My new render replaces up to `<div className="w-full h-full overflow-y-auto relative no-scrollbar" style={getBackgroundStyle()}>`
// It still leaves the rest of the Screen Content inside.
// At the bottom of `PagePreview.tsx`, we have:
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// Wait! Let's check the bottom of `PagePreview.tsx` to be sure!

fs.writeFileSync(pagePreviewPath, content);
console.log('PagePreview.tsx updated successfully');
