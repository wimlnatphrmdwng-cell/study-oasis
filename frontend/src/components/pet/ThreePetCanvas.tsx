import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { PetType } from '../../types/gamification.types';

interface ThreePetCanvasProps {
  petType: PetType;
  isStudying?: boolean;
  size?: number;
  onClick?: () => void;
}

export const ThreePetCanvas: React.FC<ThreePetCanvasProps> = ({
  petType,
  isStudying = false,
  size = 200,
  onClick,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(0, 1.2, 4.6);
    camera.lookAt(0, 0.1, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 2. Soft Studio Lighting (Pastel Atmosphere)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff8e7, 1.6);
    keyLight.position.set(3, 5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 512;
    keyLight.shadow.mapSize.height = 512;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xbae6fd, 0.9);
    fillLight.position.set(-3, 2, -2);
    scene.add(fillLight);

    // Soft Shadow Floor Disc
    const shadowGeo = new THREE.CircleGeometry(0.85, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.16,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -0.55;
    scene.add(shadowMesh);

    // 3. Procedural 3D Pet Model Root
    const petGroup = new THREE.Group();
    scene.add(petGroup);

    // Materials
    const clayMat = (color: number) =>
      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.5,
        metalness: 0.05,
      });

    const eyeMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.1,
      metalness: 0.2,
    });

    const blushMat = new THREE.MeshStandardMaterial({
      color: 0xfbcfe8,
      roughness: 0.8,
    });

    // Reference parts for animation
    let tailMesh: THREE.Object3D | null = null;
    let headMesh: THREE.Object3D | null = null;
    let earsGroup: THREE.Group | null = null;

    // Helper: Add cute eyes and blush
    const addCuteFace = (parent: THREE.Group, eyeX = 0.22, eyeY = 0.1, eyeZ = 0.38) => {
      // Left & Right Eyes
      const eyeGeo = new THREE.SphereGeometry(0.065, 16, 16);
      const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
      leftEye.position.set(-eyeX, eyeY, eyeZ);
      parent.add(leftEye);

      const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
      rightEye.position.set(eyeX, eyeY, eyeZ);
      parent.add(rightEye);

      // Eye Sparkles
      const sparkleGeo = new THREE.SphereGeometry(0.022, 8, 8);
      const sparkleMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const leftSparkle = new THREE.Mesh(sparkleGeo, sparkleMat);
      leftSparkle.position.set(-eyeX + 0.02, eyeY + 0.02, eyeZ + 0.05);
      parent.add(leftSparkle);

      const rightSparkle = new THREE.Mesh(sparkleGeo, sparkleMat);
      rightSparkle.position.set(eyeX + 0.02, eyeY + 0.02, eyeZ + 0.05);
      parent.add(rightSparkle);

      // Rosy Cheeks
      const blushGeo = new THREE.SphereGeometry(0.06, 12, 12);
      const leftBlush = new THREE.Mesh(blushGeo, blushMat);
      leftBlush.scale.set(1.2, 0.6, 0.4);
      leftBlush.position.set(-eyeX - 0.08, eyeY - 0.08, eyeZ - 0.04);
      parent.add(leftBlush);

      const rightBlush = new THREE.Mesh(blushGeo, blushMat);
      rightBlush.scale.set(1.2, 0.6, 0.4);
      rightBlush.position.set(eyeX + 0.08, eyeY - 0.08, eyeZ - 0.04);
      parent.add(rightBlush);
    };

    // Helper: Add glasses
    const addGlasses = (parent: THREE.Group, eyeX = 0.22, eyeY = 0.1, eyeZ = 0.42) => {
      const glassesMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 });
      const rimGeo = new THREE.TorusGeometry(0.1, 0.018, 12, 24);

      const leftRim = new THREE.Mesh(rimGeo, glassesMat);
      leftRim.position.set(-eyeX, eyeY, eyeZ);
      parent.add(leftRim);

      const rightRim = new THREE.Mesh(rimGeo, glassesMat);
      rightRim.position.set(eyeX, eyeY, eyeZ);
      parent.add(rightRim);

      // Bridge
      const bridgeGeo = new THREE.CylinderGeometry(0.015, 0.015, eyeX * 1.5);
      const bridge = new THREE.Mesh(bridgeGeo, glassesMat);
      bridge.rotation.z = Math.PI / 2;
      bridge.position.set(0, eyeY + 0.02, eyeZ);
      parent.add(bridge);
    };

    // ==========================================
    // Build Specific 3D Pet Geometry
    // ==========================================
    if (petType === 'gecko') {
      // 🦎 1. Fat-Tailed Gecko (ตุ๊กแกหางอ้วน)
      // Body (Warm cream pastel chubby torso)
      const bodyGeo = new THREE.SphereGeometry(0.48, 24, 24);
      bodyGeo.scale(1, 0.85, 1.2);
      const body = new THREE.Mesh(bodyGeo, clayMat(0xfef08a));
      body.position.set(0, -0.05, 0);
      petGroup.add(body);

      // Gecko Head
      const head = new THREE.Group();
      head.position.set(0, 0.25, 0.35);
      const headSphere = new THREE.Mesh(new THREE.SphereGeometry(0.38, 24, 24), clayMat(0xfef08a));
      headSphere.scale.set(1.15, 0.9, 1.1);
      head.add(headSphere);
      addCuteFace(head, 0.22, 0.06, 0.35);
      addGlasses(head, 0.22, 0.06, 0.4);
      petGroup.add(head);
      headMesh = head;

      // Chubby bulbous tail (หางอ้วนป่องซิกเนเจอร์)
      const tailGroup = new THREE.Group();
      tailGroup.position.set(0, -0.08, -0.5);

      const tailGeo = new THREE.SphereGeometry(0.32, 20, 20);
      tailGeo.scale(0.85, 0.75, 1.6);
      const tailBulb = new THREE.Mesh(tailGeo, clayMat(0xfef08a));
      tailBulb.position.set(0, 0.08, -0.32);
      tailGroup.add(tailBulb);

      // Tail spots
      const spotMat = clayMat(0xfbcfe8);
      const spot1 = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), spotMat);
      spot1.position.set(0.08, 0.2, -0.3);
      tailGroup.add(spot1);

      const spot2 = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), spotMat);
      spot2.position.set(-0.06, 0.18, -0.45);
      tailGroup.add(spot2);

      petGroup.add(tailGroup);
      tailMesh = tailGroup;

      // Paws
      const pawGeo = new THREE.SphereGeometry(0.1, 12, 12);
      const pawMat = clayMat(0xfef08a);
      [-0.38, 0.38].forEach((x) => {
        const frontPaw = new THREE.Mesh(pawGeo, pawMat);
        frontPaw.scale.set(1.1, 0.6, 1.3);
        frontPaw.position.set(x, -0.4, 0.3);
        petGroup.add(frontPaw);

        const backPaw = new THREE.Mesh(pawGeo, pawMat);
        backPaw.scale.set(1.2, 0.6, 1.4);
        backPaw.position.set(x * 1.1, -0.4, -0.25);
        petGroup.add(backPaw);
      });
    } else if (petType === 'cat') {
      // 🐱 2. Orange Cat (แมวส้ม)
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.44, 24, 24), clayMat(0xfdba74));
      body.scale.set(1, 1.1, 1);
      petGroup.add(body);

      const head = new THREE.Group();
      head.position.set(0, 0.32, 0.15);
      const headSphere = new THREE.Mesh(new THREE.SphereGeometry(0.36, 24, 24), clayMat(0xfdba74));
      head.add(headSphere);

      // Ears
      const earGeo = new THREE.ConeGeometry(0.12, 0.22, 4);
      const leftEar = new THREE.Mesh(earGeo, clayMat(0xfdba74));
      leftEar.position.set(-0.2, 0.32, 0);
      leftEar.rotation.z = 0.3;
      head.add(leftEar);

      const rightEar = new THREE.Mesh(earGeo, clayMat(0xfdba74));
      rightEar.position.set(0.2, 0.32, 0);
      rightEar.rotation.z = -0.3;
      head.add(rightEar);

      addCuteFace(head, 0.18, 0.04, 0.34);
      petGroup.add(head);
      headMesh = head;

      // Curled Tail
      const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 0.5, 12), clayMat(0xfdba74));
      tail.position.set(0, 0.15, -0.4);
      tail.rotation.x = -1.1;
      petGroup.add(tail);
      tailMesh = tail;
    } else if (petType === 'dog') {
      // 🐶 3. Corgi Dog (หมาคอร์กี้)
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.44, 24, 24), clayMat(0xfed7aa));
      body.scale.set(1.05, 0.95, 1.25);
      petGroup.add(body);

      const head = new THREE.Group();
      head.position.set(0, 0.3, 0.28);
      head.add(new THREE.Mesh(new THREE.SphereGeometry(0.36, 24, 24), clayMat(0xfed7aa)));

      // Corgi Big Ears
      const earGeo = new THREE.ConeGeometry(0.15, 0.32, 4);
      const leftEar = new THREE.Mesh(earGeo, clayMat(0xfed7aa));
      leftEar.position.set(-0.24, 0.32, 0);
      leftEar.rotation.z = 0.45;
      head.add(leftEar);

      const rightEar = new THREE.Mesh(earGeo, clayMat(0xfed7aa));
      rightEar.position.set(0.24, 0.32, 0);
      rightEar.rotation.z = -0.45;
      head.add(rightEar);

      addCuteFace(head, 0.18, 0.04, 0.34);
      petGroup.add(head);
      headMesh = head;

      // Tiny heart tail
      const tail = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), clayMat(0xffffff));
      tail.position.set(0, 0, -0.6);
      petGroup.add(tail);
      tailMesh = tail;
    } else if (petType === 'rabbit') {
      // 🐰 4. White Bunny (กระต่าย)
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 24), clayMat(0xf8fafc));
      petGroup.add(body);

      const head = new THREE.Group();
      head.position.set(0, 0.32, 0.12);
      head.add(new THREE.Mesh(new THREE.SphereGeometry(0.34, 24, 24), clayMat(0xf8fafc)));

      // Long bunny ears
      const earGroup = new THREE.Group();
      const earGeo = new THREE.CylinderGeometry(0.07, 0.09, 0.52, 12);
      const leftEar = new THREE.Mesh(earGeo, clayMat(0xf8fafc));
      leftEar.position.set(-0.16, 0.42, 0);
      leftEar.rotation.z = 0.15;
      earGroup.add(leftEar);

      const rightEar = new THREE.Mesh(earGeo, clayMat(0xf8fafc));
      rightEar.position.set(0.16, 0.42, 0);
      rightEar.rotation.z = -0.15;
      earGroup.add(rightEar);
      head.add(earGroup);
      earsGroup = earGroup;

      addCuteFace(head, 0.16, 0.02, 0.32);
      petGroup.add(head);
      headMesh = head;
    } else if (petType === 'squirrel') {
      // 🐿️ 5. Squirrel (กระรอก)
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 24), clayMat(0xd97706));
      petGroup.add(body);

      const head = new THREE.Group();
      head.position.set(0, 0.32, 0.16);
      head.add(new THREE.Mesh(new THREE.SphereGeometry(0.34, 24, 24), clayMat(0xd97706)));
      addCuteFace(head, 0.16, 0.04, 0.32);
      petGroup.add(head);
      headMesh = head;

      // Giant curled squirrel tail
      const tailGeo = new THREE.TorusGeometry(0.35, 0.16, 12, 24, Math.PI * 1.3);
      const tail = new THREE.Mesh(tailGeo, clayMat(0xb45309));
      tail.position.set(0, 0.32, -0.32);
      tail.rotation.y = Math.PI / 2;
      petGroup.add(tail);
      tailMesh = tail;
    } else {
      // 🐢 6. Turtle (เต่าน้อย)
      // Shell
      const shellGeo = new THREE.SphereGeometry(0.5, 24, 16);
      shellGeo.scale(1, 0.7, 1.15);
      const shell = new THREE.Mesh(shellGeo, clayMat(0x86efac));
      petGroup.add(shell);

      const head = new THREE.Group();
      head.position.set(0, 0.1, 0.48);
      head.add(new THREE.Mesh(new THREE.SphereGeometry(0.24, 20, 20), clayMat(0xbbf7d0)));

      // Graduation Cap
      const capMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
      const capPlate = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.03, 0.3), capMat);
      capPlate.position.set(0, 0.25, 0);
      head.add(capPlate);

      addCuteFace(head, 0.12, 0.02, 0.22);
      petGroup.add(head);
      headMesh = head;
    }

    // Mini Book in front if studying
    if (isStudying) {
      const bookMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8 });
      const bookPageMat = new THREE.MeshStandardMaterial({ color: 0xffffff });

      const bookCover = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.04, 0.3), bookMat);
      bookCover.position.set(0, -0.4, 0.52);
      bookCover.rotation.x = 0.3;
      petGroup.add(bookCover);

      const bookPages = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.03, 0.28), bookPageMat);
      bookPages.position.set(0, -0.38, 0.52);
      bookPages.rotation.x = 0.3;
      petGroup.add(bookPages);
    }

    // ==========================================
    // 4D Interactive Loop: Mouse Tracking & Motion
    // ==========================================
    let targetRotY = 0;
    let targetRotX = 0;
    let hopOffset = 0;
    let hopVelocity = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotY = x * 0.45;
      targetRotX = -y * 0.25;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const triggerHop = () => {
      hopVelocity = 0.07;
      if (onClick) onClick();
    };

    container.addEventListener('click', triggerHop);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // 4D Mouse Parallax Lerping
      petGroup.rotation.y += (targetRotY - petGroup.rotation.y) * 0.08;
      petGroup.rotation.x += (targetRotX - petGroup.rotation.x) * 0.08;

      // 4D Breathing Cycle
      const breathScale = 1 + Math.sin(elapsedTime * 3) * 0.025;
      petGroup.scale.set(breathScale, 1 / breathScale, breathScale);

      // 4D Signature Tail Wagging (Gecko / Cat / Dog)
      if (tailMesh) {
        tailMesh.rotation.y = Math.sin(elapsedTime * 4.5) * 0.28;
      }

      // Head gentle tilt
      if (headMesh) {
        headMesh.rotation.z = Math.sin(elapsedTime * 2.5) * 0.04;
      }

      // Ear Twitch for Bunny
      if (earsGroup) {
        earsGroup.rotation.z = Math.sin(elapsedTime * 6) * 0.06;
      }

      // Hop Physics on Click
      if (hopVelocity > 0 || hopOffset > 0) {
        hopOffset += hopVelocity;
        hopVelocity -= 0.005; // gravity
        if (hopOffset <= 0) {
          hopOffset = 0;
          hopVelocity = 0;
        }
        petGroup.position.y = hopOffset;
        petGroup.rotation.y += 0.15; // spin during hop
      } else {
        petGroup.position.y = Math.sin(elapsedTime * 2) * 0.03;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('click', triggerHop);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [petType, isStudying, size, onClick]);

  return (
    <div
      ref={mountRef}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        margin: '0 auto',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
      }}
      title="คลิกเล่นกับน้องสัตว์เลี้ยง 3D!"
    />
  );
};
