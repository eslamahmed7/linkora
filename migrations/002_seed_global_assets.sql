-- ═══════════════════════════════════════════════════════════════════════════
-- 002_seed_global_assets.sql
-- Seeds all hardcoded assets from the codebase into the centralized library
-- Run AFTER 002_global_asset_engine.sql
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── NFC CARD PATTERNS (from nfcCardDesignSystem.tsx) ──────────────────

INSERT INTO assets (name, slug, asset_type, category, subcategory, data, tags, supported_modules, version) VALUES
('Hex Grid', 'nfc-hex-grid', 'pattern', 'nfc', 'geometric', '{"key":"hex-grid","component":"HexGrid","preview":"dots"}', ARRAY['nfc','premium'], ARRAY['nfc_cards','business_cards'], '1.0.0'),
('Circuit Board', 'nfc-circuit-board', 'pattern', 'nfc', 'tech', '{"key":"circuit-board","component":"CircuitBoard","preview":"lines"}', ARRAY['nfc','tech'], ARRAY['nfc_cards','business_cards'], '1.0.0'),
('Network Nodes', 'nfc-network-nodes', 'pattern', 'nfc', 'tech', '{"key":"network-nodes","component":"NetworkNodes","preview":"nodes"}', ARRAY['nfc','tech'], ARRAY['nfc_cards','business_cards'], '1.0.0'),
('Dot Matrix', 'nfc-dot-matrix', 'pattern', 'nfc', 'minimal', '{"key":"dot-matrix","component":"DotMatrix","preview":"dots"}', ARRAY['nfc','minimal'], ARRAY['nfc_cards','business_cards'], '1.0.0'),
('Constellation', 'nfc-constellation', 'pattern', 'nfc', 'celestial', '{"key":"constellation","component":"Constellation","preview":"stars"}', ARRAY['nfc','celestial'], ARRAY['nfc_cards','business_cards'], '1.0.0'),
('Topo Lines', 'nfc-topo-lines', 'pattern', 'nfc', 'nature', '{"key":"topo-lines","component":"TopoLines","preview":"contour"}', ARRAY['nfc','nature','topographic'], ARRAY['nfc_cards','business_cards'], '1.0.0'),
('Diagonal Lines', 'nfc-diagonal-lines', 'pattern', 'nfc', 'geometric', '{"key":"diagonal-lines","component":"DiagonalLines","preview":"lines"}', ARRAY['nfc','geometric','minimal'], ARRAY['nfc_cards','business_cards'], '1.0.0'),
('Wave Lines', 'nfc-wave-lines', 'pattern', 'nfc', 'organic', '{"key":"wave-lines","component":"WaveLines","preview":"waves"}', ARRAY['nfc','organic','flow'], ARRAY['nfc_cards','business_cards'], '1.0.0'),
('Diamond Lattice', 'nfc-diamond-lattice', 'pattern', 'nfc', 'geometric', '{"key":"diamond-lattice","component":"DiamondLattice","preview":"lattice"}', ARRAY['nfc','geometric','luxury'], ARRAY['nfc_cards','business_cards'], '1.0.0'),
('Tech Icons', 'nfc-tech-icons', 'pattern', 'nfc', 'tech', '{"key":"tech-icons","component":"TechIcons","preview":"icons"}', ARRAY['nfc','tech','icons'], ARRAY['nfc_cards','business_cards'], '1.0.0'),
('Parametric Curves', 'nfc-parametric-curves', 'pattern', 'nfc', 'artistic', '{"key":"parametric-curves","component":"ParametricCurves","preview":"curves"}', ARRAY['nfc','artistic','mathematical'], ARRAY['nfc_cards','business_cards'], '1.0.0'),
('Polygon Mesh', 'nfc-polygon-mesh', 'pattern', 'nfc', 'geometric', '{"key":"polygon-mesh","component":"PolygonMesh","preview":"mesh"}', ARRAY['nfc','geometric','3d'], ARRAY['nfc_cards','business_cards'], '1.0.0'),
('Noise SVG', 'nfc-noise', 'pattern', 'nfc', 'texture', '{"key":"noise","component":"NoiseSVG","preview":"noise"}', ARRAY['nfc','texture','grain'], ARRAY['nfc_cards','business_cards'], '1.0.0');

-- ─── NFC TEXTURES (from nfcCardDesignSystem.tsx) ───────────────────────

