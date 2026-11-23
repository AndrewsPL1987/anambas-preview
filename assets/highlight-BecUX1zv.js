import{Cr as e,Ct as t,Gn as n,Mn as r,R as i,St as a,Tr as o,Wn as s,X as c,Z as l,Zn as u,_ as d,br as f,d as p,l as m,lr as h,o as g,st as _,tt as v,vr as y,xt as b,yr as x,yt as S}from"./three.core-CiGiNCZj.js";import{i as C,r as w}from"./three.module-5SN3DXF7.js";var T=new g,E=new x,D=class extends c{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type=`LineSegmentsGeometry`,this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute(`position`,new i([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute(`uv`,new i([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,n=this.attributes.instanceEnd;return t!==void 0&&(t.applyMatrix4(e),n.applyMatrix4(e),t.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let n=new l(t,6,1);return this.setAttribute(`instanceStart`,new v(n,3,0)),this.setAttribute(`instanceEnd`,new v(n,3,3)),this.instanceCount=this.attributes.instanceStart.count,this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let n=new l(t,6,1);return this.setAttribute(`instanceColorStart`,new v(n,3,0)),this.setAttribute(`instanceColorEnd`,new v(n,3,3)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new o(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new g);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;e!==void 0&&t!==void 0&&(this.boundingBox.setFromBufferAttribute(e),T.setFromBufferAttribute(t),this.boundingBox.union(T))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new u),this.boundingBox===null&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(e!==void 0&&t!==void 0){let n=this.boundingSphere.center;this.boundingBox.getCenter(n);let r=0;for(let i=0,a=e.count;i<a;i++)E.fromBufferAttribute(e,i),r=Math.max(r,n.distanceToSquared(E)),E.fromBufferAttribute(t,i),r=Math.max(r,n.distanceToSquared(E));this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error(`THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.`,this)}}toJSON(){}};C.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new y},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}},w.line={uniforms:h.merge([C.common,C.fog,C.line]),vertexShader:`
		#include <common>
		#include <color_pars_vertex>
		#include <fog_pars_vertex>
		#include <logdepthbuf_pars_vertex>
		#include <clipping_planes_pars_vertex>

		uniform float linewidth;
		uniform vec2 resolution;

		attribute vec3 instanceStart;
		attribute vec3 instanceEnd;

		attribute vec3 instanceColorStart;
		attribute vec3 instanceColorEnd;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#ifdef USE_DASH

			uniform float dashScale;
			attribute float instanceDistanceStart;
			attribute float instanceDistanceEnd;
			varying float vLineDistance;

		#endif

		float trimSegmentAlpha( const in vec4 start, const in vec4 end ) {

			// compute the interpolation factor needed to trim the segment so it terminates
			// between the camera plane and the near plane

			// conservative estimate of the near plane
			float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
			float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column

			// we need different nearEstimate formula for reversed and default depth buffer
			// a is positive with a reversed depth buffer so it can be used for controlling the code flow
			float nearEstimate = ( a > 0.0 ) ? ( - b / ( a + 1.0 ) ) : ( - 0.5 * b / a );

			return ( nearEstimate - start.z ) / ( end.z - start.z );

		}

		void main() {

			#ifdef USE_COLOR

				vColor.xyz = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

			#endif

			float aspect = resolution.x / resolution.y;

			// camera space
			vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
			vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

			#ifdef USE_DASH

				float lineDistanceStart = dashScale * instanceDistanceStart;
				float lineDistanceEnd = dashScale * instanceDistanceEnd;

			#endif

			#ifdef WORLD_UNITS

				worldStart = start.xyz;
				worldEnd = end.xyz;

			#else

				vUv = uv;

			#endif

			// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
			// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
			// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
			// perhaps there is a more elegant solution -- WestLangley

			bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

			if ( perspective ) {

				if ( start.z < 0.0 && end.z >= 0.0 ) {

					float alpha = trimSegmentAlpha( start, end );
					end.xyz = mix( start.xyz, end.xyz, alpha );

					#ifdef USE_DASH

						lineDistanceEnd = mix( lineDistanceStart, lineDistanceEnd, alpha );

					#endif

				} else if ( end.z < 0.0 && start.z >= 0.0 ) {

					float alpha = trimSegmentAlpha( end, start );
					start.xyz = mix( end.xyz, start.xyz, alpha );

					#ifdef USE_DASH

						lineDistanceStart = mix( lineDistanceEnd, lineDistanceStart, alpha );

					#endif

				}

			}

			#ifdef USE_DASH

				vLineDistance = ( position.y < 0.5 ) ? lineDistanceStart : lineDistanceEnd;
				vUv = uv;

			#endif

			// clip space
			vec4 clipStart = projectionMatrix * start;
			vec4 clipEnd = projectionMatrix * end;

			// ndc space
			vec3 ndcStart = clipStart.xyz / clipStart.w;
			vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

			// direction
			vec2 dir = ndcEnd.xy - ndcStart.xy;

			// account for clip-space aspect ratio
			dir.x *= aspect;
			dir = normalize( dir );

			#ifdef WORLD_UNITS

				vec3 worldDir = normalize( end.xyz - start.xyz );
				vec3 tmpFwd = perspective ? normalize( mix( start.xyz, end.xyz, 0.5 ) ) : vec3( 0.0, 0.0, - 1.0 );
				vec3 worldUp = normalize( cross( worldDir, tmpFwd ) );
				vec3 worldFwd = cross( worldDir, worldUp );
				worldPos = position.y < 0.5 ? start: end;

				// height offset
				float hw = linewidth * 0.5;
				worldPos.xyz += position.x < 0.0 ? hw * worldUp : - hw * worldUp;

				// don't extend the line if we're rendering dashes because we
				// won't be rendering the endcaps
				#ifndef USE_DASH

					// cap extension
					worldPos.xyz += position.y < 0.5 ? - hw * worldDir : hw * worldDir;

					// add width to the box
					worldPos.xyz += worldFwd * hw;

					// endcaps
					if ( position.y > 1.0 || position.y < 0.0 ) {

						worldPos.xyz -= worldFwd * 2.0 * hw;

					}

				#endif

				// project the worldpos
				vec4 clip = projectionMatrix * worldPos;

				// shift the depth of the projected points so the line
				// segments overlap neatly
				vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;

				// only shift the depth of vertices in front of the camera (#35137)
				if ( clip.w > 0.0 ) clip.z = clipPose.z * clip.w;

			#else

				vec2 offset = vec2( dir.y, - dir.x );
				// undo aspect ratio adjustment
				dir.x /= aspect;
				offset.x /= aspect;

				// sign flip
				if ( position.x < 0.0 ) offset *= - 1.0;

				// endcaps
				if ( position.y < 0.0 ) {

					offset += - dir;

				} else if ( position.y > 1.0 ) {

					offset += dir;

				}

				// adjust for linewidth
				offset *= linewidth;

				// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
				offset /= resolution.y;

				// select end
				vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

				// back to clip space
				offset *= clip.w;

				clip.xy += offset;

			#endif

			gl_Position = clip;

			vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

			#include <logdepthbuf_vertex>
			#include <clipping_planes_vertex>
			#include <fog_vertex>

		}
		`,fragmentShader:`
		uniform vec3 diffuse;
		uniform float opacity;
		uniform float linewidth;

		#ifdef USE_DASH

			uniform float dashOffset;
			uniform float dashSize;
			uniform float gapSize;

		#endif

		varying float vLineDistance;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#include <common>
		#include <color_pars_fragment>
		#include <fog_pars_fragment>
		#include <logdepthbuf_pars_fragment>
		#include <clipping_planes_pars_fragment>

		vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

			float mua;
			float mub;

			vec3 p13 = p1 - p3;
			vec3 p43 = p4 - p3;

			vec3 p21 = p2 - p1;

			float d1343 = dot( p13, p43 );
			float d4321 = dot( p43, p21 );
			float d1321 = dot( p13, p21 );
			float d4343 = dot( p43, p43 );
			float d2121 = dot( p21, p21 );

			float denom = d2121 * d4343 - d4321 * d4321;

			float numer = d1343 * d4321 - d1321 * d4343;

			mua = numer / denom;
			mua = clamp( mua, 0.0, 1.0 );
			mub = ( d1343 + d4321 * ( mua ) ) / d4343;
			mub = clamp( mub, 0.0, 1.0 );

			return vec2( mua, mub );

		}

		void main() {

			float alpha = opacity;
			vec4 diffuseColor = vec4( diffuse, alpha );

			#include <clipping_planes_fragment>

			#ifdef USE_DASH

				if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

				if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

			#endif

			#ifdef WORLD_UNITS

				float len;

				if ( isOrthographic ) {

					// View rays are parallel to the z axis so the distance reduces to camera-space XY
					vec2 lineDir = worldEnd.xy - worldStart.xy;
					float t = clamp( dot( worldPos.xy - worldStart.xy, lineDir ) / dot( lineDir, lineDir ), 0.0, 1.0 );
					len = length( worldStart.xy + lineDir * t - worldPos.xy );

				} else {

					// Find the closest points on the view ray and the line segment
					vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
					vec3 lineDir = worldEnd - worldStart;
					vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

					vec3 p1 = worldStart + lineDir * params.x;
					vec3 p2 = rayEnd * params.y;
					vec3 delta = p1 - p2;
					len = length( delta );

				}

				float norm = len / linewidth;

				#ifndef USE_DASH

					#ifdef USE_ALPHA_TO_COVERAGE

						float dnorm = fwidth( norm );
						alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

					#else

						if ( norm > 0.5 ) {

							discard;

						}

					#endif

				#endif

			#else

				#ifdef USE_ALPHA_TO_COVERAGE

					// artifacts appear on some hardware if a derivative is taken within a conditional
					float a = vUv.x;
					float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
					float len2 = a * a + b * b;
					float dlen = fwidth( len2 );

					if ( abs( vUv.y ) > 1.0 ) {

						alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

					}

				#else

					if ( abs( vUv.y ) > 1.0 ) {

						float a = vUv.x;
						float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
						float len2 = a * a + b * b;

						if ( len2 > 1.0 ) discard;

					}

				#endif

			#endif

			#include <logdepthbuf_fragment>
			#include <color_fragment>

			gl_FragColor = vec4( diffuseColor.rgb, alpha );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>
			#include <fog_fragment>
			#include <premultiplied_alpha_fragment>

		}
		`};var O=class extends n{constructor(e){super({type:`LineMaterial`,uniforms:h.clone(w.line.uniforms),vertexShader:w.line.vertexShader,fragmentShader:w.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(e)}get color(){return this.uniforms.diffuse.value}set color(e){this.uniforms.diffuse.value=e}get worldUnits(){return`WORLD_UNITS`in this.defines}set worldUnits(e){e===!0!==this.worldUnits&&(this.needsUpdate=!0),e===!0?this.defines.WORLD_UNITS=``:delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(e){this.uniforms.linewidth&&(this.uniforms.linewidth.value=e)}get dashed(){return`USE_DASH`in this.defines}set dashed(e){e===!0!==this.dashed&&(this.needsUpdate=!0),e===!0?this.defines.USE_DASH=``:delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(e){this.uniforms.dashScale.value=e}get dashSize(){return this.uniforms.dashSize.value}set dashSize(e){this.uniforms.dashSize.value=e}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(e){this.uniforms.dashOffset.value=e}get gapSize(){return this.uniforms.gapSize.value}set gapSize(e){this.uniforms.gapSize.value=e}get opacity(){return this.uniforms.opacity.value}set opacity(e){this.uniforms&&(this.uniforms.opacity.value=e)}get resolution(){return this.uniforms.resolution.value}set resolution(e){this.uniforms.resolution.value.copy(e)}get alphaToCoverage(){return`USE_ALPHA_TO_COVERAGE`in this.defines}set alphaToCoverage(e){this.defines&&(e===!0!==this.alphaToCoverage&&(this.needsUpdate=!0),e===!0?this.defines.USE_ALPHA_TO_COVERAGE=``:delete this.defines.USE_ALPHA_TO_COVERAGE)}},k=new f,A=new x,j=new x,M=new f,N=new f,P=new f,F=new x,I=new b,L=new _,R=new x,z=new g,B=new u,V=new f,H,U;function W(e,t,n){return V.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),V.multiplyScalar(1/V.w),V.x=U/n.width,V.y=U/n.height,V.applyMatrix4(e.projectionMatrixInverse),V.multiplyScalar(1/V.w),Math.abs(Math.max(V.x,V.y))}function G(e,t){let n=e.matrixWorld,r=e.geometry,i=r.attributes.instanceStart,a=r.attributes.instanceEnd,o=Math.min(r.instanceCount,i.count);for(let r=0,s=o;r<s;r++){L.start.fromBufferAttribute(i,r),L.end.fromBufferAttribute(a,r),L.applyMatrix4(n);let o=new x,s=new x;H.distanceSqToSegment(L.start,L.end,s,o),s.distanceTo(o)<U*.5&&t.push({point:s,pointOnLine:o,distance:H.origin.distanceTo(s),object:e,face:null,faceIndex:r,uv:null,uv1:null})}}function K(e,t,n){let r=t.projectionMatrix,i=e.material.resolution,a=e.matrixWorld,o=e.geometry,s=o.attributes.instanceStart,c=o.attributes.instanceEnd,l=Math.min(o.instanceCount,s.count),u=-t.near;H.at(1,P),P.w=1,P.applyMatrix4(t.matrixWorldInverse),P.applyMatrix4(r),P.multiplyScalar(1/P.w),P.x*=i.x/2,P.y*=i.y/2,P.z=0,F.copy(P),I.multiplyMatrices(t.matrixWorldInverse,a);for(let t=0,o=l;t<o;t++){if(M.fromBufferAttribute(s,t),N.fromBufferAttribute(c,t),M.w=1,N.w=1,M.applyMatrix4(I),N.applyMatrix4(I),M.z>u&&N.z>u)continue;if(M.z>u){let e=M.z-N.z,t=(M.z-u)/e;M.lerp(N,t)}else if(N.z>u){let e=N.z-M.z,t=(N.z-u)/e;N.lerp(M,t)}M.applyMatrix4(r),N.applyMatrix4(r),M.multiplyScalar(1/M.w),N.multiplyScalar(1/N.w),M.x*=i.x/2,M.y*=i.y/2,N.x*=i.x/2,N.y*=i.y/2,L.start.copy(M),L.start.z=0,L.end.copy(N),L.end.z=0;let o=L.closestPointToPointParameter(F,!0);L.at(o,R);let l=S.lerp(M.z,N.z,o),d=l>=-1&&l<=1,f=F.distanceTo(R)<U*.5;if(d&&f){L.start.fromBufferAttribute(s,t),L.end.fromBufferAttribute(c,t),L.start.applyMatrix4(a),L.end.applyMatrix4(a);let r=new x,i=new x;H.distanceSqToSegment(L.start,L.end,i,r),n.push({point:i,pointOnLine:r,distance:H.origin.distanceTo(i),object:e,face:null,faceIndex:t,uv:null,uv1:null})}}}var q=class extends a{constructor(e=new D,t=new O({color:Math.random()*16777215})){super(e,t),this.isLineSegments2=!0,this.type=`LineSegments2`}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,n=e.attributes.instanceEnd,r=new Float32Array(2*t.count);for(let e=0,i=0,a=t.count;e<a;e++,i+=2)A.fromBufferAttribute(t,e),j.fromBufferAttribute(n,e),r[i]=i===0?0:r[i-1],r[i+1]=r[i]+A.distanceTo(j);let i=new l(r,2,1);return e.setAttribute(`instanceDistanceStart`,new v(i,1,0)),e.setAttribute(`instanceDistanceEnd`,new v(i,1,1)),this}raycast(e,t){let n=this.material.worldUnits,r=e.camera;if(r===null&&!n&&console.error(`LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.`),n===!1&&(this.material.resolution.x===0||this.material.resolution.y===0))return;let i=e.params.Line2===void 0?0:e.params.Line2.threshold||0;H=e.ray;let a=this.matrixWorld,o=this.geometry,s=this.material;U=s.linewidth+i,o.boundingSphere===null&&o.computeBoundingSphere(),B.copy(o.boundingSphere).applyMatrix4(a);let c;if(c=n?U*.5:W(r,Math.max(r.near,B.distanceToPoint(H.origin)),s.resolution),B.radius+=c,H.intersectsSphere(B)===!1)return;o.boundingBox===null&&o.computeBoundingBox(),z.copy(o.boundingBox).applyMatrix4(a);let l;l=n?U*.5:W(r,Math.max(r.near,z.distanceToPoint(H.origin)),s.resolution),z.expandByScalar(l),H.intersectsBox(z)!==!1&&(n?G(this,t):K(this,r,t))}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(k),this.material.uniforms.resolution.value.set(k.z,k.w))}},J=class extends D{constructor(){super(),this.isLineGeometry=!0,this.type=`LineGeometry`}setPositions(e){let t=e.length-3,n=new Float32Array(2*t);for(let r=0;r<t;r+=3)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5];return super.setPositions(n),this}setColors(e){let t=e.length-3,n=new Float32Array(2*t);for(let r=0;r<t;r+=3)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5];return super.setColors(n),this}setFromPoints(e){let t=e.length-1,n=new Float32Array(6*t);for(let r=0;r<t;r++)n[6*r]=e[r].x,n[6*r+1]=e[r].y,n[6*r+2]=e[r].z||0,n[6*r+3]=e[r+1].x,n[6*r+4]=e[r+1].y,n[6*r+5]=e[r+1].z||0;return super.setPositions(n),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}},Y=class extends q{constructor(e=new J,t=new O({color:Math.random()*16777215})){super(e,t),this.isLine2=!0,this.type=`Line2`}},ee=`#f0b44c`,te=`#fffaf0`,ne=`#0c1a14`,re=9.5,X=(e,t,n)=>{let r=!1;for(let i=0,a=n.length-1;i<n.length;a=i++)n[i][1]>t!=n[a][1]>t&&e<(n[a][0]-n[i][0])*(t-n[i][1])/(n[a][1]-n[i][1])+n[i][0]&&(r=!r);return r};async function Z(o,{residences:c,enabled:l=()=>!0,onHover:u,onPick:f}={}){let h=o.renderer,g=o.camera,_=h.domElement,v=new d(ee),b=new d(te),S=new d(ne),C={};try{let e=await fetch(`tenggeran/plots.json`);e.ok&&(C=await e.json())}catch{}let w=Object.fromEntries(o.allBuildings.map(e=>[e.id,e])),T=e=>[...e.spec_footprint??e.roof??[],...e.deck??[]].filter(e=>e.length>=3),E=c.map(e=>({id:e.id,b:w[e.id],rings:w[e.id]?T(w[e.id]):[],plot:C[e.id]?.ring??null})).filter(e=>e.b),D=(e,t)=>Math.max(o.heightAt(e,t)??-40,o.WATER_LEVEL),k=new s,A={},j=new y,M=(e,t,n,r)=>{let i=new J;i.setPositions(e);let a=new O({color:r,linewidth:t,transparent:!0,opacity:n,depthTest:!1,depthWrite:!1});a.toneMapped=!1,a.fog=!1,a.userData.o=n;let o=new Y(i,a);return o.frustumCulled=!1,o.visible=!1,k.add(o),o};for(let e of E){if(!e.plot)continue;let t=e.plot,n=[];for(let e=0;e<=t.length;e++){let r=t[e%t.length],i=t[(e+1)%t.length],a=Math.hypot(i[0]-r[0],i[1]-r[1]),o=e===t.length?1:Math.max(1,Math.ceil(a/1.5));for(let e=0;e<o;e++){let t=r[0]+(i[0]-r[0])*e/o,a=r[1]+(i[1]-r[1])*e/o;n.push(t,D(t,a)+.35,a)}}A[e.id]=[M(n,5.5,.5,S),M(n,2.4,.98,b)]}let N=new e(4,4,{depthBuffer:!1,samples:4}),P=new s,F=new Map,I=new t({color:16777215,side:2,depthTest:!1,depthWrite:!1,fog:!1,toneMapped:!1}),L=e=>{let t=F.get(e);return t||(t=new a(e.geometry,I),t.matrixAutoUpdate=!1,t.matrix.copy(e.matrixWorld),t.matrixWorld.copy(e.matrixWorld),t.frustumCulled=!1,t.visible=!1,P.add(t),F.set(e,t)),t},R=new n({transparent:!0,depthTest:!1,depthWrite:!1,toneMapped:!1,uniforms:{tMask:{value:N.texture},uTexel:{value:new y(1,1)},uColor:{value:v},uAlpha:{value:0},uSpread:{value:1}},vertexShader:`varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,fragmentShader:`varying vec2 vUv; uniform sampler2D tMask; uniform vec2 uTexel; uniform vec3 uColor; uniform float uAlpha, uSpread;
      void main(){
        float c = texture2D(tMask, vUv).r, near = 0.0, far = 0.0;
        for (int i = 0; i < 12; i++) { float a = float(i) * 0.5235988; vec2 d = vec2(cos(a), sin(a)) * uTexel; near = max(near, texture2D(tMask, vUv + d * max(1.2, 1.6 * uSpread)).r); far += texture2D(tMask, vUv + d * 5.5 * uSpread).r + texture2D(tMask, vUv + d * 10.0 * uSpread).r * 0.5; }
        float outside = 1.0 - c;                                       /* a fine bright line just outside the building, a halo beyond it, a faint wash on it */
        float a = clamp(near * outside * 0.95 + (far / 18.0) * outside * 0.75 + c * 0.09, 0.0, 1.0) * uAlpha;
        gl_FragColor = vec4(uColor, a);
        #include <colorspace_fragment>
      }`}),z=new a(new m().setAttribute(`position`,new i([-1,-1,0,3,-1,0,-1,3,0],3)).setAttribute(`uv`,new i([0,0,2,0,0,2],2)),R);z.frustumCulled=!1;let B=new s;B.add(z);let V=new p,H={id:null,shown:null,a:0,kept:null,ka:0,hover:null,px:-1,py:-1,dirty:!1,down:null};function U(e){e!==H.id&&(H.id=e,e&&(H.shown=e))}function W(e){H.kept=e}let G=new d,K=new x;function q(e){H.dirty&&(H.dirty=!1,ie(H.px,H.py)),H.a+=(+!!H.id-H.a)*Math.min(1,e*9),!H.id&&H.a<.01&&(H.a=0,H.shown=null),H.ka+=((H.kept&&H.kept!==H.shown?1:0)-H.ka)*Math.min(1,e*5);let t=H.shown&&H.a>0,n=H.ka>.01&&H.kept;for(let[e,r]of Object.entries(A)){let i=e===H.shown&&t?H.a:e===H.kept&&n?H.ka*.55:0;for(let e of r)e.visible=i>0,e.material.opacity=e.material.userData.o*i}if(!t&&!n)return;h.getDrawingBufferSize(j);let r=h.autoClear,i=h.getRenderTarget();h.autoClear=!1;let a=t?o.buildingParts?.[H.shown]??[]:[];if(a.length){let e=Math.max(4,Math.round(j.x/2)),t=Math.max(4,Math.round(j.y/2));(N.width!==e||N.height!==t)&&N.setSize(e,t);for(let e of F.values())e.visible=!1;for(let e of a)e.mesh.geometry.setDrawRange(e.start,e.count),L(e.mesh).visible=!0;let n=h.getClearAlpha();h.getClearColor(G),h.setRenderTarget(N),h.setClearColor(0,0),h.clear(),h.render(P,g),h.setRenderTarget(i),h.setClearColor(G,n);for(let e of a)e.mesh.geometry.setDrawRange(0,1/0);let r=w[H.shown],o=r?14/Math.max(1,g.position.distanceTo(K.set(r.centroid[0],r.pad+4,r.centroid[1])))*j.y/(2*Math.tan(g.fov*Math.PI/360)):200;R.uniforms.uSpread.value=Math.min(1,Math.max(.3,o/150)),R.uniforms.uTexel.value.set(1/e,1/t),R.uniforms.uAlpha.value=H.a,h.render(B,V)}for(let e of Object.values(A))for(let t of e)t.visible&&t.material.resolution.copy(j);h.render(k,g),h.autoClear=r}o.onAfterRender(q);let Z=new r,Q=new y;function $(e,t){let n=_.getBoundingClientRect();Q.set((e-n.left)/n.width*2-1,-((t-n.top)/n.height)*2+1),Z.setFromCamera(Q,g);let r=Z.ray.origin,i=Z.ray.direction,a=null,o=1/0;for(let e of E){let t=e.b.pad-.5,n=e.b.pad+re,s=0,c=900;if(Math.abs(i.y)<1e-5){if(r.y<t||r.y>n)continue}else{let e=(t-r.y)/i.y,a=(n-r.y)/i.y;if(s=Math.max(s,Math.min(e,a)),c=Math.min(c,Math.max(e,a)),s>c)continue}if(s>=o)continue;let l=Math.max(.6,(c-s)/240);for(let t=s;t<=c;t+=l){let n=r.x+i.x*t,s=r.z+i.z*t;if(e.rings.some(e=>X(n,s,e))){t<o&&(o=t,a=e.id);break}}}let s=null;if(i.y<-1e-4){let e=0,t=0;for(;e<2600;){let n=r.x+i.x*e,a=r.z+i.z*e;if(r.y+i.y*e<=D(n,a)){let n=t,a=e;for(let e=0;e<8;e++){let e=(n+a)/2;r.y+i.y*e<=D(r.x+i.x*e,r.z+i.z*e)?a=e:n=e}s=a;break}t=e,e+=Math.max(1.2,e*.012)}}if(a&&(s==null||o<=s+1.5))return a;if(s!=null&&s<900){let e=r.x+i.x*s,t=r.z+i.z*s;for(let n of E)if(n.plot&&X(e,t,n.plot))return n.id}return null}function ie(e,t){let n=e>=0&&l()?$(e,t):null;if(n===H.hover)return;let r=H.hover;H.hover=n,_.style.cursor=n?`pointer`:``,u?.(n,r,e,t)}return _.addEventListener(`pointermove`,e=>{e.pointerType!==`mouse`||e.buttons||(H.px=e.clientX,H.py=e.clientY,H.dirty=!0)}),_.addEventListener(`pointerleave`,()=>{H.px=H.py=-1,H.dirty=!0}),_.addEventListener(`pointerdown`,e=>{H.down={x:e.clientX,y:e.clientY,t:performance.now()}}),_.addEventListener(`pointerup`,e=>{let t=H.down;if(H.down=null,!t||!l()||Math.hypot(e.clientX-t.x,e.clientY-t.y)>6||performance.now()-t.t>500)return;let n=$(e.clientX,e.clientY);n&&f?.(n)}),{set:U,keep:W,pick:$,plots:C,get hover(){return H.hover},get lit(){return H.id},refresh(){H.dirty=H.px>=0}}}export{Z as createHighlight};