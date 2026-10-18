import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { PetType } from '../../types/gamification.types';
import { audioService } from '../../services/audioService';
import { Sparkles, Heart, Sun, Moon, Utensils, Loader2, RotateCw, ChevronDown } from 'lucide-react';
import confetti from 'canvas-confetti';

// -------------------------------------------------------------
// 🐾 Realistic 3D Animal Model Catalog (Anatomically Accurate GLTF Models)
// -------------------------------------------------------------
export interface RealisticModelDef {
  id: string;
  name: string;
  emoji: string;
  url: string;
  targetHeight: number;
  yOffset?: number;
  idleAnimNames: string[];
  eatAnimNames: string[];
  happyAnimNames: string[];
  walkAnimNames: string[];
  description: string;
}

export const REALISTIC_PET_CATALOG: Record<string, RealisticModelDef> = {
  shiba: {
    id: 'shiba',
    name: 'น้องหมาชิบะ',
    emoji: '🐕',
    url: '/models/ShibaInu.glb',
    targetHeight: 1.15,
    idleAnimNames: ['AnimalArmature|Idle', 'AnimalArmature|Idle_2'],
    eatAnimNames: ['AnimalArmature|Eating'],
    happyAnimNames: ['AnimalArmature|Gallop_Jump', 'AnimalArmature|Gallop'],
    walkAnimNames: ['AnimalArmature|Walk'],
    description: 'ชิบะอินุตัวจริง ขนส้มแน่น ทรงตัวสวย หูตั้ง ตาเป็นประกาย',
  },
  husky: {
    id: 'husky',
    name: 'ไซบีเรียน ฮัสกี้',
    emoji: '🐺',
    url: '/models/Husky.glb',
    targetHeight: 1.25,
    idleAnimNames: ['AnimalArmature|Idle', 'AnimalArmature|Idle_2'],
    eatAnimNames: ['AnimalArmature|Eating'],
    happyAnimNames: ['AnimalArmature|Gallop_Jump'],
    walkAnimNames: ['AnimalArmature|Walk'],
    description: 'ไซบีเรียนฮัสกี้ลายคม ขนเทาดำ ตาเท่ ท่าทางคล่องแคล่ว',
  },
  cat: {
    id: 'cat',
    name: 'น้องแมวเหมียว',
    emoji: '🐱',
    url: '/models/Cat.glb',
    targetHeight: 1.05,
    idleAnimNames: ['Scene'],
    eatAnimNames: ['Scene'],
    happyAnimNames: ['Scene'],
    walkAnimNames: ['Scene'],
    description: 'แมว 3D ลวดลายชัดเจน หูแหลม หางยาว ดวงตากลมโตเป็นธรรมชาติ',
  },
  fox: {
    id: 'fox',
    name: 'น้องจิ้งจอกป่า',
    emoji: '🦊',
    url: '/models/Fox.glb',
    targetHeight: 1.1,
    idleAnimNames: ['Survey'],
    eatAnimNames: ['Walk'],
    happyAnimNames: ['Run'],
    walkAnimNames: ['Walk'],
    description: 'จิ้งจอกขนสีส้มแดง พวงหางฟูนุ่ม พร้อมแอนิเมชันสังเกตการณ์',
  },
  alpaca: {
    id: 'alpaca',
    name: 'น้องอัลปาก้าขนฟู',
    emoji: '🦙',
    url: '/models/Alpaca.glb',
    targetHeight: 1.35,
    idleAnimNames: ['AnimalArmature|Idle', 'AnimalArmature|Idle_2'],
    eatAnimNames: ['AnimalArmature|Eating'],
    happyAnimNames: ['AnimalArmature|Gallop_Jump'],
    walkAnimNames: ['AnimalArmature|Walk'],
    description: 'อัลปาก้าขนปุกปุย คอยาวน่ารัก อ่อนโยนและอบอุ่น',
  },
  deer: {
    id: 'deer',
    name: 'น้องกวางใจดี',
    emoji: '🦌',
    url: '/models/Deer.glb',
    targetHeight: 1.3,
    idleAnimNames: ['AnimalArmature|Idle', 'AnimalArmature|Idle_2'],
    eatAnimNames: ['AnimalArmature|Eating'],
    happyAnimNames: ['AnimalArmature|Gallop_Jump'],
    walkAnimNames: ['AnimalArmature|Walk'],
    description: 'กวางป่าสง่างาม ท่าทางนุ่มนวล ตาหวานละมุน',
  },
  frog: {
    id: 'frog',
    name: 'น้องกบนำโชค',
    emoji: '🐸',
    url: '/models/Frog.glb',
    targetHeight: 0.9,
    idleAnimNames: ['FrogArmature|Frog_Idle'],
    eatAnimNames: ['FrogArmature|Frog_Attack'],
    happyAnimNames: ['FrogArmature|Frog_Jump'],
    walkAnimNames: ['FrogArmature|Frog_Jump'],
    description: 'กบ 3 มิติตัวน้อย ตาแป๋ว กระโดดดุ๊กดิ๊กนำโชคดีในการเรียน',
  },
  robot: {
    id: 'robot',
    name: 'โรบ็อตเพื่อนเรียน',
    emoji: '🤖',
    url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/RobotExpressive/RobotExpressive.glb',
    targetHeight: 1.25,
    idleAnimNames: ['Idle', 'Standing'],
    eatAnimNames: ['ThumbsUp'],
    happyAnimNames: ['Dance', 'Jump', 'Wave'],
    walkAnimNames: ['Walking'],
    description: 'หุ่นยนต์ Expressive ยอดนิยม พร้อมท่าเต้นและโบกมือทักทาย',
  },
};