INSERT INTO assets (name, slug, asset_type, category, subcategory, data, tags, supported_modules, version) VALUES
('Carbon Fiber', 'texture-carbon-fiber', 'texture', 'nfc', 'premium', '{"key":"carbonFiber","css":"repeating-linear-gradient(45deg,rgba(20,20,20,0.3) 0px,rgba(20,20,20,0.3) 1px,transparent 1px,transparent 3px),repeating-linear-gradient(-45deg,rgba(20,20,20,0.3) 0px,rgba(20,20,20,0.3) 1px,transparent 1px,transparent 3px)"}', ARRAY['texture','premium','carbon','dark'], ARRAY['nfc_cards','business_cards','link_pages'], '1.0.0'),
('Brushed Aluminum', 'texture-brushed-aluminum', 'texture', 'nfc', 'premium', '{"key":"brushedAluminum","css":"repeating-linear-gradient(90deg,rgba(255,255,255,0.05) 0px,transparent 1px,transparent 3px),repeating-linear-gradient(90deg,rgba(0,0,0,0.05) 0px,transparent 1px,transparent 5px)"}', ARRAY['texture','premium','metal','silver'], ARRAY['nfc_cards','business_cards','link_pages'], '1.0.0'),
('Titanium', 'texture-titanium', 'texture', 'nfc', 'premium', '{"key":"titanium","css":"linear-gradient(135deg,rgba(255,255,255,0.03) 0%,rgba(255,255,255,0.01) 50%,rgba(0,0,0,0.05) 100%)"}', ARRAY['texture','premium','metal','dark'], ARRAY['nfc_cards','business_cards','link_pages'], '1.0.0'),
('Matte Black', 'texture-matte-black', 'texture', 'nfc', 'minimal', '{"key":"matteBlack","css":"radial-gradient(ellipse at 50% 0%,rgba(40,40,40,1) 0%,rgba(15,15,15,1) 100%)"}', ARRAY['texture','minimal','dark','matte'], ARRAY['nfc_cards','business_cards','link_pages'], '1.0.0'),
('Leather Grain', 'texture-leather', 'texture', 'nfc', 'premium', '{"key":"leatherGrain","css":"repeating-linear-gradient(45deg,rgba(0,0,0,0.05) 0px,rgba(0,0,0,0.05) 1px,transparent 1px,transparent 2px)"}', ARRAY['texture','premium','leather','organic'], ARRAY['nfc_cards','business_cards'], '1.0.0'),
('Marble', 'texture-marble', 'texture', 'nfc', 'luxury', '{"key":"marble","css":"radial-gradient(ellipse at 20% 50%,rgba(255,255,255,0.08) 0%,transparent 50%),radial-gradient(ellipse at 80% 20%,rgba(255,255,255,0.05) 0%,transparent 40%)"}', ARRAY['texture','luxury','marble','stone'], ARRAY['nfc_cards','business_cards','link_pages'], '1.0.0'),
('Stitching', 'texture-stitching', 'texture', 'nfc', 'detail', '{"key":"stitching","css":"repeating-linear-gradient(0deg,transparent 0px,transparent 4px,rgba(255,255,255,0.1) 4px,rgba(255,255,255,0.1) 5px)"}', ARRAY['texture','detail','stitch','fabric'], ARRAY['nfc_cards','business_cards'], '1.0.0'),
('Graphite', 'texture-graphite', 'texture', 'nfc', 'dark', '{"key":"graphite","css":"linear-gradient(135deg,rgba(30,30,30,1) 0%,rgba(50,50,50,1) 50%,rgba(35,35,35,1) 100%)"}', ARRAY['texture','dark','graphite','mineral'], ARRAY['nfc_cards','business_cards','link_pages'], '1.0.0'),
('Soft Fabric', 'texture-soft-fabric', 'texture', 'nfc', 'organic', '{"key":"softFabric","css":"repeating-linear-gradient(0deg,rgba(255,255,255,0.02) 0px,transparent 1px,transparent 2px),repeating-linear-gradient(90deg,rgba(255,255,255,0.02) 0px,transparent 1px,transparent 2px)"}', ARRAY['texture','organic','fabric','soft'], ARRAY['nfc_cards','business_cards'], '1.0.0'),
('Metallic', 'texture-metallic', 'texture', 'nfc', 'premium', '{"key":"metallic","css":"linear-gradient(180deg,rgba(255,255,255,0.12) 0%,rgba(255,255,255,0.02) 50%,rgba(0,0,0,0.08) 100%)"}', ARRAY['texture','premium','metal','shiny'], ARRAY['nfc_cards','business_cards','link_pages'], '1.0.0');

-- ─── QR FRAMES (from nfcCardDesignSystem.tsx) ─────────────────────────

INSERT INTO assets (name, slug, asset_type, category, subcategory, data, tags, supported_modules, version) VALUES
('Gold Brackets', 'qr-frame-gold-brackets', 'qr_frame', 'qr', 'luxury', '{"key":"gold-brackets","component":"QrGoldBrackets","defaultColor":"#c9a84c"}', ARRAY['qr','luxury','gold'], ARRAY['qr_designer','nfc_cards','business_cards'], '1.0.0'),
('Silver Frame', 'qr-frame-silver', 'qr_frame', 'qr', 'premium', '{"key":"silver-frame","component":"QrSilverFrame","defaultColor":"#a0a0a8"}', ARRAY['qr','premium','silver'], ARRAY['qr_designer','nfc_cards','business_cards'], '1.0.0'),
('Cyber Frame', 'qr-frame-cyber', 'qr_frame', 'qr', 'tech', '{"key":"cyber-frame","component":"QrCyberFrame","defaultColor":"#00c8ff"}', ARRAY['qr','tech','cyber','neon'], ARRAY['qr_designer','nfc_cards','business_cards'], '1.0.0'),
('Frosted Frame', 'qr-frame-frosted', 'qr_frame', 'qr', 'minimal', '{"key":"frosted-frame","component":"QrFrostedFrame","defaultColor":"rgba(255,255,255,0.2)"}', ARRAY['qr','minimal','glass','frosted'], ARRAY['qr_designer','nfc_cards','business_cards'], '1.0.0'),
('Minimal Dark', 'qr-frame-minimal-dark', 'qr_frame', 'qr', 'minimal', '{"key":"minimal-dark","component":"QrMinimalDark","defaultColor":"rgba(255,255,255,0.08)"}', ARRAY['qr','minimal','dark'], ARRAY['qr_designer','nfc_cards','business_cards'], '1.0.0'),
('Purple Glow', 'qr-frame-purple-glow', 'qr_frame', 'qr', 'neon', '{"key":"purple-glow","component":"QrPurpleGlow","defaultColor":"#9b72cf"}', ARRAY['qr','neon','purple','glow'], ARRAY['qr_designer','nfc_cards','business_cards'], '1.0.0');

-- ─── NFC TEMPLATES (from nfcCardTemplates.tsx) ────────────────────────

INSERT INTO assets (name, slug, asset_type, category, subcategory, data, tags, supported_modules, version) VALUES
('Start from Scratch', 'template-blank-custom', 'component', 'nfc', 'template', '{"templateId":"blank-custom","bgType":"solid","bgValue":"#1A1A1A"}', ARRAY['nfc','template','blank'], ARRAY['nfc_cards'], '1.0.0'),
('Diamond Edition', 'template-diamond-edition', 'component', 'nfc', 'template', '{"templateId":"diamond-edition","bgType":"gradient","bgValue":"linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)"}', ARRAY['nfc','template','premium','diamond'], ARRAY['nfc_cards'], '1.0.0'),
('Premium Silver Edition', 'template-silver-swoosh', 'component', 'nfc', 'template', '{"templateId":"silver-swoosh","bgType":"gradient","bgValue":"linear-gradient(135deg,#2c3e50,#34495e,#2c3e50)"}', ARRAY['nfc','template','premium','silver'], ARRAY['nfc_cards'], '1.0.0'),
('Matte Black Edition', 'template-matte-pattern', 'component', 'nfc', 'template', '{"templateId":"matte-pattern","bgType":"image","bgValue":"url(matte-pattern)"}', ARRAY['nfc','template','matte','dark'], ARRAY['nfc_cards'], '1.0.0'),
('Luxury Dark Carbon', 'template-geometric-gold', 'component', 'nfc', 'template', '{"templateId":"geometric-gold","bgType":"solid","bgValue":"#050505"}', ARRAY['nfc','template','luxury','carbon','gold'], ARRAY['nfc_cards'], '1.0.0'),
('Stealth Black Edition', 'template-minimal-black', 'component', 'nfc', 'template', '{"templateId":"minimal-black","bgType":"gradient","bgValue":"linear-gradient(180deg,#0a0a0a,#1a1a1a)"}', ARRAY['nfc','template','stealth','minimal','dark'], ARRAY['nfc_cards'], '1.0.0'),
('Minimal White Edition', 'template-minimal-white', 'component', 'nfc', 'template', '{"templateId":"minimal-white","bgType":"image","bgValue":"url(minimal-white)"}', ARRAY['nfc','template','minimal','white','clean'], ARRAY['nfc_cards'], '1.0.0');

