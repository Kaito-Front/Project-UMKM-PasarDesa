import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Move3d } from 'lucide-react';

export default function Chips3D({ onInteract }) {
  const containerRef = useRef(null);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const width = container.clientWidth || 450;
    const height = container.clientHeight || 500;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

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
    controls.autoRotateSpeed = 1.5;
    controls.enableZoom = false;
    controls.maxPolarAngle = Math.PI / 1.5;
    controls.minPolarAngle = Math.PI / 3.0;

    controls.addEventListener('start', () => {
      setIsInteracting(true);
      if (onInteract) onInteract();
    });
    controls.addEventListener('end', () => {
      setTimeout(() => setIsInteracting(false), 2000);
    });

    // Tekstur Keripik Kentang/Tempe + Bintik Bumbu Daun Jeruk
    function createChipTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');

      const grad = ctx.createRadialGradient(128, 128, 30, 128, 128, 128);
      grad.addColorStop(0, '#f7d060');
      grad.addColorStop(0.75, '#e8b438');
      grad.addColorStop(1, '#b87616');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);

      for (let i = 0; i < 350; i++) {
        const x = Math.random() * 256;
        const y = Math.random() * 256;
        const r = Math.random() * 2.2;
        ctx.fillStyle = Math.random() > 0.35 ? 'rgba(166, 86, 16, 0.45)' : 'rgba(255, 245, 200, 0.5)';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      return new THREE.CanvasTexture(canvas);
    }

    // Fungsi pembuat 1 keping keripik melengkung
    function createSingleChipGeometry(radius = 0.75, curvePower = 0.35) {
      const geom = new THREE.CircleGeometry(radius, 36, 18);
      const pos = geom.attributes.position;

      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i) * 1.25;
        pos.setY(i, y);

        const saddleZ = (x * x - y * y) * curvePower;
        const ridgesZ = Math.sin(x * 18) * 0.025;
        const organicBubble = Math.sin(x * 4) * Math.cos(y * 4) * 0.04;

        pos.setZ(i, saddleZ + ridgesZ + organicBubble);
      }
      geom.computeVertexNormals();
      return geom;
    }

    const chipMaterial = new THREE.MeshStandardMaterial({
      map: createChipTexture(),
      side: THREE.DoubleSide,
      roughness: 0.6,
      metalness: 0.05
    });

    // 18 keripik berserakan melayang 3D
    const chipsGroup = new THREE.Group();
    const chipsData = [];

    for (let i = 0; i < 18; i++) {
      const scale = 0.65 + Math.random() * 0.55;
      const curve = 0.25 + Math.random() * 0.35;
      const mesh = new THREE.Mesh(createSingleChipGeometry(0.75, curve), chipMaterial);

      const radiusDist = 0.8 + Math.random() * 2.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      mesh.position.set(
        Math.cos(theta) * Math.cos(phi) * radiusDist,
        Math.sin(phi) * radiusDist * 0.85,
        Math.sin(theta) * Math.cos(phi) * radiusDist
      );

      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      mesh.scale.setScalar(scale);

      chipsGroup.add(mesh);
      chipsData.push({
        mesh,
        baseY: mesh.position.y,
        speedRotX: (Math.random() - 0.5) * 0.8,
        speedRotY: (Math.random() - 0.5) * 0.8,
        floatOffset: Math.random() * Math.PI * 2,
        floatSpeed: 1.0 + Math.random() * 1.2
      });
    }
    scene.add(chipsGroup);

    // Pencahayaan
    scene.add(new THREE.AmbientLight(0xffffff, 1.1));
    const mainLight = new THREE.DirectionalLight(0xfff0d6, 2.0);
    mainLight.position.set(4, 6, 4);
    scene.add(mainLight);

    const backLight = new THREE.DirectionalLight(0xffb74d, 1.0);
    backLight.position.set(-4, -3, -3);
    scene.add(backLight);

    const clock = new THREE.Clock();
    let animationFrameId;

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      chipsData.forEach((item) => {
        item.mesh.position.y = item.baseY + Math.sin(t * item.floatSpeed + item.floatOffset) * 0.15;
        item.mesh.rotation.x += item.speedRotX * 0.01;
        item.mesh.rotation.y += item.speedRotY * 0.01;
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
    <div className="relative w-full h-[380px] sm:h-[480px] lg:h-[540px] flex items-center justify-center select-none">
      <div 
        ref={containerRef} 
        id="chips-3d-container"
        className="w-full h-full cursor-grab active:cursor-grabbing relative z-10"
      />
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 max-w-[320px] h-10 bg-amber-950/15 rounded-full blur-xl pointer-events-none" />
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-desa-border/70 text-[11px] font-medium text-desa-primary shadow-xs">
          <Move3d className="w-3.5 h-3.5 text-desa-accent animate-pulse" />
          <span>{isInteracting ? 'Memutar Keripik 3D' : 'Putar 3D Keripik Renyah'}</span>
        </div>
      </div>
    </div>
  );
}
