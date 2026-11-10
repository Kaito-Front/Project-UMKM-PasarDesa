import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Sparkles, Move3d } from 'lucide-react';

export default function LurikCloth3D({ onInteract }) {
  const containerRef = useRef(null);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera & Renderer
    const scene = new THREE.Scene();
    
    const width = container.clientWidth || 450;
    const height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.4);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // 2. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.8;
    controls.enableZoom = false; // Prevent blocking page scroll
    controls.maxPolarAngle = Math.PI / 1.6;
    controls.minPolarAngle = Math.PI / 2.6;

    controls.addEventListener('start', () => {
      setIsInteracting(true);
      if (onInteract) onInteract();
    });
    controls.addEventListener('end', () => {
      setTimeout(() => setIsInteracting(false), 2000);
    });

    // 3. Buat Tekstur Tenun Lurik Prosedural (Sesuai Spesifikasi)
    function createLurikTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      // Pola garis klasik lurik (cokelat tua, hitam, krem, sogan)
      const stripes = [
        { color: '#1c1613', width: 24 },
        { color: '#6e472b', width: 12 },
        { color: '#d8c3a5', width: 6 },
        { color: '#1c1613', width: 8 },
        { color: '#d8c3a5', width: 6 },
        { color: '#6e472b', width: 18 },
        { color: '#2b211c', width: 32 },
        { color: '#8c5832', width: 10 },
        { color: '#e6d5b8', width: 4 },
        { color: '#1c1613', width: 6 },
        { color: '#e6d5b8', width: 4 }
      ];

      let x = 0;
      while (x < canvas.width) {
        for (const s of stripes) {
          ctx.fillStyle = s.color;
          ctx.fillRect(x, 0, s.width, canvas.height);
          x += s.width;
        }
      }

      // Efek serat benang tenun horizontal ATBM
      ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
      for (let y = 0; y < canvas.height; y += 3) {
        ctx.fillRect(0, y, canvas.width, 1);
      }

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(2, 2);
      return texture;
    }

    // 4. Mesh Kain 3D dengan Segmen Halus
    const geometry = new THREE.PlaneGeometry(2.3, 2.9, 64, 64);
    const texture = createLurikTexture();
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      side: THREE.DoubleSide,
      roughness: 0.72,
      metalness: 0.05
    });

    const cloth = new THREE.Mesh(geometry, material);
    scene.add(cloth);

    // 5. Pencahayaan Studio Bernuansa Hangat & Lembut
    scene.add(new THREE.AmbientLight(0xffffff, 0.95));
    
    const dirLight1 = new THREE.DirectionalLight(0xfff7ed, 1.9);
    dirLight1.position.set(3, 4, 3);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xd8c3a5, 0.85);
    dirLight2.position.set(-3, -2, -3);
    scene.add(dirLight2);

    // 6. Animasi Gelombang Kain + Antigravity Float
    const posAttr = geometry.attributes.position;
    const originalPositions = posAttr.array.slice();
    const clock = new THREE.Clock();
    let animationFrameId;

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      for (let i = 0; i < posAttr.count; i++) {
        const ix = i * 3;
        const x = originalPositions[ix];
        const y = originalPositions[ix + 1];

        // Simulasi lipatan dinamis kain tenun lurik & hembusan udara lembut
        const waveZ =
          Math.sin(x * 2.5 + t * 1.2) * 0.18 +
          Math.cos(y * 1.8 + t * 0.9) * 0.12 +
          Math.sin((x + y) * 3.0) * 0.06;

        posAttr.array[ix + 2] = waveZ;
      }
      posAttr.needsUpdate = true;
      geometry.computeVertexNormals();

      // Efek melayang halus (antigravity float)
      cloth.position.y = Math.sin(t * 1.5) * 0.09;

      controls.update();
      renderer.render(scene, camera);
    }

    animate();

    // 7. Responsive Resize Observer
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (newWidth === 0 || newHeight === 0) return;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);
    window.addEventListener('resize', handleResize);

    // 8. Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      controls.dispose();
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onInteract]);

  return (
    <div className="relative w-full h-[260px] xs:h-[300px] sm:h-[420px] lg:h-[520px] flex items-center justify-center select-none">
      
      {/* Three.js Canvas Container */}
      <div 
        ref={containerRef} 
        id="lurik-3d-container"
        className="w-full h-full cursor-grab active:cursor-grabbing relative z-10"
      />

      {/* Floating Spatial Shadow beneath the 3D Cloth */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 max-w-[340px] h-10 bg-black/15 rounded-full blur-xl pointer-events-none transition-all duration-700" />

      {/* Minimal Apple-Style Tactile Indicator Pill */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-desa-border/70 text-[11px] font-medium text-desa-primary shadow-xs">
          <Move3d className="w-3.5 h-3.5 text-desa-accent animate-pulse" />
          <span>{isInteracting ? 'Memutar 3D Kain Lurik' : 'Putar & Geser Kain 3D Interaktif'}</span>
        </div>
      </div>
    </div>
  );
}