-- ─── SVG PATTERNS (from CardCanvasEditor.tsx) ─────────────────────────

INSERT INTO assets (name, slug, asset_type, category, subcategory, data, tags, supported_modules, version) VALUES
('None (No Pattern)', 'pattern-none', 'pattern', 'general', 'basic', '{"key":"none"}', ARRAY['basic','none'], ARRAY['nfc_cards','link_pages','qr_designer'], '1.0.0'),
('Dots', 'pattern-dots', 'pattern', 'general', 'geometric', '{"key":"dots"}', ARRAY['dots','geometric','minimal'], ARRAY['nfc_cards','link_pages','qr_designer'], '1.0.0'),
('Organic Waves', 'pattern-organic-waves', 'pattern', 'general', 'organic', '{"key":"organic-waves"}', ARRAY['waves','organic','flow'], ARRAY['nfc_cards','link_pages','qr_designer'], '1.0.0'),
('Double Waves', 'pattern-double-waves', 'pattern', 'general', 'organic', '{"key":"double-waves"}', ARRAY['waves','organic','double'], ARRAY['nfc_cards','link_pages','qr_designer'], '1.0.0'),
('Zigzag', 'pattern-zigzag', 'pattern', 'general', 'geometric', '{"key":"zigzag"}', ARRAY['zigzag','geometric','angular'], ARRAY['nfc_cards','link_pages','qr_designer'], '1.0.0'),
('Fluid Blobs', 'pattern-fluid-blobs', 'pattern', 'general', 'organic', '{"key":"fluid-blobs"}', ARRAY['blobs','organic','fluid'], ARRAY['nfc_cards','link_pages','qr_designer'], '1.0.0'),
('Diamonds', 'pattern-diamonds', 'pattern', 'general', 'geometric', '{"key":"diamonds"}', ARRAY['diamonds','geometric','luxury'], ARRAY['nfc_cards','link_pages','qr_designer'], '1.0.0'),
('Concentric', 'pattern-concentric', 'pattern', 'general', 'geometric', '{"key":"concentric"}', ARRAY['concentric','circles','geometric'], ARRAY['nfc_cards','link_pages','qr_designer'], '1.0.0'),
('Geo Triangles', 'pattern-geo-triangles', 'pattern', 'general', 'geometric', '{"key":"geo-triangles"}', ARRAY['triangles','geometric','angular'], ARRAY['nfc_cards','link_pages','qr_designer'], '1.0.0'),
('Stars Scatter', 'pattern-stars-scatter', 'pattern', 'general', 'celestial', '{"key":"stars-scatter"}', ARRAY['stars','celestial','scattered'], ARRAY['nfc_cards','link_pages','qr_designer'], '1.0.0'),
('Clouds Scatter', 'pattern-clouds-scatter', 'pattern', 'general', 'nature', '{"key":"clouds-scatter"}', ARRAY['clouds','nature','scattered'], ARRAY['nfc_cards','link_pages','qr_designer'], '1.0.0'),
('Nature Mix', 'pattern-nature-mix', 'pattern', 'general', 'nature', '{"key":"nature-mix"}', ARRAY['nature','mix','organic'], ARRAY['nfc_cards','link_pages','qr_designer'], '1.0.0'),
('Luxury Mix', 'pattern-luxury-mix', 'pattern', 'general', 'luxury', '{"key":"luxury-mix"}', ARRAY['luxury','mix','premium'], ARRAY['nfc_cards','link_pages','qr_designer'], '1.0.0'),
('Creative Mix', 'pattern-creative-mix', 'pattern', 'general', 'artistic', '{"key":"creative-mix"}', ARRAY['creative','mix','artistic'], ARRAY['nfc_cards','link_pages','qr_designer'], '1.0.0'),
('Music Mix', 'pattern-music-mix', 'pattern', 'general', 'lifestyle', '{"key":"music-mix"}', ARRAY['music','mix','lifestyle'], ARRAY['nfc_cards','link_pages','qr_designer'], '1.0.0'),
('Space Mix', 'pattern-space-mix', 'pattern', 'general', 'celestial', '{"key":"space-mix"}', ARRAY['space','mix','celestial'], ARRAY['nfc_cards','link_pages','qr_designer'], '1.0.0'),
('Travel Mix', 'pattern-travel-mix', 'pattern', 'general', 'lifestyle', '{"key":"travel-mix"}', ARRAY['travel','mix','lifestyle'], ARRAY['nfc_cards','link_pages','qr_designer'], '1.0.0'),
('Love Mix', 'pattern-love-mix', 'pattern', 'general', 'lifestyle', '{"key":"love-mix"}', ARRAY['love','mix','romantic'], ARRAY['nfc_cards','link_pages','qr_designer'], '1.0.0'),
('Crypto Mix', 'pattern-crypto-mix', 'pattern', 'general', 'tech', '{"key":"crypto-mix"}', ARRAY['crypto','mix','tech','finance'], ARRAY['nfc_cards','link_pages','qr_designer'], '1.0.0'),
('Random Shapes', 'pattern-random-shapes', 'pattern', 'general', 'artistic', '{"key":"random-shapes"}', ARRAY['random','shapes','artistic'], ARRAY['nfc_cards','link_pages','qr_designer'], '1.0.0'),
('Tools Mix', 'pattern-tools-mix', 'pattern', 'general', 'business', '{"key":"tools-mix"}', ARRAY['tools','mix','business'], ARRAY['nfc_cards','link_pages','qr_designer'], '1.0.0'),
('Nautical Mix', 'pattern-nautical-mix', 'pattern', 'general', 'lifestyle', '{"key":"nautical-mix"}', ARRAY['nautical','mix','sea'], ARRAY['nfc_cards','link_pages','qr_designer'], '1.0.0'),
('Weather Mix', 'pattern-weather-mix', 'pattern', 'general', 'nature', '{"key":"weather-mix"}', ARRAY['weather','mix','nature'], ARRAY['nfc_cards','link_pages','qr_designer'], '1.0.0'),
('Media Mix', 'pattern-media-mix', 'pattern', 'general', 'tech', '{"key":"media-mix"}', ARRAY['media','mix','tech'], ARRAY['nfc_cards','link_pages','qr_designer'], '1.0.0'),
('Office Mix', 'pattern-office-mix', 'pattern', 'general', 'business', '{"key":"office-mix"}', ARRAY['office','mix','business'], ARRAY['nfc_cards','link_pages','qr_designer'], '1.0.0'),
('Sports Mix', 'pattern-sports-mix', 'pattern', 'general', 'lifestyle', '{"key":"sports-mix"}', ARRAY['sports','mix','lifestyle'], ARRAY['nfc_cards','link_pages','qr_designer'], '1.0.0'),
('Communication Mix', 'pattern-communication-mix', 'pattern', 'general', 'tech', '{"key":"communication-mix"}', ARRAY['communication','mix','tech'], ARRAY['nfc_cards','link_pages','qr_designer'], '1.0.0'),
('Magic Mix', 'pattern-magic-mix', 'pattern', 'general', 'artistic', '{"key":"magic-mix"}', ARRAY['magic','mix','fantasy'], ARRAY['nfc_cards','link_pages','qr_designer'], '1.0.0');

