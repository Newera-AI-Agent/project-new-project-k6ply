'use client';

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';

interface ShaderPlaygroundProps {
  quality: 'low' | 'medium' | 'high';
}

const DEFAULT_VERTEX = `varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const DEFAULT_FRAGMENT = `// Shader Playground - Modify this code!
// Uniforms: uTime, uResolution, uMouse
// Built-ins: sdSphere, sdBox, noise, fbm

varying vec2 vUv;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;

// Signed Distance Functions
float sdSphere(vec3 p, float r) { return length(p) - r; }
float sdBox(vec3 p, vec3 b) {
  vec3 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

// Noise functions
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 1.0/7.0;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

float fbm(vec3 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * snoise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

// Raymarching
float map(vec3 p) {
  float d = sdSphere(p, 1.5);
  d = min(d, sdBox(p, vec3(1.0)));
  d += fbm(p * 2.0 + uTime * 0.5) * 0.3;
  return d;
}

vec3 getNormal(vec3 p) {
  vec2 e = vec2(0.001, 0.0);
  return normalize(vec3(
    map(p + e.xyy) - map(p - e.xyy),
    map(p + e.yxy) - map(p - e.yxy),
    map(p + e.yyx) - map(p - e.yyx)
  ));
}

vec3 getColor(vec3 p, vec3 n, vec3 rd) {
  vec3 color = vec3(0.0);
  vec3 lightDir = normalize(vec3(0.5, 1.0, 0.3));
  float diff = max(dot(n, lightDir), 0.0);
  color += vec3(0.2, 0.5, 0.0) * diff;
  color += vec3(0.78, 1.0, 0.0) * pow(max(dot(reflect(-rd, n), lightDir), 0.0), 32.0);
  color += vec3(0.05) * (1.0 - diff);
  return color;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);
  vec3 ro = vec3(0.0, 0.0, 5.0);
  vec3 rd = normalize(vec3(uv, -1.0));
  
  // Camera rotation
  float ca = cos(uTime * 0.2);
  float sa = sin(uTime * 0.2);
  rd.xz = mat2(ca, -sa, sa, ca) * rd.xz;
  ro.xz = mat2(ca, -sa, sa, ca) * ro.xz;
  
  float t = 0.0;
  for (int i = 0; i < 64; i++) {
    vec3 p = ro + rd * t;
    float d = map(p);
    if (d < 0.001) break;
    t += d;
    if (t > 50.0) break;
  }
  
  vec3 color = vec3(0.05);
  if (t < 50.0) {
    vec3 p = ro + rd * t;
    vec3 n = getNormal(p);
    color = getColor(p, n, rd);
    
    // Mouse influence
    vec2 mouseUv = (uMouse - 0.5 * uResolution) / min(uResolution.x, uResolution.y);
    float mouseDist = length(uv - mouseUv);
    color += vec3(0.78, 1.0, 0.0) * exp(-mouseDist * 10.0) * 0.5;
  }
  
  // Vignette
  color *= 1.0 - 0.3 * length(uv);
  
  gl_FragColor = vec4(color, 1.0);
}`;

const PRESETS = [
  { name: 'Default', fragment: DEFAULT_FRAGMENT },
  { name: 'Plasma', fragment: `varying vec2 vUv;
uniform float uTime;
uniform vec2 uResolution;
void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  float v = 0.0;
  v += sin(uv.x * 10.0 + uTime);
  v += sin(uv.y * 10.0 + uTime);
  v += sin((uv.x + uv.y) * 10.0 + uTime);
  v += sin(sqrt((uv.x - 0.5)*(uv.x - 0.5) + (uv.y - 0.5)*(uv.y - 0.5)) * 20.0 - uTime);
  v = v / 4.0;
  vec3 col = vec3(sin(v + uTime), sin(v + uTime + 2.0), sin(v + uTime + 4.0)) * 0.5 + 0.5;
  gl_FragColor = vec4(col, 1.0);
}` },
  { name: 'Tunnel', fragment: `varying vec2 vUv;
