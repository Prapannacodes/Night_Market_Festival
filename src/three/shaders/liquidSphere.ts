export const LiquidSphereVertexShader = `
  uniform float uTime;
  uniform float uScroll;
  uniform vec3 uCursor;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vDistortion;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 * vec4(1.0/sqrt(r.x), 1.0/sqrt(r.y), 1.0/sqrt(r.z), 1.0/sqrt(r.w)); }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;

    vec3 g = step(0.0, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    vec3 x1 = x0 - i1 + 1.0 * g;
    vec3 x2 = x0 - i2 + 2.0 * g;
    vec3 x3 = x0 - 1.0 + 3.0 * g;

    i = mod(i, 289.0);
    vec4 p = permute( permute( permute( 
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    float ns = 0.14285714285714285;
    vec3 f = vec3(p.xy, p.zw);

    float n = 0.14285714285714285 * dot(f, x0); 
    return n;
  }

  void main() {
    vNormal = normal;
    vPosition = position;

    float dist = distance(position, uCursor);
    float influence = smoothstep(3.0, 0.0, dist);

    // Distortion increases as we scroll
    float noiseAmplitude = 0.3 + uScroll * 0.5;
    float noise = snoise(vec3(position * (0.8 + uScroll) + uTime * 0.4));
    vDistortion = noise;

    vec3 newPosition = position + normal * noise * noiseAmplitude;
    newPosition += normal * influence * 0.8;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

export const LiquidSphereFragmentShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vDistortion;
  uniform float uTime;

  void main() {
    vec3 viewDir = normalize(vec3(0.0, 0.0, 1.0) - vPosition);
    float fresnel = pow(1.0 - max(0.0, dot(vNormal, viewDir)), 4.0);
    
    vec3 colorA = vec3(0.1, 0.8, 1.0);
    vec3 colorB = vec3(0.6, 0.2, 1.0);
    
    vec3 baseColor = mix(colorA, colorB, vDistortion * 0.5 + 0.5);
    vec3 finalColor = mix(baseColor, vec3(1.0), fresnel * 0.7);
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;