-- ─── BRAND COLORS (from CardCanvasEditor.tsx) ────────────────────────

INSERT INTO assets (name, slug, asset_type, category, subcategory, data, tags, supported_modules, version) VALUES
('Original', 'brand-original', 'color', 'nfc', 'brand', '{"id":"original","label":"Original","value":"original"}', ARRAY['brand','original'], ARRAY['nfc_cards','business_cards'], '1.0.0'),
('Solid Black', 'brand-black', 'color', 'nfc', 'brand', '{"id":"black","label":"Solid Black","value":"#000000"}', ARRAY['brand','black','dark'], ARRAY['nfc_cards','business_cards'], '1.0.0'),
('Solid White', 'brand-white', 'color', 'nfc', 'brand', '{"id":"white","label":"Solid White","value":"#ffffff"}', ARRAY['brand','white','light'], ARRAY['nfc_cards','business_cards'], '1.0.0'),
('Silver', 'brand-silver', 'color', 'nfc', 'brand', '{"id":"silver","label":"Silver","value":"#c0c0c0"}', ARRAY['brand','silver','metal'], ARRAY['nfc_cards','business_cards'], '1.0.0'),
('Gold', 'brand-gold', 'color', 'nfc', 'brand', '{"id":"gold","label":"Gold","value":"#c9a84c"}', ARRAY['brand','gold','luxury'], ARRAY['nfc_cards','business_cards'], '1.0.0');

-- ─── QR PRESETS (top 25 from QRCodeEditor.tsx) ───────────────────────

