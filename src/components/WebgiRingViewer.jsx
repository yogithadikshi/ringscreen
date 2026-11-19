import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const DIAMOND_COLORS = {
  default: 0xffffff,
  ruby: 0xba1333,
  faint: 0xffdfeb,
  fancy: 0xffa8c8,
  aqua: 0x39cffe,
  swiss: 0x0088ff,
  yellow: 0xffd700,
  orange: 0xff7700,
  green: 0x44dd66,
  emerald: 0x00aa55,
  rose: 0xf70db1,
  violet: 0xc200f2,
};

const MATERIAL_PRESETS = {
  default: { silver: 0xfefefe, gold: 0xe2bf7f },
  'silver-gold': { silver: 0xfefefe, gold: 0xe2bf7f },
  'silver-silver': { silver: 0xfefefe, gold: 0xfefefe },
  'gold-gold': { silver: 0xe2bf7f, gold: 0xe2bf7f },
  'rose-silver': { silver: 0xfefefe, gold: 0xd28b8b },
  'gold-rose': { silver: 0xd28b8b, gold: 0xe2bf7f },
  'rose-rose': { silver: 0xd28b8b, gold: 0xd28b8b },
};

// Exact WebGi Multi-Metal & Gemstone Color Transitions (from https://webgi-jewelry.vercel.app/)
// View 1 (Hero): Silver (0xfefefe) + Yellow Gold (0xe2bf7f) + White Diamond (0xffffff)
// View 2 (Details): Rose Gold (0xd28b8b) + Rose Gold (0xd28b8b) + Aqua Diamond (0x39cffe)
// View 3 (Vault): Sovereign Gold (0xf7c478) + Sovereign Gold (0xf7c478) + Ruby (0xf70db1)
// View 4 (Footer): Platinum/Silver (0xfefefe) + Platinum/Silver (0xfefefe) + Light Purple (0xc200f2)
const STAGE_COLORS = {
  hero: {
    silver: new THREE.Color(0xfefefe).convertSRGBToLinear(),
    gold: new THREE.Color(0xe2bf7f).convertSRGBToLinear(),
    stone: new THREE.Color(0xffffff).convertSRGBToLinear(),
  },
  details: {
    silver: new THREE.Color(0xd28b8b).convertSRGBToLinear(),
    gold: new THREE.Color(0xd28b8b).convertSRGBToLinear(),
    stone: new THREE.Color(0x39cffe).convertSRGBToLinear(),
  },
  vault: {
    silver: new THREE.Color(0xf7c478).convertSRGBToLinear(),
    gold: new THREE.Color(0xf7c478).convertSRGBToLinear(),
    stone: new THREE.Color(0xf70db1).convertSRGBToLinear(),
  },
  footer: {
    silver: new THREE.Color(0xfefefe).convertSRGBToLinear(),
    gold: new THREE.Color(0xfefefe).convertSRGBToLinear(),
    stone: new THREE.Color(0xc200f2).convertSRGBToLinear(),
  },
};

/**
 * Procedural Needle-Fine Diamond Glint Texture (WebGi-style Micro Sparkle)
 * Sharp 8-point pinpoint star with subtle core glow and needle rays.
 */
function createMicroSparkleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 128, 128);

  const cx = 64;
  const cy = 64;

  // Tiny intense core glow
  const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 14);
  coreGrad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
  coreGrad.addColorStop(0.25, 'rgba(255, 250, 242, 0.85)');
  coreGrad.addColorStop(0.6, 'rgba(255, 235, 220, 0.25)');
  coreGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = coreGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, 14, 0, Math.PI * 2);
  ctx.fill();

  // Needle-thin horizontal ray
  const hGrad = ctx.createLinearGradient(0, cy, 128, cy);
  hGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
  hGrad.addColorStop(0.35, 'rgba(255, 255, 255, 0.4)');
  hGrad.addColorStop(0.5, 'rgba(255, 255, 255, 1.0)');
  hGrad.addColorStop(0.65, 'rgba(255, 255, 255, 0.4)');
  hGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = hGrad;
  ctx.beginPath();
  ctx.moveTo(0, cy);
  ctx.lineTo(cx, cy - 1.2);
  ctx.lineTo(128, cy);
  ctx.lineTo(cx, cy + 1.2);
  ctx.closePath();
  ctx.fill();

  // Needle-thin vertical ray
  const vGrad = ctx.createLinearGradient(cx, 0, cx, 128);
  vGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
  vGrad.addColorStop(0.35, 'rgba(255, 255, 255, 0.4)');
  vGrad.addColorStop(0.5, 'rgba(255, 255, 255, 1.0)');
  vGrad.addColorStop(0.65, 'rgba(255, 255, 255, 0.4)');
  vGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = vGrad;
  ctx.beginPath();
  ctx.moveTo(cx, 0);
  ctx.lineTo(cx - 1.2, cy);
  ctx.lineTo(cx, 128);
  ctx.lineTo(cx + 1.2, cy);
  ctx.closePath();
  ctx.fill();

  // Diagonal subtle secondary rays
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(Math.PI / 4);
  const dGrad = ctx.createLinearGradient(-30, 0, 30, 0);
  dGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
  dGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.7)');
  dGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = dGrad;
  ctx.beginPath();
  ctx.moveTo(-30, 0);
  ctx.lineTo(0, -0.8);
  ctx.lineTo(30, 0);
  ctx.lineTo(0, 0.8);
  ctx.closePath();
  ctx.fill();

  ctx.rotate(Math.PI / 2);
  ctx.beginPath();
  ctx.moveTo(-30, 0);
  ctx.lineTo(0, -0.8);
  ctx.lineTo(30, 0);
  ctx.lineTo(0, 0.8);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Floating Diamond Dust / Stardust Glitter Particles
 * Generates an ethereal cloud of 70 micro-particles that drift and twinkle around the jewellery
 */
