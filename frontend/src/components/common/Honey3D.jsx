import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Move3d } from 'lucide-react';

export default function Honey3D({ onInteract }) {
  const containerRef = useRef(null);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const width = container.clientWidth || 450;
    const height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 6.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.8;
    controls.enableZoom = false;
    controls.maxPolarAngle = Math.PI / 1.6;
    controls.minPolarAngle = Math.PI / 3.0;

    controls.addEventListener('start', () => {
      setIsInteracting(true);
      if (onInteract) onInteract();
    });
    controls.addEventListener('end', () => {
      setTimeout(() => setIsInteracting(false), 2000);
    });

    const bottleGroup = new THREE.Group();
    scene.add(bottleGroup);

    // 1. Profil Botol Kaca (LatheGeometry)
    const bottlePoints = [
      new THREE.Vector2(0.0, -1.6),
      new THREE.Vector2(0.95, -1.6),
      new THREE.Vector2(1.05, -1.45),
      new THREE.Vector2(1.05, 0.4),
      new THREE.Vector2(0.95, 0.75),
      new THREE.Vector2(0.55, 1.05),
      new THREE.Vector2(0.55, 1.45),
      new THREE.Vector2(0.62, 1.48),
      new THREE.Vector2(0.52, 1.52)
    ];
    const glassGeom = new THREE.LatheGeometry(bottlePoints, 48);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.38,
      roughness: 0.08,
      metalness: 0.1,
      reflectivity: 1.0,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      side: THREE.DoubleSide
    });
    const glassMesh = new THREE.Mesh(glassGeom, glassMat);
    bottleGroup.add(glassMesh);

    // 2. Isi Cairan Madu Keemasan di Dalam Botol
    const honeyPoints = [
      new THREE.Vector2(0.0, -1.52),
      new THREE.Vector2(0.90, -1.52),
      new THREE.Vector2(0.97, -1.38),
      new THREE.Vector2(0.97, 0.35),
      new THREE.Vector2(0.88, 0.62),
      new THREE.Vector2(0.0, 0.62)
    ];
    const honeyGeom = new THREE.LatheGeometry(honeyPoints, 48);
    const honeyMat = new THREE.MeshPhysicalMaterial({
      color: 0xd97706,
      emissive: 0x78350f,
      emissiveIntensity: 0.25,
      roughness: 0.15,
      metalness: 0.05,
      clearcoat: 0.8,
      transparent: true,
      opacity: 0.92
    });
    const honeyMesh = new THREE.Mesh(honeyGeom, honeyMat);
    bottleGroup.add(honeyMesh);

    // 3. Gelembung Udara di Dalam Madu
    const bubbles = [];
    const bubbleGeom = new THREE.SphereGeometry(0.045, 12, 12);
    const bubbleMat = new THREE.MeshPhysicalMaterial({
      color: 0xffedd5,
      transparent: true,
      opacity: 0.7,
      roughness: 0.1
    });

    for (let i = 0; i < 16; i++) {
      const b = new THREE.Mesh(bubbleGeom, bubbleMat);
      const r = Math.random() * 0.7;
      const angle = Math.random() * Math.PI * 2;
      b.position.set(Math.cos(angle) * r, -1.3 + Math.random() * 1.7, Math.sin(angle) * r);
      b.scale.setScalar(0.5 + Math.random() * 1.1);
      bottleGroup.add(b);
      bubbles.push({ mesh: b, speed: 0.002 + Math.random() * 0.003 });
    }

    // 4. Tutup Botol Kayu + Ring Emas
    const capGeom = new THREE.CylinderGeometry(0.64, 0.64, 0.38, 36);
    const capMat = new THREE.MeshStandardMaterial({
      color: 0x5c3a21,
      roughness: 0.65,
      metalness: 0.1
    });
    const capMesh = new THREE.Mesh(capGeom, capMat);
    capMesh.position.y = 1.52;
    bottleGroup.add(capMesh);

    const ringGeom = new THREE.TorusGeometry(0.58, 0.045, 16, 48);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.7, roughness: 0.2 });
    const ringMesh = new THREE.Mesh(ringGeom, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = 1.25;
    bottleGroup.add(ringMesh);

    // 5. Label Produk "MADU HUTAN"
    function createHoneyLabelTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(0, 0, 512, 256);

      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 8;
      ctx.strokeRect(12, 12, 488, 232);

      ctx.font = 'bold 42px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#451a03';
      ctx.fillText('MADU HUTAN', 256, 110);

      ctx.font = '22px sans-serif';
      ctx.fillStyle = '#92400e';
      ctx.fillText('100% RAW & NATURAL', 256, 155);

      ctx.font = 'italic 18px Georgia, serif';
      ctx.fillText('Netto 350 ml', 256, 195);

      return new THREE.CanvasTexture(canvas);
    }

    const labelGeom = new THREE.CylinderGeometry(1.06, 1.06, 1.05, 48, 1, true, -Math.PI * 0.45, Math.PI * 0.9);
    const labelMat = new THREE.MeshStandardMaterial({
      map: createHoneyLabelTexture(),
      roughness: 0.5,
      side: THREE.DoubleSide
    });
    const labelMesh = new THREE.Mesh(labelGeom, labelMat);
    labelMesh.position.y = -0.45;
    bottleGroup.add(labelMesh);

    // Pencahayaan
    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const keyLight = new THREE.DirectionalLight(0xfffbeb, 2.5);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0xfbbf24, 3.0, 10);
    rimLight.position.set(-3, 0, -3);
    scene.add(rimLight);

    const clock = new THREE.Clock();
    let animationFrameId;

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      bottleGroup.position.y = Math.sin(t * 1.6) * 0.14;
      bottleGroup.rotation.z = Math.sin(t * 0.9) * 0.06;

      bubbles.forEach((b) => {
        b.mesh.position.y += b.speed;
        if (b.mesh.position.y > 0.5) b.mesh.position.y = -1.35;
      });

      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (newWidth === 0 || newHeight === 0) return;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onInteract]);

  return (
    <div className="relative w-full h-[260px] xs:h-[300px] sm:h-[420px] lg:h-[520px] flex items-center justify-center select-none">
      <div 
        ref={containerRef} 
        id="honey-3d-container"
        className="w-full h-full cursor-grab active:cursor-grabbing relative z-10"
      />
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 max-w-[280px] h-10 bg-amber-900/15 rounded-full blur-xl pointer-events-none" />
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-desa-border/70 text-[11px] font-medium text-desa-primary shadow-xs">
          <Move3d className="w-3.5 h-3.5 text-desa-accent animate-pulse" />
          <span>{isInteracting ? 'Memutar Botol Madu' : 'Putar 3D Botol Madu'}</span>
        </div>
      </div>
    </div>
  );
}