INSERT INTO assets (name, slug, asset_type, category, subcategory, data, tags, supported_modules, version) VALUES
('Classic Black', 'qr-classic-black', 'qr_preset', 'qr', 'classic', '{"dotStyle":"square","eyeFrameStyle":"square","eyeBallStyle":"square","foreground":"#000000","background":"#ffffff","gradient":false}', ARRAY['qr','classic','black'], ARRAY['qr_designer'], '1.0.0'),
('Ocean Breeze', 'qr-ocean-breeze', 'qr_preset', 'qr', 'nature', '{"dotStyle":"rounded","eyeFrameStyle":"rounded","eyeBallStyle":"rounded","foreground":"#0077b6","background":"#caf0f8","gradient":true,"gradientColors":["#0077b6","#00b4d8"]}', ARRAY['qr','ocean','blue','nature'], ARRAY['qr_designer'], '1.0.0'),
('Neon Night', 'qr-neon-night', 'qr_preset', 'qr', 'neon', '{"dotStyle":"rounded","eyeFrameStyle":"rounded","eyeBallStyle":"circle","foreground":"#00ff88","background":"#0a0a0a","gradient":true,"gradientColors":["#00ff88","#00ccff"]}', ARRAY['qr','neon','night','cyber'], ARRAY['qr_designer'], '1.0.0'),
('Polaroid Memory', 'qr-polaroid-memory', 'qr_preset', 'qr', 'retro', '{"dotStyle":"dots","eyeFrameStyle":"square","eyeBallStyle":"square","foreground":"#5a3e2b","background":"#f5f0e8","gradient":false}', ARRAY['qr','retro','vintage','polaroid'], ARRAY['qr_designer'], '1.0.0'),
('Sunset Glow', 'qr-sunset-glow', 'qr_preset', 'qr', 'warm', '{"dotStyle":"rounded","eyeFrameStyle":"circle","eyeBallStyle":"circle","foreground":"#ff6b35","background":"#1a0a00","gradient":true,"gradientColors":["#ff6b35","#ffd166"]}', ARRAY['qr','sunset','warm','orange'], ARRAY['qr_designer'], '1.0.0'),
('Cyberpunk 2077', 'qr-cyberpunk-2077', 'qr_preset', 'qr', 'cyber', '{"dotStyle":"star","eyeFrameStyle":"hexagon","eyeBallStyle":"diamond","foreground":"#fcee09","background":"#0d0221","gradient":true,"gradientColors":["#fcee09","#ff2a6d"]}', ARRAY['qr','cyberpunk','neon','futuristic'], ARRAY['qr_designer'], '1.0.0'),
('Luxury Gold', 'qr-luxury-gold', 'qr_preset', 'qr', 'luxury', '{"dotStyle":"diamond","eyeFrameStyle":"octagon","eyeBallStyle":"diamond","foreground":"#c9a84c","background":"#1a1a1a","gradient":true,"gradientColors":["#c9a84c","#f4d03f"]}', ARRAY['qr','luxury','gold','premium'], ARRAY['qr_designer'], '1.0.0'),
('Cosmic Purple', 'qr-cosmic-purple', 'qr_preset', 'qr', 'cosmic', '{"dotStyle":"sparkle","eyeFrameStyle":"circle","eyeBallStyle":"circle","foreground":"#9b59b6","background":"#0a0014","gradient":true,"gradientColors":["#9b59b6","#e74c3c"]}', ARRAY['qr','cosmic','purple','space'], ARRAY['qr_designer'], '1.0.0'),
('Mint Fresh', 'qr-mint-fresh', 'qr_preset', 'qr', 'fresh', '{"dotStyle":"rounded","eyeFrameStyle":"rounded","eyeBallStyle":"rounded","foreground":"#00b894","background":"#f0fff4","gradient":true,"gradientColors":["#00b894","#55efc4"]}', ARRAY['qr','mint','fresh','green'], ARRAY['qr_designer'], '1.0.0'),
('Retro Arcade', 'qr-retro-arcade', 'qr_preset', 'qr', 'retro', '{"dotStyle":"square","eyeFrameStyle":"square","eyeBallStyle":"square","foreground":"#00ff00","background":"#0a0a0a","gradient":false}', ARRAY['qr','retro','arcade','gaming'], ARRAY['qr_designer'], '1.0.0'),
('Fire & Ice', 'qr-fire-ice', 'qr_preset', 'qr', 'contrast', '{"dotStyle":"fluid","eyeFrameStyle":"shield","eyeBallStyle":"shield","foreground":"#e74c3c","background":"#0c1445","gradient":true,"gradientColors":["#e74c3c","#3498db"]}', ARRAY['qr','fire','ice','contrast'], ARRAY['qr_designer'], '1.0.0'),
('Dark Elegance', 'qr-dark-elegance', 'qr_preset', 'qr', 'elegant', '{"dotStyle":"classy","eyeFrameStyle":"rounded","eyeBallStyle":"circle","foreground":"#d4af37","background":"#1a1a1a","gradient":true,"gradientColors":["#d4af37","#b8860b"]}', ARRAY['qr','dark','elegant','gold'], ARRAY['qr_designer'], '1.0.0'),
('Deep Sea', 'qr-deep-sea', 'qr_preset', 'qr', 'nature', '{"dotStyle":"drop","eyeFrameStyle":"leaf","eyeBallStyle":"drop","foreground":"#006994","background":"#001a2e","gradient":true,"gradientColors":["#006994","#48cae4"]}', ARRAY['qr','deep','sea','ocean','blue'], ARRAY['qr_designer'], '1.0.0'),
('Forest Canopy', 'qr-forest-canopy', 'qr_preset', 'qr', 'nature', '{"dotStyle":"hexagon","eyeFrameStyle":"hexagon","eyeBallStyle":"hexagon","foreground":"#2d6a4f","background":"#1a1a0e","gradient":true,"gradientColors":["#2d6a4f","#52b788"]}', ARRAY['qr','forest','nature','green'], ARRAY['qr_designer'], '1.0.0'),
('Holographic', 'qr-holographic', 'qr_preset', 'qr', 'futuristic', '{"dotStyle":"sparkle","eyeFrameStyle":"diamond","eyeBallStyle":"sparkle","foreground":"#ff6b9d","background":"#0a0020","gradient":true,"gradientColors":["#ff6b9d","#c44dff","#6b9dff"]}', ARRAY['qr','holographic','futuristic','rainbow'], ARRAY['qr_designer'], '1.0.0'),
('Cherry Blossom', 'qr-cherry-blossom', 'qr_preset', 'qr', 'nature', '{"dotStyle":"heart","eyeFrameStyle":"circle","eyeBallStyle":"circle","foreground":"#f8a4c8","background":"#fff0f5","gradient":true,"gradientColors":["#f8a4c8","#fce4ec"]}', ARRAY['qr','cherry','blossom','pink','nature'], ARRAY['qr_designer'], '1.0.0'),
('Golden Ratio', 'qr-golden-ratio', 'qr_preset', 'qr', 'mathematical', '{"dotStyle":"diamond","eyeFrameStyle":"octagon","eyeBallStyle":"diamond","foreground":"#daa520","background":"#1c1c1c","gradient":true,"gradientColors":["#daa520","#ffd700"]}', ARRAY['qr','golden','ratio','mathematical','gold'], ARRAY['qr_designer'], '1.0.0'),
('Vaporwave', 'qr-vaporwave', 'qr_preset', 'qr', 'retro', '{"dotStyle":"diamond","eyeFrameStyle":"hexagon","eyeBallStyle":"diamond","foreground":"#ff71ce","background":"#1a0033","gradient":true,"gradientColors":["#ff71ce","#01cdfe","#05ffa1"]}', ARRAY['qr','vaporwave','retro','aesthetic'], ARRAY['qr_designer'], '1.0.0'),
('Coffee Shop', 'qr-coffee-shop', 'qr_preset', 'qr', 'warm', '{"dotStyle":"rounded","eyeFrameStyle":"rounded","eyeBallStyle":"circle","foreground":"#6f4e37","background":"#faf3e8","gradient":true,"gradientColors":["#6f4e37","#c4a882"]}', ARRAY['qr','coffee','warm','brown'], ARRAY['qr_designer'], '1.0.0'),
('Ruby Sparkle', 'qr-ruby-sparkle', 'qr_preset', 'qr', 'luxury', '{"dotStyle":"sparkle","eyeFrameStyle":"shield","eyeBallStyle":"sparkle","foreground":"#e0115f","background":"#1a0010","gradient":true,"gradientColors":["#e0115f","#ff1744"]}', ARRAY['qr','ruby','sparkle','luxury','red'], ARRAY['qr_designer'], '1.0.0'),
('Emerald City', 'qr-emerald-city', 'qr_preset', 'qr', 'luxury', '{"dotStyle":"hexagon","eyeFrameStyle":"shield","eyeBallStyle":"hexagon","foreground":"#50c878","background":"#0a1a10","gradient":true,"gradientColors":["#50c878","#2ecc71"]}', ARRAY['qr','emerald','luxury','green'], ARRAY['qr_designer'], '1.0.0'),
('Neon Tokyo', 'qr-neon-tokyo', 'qr_preset', 'qr', 'neon', '{"dotStyle":"ninja","eyeFrameStyle":"hexagon","eyeBallStyle":"diamond","foreground":"#ff006e","background":"#0a0012","gradient":true,"gradientColors":["#ff006e","#fb5607"]}', ARRAY['qr','neon','tokyo','cyber','pink'], ARRAY['qr_designer'], '1.0.0'),
('Silver Bullet', 'qr-silver-bullet', 'qr_preset', 'qr', 'minimal', '{"dotStyle":"square","eyeFrameStyle":"square","eyeBallStyle":"square","foreground":"#c0c0c0","background":"#1a1a1a","gradient":true,"gradientColors":["#c0c0c0","#e0e0e0"]}', ARRAY['qr','silver','minimal','metal'], ARRAY['qr_designer'], '1.0.0'),
('Cotton Candy', 'qr-cotton-candy', 'qr_preset', 'qr', 'playful', '{"dotStyle":"rounded","eyeFrameStyle":"circle","eyeBallStyle":"circle","foreground":"#ffbcf5","background":"#fff0fb","gradient":true,"gradientColors":["#ffbcf5","#a0d2db"]}', ARRAY['qr','cotton','candy','pink','playful'], ARRAY['qr_designer'], '1.0.0'),
('Midnight Ocean', 'qr-midnight-ocean', 'qr_preset', 'qr', 'dark', '{"dotStyle":"fluid","eyeFrameStyle":"leaf","eyeBallStyle":"drop","foreground":"#023e8a","background":"#03045e","gradient":true,"gradientColors":["#023e8a","#0096c7"]}', ARRAY['qr','midnight','ocean','dark','blue'], ARRAY['qr_designer'], '1.0.0');

