// Data Bloom — vertex shader
// Each point belongs to a cluster (a petal). Noise keeps it alive,
// the cursor pushes points away, scroll makes the clusters drift apart.
uniform float uTime;
uniform float uScroll;    // 0 → 1.5 as the hero scrolls away
uniform float uVelocity;  // smoothed scroll speed
uniform float uPixelRatio;
uniform float uSize;
uniform vec2 uMouse;      // cursor on the z = 0 plane (world units)

attribute vec3 aColor;
attribute vec3 aRand;
attribute float aSize;

varying vec3 vColor;
varying float vAlpha;

#include <noise>

void main() {
  vec3 p = position;
  float t = uTime * 0.18;

  // Organic drift
  vec3 n = vec3(
    snoise(p * 0.55 + vec3(t, 0.0, 0.0)),
    snoise(p * 0.55 + vec3(0.0, t, 3.1)),
    snoise(p * 0.55 + vec3(5.2, 0.0, t))
  );
  p += n * (0.1 + min(uVelocity, 3.0) * 0.12);

  // Bloom: petals open and scatter as you scroll
  p.xy *= 1.0 + uScroll * (0.5 + aRand.x * 0.9);
  p.z += uScroll * (aRand.y - 0.5) * 4.0;

  vec4 world = modelMatrix * vec4(p, 1.0);

  // Cursor repulsion
  vec2 d = world.xy - uMouse;
  float dist = length(d);
  float force = smoothstep(1.3, 0.0, dist);
  world.xy += (d / max(dist, 0.001)) * force * 0.55;
  world.z += force * 0.5;

  vec4 mv = viewMatrix * world;
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * aSize * uPixelRatio / -mv.z;

  float twinkle = 0.65 + 0.35 * sin(uTime * 1.6 + aRand.z * 6.2831);
  vColor = mix(aColor, vec3(1.0), force * 0.6);
  vAlpha = twinkle * (1.0 - clamp(uScroll * 0.5, 0.0, 0.8));
}
