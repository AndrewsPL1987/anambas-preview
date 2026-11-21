import{Ct as e,D as t,E as n,Fn as r,G as i,Hn as a,J as o,Nn as s,O as c,Qt as l,St as u,T as d,W as f,_ as p,br as m,c as h,cr as g,dt as _,ft as v,h as y,kt as b,l as x,rr as S,sr as C,ur as w}from"./three.core-CiGiNCZj.js";var T=new URLSearchParams(location.search),E=!!document.getElementById(`arc`),D=matchMedia(`(pointer: coarse)`).matches,O=Math.min(screen.width,screen.height)<600,k=T.has(`phone`)?T.get(`phone`)!==`0`:D&&O,A=!k&&D,j=+(T.get(`maxtex`)??(k||A?2048:0)),M=/(^|\/)(tex\/.+|(tenggeran|tenak)\/(splat0|splat1|paths|shore))\.(webp|jpe?g|png)$/,N=e=>k&&M.test(e)?e.replace(/\.(webp|jpe?g|png)$/,`_m.$1`):e;k&&c.setURLModifier(N);var P=[1500,4e3],F=e=>new Promise(t=>setTimeout(t,e));{let e=window.fetch.bind(window);window.fetch=async(t,n)=>{let r=typeof t==`string`?t:t?.url??String(t),i=(n?.method??t?.method??`GET`).toUpperCase(),a=!1;try{a=new URL(r,location.href).origin===location.origin}catch{}if(!a||i!==`GET`)return e(t,n);for(let r=0;;r++)try{let i=await e(t,n);if(i.status>=500&&r<P.length){await F(P[r]);continue}if(!i.ok)return i;let a=await i.blob();return new Response(a,{status:i.status,statusText:i.statusText,headers:i.headers})}catch(e){if(e?.name===`AbortError`||r>=P.length)throw e;await F(P[r])}};let t=o.prototype.load;o.prototype.load=function(e,n,r,i){let a=0,o=this,s=()=>t.call(o,e,n,r,e=>{a<P.length?setTimeout(s,P[a++]):i?.(e)});return s()}}var I=-40*Math.PI/180,L=55*Math.PI/180;function R(e=I,t=L){let n=[Math.cos(e),0,Math.sin(e)],r=[-Math.sin(e),0,Math.cos(e)];return{s:n,n:[Math.sin(t)*r[0],Math.cos(t),Math.sin(t)*r[2]],t:[Math.cos(t)*r[0],-Math.sin(t),Math.cos(t)*r[2]]}}var z=R(),B=e=>e.toFixed(4),V=`
  const vec3 BR_N = vec3(${B(z.n[0])}, ${B(z.n[1])}, ${B(z.n[2])});
  float brH(float n) { return fract(sin(n * 12.9898) * 43758.5453); }
  float brH3(vec3 p) { p = fract(p * 0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }
  float brN(vec3 x) { vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(brH3(i), brH3(i + vec3(1, 0, 0)), f.x), mix(brH3(i + vec3(0, 1, 0)), brH3(i + vec3(1, 1, 0)), f.x), f.y),
               mix(mix(brH3(i + vec3(0, 0, 1)), brH3(i + vec3(1, 0, 1)), f.x), mix(brH3(i + vec3(0, 1, 1)), brH3(i + vec3(1, 1, 1)), f.x), f.y), f.z); }
  vec4 bedrock(vec3 P, vec3 Nw, float pix) {
    float face = smoothstep(0.74, 0.93, abs(dot(normalize(Nw), BR_N)));                             /* 1 on a bedding plane: one bed's face, no lines (they drew rings there) */
    float warp = (brN(P * 0.11) - 0.5) * 0.9 + (brN(P * 0.83 + 7.0) - 0.5) * 0.10;                 /* the beds are only gently folded: the partings run as near-straight, parallel lines (strong warping drew rings like a contour map) */
    float u = dot(P, BR_N) + warp;
    /* Owner, 2026-11-18: the rock looked striped and artificial. The beds were evenly spaced, and from a distance their fine lines aliased into
       regular bands. Now: bed thickness varies (the boundaries are shifted by a slow noise along the dip), contrast is lower, and every set of
       lines fades out once it is too fine for the screen (aaC, aaF from the pixel size) instead of turning into stripes. */
    float uv_ = u + 0.34 * (brN(vec3(u * 0.85, 13.0, 5.0)) - 0.5) + 0.12 * (brN(P * 0.06 + 40.0) - 0.5);
    float uc = uv_ / 0.46, fc = fract(uc), uf = u / 0.09, ff = fract(uf);                              /* thick beds, and the thin layers inside them */
    float aaC = 1.0 - smoothstep(0.46 * 0.12, 0.46 * 0.40, pix), aaF = 1.0 - smoothstep(0.09 * 0.12, 0.09 * 0.40, pix);
    float toneC = mix(0.99, 0.85 + 0.28 * brH(floor(uc)), aaC), toneF = mix(1.0, 0.95 + 0.10 * brH(floor(uf) + 3.7), aaF), open = (0.15 + 0.6 * brH(floor(uc) * 1.7 + 0.3) * smoothstep(0.3, 0.65, brN(P * 0.9 + 11.0))) * (1.0 - face) * aaC;      /* some partings gape, most are tight, and none runs unbroken */
    float partC = smoothstep(0.0, 0.09, fc) * (1.0 - smoothstep(0.91, 1.0, fc)), partF = smoothstep(0.0, 0.3, ff) * (1.0 - smoothstep(0.7, 1.0, ff));
    float blot = brN(P * 0.5 + 3.0) * 0.6 + brN(P * 1.7) * 0.4;                                     /* weathering: pale crusts, darker stains */
    vec3 c = mix(vec3(0.135, 0.134, 0.132), vec3(0.345, 0.335, 0.31), 0.10 + 0.90 * smoothstep(0.30, 0.74, blot)) * toneC * toneF;      /* light grey in full sun (survey photo: about sRGB 174, 168, 156), dark grey where stained */
    partF = mix(mix(partF, 1.0, face), 0.8, 1.0 - aaF); c *= mix(1.0, 0.55 + 0.45 * partC, open) * (0.91 + 0.09 * partF);
    return vec4(c, mix(1.0, partC, open) * 0.72 + partF * 0.18 + 0.10 * toneC);
  }`,H={value:0},U={value:0},W={value:0},G={value:1},K={value:1},q=9,J=k?512:1024,ee=[2.3,3,1.9,1.7,2.8,2.8,2.8,1.9,2.4],Y=null;async function te(e){let t=await createImageBitmap(await(await fetch(N(e))).blob()),n=document.createElement(`canvas`);n.width=n.height=J;let r=n.getContext(`2d`,{willReadFrequently:!0});return r.drawImage(t,0,0,J,J),r.getImageData(0,0,J,J).data}function ne(){return Y||(Y=(async()=>{let e=[[`dif`,!0],[`nr`,!1],[`ha`,!1]],t={};for(let[n,i]of e){let e=new Uint8Array(J*J*4*q);(await Promise.all(Array.from({length:q},(e,t)=>te(`tex/terrain/L${t}_${n}.${i?`webp`:`jpg`}`)))).forEach((t,n)=>e.set(t,n*J*J*4));let o=new d(e,J,J,q);o.format=l,o.type=w,o.wrapS=o.wrapT=r,o.minFilter=v,o.magFilter=_,o.generateMipmaps=!0,o.anisotropy=8,o.colorSpace=i?a:``,o.needsUpdate=!0,t[n]=o}return t})(),Y)}function re(e,t,n,r,i,a){let o=new b({roughness:1,metalness:0});return o.onBeforeCompile=o=>{Object.assign(o.uniforms,{uDif:{value:e.dif},uNR:{value:e.nr},uHA:{value:e.ha},uSplat0:{value:t},uSplat1:{value:n},uPaths:{value:i},uShore:{value:a},uRect:{value:new m(...r)},uTime:H,uDbg:W,uSurf:G,uSunK:K,uWater:{value:Q},uUwUnder:U}),o.vertexShader=o.vertexShader.replace(`#include <common>`,`#include <common>
varying vec3 vWPos; varying vec3 vNrm; varying float vCamDist;`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
vWPos = position; vNrm = normalize(normal); vCamDist = length((modelViewMatrix * vec4(position, 1.0)).xyz);`),o.fragmentShader=o.fragmentShader.replace(`#include <common>`,`#include <common>
        precision highp sampler2DArray;
        varying vec3 vWPos; varying vec3 vNrm; varying float vCamDist;
        uniform sampler2DArray uDif, uNR, uHA; uniform sampler2D uSplat0, uSplat1, uPaths, uShore; uniform vec4 uRect; uniform float uTime, uWater, uDbg, uSurf, uSunK, uUwUnder;
        const float TILE[9] = float[9](${ee.map(e=>e.toFixed(2)).join(`,`)});
        float h31(vec3 p){ p = fract(p * 0.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y) * p.z); }   // Hoskins hash13: no lattice correlation
        float vn3(vec3 x){ vec3 i=floor(x), f=fract(x); f=f*f*(3.0-2.0*f);
          return mix(mix(mix(h31(i),h31(i+vec3(1,0,0)),f.x),mix(h31(i+vec3(0,1,0)),h31(i+vec3(1,1,0)),f.x),f.y),
                     mix(mix(h31(i+vec3(0,0,1)),h31(i+vec3(1,0,1)),f.x),mix(h31(i+vec3(0,1,1)),h31(i+vec3(1,1,1)),f.x),f.y),f.z); }
        float caustic(vec2 p, float t){
          float c = 0.0; vec2 q = p;
          for (int i = 0; i < 3; i++) { q = vec2(q.x*0.8 - q.y*0.6, q.x*0.6 + q.y*0.8) * 1.45 + t*0.11;
            c += abs(sin(q.x + sin(q.y*1.3 + t*0.7))) * abs(sin(q.y + sin(q.x*1.1 - t*0.5))); }
          return pow(c / 3.0, 4.0) * 2.2;
        }
        // anti-tiling: each tile cell gets a random offset + rotation; the 4 nearest cells are blended with a smooth falloff
        vec2 hash22(vec2 p){ p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3))); return fract(sin(p) * 43758.5453); }
        vec4 texCell(sampler2DArray T, vec2 x, float layer, float blur) {
          vec2 p = floor(x), f = fract(x); vec2 dx = dFdx(x) * blur, dy = dFdy(x) * blur;
          vec4 acc = vec4(0.0); float wt = 0.0;
          for (int j = 0; j < 2; j++) for (int i = 0; i < 2; i++) {
            vec2 g = vec2(float(i), float(j)); vec2 h = hash22(p + g + layer * 7.0);
            vec2 r = g - f + (h - 0.5) * 0.35; float w = exp(-9.0 * dot(r, r));
            float ang = h.x * 6.2831853; mat2 R = mat2(cos(ang), -sin(ang), sin(ang), cos(ang));
            vec2 uv = R * (x + h * 11.7);
            acc += w * textureGrad(T, vec3(uv, layer), R * dx, R * dy); wt += w;
          }
          return acc / wt;
        }
        // cheaper two-sample variant for the non-colour maps
        vec4 texNT(sampler2DArray T, vec2 x, float layer) {
          vec2 p = floor(x); vec2 f = fract(x); vec2 dx = dFdx(x), dy = dFdy(x);
          vec2 h = hash22(p + layer * 7.0); vec2 h2 = hash22(p + vec2(1.0, 1.0) + layer * 7.0);
          vec4 a = textureGrad(T, vec3(x + h * 11.7, layer), dx, dy); vec4 b = textureGrad(T, vec3(x + h2 * 11.7 + 0.5, layer), dx, dy);
          return mix(a, b, smoothstep(0.0, 1.0, 0.5 + 0.5 * sin(x.x * 1.7 + x.y * 2.3)));
        }
        /* coral sand: near-white cream, not golden (survey photo: dry sand about sRGB 230, 224, 208). The texture keeps its grain; its colour is pulled towards its own grey and lifted. */
        vec3 sandTone(vec3 a, int i) { float l = dot(a, vec3(0.30, 0.59, 0.11)); return (i == 0) ? mix(a, vec3(l), 0.56) * vec3(1.47, 1.48, 1.50) : mix(a, vec3(l), 0.55) * vec3(1.22, 1.27, 1.36); }
        ${V}
        // globals written in map_fragment, consumed by later chunks
        vec3 gN; float gRough; float gAO; vec3 gCaustic; float gDepth; float gWet; float gBedH = 0.0, gBedW = 0.0;`).replace(`#include <map_fragment>`,`
        {
          vec3 P = vWPos;
          vec2 suv = vec2((P.x - uRect.x) / uRect.z, 1.0 - (P.z - uRect.y) / uRect.w);
          bool inside = suv.x > 0.0 && suv.x < 1.0 && suv.y > 0.0 && suv.y < 1.0;
          vec3 s0 = texture2D(uSplat0, suv).rgb, s1 = texture2D(uSplat1, suv).rgb;
          float seaSum = s1.r + s1.g + s1.b; float landM = 1.0 - smoothstep(0.25, 0.75, seaSum);
          float w[9];
          w[0] = s0.r; w[1] = s0.g; w[2] = s0.b; w[3] = max(0.0, 1.0 - s0.r - s0.g - s0.b) * landM; w[4] = s1.r; w[5] = s1.g; w[6] = s1.b; w[7] = 0.0; w[8] = 0.0;
          if (!inside) { for (int i = 0; i < 9; i++) w[i] = 0.0; w[4] = 1.0; }
          else {
            /* The ground map ends where the aerial photo ends. Its last metres hold edge smears (owner, 2026-11-18: four straight stripes east of
               the east lagoon) and it stopped dead against the default seabed (a straight line by the welcome pavilion). Under water the map now
               fades into the default seabed over its last 75 m; land keeps its map to the edge. */
            float edgeM = min(min(suv.x, 1.0 - suv.x) * uRect.z, min(suv.y, 1.0 - suv.y) * uRect.w);
            float fadeE = (1.0 - smoothstep(8.0, 75.0, edgeM)) * (1.0 - smoothstep(uWater - 1.2, uWater - 0.2, P.y));
            if (fadeE > 0.0) { for (int i = 0; i < 9; i++) w[i] *= 1.0 - fadeE; w[4] += fadeE; }
          }
          // steep ground is rock whatever the map says
          // (except a sand beach's own face down to the water: it drew a dark ribbed band along every beach; owner, 2026-11-18)
          float steep = smoothstep(0.22, 0.52, 1.0 - vNrm.y) * (1.0 - 0.85 * smoothstep(0.55, 0.9, w[0] + w[4]));
          for (int i = 0; i < 9; i++) w[i] *= (1.0 - steep * 0.9);
          w[1] += steep * 1.2;
          { vec3 pm = texture2D(uPaths, suv).rgb * landM * (1.0 - steep * 0.8); float pk = max(pm.r, pm.g); for (int i = 0; i < 9; i++) w[i] *= (1.0 - pk); w[7] = pm.r; w[8] = pm.g; }   // masterplan paths override the natural ground
          // underwater steep faces become reef rock too
          // height-based blending
          bool nearF = vCamDist < 70.0; vec2 gdx = dFdx(P.xz), gdy = dFdy(P.xz);
          float ma = 0.0, tot = 0.0; int dom = 0; float wmax = 0.0;
          for (int i = 0; i < 9; i++) { if (w[i] < 0.06) w[i] = 0.0; if (w[i] > wmax) { wmax = w[i]; dom = i; } }
          if (nearF) {                                    // height-based blending only close up (one tap per active layer)
            float hb[9];
            for (int i = 0; i < 9; i++) { hb[i] = 0.0; if (w[i] > 0.0) { hb[i] = textureGrad(uHA, vec3(P.xz / TILE[i], float(i)), gdx / TILE[i], gdy / TILE[i]).r; ma = max(ma, w[i] + hb[i] * 0.5); } }
            // (blended back to the plain weights towards the edge of the near field, so no ring shows around the camera)
            float kN = 1.0 - smoothstep(40.0, 68.0, vCamDist), s1 = 0.0, s2 = 0.0;
            for (int i = 0; i < 9; i++) { s1 += w[i]; hb[i] = (w[i] > 0.0) ? max(w[i] + hb[i] * 0.5 - (ma - 0.28), 0.0) : 0.0; s2 += hb[i]; }
            for (int i = 0; i < 9; i++) w[i] = mix(w[i] / max(s1, 1e-4), hb[i] / max(s2, 1e-4), kN);
          }
          for (int i = 0; i < 9; i++) tot += w[i];
          for (int i = 0; i < 9; i++) w[i] /= max(tot, 1e-4);
          vec3 alb = vec3(0.0); vec2 nxy = vec2(0.0); float rgh = 0.0; float ao = 0.0;
          float brPix = length(fwidth(P));                                   /* (outside the condition: derivatives are only defined in uniform control flow) */
          vec4 brc = (w[1] > 0.0) ? bedrock(P, vNrm, brPix) : vec4(0.0); gBedH = brc.a; gBedW = w[1] * (1.0 - smoothstep(22.0, 60.0, vCamDist));      /* rock layer: the texture gives the grain, bedrock() the colour and the beds */
          float macro = 0.80 + 0.40 * vn3(vec3(P.xz * 0.045, 1.3)) ; float meso = 1.0;
          for (int i = 0; i < 9; i++) {
            if (w[i] <= 0.0) continue;
            vec2 uv = P.xz / TILE[i]; vec2 gx = gdx / TILE[i], gy = gdy / TILE[i];
            // away from the camera the tile detail melts into the layer's mean colour (higher mip): repeating tiles otherwise read as a lattice
            // of dots / scales from the air. Sand and seabed (smooth, bright, seen through water) melt soonest, from 22 m.
            float mf = (i == 0 || i >= 4) ? 1.0 + max(vCamDist - 22.0, 0.0) / 7.0 : 1.0 + max(vCamDist - 70.0, 0.0) / 30.0;
            if (nearF) {
              vec3 a = (i == dom) ? texCell(uDif, uv, float(i), mf).rgb : textureGrad(uDif, vec3(uv, float(i)), gx * mf, gy * mf).rgb;   // anti-tiling only where it is seen
              vec3 nr = textureGrad(uNR, vec3(uv, float(i)), gx, gy).rgb;
              vec3 ha = textureGrad(uHA, vec3(uv, float(i)), gx, gy).rgb;
              if (i == 2) a *= vec3(1.55, 1.40, 1.12);                                             // leaf litter: lighter and warmer (it read as black gravel in the shade)
              if (i == 0 || i == 4) a = sandTone(a, i);
              if (i == 1) a = brc.rgb * clamp(dot(a, vec3(0.30, 0.59, 0.11)) / 0.064, 0.62, 1.45);
              alb += a * w[i]; nxy += (nr.xy * 2.0 - 1.0) * w[i]; rgh += nr.b * w[i]; ao += ha.g * w[i];
            } else {                                               // far field: colour only (normals/AO are faded out anyway)
              vec3 a = textureGrad(uDif, vec3(uv, float(i)), gx * mf, gy * mf).rgb * (i == 2 ? vec3(1.55, 1.40, 1.12) : vec3(1.0)); if (i == 0 || i == 4) a = sandTone(a, i); if (i == 1) a = brc.rgb * clamp(dot(a, vec3(0.30, 0.59, 0.11)) / 0.064, 0.8, 1.25);
              alb += a * w[i]; rgh += 0.85 * w[i]; ao += w[i];
            }
          }
          alb *= macro * meso;
          // wet sand / rock at the waterline, darker and glossier
          float shoreK = texture2D(uShore, suv).r;                                                   /* 1 at the open sea, 0 inland: hollows inside the island get no water effects */
          float wet = (1.0 - smoothstep(uWater + 0.05, uWater + 0.9, P.y)) * step(uWater - 0.05, P.y) * shoreK;
          /* wet sand mirrors the sky: darker, smooth, and its sky reflection is boosted (gWet, applied after lighting); rock stays rougher */
          float sandy = clamp((s0.r + s1.r) * 1.5, 0.0, 1.0);
          alb *= mix(1.0, mix(0.68, 0.56, sandy), wet);
          alb *= mix(vec3(1.0), vec3(0.46, 0.44, 0.40), (1.0 - smoothstep(uWater + 0.22, uWater + 0.95, P.y + (vn3(vec3(P.xz * 0.7, 2.0)) - 0.5) * 0.35)) * step(uWater - 0.05, P.y) * shoreK * clamp(s0.g * 1.5, 0.0, 1.0));      /* rock: dark tide band of algae and barnacles */ rgh = mix(rgh, mix(0.22, 0.07, sandy), wet * mix(0.75, 0.95, sandy)); gWet = wet * (0.35 + 0.65 * sandy);
          if (P.y > uWater - 0.05 && P.y < uWater + 1.4 && vCamDist < 700.0 && shoreK > 0.02) { /* swash: every wave sends a sheet of water up the beach and pulls it back; foam marks its front edge (on rocks too: there it is splash) */
            float along = (sin(P.x * 0.05) + sin(P.z * 0.043)) * 1.3; float surge = pow(0.5 + 0.5 * sin(uTime * 0.62 + along), 1.4);
            float top = uWater + 0.03 + (0.20 + 0.60 * uSurf) * surge * (0.80 + 0.25 * sin(P.x * 0.9 + uTime * 0.21) * sin(P.z * 0.8 - uTime * 0.17));
            float shoreGround = clamp((s0.r + s0.g * 0.9 + s1.r + s1.g + s1.b) * 1.6, 0.0, 1.0);          /* waves run up sand and rock only, never onto grass or forest floor behind the beach */
            float film = step(P.y, top) * step(uWater - 0.03, P.y) * shoreK * shoreGround, sheet = film * (1.0 - steep);
            alb = mix(alb, alb * vec3(0.66, 0.84, 0.86), sheet * 0.75); rgh = mix(rgh, 0.07, sheet);
            float br = 0.62 + 0.38 * (vn3(vec3(P.xz * 1.7, uTime * 0.35)) * 2.0 - 1.0);      /* irregular break-up of the foam (a product of two sines drew a chequerboard on flat sand at the water's edge) */
            float front = film * smoothstep(top - 0.17, top - 0.006, P.y) * br;                                    /* foam front, wider than before */
            float trail = sheet * (1.0 - smoothstep(uWater + 0.0, uWater + 0.12, P.y)) * smoothstep(0.55, 0.85, br) * 0.6;   /* foam left in the backwash */
            float onRock = clamp(max(s0.g, s1.g) * 1.4, 0.0, 1.0);                                              /* reef and rock ground: foam only in broken flecks, not a white sheet that reads as sand */
            float fo = clamp(front + trail, 0.0, 1.0) * mix(1.0, 0.35 * smoothstep(0.56, 0.76, vn3(vec3(P.xz * 1.6 + 3.0, uTime * 0.3))), onRock);      /* irregular flecks (the sine pattern used before showed as a regular grid of dots from the air) */
            alb = mix(alb, vec3(0.95, 0.97, 0.98), fo); rgh = mix(rgh, 0.6, fo);
          }
          // underwater: seabed lit by animated caustics, fades with depth
          float dpt = max(uWater - P.y, 0.0); gDepth = dpt;
          gCaustic = vec3(0.0);
          if (P.y < uWater && vCamDist < 90.0) { float cc = caustic(P.xz * 0.9, uTime) * exp(-dpt * mix(0.38, 0.13, uUwUnder)) * (1.0 - smoothstep(15.0, 90.0, vCamDist)); gCaustic = vec3(0.9, 1.0, 0.95) * cc * mix(0.22, 0.6, uUwUnder) * alb; }
          float kF = 1.0 - smoothstep(30.0, 68.0, vCamDist); gN = vec3(nxy * 1.1 * kF, 0.0); gRough = clamp(mix(0.85, rgh, kF), 0.05, 1.0); gAO = mix(1.0, ao, 0.8 * kF) * (1.0 - 0.24 * s0.b * landM * step(0.5, float(inside)));      // under the canopy the sky is mostly hidden: less ambient light on the forest floor
          if (uDbg > 0.5 && uDbg < 1.5) gN = vec3(0.0); if (uDbg > 1.5 && uDbg < 2.5) gAO = 1.0; if (uDbg > 2.5 && uDbg < 3.5) gCaustic = vec3(0.0); if (uDbg > 3.5 && uDbg < 4.5) { alb = vec3(0.6); }
          // sun flecks: the leaf cards shade the forest floor completely; real canopies let moving patches of sunlight through
          if (nearF && inside && s0.b * landM > 0.2) {
            vec2 fp = P.xz + vec2(sin(uTime * 0.5 + P.z * 0.21), cos(uTime * 0.43 + P.x * 0.17)) * 0.22;
            float fl = smoothstep(0.60, 0.80, vn3(vec3(fp * 0.42, 3.7)) * 0.65 + vn3(vec3(fp * 1.3, 9.1)) * 0.35) * kF;
            gCaustic += alb * vec3(1.0, 0.90, 0.66) * fl * 2.3 * smoothstep(0.2, 0.7, s0.b * landM);
          }
          gCaustic *= uSunK;
          diffuseColor.rgb *= alb;
        }`).replace(`#include <roughnessmap_fragment>`,`float roughnessFactor = gRough;`).replace(`#include <normal_fragment_maps>`,`
        { vec3 wn = normalize(vec3(vNrm.x + gN.x, vNrm.y, vNrm.z - gN.y));
          if (gBedW > 0.02) { vec3 px = dFdx(vWPos), py = dFdy(vWPos), r1 = cross(py, wn), r2 = cross(wn, px); float det = dot(px, r1);      /* the partings between the beds are grooves */
            vec3 grad = sign(det) * (dFdx(gBedH) * r1 + dFdy(gBedH) * r2); wn = normalize(abs(det) * wn - grad * 0.085 * gBedW); }
          normal = normalize((viewMatrix * vec4(wn, 0.0)).xyz); }`).replace(`#include <emissivemap_fragment>`,`#include <emissivemap_fragment>
 totalEmissiveRadiance += gCaustic;`).replace(`#include <aomap_fragment>`,`reflectedLight.indirectDiffuse *= gAO;`).replace(`#include <lights_fragment_end>`,`#include <lights_fragment_end>
 reflectedLight.indirectSpecular *= 1.0 + gWet * 5.0; reflectedLight.directSpecular *= 1.0 + gWet * 1.5;`).replace(`#include <opaque_fragment>`,`#include <opaque_fragment>
 /* seen from under water (uUwUnder) the light only comes down, and the bed keeps its texture: the water colour comes from the fog */ gl_FragColor.rgb *= mix(vec3(1.0), vec3(0.74, 0.93, 0.91), smoothstep(0.0, 0.30, gDepth) * (1.0 - uUwUnder)); gl_FragColor.rgb = mix(gl_FragColor.rgb * exp(-gDepth * mix(vec3(0.26, 0.035, 0.02), vec3(0.105, 0.026, 0.017), uUwUnder)) * vec3(1.0, 1.06, 1.0), vec3(0.012, 0.12, 0.34), smoothstep(7.0, 13.0, gDepth) * step(0.001, gDepth) * (1.0 - uUwUnder));`)},o.customProgramCacheKey=()=>`terrain-splat-v49`,o}var X=0,Z=0,Q=.3;async function $(e){let t=await(await fetch(e)).arrayBuffer(),n=new Int16Array(t),r=new Float32Array(n.length);for(let e=0;e<n.length;e++)r[e]=n[e]/100;return r}function ie(e,t,n,r,i=1){let{e0:a,n0:o,cell:s,nx:c,ny:l}=e,u=Math.ceil((c-1)/i)+1,d=Math.ceil((l-1)/i)+1,f=new Float32Array(u*d*3),p=new Float32Array(u*d*3),m=new Float32Array(u*d*2),_=n.w*n.cell,v=n.h*n.cell;for(let e=0;e<d;e++){let r=Math.min(e*i,l-1),d=o-(r+.5)*s;for(let o=0;o<u;o++){let h=Math.min(o*i,c-1),g=a+(h+.5)*s,y=e*u+o,b=r*c+h;f[3*y]=g-X,f[3*y+1]=t[b],f[3*y+2]=-(d-Z);let x=t[r*c+Math.max(h-1,0)],S=t[r*c+Math.min(h+1,c-1)],C=t[Math.max(r-1,0)*c+h],w=t[Math.min(r+1,l-1)*c+h],T=(S-x)/(2*s),E=(C-w)/(2*s),D=Math.hypot(T,1,E);p[3*y]=-T/D,p[3*y+1]=1/D,p[3*y+2]=E/D,m[2*y]=(g-n.e0)/_,m[2*y+1]=1-(n.n0-d)/v}}let y=[];for(let e=0;e<d-1;e++)for(let t=0;t<u-1;t++){if(r){let n=a+(t*i+.5)*s,c=n+s*i,l=o-(e*i+.5)*s,u=l-s*i;if(n>=r.e0&&c<=r.e1&&u>=r.n1&&l<=r.n0)continue}let n=e*u+t,c=n+1,l=n+u,d=l+1;y.push(n,l,c,c,l,d)}let b=Q-ae,S=[],w=[];for(let e=0;e<y.length;e+=3){let t=y[e],n=y[e+1],r=y[e+2];(f[3*t+1]<=b&&f[3*n+1]<=b&&f[3*r+1]<=b?w:S).push(t,n,r)}let T=new h(f,3),E=new h(p,3),D=new h(m,2),O=u*d>65535,k=e=>{let t=new x;return t.setAttribute(`position`,T),t.setAttribute(`normal`,E),t.setAttribute(`uv`,D),t.setIndex(O?new g(e,1):new C(e,1)),t.computeBoundingSphere(),t.computeBoundingBox(),t};return{geo:k(S),deep:w.length?k(w):null}}var ae=13,oe=null,se=()=>oe??=new e({color:new p(.012,.12,.34)});async function ce(e,t){let n=`${e}/`,r=await(await fetch(n+`meta.json`)).json();X=r.E0,Z=r.N0;let i=new S,a=e=>new Promise((t,n)=>i.load(e,e=>{e.colorSpace=``,e.wrapS=e.wrapT=y,e.minFilter=v,e.generateMipmaps=!0,e.anisotropy=4,t(e)},void 0,n)),[o,s,c,l,d,p,m,h]=await Promise.all([$(n+r.coarse.file),$(n+r.fine.file),ne(),a(n+`splat0.webp`),a(n+`splat1.webp`),fetch(n+`terrain.json`).then(e=>e.json()),a(n+`paths.webp`),a(n+`shore.webp`)]),g=r.coarse,_=r.fine,b={e0:_.e0+_.cell,e1:_.e0+_.nx*_.cell-_.cell,n0:_.n0-_.cell,n1:_.n0-_.ny*_.cell+_.cell},x=re(c,l,d,p.rect,m,h),C=ie(g,o,r.overview,b,2),w=ie(_,s,r.overview,null,2),T=new u(C.geo,x),E=new u(w.geo,x),D=[C.deep,w.deep].filter(Boolean).map(e=>new u(e,se()));for(let e of[T,E,...D])e.castShadow=!0,e.receiveShadow=!0;let O=new f;O.add(T,E,...D),O.name=e;let k=!1,A=e=>{if(e!==k){k=e;for(let t of D)t.material=e?x:se()}},j=(e,t,n,r)=>{let i=(n-e.e0)/e.cell-.5,a=(e.n0-r)/e.cell-.5,o=Math.floor(i),s=Math.floor(a);if(o<0||s<0||o>=e.nx-1||s>=e.ny-1)return null;let c=i-o,l=a-s,u=s*e.nx+o;return(t[u]*(1-c)+t[u+1]*c)*(1-l)+(t[u+e.nx]*(1-c)+t[u+e.nx+1]*c)*l},M=(e,t)=>{let n=e+X,r=Z-t;return j(_,s,n,r)??j(g,o,n,r)},N=e=>({x0:e.e0-X,zTop:Z-e.n0,W:e.nx*e.cell,H:e.ny*e.cell});return{name:e,meta:r,group:O,heightAt:M,setDeepFull:A,deepMeshes:D,splat1:d,shoreTex:h,terrRect:p.rect,terrCell:p.cell,terrW:p.w,terrH:p.h,overview:null,ovRect:{x0:r.overview.e0-X,zTop:Z-r.overview.n0,W:r.overview.w*r.overview.cell,H:r.overview.h*r.overview.cell},coarse:{rect:N(g),data:o,nx:g.nx,ny:g.ny},fine:{rect:N(_),data:s,nx:_.nx,ny:_.ny},deepColor:r.deep_color}}function le(e){let r=new Uint16Array(e.data.length);for(let n=0;n<r.length;n++)r[n]=t.toHalfFloat(e.data[n]);let a=new n(r,e.nx,e.ny,s,i);return a.minFilter=a.magFilter=_,a.wrapS=a.wrapT=y,a.needsUpdate=!0,a}export{K as a,U as c,I as d,R as f,N as g,j as h,W as i,V as l,k as m,le as n,G as o,E as p,ce as r,H as s,Q as t,L as u};