-- ─── QR DOT STYLES (from QRCodeEditor.tsx) ───────────────────────────

INSERT INTO assets (name, slug, asset_type, category, subcategory, data, tags, supported_modules, version) VALUES
('Square Dots', 'qr-dot-square', 'qr_preset', 'qr', 'dots', '{"styleType":"dot","key":"square","label":"Square"}', ARRAY['qr','dot','square'], ARRAY['qr_designer'], '1.0.0'),
('Round Dots', 'qr-dot-dots', 'qr_preset', 'qr', 'dots', '{"styleType":"dot","key":"dots","label":"Dots"}', ARRAY['qr','dot','round'], ARRAY['qr_designer'], '1.0.0'),
('Rounded Square', 'qr-dot-rounded', 'qr_preset', 'qr', 'dots', '{"styleType":"dot","key":"rounded","label":"Rounded"}', ARRAY['qr','dot','rounded'], ARRAY['qr_designer'], '1.0.0'),
('Classy', 'qr-dot-classy', 'qr_preset', 'qr', 'dots', '{"styleType":"dot","key":"classy","label":"Classy"}', ARRAY['qr','dot','elegant'], ARRAY['qr_designer'], '1.0.0'),
('Star Dots', 'qr-dot-star', 'qr_preset', 'qr', 'dots', '{"styleType":"dot","key":"star","label":"Star"}', ARRAY['qr','dot','star'], ARRAY['qr_designer'], '1.0.0'),
('Diamond Dots', 'qr-dot-diamond', 'qr_preset', 'qr', 'dots', '{"styleType":"dot","key":"diamond","label":"Diamond"}', ARRAY['qr','dot','diamond'], ARRAY['qr_designer'], '1.0.0'),
('Hexagon Dots', 'qr-dot-hexagon', 'qr_preset', 'qr', 'dots', '{"styleType":"dot","key":"hexagon","label":"Hexagon"}', ARRAY['qr','dot','hexagon'], ARRAY['qr_designer'], '1.0.0'),
('Fluid Dots', 'qr-dot-fluid', 'qr_preset', 'qr', 'dots', '{"styleType":"dot","key":"fluid","label":"Fluid"}', ARRAY['qr','dot','fluid','organic'], ARRAY['qr_designer'], '1.0.0'),
('Cross Dots', 'qr-dot-cross', 'qr_preset', 'qr', 'dots', '{"styleType":"dot","key":"cross","label":"Cross"}', ARRAY['qr','dot','cross'], ARRAY['qr_designer'], '1.0.0'),
('Heart Dots', 'qr-dot-heart', 'qr_preset', 'qr', 'dots', '{"styleType":"dot","key":"heart","label":"Heart"}', ARRAY['qr','dot','heart'], ARRAY['qr_designer'], '1.0.0'),
('Triangle Dots', 'qr-dot-triangle', 'qr_preset', 'qr', 'dots', '{"styleType":"dot","key":"triangle","label":"Triangle"}', ARRAY['qr','dot','triangle'], ARRAY['qr_designer'], '1.0.0'),
('Drop Dots', 'qr-dot-drop', 'qr_preset', 'qr', 'dots', '{"styleType":"dot","key":"drop","label":"Drop"}', ARRAY['qr','dot','drop'], ARRAY['qr_designer'], '1.0.0'),
('Ninja Dots', 'qr-dot-ninja', 'qr_preset', 'qr', 'dots', '{"styleType":"dot","key":"ninja","label":"Ninja"}', ARRAY['qr','dot','ninja'], ARRAY['qr_designer'], '1.0.0'),
('Sparkle Dots', 'qr-dot-sparkle', 'qr_preset', 'qr', 'dots', '{"styleType":"dot","key":"sparkle","label":"Sparkle"}', ARRAY['qr','dot','sparkle'], ARRAY['qr_designer'], '1.0.0'),
('Pill Dots', 'qr-dot-pill', 'qr_preset', 'qr', 'dots', '{"styleType":"dot","key":"pill","label":"Pill"}', ARRAY['qr','dot','pill'], ARRAY['qr_designer'], '1.0.0');

-- ─── QR EYE FRAME STYLES (from QRCodeEditor.tsx) ────────────────────

