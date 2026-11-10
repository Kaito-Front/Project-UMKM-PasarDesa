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
    controls.autoRotateSpeed = 1.4;
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

    // 1. Buat Tekstur Keripik Tempe + Kedelai + Irisan Daun Jeruk (Color + Bump)
    function createTempeTextures() {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      const bumpCanvas = document.createElement('canvas');
      bumpCanvas.width = 512;
      bumpCanvas.height = 512;
      const bCtx = bumpCanvas.getContext('2d');

      // Dasar warna tepung beras goreng & miselium tempe (krem kekuningan renyah)
      const grad = ctx.createRadialGradient(256, 256, 50, 256, 256, 256);
      grad.addColorStop(0, '#f3dfa2');
      grad.addColorStop(0.75, '#e2c16b');
      grad.addColorStop(1, '#c59337');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);

      bCtx.fillStyle = '#666666';
      bCtx.fillRect(0, 0, 512, 512);

      // Serat putih miselium jamur tempe di bagian tengah
      for (let i = 0; i < 180; i++) {
        ctx.strokeStyle = 'rgba(255, 250, 230, 0.35)';
        ctx.lineWidth = 1 + Math.random() * 2;
        ctx.beginPath();
        const sx = 90 + Math.random() * 332;
        const sy = 90 + Math.random() * 332;
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + (Math.random() - 0.5) * 35, sy + (Math.random() - 0.5) * 35);
        ctx.stroke();
      }

      // Butiran Kacang Kedelai Potong (Ciri Khas Keripik Tempe)
      for (let i = 0; i < 130; i++) {
        const dist = Math.random() * 185;
        const angle = Math.random() * Math.PI * 2;
        const x = 256 + Math.cos(angle) * dist;
        const y = 256 + Math.sin(angle) * dist;
        const rx = 7 + Math.random() * 9;
        const ry = 4 + Math.random() * 6;
        const rot = Math.random() * Math.PI;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rot);
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.fillStyle = Math.random() > 0.3 ? '#d49a35' : '#b87b1e';
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#8f580d';
        ctx.stroke();
        ctx.restore();

        bCtx.save();
        bCtx.translate(x, y);
        bCtx.rotate(rot);
        bCtx.beginPath();
        bCtx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        bCtx.fillStyle = '#ffffff';
        bCtx.fill();
        bCtx.restore();
      }

      // Irisan & Cacahan Daun Jeruk di dalam Adonan Tepung
      for (let i = 0; i < 65; i++) {
        const x = 40 + Math.random() * 432;
        const y = 40 + Math.random() * 432;
        const len = 10 + Math.random() * 20;
        const wid = 2.5 + Math.random() * 4.5;
        const rot = Math.random() * Math.PI;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rot);
        ctx.beginPath();
        ctx.ellipse(0, 0, len, wid, 0, 0, Math.PI * 2);
        ctx.fillStyle = Math.random() > 0.4 ? '#234d20' : '#32662d';
        ctx.fill();
        ctx.restore();

        bCtx.save();
        bCtx.translate(x, y);
        bCtx.rotate(rot);
        bCtx.beginPath();
        bCtx.ellipse(0, 0, len, wid, 0, 0, Math.PI * 2);
        bCtx.fillStyle = '#dddddd';
        bCtx.fill();
        bCtx.restore();
      }

      // Rempah ketumbar & gelembung tepung renyah
      for (let i = 0; i < 300; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const r = 1 + Math.random() * 2.5;
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(120, 70, 15, 0.4)' : 'rgba(255, 248, 220, 0.55)';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      return {
        colorMap: new THREE.CanvasTexture(canvas),
        bumpMap: new THREE.CanvasTexture(bumpCanvas)
      };
    }

    // 2. Geometri Keripik Tempe
    function createTempeChipGeometry(radius = 0.85) {
      const geom = new THREE.CircleGeometry(radius, 40, 20);
      const pos = geom.attributes.position;
      const isRoundShape = Math.random() > 0.35;

      for (let i = 0; i < pos.count; i++) {
        let x = pos.getX(i);
        let y = pos.getY(i);

        if (!isRoundShape) {
          x *= 1.15;
          y *= 0.88;
        }

        const distFromCenter = Math.sqrt(x * x + y * y);
        const angle = Math.atan2(y, x);
        const crispyEdge = 1 + Math.sin(angle * 7) * 0.05 + Math.cos(angle * 13) * 0.03;

        x *= crispyEdge;
        y *= crispyEdge;
        pos.setX(i, x);
        pos.setY(i, y);

        const waveZ =
          Math.sin(x * 2.8) * 0.06 +
          Math.cos(y * 2.5) * 0.06 +
          (distFromCenter * distFromCenter) * 0.08 * (Math.random() > 0.5 ? 1 : -1);

        pos.setZ(i, waveZ);
      }
      geom.computeVertexNormals();
      return geom;
    }

    // 3. Geometri Helai Daun Jeruk Goreng
    function createKaffirLimeLeafGeometry() {
      const geom = new THREE.PlaneGeometry(0.45, 0.22, 16, 8);
      const pos = geom.attributes.position;

      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        let y = pos.getY(i);

        const pinch = Math.abs(Math.sin(x * Math.PI * 2.2)) * 0.7 + 0.3;
        const taper = 1 - Math.pow(x / 0.25, 2) * 0.6;
        y *= pinch * Math.max(0.1, taper);
        pos.setY(i, y);

        const curlZ = Math.sin(x * 9) * 0.04 + (y * y) * 1.2;
        pos.setZ(i, curlZ);
      }
      geom.computeVertexNormals();
      return geom;
    }

    const { colorMap, bumpMap } = createTempeTextures();

    const tempeMaterial = new THREE.MeshStandardMaterial({
      map: colorMap,
      bumpMap: bumpMap,
      bumpScale: 0.035,
      side: THREE.DoubleSide,
      roughness: 0.75,
      metalness: 0.02
    });

    const leafMaterial = new THREE.MeshStandardMaterial({
      color: 0x264e22,
      side: THREE.DoubleSide,
      roughness: 0.65,
      metalness: 0.05
    });

    const floatingItems = [];
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Generate 16 Keping Keripik Tempe
    for (let i = 0; i < 16; i++) {
      const scale = 0.7 + Math.random() * 0.45;
      const mesh = new THREE.Mesh(createTempeChipGeometry(0.85), tempeMaterial);

      const radiusDist = 0.8 + Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      mesh.position.set(
        Math.cos(theta) * Math.cos(phi) * radiusDist,
        Math.sin(phi) * radiusDist * 0.85,
        Math.sin(theta) * Math.cos(phi) * radiusDist
      );

      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      mesh.scale.setScalar(scale);

      mainGroup.add(mesh);
      floatingItems.push({
        mesh,
        baseY: mesh.position.y,
        speedRotX: (Math.random() - 0.5) * 0.7,
        speedRotY: (Math.random() - 0.5) * 0.7,
        floatOffset: Math.random() * Math.PI * 2,
        floatSpeed: 1.0 + Math.random() * 1.2
      });
    }

    // Generate 22 Helai Daun Jeruk Goreng Melayang
    for (let i = 0; i < 22; i++) {
      const leafMesh = new THREE.Mesh(createKaffirLimeLeafGeometry(), leafMaterial);
      const radiusDist = 0.6 + Math.random() * 2.7;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      leafMesh.position.set(
        Math.cos(theta) * Math.cos(phi) * radiusDist,
        Math.sin(phi) * radiusDist * 0.9,
        Math.sin(theta) * Math.cos(phi) * radiusDist
      );

      leafMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      leafMesh.scale.setScalar(0.6 + Math.random() * 0.7);

      mainGroup.add(leafMesh);
      floatingItems.push({
        mesh: leafMesh,
        baseY: leafMesh.position.y,
        speedRotX: (Math.random() - 0.5) * 1.4,
        speedRotY: (Math.random() - 0.5) * 1.4,
        floatOffset: Math.random() * Math.PI * 2,
        floatSpeed: 1.4 + Math.random() * 1.5
      });
    }

    // Pencahayaan
    scene.add(new THREE.AmbientLight(0xffffff, 1.15));
    const mainLight = new THREE.DirectionalLight(0xfff4d9, 2.1);
    mainLight.position.set(4, 6, 4);
    scene.add(mainLight);

    const backLight = new THREE.DirectionalLight(0xfbbf24, 0.9);
    backLight.position.set(-4, -3, -3);
    scene.add(backLight);

    const clock = new THREE.Clock();
    let animationFrameId;

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      floatingItems.forEach((item) => {
        item.mesh.position.y = item.baseY + Math.sin(t * item.floatSpeed + item.floatOffset) * 0.16;
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
    <div className="relative w-full h-[260px] xs:h-[300px] sm:h-[420px] lg:h-[520px] flex items-center justify-center select-none">
      <div 
        ref={containerRef} 
        id="tempe-3d-container"
        className="w-full h-full cursor-grab active:cursor-grabbing relative z-10"
      />
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 max-w-[320px] h-10 bg-amber-950/15 rounded-full blur-xl pointer-events-none" />
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-desa-border/70 text-[11px] font-medium text-desa-primary shadow-xs">
          <Move3d className="w-3.5 h-3.5 text-desa-accent animate-pulse" />
          <span>{isInteracting ? 'Memutar Keripik Tempe' : 'Putar 3D Keripik Tempe & Daun Jeruk'}</span>
        </div>
      </div>
    </div>
  );
}