function createGlitterParticles(count = 70) {
  const geom = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  const speeds = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const r = 1.3 + Math.random() * 1.6;

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);

    phases[i] = Math.random() * Math.PI * 2;
    speeds[i] = 0.8 + Math.random() * 1.4;
  }

  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
  g.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
  g.addColorStop(0.3, 'rgba(255, 245, 225, 0.85)');
  g.addColorStop(0.7, 'rgba(255, 225, 190, 0.25)');
  g.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(32, 32, 30, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);

  const mat = new THREE.PointsMaterial({
    size: 0.10,
    map: texture,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    color: 0xfff6ea,
  });

  const points = new THREE.Points(geom, mat);
  return { points, geom, positions, phases, speeds, count };
}

/**
 * Universal Responsive Camera Calculator
 * Computes optimal Camera FOV, Position and Target for:
 * - 4K UHD, 5K, 6K, QHD & Standard Desktop Monitors
 * - Ultrawide (21:9) & Super Ultrawide (32:9) Displays
 * - Laptops (11", 13", 14", 15.6", 16", 17", MacBook Air/Pro, Windows)
 * - Tablets (iPad Mini, iPad Air, iPad Pro 11"/13", Android Tablets, Surface Pro in Portrait & Landscape)
 * - Apple iPhones (iPhone SE, 12, 13, 14, 15, 16, 17 series in Portrait & Landscape)
 * - Foldables & High-DPI Retina Displays
 */
