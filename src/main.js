import * as THREE from 'three';
import './style.css';

// Prototype scope: a compact procedural city block, third-person Robin,
// one drivable car, and touch/keyboard controls. Art and story assets are placeholders.
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x8fa5b8);
scene.fog = new THREE.Fog(0x8fa5b8, 55, 190);

const camera = new THREE.PerspectiveCamera(65, innerWidth / innerHeight, 0.1, 350);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.querySelector('#game').prepend(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xb8d4ed, 0x39404a, 2.0));
const sun = new THREE.DirectionalLight(0xffe0b0, 2.4);
sun.position.set(-35, 65, 25);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
sun.shadow.camera.left = -70; sun.shadow.camera.right = 70;
sun.shadow.camera.top = 70; sun.shadow.camera.bottom = -70;
scene.add(sun);

const mat = (color, roughness=0.9) => new THREE.MeshStandardMaterial({ color, roughness });
const groundMat = mat(0x555b60);
const roadMat = mat(0x20252b);
const buildingMats = [0x777b80,0x9a8877,0x687783,0x8b8b80,0x6e6b73].map(c=>mat(c));
const world = new THREE.Group(); scene.add(world);

const ground = new THREE.Mesh(new THREE.PlaneGeometry(220,220), groundMat);
ground.rotation.x=-Math.PI/2; ground.receiveShadow=true; world.add(ground);

// Cross-road grid with sidewalks and lane markings.
for(let i=-4;i<=4;i++){
  const roadA=new THREE.Mesh(new THREE.PlaneGeometry(13,220),roadMat);
  roadA.rotation.x=-Math.PI/2; roadA.position.set(i*35,0.015,0); world.add(roadA);
  const roadB=new THREE.Mesh(new THREE.PlaneGeometry(220,13),roadMat);
  roadB.rotation.x=-Math.PI/2; roadB.position.set(0,0.016,i*35); world.add(roadB);
  for(let k=-5;k<=5;k++){
    const dash=new THREE.Mesh(new THREE.PlaneGeometry(.22,4),mat(0xd5c99d));
    dash.rotation.x=-Math.PI/2; dash.position.set(i*35,0.03,k*18); world.add(dash);
    const dash2=new THREE.Mesh(new THREE.PlaneGeometry(4,.22),mat(0xd5c99d));
    dash2.rotation.x=-Math.PI/2; dash2.position.set(k*18,0.03,i*35); world.add(dash2);
  }
}

// Procedural Jhansi blocks. The map is a compressed fictionalized city, not a survey map.
const boxGeo=new THREE.BoxGeometry(1,1,1);
const landmarkCells = new Set(['-2,-2','2,-2','-2,2','2,2']);
for(let x=-4;x<=4;x++) for(let z=-4;z<=4;z++){
  if(landmarkCells.has(`${x},${z}`)) continue;
  if(Math.abs(x)%1===0 && Math.abs(z)%1===0 && (x===0||z===0)) continue;
  const h=8+((Math.abs(x*13+z*7)%5)*3.1);
  const b=new THREE.Mesh(boxGeo,buildingMats[Math.abs(x*3+z*5)%buildingMats.length]);
  b.scale.set(18,h,18); b.position.set(x*35, h/2, z*35);
  b.castShadow=true; b.receiveShadow=true; world.add(b);
  // warm window bands
  const windows=new THREE.Mesh(new THREE.BoxGeometry(18.08,.18,18.08),mat(0xc89b58,.45));
  windows.scale.set(1,1,1); windows.position.set(b.position.x,h*.58,b.position.z); world.add(windows);
}

