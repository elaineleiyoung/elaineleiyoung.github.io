/**
 * ThreeBackground — scroll-driven ink-wash shan shui landscape.
 *
 * Layers back → front:
 *   z=-5.5  range-far.png               1.33:1  ultra-far ridge
 *   z=-4.5  mountain-range-2.png        2:1     dissolution range (beat 4 only)
 *   z=-3.5  distant-range-1.png         2.38:1  far mountains
 *   z=-1.6  pavilion-far-range.png      1.78:1  pavilion seen from afar
 *   z=-2.5  Soft-gray-misty-cloud-1.png 2:1     back mist  (drifts →)
 *   z=-2.0  cloud-2.png                 3:1     mid cloud  (drifts →)
 *   z=-1.8  mountain-range-1.png        0.67:1  mid peak portrait
 *   z=-0.8  pavilion-near-range.png     1.78:1  pavilion close approach
 *   z=-1.2  misty-overlay-1.png         1.5:1   mist overlay (drifts ←)
 *   z=-0.7  mist-overlay-2.png          3:1     close mist  (drifts →)
 *   z=-0.4  range-near.png              1.33:1  near range
 *   z= 0.3  plum-blossom-tree-1.png     1.25:1  foreground tree
 *   petals  petal-1.png                 1:1     falling petals
 *
 * Scroll progress (0→1) drives five keyframed beats:
 *   0.00  Arrival      — full scene, tree right, all layers
 *   0.18  Push-in      — inside the range, near/tree gone
 *   0.45  Wide vista   — far and mid peaks, lateral drift
 *   0.72  Valley       — camera descends, mist sea rises
 *   1.00  Dissolution  — solitary tree centred, fog, far ranges faded
 */

import React, { useEffect, useRef } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as THREE from 'three';

const { PUBLIC_URL } = process.env;
const ASSETS = `${PUBLIC_URL}/images/assets`;

// ─── Palette ─────────────────────────────────────────────────────────────────

function getPalette() {
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  return {
    clearColor: dark ? 0x0F0D0B : 0xF5F0E8,
    fogColor: dark ? 0x0F0D0B : 0xF5F0E8,
    mountainFar: dark ? 0x2A3A50 : 0x1C2D3A,
    mountainMid: dark ? 0x1E2A38 : 0x162438,
    mountainNear: dark ? 0x141E28 : 0x0F1C2C,
    tree: dark ? 0x1A2030 : 0x0D1820,
    mist: dark ? 0x7A8A9A : 0xE8EEF4,
    petal: dark ? 0x8A4A5E : 0xBF5A78,
  };
}

// ─── Base opacities ───────────────────────────────────────────────────────────
// Mountain layers: [rangeFar, mtnRange2, far, pavilionFar, mid, pavilionNear, rangeNear, tree]
const MTN_FALLBACK = [0.05, 0.05, 0.07, 0.10, 0.09, 0.10, 0.10, 0.10];
// Mist layers:     [mist0, cloud2, mist1, mist2]
const MIST_FALLBACK = [0.04, 0.03, 0.03, 0.035];
const MIST_LOADED = [0.65, 0.58, 0.52, 0.55];
const PETAL_MAX = 0.95;
const SCENE_LERP = 0.025;

