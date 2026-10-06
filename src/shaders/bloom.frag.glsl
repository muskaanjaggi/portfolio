// Data Bloom — fragment shader: soft round points
varying vec3 vColor;
varying float vAlpha;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  if (d > 0.5) discard;
  float core = smoothstep(0.5, 0.05, d);
  gl_FragColor = vec4(vColor, core * vAlpha);
}