// Jhansi-inspired landmark silhouettes. These are stylized game set-pieces.
const stone=mat(0x887d6a), sandstone=mat(0xb49a78), roofMat=mat(0x5b3b2d), waterMat=new THREE.MeshStandardMaterial({color:0x356a79,roughness:.35,metalness:.1});
function landmarkBox(parent,w,h,d,color,x,y,z){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),color);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function labelSprite(text,x,z){
  const c=document.createElement('canvas');c.width=512;c.height=128;const ctx=c.getContext('2d');
  ctx.fillStyle='rgba(7,11,17,.82)';ctx.fillRect(8,8,496,112);ctx.strokeStyle='#d7a64b';ctx.lineWidth=5;ctx.strokeRect(8,8,496,112);
  ctx.fillStyle='#fff0d2';ctx.font='bold 42px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,256,65);
  const tex=new THREE.CanvasTexture(c);const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true}));sp.position.set(x,15,z);sp.scale.set(18,4.5,1);world.add(sp);
}
// Jhansi Fort: a low-poly stone fort mass on the Bangra-hill side of the map.
{
 const g=new THREE.Group();g.position.set(-70,0,-70);world.add(g);
 const hill=new THREE.Mesh(new THREE.CylinderGeometry(18,22,5,8),mat(0x6a6254));hill.position.y=2.5;hill.receiveShadow=true;g.add(hill);
 landmarkBox(g,27,10,24,stone,0,9,0);landmarkBox(g,33,2,30,sandstone,0,4,0);
 for(const [x,z] of [[-15,-13],[15,-13],[-15,13],[15,13]]){const t=new THREE.Mesh(new THREE.CylinderGeometry(3.4,4,13,8),stone);t.position.set(x,10,z);t.castShadow=true;g.add(t);const cap=new THREE.Mesh(new THREE.ConeGeometry(3.8,3,8),roofMat);cap.position.set(x,18,z);g.add(cap);}
 labelSprite('JHANSI FORT',-70,-70);
}
// Rani Mahal-inspired old-city palace silhouette (fictionalized exterior).
{
 const g=new THREE.Group();g.position.set(70,0,-70);world.add(g);
 landmarkBox(g,25,9,20,sandstone,0,5,0);landmarkBox(g,27,1.2,22,roofMat,0,10,0);
 for(let x=-9;x<=9;x+=6){const col=new THREE.Mesh(new THREE.CylinderGeometry(.7,.9,8,8),stone);col.position.set(x,5,11);g.add(col);}
 for(const [x,z] of [[-9,-7],[0,-7],[9,-7],[-9,7],[0,7],[9,7]]){const d=new THREE.Mesh(new THREE.SphereGeometry(2.1,8,6),sandstone);d.scale.y=.65;d.position.set(x,11,z);g.add(d);}
 labelSprite('RANI MAHAL AREA',70,-70);
}
// Railway/freight belt: invented platforms and sheds, not a replica of station buildings.
{
 const g=new THREE.Group();g.position.set(-70,0,70);world.add(g);
 landmarkBox(g,34,1,18,mat(0x8c8b84),0,.5,0);landmarkBox(g,34,1,18,mat(0x77756f),0,.5,11);
 landmarkBox(g,32,.8,15,roofMat,0,8,5);
 for(let x=-14;x<=14;x+=14){const p=new THREE.Mesh(new THREE.CylinderGeometry(.25,.25,8,6),stone);p.position.set(x,4,5);g.add(p);}
 for(let z=-5;z<=12;z+=8){const rail=new THREE.Mesh(new THREE.BoxGeometry(38,.15,.18),mat(0x33383d));rail.position.set(0,.2,z);g.add(rail);}
 labelSprite('RAIL & FREIGHT BELT',-70,70);
}
// Laxmi Tal-inspired water edge and outer-city green.
{
 const g=new THREE.Group();g.position.set(70,0,70);world.add(g);
 const lake=new THREE.Mesh(new THREE.CircleGeometry(17,32),waterMat);lake.rotation.x=-Math.PI/2;lake.position.y=.08;g.add(lake);
 for(let i=0;i<10;i++){const a=i*Math.PI*2/10;const tree=new THREE.Group();const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.35,.5,3,6),mat(0x59422e));trunk.position.y=1.5;tree.add(trunk);const crown=new THREE.Mesh(new THREE.SphereGeometry(1.8,7,6),mat(0x526d48));crown.position.y=3.8;tree.add(crown);tree.position.set(Math.cos(a)*21,0,Math.sin(a)*21);g.add(tree);}
 labelSprite('LAXMI TAL EDGE',70,70);
}

