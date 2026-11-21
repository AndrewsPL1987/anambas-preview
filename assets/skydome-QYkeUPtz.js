import{Gn as e,Qn as t,St as n}from"./three.core-CiGiNCZj.js";var r={value:0},i={value:.55},a={day:{value:1},dusk:{value:0},cloud:{value:0}},o=`
  uniform float uPost, uExposure;
  vec3 s2l(vec3 c){ return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(0.04045, c)); }
  vec3 invTone(vec3 lin){                                   // inverse of three's ACESFilmicToneMapping (linear in, scene-linear out)
    vec3 y = clamp(mat3(0.643038, 0.059269, 0.005962, 0.311187, 0.931436, 0.063929, 0.045775, 0.009295, 0.930118) * min(lin, vec3(0.93)), 0.0, 0.96);
    vec3 A = 0.983729 * y - 1.0, B = 0.4329510 * y - 0.0245786, C = 0.238081 * y + 0.000090537;
    vec3 x = (-B - sqrt(max(B * B - 4.0 * A * C, 0.0))) / (2.0 * A);
    return max(mat3(1.764741, -0.147028, -0.036337, -0.675778, 1.160252, -0.162436, -0.088963, -0.013224, 1.198773) * x, 0.0) * 0.6 / uExposure;
  }`;function s(s,c=!1){let l=new e({side:1,depthWrite:!1,depthTest:!1,fog:!1,uniforms:{uSun:{value:s.clone()},uLin:{value:+!!c},uPost:r,uExposure:i,uDay:a.day,uDusk:a.dusk,uCloud:a.cloud},vertexShader:`varying vec3 vDir; void main(){ vDir = position; vec4 p = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * p; gl_Position.z = gl_Position.w; }`,fragmentShader:`
      varying vec3 vDir; uniform vec3 uSun; uniform float uLin, uDay, uDusk, uCloud;
      ${o}
      vec3 srgb2lin(vec3 c){ return pow(c, vec3(2.2)); }
      void main(){
        vec3 d = normalize(vDir); float h = d.y;
        vec3 zen = vec3(0.115, 0.330, 0.690), mid = vec3(0.300, 0.545, 0.850), hor = vec3(0.800, 0.870, 0.930); vec3 low = vec3(0.30, 0.62, 0.90);
        vec3 c = mix(hor, mid, smoothstep(0.0, 0.28, h));
        c = mix(c, zen, smoothstep(0.30, 0.95, h));
        if (uLin > 0.5) low = vec3(0.70, 0.68, 0.55);                 // lighting cube only: warm sand/jungle bounce from below
        c = mix(c, low, smoothstep(0.0, -0.25, h));
        // aerial haze: a pale, slightly warm band that thickens towards the horizon and around the sun
        float sunA = max(dot(d, normalize(uSun)), 0.0);
        float hz = exp(-max(h, 0.0) * 5.5) * 0.62 + exp(-max(h, 0.0) * 1.6) * 0.14;
        vec3 hazeC = mix(vec3(0.84, 0.89, 0.93), vec3(0.97, 0.91, 0.80), pow(sunA, 3.0));
        c = mix(c, hazeC, clamp(hz, 0.0, 0.85));
        { float hb = exp(-max(h, 0.0) * 4.0);                                      /* low sun: warm horizon, deeper zenith */
          c = mix(c, c * vec3(1.05, 0.80, 0.70) + vec3(1.0, 0.50, 0.24) * 0.42 * hb * (0.35 + 0.65 * pow(sunA, 2.0)), uDusk);
          c = mix(c, vec3(dot(c, vec3(0.30, 0.59, 0.11))) * vec3(0.90, 0.92, 0.95), uCloud * 0.88);      /* overcast: grey deck */
          c = c * mix(0.03, 1.0, uDay) + (1.0 - uDay) * vec3(0.004, 0.008, 0.020); }
        float s = sunA;
        vec3 glow = vec3(1.0, 0.86, 0.62) * (0.26 * pow(s, 4.0) + 0.50 * pow(s, 36.0));
        vec3 disc = vec3(1.0, 0.95, 0.80) * smoothstep(0.9996, 0.9999, s) * 3.0;
        { float vis = (1.0 - uCloud * 0.9) * smoothstep(-0.06, 0.02, normalize(uSun).y); glow *= vis * mix(vec3(1.0), vec3(1.25, 0.72, 0.42), uDusk); disc *= vis * smoothstep(0.0, 0.03, h + 0.02); }
        if (uLin > 0.5) { c = mix(vec3(dot(c, vec3(0.30, 0.59, 0.11))), c, 0.38); c = srgb2lin(c) * 3.2 + srgb2lin(glow) * 2.0 + disc * 12.0; }
        else { c = c + glow + disc; if (uPost > 0.5) c = invTone(s2l(clamp(c, 0.0, 1.0))); }
        gl_FragColor = vec4(c, 1.0);
      }`}),u=new n(new t(1,48,24),l);return u.scale.setScalar(2e4),u.frustumCulled=!1,u.renderOrder=-10,u}export{a,r as i,i as n,s as r,o as t};