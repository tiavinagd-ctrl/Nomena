import * as T from './lib/three.module.js';
import {RoomEnvironment} from './lib/RoomEnvironment.js';

const C={navy:'#0B1030',violet:'#5643E9',blue:'#3478F6',mint:'#37DDC3',white:'#F7F9FF'};
const clamp=x=>Math.max(0,Math.min(1,x));
const ease=x=>{x=clamp(x);return x*x*(3-2*x)};
const categories=['Streaming','Intelligence artificielle','Création','Logiciels','Formation'];
function rounded(w,h,r){const s=new T.Shape(),x=-w/2,y=-h/2;s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s}
function plate(w,h,r,d,mat){const g=new T.ExtrudeGeometry(rounded(w,h,r),{depth:d,bevelEnabled:true,bevelSize:.025,bevelThickness:.025,bevelSegments:3,curveSegments:18,steps:1});g.translate(0,0,-d/2);return new T.Mesh(g,mat)}
function ctx(){const c=document.createElement('canvas');c.width=700;c.height=1300;return[c,c.getContext('2d')]}
function rect(c,x,y,w,h,r,color){c.fillStyle=color;c.beginPath();c.roundRect(x,y,w,h,r);c.fill()}
function txt(c,s,x,y,size=34,color=C.white,weight=500){c.fillStyle=color;c.font=`${weight} ${size}px Inter`;c.fillText(s,x,y)}
function icon(c,x,y,k,color=C.mint){c.strokeStyle=color;c.fillStyle=color;c.lineWidth=5;c.save();c.translate(x,y);if(k===0){c.beginPath();c.moveTo(-12,-20);c.lineTo(22,0);c.lineTo(-12,20);c.closePath();c.fill()}else if(k===1){for(let j=0;j<4;j++){c.rotate(Math.PI/2);c.beginPath();c.moveTo(0,-28);c.quadraticCurveTo(0,0,28,0);c.stroke()}}else if(k===2){c.strokeRect(-22,-22,44,44);c.beginPath();c.arc(12,-12,20,0,Math.PI*2);c.stroke()}else if(k===3){c.beginPath();c.moveTo(-10,-22);c.lineTo(-30,0);c.lineTo(-10,22);c.moveTo(10,-22);c.lineTo(30,0);c.lineTo(10,22);c.stroke()}else{c.beginPath();c.moveTo(-32,-10);c.lineTo(0,-25);c.lineTo(32,-10);c.lineTo(0,8);c.closePath();c.stroke();c.beginPath();c.moveTo(-22,3);c.lineTo(-22,20);c.quadraticCurveTo(0,35,22,20);c.lineTo(22,3);c.stroke()}c.restore()}