// Street lamps.
for(let x=-4;x<=4;x++) for(let z=-4;z<=4;z++){
  if(x===0||z===0) continue;
  const pole=new THREE.Mesh(new THREE.CylinderGeometry(.12,.16,5,8),mat(0x333941));
  pole.position.set(x*35+11,2.5,z*35+11); pole.castShadow=true; world.add(pole);
  const bulb=new THREE.Mesh(new THREE.SphereGeometry(.28,8,8),new THREE.MeshBasicMaterial({color:0xffd38a}));
  bulb.position.set(x*35+11,5.1,z*35+11); world.add(bulb);
}

// Player: stylized placeholder body; replace with licensed/custom character model later.
const player=new THREE.Group(); scene.add(player);
const body=new THREE.Mesh(new THREE.CapsuleGeometry(.48,.95,4,8),mat(0x171b22));
body.position.y=1.15; body.castShadow=true; player.add(body);
const head=new THREE.Mesh(new THREE.SphereGeometry(.32,12,10),mat(0xb98a69));
head.position.y=2.05; head.castShadow=true; player.add(head);
const coat=new THREE.Mesh(new THREE.BoxGeometry(.95,.65,.25),mat(0x292d35));
coat.position.set(0,1.25,-.18); player.add(coat);
player.position.set(0,0,4);

// Car: simple arcade handling, not a final simulation.
const car=new THREE.Group(); scene.add(car);
const chassis=new THREE.Mesh(new THREE.BoxGeometry(2.2,.75,4.2),mat(0x8e2424,.35));
chassis.position.y=.85; chassis.castShadow=true; car.add(chassis);
const cabin=new THREE.Mesh(new THREE.BoxGeometry(1.65,.8,2.0),mat(0x24313c,.25));
cabin.position.set(0,1.55,-.25); cabin.castShadow=true; car.add(cabin);
const wheelGeo=new THREE.CylinderGeometry(.42,.42,.28,12);
for(const x of [-1.08,1.08]) for(const z of [-1.35,1.35]){
  const w=new THREE.Mesh(wheelGeo,mat(0x111316)); w.rotation.z=Math.PI/2; w.position.set(x,.48,z); car.add(w);
}
car.position.set(4,0,4);