// ─── Scroll keyframes ─────────────────────────────────────────────────────────
// mtn[i]: multiplier on each mountain layer's base opacity (0 = hidden, 1 = full)
// mist[i]: multiplier on each mist layer's base opacity (>1 = boosted)
// petal: multiplier on PETAL_MAX
// petalSpeed: multiplier on per-petal vy (1.0 = normal, <1 = slower)
// treeX: tree horizontal position as fraction of viewport width at z=0.3
// camX: scroll-driven horizontal camera offset (independent of mouse parallax)
const KEYFRAMES = [
  // Beat 0 — Arrival (p = 0.00): full scene, tree on right, all ranges visible
  {
    p: 0.00,
    camZ: 5.0,
    camY: 0.0,
    camX: 0.0,
    mtn: [0.7, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 1.0],
    mist: [0.8, 0.7, 0.6, 0.5],
    petal: 0.85,
    petalSpeed: 1.0,
    treeX: 0.29,
  },
  // Beat 1 — The Wanderer (p = 0.18): pavilion-far prominent; pavilion-near hidden
  {
    p: 0.18,
    camZ: 2.5,
    camY: 0.0,
    camX: 0.25,
    mtn: [0.0, 0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0],
    mist: [1.0, 1.0, 1.2, 1.5],
    petal: 0.5,
    petalSpeed: 0.3,
    treeX: 0.29,
  },
  // Beat 2 — The Craft (p = 0.58): pavilion-near only; cam zooms right and forward
  {
    p: 0.58,
    camZ: 2.0,
    camY: 0.0,
    camX: 0.35,
    mtn: [1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0],
    mist: [1.2, 1.3, 0.5, 0.2],
    petal: 0.6,
    petalSpeed: 1.0,
    treeX: 0.29,
  },
  // Beat 3 — Valley descent / Work (p = 0.80): camera lowers, mist sea rises
  {
    p: 0.80,
    camZ: 3.0,
    camY: -0.5,
    camX: 0.0,
    mtn: [0.8, 0.0, 0.7, 0.0, 0.8, 0.5, 0.0, 0.0],
    mist: [1.5, 1.8, 1.5, 1.3],
    petal: 0.3,
    petalSpeed: 1.0,
    treeX: 0.29,
  },
  // Beat 4 — Dissolution / Send Word (p = 1.00): mist sea, faint mountain-range-2, no tree
  {
    p: 1.00,
    camZ: 5.2,
    camY: 0.0,
    camX: 0.0,
    mtn: [0.3, 0.5, 0.4, 0.0, 0.0, 0.0, 0.0, 0.0],
    mist: [1.6, 1.5, 1.6, 1.4],
    petal: 0.55,
    petalSpeed: 1.0,
    treeX: 0.0,
  },
];

function lerpScene(k0, k1, t) {
  function mix(a, b) { return a + (b - a) * t; }
  return {
    camZ: mix(k0.camZ, k1.camZ),
    camY: mix(k0.camY, k1.camY),
    camX: mix(k0.camX, k1.camX),
    mtn: k0.mtn.map((v, i) => mix(v, k1.mtn[i])),
    mist: k0.mist.map((v, i) => mix(v, k1.mist[i])),
    petal: mix(k0.petal, k1.petal),
    petalSpeed: mix(k0.petalSpeed, k1.petalSpeed),
    treeX: mix(k0.treeX, k1.treeX),
  };
}

function getSceneAt(p) {
  for (let i = 0; i < KEYFRAMES.length - 1; i += 1) {
    if (p <= KEYFRAMES[i + 1].p) {
      const range = KEYFRAMES[i + 1].p - KEYFRAMES[i].p;
      const t = range > 0 ? (p - KEYFRAMES[i].p) / range : 0;
      return lerpScene(KEYFRAMES[i], KEYFRAMES[i + 1], t);
    }
  }
  return KEYFRAMES[KEYFRAMES.length - 1];
}

// ─── Component ────────────────────────────────────────────────────────────────

const ThreeBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    let W = window.innerWidth;
    let H = window.innerHeight;

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    container.appendChild(renderer.domElement);

    // ── Scene / Camera ────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
    camera.position.set(0, 0, 5);

    let col = getPalette();
    renderer.setClearColor(col.clearColor, 1);
    scene.fog = new THREE.FogExp2(col.fogColor, 0.03);

    // Visible viewport extents in scene units at a given z-depth
    function vpAt(z) {
      const dist = camera.position.z - z;
      const vph = 2 * Math.tan((camera.fov * Math.PI) / 360) * dist;
      return {
        w: vph * (W / H),
        h: vph,
      };
    }

    // ── Texture loader ────────────────────────────────────────────────────────
    const loader = new THREE.TextureLoader();
    function tryLoad(url) {
      return new Promise((resolve) => {
        loader.load(url, resolve, undefined, () => resolve(null));
      });
    }

    // ── Initial keyframe state ────────────────────────────────────────────────
    const initK = KEYFRAMES[0];

    // ── Materials ─────────────────────────────────────────────────────────────
    const matRangeFar = new THREE.MeshBasicMaterial({
      transparent: true,
      depthWrite: false,
      color: col.mountainFar,
      opacity: initK.mtn[0] * MTN_FALLBACK[0],
    });
    const matFar = new THREE.MeshBasicMaterial({
      transparent: true,
      depthWrite: false,
      color: col.mountainFar,
      opacity: initK.mtn[2] * MTN_FALLBACK[2],
    });
    const matMtnRange2 = new THREE.MeshBasicMaterial({
      transparent: true,
      depthWrite: false,
      color: col.mountainFar,
      opacity: initK.mtn[1] * MTN_FALLBACK[1],
    });
    const matPavilionFar = new THREE.MeshBasicMaterial({
      transparent: true,
      depthWrite: false,
      color: col.mountainMid,
      opacity: initK.mtn[3] * MTN_FALLBACK[3],
    });
    const matMid = new THREE.MeshBasicMaterial({
      transparent: true,
      depthWrite: false,
      color: col.mountainMid,
      opacity: initK.mtn[4] * MTN_FALLBACK[4],
    });
    const matPavilionNear = new THREE.MeshBasicMaterial({
      transparent: true,
      depthWrite: false,
      color: col.mountainNear,
      opacity: initK.mtn[5] * MTN_FALLBACK[5],
    });
    const matRangeNear = new THREE.MeshBasicMaterial({
      transparent: true,
      depthWrite: false,
      color: col.mountainNear,
      opacity: initK.mtn[6] * MTN_FALLBACK[6],
    });
    const matTree = new THREE.MeshBasicMaterial({
      transparent: true,
      depthWrite: false,
      color: col.tree,
      opacity: initK.mtn[7] * MTN_FALLBACK[7],
    });
    const matMist0 = new THREE.MeshBasicMaterial({
      transparent: true,
      depthWrite: false,
      color: col.mist,
      opacity: Math.min(1, initK.mist[0] * MIST_FALLBACK[0]),
    });
    const matCloud2 = new THREE.MeshBasicMaterial({
      transparent: true,
      depthWrite: false,
      color: col.mist,
      opacity: Math.min(1, initK.mist[1] * MIST_FALLBACK[1]),
    });
    const matMist1 = new THREE.MeshBasicMaterial({
      transparent: true,
      depthWrite: false,
      color: col.mist,
      opacity: Math.min(1, initK.mist[2] * MIST_FALLBACK[2]),
    });
    const matMist2 = new THREE.MeshBasicMaterial({
      transparent: true,
      depthWrite: false,
      color: col.mist,
      opacity: Math.min(1, initK.mist[3] * MIST_FALLBACK[3]),
    });
    const matPetal = new THREE.MeshBasicMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      color: col.petal,
      opacity: initK.petal * PETAL_MAX,
    });

    const loaded = { textures: false };
    const mountainMats = [
      matRangeFar, matMtnRange2, matFar, matPavilionFar,
      matMid, matPavilionNear, matRangeNear, matTree,
    ];
    const mistMats = [matMist0, matCloud2, matMist1, matMist2];

    // ── Smoothed state (owns all opacities, camera, tree x) ──────────────────
    const current = {
      camZ: initK.camZ,
      camY: initK.camY,
      camX: initK.camX,
      mtn: MTN_FALLBACK.map((f, i) => initK.mtn[i] * f),
      mist: MIST_FALLBACK.map((f, i) => Math.min(1, initK.mist[i] * f)),
      petal: initK.petal * PETAL_MAX,
      petalSpeed: initK.petalSpeed,
      treeX: initK.treeX,
    };

    // ── Mountain planes (back → front) ────────────────────────────────────────

    // L0 — range-far.png  1448×1086  1.33:1  ultra-far
    const { w: vw0, h: vh0 } = vpAt(-5.5);
    const rf0W = vw0 * 1.9;
    const rf0H = rf0W / (1448 / 1086);
    const meshRangeFar = new THREE.Mesh(
      new THREE.PlaneGeometry(rf0W, rf0H),
      matRangeFar,
    );
    meshRangeFar.position.set(0, -vh0 * 0.12, -5.5);
    scene.add(meshRangeFar);

    // L1 — mountain-range-2.png  1774×887  2:1  dissolution range (beat 4)
    const { w: vwR2, h: vhR2 } = vpAt(-4.5);
    const r2W = vwR2 * 2.2;
    const r2H = r2W / (1774 / 887);
    const meshMtnRange2 = new THREE.Mesh(
      new THREE.PlaneGeometry(r2W, r2H),
      matMtnRange2,
    );
    meshMtnRange2.position.set(0, -vhR2 * 0.14, -4.5);
    scene.add(meshMtnRange2);

    // L2 — distant-range-1.png  2.38:1
    const { w: vw1, h: vh1 } = vpAt(-3.5);
    const farW = vw1 * 1.8;
    const farH = farW / (1935 / 813);
    const meshFar = new THREE.Mesh(new THREE.PlaneGeometry(farW, farH), matFar);
    meshFar.position.set(0, -vh1 * 0.18, -3.5);
    scene.add(meshFar);

    // L2 — pavilion-far-range.png  1672×941  1.78:1  pavilion from afar
    const { w: vwPf, h: vhPf } = vpAt(-1.6);
    const pfW = vwPf * 1.6;
    const pfH = pfW / (1672 / 941);
    const meshPavilionFar = new THREE.Mesh(
      new THREE.PlaneGeometry(pfW, pfH),
      matPavilionFar,
    );
    meshPavilionFar.position.set(0, -vhPf * 0.15, -1.6);
    scene.add(meshPavilionFar);

    // L4 — mountain-range-1.png  0.67:1 portrait
    const { w: vw2, h: vh2 } = vpAt(-1.8);
    const midH = vh2 * 1.25;
    const midW = midH * (1024 / 1536);
    const meshMid = new THREE.Mesh(new THREE.PlaneGeometry(midW, midH), matMid);
    meshMid.position.set(-vw2 * 0.05, -vh2 * 0.10, -1.8);
    scene.add(meshMid);

    // L5 — pavilion-near-range.png  1672×941  1.78:1  pavilion close approach
    const { w: vwPn, h: vhPn } = vpAt(-0.8);
    const pnW = vwPn * 1.5;
    const pnH = pnW / (1672 / 941);
    const meshPavilionNear = new THREE.Mesh(
      new THREE.PlaneGeometry(pnW, pnH),
      matPavilionNear,
    );
    meshPavilionNear.position.set(0, -vhPn * 0.15, -0.8);
    scene.add(meshPavilionNear);

    // L6 — range-near.png  1448×1086  1.33:1  near range
    const { w: vw5, h: vh5 } = vpAt(-0.4);
    const rnW = vw5 * 1.35;
    const rnH = rnW / (1448 / 1086);
    const meshRangeNear = new THREE.Mesh(
      new THREE.PlaneGeometry(rnW, rnH),
      matRangeNear,
    );
    meshRangeNear.position.set(0, -vh5 * 0.24, -0.4);
    scene.add(meshRangeNear);

    // L6 — plum-blossom-tree-1.png  1.25:1  foreground
    const { w: vwTree, h: vhTree } = vpAt(0.3);
    const treeW = vwTree * 0.62;
    const treeH = treeW / (1402 / 1122);
    const meshTree = new THREE.Mesh(
      new THREE.PlaneGeometry(treeW, treeH),
      matTree,
    );
    meshTree.position.set(current.treeX * vwTree, -vhTree * 0.18, 0.3);
    scene.add(meshTree);

    // Per-layer parallax data (strength increases toward camera)
    const mountainLayers = [
      { mesh: meshRangeFar, yBase: -vh0 * 0.12, parallax: 0.008 },
      { mesh: meshMtnRange2, yBase: -vhR2 * 0.14, parallax: 0.012 },
      { mesh: meshFar, yBase: -vh1 * 0.18, parallax: 0.025 },
      { mesh: meshPavilionFar, yBase: -vhPf * 0.15, parallax: 0.060 },
      { mesh: meshMid, yBase: -vh2 * 0.10, parallax: 0.050 },
      { mesh: meshPavilionNear, yBase: -vhPn * 0.15, parallax: 0.100 },
      { mesh: meshRangeNear, yBase: -vh5 * 0.24, parallax: 0.110 },
      { mesh: meshTree, yBase: -vhTree * 0.18, parallax: 0.170 },
    ];

    // ── Mist bands ────────────────────────────────────────────────────────────

    // M0 — Soft-gray-misty-cloud-1.png  2:1  drifts right
    const { w: mv0 } = vpAt(-2.5);
    const m0W = mv0 * 2.4;
    const m0H = m0W / 2;
    const meshMist0 = new THREE.Mesh(
      new THREE.PlaneGeometry(m0W, m0H),
      matMist0,
    );
    meshMist0.position.set(0, -0.2, -2.5);
    meshMist0.userData.speed = 0.005;
    meshMist0.userData.wrapAt = mv0 * 0.85;
    scene.add(meshMist0);

    // M1 — cloud-2.png  3:1  drifts right slow
    const { w: mv1 } = vpAt(-2.0);
    const m1W = mv1 * 2.6;
    const m1H = m1W / 3;
    const meshCloud2 = new THREE.Mesh(
      new THREE.PlaneGeometry(m1W, m1H),
      matCloud2,
    );
    meshCloud2.position.set(0, 0.30, -2.0);
    meshCloud2.userData.speed = 0.004;
    meshCloud2.userData.wrapAt = mv1 * 0.90;
    scene.add(meshCloud2);

    // M2 — misty-overlay-1.png  1.5:1  drifts left
    const { w: mv2 } = vpAt(-1.2);
    const m2W = mv2 * 2.6;
    const m2H = m2W / 1.5;
    const meshMist1 = new THREE.Mesh(
      new THREE.PlaneGeometry(m2W, m2H),
      matMist1,
    );
    meshMist1.position.set(0, 0.10, -1.2);
    meshMist1.userData.speed = -0.007;
    meshMist1.userData.wrapAt = mv2 * 0.85;
    scene.add(meshMist1);

    // M3 — mist-overlay-2.png  3:1  drifts right
    const { w: mv3 } = vpAt(-0.7);
    const m3W = mv3 * 2.8;
    const m3H = m3W / 3;
    const meshMist2 = new THREE.Mesh(
      new THREE.PlaneGeometry(m3W, m3H),
      matMist2,
    );
    meshMist2.position.set(0, -0.10, -0.7);
    meshMist2.userData.speed = 0.006;
    meshMist2.userData.wrapAt = mv3 * 0.90;
    scene.add(meshMist2);

    const mistMeshes = [meshMist0, meshCloud2, meshMist1, meshMist2];

    // ── Falling petals ────────────────────────────────────────────────────────
    const PETAL_COUNT = W < 768 ? 30 : 60;
    const petalGeo = new THREE.PlaneGeometry(0.18, 0.18);
    const petalMesh = new THREE.InstancedMesh(petalGeo, matPetal, PETAL_COUNT);
    petalMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(petalMesh);

    const { w: pvw, h: pvh } = vpAt(0.5);
    const petals = Array.from({ length: PETAL_COUNT }, () => ({
      x: (Math.random() - 0.5) * pvw * 1.3,
      y: (Math.random() * 1.8 - 0.5) * pvh,
      z: (Math.random() - 0.5) * 1.6,
      vy: 0.0015 + Math.random() * 0.0015,
      flutter: Math.random() * Math.PI * 2,
      fFreq: 0.3 + Math.random() * 0.5,
      fAmp: 0.025 + Math.random() * 0.03,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.04,
    }));
    const dummy = new THREE.Object3D();

    // ── Texture loading ───────────────────────────────────────────────────────
    // Only .map and .color are set here; opacity is fully owned by the animation
    // loop so textures reveal smoothly as they arrive.
    const WHITE = 0xFFFFFF;

    const assetPaths = [
      `${ASSETS}/range-far.png`,
      `${ASSETS}/mountain-range-2.png`,
      `${ASSETS}/distant-range-1.png`,
      `${ASSETS}/pavilion-far-range.png`,
      `${ASSETS}/mountain-range-1.png`,
      `${ASSETS}/pavilion-near-range.png`,
      `${ASSETS}/range-near.png`,
      `${ASSETS}/plum-blossom-tree-1.png`,
      `${ASSETS}/Soft-gray-misty-cloud-1.png`,
      `${ASSETS}/cloud-2.png`,
      `${ASSETS}/misty-overlay-1.png`,
      `${ASSETS}/mist-overlay-2.png`,
      `${ASSETS}/petal-1.png`,
    ];

    Promise.all(assetPaths.map(tryLoad)).then((textures) => {
      const texMountains = textures.slice(0, 8);
      const [tMist0, tCloud2, tMist1, tMist2, tPetal] = textures.slice(8);

      for (let i = 0; i < mountainMats.length; i += 1) {
        if (texMountains[i]) {
          mountainMats[i].map = texMountains[i];
          mountainMats[i].color.set(WHITE);
          mountainMats[i].needsUpdate = true;
        }
      }

      const texMist = [tMist0, tCloud2, tMist1, tMist2];
      for (let i = 0; i < mistMats.length; i += 1) {
        if (texMist[i]) {
          mistMats[i].map = texMist[i];
          mistMats[i].needsUpdate = true;
        }
      }

      if (tPetal) {
        matPetal.map = tPetal;
        matPetal.needsUpdate = true;
      }

      loaded.textures = true;
    });

    // ── Mouse parallax ────────────────────────────────────────────────────────
    const mouse = { x: 0, y: 0 };
    const mouseTarget = { x: 0, y: 0 };
    const onMouseMove = (e) => {
      mouseTarget.x = (e.clientX / W) * 2 - 1;
      mouseTarget.y = -(e.clientY / H) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // ── Scroll progress ───────────────────────────────────────────────────────
    const scroll = { progress: 0, target: 0 };
    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scroll.target = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // ── Animation loop ────────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Smooth mouse and scroll
      mouse.x += (mouseTarget.x - mouse.x) * 0.04;
      mouse.y += (mouseTarget.y - mouse.y) * 0.04;
      scroll.progress += (scroll.target - scroll.progress) * 0.05;

      const sceneTarget = getSceneAt(scroll.progress);

      // ── Mountain opacities ───────────────────────────────────────────────
      for (let i = 0; i < mountainMats.length; i += 1) {
        const base = loaded.textures ? 1.0 : MTN_FALLBACK[i];
        const targetOp = sceneTarget.mtn[i] * base;
        current.mtn[i] += (targetOp - current.mtn[i]) * SCENE_LERP;
        mountainMats[i].opacity = current.mtn[i];
      }

      // ── Mist opacities ───────────────────────────────────────────────────
      for (let i = 0; i < mistMats.length; i += 1) {
        const base = loaded.textures ? MIST_LOADED[i] : MIST_FALLBACK[i];
        const targetOp = Math.min(1.0, sceneTarget.mist[i] * base);
        current.mist[i] += (targetOp - current.mist[i]) * SCENE_LERP;
        mistMats[i].opacity = current.mist[i];
      }

      // ── Petal opacity + speed ────────────────────────────────────────────
      const targetPetal = sceneTarget.petal * PETAL_MAX;
      current.petal += (targetPetal - current.petal) * SCENE_LERP;
      matPetal.opacity = current.petal;
      current.petalSpeed += (sceneTarget.petalSpeed - current.petalSpeed) * SCENE_LERP;

      // ── Camera ───────────────────────────────────────────────────────────
      current.camZ += (sceneTarget.camZ - current.camZ) * 0.03;
      current.camY += (sceneTarget.camY - current.camY) * 0.03;
      current.camX += (sceneTarget.camX - current.camX) * 0.03;
      camera.position.z = current.camZ;
      camera.position.y = current.camY;
      camera.position.x = current.camX;

      // ── Tree x position ──────────────────────────────────────────────────
      current.treeX += (sceneTarget.treeX - current.treeX) * SCENE_LERP;

      // ── Multi-layer mouse parallax ───────────────────────────────────────
      for (let i = 0; i < mountainLayers.length; i += 1) {
        const layer = mountainLayers[i];
        const xBase = i === 7 ? current.treeX * vwTree : 0;
        layer.mesh.position.x = mouse.x * layer.parallax * 3 + xBase;
        layer.mesh.position.y = layer.yBase + mouse.y * layer.parallax * 0.6;
      }

      // Gentle wind sway on the plum tree
      const treeLayer = mountainLayers[7];
      meshTree.position.y = treeLayer.yBase
        + mouse.y * treeLayer.parallax * 0.6
        + Math.sin(t * 0.3) * 0.015;

      // ── Mist drift (seamless horizontal wrap) ────────────────────────────
      for (let i = 0; i < mistMeshes.length; i += 1) {
        const m = mistMeshes[i];
        m.position.x += m.userData.speed;
        if (Math.abs(m.position.x) > m.userData.wrapAt) {
          m.position.x *= -1;
        }
      }

      // ── Falling petals ───────────────────────────────────────────────────
      for (let i = 0; i < PETAL_COUNT; i += 1) {
        const p = petals[i];
        p.y -= p.vy * current.petalSpeed;
        p.x += Math.sin(t * p.fFreq + p.flutter) * p.fAmp;
        p.rot += p.rotV;
        if (p.y < -pvh * 0.65) {
          p.y = pvh * 0.65;
          p.x = (Math.random() - 0.5) * pvw * 1.3;
        }
        dummy.position.set(p.x, p.y, p.z);
        dummy.rotation.z = p.rot;
        dummy.updateMatrix();
        petalMesh.setMatrixAt(i, dummy.matrix);
      }
      petalMesh.instanceMatrix.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // ── Resize ────────────────────────────────────────────────────────────────
    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    };
    window.addEventListener('resize', onResize);

    // ── Theme observer ────────────────────────────────────────────────────────
    const themeObs = new MutationObserver(() => {
      col = getPalette();
      renderer.setClearColor(col.clearColor, 1);
      scene.fog.color.set(col.fogColor);
      if (!loaded.textures) {
        matRangeFar.color.set(col.mountainFar);
        matMtnRange2.color.set(col.mountainFar);
        matFar.color.set(col.mountainFar);
        matPavilionFar.color.set(col.mountainMid);
        matMid.color.set(col.mountainMid);
        matPavilionNear.color.set(col.mountainNear);
        matRangeNear.color.set(col.mountainNear);
        matTree.color.set(col.tree);
      }
      for (let i = 0; i < mistMats.length; i += 1) {
        mistMats[i].color.set(col.mist);
      }
      matPetal.color.set(col.petal);
    });
    themeObs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      themeObs.disconnect();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
};

export default ThreeBackground;