INSERT INTO assets (name, slug, asset_type, category, subcategory, data, tags, supported_modules, version) VALUES
('Square Frame', 'qr-eye-frame-square', 'qr_frame', 'qr', 'eye-frames', '{"styleType":"eyeFrame","key":"square","label":"Square"}', ARRAY['qr','eye','frame','square'], ARRAY['qr_designer'], '1.0.0'),
('Rounded Frame', 'qr-eye-frame-rounded', 'qr_frame', 'qr', 'eye-frames', '{"styleType":"eyeFrame","key":"rounded","label":"Rounded"}', ARRAY['qr','eye','frame','rounded'], ARRAY['qr_designer'], '1.0.0'),
('Circle Frame', 'qr-eye-frame-circle', 'qr_frame', 'qr', 'eye-frames', '{"styleType":"eyeFrame","key":"circle","label":"Circle"}', ARRAY['qr','eye','frame','circle'], ARRAY['qr_designer'], '1.0.0'),
('Leaf Frame', 'qr-eye-frame-leaf', 'qr_frame', 'qr', 'eye-frames', '{"styleType":"eyeFrame","key":"leaf","label":"Leaf"}', ARRAY['qr','eye','frame','leaf','organic'], ARRAY['qr_designer'], '1.0.0'),
('Octagon Frame', 'qr-eye-frame-octagon', 'qr_frame', 'qr', 'eye-frames', '{"styleType":"eyeFrame","key":"octagon","label":"Octagon"}', ARRAY['qr','eye','frame','octagon'], ARRAY['qr_designer'], '1.0.0'),
('Star Frame', 'qr-eye-frame-star', 'qr_frame', 'qr', 'eye-frames', '{"styleType":"eyeFrame","key":"star","label":"Star"}', ARRAY['qr','eye','frame','star'], ARRAY['qr_designer'], '1.0.0'),
('Shield Frame', 'qr-eye-frame-shield', 'qr_frame', 'qr', 'eye-frames', '{"styleType":"eyeFrame","key":"shield","label":"Shield"}', ARRAY['qr','eye','frame','shield'], ARRAY['qr_designer'], '1.0.0'),
('Hexagon Frame', 'qr-eye-frame-hexagon', 'qr_frame', 'qr', 'eye-frames', '{"styleType":"eyeFrame","key":"hexagon","label":"Hexagon"}', ARRAY['qr','eye','frame','hexagon'], ARRAY['qr_designer'], '1.0.0'),
('Diamond Frame', 'qr-eye-frame-diamond', 'qr_frame', 'qr', 'eye-frames', '{"styleType":"eyeFrame","key":"diamond","label":"Diamond"}', ARRAY['qr','eye','frame','diamond'], ARRAY['qr_designer'], '1.0.0'),
('Triangle Frame', 'qr-eye-frame-triangle', 'qr_frame', 'qr', 'eye-frames', '{"styleType":"eyeFrame","key":"triangle","label":"Triangle"}', ARRAY['qr','eye','frame','triangle'], ARRAY['qr_designer'], '1.0.0'),
('Drop Frame', 'qr-eye-frame-drop', 'qr_frame', 'qr', 'eye-frames', '{"styleType":"eyeFrame","key":"drop","label":"Drop"}', ARRAY['qr','eye','frame','drop'], ARRAY['qr_designer'], '1.0.0'),
('Ninja Frame', 'qr-eye-frame-ninja', 'qr_frame', 'qr', 'eye-frames', '{"styleType":"eyeFrame","key":"ninja","label":"Ninja"}', ARRAY['qr','eye','frame','ninja'], ARRAY['qr_designer'], '1.0.0'),
('Sparkle Frame', 'qr-eye-frame-sparkle', 'qr_frame', 'qr', 'eye-frames', '{"styleType":"eyeFrame","key":"sparkle","label":"Sparkle"}', ARRAY['qr','eye','frame','sparkle'], ARRAY['qr_designer'], '1.0.0'),
('Pill Frame', 'qr-eye-frame-pill', 'qr_frame', 'qr', 'eye-frames', '{"styleType":"eyeFrame","key":"pill","label":"Pill"}', ARRAY['qr','eye','frame','pill'], ARRAY['qr_designer'], '1.0.0');

-- ─── QR EYE BALL STYLES (from QRCodeEditor.tsx) ─────────────────────

INSERT INTO assets (name, slug, asset_type, category, subcategory, data, tags, supported_modules, version) VALUES
('Square Ball', 'qr-eye-ball-square', 'qr_preset', 'qr', 'eye-balls', '{"styleType":"eyeBall","key":"square","label":"Square"}', ARRAY['qr','eye','ball','square'], ARRAY['qr_designer'], '1.0.0'),
('Rounded Ball', 'qr-eye-ball-rounded', 'qr_preset', 'qr', 'eye-balls', '{"styleType":"eyeBall","key":"rounded","label":"Rounded"}', ARRAY['qr','eye','ball','rounded'], ARRAY['qr_designer'], '1.0.0'),
('Circle Ball', 'qr-eye-ball-circle', 'qr_preset', 'qr', 'eye-balls', '{"styleType":"eyeBall","key":"circle","label":"Circle"}', ARRAY['qr','eye','ball','circle'], ARRAY['qr_designer'], '1.0.0'),
('Leaf Ball', 'qr-eye-ball-leaf', 'qr_preset', 'qr', 'eye-balls', '{"styleType":"eyeBall","key":"leaf","label":"Leaf"}', ARRAY['qr','eye','ball','leaf'], ARRAY['qr_designer'], '1.0.0'),
('Diamond Ball', 'qr-eye-ball-diamond', 'qr_preset', 'qr', 'eye-balls', '{"styleType":"eyeBall","key":"diamond","label":"Diamond"}', ARRAY['qr','eye','ball','diamond'], ARRAY['qr_designer'], '1.0.0'),
('Cross Ball', 'qr-eye-ball-cross', 'qr_preset', 'qr', 'eye-balls', '{"styleType":"eyeBall","key":"cross","label":"Cross"}', ARRAY['qr','eye','ball','cross'], ARRAY['qr_designer'], '1.0.0'),
('Star Ball', 'qr-eye-ball-star', 'qr_preset', 'qr', 'eye-balls', '{"styleType":"eyeBall","key":"star","label":"Star"}', ARRAY['qr','eye','ball','star'], ARRAY['qr_designer'], '1.0.0'),
('Shield Ball', 'qr-eye-ball-shield', 'qr_preset', 'qr', 'eye-balls', '{"styleType":"eyeBall","key":"shield","label":"Shield"}', ARRAY['qr','eye','ball','shield'], ARRAY['qr_designer'], '1.0.0'),
('Hexagon Ball', 'qr-eye-ball-hexagon', 'qr_preset', 'qr', 'eye-balls', '{"styleType":"eyeBall","key":"hexagon","label":"Hexagon"}', ARRAY['qr','eye','ball','hexagon'], ARRAY['qr_designer'], '1.0.0'),
('Triangle Ball', 'qr-eye-ball-triangle', 'qr_preset', 'qr', 'eye-balls', '{"styleType":"eyeBall","key":"triangle","label":"Triangle"}', ARRAY['qr','eye','ball','triangle'], ARRAY['qr_designer'], '1.0.0'),
('Drop Ball', 'qr-eye-ball-drop', 'qr_preset', 'qr', 'eye-balls', '{"styleType":"eyeBall","key":"drop","label":"Drop"}', ARRAY['qr','eye','ball','drop'], ARRAY['qr_designer'], '1.0.0'),
('Ninja Ball', 'qr-eye-ball-ninja', 'qr_preset', 'qr', 'eye-balls', '{"styleType":"eyeBall","key":"ninja","label":"Ninja"}', ARRAY['qr','eye','ball','ninja'], ARRAY['qr_designer'], '1.0.0'),
('Sparkle Ball', 'qr-eye-ball-sparkle', 'qr_preset', 'qr', 'eye-balls', '{"styleType":"eyeBall","key":"sparkle","label":"Sparkle"}', ARRAY['qr','eye','ball','sparkle'], ARRAY['qr_designer'], '1.0.0'),
('Pill Ball', 'qr-eye-ball-pill', 'qr_preset', 'qr', 'eye-balls', '{"styleType":"eyeBall","key":"pill","label":"Pill"}', ARRAY['qr','eye','ball','pill'], ARRAY['qr_designer'], '1.0.0');