export function createStage(canvas,sceneIndex){
 const renderer=new T.WebGLRenderer({canvas,alpha:true,antialias:true,preserveDrawingBuffer:true,powerPreference:'high-performance'});
 renderer.setSize(1080,1920,false);renderer.setPixelRatio(1);renderer.setClearColor(0,0);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;
 const scene=new T.Scene();const camera=new T.PerspectiveCamera(34,1080/1920,.1,80);camera.position.set(0,0,22);
 const pmrem=new T.PMREMGenerator(renderer),room=new RoomEnvironment(),env=pmrem.fromScene(room,.04);scene.environment=env.texture;
 scene.add(new T.HemisphereLight(0xffffff,0x182657,2));const key=new T.DirectionalLight(0xffffff,3);key.position.set(-5,6,8);scene.add(key);const fill=new T.DirectionalLight(0x37ddc3,2.3);fill.position.set(5,1,2);scene.add(fill);const rim=new T.DirectionalLight(0x5643e9,3);rim.position.set(-3,-3,1);scene.add(rim);
 const metal=new T.MeshPhysicalMaterial({color:'#8791aa',metalness:.92,roughness:.22,clearcoat:1});const black=new T.MeshPhysicalMaterial({color:'#060916',metalness:.5,roughness:.2,clearcoat:1});const white=new T.MeshPhysicalMaterial({color:'#dce4f8',metalness:.65,roughness:.22});
 const root=new T.Group();scene.add(root);const screens=[];
 function device(kind){const g=new T.Group(),phone=kind==='phone',tablet=kind==='tablet';let w=phone?2.4:tablet?3.5:5.5,h=phone?4.9:tablet?4.8:3.35;const body=plate(w,h,phone?.28:.13,.16,metal);g.add(body);const bezel=plate(w-.08,h-.08,phone?.24:.10,.025,black);bezel.position.z=.104;g.add(bezel);
 const [c,c2]=ctx();if(!phone&&!tablet){c.width=1400;c.height=850}const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;tex.anisotropy=4;
 const geo=new T.ShapeGeometry(rounded(w-.20,h-.22,phone?.19:.06),18);let uv=geo.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)/(w-.20)+.5,uv.getY(i)/(h-.22)+.5);
 const screen=new T.Mesh(geo,new T.MeshBasicMaterial({map:tex,toneMapped:false}));screen.position.z=.175;g.add(screen);screens.push({ctx:c2,tex,kind});
 if(phone){const notch=plate(.66,.12,.05,.016,black);notch.position.set(0,h/2-.20,.15);g.add(notch);const button=plate(.05,.5,.02,.06,metal);button.position.set(w/2+.02,.7,0);g.add(button)}
 if(kind==='laptop'){const base=plate(w+.3,3.2,.12,.12,white);base.rotation.x=-Math.PI/2;base.position.set(0,-h/2-.03,1.45);g.add(base);const keys=new T.Group();for(let y=0;y<5;y++)for(let x=0;x<13;x++){const k=new T.Mesh(new T.BoxGeometry(.31,.025,.23),black);k.position.set((x-6)*.38,-h/2+.055,.4+y*.3);keys.add(k)}g.add(keys);const pad=new T.Mesh(new T.BoxGeometry(1.8,.015,.7),metal);pad.position.set(0,-h/2+.05,2.3);g.add(pad)}
 if(kind==='tv'){const stand=new T.Mesh(new T.CylinderGeometry(.07,.1,.85,16),metal);stand.position.y=-h/2-.4;g.add(stand);const foot=plate(2,.7,.15,.10,black);foot.rotation.x=-Math.PI/2;foot.position.set(0,-h/2-.82,0);g.add(foot)}
 return g;
 }
 const devices=[];let pedestal;
 if(sceneIndex===0){const a=device('laptop');a.position.set(-.5,-.9,-.2);a.rotation.set(.07,.12,0);a.scale.setScalar(.82);root.add(a);devices.push(a);const b=device('phone');b.position.set(1.6,-.75,1.5);b.rotation.set(-.08,-.28,-.09);b.scale.setScalar(.73);root.add(b);devices.push(b);
 pedestal=new T.Mesh(new T.CylinderGeometry(4,4,.16,80),new T.MeshStandardMaterial({color:'#d6dcef',metalness:.15,roughness:.4}));pedestal.position.set(0,-2.8,0);root.add(pedestal);
 }else if(sceneIndex===2){['tv','laptop','tablet','laptop','phone'].forEach(k=>{const d=device(k);d.position.y=-.3;root.add(d);devices.push(d)})}
 else if(sceneIndex===3||sceneIndex===4){const d=device('phone');root.add(d);devices.push(d);d.scale.setScalar(sceneIndex===3?1.22:1.05);d.position.set(sceneIndex===4?1.15:0,-.6,0)}
 const rings=[];if(sceneIndex===1||sceneIndex===5){for(let i=0;i<2;i++){const m=new T.Mesh(new T.TorusGeometry(3.3+i*.45,.009,8,110),new T.MeshBasicMaterial({color:i?C.violet:C.mint,transparent:true,opacity:.4}));m.rotation.set(1.2,.2,i*.4);m.position.set(0,.25,-1);root.add(m);rings.push(m)}}
 const cards=[];if(sceneIndex===0){for(let i=0;i<2;i++){const [c,c2]=ctx();c.width=540;c.height=230;rect(c2,0,0,540,230,26,'#111936');rect(c2,24,30,100,100,25,['#5643E9','#3478F6','#146d6b','#392c79'][i]);icon(c2,74,80,i);txt(c2,categories[i],145,80,28);txt(c2,'Votre univers numérique',145,125,20,'#a3b4d4');rect(c2,145,155,200,7,4,'#3478F6');const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;const mesh=new T.Mesh(new T.PlaneGeometry(2.65,1.12),new T.MeshBasicMaterial({map:texture,transparent:true}));root.add(mesh);cards.push(mesh)}}
 function drawScreen(s,t,category=0){const c=s.ctx;
 if(s.kind==='laptop'||s.kind==='tv'){
 c.fillStyle=C.navy;c.fillRect(0,0,1400,850);txt(c,'ABONIVO',60,90,44,C.white,750);txt(c,categories[category].toUpperCase(),60,155,29,C.mint,700);
 rect(c,60,205,1280,490,35,'#18264a');
 const gradient=c.createLinearGradient(550,220,1250,650);gradient.addColorStop(0,C.blue);gradient.addColorStop(.5,C.violet);gradient.addColorStop(1,C.mint);c.fillStyle=gradient;c.beginPath();c.roundRect(580,240,710,420,28);c.fill();
 c.save();c.translate(935,450);c.rotate(t*.14);for(let j=0;j<5;j++){c.strokeStyle='#f7f9ff';c.globalAlpha=.15+j*.12;c.lineWidth=9;c.beginPath();c.ellipse(0,0,65+j*30,125+j*12,.4+j*.15,0,Math.PI*2);c.stroke()}c.restore();
 icon(c,135,300,category);txt(c,['Votre prochaine','Une nouvelle','Donnez vie','De nouveaux','Apprendre'][category],100,410,43,C.white,650);txt(c,['découverte.','inspiration.','à vos idées.','possibles.','à votre rythme.'][category],100,475,43,C.white,650);rect(c,100,540,360,70,20,C.violet);txt(c,'Explorer',185,585,28,C.white,650);
 for(let j=0;j<4;j++){rect(c,60+j*325,735,300,60,20,'#263355');txt(c,['Découvrir','Vos univers','Favoris','Contact'][j],88+j*325,775,25)}s.tex.needsUpdate=true;return;
 }
const W=700,H=1300;c.clearRect(0,0,W,H);const grad=c.createLinearGradient(0,0,700,1300);grad.addColorStop(0,'#172247');grad.addColorStop(1,'#080e28');c.fillStyle=grad;c.fillRect(0,0,W,H);
 if(sceneIndex===3||sceneIndex===4){txt(c,'9:41',42,48,24);txt(c,'•••',595,48,24);txt(c,'ABONIVO',40,145,43,C.white,800);txt(c,'À chaque envie, son univers.',40,204,28,'#aabbd9');rect(c,38,245,624,78,25,'#263253');txt(c,'Rechercher un service',70,294,26,'#b8c8e4');
 const scroll=sceneIndex===3?ease((t-1)/3.1)*410:250;c.save();c.beginPath();c.rect(0,350,700,900);c.clip();for(let i=0;i<5;i++){const y=365+i*218-scroll;rect(c,38,y,624,190,25,'#192849');rect(c,64,y+28,118,118,24,[C.violet,C.blue,'#157777','#40367f','#1c526b'][i]);icon(c,123,y+87,i);txt(c,categories[i],205,y+72,27,C.white,650);txt(c,'Explorer les offres',205,y+121,23,'#b8c8e4');txt(c,'→',602,y+111,35,C.mint)}c.restore();rect(c,0,1190,700,110,0,'#101832');txt(c,'Explorer      Favoris      Contact',55,1255,26);if(sceneIndex===3&&t>3.4){const a=ease((t-3.4)/.5);c.globalAlpha=a;rect(c,30,720,640,410,35,'#f7f9ff');txt(c,'Création',65,795,39,C.navy,750);txt(c,'Donnez vie à vos idées.',65,850,29,C.navy);rect(c,65,925,570,100,25,C.violet);txt(c,'Découvrir cette catégorie',100,989,29,C.white,650);c.globalAlpha=1;}}
 else {const k=category;txt(c,'ABONIVO',42,83,35,C.white,750);txt(c,categories[k].toUpperCase(),42,171,k===1?27:38,C.mint,700);const g=c.createRadialGradient(350,590,20,350,590,440);g.addColorStop(0,k%2?'#5643e9':'#3478f6');g.addColorStop(.65,'#142450');g.addColorStop(1,'#0b1030');c.fillStyle=g;c.fillRect(28,230,644,660);c.save();c.translate(350,540);c.rotate(t*.08);for(let j=0;j<5;j++){c.strokeStyle=j%2?'#37ddc3':'#7874ff';c.lineWidth=8-j;c.beginPath();c.ellipse(0,0,80+j*33,150+j*40,.6+j*.2,0,Math.PI*2);c.stroke()}c.restore();rect(c,45,955,610,115,28,'#263355');txt(c,'Explorez votre univers',75,1027,32,C.white,650);for(let i=0;i<3;i++)rect(c,45+i*210,1120,190,90,20,['#5643e9','#3478f6','#218c80'][i]);}
 s.tex.needsUpdate=true;
 }
 function setTime(t){root.rotation.y=Math.sin(t*.5)*.025;camera.position.x=Math.sin(t*.32)*.14;camera.position.z=22-(sceneIndex===0?ease(t/4)*.45:0);camera.lookAt(0,0,0);
 let cat=sceneIndex===2?Math.min(4,Math.floor(t/1.2)):0;
 devices.forEach((d,i)=>{if(sceneIndex===2){const u=t/1.2-i;d.visible=u>=-.15&&u<1.13;d.position.x=(1-ease(u/.22))*5-ease((u-.88)/.24)*5;d.position.y=-.65+Math.sin(t*.9)*.08;d.rotation.set(.04,Math.sin(t*.6)*.22,-.035);d.scale.setScalar(i===4?1.18:.92)}else if(sceneIndex===3){d.rotation.set(-.035,Math.sin(t*.55)*.25,-.05+Math.sin(t*.45)*.025);d.position.y=-.45+Math.sin(t*.8)*.08}else if(sceneIndex===4){d.rotation.set(.02,-.32+Math.sin(t)*.07,.1);d.position.y=-.3+Math.sin(t*.8)*.09}else{d.position.y+=0;d.rotation.y=(i?-.28:.12)+Math.sin(t*.7)*.045}});
 screens.forEach((s,i)=>drawScreen(s,t,sceneIndex===2?i:cat));
 cards.forEach((c,i)=>{const enter=ease((t-i*.16)/.5);const poses=[[-1.6,2.2],[1.4,1.1],[-1.8,-2.8],[1.15,-3.5]];c.position.set(poses[i][0],poses[i][1]+Math.sin(t+i)*.10+(1-enter)*.5,2+i*.08);c.rotation.set(-.03,Math.sin(t*.4+i)*.12,(i%2?1:-1)*.06);c.scale.setScalar(enter*.86)});rings.forEach((r,i)=>{r.rotation.z=t*.04+i*.4;r.rotation.y=.2+Math.sin(t*.3)*.1});renderer.render(scene,camera);
 }
 return {setTime,dispose(){scene.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){const list=Array.isArray(o.material)?o.material:[o.material];list.forEach(m=>{if(m.map)m.map.dispose();m.dispose()})}});env.dispose();pmrem.dispose();room.dispose();renderer.dispose()}};
}
