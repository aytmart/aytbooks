import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Book, BookshelfCategory } from '../../types';
import { soundEngine } from '../../utils/audio';
import { BookOpen, Sparkles } from 'lucide-react';

interface Library3DCanvasProps {
  books: Book[];
  categories?: BookshelfCategory[];
  onSelectBook: (book: Book) => void;
  selectedCategory?: string | null;
  activeCategoryIndex?: number | null;
  onClearCategoryFocus?: () => void;
  searchWaypoint?: { x: number; z: number; title: string } | null;
  onClearWaypoint?: () => void;
  isSensorEnabled?: boolean;
  onSensorStateChange?: (enabled: boolean) => void;
  reducedMotion?: boolean;
  zoomAction?: { type: 'in' | 'out' | 'reset'; timestamp: number } | null;
  orbitAction?: { dir: 'left' | 'right' | 'up' | 'down'; timestamp: number } | null;
}

export const Library3DCanvas: React.FC<Library3DCanvasProps> = ({
  books,
  categories = [],
  onSelectBook,
  selectedCategory,
  activeCategoryIndex,
  onClearCategoryFocus,
  searchWaypoint,
  onClearWaypoint,
  isSensorEnabled = false,
  reducedMotion = false,
  zoomAction,
  orbitAction,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredBook, setHoveredBook] = useState<Book | null>(null);
  const [hoverBadgePos, setHoverBadgePos] = useState<{ x: number; y: number } | null>(null);
  const [fontsReady, setFontsReady] = useState(false);

  // Ensure fonts are loaded before generating crisp canvas text
  useEffect(() => {
    if (document.fonts) {
      document.fonts.ready.then(() => {
        setFontsReady(true);
      });
    }
  }, []);

  // Camera & Orbit State Refs
  const cameraState = useRef({
    distance: 4.8,
    targetDistance: 4.8,
    minDistance: 0.65,
    maxDistance: 7.0,
    yaw: Math.PI,
    targetYaw: Math.PI,
    pitch: 0.04,
    targetPitch: 0.04,
    targetLookAt: new THREE.Vector3(0, 1.45, 0),
    currentLookAt: new THREE.Vector3(0, 1.45, 0),
    isDragging: false,
    prevMouseX: 0,
    prevMouseY: 0,
    prevTouchDist: 0,
    autoRotate: true,
    autoRotateSpeed: 0.0006,
    lastInteractionTime: Date.now(),
    gyroYaw: 0,
    gyroPitch: 0,
  });

  const bookMeshesRef = useRef<{ mesh: THREE.Group; book: Book; initialPos: THREE.Vector3; initialRot: THREE.Euler }[]>([]);

  // 5 Majestic Bookshelf Bays distributed 360° evenly around the circular grand rotunda
  const SHELF_BAYS = [
    { catId: 'islamic_books', name: 'Islamic Books', icon: '🌙', subtitle: 'HERITAGE & FAITH', color: '#133a28', angle: 0 },
    { catId: 'children_teen', name: 'Children & Teen', icon: '👥', subtitle: 'STORIES & ADVENTURE', color: '#422410', angle: (Math.PI * 2) / 5 },
    { catId: 'educational', name: 'Educational', icon: '🎓', subtitle: 'SCIENCE & ACADEMICS', color: '#142a42', angle: ((Math.PI * 2) / 5) * 2 },
    { catId: 'personal_dev', name: 'Personal Development', icon: '📈', subtitle: 'MIND & PRODUCTIVITY', color: '#3a2b10', angle: ((Math.PI * 2) / 5) * 3 },
    { catId: 'life_knowledge', name: 'Life & Knowledge', icon: '💡', subtitle: 'PHILOSOPHY & HISTORY', color: '#32183e', angle: ((Math.PI * 2) / 5) * 4 },
  ];

  // Procedural Canvas Textures for Bengali Title Plaques (Ultra HD, Razor-Sharp & High Contrast)
  const createTitlePlaqueTexture = useCallback((book: Book) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Deep obsidian & rich mahogany base
    ctx.fillStyle = '#0a0604';
    ctx.fillRect(0, 0, 1024, 256);

    // High-Lustre Gold Filigree Border
    ctx.strokeStyle = '#e6bf55';
    ctx.lineWidth = 12;
    ctx.strokeRect(8, 8, 1008, 240);

    ctx.strokeStyle = '#fff2b2';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, 984, 216);

    // Corner decorative brass rivets
    const corners = [
      [32, 32],
      [992, 32],
      [32, 224],
      [992, 224],
    ];
    corners.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#ffd700';
      ctx.fill();
    });

    // High-contrast dark pill backdrop for maximum text legibility
    ctx.fillStyle = '#140c06';
    ctx.beginPath();
    ctx.roundRect(40, 36, 944, 184, 16);
    ctx.fill();
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Razor-Sharp Bengali Book Title with pure black outline for 100% crystal clarity
    const displayTitle = book.banglaTitle.length > 20 ? book.banglaTitle.slice(0, 19) + '..' : book.banglaTitle;
    ctx.font = 'bold 74px "Hind Siliguri", "Noto Serif Bengali", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 14;
    ctx.lineJoin = 'miter';
    ctx.miterLimit = 2;
    ctx.strokeText(displayTitle, 512, 128);

    ctx.fillStyle = '#ffffff';
    ctx.fillText(displayTitle, 512, 128);

    const tex = new THREE.CanvasTexture(canvas);
    // Disable mipmap downsampling to preserve 100% full crisp resolution
    tex.generateMipmaps = false;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.anisotropy = 16;
    tex.needsUpdate = true;
    return tex;
  }, []);

  // Procedural Ultra-HD Book Cover Textures
  const createCategoryCoverTexture = useCallback((book: Book) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1536;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Rich leather base
    ctx.fillStyle = book.coverColor || '#2c1e14';
    ctx.fillRect(0, 0, 1024, 1536);

    // Subtle fine leather grain
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    for (let i = 0; i < 1536; i += 12) {
      ctx.fillRect(0, i, 1024, 4);
    }

    // Heavy gold embossed frame
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 24;
    ctx.strokeRect(28, 28, 968, 1480);

    ctx.strokeStyle = '#fff0a6';
    ctx.lineWidth = 6;
    ctx.strokeRect(56, 56, 912, 1424);

    // Spine shading gradient
    const grad = ctx.createLinearGradient(0, 0, 140, 0);
    grad.addColorStop(0, 'rgba(0,0,0,0.85)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 140, 1536);

    // Header Branding
    ctx.fillStyle = '#f5d77f';
    ctx.font = 'bold 44px "Cinzel", serif';
    ctx.textAlign = 'center';
    ctx.fillText('AYT BOOKS LIBRARY', 512, 150);

    // Gold Center Medallion
    ctx.beginPath();
    ctx.arc(512, 430, 110, 0, Math.PI * 2);
    ctx.fillStyle = '#d4af37';
    ctx.fill();
    ctx.strokeStyle = '#fff2b2';
    ctx.lineWidth = 6;
    ctx.stroke();

    ctx.fillStyle = '#1c1508';
    ctx.font = 'bold 80px serif';
    ctx.fillText('✦', 512, 460);

    // High-Contrast Title Plaque Card Box on the Book Cover
    ctx.fillStyle = 'rgba(10, 6, 4, 0.94)';
    ctx.beginPath();
    ctx.roundRect(80, 600, 864, 460, 24);
    ctx.fill();
    ctx.strokeStyle = '#e6bf55';
    ctx.lineWidth = 8;
    ctx.stroke();

    ctx.strokeStyle = '#fff2b2';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(96, 616, 832, 428, 18);
    ctx.stroke();

    // Ultra-Clear Bengali Book Title (Big, bold, outlined for zero blur)
    const bTitle = book.banglaTitle.slice(0, 18);
    ctx.font = 'bold 80px "Hind Siliguri", "Noto Serif Bengali", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 14;
    ctx.strokeText(bTitle, 512, 730);

    ctx.fillStyle = '#ffffff';
    ctx.fillText(bTitle, 512, 730);

    // English Subtitle in Crisp Gold
    const eTitle = book.title.slice(0, 24);
    ctx.font = 'bold 46px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#ffd54f';
    ctx.fillText(eTitle, 512, 850);

    // Category / Tag
    ctx.font = '600 32px "Hind Siliguri", sans-serif';
    ctx.fillStyle = '#a8a29e';
    ctx.fillText(book.category, 512, 940);

    // Author Box at Bottom
    ctx.fillStyle = 'rgba(10, 6, 4, 0.9)';
    ctx.beginPath();
    ctx.roundRect(140, 1200, 744, 150, 18);
    ctx.fill();
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.font = 'bold 52px "Hind Siliguri", "Noto Serif Bengali", sans-serif';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 8;
    ctx.strokeText(book.author, 512, 1275);
    ctx.fillStyle = '#fff0a6';
    ctx.fillText(book.author, 512, 1275);

    const tex = new THREE.CanvasTexture(canvas);
    tex.generateMipmaps = false;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.anisotropy = 16;
    tex.needsUpdate = true;
    return tex;
  }, []);

  // Ultra-HD Spine Texture for shelf view
  const createSpineTexture = useCallback((book: Book) => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 1536;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.fillStyle = book.spineColor || book.coverColor;
    ctx.fillRect(0, 0, 256, 1536);

    // Gold Ribbons
    ctx.fillStyle = '#d4af37';
    ctx.fillRect(12, 0, 8, 1536);
    ctx.fillRect(236, 0, 8, 1536);

    ctx.fillRect(0, 80, 256, 12);
    ctx.fillRect(0, 1440, 256, 12);

    ctx.save();
    ctx.translate(128, 768);
    ctx.rotate(Math.PI / 2);
    ctx.font = 'bold 56px "Hind Siliguri", "Noto Serif Bengali", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const bTitle = book.banglaTitle.slice(0, 20);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 12;
    ctx.strokeText(bTitle, 0, 0);

    ctx.fillStyle = '#ffffff';
    ctx.fillText(bTitle, 0, 0);
    ctx.restore();

    const tex = new THREE.CanvasTexture(canvas);
    tex.generateMipmaps = false;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.anisotropy = 16;
    tex.needsUpdate = true;
    return tex;
  }, []);

  // Rich Mahogany & Oak Architectural Wood Wall Texture
  const createRichMahoganyWallTexture = useCallback(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    // Deep Mahogany Base
    ctx.fillStyle = '#2b160c';
    ctx.fillRect(0, 0, 512, 512);

    // Vertical Wood Grain Striations
    for (let y = 0; y < 512; y += 3) {
      const alpha = Math.sin(y * 0.2) * 0.08 + 0.06;
      ctx.fillStyle = y % 6 === 0 ? `rgba(20, 10, 5, ${alpha})` : `rgba(60, 30, 15, ${alpha})`;
      ctx.fillRect(0, y, 512, 2);
    }

    // Classic Boiserie / Wainscoting Raised Wood Panels
    for (let x = 0; x < 512; x += 128) {
      // Dark recessed border shadow
      ctx.fillStyle = '#160a04';
      ctx.fillRect(x + 4, 16, 120, 480);

      // Raised panel face
      ctx.fillStyle = '#341a0e';
      ctx.fillRect(x + 10, 22, 108, 468);

      // Subtle warm wood grain highlights
      ctx.strokeStyle = '#4a2614';
      ctx.lineWidth = 4;
      ctx.strokeRect(x + 14, 26, 100, 460);

      // Antique gold bead trim line
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x + 22, 34, 84, 444);

      // Center decorative wood carving medallion
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.25)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x + 64, 256, 20, 0, Math.PI * 2);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(12, 2);
    tex.anisotropy = 8;
    return tex;
  }, []);

  // Handcrafted Teak & Rosewood Bookshelf Texture
  const createHandcraftedWoodShelfTexture = useCallback(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    // Warm Antique Teak Base
    ctx.fillStyle = '#3a2012';
    ctx.fillRect(0, 0, 512, 512);

    // Natural horizontal & vertical organic wood fibers
    for (let i = 0; i < 512; i += 2) {
      const grain = Math.sin(i * 0.15) * 0.07 + 0.05;
      ctx.fillStyle = i % 4 === 0 ? `rgba(22, 11, 6, ${grain * 1.5})` : `rgba(75, 42, 22, ${grain})`;
      ctx.fillRect(0, i, 512, 2);
    }

    // Wood knot & growth rings
    for (let k = 0; k < 4; k++) {
      const kx = 80 + k * 120;
      const ky = 100 + (k % 2) * 200;
      for (let r = 8; r < 40; r += 6) {
        ctx.strokeStyle = 'rgba(25, 12, 6, 0.15)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(kx, ky, r * 1.8, r, 0.2, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Subtle edge burnish
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.2)';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, 508, 508);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2, 2);
    tex.anisotropy = 8;
    return tex;
  }, []);

  // Classic Parquet Herringbone Hardwood Floor Texture
  const createHardwoodParquetFloorTexture = useCallback(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    ctx.fillStyle = '#22120a';
    ctx.fillRect(0, 0, 1024, 1024);

    const plankW = 256;
    const plankH = 64;

    for (let y = 0; y < 1024; y += plankH) {
      const row = Math.floor(y / plankH);
      const xOffset = (row % 4) * 64;
      for (let x = -256 + xOffset; x < 1024 + 256; x += plankW) {
        const toneVariation = ((row + Math.floor(x / plankW)) % 5) * 6;
        ctx.fillStyle = `rgb(${44 + toneVariation}, ${24 + toneVariation / 2}, ${14 + toneVariation / 3})`;
        ctx.fillRect(x + 2, y + 2, plankW - 4, plankH - 4);

        // Fine wood grain along plank length
        for (let g = 0; g < plankH - 4; g += 6) {
          ctx.fillStyle = 'rgba(15, 7, 3, 0.18)';
          ctx.fillRect(x + 2, y + 2 + g, plankW - 4, 2);
        }

        // Deep groove bevel around plank
        ctx.strokeStyle = '#120804';
        ctx.lineWidth = 3;
        ctx.strokeRect(x + 1, y + 1, plankW - 2, plankH - 2);

        // Soft specular wood varnish edge sheen
        ctx.strokeStyle = 'rgba(255, 220, 160, 0.08)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + 3, y + plankH - 3);
        ctx.lineTo(x + 3, y + 3);
        ctx.lineTo(x + plankW - 3, y + 3);
        ctx.stroke();
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(5, 5);
    tex.anisotropy = 16;
    return tex;
  }, []);

  // Center Ash / Slate Gray Luxury Mat Texture
  const createAshMatTexture = useCallback(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    // Deep ash-slate background
    ctx.fillStyle = '#2b2e33';
    ctx.fillRect(0, 0, 512, 512);

    // Subtle woven fabric grid pattern in ash grey
    for (let i = 0; i < 512; i += 16) {
      ctx.fillStyle = i % 32 === 0 ? '#34383f' : '#272a2e';
      ctx.fillRect(0, i, 512, 8);
      ctx.fillRect(i, 0, 8, 512);
    }

    // Outer ash-silver luxury border
    ctx.strokeStyle = '#8a909a';
    ctx.lineWidth = 14;
    ctx.strokeRect(18, 18, 476, 476);

    // Inner charcoal frame
    ctx.strokeStyle = '#4a4f58';
    ctx.lineWidth = 6;
    ctx.strokeRect(40, 40, 432, 432);

    // Central elegant geometric medallion in ash-gold tones
    ctx.beginPath();
    ctx.arc(256, 256, 110, 0, Math.PI * 2);
    ctx.fillStyle = '#3a3f47';
    ctx.fill();
    ctx.strokeStyle = '#7c828d';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(256, 256, 75, 0, Math.PI * 2);
    ctx.fillStyle = '#25272b';
    ctx.fill();
    ctx.strokeStyle = '#c4af75';
    ctx.lineWidth = 3;
    ctx.stroke();

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }, []);

  // Calculate responsive FOV & Camera Distance for Mobile / Tablet / Desktop
  const getResponsiveCameraSettings = useCallback((w: number, h: number) => {
    const aspect = w / h;
    let fov = 52;
    let distance = 4.8;
    let lookAtY = 1.45;

    if (aspect < 0.7) {
      // Tall Mobile Phone (Portrait e.g. iPhone, Android)
      fov = 68;
      distance = 5.2;
      lookAtY = 1.55;
    } else if (aspect < 1.0) {
      // Small Tablet or Squarish Mobile screen
      fov = 60;
      distance = 5.0;
      lookAtY = 1.50;
    } else if (w < 1024) {
      // Tablet Landscape
      fov = 54;
      distance = 4.9;
      lookAtY = 1.45;
    }

    return { fov, distance, lookAtY };
  }, []);

  // Category Focus Trigger (Smooth Camera Swivel to Shelf close-up)
  useEffect(() => {
    const targetCatId =
      selectedCategory ||
      (activeCategoryIndex !== null && categories[activeCategoryIndex]
        ? categories[activeCategoryIndex].id
        : null);

    if (!targetCatId) return;

    const bay = SHELF_BAYS.find((b) => b.catId === targetCatId);
    if (bay) {
      const isMobile = window.innerWidth < 768;
      cameraState.current.targetYaw = bay.angle + Math.PI;
      cameraState.current.targetDistance = isMobile ? 1.7 : 1.35;
      cameraState.current.targetPitch = isMobile ? 0.04 : 0.02;
      cameraState.current.autoRotate = false;
      cameraState.current.lastInteractionTime = Date.now();
      if (onClearCategoryFocus) onClearCategoryFocus();
    }
  }, [selectedCategory, activeCategoryIndex, categories, onClearCategoryFocus]);

  // Handle Zoom In / Zoom Out Actions
  useEffect(() => {
    if (!zoomAction) return;
    const c = cameraState.current;
    if (zoomAction.type === 'in') {
      c.targetDistance = Math.max(c.minDistance, c.targetDistance - 1.1);
    } else if (zoomAction.type === 'out') {
      c.targetDistance = Math.min(c.maxDistance, c.targetDistance + 1.1);
    } else if (zoomAction.type === 'reset') {
      const isMobile = window.innerWidth < 768;
      c.targetDistance = isMobile ? 5.2 : 4.8;
      c.targetYaw = Math.PI;
      c.targetPitch = isMobile ? 0.04 : 0.04;
      c.autoRotate = true;
    }
    c.lastInteractionTime = Date.now();
  }, [zoomAction]);

  // Handle Orbit Directional Controls
  useEffect(() => {
    if (!orbitAction) return;
    const c = cameraState.current;
    if (orbitAction.dir === 'left') {
      c.targetYaw -= 0.35;
    } else if (orbitAction.dir === 'right') {
      c.targetYaw += 0.35;
    } else if (orbitAction.dir === 'up') {
      c.targetPitch = Math.min(1.3, c.targetPitch + 0.2);
    } else if (orbitAction.dir === 'down') {
      c.targetPitch = Math.max(-1.3, c.targetPitch - 0.2);
    }
    c.autoRotate = false;
    c.lastInteractionTime = Date.now();
  }, [orbitAction]);

  // Mobile Device Orientation Gyroscope
  useEffect(() => {
    if (!isSensorEnabled) return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        cameraState.current.gyroYaw = (e.gamma * Math.PI) / 220;
        cameraState.current.gyroPitch = ((e.beta - 45) * Math.PI) / 320;
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [isSensorEnabled]);

  // Main Three.js Scene Setup & Render Loop
  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth || window.innerWidth;
    const height = containerRef.current.clientHeight || window.innerHeight;

    // 1. Scene, Camera, WebGL Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0604);
    scene.fog = new THREE.FogExp2(0x0a0604, 0.015);

    const initialSettings = getResponsiveCameraSettings(width, height);
    cameraState.current.distance = initialSettings.distance;
    cameraState.current.targetDistance = initialSettings.distance;
    cameraState.current.targetLookAt.y = initialSettings.lookAtY;
    cameraState.current.currentLookAt.y = initialSettings.lookAtY;

    const camera = new THREE.PerspectiveCamera(initialSettings.fov, width / height, 0.1, 100);
    camera.position.set(0, initialSettings.lookAtY + 0.25, initialSettings.distance);

    if (!containerRef.current) return;

let renderer: THREE.WebGLRenderer;

try {
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
  });
} catch (error) {
  console.error('AYT Books 3D WebGL initialization failed:', error);
  return;
}
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 3));
    renderer.shadowMap.enabled = !reducedMotion;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    containerRef.current.replaceChildren(renderer.domElement);

    // 2. Warm Atmospheric Lighting
    const ambientLight = new THREE.AmbientLight(0xffecd0, 0.78);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffe8c8, 0x1f140a, 0.85);
    hemiLight.position.set(0, 15, 0);
    scene.add(hemiLight);

    // Central Chandelier Light
    const centerPointLight = new THREE.PointLight(0xffd580, 1.5, 18);
    centerPointLight.position.set(0, 4.2, 0);
    centerPointLight.castShadow = !reducedMotion;
    scene.add(centerPointLight);

    // 3. Polished Marble & Granite Tile Floor
    const floorGeo = new THREE.CircleGeometry(8.5, 48);
    const floorMat = new THREE.MeshStandardMaterial({
      map: createHardwoodParquetFloorTexture(),
      roughness: 0.16,
      metalness: 0.18,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Solid Rotunda Wall enclosing the library behind the shelves
    const wallRadius = 4.88;
    const wallHeight = 4.8;
    const wallGeo = new THREE.CylinderGeometry(wallRadius, wallRadius, wallHeight, 48, 1, true);
    const wallMat = new THREE.MeshStandardMaterial({
      map: createRichMahoganyWallTexture(),
      side: THREE.BackSide,
      roughness: 0.65,
    });
    const wallMesh = new THREE.Mesh(wallGeo, wallMat);
    wallMesh.position.y = wallHeight / 2;
    wallMesh.receiveShadow = true;
    scene.add(wallMesh);

    // Wall Gold Crown Molding Top Ring
    const crownTorus = new THREE.Mesh(
      new THREE.TorusGeometry(wallRadius - 0.04, 0.08, 10, 48),
      new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85, roughness: 0.25 })
    );
    crownTorus.rotation.x = Math.PI / 2;
    crownTorus.position.y = wallHeight;
    scene.add(crownTorus);

    // Wall Baseboard Bottom Trim Ring
    const baseboardTorus = new THREE.Mesh(
      new THREE.TorusGeometry(wallRadius - 0.04, 0.08, 10, 48),
      new THREE.MeshStandardMaterial({ color: 0x1a0f08, roughness: 0.4 })
    );
    baseboardTorus.rotation.x = Math.PI / 2;
    baseboardTorus.position.y = 0.05;
    scene.add(baseboardTorus);

    // Ash / Slate Gray Luxury Carpet Mat in Center
    const carpetGeo = new THREE.CircleGeometry(2.4, 36);
    const carpetMat = new THREE.MeshStandardMaterial({ map: createAshMatTexture(), roughness: 0.92 });
    const carpetMesh = new THREE.Mesh(carpetGeo, carpetMat);
    carpetMesh.rotation.x = -Math.PI / 2;
    carpetMesh.position.y = 0.01;
    scene.add(carpetMesh);

    // 4. Domed Vaulted Ceiling & Glass Skylight
    const domeGeo = new THREE.SphereGeometry(10, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const domeMat = new THREE.MeshStandardMaterial({ color: 0x181008, side: THREE.BackSide, roughness: 0.9 });
    const domeMesh = new THREE.Mesh(domeGeo, domeMat);
    domeMesh.position.y = 0;
    scene.add(domeMesh);

    // Hanging Ornate Chandelier in Center
    const chandelierGroup = new THREE.Group();
    chandelierGroup.position.set(0, 4.2, 0);
    const ringTorus = new THREE.Mesh(
      new THREE.TorusGeometry(1.4, 0.07, 12, 32),
      new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 })
    );
    ringTorus.rotation.x = Math.PI / 2;
    chandelierGroup.add(ringTorus);

    // Chandelier hanging chain
    const chainMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 2.8, 8),
      new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9 })
    );
    chainMesh.position.y = 1.4;
    chandelierGroup.add(chainMesh);
    scene.add(chandelierGroup);

    // 5. CENTER READING TABLE ON TOP OF THE ASH MAT (With Open Book & Lamp)
    const tableGroup = new THREE.Group();
    tableGroup.position.set(0, 0, 0); // Placed right on center of the ash mat

    // Tabletop (Polished Rich Walnut Wood)
    const tableTop = new THREE.Mesh(
      new THREE.CylinderGeometry(1.15, 1.15, 0.07, 32),
      new THREE.MeshStandardMaterial({ color: 0x2b180d, roughness: 0.28, metalness: 0.08 })
    );
    tableTop.position.y = 0.72;
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    tableGroup.add(tableTop);

    // Table Rim Gold Inlay
    const tableRim = new THREE.Mesh(
      new THREE.TorusGeometry(1.15, 0.02, 10, 32),
      new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85, roughness: 0.3 })
    );
    tableRim.rotation.x = Math.PI / 2;
    tableRim.position.y = 0.72;
    tableGroup.add(tableRim);

    // Central Carved Table Pedestal & Base
    const tablePedestal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.2, 0.68, 16),
      new THREE.MeshStandardMaterial({ color: 0x24140a, roughness: 0.35 })
    );
    tablePedestal.position.y = 0.35;
    tablePedestal.castShadow = true;
    tableGroup.add(tablePedestal);

    const tableBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.55, 0.62, 0.05, 24),
      new THREE.MeshStandardMaterial({ color: 0x24140a, roughness: 0.35 })
    );
    tableBase.position.y = 0.03;
    tableBase.receiveShadow = true;
    tableGroup.add(tableBase);

    // --- ON TOP OF TABLE: OPEN BOOK ---
    const openBookGroup = new THREE.Group();
    openBookGroup.position.set(0, 0.76, 0.15);
    openBookGroup.rotation.y = 0;

    // Book Leather Cover base
    const bookCoverBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.68, 0.015, 0.46),
      new THREE.MeshStandardMaterial({ color: 0x5a1818, roughness: 0.5 })
    );
    openBookGroup.add(bookCoverBase);

    // Left Open Page (Angled slightly)
    const pageLeft = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.015, 0.42),
      new THREE.MeshStandardMaterial({ color: 0xfaf5e8, roughness: 0.9 })
    );
    pageLeft.position.set(-0.155, 0.015, 0);
    pageLeft.rotation.z = 0.06;
    openBookGroup.add(pageLeft);

    // Right Open Page (Angled slightly)
    const pageRight = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.015, 0.42),
      new THREE.MeshStandardMaterial({ color: 0xfaf5e8, roughness: 0.9 })
    );
    pageRight.position.set(0.155, 0.015, 0);
    pageRight.rotation.z = -0.06;
    openBookGroup.add(pageRight);

    // Red Silk Bookmark Ribbon
    const ribbon = new THREE.Mesh(
      new THREE.PlaneGeometry(0.035, 0.28),
      new THREE.MeshBasicMaterial({ color: 0xbb2020, side: THREE.DoubleSide })
    );
    ribbon.position.set(0, 0.025, 0.1);
    ribbon.rotation.x = -Math.PI / 2;
    openBookGroup.add(ribbon);

    // Soft warm reading light hovering over open book
    const bookLight = new THREE.PointLight(0xfff6dc, 0.9, 2.4);
    bookLight.position.set(0, 0.35, 0);
    openBookGroup.add(bookLight);

    tableGroup.add(openBookGroup);

    // --- ON TOP OF TABLE: GREEN BANKER'S READING LAMP ---
    const lampBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.11, 0.025, 16),
      new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 })
    );
    lampBase.position.set(-0.55, 0.77, -0.22);
    tableGroup.add(lampBase);

    const lampPole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.018, 0.018, 0.28, 8),
      new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 })
    );
    lampPole.position.set(-0.55, 0.92, -0.22);
    tableGroup.add(lampPole);

    const lampShade = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.12, 0.18, 16),
      new THREE.MeshStandardMaterial({ color: 0x0f4d2a, roughness: 0.25 })
    );
    lampShade.position.set(-0.55, 1.05, -0.22);
    lampShade.rotation.z = Math.PI / 2;
    tableGroup.add(lampShade);

    const deskLampGlow = new THREE.PointLight(0xffe89e, 1.2, 3.2);
    deskLampGlow.position.set(-0.55, 1.02, -0.22);
    tableGroup.add(deskLampGlow);

    // --- ON TOP OF TABLE: STACK OF 2 CLOSED BOOKS ---
    const stackBook1 = new THREE.Mesh(
      new THREE.BoxGeometry(0.32, 0.04, 0.44),
      new THREE.MeshStandardMaterial({ color: 0x1a2e40, roughness: 0.5 })
    );
    stackBook1.position.set(0.55, 0.78, -0.15);
    tableGroup.add(stackBook1);

    const stackBook2 = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.038, 0.4),
      new THREE.MeshStandardMaterial({ color: 0x4a1818, roughness: 0.5 })
    );
    stackBook2.position.set(0.53, 0.82, -0.15);
    stackBook2.rotation.y = 0.15;
    tableGroup.add(stackBook2);

    // --- ON TOP OF TABLE: CERAMIC PLANT POT ---
    const plantPot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.06, 0.11, 14),
      new THREE.MeshStandardMaterial({ color: 0x8a4522, roughness: 0.7 })
    );
    plantPot.position.set(0.65, 0.81, 0.35);
    tableGroup.add(plantPot);

    const plantSucculent = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 10, 10),
      new THREE.MeshStandardMaterial({ color: 0x2e6330, roughness: 0.8 })
    );
    plantSucculent.position.set(0.65, 0.91, 0.35);
    tableGroup.add(plantSucculent);

    scene.add(tableGroup);

    // 6. CLOSE-UP 360° SURROUNDING BOOKSHELVES & ROTUNDA COLUMNS
    const shelfMat = new THREE.MeshStandardMaterial({ color: 0x291a0f, roughness: 0.48 });
    const bookMeshList: { mesh: THREE.Group; book: Book; initialPos: THREE.Vector3; initialRot: THREE.Euler }[] = [];
    const shelfRadius = 4.4; // Brought intimate & close to the user!

    // Architectural Pillars between bookshelf bays in 360°
    for (let i = 0; i < 5; i++) {
      const pillarAngle = (i * 2 * Math.PI) / 5 + Math.PI / 5;
      const pX = Math.sin(pillarAngle) * (shelfRadius + 0.18);
      const pZ = Math.cos(pillarAngle) * (shelfRadius + 0.18);

      const pillarGroup = new THREE.Group();
      pillarGroup.position.set(pX, 0, pZ);

      // Fluted Marble/Wood Column
      const col = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.26, 4.0, 20),
        new THREE.MeshStandardMaterial({ color: 0x24160c, roughness: 0.4, metalness: 0.1 })
      );
      col.position.y = 2.0;
      pillarGroup.add(col);

      // Gold Capital & Base
      const capGeo = new THREE.BoxGeometry(0.65, 0.14, 0.65);
      const capMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.8, roughness: 0.3 });
      const capMesh = new THREE.Mesh(capGeo, capMat);
      capMesh.position.y = 4.0;
      pillarGroup.add(capMesh);

      const baseMesh = new THREE.Mesh(capGeo, capMat);
      baseMesh.position.y = 0.07;
      pillarGroup.add(baseMesh);

      // Warm Wall Sconce on each pillar
      const sconceLight = new THREE.PointLight(0xffdf88, 0.5, 4.5);
      sconceLight.position.set(0, 2.4, -0.3);
      pillarGroup.add(sconceLight);

      scene.add(pillarGroup);
    }

    SHELF_BAYS.forEach((bay) => {
      const bayBooks = books.filter((b) => b.categoryId === bay.catId);
      const shelfUnitGroup = new THREE.Group();

      // Position along 360° perimeter circle facing towards center
      const posX = Math.sin(bay.angle) * shelfRadius;
      const posZ = Math.cos(bay.angle) * shelfRadius;
      shelfUnitGroup.position.set(posX, 0, posZ);

      // Rotate to face directly towards center (0,0,0)
      const rotY = bay.angle + Math.PI;
      shelfUnitGroup.rotation.y = rotY;

      // Structure Dimensions (Fitted for intimate close-up viewing)
      const sWidth = 3.6;
      const sHeight = 3.8;
      const sDepth = 0.6;

      // Back Wall Panel
      const backPanel = new THREE.Mesh(new THREE.BoxGeometry(sWidth, sHeight, 0.08), shelfMat);
      backPanel.position.set(0, sHeight / 2, -sDepth / 2);
      shelfUnitGroup.add(backPanel);

      // Side Pillars
      const sideLeft = new THREE.Mesh(new THREE.BoxGeometry(0.12, sHeight, sDepth), shelfMat);
      sideLeft.position.set(-sWidth / 2, sHeight / 2, 0);
      shelfUnitGroup.add(sideLeft);

      const sideRight = new THREE.Mesh(new THREE.BoxGeometry(0.12, sHeight, sDepth), shelfMat);
      sideRight.position.set(sWidth / 2, sHeight / 2, 0);
      shelfUnitGroup.add(sideRight);

      // Overhead Illuminated Signage Header (1024x256 Ultra-HD)
      const headerCanvas = document.createElement('canvas');
      headerCanvas.width = 1024;
      headerCanvas.height = 256;
      const hCtx = headerCanvas.getContext('2d');
      if (hCtx) {
        hCtx.imageSmoothingEnabled = true;
        hCtx.imageSmoothingQuality = 'high';

        hCtx.fillStyle = '#100a06';
        hCtx.fillRect(0, 0, 1024, 256);

        // Gold border with inner glow
        hCtx.strokeStyle = '#e6bf55';
        hCtx.lineWidth = 14;
        hCtx.strokeRect(10, 10, 1004, 236);
        hCtx.strokeStyle = '#fff2b2';
        hCtx.lineWidth = 4;
        hCtx.strokeRect(26, 26, 972, 204);

        // Category Icon & English Header with black outline for razor-sharp legibility
        const signText = `${bay.icon}  ${bay.name}`;
        hCtx.font = 'bold 68px "Cinzel", "Hind Siliguri", sans-serif';
        hCtx.textAlign = 'center';
        hCtx.textBaseline = 'middle';

        hCtx.strokeStyle = '#000000';
        hCtx.lineWidth = 12;
        hCtx.strokeText(signText, 512, 128);

        hCtx.fillStyle = '#ffffff';
        hCtx.fillText(signText, 512, 128);
      }
      const headerTex = new THREE.CanvasTexture(headerCanvas);
      headerTex.generateMipmaps = false;
      headerTex.minFilter = THREE.LinearFilter;
      headerTex.magFilter = THREE.LinearFilter;
      headerTex.anisotropy = 16;
      headerTex.needsUpdate = true;
      const headerMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(sWidth * 0.92, 0.6),
        new THREE.MeshBasicMaterial({ map: headerTex, toneMapped: false })
      );
      headerMesh.position.set(0, sHeight + 0.35, 0);
      shelfUnitGroup.add(headerMesh);

      // Category Spotlight Lamp
      const spotLight = new THREE.PointLight(0xffe8a0, 0.85, 6.0);
      spotLight.position.set(0, sHeight + 0.2, 0.5);
      shelfUnitGroup.add(spotLight);

      // Tiers of Books (3 Shelves: Lower, Middle, Upper)
      const tiers = [0.75, 1.65, 2.55];
      tiers.forEach((tierY, tIdx) => {
        // Shelf Plank
        const shelfPlank = new THREE.Mesh(new THREE.BoxGeometry(sWidth, 0.08, sDepth), shelfMat);
        shelfPlank.position.set(0, tierY, 0);
        shelfPlank.receiveShadow = true;
        shelfUnitGroup.add(shelfPlank);

        // Books for this tier
        const tierBooks = bayBooks.filter((_, idx) => idx % tiers.length === tIdx);
        const slotSpacing = 0.92;
        const startX = -((Math.max(1, tierBooks.length) - 1) * slotSpacing) / 2;

        tierBooks.forEach((book, bIdx) => {
          const bookGroup = new THREE.Group();
          const xPos = startX + bIdx * slotSpacing;
          const bWidth = 0.54;
          const bHeight = 0.8 * (book.height || 1);
          const bThick = (book.thickness || 0.16) * 0.92;

          const coverTex = createCategoryCoverTexture(book);
          const spineTex = createSpineTexture(book);
          const pagesMat = new THREE.MeshStandardMaterial({ color: 0xf5eedc, roughness: 0.9 });
          const coverMat = new THREE.MeshStandardMaterial({ map: coverTex, roughness: 0.25 });
          const spineMat = new THREE.MeshStandardMaterial({ map: spineTex, roughness: 0.25 });

          const materials = [
            coverMat, // Right edge
            spineMat, // Left spine
            pagesMat, // Top
            pagesMat, // Bottom
            coverMat, // Front Cover
            coverMat, // Back Cover
          ];

          const bookBoxMesh = new THREE.Mesh(new THREE.BoxGeometry(bWidth, bHeight, bThick), materials);
          bookBoxMesh.castShadow = true;
          bookBoxMesh.receiveShadow = true;
          bookGroup.add(bookBoxMesh);

          // Position on Shelf
          bookGroup.position.set(xPos, tierY + bHeight / 2 + 0.04, 0.1);
          bookGroup.rotation.x = -0.04;

          bookGroup.userData = { book };
          bookBoxMesh.userData = { book, bookGroup };

          shelfUnitGroup.add(bookGroup);

          // Title Plaque below book (High-visibility, crisp angle and toneMapped: false)
          const plaqueTex = createTitlePlaqueTexture(book);
          const plaqueMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(bWidth * 1.05, 0.13),
            new THREE.MeshBasicMaterial({ map: plaqueTex, toneMapped: false })
          );
          plaqueMesh.position.set(xPos, tierY - 0.03, 0.21);
          plaqueMesh.rotation.x = -0.2;
          shelfUnitGroup.add(plaqueMesh);

          bookMeshList.push({
            mesh: bookGroup,
            book,
            initialPos: bookGroup.position.clone(),
            initialRot: bookGroup.rotation.clone(),
          });
        });
      });

      scene.add(shelfUnitGroup);
    });

    bookMeshesRef.current = bookMeshList;

    // 7. Ambient Floating Dust Particles
    const particleCount = 100;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 16;
      particlePos[i + 1] = Math.random() * 5.5 + 0.5;
      particlePos[i + 2] = (Math.random() - 0.5) * 16;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffe899,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
    });
    const dustPoints = new THREE.Points(particleGeo, particleMat);
    scene.add(dustPoints);

    // 8. Raycaster for Book Interaction
    const raycaster = new THREE.Raycaster();
    const mouseCoord = new THREE.Vector2();

    const getRaycastBook = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseCoord.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouseCoord.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouseCoord, camera);

      const allChildren: THREE.Object3D[] = [];
      bookMeshList.forEach((item) => {
        allChildren.push(...item.mesh.children);
      });

      const intersects = raycaster.intersectObjects(allChildren, true);
      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hit.userData?.book) {
          return { book: hit.userData.book as Book, group: hit.userData.bookGroup as THREE.Group };
        }
        if (hit.parent?.userData?.book) {
          return { book: hit.parent.userData.book as Book, group: hit.parent as THREE.Group };
        }
      }
      return null;
    };

    // Mouse & Touch Controls with precise Tap vs Drag discrimination
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    let touchMoved = false;
    let lastTouchEndTime = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const c = cameraState.current;
      c.isDragging = true;
      c.autoRotate = false;
      c.lastInteractionTime = Date.now();

      if ('touches' in e) {
        if (e.touches.length === 1) {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
          touchStartTime = Date.now();
          touchMoved = false;
          c.prevMouseX = e.touches[0].clientX;
          c.prevMouseY = e.touches[0].clientY;
        } else if (e.touches.length === 2) {
          c.prevTouchDist = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
          );
        }
      } else {
        c.prevMouseX = e.clientX;
        c.prevMouseY = e.clientY;
      }
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      const c = cameraState.current;
      const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0]?.clientY : e.clientY;

      if (c.isDragging) {
        c.lastInteractionTime = Date.now();

        if ('touches' in e && e.touches.length === 2) {
          const dist = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
          );
          const delta = (c.prevTouchDist - dist) * 0.012;
          c.prevTouchDist = dist;
          c.targetDistance = Math.max(c.minDistance, Math.min(c.maxDistance, c.targetDistance + delta));
        } else if (clientX !== undefined && clientY !== undefined) {
          if ('touches' in e) {
            const distFromStart = Math.hypot(clientX - touchStartX, clientY - touchStartY);
            if (distFromStart > 8) {
              touchMoved = true;
            }
          }

          const dx = clientX - c.prevMouseX;
          const dy = clientY - c.prevMouseY;
          c.prevMouseX = clientX;
          c.prevMouseY = clientY;

          // Responsive rotation multiplier for touch vs desktop
          const speedMultiplier = 'touches' in e ? 0.0065 : 0.005;
          const pitchMultiplier = 'touches' in e ? 0.0045 : 0.0035;

          c.targetYaw -= dx * speedMultiplier;
          c.targetPitch += dy * pitchMultiplier;
          c.targetPitch = Math.max(-1.3, Math.min(1.3, c.targetPitch));
        }
      }

      // Desktop Hover Detection
      if (!('touches' in e) && clientX !== undefined && clientY !== undefined) {
        const hit = getRaycastBook(clientX, clientY);
        if (hit) {
          setHoveredBook(hit.book);
          setHoverBadgePos({ x: clientX, y: clientY });
          renderer.domElement.style.cursor = 'pointer';
        } else {
          setHoveredBook(null);
          setHoverBadgePos(null);
          renderer.domElement.style.cursor = 'grab';
        }
      }
    };

    const onPointerUp = () => {
      cameraState.current.isDragging = false;
      cameraState.current.lastInteractionTime = Date.now();
    };

    const onTouchEnd = (e: TouchEvent) => {
      cameraState.current.isDragging = false;
      cameraState.current.lastInteractionTime = Date.now();
      lastTouchEndTime = Date.now();

      // If finger moved less than 8px and took less than 350ms, it was a clean intentional tap
      if (!touchMoved && Date.now() - touchStartTime < 350) {
        const hit = getRaycastBook(touchStartX, touchStartY);
        if (hit) {
          soundEngine.playInteract();
          onSelectBook(hit.book);
        }
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const c = cameraState.current;
      c.targetDistance = Math.max(c.minDistance, Math.min(c.maxDistance, c.targetDistance + e.deltaY * 0.005));
      c.autoRotate = false;
      c.lastInteractionTime = Date.now();
    };

    const onClick = (e: MouseEvent) => {
      // Ignore synthetic click fired by browser after a touch interaction
      if (Date.now() - lastTouchEndTime < 450) {
        return;
      }
      const hit = getRaycastBook(e.clientX, e.clientY);
      if (hit) {
        soundEngine.playInteract();
        onSelectBook(hit.book);
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onPointerDown);
    dom.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    dom.addEventListener('wheel', onWheel, { passive: false });
    dom.addEventListener('click', onClick);

    dom.addEventListener('touchstart', onPointerDown, { passive: true });
    dom.addEventListener('touchmove', onPointerMove, { passive: true });
    dom.addEventListener('touchend', onTouchEnd, { passive: true });

    // 9. 60 FPS Render Loop
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const c = cameraState.current;

      // Subtle auto-rotation when idle
      if (c.autoRotate && Date.now() - c.lastInteractionTime > 6000) {
        c.targetYaw += c.autoRotateSpeed;
      }

      // Smooth camera interpolation
      c.yaw += (c.targetYaw - c.yaw) * 0.08;
      c.pitch += (c.targetPitch - c.pitch) * 0.08;
      c.distance += (c.targetDistance - c.distance) * 0.08;

      const currentYaw = c.yaw + c.gyroYaw;
      const currentPitch = c.pitch + c.gyroPitch;

      const sinPitch = Math.sin(currentPitch);

      // The bookshelf radial target position in gaze direction
      const shelfRadius = 4.35;
      const targetX = -Math.sin(currentYaw) * shelfRadius;
      const targetZ = -Math.cos(currentYaw) * shelfRadius;
      const targetY = 1.55;

      // Camera offset from the shelf along the line of sight (c.distance: 0.65m to 7.0m)
      const distFromShelf = c.distance;
      camera.position.x = targetX + Math.sin(currentYaw) * distFromShelf;
      camera.position.y = targetY + sinPitch * Math.min(distFromShelf * 0.65, 2.4);
      camera.position.z = targetZ + Math.cos(currentYaw) * distFromShelf;

      c.targetLookAt.set(
        targetX - Math.sin(currentYaw) * 0.4,
        targetY - sinPitch * Math.max(0.4, distFromShelf * 0.5),
        targetZ - Math.cos(currentYaw) * 0.4
      );
      c.currentLookAt.lerp(c.targetLookAt, 0.1);
      camera.lookAt(c.currentLookAt);

      dustPoints.rotation.y += 0.0005;

      // Hover float animation
      bookMeshList.forEach((item) => {
        if (hoveredBook && item.book.id === hoveredBook.id) {
          item.mesh.position.z = THREE.MathUtils.lerp(item.mesh.position.z, 0.35, 0.15);
          item.mesh.scale.set(1.06, 1.06, 1.06);
        } else {
          item.mesh.position.z = THREE.MathUtils.lerp(item.mesh.position.z, 0.12, 0.1);
          item.mesh.scale.set(1, 1, 1);
        }
      });

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth || window.innerWidth;
      const h = containerRef.current.clientHeight || window.innerHeight;
      const res = getResponsiveCameraSettings(w, h);
      camera.fov = res.fov;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 3));
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', onPointerDown);
      dom.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      dom.removeEventListener('wheel', onWheel);
      dom.removeEventListener('click', onClick);
      dom.removeEventListener('touchstart', onPointerDown);
      dom.removeEventListener('touchmove', onPointerMove);
      dom.removeEventListener('touchend', onTouchEnd);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
    };
  }, [
    books,
    createAshMatTexture,
    createCategoryCoverTexture,
    createHardwoodParquetFloorTexture,
    createSpineTexture,
    createTitlePlaqueTexture,
    createRichMahoganyWallTexture,
    fontsReady,
    getResponsiveCameraSettings,
    hoveredBook,
    onSelectBook,
    reducedMotion,
  ]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-[#0a0604]">
      {/* 3D WebGL Canvas */}
      <div
        ref={containerRef}
        id="ayt-3d-library-canvas"
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
      />

      {/* Mobile Quick Shelf Ribbon Bar (Tap to rotate directly to any shelf) */}
      <div
        id="mobile-shelf-quick-selector"
        className="md:hidden absolute top-14 left-0 right-0 z-30 flex items-center gap-1.5 px-3 py-1.5 overflow-x-auto no-scrollbar bg-black/50 backdrop-blur-md border-b border-stone-800/60"
      >
        <span className="text-[10px] font-bold text-[#d4af37] font-['Cinzel'] uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> শেলফ:
        </span>
        {SHELF_BAYS.map((bay) => (
          <button
            key={bay.catId}
            onClick={() => {
              cameraState.current.targetYaw = bay.angle + Math.PI;
              cameraState.current.targetDistance = 1.6;
              cameraState.current.targetPitch = 0.04;
              cameraState.current.autoRotate = false;
              cameraState.current.lastInteractionTime = Date.now();
              soundEngine.playInteract();
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-900/90 border border-stone-700/70 hover:border-[#d4af37] text-stone-200 text-[11px] font-['Hind_Siliguri'] shrink-0 active:scale-95 transition-all shadow"
          >
            <span>{bay.icon}</span>
            <span className="font-medium whitespace-nowrap">{bay.name}</span>
          </button>
        ))}
      </div>

      {/* Floating Hover Badge on Desktop */}
      {hoveredBook && hoverBadgePos && (
        <div
          id="shelf-book-hover-card"
          className="fixed pointer-events-none z-40 transform -translate-x-1/2 -translate-y-full -mt-4 transition-transform duration-75"
          style={{ left: hoverBadgePos.x, top: hoverBadgePos.y }}
        >
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-stone-950/95 border-2 border-[#d4af37] shadow-[0_10px_30px_rgba(0,0,0,0.9)] backdrop-blur-md">
            <div
              className="w-7 h-9 rounded-sm flex items-center justify-center text-stone-950 font-bold text-[10px]"
              style={{ backgroundColor: hoveredBook.coverColor }}
            >
              <BookOpen className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="flex flex-col text-left font-['Hind_Siliguri']">
              <span className="text-[10px] text-[#e5c158] font-semibold">{hoveredBook.category}</span>
              <span className="text-xs font-bold text-white leading-tight">{hoveredBook.banglaTitle}</span>
              <span className="text-[10px] text-stone-400">{hoveredBook.author}</span>
            </div>
            <span className="ml-1 text-[10px] text-[#f1c40f] font-mono font-bold bg-[#d4af37]/20 px-2 py-0.5 rounded-full">
              ক্লিক করুন
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