function getResponsiveCameraConfig(width, height) {
  const aspect = width / height;
  const isMobileLandscape = height <= 540 && aspect >= 1.35;
  const isMobilePortrait = width < 600 && !isMobileLandscape;
  const isTabletPortrait = !isMobilePortrait && !isMobileLandscape && (
    (width >= 600 && width < 1024 && aspect < 1.28) ||
    (width >= 1024 && aspect < 1.18)
  );
  const isDesktopLandscape = !isMobilePortrait && !isMobileLandscape && !isTabletPortrait;

  let heroFov;
  let heroCamPos, heroCamTarget;
  let detailsCamPos, detailsCamTarget;
  let authCamPos, authCamTarget, authRingRot;
  let footerCamPos, footerCamTarget, footerRingRot;

  if (isMobileLandscape) {
    // 1. MOBILE IN LANDSCAPE ORIENTATION (e.g. iPhone / Android held sideways, height 320px - 540px)
    heroFov = 38;
    heroCamPos = { x: 1.15, y: -0.42, z: 5.6 };
    heroCamTarget = { x: 0.85, y: 0.02, z: -0.2 };

    detailsCamPos = { x: -1.18, y: -0.36, z: 5.4 };
    detailsCamTarget = { x: -0.68, y: 0.06, z: -0.1 };

    // Auth: Ring on FULL LEFT side, login on right side (Frontside of ring faces the camera)
    authCamPos = { x: 2.20, y: -0.28, z: 5.4 };
    authCamTarget = { x: 1.45, y: 0.04, z: -0.1 };
    authRingRot = { x: -0.25, y: 0.12, z: -0.18 };

    footerCamPos = { x: -1.10, y: -0.40, z: 6.4 };
    footerCamTarget = { x: -0.30, y: -0.40, z: -0.1 };
    footerRingRot = { x: -0.30, y: 0.10, z: -0.85 };
  } else if (isDesktopLandscape) {
    // 2. DESKTOP, LAPTOP & ULTRAWIDE MONITORS (13" to 32", 4K, 5K, 6K, 21:9, 32:9)
    heroFov = aspect >= 2.0 ? 43 : 45;

    // Shift ring horizontally outward on ultrawide displays so it locks to the centered content column
    const ultrawideShift = aspect > 1.85 ? Math.min(2.1, (aspect - 1.777) * 0.95) : 0;
    const laptopZAdj = (height < 800 && aspect < 1.7) ? 0.35 : 0;

    // Hero: Ring placed on LEFT column (~25-30% from left edge), text on right.
    heroCamPos = { x: 1.25 + ultrawideShift * 0.75, y: -1.65, z: 5.55 + laptopZAdj + ultrawideShift * 0.15 };
    heroCamTarget = { x: 0.91 + ultrawideShift * 0.65, y: 0.03, z: -0.25 };

    // Details: Text placed on LEFT, Ring glides to the RIGHT side (~68-75% from left edge)
    detailsCamPos = { x: -1.35 - ultrawideShift * 0.75, y: -0.95, z: 5.2 + laptopZAdj + ultrawideShift * 0.15 };
    detailsCamTarget = { x: -0.75 - ultrawideShift * 0.65, y: 0.15, z: -0.15 };

    // Auth: VIP Maison Vault - Ring on FULL LEFT (~24-26% from left edge), Login/Register on FULL RIGHT
    authCamPos = { x: 3.10 + ultrawideShift * 1.15, y: -0.55, z: 5.25 + laptopZAdj + ultrawideShift * 0.15 };
    authCamTarget = { x: 2.05 + ultrawideShift * 1.05, y: 0.10, z: -0.15 };
    authRingRot = { x: -0.28, y: 0.14, z: -0.20 };

    // Footer: DIKSHI JEWELLERY Brand Signoff - Ring elevated and centered so its bottom shank gracefully crowns the top of DIKSHI JEWELLERY
    footerCamPos = { x: -1.20 - ultrawideShift * 0.4, y: -0.40, z: 6.0 + laptopZAdj };
    footerCamTarget = { x: -0.35 - ultrawideShift * 0.3, y: -0.40, z: -0.1 };
    footerRingRot = { x: -0.35, y: 0.15, z: -0.92 };
  } else if (isTabletPortrait) {
    // 3. TABLETS & FOLDABLES IN PORTRAIT (iPad Mini, iPad Air, iPad Pro 11"/13", Surface Pro 900x1440)
    heroFov = 46;
    const heroZ = Math.max(6.0, Math.min(8.2, 4.4 / Math.max(0.55, aspect)));
    heroCamPos = { x: 0, y: -0.05, z: heroZ };
    heroCamTarget = { x: 0, y: -0.80, z: -0.15 };

    const detailsZ = Math.max(6.0, Math.min(8.5, 4.2 / Math.max(0.55, aspect)));
    detailsCamPos = { x: -0.65, y: -0.10, z: detailsZ };
    detailsCamTarget = { x: -0.30, y: -0.50, z: 0.05 };

    const authZ = Math.max(6.8, Math.min(9.5, 4.4 / Math.max(0.55, aspect)));
    authCamPos = { x: 0, y: 0.10, z: authZ };
    authCamTarget = { x: 0, y: -1.00, z: -0.12 };
    authRingRot = { x: -0.25, y: 0.10, z: -0.15 };

    const footerZ = Math.max(7.2, Math.min(9.8, 4.4 / Math.max(0.55, aspect)));
    footerCamPos = { x: -0.25, y: -0.35, z: footerZ };
    footerCamTarget = { x: -0.08, y: -0.35, z: -0.1 };
    footerRingRot = { x: -0.35, y: 0.15, z: -0.92 };
  } else {
    // 4. ALL SMARTPHONES IN PORTRAIT (iPhone SE, 12, 13, 14, 15, 16, 17, Samsung Galaxy, Pixel, Fold Cover)
    // Centers ring gracefully in the upper viewport (10-14% from top, finishing at 43%)
    // Completely eliminates empty top gap and ensures zero overlap with UNIQUE JEWELLERY
    heroFov = 48;
    const heroZ = Math.max(6.2, Math.min(8.6, 3.4 / Math.max(0.35, aspect)));
    heroCamPos = { x: 0, y: -0.05, z: heroZ };
    heroCamTarget = { x: 0, y: -0.80, z: -0.15 };

    const detailsZ = Math.max(6.0, Math.min(8.8, 3.2 / Math.max(0.35, aspect)));
    detailsCamPos = { x: 0, y: 0.10, z: detailsZ };
    detailsCamTarget = { x: 0, y: -0.40, z: 0.05 };

    const authZ = Math.max(6.8, Math.min(9.5, 3.6 / Math.max(0.35, aspect)));
    authCamPos = { x: 0, y: 0.10, z: authZ };
    authCamTarget = { x: 0, y: -1.00, z: -0.12 };
    authRingRot = { x: -0.25, y: 0.10, z: -0.15 };

    const footerZ = Math.max(7.8, Math.min(10.5, 3.8 / Math.max(0.35, aspect)));
    footerCamPos = { x: 0, y: -0.30, z: footerZ };
    footerCamTarget = { x: 0, y: -0.30, z: -0.1 };
    footerRingRot = { x: -0.30, y: 0.10, z: -0.85 };
  }

  return {
    isDesktopLandscape,
    isTabletPortrait,
    isMobilePortrait,
    isMobileLandscape,
    aspect,
    heroFov,
    heroCamPos,
    heroCamTarget,
    detailsCamPos,
    detailsCamTarget,
    authCamPos,
    authCamTarget,
    authRingRot,
    footerCamPos,
    footerCamTarget,
    footerRingRot,
  };
}