// Default mapping from gamification PetType to realistic 3D animal
export const SPECIES_TO_MODEL_ID: Record<PetType, string> = {
  cat: 'cat',
  dog: 'shiba',
  squirrel: 'fox',
  rabbit: 'alpaca',
  turtle: 'deer',
  gecko: 'frog',
};

interface ThreePetSanctuaryProps {
  petType: PetType;
  petNickname: string;
  level: number;
  affection: number;
  favoriteSnack: string;
  isStudying?: boolean;
  onFeed?: () => void;
  height?: number | string;
  compact?: boolean;
  modelUrl?: string;
}

export type SanctuaryLighting = 'day' | 'night' | 'spring';

export const ThreePetSanctuary: React.FC<ThreePetSanctuaryProps> = ({
  petType,
  petNickname,
  level,
  affection,
  favoriteSnack,
  isStudying = false,
  onFeed,
  height = 420,
  compact = false,
  modelUrl,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [lighting, setLighting] = useState<SanctuaryLighting>('day');
  const [isSleeping, setIsSleeping] = useState(false);
  const [modelLoading, setModelLoading] = useState(true);
  const [activeModelKey, setActiveModelKey] = useState<string>(
    SPECIES_TO_MODEL_ID[petType] || 'shiba'
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [petStatusText, setPetStatusText] = useState<string>(
    'กำลังนั่งมองเธออ่านหนังสือด้วยความรัก 🐾'
  );

  // Sync activeModelKey when petType changes
  useEffect(() => {
    setActiveModelKey(SPECIES_TO_MODEL_ID[petType] || 'shiba');
  }, [petType]);

  // Action references
  const triggerFeedRef = useRef<(() => void) | null>(null);
  const triggerHappyRef = useRef<(() => void) | null>(null);
  const switchBaseLoopRef = useRef<((animName: string, fadeDuration?: number) => void) | null>(null);
  const isSleepingRef = useRef(isSleeping);
  isSleepingRef.current = isSleeping;

  // Selected Model Object
  const currentModelDef: RealisticModelDef =
    REALISTIC_PET_CATALOG[activeModelKey] || REALISTIC_PET_CATALOG.shiba;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let isDisposed = false;
    setModelLoading(true);

    // -------------------------------------------------------------
    // 1. Scene, Camera, WebGL Renderer
    // -------------------------------------------------------------
    const scene = new THREE.Scene();
    scene.background = null;

    const width = container.clientWidth || 600;
    const canvasHeight = typeof height === 'number' ? height : container.clientHeight || 420;

    const camera = new THREE.PerspectiveCamera(compact ? 36 : 38, width / canvasHeight, 0.1, 100);
    camera.position.set(0, compact ? 1.05 : 1.7, compact ? 3.1 : 4.4);
    camera.lookAt(0, compact ? 0.2 : 0.25, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, canvasHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // -------------------------------------------------------------
    // 2. 360-Degree Camera Orbit Controls (Drag to rotate 360°, scroll to zoom)
    // -------------------------------------------------------------
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false;
    controls.minDistance = 1.8;
    controls.maxDistance = 6.8;
    controls.minPolarAngle = Math.PI / 8;
    controls.maxPolarAngle = Math.PI / 2.05; // Prevent flipping below floor
    controls.target.set(0, compact ? 0.2 : 0.25, 0);

    // -------------------------------------------------------------
    // 3. Cozy Study Room Environment (Parquet floor, Woven rug, Desk, Plants, Lamp)
    // -------------------------------------------------------------
    const ambientLight = new THREE.AmbientLight(
      lighting === 'night' ? 0xffe4cc : 0xffffff,
      lighting === 'night' ? 0.8 : 1.3
    );
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(
      lighting === 'night' ? 0x60a5fa : lighting === 'spring' ? 0xfecdd3 : 0xfffbeb,
      lighting === 'night' ? 0.9 : 1.9
    );
    sunLight.position.set(4.5, 6, 3.5);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 15;
    sunLight.shadow.bias = -0.001;
    sunLight.shadow.radius = 2.5;
    scene.add(sunLight);

    const lampLight = new THREE.PointLight(0xffb74d, lighting === 'night' ? 3.0 : 1.5, 7);
    lampLight.position.set(-1.8, 1.8, -0.6);
    lampLight.castShadow = true;
    lampLight.shadow.mapSize.width = 512;
    lampLight.shadow.mapSize.height = 512;
    scene.add(lampLight);

    const bounceLight = new THREE.DirectionalLight(0xe0f2fe, 0.5);
    bounceLight.position.set(-3, -1, 3);
    scene.add(bounceLight);

    const roomGroup = new THREE.Group();
    scene.add(roomGroup);

    // Hardwood Parquet Floor
    const floorGeo = new THREE.PlaneGeometry(12, 12);
    const floorMat = new THREE.MeshStandardMaterial({
      color: lighting === 'night' ? 0x27242d : 0xdfcbaf,
      roughness: 0.65,
      metalness: 0.05,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.62;
    floor.receiveShadow = true;
    roomGroup.add(floor);

    // Fluffy Woven Rug for Pet
    const rugGeo = new THREE.CylinderGeometry(1.65, 1.75, 0.04, 36);
    const rugMat = new THREE.MeshStandardMaterial({
      color: lighting === 'night' ? 0x3730a3 : lighting === 'spring' ? 0xfce7f3 : 0xffedd5,
      roughness: 0.85,
    });
    const rug = new THREE.Mesh(rugGeo, rugMat);
    rug.position.set(0, -0.6, 0);
    rug.receiveShadow = true;
    roomGroup.add(rug);

    // Decorative Rug Fringe Ring
    const rugFringeGeo = new THREE.TorusGeometry(1.72, 0.025, 8, 36);
    const rugFringeMat = new THREE.MeshStandardMaterial({
      color: lighting === 'night' ? 0x6366f1 : 0xfbbf24,
      roughness: 0.9,
    });
    const fringe = new THREE.Mesh(rugFringeGeo, rugFringeMat);
    fringe.rotation.x = Math.PI / 2;
    fringe.position.set(0, -0.59, 0);
    roomGroup.add(fringe);

    // Study Desk in Background
    const deskGroup = new THREE.Group();
    deskGroup.position.set(-1.8, -0.6, -0.6);

    const deskTopGeo = new THREE.BoxGeometry(1.6, 0.08, 0.9);
    const deskMat = new THREE.MeshStandardMaterial({ color: 0xc89d7c, roughness: 0.5 });
    const deskTop = new THREE.Mesh(deskTopGeo, deskMat);
    deskTop.position.set(0, 1.25, 0);
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    deskGroup.add(deskTop);

    // Desk Legs
    const legGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.25, 12);
    [
      [-0.7, 0.62, -0.35],
      [0.7, 0.62, -0.35],
      [-0.7, 0.62, 0.35],
      [0.7, 0.62, 0.35],
    ].forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(legGeo, deskMat);
      leg.position.set(lx, ly, lz);
      leg.castShadow = true;
      deskGroup.add(leg);
    });

    // Cozy Desk Lamp
    const lampBaseGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.03, 16);
    const lampStemGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.45, 12);
    const lampHeadGeo = new THREE.ConeGeometry(0.16, 0.22, 16);
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.7, roughness: 0.3 });
    const lampBase = new THREE.Mesh(lampBaseGeo, brassMat);
    lampBase.position.set(-0.55, 1.3, -0.2);
    deskGroup.add(lampBase);

    const lampStem = new THREE.Mesh(lampStemGeo, brassMat);
    lampStem.position.set(-0.55, 1.52, -0.2);
    lampStem.rotation.z = -0.2;
    deskGroup.add(lampStem);

    const lampHead = new THREE.Mesh(lampHeadGeo, brassMat);
    lampHead.position.set(-0.48, 1.72, -0.2);
    lampHead.rotation.z = 0.55;
    deskGroup.add(lampHead);

    // Potted Desk Plant
    const potGeo = new THREE.CylinderGeometry(0.09, 0.07, 0.14, 16);
    const pot = new THREE.Mesh(potGeo, new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 }));
    pot.position.set(-0.35, 1.31, -0.25);
    deskGroup.add(pot);

    const leafMat = new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.5 });
    for (let k = 0; k < 6; k++) {
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), leafMat);
      leaf.scale.set(0.7, 1.5, 0.7);
      leaf.position.set(
        -0.35 + Math.cos((k * Math.PI) / 3) * 0.04,
        1.4,
        -0.25 + Math.sin((k * Math.PI) / 3) * 0.04
      );
      leaf.rotation.x = Math.sin(k) * 0.3;
      deskGroup.add(leaf);
    }
    roomGroup.add(deskGroup);

    // Miniature Open Book on Rug
    const openBookGroup = new THREE.Group();
    if (isStudying) {
      openBookGroup.position.set(0.2, -0.56, 0.65);
      openBookGroup.rotation.y = -0.12;
    } else {
      openBookGroup.position.set(0.55, -0.56, 0.65);
      openBookGroup.rotation.y = -0.35;
    }

    const pageMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 });
    const coverMat = new THREE.MeshStandardMaterial({ color: 0x6366f1, roughness: 0.4 });
    const leftPage = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.02, 0.32), pageMat);
    leftPage.position.set(-0.12, 0.01, 0);
    leftPage.rotation.z = 0.08;
    openBookGroup.add(leftPage);

    const rightPage = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.02, 0.32), pageMat);
    rightPage.position.set(0.12, 0.01, 0);
    rightPage.rotation.z = -0.08;
    openBookGroup.add(rightPage);

    const bookSpine = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.025, 0.34), coverMat);
    openBookGroup.add(bookSpine);
    roomGroup.add(openBookGroup);

    // Floating Dust Sparkles in Room
    const moteCount = 35;
    const motesGeo = new THREE.BufferGeometry();
    const motePositions = new Float32Array(moteCount * 3);
    for (let i = 0; i < moteCount * 3; i += 3) {
      motePositions[i] = (Math.random() - 0.5) * 5;
      motePositions[i + 1] = Math.random() * 3 - 0.2;
      motePositions[i + 2] = (Math.random() - 0.5) * 4;
    }
    motesGeo.setAttribute('position', new THREE.BufferAttribute(motePositions, 3));
    const motesMat = new THREE.PointsMaterial({
      color: lighting === 'night' ? 0xa5b4fc : 0xfef08a,
      size: 0.06,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const dustMotes = new THREE.Points(motesGeo, motesMat);
    scene.add(dustMotes);

    // -------------------------------------------------------------
    // 4. Load & Rig Realistic 3D Animal Model (.glb)
    // -------------------------------------------------------------
    const petContainer = new THREE.Group();
    petContainer.position.set(0, -0.58, 0);
    scene.add(petContainer);

    let mixer: THREE.AnimationMixer | null = null;
    const actions: Record<string, THREE.AnimationAction> = {};
    let activeAction: THREE.AnimationAction | null = null;
    let isPlayingOneShot = false;

    const playOneShot = (animName: string, duration = 0.25) => {
      if (!mixer) return;
      const targetAction = actions[animName];
      if (!targetAction || isPlayingOneShot) return;

      isPlayingOneShot = true;
      targetAction.reset();
      targetAction.setLoop(THREE.LoopOnce, 1);
      targetAction.clampWhenFinished = true;

      if (activeAction && activeAction !== targetAction) {
        targetAction.crossFadeFrom(activeAction, duration, true);
      }
      targetAction.play();

      const onFinished = (e: any) => {
        if (e.action === targetAction) {
          mixer?.removeEventListener('finished', onFinished);
          if (activeAction && activeAction !== targetAction) {
            activeAction.reset();
            activeAction.crossFadeFrom(targetAction, 0.35, true);
            activeAction.play();
          }
          isPlayingOneShot = false;
        }
      };
      mixer.addEventListener('finished', onFinished);
    };

    const triggerHappyAnimation = () => {
      if (!mixer) return;
      for (const name of currentModelDef.happyAnimNames) {
        if (actions[name]) {
          playOneShot(name, 0.2);
          return;
        }
      }
      // Fallback: any available animation
      const animKeys = Object.keys(actions);
      if (animKeys.length > 1) {
        playOneShot(animKeys[1], 0.2);
      }
    };
    triggerHappyRef.current = triggerHappyAnimation;

    const switchBaseLoop = (animName: string, fadeDuration = 0.35) => {
      if (!mixer) return;
      const nextAction = actions[animName];
      if (!nextAction || nextAction === activeAction) return;

      nextAction.reset();
      nextAction.setLoop(THREE.LoopRepeat, Infinity);
      if (activeAction) {
        nextAction.crossFadeFrom(activeAction, fadeDuration, true);
      }
      nextAction.play();
      activeAction = nextAction;
    };
    switchBaseLoopRef.current = switchBaseLoop;

    // Load Target GLTF Model
    const targetModelUrl = modelUrl || currentModelDef.url;
    const gltfLoader = new GLTFLoader();

    gltfLoader.load(
      targetModelUrl,
      (gltf) => {
        if (isDisposed) return;
        const model = gltf.scene;

        // Auto-normalize scale & align to rug top plane (y = -0.58)
        model.position.set(0, 0, 0);
        model.scale.set(1, 1, 1);
        model.updateMatrixWorld(true);

        const initialBox = new THREE.Box3().setFromObject(model);
        const size = initialBox.getSize(new THREE.Vector3());
        const maxDimension = Math.max(size.x, size.y, size.z);

        const targetScale = (currentModelDef.targetHeight * (compact ? 1.25 : 1.0)) / (maxDimension || 1);
        model.scale.set(targetScale, targetScale, targetScale);
        model.updateMatrixWorld(true);

        const scaledBox = new THREE.Box3().setFromObject(model);
        const center = scaledBox.getCenter(new THREE.Vector3());

        // Center on rug and snap feet exactly to the surface
        model.position.x = -center.x;
        model.position.z = -center.z;
        model.position.y = -scaledBox.min.y;

        // Apply shadow casting/receiving to all meshes & optimize materials
        model.traverse((child: any) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material) {
              child.material.roughness = child.material.roughness ?? 0.6;
            }
          }
        });

        petContainer.add(model);

        // Setup Animations
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);
          gltf.animations.forEach((clip: THREE.AnimationClip) => {
            actions[clip.name] = mixer!.clipAction(clip);
          });

          // Pick Idle Action
          let idleAction: THREE.AnimationAction | null = null;
          for (const idleName of currentModelDef.idleAnimNames) {
            if (actions[idleName]) {
              idleAction = actions[idleName];
              break;
            }
          }
          if (!idleAction && gltf.animations[0]) {
            idleAction = actions[gltf.animations[0].name];
          }

          if (idleAction) {
            activeAction = idleAction;
            activeAction.play();
          }
        }

        setModelLoading(false);
      },
      undefined,
      (err) => {
        console.error('Failed to load 3D animal model:', err);
        setModelLoading(false);
      }
    );

    // -------------------------------------------------------------
    // 5. Interactive Feeding Treat Drop & Munching Animation
    // -------------------------------------------------------------
    let activeTreatMesh: THREE.Group | null = null;
    let treatVelocityY = 0;
    let isEatingTreat = false;
    let eatDurationTimer = 0;

    const spawnTreatSnack = () => {
      if (activeTreatMesh) {
        scene.remove(activeTreatMesh);
        activeTreatMesh = null;
      }

      const treatGroup = new THREE.Group();
      treatGroup.position.set(0.12, 1.8, 0.45);

      // Create detailed food item matching snack type
      if (activeModelKey === 'cat' || petType === 'cat') {
        // Salmon slice
        const salmon = new THREE.Mesh(
          new THREE.BoxGeometry(0.26, 0.08, 0.16),
          new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.3 })
        );
        const stripe = new THREE.Mesh(
          new THREE.BoxGeometry(0.035, 0.085, 0.17),
          new THREE.MeshStandardMaterial({ color: 0xffedd5 })
        );
        salmon.add(stripe);
        treatGroup.add(salmon);
      } else if (activeModelKey === 'shiba' || activeModelKey === 'husky' || petType === 'dog') {
        // Dog bone
        const boneMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.4 });
        const bone = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.28, 12), boneMat);
        bone.rotation.z = Math.PI / 2;
        treatGroup.add(bone);
        [-0.14, 0.14].forEach((bx) => {
          const ball1 = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), boneMat);
          ball1.position.set(bx, 0.045, 0);
          treatGroup.add(ball1);
          const ball2 = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), boneMat);
          ball2.position.set(bx, -0.045, 0);
          treatGroup.add(ball2);
        });
      } else if (activeModelKey === 'alpaca' || petType === 'rabbit') {
        // Baby carrot
        const carrot = new THREE.Mesh(
          new THREE.ConeGeometry(0.065, 0.26, 12),
          new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.4 })
        );
        carrot.rotation.x = Math.PI;
        treatGroup.add(carrot);
        const leaves = new THREE.Mesh(
          new THREE.BoxGeometry(0.03, 0.1, 0.03),
          new THREE.MeshStandardMaterial({ color: 0x22c55e })
        );
        leaves.position.y = 0.16;
        treatGroup.add(leaves);
      } else if (activeModelKey === 'fox' || petType === 'squirrel') {
        // Acorn
        const acornNut = new THREE.Mesh(
          new THREE.SphereGeometry(0.1, 16, 16),
          new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.4 })
        );
        const acornCap = new THREE.Mesh(
          new THREE.CylinderGeometry(0.11, 0.08, 0.06, 16),
          new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6 })
        );
        acornCap.position.y = 0.07;
        treatGroup.add(acornNut);
        treatGroup.add(acornCap);
      } else if (activeModelKey === 'frog' || petType === 'gecko') {
        // Sweet jelly bead
        const jelly = new THREE.Mesh(
          new THREE.SphereGeometry(0.12, 16, 16),
          new THREE.MeshPhysicalMaterial({ color: 0xec4899, roughness: 0.1, transmission: 0.7, thickness: 0.4 })
        );
        treatGroup.add(jelly);
      } else {
        // Clover / Grass Snack
        const cloverMat = new THREE.MeshStandardMaterial({ color: 0x22c55e });
        for (let c = 0; c < 4; c++) {
          const petal = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 8), cloverMat);
          petal.scale.set(1, 0.3, 1.3);
          petal.position.set(Math.cos((c * Math.PI) / 2) * 0.06, 0, Math.sin((c * Math.PI) / 2) * 0.06);
          treatGroup.add(petal);
        }
      }

      treatGroup.castShadow = true;
      scene.add(treatGroup);
      activeTreatMesh = treatGroup;
      treatVelocityY = 0;
      isEatingTreat = false;
      eatDurationTimer = 0;

      // Trigger Eating Animation on 3D Model
      if (mixer) {
        for (const eatAnim of currentModelDef.eatAnimNames) {
          if (actions[eatAnim]) {
            playOneShot(eatAnim, 0.25);
            break;
          }
        }
      }

      setPetStatusText(`โอ้โห! ของโปรด (${favoriteSnack}) ตกลงมาแล้ว! 😋`);
    };
    triggerFeedRef.current = spawnTreatSnack;

    // -------------------------------------------------------------
    // 6. User Pointer Tracking & Click vs Drag Handling
    // -------------------------------------------------------------
    let pointerStartX = 0;
    let pointerStartY = 0;
    let pointerStartTime = 0;
    let mouseTargetX = 0;
    let isHoveringPet = false;

    const onPointerDown = (e: MouseEvent) => {
      pointerStartX = e.clientX;
      pointerStartY = e.clientY;
      pointerStartTime = Date.now();
    };

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseTargetX = nx;

      const dist = Math.sqrt(nx * nx + ny * ny);
      if (dist < 0.45 && !isHoveringPet) {
        isHoveringPet = true;
        audioService.playPurr();
        setPetStatusText(`งื้อออ... ลูบตัว ${petNickname} แล้วฟินจังเลย มีความสุขที่สุด 💖`);
      } else if (dist >= 0.45 && isHoveringPet) {
        isHoveringPet = false;
      }
    };

    const onPointerUp = (e: MouseEvent) => {
      const dx = Math.abs(e.clientX - pointerStartX);
      const dy = Math.abs(e.clientY - pointerStartY);
      const dt = Date.now() - pointerStartTime;

      // If user moved mouse < 6px and released < 350ms, count as a genuine click (not a 360° orbit drag)
      if (dx < 6 && dy < 6 && dt < 350) {
        audioService.playPop();
        audioService.playPetVoice(petType);

        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 0.65 },
          colors: ['#f472b6', '#fef08a', '#38bdf8', '#fbbf24', '#a855f7'],
        });

        if (triggerHappyRef.current) {
          triggerHappyRef.current();
        }

        setPetStatusText(`${petNickname} ดีใจมากๆ ที่เธอมาเล่นด้วย! ลุยอ่านหนังสือด้วยกันต่อนะ ✨🐾`);
      }
    };

    container.addEventListener('mousedown', onPointerDown);
    container.addEventListener('mousemove', onPointerMove);
    container.addEventListener('mouseup', onPointerUp);

    const onWindowResize = () => {
      if (!container) return;
      const w = container.clientWidth || 600;
      const h = typeof height === 'number' ? height : container.clientHeight || 420;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onWindowResize);

    // -------------------------------------------------------------
    // 7. Render Loop
    // -------------------------------------------------------------
    let animFrameId: number;
    const clock = new THREE.Clock();

    const render = () => {
      animFrameId = requestAnimationFrame(render);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Update GLTF animation mixer
      if (mixer) {
        mixer.update(delta);
      }

      // Smooth look-at tracking towards cursor (natural gentle yaw rotation)
      if (!isSleepingRef.current && petContainer.children.length > 0) {
        petContainer.rotation.y = THREE.MathUtils.lerp(
          petContainer.rotation.y,
          mouseTargetX * 0.4,
          0.08
        );
      }

      // Update Dust Sparkles
      const posAttr = dustMotes.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < moteCount; i++) {
        let py = posAttr.getY(i) + delta * 0.15;
        if (py > 3.0) py = -0.2;
        posAttr.setY(i, py);
        posAttr.setX(i, posAttr.getX(i) + Math.sin(elapsed + i) * 0.001);
      }
      posAttr.needsUpdate = true;

      // Treat Falling & Eating Physics
      if (activeTreatMesh) {
        if (activeTreatMesh.position.y > -0.52) {
          treatVelocityY -= 9.8 * delta * 0.08;
          activeTreatMesh.position.y += treatVelocityY;
          activeTreatMesh.rotation.y += delta * 4;
          if (activeTreatMesh.position.y <= -0.52) {
            activeTreatMesh.position.y = -0.52;
            treatVelocityY = 0;
            isEatingTreat = true;
            audioService.playMunch();
          }
        } else if (isEatingTreat) {
          eatDurationTimer += delta;
          const scale = Math.max(0.001, 1 - eatDurationTimer / 1.5);
          activeTreatMesh.scale.set(scale, scale, scale);

          if (eatDurationTimer > 1.5) {
            scene.remove(activeTreatMesh);
            activeTreatMesh = null;
            isEatingTreat = false;

            confetti({
              particleCount: 32,
              spread: 65,
              origin: { y: 0.6 },
              colors: ['#22c55e', '#fef08a', '#f472b6', '#38bdf8'],
            });
            setPetStatusText(`งั่มๆ อร่อยมากเลย! ${petNickname} พลังใจเต็มเปี่ยมแล้ว พร้อมลุย! 🌟`);
          }
        }
      }

      // Orbit controls damping update (allows smooth 360° rotation)
      controls.update();

      renderer.render(scene, camera);
    };

    render();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', onWindowResize);
      container.removeEventListener('mousedown', onPointerDown);
      container.removeEventListener('mousemove', onPointerMove);
      container.removeEventListener('mouseup', onPointerUp);
      controls.dispose();
      if (mixer) {
        mixer.stopAllAction();
      }
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [activeModelKey, lighting, compact, height, favoriteSnack, petNickname, petType, modelUrl]);

  // Handle feed button click
  const handleFeedClick = () => {
    if (triggerFeedRef.current) {
      triggerFeedRef.current();
    }
    if (onFeed) {
      onFeed();
    }
  };

  const toggleLighting = () => {
    audioService.playPop();
    setLighting((prev) => (prev === 'day' ? 'night' : prev === 'night' ? 'spring' : 'day'));
  };

  const toggleSleep = () => {
    audioService.playPop();
    const next = !isSleeping;
    setIsSleeping(next);
    if (switchBaseLoopRef.current) {
      if (next) {
        switchBaseLoopRef.current('Sitting', 0.5);
      } else {
        switchBaseLoopRef.current(currentModelDef.idleAnimNames[0], 0.5);
      }
    }
    setPetStatusText(
      !next
        ? 'ตื่นแล้ว! พร้อมลุยอ่านหนังสือด้วยกัน! ✨'
        : `${petNickname} กำลังหลับปุ๋ย ฝันดีนะ Zzz... 💤`
    );
  };

  const handleSelectModel = (modelId: string) => {
    audioService.playPop();
    setActiveModelKey(modelId);
    setIsMenuOpen(false);
    const chosen = REALISTIC_PET_CATALOG[modelId];
    if (chosen) {
      setPetStatusText(`สลับโมเดลเป็น ${chosen.name} ${chosen.emoji} เรียบร้อยแล้ว!`);
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        borderRadius: '24px',
        overflow: 'hidden',
        background:
          lighting === 'night'
            ? 'radial-gradient(ellipse at 50% 20%, #1e1e38 0%, #0d0d1a 100%)'
            : lighting === 'spring'
            ? 'radial-gradient(ellipse at 50% 20%, #fdf2f8 0%, #fed7aa 100%)'
            : 'radial-gradient(ellipse at 50% 20%, #fefce8 0%, #e0f2fe 100%)',
        boxShadow:
          lighting === 'night'
            ? '0 12px 32px rgba(15, 23, 42, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.1)'
            : '0 12px 32px rgba(56, 189, 248, 0.18), inset 0 1px 2px rgba(255, 255, 255, 0.6)',
        transition: 'background 0.6s ease',
      }}
    >
      {/* Top Floating Controls Bar */}
      <div
        style={{
          position: 'absolute',
          top: compact ? '8px' : '14px',
          left: compact ? '8px' : '16px',
          right: compact ? '8px' : '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 20,
          pointerEvents: 'none',
          gap: '6px',
        }}
      >
        {/* Level & Name Badge */}
        <div
          style={{
            pointerEvents: 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            gap: compact ? '3px' : '6px',
            padding: compact ? '4px 10px' : '6px 14px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            fontSize: compact ? '0.74rem' : '0.85rem',
            fontWeight: 600,
            color: 'var(--text-dark)',
          }}
        >
          <Sparkles size={compact ? 12 : 14} color="#f59e0b" />
          <span>
            Lv.{level} {petNickname}
          </span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px',
              marginLeft: compact ? '4px' : '6px',
              fontSize: compact ? '0.7rem' : '0.78rem',
              color: '#e11d48',
            }}
          >
            <Heart size={compact ? 10 : 12} fill="#e11d48" /> {affection}%
          </span>
        </div>

        {/* Atmosphere & Realistic 3D Model Switcher */}
        <div style={{ display: 'flex', gap: compact ? '4px' : '8px', pointerEvents: 'auto', position: 'relative' }}>
          {/* Realistic 3D Animal Selector Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="glass-card"
              style={{
                padding: compact ? '4px 8px' : '6px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: compact ? '0.72rem' : '0.78rem',
                fontWeight: 600,
                background: 'rgba(254, 240, 138, 0.95)',
                border: '1.5px solid #facc15',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                color: '#854d0e',
              }}
              title="เปลี่ยนโมเดลสัตว์ 3D สมจริงตัวอื่น"
            >
              <span>{currentModelDef.emoji} {currentModelDef.name}</span>
              <ChevronDown size={12} />
            </button>

            {/* Dropdown Menu of Realistic Animals */}
            {isMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '6px',
                  width: '210px',
                  background: 'rgba(255, 255, 255, 0.96)',
                  backdropFilter: 'blur(14px)',
                  borderRadius: '16px',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
                  border: '1px solid rgba(255, 255, 255, 0.8)',
                  padding: '6px',
                  zIndex: 30,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <div style={{ padding: '4px 8px', fontSize: '0.7rem', fontWeight: 700, color: '#64748b', borderBottom: '1px solid #f1f5f9' }}>
                  🐾 เลือกสัตว์เลี้ยง 3D สมจริง
                </div>
                {Object.values(REALISTIC_PET_CATALOG).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleSelectModel(m.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 10px',
                      borderRadius: '10px',
                      border: 'none',
                      background: activeModelKey === m.id ? '#fef08a' : 'transparent',
                      color: activeModelKey === m.id ? '#854d0e' : '#1e293b',
                      fontSize: '0.78rem',
                      fontWeight: activeModelKey === m.id ? 700 : 500,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span style={{ fontSize: '1rem' }}>{m.emoji}</span>
                    <span style={{ flex: 1 }}>{m.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Lighting Mode */}
          <button
            onClick={toggleLighting}
            className="glass-card"
            style={{
              padding: compact ? '4px 8px' : '6px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: compact ? '0.72rem' : '0.78rem',
              fontWeight: 600,
              background: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              color: 'var(--text-dark)',
            }}
            title="สลับบรรยากาศแสงในห้อง"
          >
            {lighting === 'night' ? (
              <Moon size={compact ? 12 : 14} color="#818cf8" />
            ) : (
              <Sun size={compact ? 12 : 14} color="#f59e0b" />
            )}
            <span>
              {lighting === 'day' ? '☀️ กลางวัน' : lighting === 'night' ? '🌙 กลางคืน' : '🌸 ซากุระ'}
            </span>
          </button>

          {/* Sleep / Awake */}
          <button
            onClick={toggleSleep}
            className="glass-card"
            style={{
              padding: compact ? '4px 8px' : '6px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: compact ? '0.72rem' : '0.78rem',
              fontWeight: 600,
              background: isSleeping ? 'rgba(224, 231, 255, 0.95)' : 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(10px)',
              cursor: 'pointer',
              color: isSleeping ? '#4338ca' : 'var(--text-dark)',
            }}
            title="สั่งให้น้องนอนพักผ่อนหรือตื่น"
          >
            {isSleeping ? '💤 กำลังนอน' : '👀 ตื่นอยู่'}
          </button>
        </div>
      </div>

      {/* 3D Model Loading Spinner Overlay */}
      {modelLoading && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 15,
            padding: '10px 18px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: 'var(--text-dark)',
            pointerEvents: 'none',
          }}
        >
          <Loader2 size={16} className="animate-spin" color="#0284c7" />
          <span>กำลังโหลดโมเดล 3D สมจริง... 🐾</span>
        </div>
      )}

      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: typeof height === 'number' ? `${height}px` : height,
          cursor: 'grab',
        }}
      />

      {/* 360-Degree Orbit Controls Hint Badge */}
      <div
        style={{
          position: 'absolute',
          right: compact ? '8px' : '16px',
          top: compact ? '44px' : '58px',
          zIndex: 9,
          pointerEvents: 'none',
          padding: '4px 10px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.7)',
          fontSize: compact ? '0.68rem' : '0.73rem',
          fontWeight: 600,
          color: '#0369a1',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        <RotateCw size={12} />
        <span>หมุนดูได้ 360° / ซูมเข้า-ออกได้</span>
      </div>

      {/* Interactive Bottom Overlay: Dialogue Bubble & Feed Button */}
      <div
        style={{
          position: 'absolute',
          bottom: compact ? '8px' : '14px',
          left: compact ? '10px' : '16px',
          right: compact ? '10px' : '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: compact ? 'center' : 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        {/* Status / Speech Bubble */}
        <div
          style={{
            pointerEvents: 'auto',
            padding: compact ? '5px 12px' : '8px 16px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            fontSize: compact ? '0.76rem' : '0.84rem',
            color: 'var(--text-dark)',
            fontWeight: 500,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            maxWidth: '100%',
            animation: 'floatSlow 4s ease-in-out infinite',
          }}
        >
          <span>{petStatusText}</span>
        </div>

        {/* Action Button: Feed Snack (Only in full mode; compact mode uses external button) */}
        {!compact && (
          <div style={{ display: 'flex', gap: '8px', pointerEvents: 'auto' }}>
            <button
              onClick={handleFeedClick}
              className="cozy-btn-primary"
              style={{
                padding: '8px 16px',
                fontSize: '0.84rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 6px 16px rgba(14, 165, 233, 0.35)',
              }}
            >
              <Utensils size={14} />
              <span>ป้อนขนม {favoriteSnack.split(' ')[0]} (-15 ⭐)</span>
            </button>
          </div>
        )}
      </div>

      {/* Subtle Interaction Hint */}
      <div
        style={{
          position: 'absolute',
          bottom: '52px',
          right: '18px',
          fontSize: '0.72rem',
          color: lighting === 'night' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.45)',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        🖐️ ลากเมาส์เพื่อหมุน 360° / คลิกเพื่อเล่น / ป้อนขนม
      </div>
    </div>
  );
};