-- ─── QR FRAME STYLES (from QRCodeEditor.tsx) ────────────────────────

INSERT INTO assets (name, slug, asset_type, category, subcategory, data, tags, supported_modules, version) VALUES
('Bubble Frame', 'qr-style-bubble', 'qr_frame', 'qr', 'frame-styles', '{"styleType":"frame","key":"bubble","label":"Bubble"}', ARRAY['qr','frame','bubble'], ARRAY['qr_designer'], '1.0.0'),
('Border Frame', 'qr-style-border', 'qr_frame', 'qr', 'frame-styles', '{"styleType":"frame","key":"border","label":"Border"}', ARRAY['qr','frame','border'], ARRAY['qr_designer'], '1.0.0'),
('Badge Frame', 'qr-style-badge', 'qr_frame', 'qr', 'frame-styles', '{"styleType":"frame","key":"badge","label":"Badge"}', ARRAY['qr','frame','badge'], ARRAY['qr_designer'], '1.0.0'),
('Solid Frame', 'qr-style-solid', 'qr_frame', 'qr', 'frame-styles', '{"styleType":"frame","key":"solid","label":"Solid"}', ARRAY['qr','frame','solid'], ARRAY['qr_designer'], '1.0.0'),
('Shadow Frame', 'qr-style-shadow', 'qr_frame', 'qr', 'frame-styles', '{"styleType":"frame","key":"shadow","label":"Shadow"}', ARRAY['qr','frame','shadow'], ARRAY['qr_designer'], '1.0.0'),
('Vintage Frame', 'qr-style-vintage', 'qr_frame', 'qr', 'frame-styles', '{"styleType":"frame","key":"vintage","label":"Vintage"}', ARRAY['qr','frame','vintage','retro'], ARRAY['qr_designer'], '1.0.0'),
('Ticket Frame', 'qr-style-ticket', 'qr_frame', 'qr', 'frame-styles', '{"styleType":"frame","key":"ticket","label":"Ticket"}', ARRAY['qr','frame','ticket'], ARRAY['qr_designer'], '1.0.0'),
('Minimal Frame', 'qr-style-minimal', 'qr_frame', 'qr', 'frame-styles', '{"styleType":"frame","key":"minimal","label":"Minimal"}', ARRAY['qr','frame','minimal'], ARRAY['qr_designer'], '1.0.0'),
('Polaroid Frame', 'qr-style-polaroid', 'qr_frame', 'qr', 'frame-styles', '{"styleType":"frame","key":"polaroid","label":"Polaroid"}', ARRAY['qr','frame','polaroid','retro'], ARRAY['qr_designer'], '1.0.0'),
('Browser Frame', 'qr-style-browser', 'qr_frame', 'qr', 'frame-styles', '{"styleType":"frame","key":"browser","label":"Browser"}', ARRAY['qr','frame','browser','tech'], ARRAY['qr_designer'], '1.0.0'),
('Neon Frame', 'qr-style-neon', 'qr_frame', 'qr', 'frame-styles', '{"styleType":"frame","key":"neon","label":"Neon"}', ARRAY['qr','frame','neon','cyber'], ARRAY['qr_designer'], '1.0.0'),
('Glass Frame', 'qr-style-glass', 'qr_frame', 'qr', 'frame-styles', '{"styleType":"frame","key":"glass","label":"Glass"}', ARRAY['qr','frame','glass','modern'], ARRAY['qr_designer'], '1.0.0'),
('Cyberpunk Frame', 'qr-style-cyberpunk', 'qr_frame', 'qr', 'frame-styles', '{"styleType":"frame","key":"cyberpunk","label":"Cyberpunk"}', ARRAY['qr','frame','cyberpunk','cyber'], ARRAY['qr_designer'], '1.0.0'),
('Glowing Frame', 'qr-style-glowing', 'qr_frame', 'qr', 'frame-styles', '{"styleType":"frame","key":"glowing","label":"Glowing"}', ARRAY['qr','frame','glow','neon'], ARRAY['qr_designer'], '1.0.0'),
('Film Frame', 'qr-style-film', 'qr_frame', 'qr', 'frame-styles', '{"styleType":"frame","key":"film","label":"Film"}', ARRAY['qr','frame','film','retro'], ARRAY['qr_designer'], '1.0.0'),
('Brackets Frame', 'qr-style-brackets', 'qr_frame', 'qr', 'frame-styles', '{"styleType":"frame","key":"brackets","label":"Brackets"}', ARRAY['qr','frame','brackets'], ARRAY['qr_designer'], '1.0.0');

-- ─── COLLECTIONS ─────────────────────────────────────────────────────

INSERT INTO asset_collections (name, slug, description, icon, color) VALUES
('NFC Card Essentials', 'nfc-essentials', 'Core patterns and textures for NFC card design', 'layers', '#6366f1'),
('QR Code Pro', 'qr-pro', 'Premium QR code styles and frames', 'qr-code', '#8b5cf6'),
('Premium Materials', 'premium-materials', 'High-end textures and materials', 'diamond', '#f59e0b'),
('Link Page Themes', 'link-themes', 'Background patterns and themes for link pages', 'layout', '#10b981'),
('Business Collection', 'business-collection', 'Professional assets for business cards and NFC', 'briefcase', '#3b82f6');

-- ─── DONE ─────────────────────────────────────────────────────────────
-- Total seeded: ~160+ assets across patterns, textures, QR presets,
-- QR frames, eye styles, brand colors, NFC templates, and collections
