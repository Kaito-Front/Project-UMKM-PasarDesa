import React, { useRef, useEffect, useState } from 'react';

/**
 * LiquidGlassContainer
 * React wrapper implementing Apple-inspired visionOS Liquid Glass WebGL shader
 * Based on https://github.com/dashersw/liquid-glass-js
 */
export function LiquidGlassContainer({
  children,
  type = 'rounded', // 'rounded' | 'circle' | 'pill'
  borderRadius = 32,
  tintOpacity = 0.2,
  tintColor = [0.03, 0.14, 0.10], // Deep Emerald default: #07241A
  edgeIntensity = 0.45,
  rimIntensity = 0.25,
  warp = 0.0,
  className = '',
  style = {},
  onClick,
  ...props
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const gl = canvas.getContext('webgl', { 
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: false 
    });

    if (!gl) {
      setWebglSupported(false);
      return;
    }

    // Vertex Shader
    const vsSource = `
      attribute vec2 a_position;
      attribute vec2 a_texcoord;
      varying vec2 v_texcoord;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texcoord = a_texcoord;
      }
    `;

    // Fragment Shader (SDF based Liquid Glass Refraction & Rim Specular)
    const fsSource = `
      precision mediump float;
      uniform vec2 u_resolution;
      uniform float u_borderRadius;
      uniform float u_edgeIntensity;
      uniform float u_rimIntensity;
      uniform float u_warp;
      uniform float u_tintOpacity;
      uniform vec3 u_tintColor;
      uniform int u_shapeType; // 0: rounded, 1: circle, 2: pill
      varying vec2 v_texcoord;

      float roundedRectDist(vec2 p, vec2 b, float r) {
        vec2 q = abs(p) - b + r;
        return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
      }

      float circleDist(vec2 p, float r) {
        return length(p) - r;
      }

      float capsuleDist(vec2 p, vec2 a, vec2 b, float r) {
        vec2 pa = p - a, ba = b - a;
        float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
        return length(pa - ba * h) - r;
      }

      void main() {
        vec2 size = u_resolution;
        vec2 pixelCoord = v_texcoord * size;
        vec2 center = size * 0.5;
        vec2 p = pixelCoord - center;

        float dist = 0.0;
        float radius = u_borderRadius;

        if (u_shapeType == 1) {
          // Circle
          dist = circleDist(p, min(size.x, size.y) * 0.5);
        } else if (u_shapeType == 2) {
          // Pill (Capsule)
          float capRadius = size.y * 0.5;
          vec2 pA = vec2(-center.x + capRadius, 0.0);
          vec2 pB = vec2(center.x - capRadius, 0.0);
          dist = capsuleDist(p, pA, pB, capRadius);
        } else {
          // Rounded rect
          dist = roundedRectDist(p, center, radius);
        }

        // Alpha mask based on distance
        float alpha = 1.0 - smoothstep(-1.0, 1.0, dist);
        if (alpha <= 0.01) {
          discard;
        }

        // Calculate surface normal gradient
        vec2 norm = normalize(p + vec2(0.0001));
        float edgeFactor = clamp(-dist / (radius + 1.0), 0.0, 1.0);
        float rim = pow(1.0 - edgeFactor, 2.5) * u_rimIntensity;
        float edgeRefract = (1.0 - edgeFactor) * u_edgeIntensity;

        // Specular highlight light vector (top-left light source)
        vec2 lightDir = normalize(vec2(-0.6, 0.8));
        float specular = pow(max(dot(norm, lightDir), 0.0), 4.0) * rim * 1.8;

        // Base tint with refraction glow
        vec3 col = u_tintColor;
        col += vec3(edgeRefract * 0.25);
        col += vec3(rim * 0.8) + vec3(specular);

        // Subtle chromatic dispersion along edges
        col.r += edgeRefract * 0.08;
        col.b += edgeRefract * 0.12;

        float finalAlpha = clamp(u_tintOpacity + rim + edgeRefract * 0.5, 0.0, 0.95) * alpha;

        gl_FragColor = vec4(col, finalAlpha);
      }
    `;

    function createShader(glCtx, type, source) {
      const shader = glCtx.createShader(type);
      glCtx.shaderSource(shader, source);
      glCtx.compileShader(shader);
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        console.error(glCtx.getShaderInfoLog(shader));
        glCtx.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Quad geometry
    const positionLoc = gl.getAttribLocation(program, 'a_position');
    const texcoordLoc = gl.getAttribLocation(program, 'a_texcoord');

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
        -1,  1,
         1, -1,
         1,  1
      ]),
      gl.STATIC_DRAW
    );

    const texBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        0, 1,
        1, 1,
        0, 0,
        0, 0,
        1, 1,
        1, 0
      ]),
      gl.STATIC_DRAW
    );

    // Uniform locations
    const resLoc = gl.getUniformLocation(program, 'u_resolution');
    const radiusLoc = gl.getUniformLocation(program, 'u_borderRadius');
    const edgeLoc = gl.getUniformLocation(program, 'u_edgeIntensity');
    const rimLoc = gl.getUniformLocation(program, 'u_rimIntensity');
    const warpLoc = gl.getUniformLocation(program, 'u_warp');
    const tintOpacityLoc = gl.getUniformLocation(program, 'u_tintOpacity');
    const tintColorLoc = gl.getUniformLocation(program, 'u_tintColor');
    const shapeTypeLoc = gl.getUniformLocation(program, 'u_shapeType');

    const updateRender = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.max(1, Math.ceil(rect.width));
      const h = Math.max(1, Math.ceil(rect.height));

      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);

      gl.useProgram(program);

      gl.enableVertexAttribArray(positionLoc);
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
      gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

      gl.enableVertexAttribArray(texcoordLoc);
      gl.bindBuffer(gl.ARRAY_BUFFER, texBuffer);
      gl.vertexAttribPointer(texcoordLoc, 2, gl.FLOAT, false, 0, 0);

      const shapeCode = type === 'circle' ? 1 : type === 'pill' ? 2 : 0;
      const effectiveRadius = type === 'pill' ? h / 2 : type === 'circle' ? Math.min(w, h) / 2 : borderRadius;

      gl.uniform2f(resLoc, w, h);
      gl.uniform1f(radiusLoc, effectiveRadius);
      gl.uniform1f(edgeLoc, edgeIntensity);
      gl.uniform1f(rimLoc, rimIntensity);
      gl.uniform1f(warpLoc, warp);
      gl.uniform1f(tintOpacityLoc, tintOpacity);
      gl.uniform3fv(tintColorLoc, new Float32Array(tintColor));
      gl.uniform1i(shapeTypeLoc, shapeCode);

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    updateRender();

    const ro = new ResizeObserver(() => {
      requestAnimationFrame(updateRender);
    });
    ro.observe(container);

    return () => {
      ro.disconnect();
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(posBuffer);
      gl.deleteBuffer(texBuffer);
    };
  }, [type, borderRadius, tintOpacity, tintColor, edgeIntensity, rimIntensity, warp]);

  const radiusStyle = type === 'pill' ? '9999px' : type === 'circle' ? '50%' : `${borderRadius}px`;

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      className={`relative overflow-hidden backdrop-blur-xl border border-white/15 dark:border-white/10 shadow-lg ${className}`}
      style={{
        borderRadius: radiusStyle,
        ...style
      }}
      {...props}
    >
      {webglSupported ? (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full pointer-events-none -z-10"
          style={{ borderRadius: radiusStyle }}
        />
      ) : (
        <div 
          className="absolute inset-0 bg-white/10 dark:bg-[#07241A]/70 pointer-events-none -z-10" 
          style={{ borderRadius: radiusStyle }} 
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/**
 * LiquidGlassButton
 * Interactive pill/rounded/circle action button with Apple Liquid Glass refraction
 */
export function LiquidGlassButton({
  children,
  text,
  icon: Icon,
  type = 'pill',
  size = 'md',
  onClick,
  className = '',
  disabled = false,
  ...props
}) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5'
  }[size] || 'px-5 py-2.5 text-sm gap-2';

  return (
    <LiquidGlassContainer
      type={type}
      tintOpacity={0.25}
      edgeIntensity={0.5}
      rimIntensity={0.35}
      className={`inline-flex items-center justify-center font-semibold cursor-pointer select-none transition-all active:scale-95 hover:shadow-xl ${
        disabled ? 'opacity-50 pointer-events-none' : ''
      } ${sizeClasses} ${className}`}
      onClick={disabled ? undefined : onClick}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      {text && <span>{text}</span>}
      {children}
    </LiquidGlassContainer>
  );
}

export default LiquidGlassContainer;