const keys={}; addEventListener('keydown',e=>keys[e.key.toLowerCase()]=true);
addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
let move={x:0,y:0}, gas=false, brake=false, jumping=0, inCar=false, speed=0, steer=0;
const toastEl=document.querySelector('#toast');
const areaEl=document.querySelector('#mission-hint');
let lastArea='';
function updateArea(pos){
  const areas=[['Jhansi Fort skyline',-70,-70],['Rani Mahal / Old City',70,-70],['Railway & Freight Belt',-70,70],['Laxmi Tal outskirts',70,70],['Central Jhansi streets',0,0]];
  let best=areas[0],dist=Infinity;for(const a of areas){const d=(pos.x-a[1])**2+(pos.z-a[2])**2;if(d<dist){dist=d;best=a;}}
  if(best[0]!==lastArea){lastArea=best[0];areaEl.textContent=`${best[0]} · Explore and find your first lead.`;}
}
function toast(s){toastEl.textContent=s;toastEl.classList.add('show');clearTimeout(toastEl._t);toastEl._t=setTimeout(()=>toastEl.classList.remove('show'),2400)}
const stickZone=document.querySelector('#stick-zone'), knob=document.querySelector('#stick-knob');
let stickPointer=null;
stickZone.addEventListener('pointerdown',e=>{stickPointer=e.pointerId;stickZone.setPointerCapture(e.pointerId);updateStick(e)});
stickZone.addEventListener('pointermove',e=>{if(e.pointerId===stickPointer)updateStick(e)});
function updateStick(e){const r=stickZone.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;let dx=e.clientX-cx,dy=e.clientY-cy;const m=Math.hypot(dx,dy),max=43;if(m>max){dx=dx/m*max;dy=dy/m*max}move.x=dx/max;move.y=-dy/max;knob.style.transform=`translate(${dx}px,${dy}px)`}
function resetStick(){stickPointer=null;move={x:0,y:0};knob.style.transform='translate(0,0)'}
stickZone.addEventListener('pointerup',resetStick);stickZone.addEventListener('pointercancel',resetStick);
function holdButton(id,setter){const el=document.querySelector(id);el.addEventListener('pointerdown',e=>{e.preventDefault();setter(true)});['pointerup','pointercancel','pointerleave'].forEach(ev=>el.addEventListener(ev,()=>setter(false)))}
holdButton('#accelerate',v=>gas=v); holdButton('#brake',v=>brake=v);
document.querySelector('#jump').addEventListener('click',()=>{if(!inCar)jumping=.22});
document.querySelector('#enter').addEventListener('click',toggleCar);
function toggleCar(){
  if(!inCar && player.position.distanceTo(car.position)<5){inCar=true;player.visible=false;toast('Robin entered the vehicle. Jhansi roads ahead.')}
  else if(inCar){inCar=false;player.visible=true;player.position.copy(car.position).add(new THREE.Vector3(2,0,0));toast('Robin exited the vehicle.')}
  else toast('Move closer to the car to enter.');
}
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function update(dt){
  const ix=move.x+(keys['d']?1:0)-(keys['a']?1:0);
  const iy=move.y+(keys['w']?1:0)-(keys['s']?1:0);
  if(keys['e']){keys['e']=false;toggleCar()}
  if(keys[' ']&&!inCar){jumping=.22;keys[' ']=false}
  if(inCar){
    if(gas||keys['w'])speed=Math.min(speed+dt*12,22);
    if(brake||keys['s'])speed=Math.max(speed-dt*22,-5);
    if(!gas&&!brake&&!keys['w']&&!keys['s'])speed*=Math.pow(.94,dt*60);
    steer=THREE.MathUtils.damp(steer,ix,7,dt);
    car.rotation.y-=steer*speed*dt*.055;
    car.position.x+=Math.sin(car.rotation.y)*speed*dt;
    car.position.z+=Math.cos(car.rotation.y)*speed*dt;
    car.position.x=clamp(car.position.x,-100,100);car.position.z=clamp(car.position.z,-100,100);
    document.querySelector('#mode').textContent='IN VEHICLE';
  }else{
    const forward=new THREE.Vector3(Math.sin(camera.rotation.y),0,Math.cos(camera.rotation.y));
    const right=new THREE.Vector3(forward.z,0,-forward.x);
    const dir=forward.multiplyScalar(iy).add(right.multiplyScalar(ix));
    if(dir.lengthSq()>1)dir.normalize();
    const sprint=keys['shift']?1.65:1;
    player.position.addScaledVector(dir,dt*7*sprint);
    if(dir.lengthSq()>.01)player.rotation.y=Math.atan2(dir.x,dir.z);
    if(jumping>0){player.position.y+=jumping*dt*30;jumping-=dt;if(jumping<=0)player.position.y=0}
    player.position.x=clamp(player.position.x,-100,100);player.position.z=clamp(player.position.z,-100,100);
    document.querySelector('#mode').textContent='ON FOOT';
  }
  const target=inCar?car.position:player.position;
  updateArea(target);
  const yaw=inCar?car.rotation.y:player.rotation.y;
  const desired=new THREE.Vector3(target.x-Math.sin(yaw)*8, target.y+5.2, target.z-Math.cos(yaw)*8);
  camera.position.lerp(desired,1-Math.exp(-dt*4));
  camera.lookAt(target.x,target.y+1.2,target.z);
  document.querySelector('#enter').textContent=inCar?'EXIT':'ENTER';
}
let last=performance.now();
function loop(now){requestAnimationFrame(loop);const dt=Math.min((now-last)/1000,.04);last=now;update(dt);renderer.render(scene,camera)}
requestAnimationFrame(loop);
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.6))});
document.querySelector('#start').addEventListener('click',()=>{document.querySelector('#start-screen').style.display='none';toast('Jhansi mein Robin ka khel shuru hota hai.');});