export default function WebgiRingViewer({
  isDark = false,
  isCustomizing = false,
  activeGemColor = 'default',
  activeMaterial = 'default',
  currentRingModel = 1,
  onLoaded,
  onExitCustomize,
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // References to 3D objects and controls
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const jewelleryRootGroupRef = useRef(null);
  const activeModelGroupRef = useRef(null);
  const cachedGLBRef = useRef(null);
  const sparklesGroupRef = useRef(null);
  const sparklesRef = useRef([]);
  const sparkleTexRef = useRef(null);
  const glitterParticlesRef = useRef(null);
  const materialsRef = useRef(null);
  const silverMeshRef = useRef(null);
  const goldMeshRef = useRef(null);
  const diamondMeshesRef = useRef([]);
  const scrollTriggerInstancesRef = useRef([]);
  const composerRef = useRef(null);
  const bloomPassRef = useRef(null);

  // Position, target, and mouse offsets
  const camPosRef = useRef({ x: 2.2, y: -1.2, z: 4.2 });
  const camTargetRef = useRef({ x: 1.8, y: -0.05, z: -0.2 });
  const mouseOffsetRef = useRef({ x: 0, y: 0 });
  const ringRotRef = useRef({ x: 0, y: 0, z: 0 });

  // WebGi Dynamic Scroll Metal & Gemstone Color Tracker
  const _scrubSilver = useRef(new THREE.Color().copy(STAGE_COLORS.hero.silver));
  const _scrubGold = useRef(new THREE.Color().copy(STAGE_COLORS.hero.gold));
  const _scrubStone = useRef(new THREE.Color().copy(STAGE_COLORS.hero.stone));

  const updateModelColors = (silverCol, goldCol, stoneCol) => {
    if (silverMeshRef.current?.material?.color) {
      silverMeshRef.current.material.color.copy(silverCol);
    }
    if (goldMeshRef.current?.material?.color) {
      goldMeshRef.current.material.color.copy(goldCol);
    }
    if (diamondMeshesRef.current && diamondMeshesRef.current.length > 0) {
      for (let i = 0; i < diamondMeshesRef.current.length; i++) {
        const m = diamondMeshesRef.current[i];
        if (m?.material?.color) {
          m.material.color.copy(stoneCol);
        }
      }
    }
  };

  // Mount 3D Cinema-Grade Ring Model
  const mountRingModel = () => {
    if (!jewelleryRootGroupRef.current || !materialsRef.current) return;
    const root = jewelleryRootGroupRef.current;

    // Clear previous models & sparkles
    while (root.children.length > 0) {
      root.remove(root.children[0]);
    }
    sparklesRef.current = [];

    if (cachedGLBRef.current) {
      mountGLBRing(cachedGLBRef.current);
    } else {
      const loader = new GLTFLoader();
      const modelUrl = currentRingModel === 1 ? '/ring_webgi.glb' : '/ring2_webgi.glb';
      loader.load(
        modelUrl,
        (gltf) => {
          cachedGLBRef.current = gltf.scene;
          mountGLBRing(gltf.scene);
          if (onLoaded) onLoaded();
        },
        undefined,
        (err) => console.error('Error loading ring GLB:', err)
      );
    }
  };

  const mountGLBRing = (modelRoot) => {
    const root = jewelleryRootGroupRef.current;
    const materials = materialsRef.current;

    root.add(modelRoot);
    modelRoot.scale.set(1.15, 1.15, 1.15);

    const diamondMeshes = [];
    let silverMesh = null;
    let goldMesh = null;

    modelRoot.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        const name = child.name.toLowerCase();

        if (name.includes('silver') || name.includes('alliance')) {
          silverMesh = child;
          child.material = materials.platinum;
        } else if (name.includes('gold') || name.includes('entourage')) {
          goldMesh = child;
          child.material = materials.gold18k;
        } else {
          diamondMeshes.push(child);
          child.material = materials.diamond;
        }
      }
    });

    silverMeshRef.current = silverMesh;
    goldMeshRef.current = goldMesh;
    diamondMeshesRef.current = diamondMeshes;

    // Initialize with Hero colors (Silver + Yellow Gold + White Diamond)
    updateModelColors(STAGE_COLORS.hero.silver, STAGE_COLORS.hero.gold, STAGE_COLORS.hero.stone);

    const ringSparkles = [
      { x: 0.02, y: 1.36, z: 0.40, speed: 2.6, offset: 0.0 },
      { x: -0.42, y: 1.20, z: 0.35, speed: 2.9, offset: 1.4 },
      { x: 0.42, y: 1.20, z: 0.35, speed: 2.4, offset: 2.8 },
      { x: -0.28, y: 0.95, z: 0.32, speed: 3.2, offset: 4.2 },
      { x: 0.28, y: 0.95, z: 0.32, speed: 2.7, offset: 2.1 },
      { x: -0.06, y: 1.48, z: 0.30, speed: 3.4, offset: 5.0 },
    ];
    mountSparkles(ringSparkles);
  };

  const mountSparkles = (coords) => {
    if (!sparkleTexRef.current || !jewelleryRootGroupRef.current) return;
    const sparklesGroup = new THREE.Group();
    sparklesGroupRef.current = sparklesGroup;

    const sprites = (coords || []).map((coord) => {
      const spMat = new THREE.SpriteMaterial({
        map: sparkleTexRef.current,
        color: 0xffffff,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });
      const sp = new THREE.Sprite(spMat);
      sp.position.set(coord.x, coord.y, coord.z);
      sp.scale.set(0.10, 0.10, 1);
      sparklesGroup.add(sp);
      return { sprite: sp, ...coord };
    });

    sparklesRef.current = sprites;
    jewelleryRootGroupRef.current.add(sparklesGroup);
  };

  // ScrollTrigger Setup across sections
  const setupScrollTriggerAnimations = (cfg) => {
    if (!cfg) return;
    scrollTriggerInstancesRef.current.forEach((st) => st.kill());
    scrollTriggerInstancesRef.current = [];

    // VIEW 2: DETAILS SECTION (WebGi View 2 - FOREVER / ARTISTRY OF DIKSHI)
    // Lerps from View 1 (Silver + Yellow Gold + White Diamond) to View 2 (Pure Rose Gold + Aqua Diamond)
    const st1 = ScrollTrigger.create({
      trigger: '#details-section',
      start: 'top bottom',
      end: 'top top',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        camPosRef.current.x = gsap.utils.interpolate(cfg.heroCamPos.x, cfg.detailsCamPos.x, p);
        camPosRef.current.y = gsap.utils.interpolate(cfg.heroCamPos.y, cfg.detailsCamPos.y, p);
        camPosRef.current.z = gsap.utils.interpolate(cfg.heroCamPos.z, cfg.detailsCamPos.z, p);

        camTargetRef.current.x = gsap.utils.interpolate(cfg.heroCamTarget.x, cfg.detailsCamTarget.x, p);
        camTargetRef.current.y = gsap.utils.interpolate(cfg.heroCamTarget.y, cfg.detailsCamTarget.y, p);
        camTargetRef.current.z = gsap.utils.interpolate(cfg.heroCamTarget.z, cfg.detailsCamTarget.z, p);

        ringRotRef.current.z = gsap.utils.interpolate(0, Math.PI / 2, p);

        // WebGi exact metal & diamond color lerp: View 1 -> View 2
        _scrubSilver.current.lerpColors(STAGE_COLORS.hero.silver, STAGE_COLORS.details.silver, p);
        _scrubGold.current.lerpColors(STAGE_COLORS.hero.gold, STAGE_COLORS.details.gold, p);
        _scrubStone.current.lerpColors(STAGE_COLORS.hero.stone, STAGE_COLORS.details.stone, p);
        updateModelColors(_scrubSilver.current, _scrubGold.current, _scrubStone.current);
      },
    });
    scrollTriggerInstancesRef.current.push(st1);

    // VIEW 3: AUTH SECTION (WebGi View 3 - EMOTIONS / MAISON VAULT)
    // Lerps from View 2 (Pure Rose Gold + Aqua) to View 3 (Pure Sovereign Yellow Gold + Ruby Diamond)
    const st2 = ScrollTrigger.create({
      trigger: '#auth-section',
      start: 'top bottom',
      end: 'top top',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        camPosRef.current.x = gsap.utils.interpolate(cfg.detailsCamPos.x, cfg.authCamPos.x, p);
        camPosRef.current.y = gsap.utils.interpolate(cfg.detailsCamPos.y, cfg.authCamPos.y, p);
        camPosRef.current.z = gsap.utils.interpolate(cfg.detailsCamPos.z, cfg.authCamPos.z, p);

        camTargetRef.current.x = gsap.utils.interpolate(cfg.detailsCamTarget.x, cfg.authCamTarget.x, p);
        camTargetRef.current.y = gsap.utils.interpolate(cfg.detailsCamTarget.y, cfg.authCamTarget.y, p);
        camTargetRef.current.z = gsap.utils.interpolate(cfg.detailsCamTarget.z, cfg.authCamTarget.z, p);

        // Ring dynamically rolls across to the left side with its frontside facing the camera
        const authRot = cfg.authRingRot || { x: -0.28, y: 0.14, z: -0.20 };
        ringRotRef.current.x = gsap.utils.interpolate(0, authRot.x, p);
        ringRotRef.current.y = gsap.utils.interpolate(0, authRot.y, p);
        ringRotRef.current.z = gsap.utils.interpolate(Math.PI / 2, authRot.z, p);

        // WebGi exact metal & diamond color lerp: View 2 -> View 3
        _scrubSilver.current.lerpColors(STAGE_COLORS.details.silver, STAGE_COLORS.vault.silver, p);
        _scrubGold.current.lerpColors(STAGE_COLORS.details.gold, STAGE_COLORS.vault.gold, p);
        _scrubStone.current.lerpColors(STAGE_COLORS.details.stone, STAGE_COLORS.vault.stone, p);
        updateModelColors(_scrubSilver.current, _scrubGold.current, _scrubStone.current);
      },
    });
    scrollTriggerInstancesRef.current.push(st2);

    // VIEW 4: FOOTER SECTION (WebGi View 4 - DIKSHI JEWELLERY BRAND SIGNOFF)
    // Lerps from View 3 (Pure Sovereign Gold + Ruby) to View 4 (Pure Cold-Forged Platinum / Silver + Light Purple Diamond)
    const st3 = ScrollTrigger.create({
      trigger: '#footer-section',
      start: 'top bottom',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        const authRot = cfg.authRingRot || { x: -0.28, y: 0.14, z: -0.20 };

        camPosRef.current.x = gsap.utils.interpolate(cfg.authCamPos.x, cfg.footerCamPos.x, p);
        camPosRef.current.y = gsap.utils.interpolate(cfg.authCamPos.y, cfg.footerCamPos.y, p);
        camPosRef.current.z = gsap.utils.interpolate(cfg.authCamPos.z, cfg.footerCamPos.z, p);

        camTargetRef.current.x = gsap.utils.interpolate(cfg.authCamTarget.x, cfg.footerCamTarget.x, p);
        camTargetRef.current.y = gsap.utils.interpolate(cfg.authCamTarget.y, cfg.footerCamTarget.y, p);
        camTargetRef.current.z = gsap.utils.interpolate(cfg.authCamTarget.z, cfg.footerCamTarget.z, p);

        ringRotRef.current.x = gsap.utils.interpolate(authRot.x, cfg.footerRingRot.x, p);
        ringRotRef.current.y = gsap.utils.interpolate(authRot.y, cfg.footerRingRot.y, p);
        ringRotRef.current.z = gsap.utils.interpolate(authRot.z, cfg.footerRingRot.z, p);

        // WebGi exact metal & diamond color lerp: View 3 -> View 4
        _scrubSilver.current.lerpColors(STAGE_COLORS.vault.silver, STAGE_COLORS.footer.silver, p);
        _scrubGold.current.lerpColors(STAGE_COLORS.vault.gold, STAGE_COLORS.footer.gold, p);
        _scrubStone.current.lerpColors(STAGE_COLORS.vault.stone, STAGE_COLORS.footer.stone, p);
        updateModelColors(_scrubSilver.current, _scrubGold.current, _scrubStone.current);
      },
    });
    scrollTriggerInstancesRef.current.push(st3);
  };

  // Entrance Animation: Ring glides smoothly into responsive hero position
  const runIntroAnimation = (cfg) => {
    if (!cfg) return;
    updateModelColors(STAGE_COLORS.hero.silver, STAGE_COLORS.hero.gold, STAGE_COLORS.hero.stone);
    gsap.to(camPosRef.current, {
      x: cfg.heroCamPos.x,
      y: cfg.heroCamPos.y,
      z: cfg.heroCamPos.z,
      duration: 2.2,
      ease: 'power3.out',
    });

    gsap.to(camTargetRef.current, {
      x: cfg.heroCamTarget.x,
      y: cfg.heroCamTarget.y,
      z: cfg.heroCamTarget.z,
      duration: 2.2,
      ease: 'power3.out',
      onComplete: () => setupScrollTriggerAnimations(cfg),
    });
  };

  // Initialize Scene, Renderer, Environment and Camera
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const config = getResponsiveCameraConfig(width, height);

    // 1. Scene & Background
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const bgColor = isDark ? new THREE.Color(0x8b1e2e) : new THREE.Color(0xfbf4f5);
    scene.background = bgColor;

    // 2. Camera: Initialized with responsive configuration
    camPosRef.current = {
      x: config.heroCamPos.x + (config.isDesktopLandscape ? 1.0 : 0),
      y: config.heroCamPos.y,
      z: config.heroCamPos.z - 1.0,
    };
    camTargetRef.current = { ...config.heroCamTarget };

    const camera = new THREE.PerspectiveCamera(config.heroFov, width / height, 0.1, 100);
    camera.position.set(camPosRef.current.x, camPosRef.current.y, camPosRef.current.z);
    camera.lookAt(camTargetRef.current.x, camTargetRef.current.y, camTargetRef.current.z);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.95;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;

    // 4. Studio Environment Map for Realistic Surface Reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnv = new RoomEnvironment();
    scene.environment = pmremGenerator.fromScene(roomEnv, 0.04).texture;

    // 5. Studio Lighting Rig - Luxury Studio Contrast (Eliminates flat white light wash)
    const ambientLight = new THREE.AmbientLight(0xfff6f0, 0.22);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff6ee, 1.15);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xdce5f5, 0.55);
    fillLight.position.set(-5, 3, 4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xfff8f0, 0.90);
    rimLight.position.set(0, 5, -6);
    scene.add(rimLight);

    const bounceLight = new THREE.DirectionalLight(0xffeedd, 0.35);
    bounceLight.position.set(0, -5, 2);
    scene.add(bounceLight);

    // Master PBR Materials Engine - Crisp photographic metals and diamonds (No white body glow)
    materialsRef.current = {
      gold18k: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0xe2bf7f).convertSRGBToLinear(),
        roughness: 0.055,
        metalness: 0.94,
        envMapIntensity: 1.5,
        clearcoat: 0.85,
        clearcoatRoughness: 0.035,
        reflectivity: 0.95,
      }),
      gold22k: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0xf7c478).convertSRGBToLinear(),
        roughness: 0.055,
        metalness: 0.95,
        envMapIntensity: 1.5,
        clearcoat: 0.85,
        clearcoatRoughness: 0.035,
        reflectivity: 0.95,
      }),
      platinum: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0xfefefe).convertSRGBToLinear(),
        roughness: 0.055,
        metalness: 0.94,
        envMapIntensity: 1.5,
        clearcoat: 0.85,
        clearcoatRoughness: 0.035,
        reflectivity: 0.95,
      }),
      roseGold: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0xd28b8b).convertSRGBToLinear(),
        roughness: 0.055,
        metalness: 0.94,
        envMapIntensity: 1.5,
        clearcoat: 0.85,
        clearcoatRoughness: 0.035,
        reflectivity: 0.95,
      }),
      diamond: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0xffffff).convertSRGBToLinear(), // Pure White Solitaire Diamond first
        transmission: 0.98,
        opacity: 1.0,
        transparent: true,
        ior: 2.417,
        thickness: 1.2,
        roughness: 0.002,
        metalness: 0.0,
        dispersion: 0.050,
        envMapIntensity: 1.3,
        clearcoat: 1.0,
        clearcoatRoughness: 0.0,
        specularIntensity: 0.90,
        specularColor: new THREE.Color(0xffffff),
        side: THREE.DoubleSide,
        attenuationColor: new THREE.Color(0xe8edf8),
        attenuationDistance: 5.0,
      }),
      ruby: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0xf70db1).convertSRGBToLinear(),
        transmission: 0.88,
        opacity: 1.0,
        transparent: true,
        ior: 1.77,
        thickness: 1.5,
        roughness: 0.015,
        metalness: 0.05,
        dispersion: 0.02,
        envMapIntensity: 1.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.0,
        specularIntensity: 1.1,
        side: THREE.DoubleSide,
        attenuationColor: new THREE.Color(0x770a1a),
        attenuationDistance: 2.5,
      }),
    };

    // Root Group for 3D Jewellery Models
    const jewelleryRoot = new THREE.Group();
    jewelleryRootGroupRef.current = jewelleryRoot;
    scene.add(jewelleryRoot);

    sparkleTexRef.current = createMicroSparkleTexture();

    // Subtle floating diamond dust / stardust particles
    const glitterData = createGlitterParticles(60);
    scene.add(glitterData.points);
    glitterParticlesRef.current = glitterData;

    // 6. Post-Processing Pipeline: Zero ring body glow, only ultra-high moving specular points glint
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      0.015, // Extremely refined bloom: ring body never glows, only moving sparkle glints glisten
      0.08,  // Pinpoint tight halo: zero spread across ring/shank
      1.65   // Ultra-high threshold: guarantees ring body and diamonds are 100% crisp without white fog
    );
    composer.addPass(bloomPass);

    const outputPass = new OutputPass();
    composer.addPass(outputPass);

    composerRef.current = composer;
    bloomPassRef.current = bloomPass;

    // 7. OrbitControls (disabled during scroll, active in Customize mode)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enabled = false;
    controls.autoRotate = false;
    controls.autoRotateSpeed = 1.2;
    controls.minDistance = 4.5;
    controls.maxDistance = 14;
    controls.enablePan = false;
    controlsRef.current = controls;

    // 8. Load & Mount Cinema-Grade 3D Ring Model
    mountRingModel();
    runIntroAnimation(config);

    // Render loop
    const clock = new THREE.Clock();
    let reqId;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      if (controlsRef.current && controlsRef.current.enabled) {
        controlsRef.current.update();
      } else if (cameraRef.current) {
        camera.position.set(
          camPosRef.current.x + mouseOffsetRef.current.x,
          camPosRef.current.y + mouseOffsetRef.current.y,
          camPosRef.current.z
        );
        camera.lookAt(
          camTargetRef.current.x,
          camTargetRef.current.y,
          camTargetRef.current.z
        );
      }

      // Jewellery pose - continuous subtle floating hover + slow elegant rotation
      if (jewelleryRootGroupRef.current && !controlsRef.current?.enabled) {
        const hoverY = Math.sin(time * 0.8) * 0.04;
        const hoverRotX = Math.cos(time * 0.6) * 0.02;
        const hoverRotY = Math.sin(time * 0.5) * 0.04;

        jewelleryRootGroupRef.current.position.y = hoverY;
        jewelleryRootGroupRef.current.rotation.x = ringRotRef.current.x + hoverRotX;
        jewelleryRootGroupRef.current.rotation.y = ringRotRef.current.y + hoverRotY;
        jewelleryRootGroupRef.current.rotation.z = ringRotRef.current.z;
      }

      // Animate subtle micro diamond glitter twinkles (Crisp, delicate star-glints)
      if (sparklesRef.current && sparklesRef.current.length > 0) {
        const rotZ = ringRotRef.current.z;
        for (let i = 0; i < sparklesRef.current.length; i++) {
          const item = sparklesRef.current[i];
          const phase = time * item.speed + item.offset + (rotZ * 2.8);
          const flash = Math.pow(Math.max(0, Math.sin(phase)), 8.0);
          item.sprite.material.opacity = flash * 0.35;
          const s = 0.035 + flash * 0.035;
          item.sprite.scale.set(s, s, 1);
        }
      }

      // Animate floating diamond dust / stardust particles
      if (glitterParticlesRef.current) {
        const { points, geom, positions, phases, speeds, count } = glitterParticlesRef.current;
        const posAttr = geom.attributes.position;
        for (let i = 0; i < count; i++) {
          const initialY = positions[i * 3 + 1];
          posAttr.setY(i, initialY + Math.sin(time * speeds[i] + phases[i]) * 0.12);
        }
        posAttr.needsUpdate = true;
        points.rotation.y = time * 0.04;
        points.material.opacity = 0.45 + 0.25 * Math.sin(time * 1.5);
      }

      // Render through bloom composer for controlled "little glow"
      if (composerRef.current) {
        composerRef.current.render();
      } else {
        renderer.render(scene, camera);
      }
    };
    animate();

    // Universal Resize & Device Orientation Handler
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const cfg = getResponsiveCameraConfig(w, h);

      camera.aspect = w / h;
      camera.fov = cfg.heroFov;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      if (composerRef.current) {
        composerRef.current.setSize(w, h);
      }
      if (bloomPassRef.current) {
        bloomPassRef.current.resolution.set(w, h);
      }

      setupScrollTriggerAnimations(cfg);
      ScrollTrigger.refresh();

      // If at Hero top, adapt camera smoothly to current viewport framing
      if (window.scrollY < 120) {
        gsap.to(camPosRef.current, {
          x: cfg.heroCamPos.x,
          y: cfg.heroCamPos.y,
          z: cfg.heroCamPos.z,
          duration: 0.5,
          ease: 'power2.out',
        });
        gsap.to(camTargetRef.current, {
          x: cfg.heroCamTarget.x,
          y: cfg.heroCamTarget.y,
          z: cfg.heroCamTarget.z,
          duration: 0.5,
          ease: 'power2.out',
        });
      }
    };
    window.addEventListener('resize', handleResize);

    const handleOrientation = () => {
      setTimeout(handleResize, 150);
    };
    window.addEventListener('orientationchange', handleOrientation);

    // Mouse movement subtle parallax on camera
    const handleMouseMove = (e) => {
      if (controlsRef.current?.enabled) return;
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;

      gsap.to(mouseOffsetRef.current, {
        x: normX * 0.12,
        y: normY * 0.12,
        duration: 0.8,
        ease: 'power2.out',
      });
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      if (reqId) cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientation);
      window.removeEventListener('mousemove', handleMouseMove);
      scrollTriggerInstancesRef.current.forEach((st) => st.kill());
      if (controlsRef.current) {
        try { controlsRef.current.dispose(); } catch {}
      }
      if (composerRef.current) {
        try { composerRef.current.dispose(); } catch {}
      }
      if (rendererRef.current) {
        try { rendererRef.current.dispose(); } catch {}
      }
      if (pmremGenerator) {
        try { pmremGenerator.dispose(); } catch {}
      }
    };
  }, [currentRingModel]);

  // Update theme background color smoothly (Imperial Ruby Red vs Rose Luxury Blush Pink)
  useEffect(() => {
    if (sceneRef.current) {
      const targetColor = isDark ? new THREE.Color(0x8b1e2e) : new THREE.Color(0xfbf4f5);
      gsap.to(sceneRef.current.background, {
        r: targetColor.r,
        g: targetColor.g,
        b: targetColor.b,
        duration: 0.8,
      });
    }
  }, [isDark]);

  // Update Diamond Color
  useEffect(() => {
    const hex = DIAMOND_COLORS[activeGemColor] ?? 0xffffff;
    const targetColor = new THREE.Color(hex).convertSRGBToLinear();
    diamondMeshesRef.current.forEach((mesh) => {
      if (mesh.material) {
        gsap.to(mesh.material.color, {
          r: targetColor.r,
          g: targetColor.g,
          b: targetColor.b,
          duration: 0.5,
        });
      }
    });
  }, [activeGemColor]);

  // Update Metal Material Presets
  useEffect(() => {
    const preset = MATERIAL_PRESETS[activeMaterial] || MATERIAL_PRESETS.default;
    if (silverMeshRef.current?.material) {
      const targetSilver = new THREE.Color(preset.silver).convertSRGBToLinear();
      gsap.to(silverMeshRef.current.material.color, {
        r: targetSilver.r,
        g: targetSilver.g,
        b: targetSilver.b,
        duration: 0.5,
      });
    }
    if (goldMeshRef.current?.material) {
      const targetGold = new THREE.Color(preset.gold).convertSRGBToLinear();
      gsap.to(goldMeshRef.current.material.color, {
        r: targetGold.r,
        g: targetGold.g,
        b: targetGold.b,
        duration: 0.5,
      });
    }
  }, [activeMaterial]);

  // Handle Switch to/from Customize 360 Mode
  useEffect(() => {
    if (!cameraRef.current || !controlsRef.current) return;

    if (isCustomizing) {
      scrollTriggerInstancesRef.current.forEach((st) => st.disable());

      gsap.timeline()
        .to(camPosRef.current, {
          x: -0.17,
          y: -0.25,
          z: 8.5,
          duration: 1.8,
          ease: 'power3.inOut',
        })
        .to(
          camTargetRef.current,
          {
            x: 0,
            y: 0,
            z: 0,
            duration: 1.8,
            ease: 'power3.inOut',
          },
          '<'
        )
        .to(
          ringRotRef.current,
          {
            x: -Math.PI / 2,
            y: 0,
            z: -Math.PI / 2,
            duration: 1.8,
            ease: 'power3.inOut',
            onComplete: () => {
              if (controlsRef.current) {
                controlsRef.current.enabled = true;
                controlsRef.current.autoRotate = true;
              }
            },
          },
          '<'
        );
    } else {
      if (controlsRef.current) {
        controlsRef.current.enabled = false;
        controlsRef.current.autoRotate = false;
      }
      scrollTriggerInstancesRef.current.forEach((st) => st.enable());
    }
  }, [isCustomizing]);

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full pointer-events-none z-0">
      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className={`w-full h-full block ${isCustomizing ? 'pointer-events-auto cursor-grab active:cursor-grabbing' : ''}`}
      />

      {/* Luxury Vignette Overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-colors duration-700"
        style={{
          background: isDark
            ? 'radial-gradient(circle at center, transparent 35%, rgba(74, 10, 18, 0.45) 100%)'
            : 'radial-gradient(circle at center, transparent 45%, rgba(62, 24, 33, 0.08) 100%)',
        }}
      />
    </div>
  );
}
