import * as T from './assets/three.module.js';
export function createScene(canvas,chapters){
const renderer=new T.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;renderer.setClearColor(0x15202a);
const scene=new T.Scene();scene.fog=new T.Fog(0x15202a,28,115);const camera=new T.PerspectiveCamera(67,innerWidth/innerHeight,.08,180);camera.position.set(0,1.7,10);const ray=new T.Raycaster(),ptr=new T.Vector2();let mx=0,my=0,roomIndex=null,transition=null,progress=0,lastClock=0,roomReady=false,currentChapter=0;
const doors=[],rooms=[],hits=[],tick=[],doorMats=[],look=new T.Vector3(0,1.7,-20),targetLook=look.clone();
const mats={floor:new T.MeshStandardMaterial({color:0x283540,roughness:.26,metalness:.5}),wall:new T.MeshStandardMaterial({color:0x65717a,roughness:.85}),dark:new T.MeshStandardMaterial({color:0x15222e,roughness:.48,metalness:.4}),trim:new T.MeshStandardMaterial({color:0xa2a9a8,metalness:.75,roughness:.3}),brass:new T.MeshStandardMaterial({color:0xbda475,metalness:.7,roughness:.26}),wood:new T.MeshStandardMaterial({color:0x4b3529,roughness:.72}),glass:new T.MeshPhysicalMaterial({color:0x95c8df,transparent:true,opacity:.12,roughness:.15,metalness:.2,side:T.DoubleSide}),white:new T.MeshStandardMaterial({color:0xb9c8cf,roughness:.5})};
scene.add(new T.HemisphereLight(0xd6e9ff,0x1e2529,2.1));const sun=new T.DirectionalLight(0xffe6c4,2.6);sun.position.set(8,15,7);scene.add(sun);const moving=new T.PointLight(0xc7e4ff,22,22);scene.add(moving);
function box(w,h,d,mat,parent=scene,x=0,y=0,z=0){const m=new T.Mesh(new T.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);parent.add(m);return m}
function emissive(color,intensity=1){return new T.MeshStandardMaterial({color,emissive:color,emissiveIntensity:intensity,roughness:.5})}
function tube(points,r,color,parent=scene){const geo=new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),points.length*8,r,6,false);const m=new T.Mesh(geo,emissive(color,2));parent.add(m);return m}
function label(text,sub,w,h,parent,x,y,z,size=95,color='#dbe7eb'){const c=document.createElement('canvas');c.width=1024;c.height=512;const ctx=c.getContext('2d');ctx.fillStyle='#121e29';ctx.fillRect(0,0,1024,512);ctx.fillStyle=color;ctx.font=`500 ${size}px Arial`;ctx.fillText(text,65,220,900);ctx.fillStyle='#92a5b5';ctx.font='30px Arial';ctx.fillText(sub,67,325,900);ctx.fillStyle=color;ctx.fillRect(67,390,150,3);const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:tex}));m.position.set(x,y,z);parent.add(m);return m}
function frame(w,h,parent,x,y,z,color=0xa1c5dc){const mat=emissive(color,1.4);box(.035,h,.05,mat,parent,x-w/2,y,z);box(.035,h,.05,mat,parent,x+w/2,y,z);box(w,.035,.05,mat,parent,x,y+h/2,z)}
function ring(r,t,color,parent,x,y,z,rx=0){const m=new T.Mesh(new T.TorusGeometry(r,t,8,100),emissive(color,1.8));m.position.set(x,y,z);m.rotation.x=rx;parent.add(m);return m}
const texLoader=new T.TextureLoader();
function figure(url,w,h,parent,x,y,z,action){
 const mat=new T.MeshBasicMaterial({transparent:true,alphaTest:.08,side:T.DoubleSide,toneMapped:false});
 const plane=new T.Mesh(new T.PlaneGeometry(w,h),mat);plane.visible=false;plane.position.set(x,y+h/2,z);parent.add(plane);
 texLoader.load(url,t=>{
  t.colorSpace=T.SRGBColorSpace;const im=t.image,iw=im.width,ih=im.height;
  // Fit the nontransparent subject without stretching it; retain the source alpha.
  const c=document.createElement('canvas');c.width=iw;c.height=ih;const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(im,0,0);
  const pixels=ctx.getImageData(0,0,iw,ih).data;
  // RGB-only image exports use a uniform green key. Remove it at render time,
  // keeping the generated source intact and the desk plant's darker greens.
  const keyed=pixels[1]>220&&pixels[0]<70&&pixels[2]<70&&pixels[3]>250;
  if(keyed){
   mat.onBeforeCompile=shader=>{shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
    float keyMax=max(diffuseColor.r,diffuseColor.b);
    float keyAmount=smoothstep(0.38,0.78,diffuseColor.g)*smoothstep(0.25,0.65,diffuseColor.g-keyMax)*(1.0-smoothstep(0.05,0.18,keyMax));
    diffuseColor.a*=1.0-keyAmount;
    diffuseColor.g=mix(diffuseColor.g,min(diffuseColor.g,keyMax),keyAmount);
   `)};mat.customProgramCacheKey=()=> 'studio-chroma-green-v1';
   for(let k=0;k<pixels.length;k+=4)if(pixels[k+1]>220&&pixels[k]<70&&pixels[k+2]<70)pixels[k+3]=0;
  }
  let x0=iw,y0=ih,x1=0,y1=0;
  for(let py=0;py<ih;py++)for(let px=0;px<iw;px++)if(pixels[(py*iw+px)*4+3]>18){x0=Math.min(x0,px);x1=Math.max(x1,px);y0=Math.min(y0,py);y1=Math.max(y1,py)}
  if(x1<x0||y1<y0){x0=y0=0;x1=iw-1;y1=ih-1}const bw=x1-x0+1,bh=y1-y0+1,fit=Math.min(w/bw,h/bh);
  plane.geometry.dispose();plane.geometry=new T.PlaneGeometry(bw*fit,bh*fit);plane.position.y=y+bh*fit/2;
  const uv=plane.geometry.attributes.uv;for(let k=0;k<uv.count;k++)uv.setXY(k,(x0+uv.getX(k)*bw)/iw,1-(y0+(1-uv.getY(k))*bh)/ih);uv.needsUpdate=true;
  plane.userData.alpha={pixels,width:iw,height:ih};mat.map=t;mat.needsUpdate=true;plane.visible=true;
 },undefined,()=>{plane.visible=false});if(action){plane.userData.action=action;hits.push(plane)}return plane;
}
// One wall-sized screen per room carries the chapter's story: title, lead and the key points from its detail panel.
function wrap(ctx,text,maxWidth){const words=text.split(/\s+/),lines=[];let line='';for(const w of words){const test=line?line+' '+w:w;if(ctx.measureText(test).width>maxWidth&&line){lines.push(line);line=w}else line=test}if(line)lines.push(line);return lines}
function screen(ch,index,w,h,parent,x,y,z){
 const doc=new DOMParser().parseFromString(ch.body.replace(/<br\s*\/?>/gi,' '),'text/html');
 const text=el=>(el?.textContent||'').replace(/\s+/g,' ').trim();
 const title=text(doc.querySelector('h2')),lead=text(doc.querySelector('.detail-lead'));
 const items=[...doc.querySelectorAll('article, .lab-link')].map((el,k)=>({num:text(el.querySelector('.num'))||text(el.querySelector('p.eyebrow'))||text(el.querySelector(':scope > span'))||'0'+(k+1),head:text(el.querySelector('h3')),body:text(el.querySelector('p:not(.eyebrow)'))})).filter(it=>it.head).slice(0,6);
 const c=document.createElement('canvas');c.width=2048;c.height=1024;const ctx=c.getContext('2d');
 const grad=ctx.createLinearGradient(0,0,0,1024);grad.addColorStop(0,'#0f1a25');grad.addColorStop(1,'#0a121a');ctx.fillStyle=grad;ctx.fillRect(0,0,2048,1024);
 ctx.strokeStyle=ch.color;ctx.globalAlpha=.35;ctx.lineWidth=4;ctx.strokeRect(22,22,2004,980);ctx.globalAlpha=1;
 ctx.fillStyle=ch.color;ctx.font='500 34px Arial';ctx.fillText(`0${index} / ${ch.name.toUpperCase()}   ·   ${ch.eyebrow}`,90,96);
 ctx.fillStyle='#f2f4f0';ctx.font='600 110px Arial';let yy=212;for(const l of wrap(ctx,title,1860)){ctx.fillText(l,86,yy);yy+=118}
 ctx.fillStyle=ch.color;ctx.fillRect(90,yy-58,180,5);yy+=22;
 ctx.fillStyle='#c4ccd2';ctx.font='42px Arial';for(const l of wrap(ctx,lead,1860)){ctx.fillText(l,90,yy);yy+=56}
 const cols=items.length>4?3:2,gap=44,cw=(2048-180-gap*(cols-1))/cols,rows=Math.ceil(items.length/cols),top=yy+36,rowH=Math.min(250,(940-top)/Math.max(1,rows));
 items.forEach((it,k)=>{const cx=90+(k%cols)*(cw+gap),cy=top+Math.floor(k/cols)*rowH;ctx.fillStyle=ch.color;ctx.fillRect(cx,cy,3,rowH-30);ctx.font='500 26px Arial';ctx.fillText(it.num.toUpperCase(),cx+24,cy+30);ctx.fillStyle='#ffffff';ctx.font='600 44px Arial';let ly=cy+84;for(const l of wrap(ctx,it.head,cw-40).slice(0,2)){ctx.fillText(l,cx+24,ly);ly+=50}ctx.fillStyle='#9fb0bd';ctx.font='30px Arial';for(const l of wrap(ctx,it.body,cw-40).slice(0,rowH>200?3:2)){ctx.fillText(l,cx+24,ly);ly+=38}});
 ctx.fillStyle=ch.color;ctx.font='500 30px Arial';ctx.textAlign='right';ctx.fillText('CLICK THE SCREEN FOR THE FULL STORY  ↗',1958,972);
 const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;tex.anisotropy=renderer.capabilities.getMaxAnisotropy();
 const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:tex,toneMapped:false}));m.position.set(x,y,z);parent.add(m);
 const bezel=new T.MeshStandardMaterial({color:0x0b1219,metalness:.6,roughness:.35});box(w+.16,h+.16,.06,bezel,parent,x,y,z-.035);
 const glow=emissive(new T.Color(ch.color),1.2);box(w+.24,.03,.04,glow,parent,x,y-h/2-.11,z-.03);box(w+.24,.03,.04,glow,parent,x,y+h/2+.11,z-.03);
 return m;
}
// The reception opens directly into a continuous, physically modelled hallway.
box(8,.2,108,mats.floor,scene,0,-.12,-39);box(8,.2,108,mats.dark,scene,0,4.9,-39);
for(let z=14;z>=-91;z-=3){box(7.9,.007,.014,mats.trim,scene,0,.001,z);box(.014,.007,3,mats.trim,scene,0,.002,z-1.5)}
for(const side of [-1,1]){box(.055,.015,108,emissive(0xc5dfed,1.8),scene,side*3.6,.013,-39);box(.04,.025,108,emissive(0xe7c28d,2),scene,side*2.6,4.78,-39)}
for(let z=11;z>-92;z-=6){box(.2,4.8,.23,mats.dark,scene,-3.9,2.4,z);box(.2,4.8,.23,mats.dark,scene,3.9,2.4,z);box(8,.24,.23,mats.dark,scene,0,4.7,z);box(5.4,.03,.07,emissive(0xf4d7ab,1.8),scene,0,4.64,z)}
// Entrance atrium, reception and glass view of the skyline.
box(.25,4.8,20,mats.wall,scene,-4,2.4,5);box(.15,1.2,20,mats.dark,scene,4,.6,5);
for(let z=-3;z<15;z+=3){box(.15,3.5,.07,mats.trim,scene,4,2.95,z);box(.025,3.3,2.9,mats.glass,scene,4,2.9,z+1.5)}
box(.25,4.8,8,mats.dark,scene,7,2.4,8);for(let i=0;i<18;i++){const z=15-i*1.4,h=2+(i*7%11)*.8;box(1.2,h,1,emissive(0x223b51,.18),scene,10+(i%3)*1.3,h/2-2,z);for(let y=0;y<h;y+=.65)box(1.21,.08,1.01,emissive(0x8cbbc7,.65),scene,10+(i%3)*1.3,y-2,z)}
const reception=new T.Group();reception.position.set(2.15,0,2.2);reception.rotation.y=-.32;scene.add(reception);figure('assets/reception-studio.png',3.35,2.25,reception,0,0,0,{kind:'details',index:0});
const welcome=new T.Group();welcome.position.set(-3.84,0,2);welcome.rotation.y=Math.PI/2;scene.add(welcome);label('shautech','THE STUDIO / COME ON IN',3.4,1.7,welcome,0,2.55,0,150,'#f0d3a0');
ring(2.25,.028,0xe9c58d,scene,0,4.45,3,Math.PI/2);ring(1.85,.018,0x95bdce,scene,0,4.48,3,Math.PI/2);
// Seven doors lead to seven real rooms. Coordinates are shared by the camera and geometry.
for(let i=1;i<8;i++){
 const ch=chapters[i],side=i===7?0:(i%2?-1:1),z=i===7?-84:4-i*12,col=new T.Color(ch.color),matDoor=new T.MeshStandardMaterial({color:0x243541,metalness:.3,roughness:.4,emissive:col,emissiveIntensity:.025});doorMats.push(matDoor);
 const front=new T.Group();front.position.set(side*4,0,z);front.rotation.y=-side*Math.PI/2;scene.add(front);
 if(side)box(.18,4.8,12,mats.wall,scene,-side*4,2.4,z);else for(const endSide of [-1,1])box(.18,4.8,12,mats.wall,scene,endSide*4,2.4,-78);
 // Side-wall panels leave a doorway of 2.3 m, with a genuine opening above the threshold.
 for(const s of [-1,1])box(4.85,4.8,.22,mats.wall,front,s*3.575,2.4,0);
 box(2.3,1.35,.22,mats.wall,front,0,4.125,0);
 frame(2.45,3.5,front,0,1.75,.14,col);
 const hinge=new T.Group();hinge.position.set(-1.1,0,.02);front.add(hinge);const door=box(2.2,3.35,.13,matDoor,hinge,1.1,1.675,0);door.userData.action={kind:'enter',index:i};hits.push(door);
 box(.06,.58,.08,mats.brass,hinge,1.96,1.4,.12);label('0'+i,ch.name.toUpperCase(),1.45,.72,hinge,1.1,2.4,.076,160,ch.color);
 const plaque=label(ch.name.toUpperCase(),'0'+i+' / ENTER TO EXPLORE',i===7?3.4:1.8,i===7?.7:.9,front,i===7?0:2.45,i===7?4.08:2.15,.14,80,ch.color);plaque.userData.action={kind:'enter',index:i};hits.push(plaque);
 const group=new T.Group();front.add(group);box(9,.2,8.5,mats.floor,group,0,i===7?-.105:-.12,-4.25);box(9,.15,8.5,mats.dark,group,0,4.86,-4.25);box(9,4.8,.2,mats.wall,group,0,2.4,-8.5);box(.2,4.8,8.5,mats.dark,group,-4.5,2.4,-4.25);box(.2,4.8,8.5,mats.dark,group,4.5,2.4,-4.25);
 for(const s of [-1,1])box(.035,.035,8.1,emissive(col,1.6),group,s*4.15,4.73,-4.25);
 ring(1.6,.022,col,group,0,4.45,-4.5,Math.PI/2);
 // The room is deliberately empty: one wall-sized screen tells the chapter's story.
 const wall=screen(ch,i,8.2,4.1,group,0,2.45,-8.3);wall.userData.action={kind:'details',index:i};hits.push(wall);
 const light=new T.PointLight(col,30,16);light.position.set(0,3.8,-4.5);group.add(light);
 const wash=new T.PointLight(0xdfe9f2,26,12);wash.position.set(0,3.2,-2.6);group.add(wash);
 for(const s of [-1,1])box(.03,.03,7.6,emissive(0xc5dfed,1.4),group,s*4.42,.25,-4.4);
 doors[i]={hinge,front,side,z,door,open:0};rooms[i]=group;
}
// The founders welcome visitors on either side of the final, functional door.
const founders=new T.Group();scene.add(founders);
figure('assets/lucian-studio.png',1.85,2.75,founders,-1.1,0,-81,{kind:'details',index:5,founder:'lucian',hall:true});
figure('assets/andrei-studio.png',1.85,2.69,founders,1.1,0,-81,{kind:'details',index:5,founder:'andrei',hall:true});
label('Lucian','CO-FOUNDER / CLOUD & IDENTITY',1.25,.42,scene,-1.1,3.06,-80.96,90,'#e8d2ab');
label('Andrei','CO-FOUNDER / ENDPOINTS & SECURITY',1.25,.42,scene,1.1,3.00,-80.96,90,'#e8d2ab');
// Geometric ceiling baffles, floor pools and daylight create readable parallax at every step.
for(let z=-5;z>-90;z-=12){const pl=new T.PointLight(0xffd5a0,16,13);pl.position.set(0,4,z);scene.add(pl);const pool=new T.Mesh(new T.PlaneGeometry(5,3),new T.MeshBasicMaterial({color:0xadc8d3,transparent:true,opacity:.045,depthWrite:false}));pool.rotation.x=-Math.PI/2;pool.position.set(0,.005,z);scene.add(pool);}
function resize(){camera.aspect=innerWidth/innerHeight;camera.fov=innerWidth<761?78:67;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)}
function beginRoom(i,instant=false){if(!doors[i]||transition)return;roomIndex=i;roomReady=false;const d=doors[i],start=camera.position.clone();const end=new T.Vector3(d.side*6.1,1.7,d.z-(d.side?0:2.1));if(instant){camera.position.copy(end);look.set(d.side*12.3,2.2,d.z-(d.side?0:8.3));d.open=1;roomReady=true;return}const curve=new T.CatmullRomCurve3(d.side?[start,new T.Vector3(d.side*1.6,1.7,d.z+2.8),new T.Vector3(d.side*4.3,1.7,d.z),end]:[start,new T.Vector3(0,1.7,d.z+3),new T.Vector3(0,1.7,d.z+.25),end]);transition={kind:'enter',p:0,curve,fromLook:look.clone(),toLook:new T.Vector3(d.side*12.3,2.2,d.z-(d.side?0:8.3))};}
function leaveRoom(){if(roomIndex===null||transition)return;const d=doors[roomIndex];transition={kind:'leave',p:0,curve:new T.CatmullRomCurve3([camera.position.clone(),new T.Vector3(d.side*4.3,1.7,d.z+(d.side?0:.25)),new T.Vector3(0,1.7,d.z+3),new T.Vector3(0,1.7,10-roomIndex*12)]),fromLook:look.clone(),toLook:new T.Vector3(0,1.7,d.z-25)};roomReady=false;}
return{resize,pointer(x,y){mx=x;my=y},hit(x,y){ptr.set(x/innerWidth*2-1,-y/innerHeight*2+1);ray.setFromCamera(ptr,camera);const hit=ray.intersectObjects(hits,false).find(h=>{const a=h.object.userData.action,alpha=h.object.userData.alpha;if(!h.object.visible)return false;if(alpha&&h.uv){const px=Math.min(alpha.width-1,Math.max(0,Math.floor(h.uv.x*alpha.width))),py=Math.min(alpha.height-1,Math.max(0,Math.floor((1-h.uv.y)*alpha.height)));if(alpha.pixels[(py*alpha.width+px)*4+3]<20)return false}return h.distance<14&&(roomIndex===null?(a.kind==='enter'||a.index===0||a.hall):a.kind==='details'&&a.index===roomIndex)});return hit?.object.userData.action||null},enterRoom:beginRoom,leaveRoom,get inRoom(){return roomIndex!==null},get ready(){return roomReady},get roomIndex(){return roomIndex},cancelRoom(){roomIndex=null;transition=null;roomReady=false;},update(s){
currentChapter=Math.round(s.current);const dt=s.dt;progress=s.current;moving.position.copy(camera.position);moving.position.y=3;
if(transition){const tr=transition;tr.p=Math.min(1,tr.p+dt*.55);const p=tr.p*tr.p*(3-2*tr.p);camera.position.copy(tr.curve.getPoint(p));look.lerpVectors(tr.fromLook,tr.toLook,p);if(tr.p===1){if(tr.kind==='leave')roomIndex=null;else roomReady=true;transition=null;}}
else if(roomIndex===null){camera.position.set(mx*.35,1.7+(s.paused?0:Math.sin(s.current*12)*.015),10-s.current*12);targetLook.set(mx*2,1.7-my*.8,camera.position.z-14);look.lerp(targetLook,1-Math.exp(-dt*5));}
else{const d=doors[roomIndex];targetLook.set(d.side?d.side*12.3:mx*3,2.2-my*.8,d.side?d.z-mx*3:d.z-8.3);look.lerp(targetLook,1-Math.exp(-dt*5));}
camera.lookAt(look);
for(let i=1;i<8;i++){const d=doors[i];d.open+=((i===roomIndex?1:0)-d.open)*(1-Math.exp(-dt*6));d.hinge.rotation.y=d.open*1.65;doorMats[i-1].emissiveIntensity=i===currentChapter?.12:.025;rooms[i].visible=Math.abs(i-s.current)<2||i===roomIndex;}
if(!s.paused)tick.forEach(fn=>fn(s.clock));renderer.render(scene,camera);
}};
}
