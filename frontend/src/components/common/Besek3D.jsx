import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Move3d } from 'lucide-react';

export default function Besek3D({ onInteract }) {
  const containerRef = useRef(null);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const width = container.clientWidth || 450;
    const height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(4.5, 3.2, 5.8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.6;
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

    // 1. Buat Tekstur Anyaman Bambu Natural (Warna + Bump Timbul)
    function createBambooWeaveTextures() {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      const bumpCanvas = document.createElement('canvas');
      bumpCanvas.width = 512;
      bumpCanvas.height = 512;
      const bCtx = bumpCanvas.getContext('2d');

      const step = 64; // Ukuran bilah bambu
      for (let y = 0; y < 512; y += step) {
        for (let x = 0; x < 512; x += step) {
          const isHorizontal = ((x / step) + (y / step)) % 2 === 0;

          // Warna dasar bilah bambu natural
          const baseColor = isHorizontal ? '#d6b37c' : '#c59b61';
          ctx.fillStyle = baseColor;
          ctx.fillRect(x, y, step, step);

          // Serat halus bambu
          ctx.strokeStyle = 'rgba(92, 64, 35, 0.18)';
          ctx.lineWidth = 1.5;
          for (let i = 4; i < step; i += 6) {
            ctx.beginPath();
            if (isHorizontal) {
              ctx.moveTo(x, y + i);
              ctx.lineTo(x + step, y + i);
            } else {
              ctx.moveTo(x + i, y);
              ctx.lineTo(x + i, y + step);
            }
            ctx.stroke();
          }

          // Bayangan sela-sela anyaman
          ctx.strokeStyle = '#6e4e2a';
          ctx.lineWidth = 3;
          ctx.strokeRect(x + 1, y + 1, step - 2, step - 2);

          // Bump Map untuk efek timbul 3D
          const grad = isHorizontal
            ? bCtx.createLinearGradient(x, y, x + step, y)
            : bCtx.createLinearGradient(x, y, x, y + step);
          grad.addColorStop(0, '#444444');
          grad.addColorStop(0.5, '#ffffff');
          grad.addColorStop(1, '#444444');
          bCtx.fillStyle = grad;
          bCtx.fillRect(x + 2, y + 2, step - 4, step - 4);
        }
      }

      const colorTex = new THREE.CanvasTexture(canvas);
      colorTex.wrapS = THREE.RepeatWrapping;
      colorTex.wrapT = THREE.RepeatWrapping;
      colorTex.repeat.set(2.5, 1.5);

      const bumpTex = new THREE.CanvasTexture(bumpCanvas);
      bumpTex.wrapS = THREE.RepeatWrapping;
      bumpTex.wrapT = THREE.RepeatWrapping;
      bumpTex.repeat.set(2.5, 1.5);

      return { colorTex, bumpTex };
    }

    const { colorTex, bumpTex } = createBambooWeaveTextures();

    const bambooMat = new THREE.MeshStandardMaterial({
      map: colorTex,
      bumpMap: bumpTex,
      bumpScale: 0.04,
      roughness: 0.85,
      metalness: 0.02
    });

    // 2. Fungsi Pembuat 1 Unit Besek Hampers
    function createSingleBesek(size = 1.6, height = 0.85, ribbonColor = 0x8b5a2b) {
      const besekUnit = new THREE.Group();

      // Wadah Bawah
      const bottomGeom = new THREE.BoxGeometry(size * 0.94, height * 0.75, size * 0.94);
      const bottomMesh = new THREE.Mesh(bottomGeom, bambooMat);
      bottomMesh.position.y = -height * 0.2;
      besekUnit.add(bottomMesh);

      // Tutup Atas Besek
      const lidGeom = new THREE.BoxGeometry(size, height * 0.55, size);
      const lidMesh = new THREE.Mesh(lidGeom, bambooMat);
      lidMesh.position.y = height * 0.22;
      besekUnit.add(lidMesh);

      // Pita Hampers Melintang (Silang X)
      const ribbonMat = new THREE.MeshStandardMaterial({ color: ribbonColor, roughness: 0.6 });
      const ribbon1 = new THREE.Mesh(new THREE.BoxGeometry(size * 1.02, height * 1.15, 0.14), ribbonMat);
      const ribbon2 = new THREE.Mesh(new THREE.BoxGeometry(0.14, height * 1.15, size * 1.02), ribbonMat);
      besekUnit.add(ribbon1, ribbon2);

      // Simpul Pita di Atas Tutup
      const bowLoopGeom = new THREE.TorusGeometry(0.16, 0.035, 12, 24);
      const loopLeft = new THREE.Mesh(bowLoopGeom, ribbonMat);
      loopLeft.position.set(-0.14, height * 0.55, 0);
      loopLeft.rotation.set(Math.PI / 3, 0.3, 0);

      const loopRight = new THREE.Mesh(bowLoopGeom, ribbonMat);
      loopRight.position.set(0.14, height * 0.55, 0);
      loopRight.rotation.set(Math.PI / 3, -0.3, 0);

      besekUnit.add(loopLeft, loopRight);

      return besekUnit;
    }

    // 3. Susun Set Isi 3 Besek (Ukuran L, M, S)
    const hampersSetGroup = new THREE.Group();
    scene.add(hampersSetGroup);

    const besek1 = createSingleBesek(2.0, 0.95, 0x5c3a21);
    besek1.position.set(-0.2, -1.0, 0);
    besek1.rotation.y = 0.15;

    const besek2 = createSingleBesek(1.65, 0.85, 0x3f6212);
    besek2.position.set(0.25, 0.15, 0.15);
    besek2.rotation.y = -0.35;

    const besek3 = createSingleBesek(1.35, 0.75, 0x991b1b);
    besek3.position.set(-0.1, 1.15, -0.1);
    besek3.rotation.y = 0.5;

    hampersSetGroup.add(besek1, besek2, besek3);

    // Pencahayaan
    scene.add(new THREE.AmbientLight(0xffffff, 1.15));
    const sunLight = new THREE.DirectionalLight(0xfff8eb, 2.2);
    sunLight.position.set(5, 8, 5);
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0xfde68a, 0.9);
    fillLight.position.set(-5, -3, -4);
    scene.add(fillLight);

    // Animasi Melayang Antigravity Terpisah
    const clock = new THREE.Clock();
    let animationFrameId;

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      besek1.position.y = -1.0 + Math.sin(t * 1.8) * 0.08;
      besek2.position.y = 0.15 + Math.sin(t * 1.8 + 0.8) * 0.12;
      besek3.position.y = 1.15 + Math.sin(t * 1.8 + 1.6) * 0.16;

      besek1.rotation.z = Math.sin(t * 1.1) * 0.03;
      besek2.rotation.x = Math.cos(t * 1.2) * 0.04;
      besek3.rotation.z = Math.cos(t * 1.4) * 0.05;

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
    <div className="relative w-full h-[380px] sm:h-[480px] lg:h-[540px] flex items-center justify-center select-none">
      <div 
        ref={containerRef} 
        id="besek-3d-container"
        className="w-full h-full cursor-grab active:cursor-grabbing relative z-10"
      />
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 max-w-[340px] h-10 bg-black/15 rounded-full blur-xl pointer-events-none" />
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-desa-border/70 text-[11px] font-medium text-desa-primary shadow-xs">
          <Move3d className="w-3.5 h-3.5 text-desa-accent animate-pulse" />
          <span>{isInteracting ? 'Memutar Set Besek Bambu' : 'Putar 3D Anyaman Bambu'}</span>
        </div>
      </div>
    </div>
  );
}