uniform float uTime;
uniform vec2 uResolution;
void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / min(uResolution.x, uResolution.y);
  float t = uTime * 0.5;
  vec2 center = vec2(sin(t * 0.7), cos(t * 0.5)) * 0.3;
  float dist = length(uv - center);
  float angle = atan(uv.y - center.y, uv.x - center.x);
  float rings = 20.0;
  float pattern = sin(rings * dist * 2.0 - t * 5.0 + angle * 3.0);
  pattern = smoothstep(-0.5, 0.5, pattern);
  vec3 col = mix(vec3(0.05), vec3(0.78, 1.0, 0.0), pattern);
  col *= 1.0 - dist * 0.5;
  gl_FragColor = vec4(col, 1.0);
}` },
];

export function ShaderPlayground({ quality }: ShaderPlaygroundProps) {
  const [vertexCode, setVertexCode] = useState(DEFAULT_VERTEX);
  const [fragmentCode, setFragmentCode] = useState(DEFAULT_FRAGMENT);
  const [error, setError] = useState<string | null>(null);
  const [errorLine, setErrorLine] = useState<number | null>(null);
  const [activePreset, setActivePreset] = useState(0);
  const [showEditor, setShowEditor] = useState(true);
  
  const materialRef = useRef<THREE.ShaderMaterial>();
  const meshRef = useRef<THREE.Mesh>();
  const compileTimeout = useRef<NodeJS.Timeout>();
  const { gl, size } = useThree();
  
  const compileShader = useCallback((fragCode: string) => {
    try {
      if (materialRef.current) {
        materialRef.current.dispose();
      }
      const material = new THREE.ShaderMaterial({
        vertexShader: vertexCode,
        fragmentShader: fragCode,
        uniforms: {
          uTime: { value: 0 },
          uResolution: { value: new THREE.Vector2(size.width, size.height) },
          uMouse: { value: new THREE.Vector2(0, 0) },
        },
      });
      materialRef.current = material;
      if (meshRef.current) {
        meshRef.current.material = material;
      }
      setError(null);
      setErrorLine(null);
    } catch (e) {
      const err = e as Error;
      setError(err.message);
      // Try to extract line number
      const match = err.message.match(/line (\d+)/i);
      if (match) setErrorLine(parseInt(match[1]));
    }
  }, [vertexCode, size]);
  
  const handleFragmentChange = (code: string) => {
    setFragmentCode(code);
    if (compileTimeout.current) clearTimeout(compileTimeout.current);
    compileTimeout.current = setTimeout(() => compileShader(code), 300);
  };
  
  useEffect(() => {
    compileShader(fragmentCode);
    return () => {
      if (compileTimeout.current) clearTimeout(compileTimeout.current);
      if (materialRef.current) materialRef.current.dispose();
    };
  }, []);
  
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
      materialRef.current.uniforms.uResolution.value.set(size.width, size.height);
    }
  });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
      if (materialRef.current) {
        materialRef.current.uniforms.uMouse.value.set(
          e.clientX - rect.left,
          rect.height - (e.clientY - rect.top)
        );
      }
    };
    const canvas = document.querySelector('canvas');
    canvas?.addEventListener('mousemove', handleMouseMove);
    return () => canvas?.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        compileShader(fragmentCode);
      } else if (e.key === 'Escape') {
        setShowEditor(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fragmentCode]);
  
  const lines = fragmentCode.split('\n');
  
  return (
    <>
      <mesh ref={meshRef} geometry={new THREE.PlaneGeometry(2, 2)} material={materialRef.current || new THREE.MeshBasicMaterial()} />
      
      {showEditor && (
        <div className="absolute inset-0 flex" style={{ zIndex: 10, pointerEvents: 'none' }}>{
          <div className="w-1/2 h-full bg-surface/95 backdrop-blur-sm border-r border-surface-border flex flex-col" style={{ pointerEvents: 'auto' }}>
            <div className="flex items-center justify-between p-3 border-b border-surface-border">
              <span className="caption text-primary-accent font-mono">vertex.glsl</span>
              <span className="body-xs text-text-muted">{vertexCode.split('\n').length} lines</span>
            </div>
            <pre className="flex-1 overflow-auto p-3 font-mono text-xs text-text bg-surface-overlay" style={{ lineHeight: 1.6 }}>
              {vertexCode.split('\n').map((line, i) => (
                <div key={i} className="flex">
                  <span className="w-8 text-right pr-2 text-text-muted select-none">{i + 1}</span>
                  <span className="flex-1">{line || '\u00A0'}</span>
                </div>
              ))}
            </pre>
          </div>
          <div className="w-1/2 h-full bg-surface/95 backdrop-blur-sm flex flex-col" style={{ pointerEvents: 'auto' }}>
            <div className="flex items-center justify-between p-3 border-b border-surface-border">
              <span className="caption text-primary-accent font-mono">fragment.glsl</span>
              <div className="flex items-center gap-2">
                <select
                  value={activePreset}
                  onChange={(e) => {
                    setActivePreset(parseInt(e.target.value));
                    handleFragmentChange(PRESETS[parseInt(e.target.value)].fragment);
                  }}
                  className="px-2 py-1 text-xs bg-surface border border-surface-border rounded text-text font-mono"
                >
                  {PRESETS.map((p, i) => <option key={i} value={i}>{p.name}</option>)}
                </select>
                {error && <span className="caption text-destructive">Error: {error}</span>}
              </div>
            </div>
            <textarea
              value={fragmentCode}
              onChange={(e) => handleFragmentChange(e.target.value)}
              className="flex-1 overflow-auto p-3 font-mono text-xs text-text bg-surface-overlay border-none outline-none resize-none"
              style={{ lineHeight: 1.6, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}
              spellCheck={false}
            />
            {errorLine && (
              <div className="absolute left-1/2 -translate-x-1/2 bottom-20 px-3 py-1 bg-destructive/90 text-surface text-xs rounded font-mono animate-pulse">
                Error near line {errorLine}
              </div>
            )}
          </div>
        </div>
      )}
      
      {!showEditor && (
        <button
          onClick={() => setShowEditor(true)}
          className="absolute bottom-4 right-4 btn btn-primary z-10"
        >
          Show Editor
        </button>
      )}
    </>
  );
}
