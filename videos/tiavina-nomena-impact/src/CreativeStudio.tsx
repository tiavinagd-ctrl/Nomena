import React from 'react';
import {Img, staticFile} from 'remotion';

const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const ease=(v:number)=>1-Math.pow(1-clamp(v),4);
const BLUE='#1246ff';
type Mode='model'|'edit'|'motion'|'grade';

export const SoftwareBadge:React.FC<{kind:'blender'|'resolve';small?:boolean}>=({kind,small=false})=><div style={{display:'flex',alignItems:'center',gap:small?8:16,color:'#f4f5f1',fontFamily:'Inter',fontSize:small?17:30,fontWeight:650}}>
  <span style={{display:'flex',alignItems:'center',justifyContent:'center',width:small?24:46,height:small?24:46,borderRadius:small?6:11,background:kind==='blender'?'#ea7607':'#242937',boxShadow:'inset 0 0 0 1px #ffffff22',fontSize:small?18:30}}>
    {kind==='blender'?'B':<svg width={small?19:35} height={small?19:35} viewBox="0 0 40 40"><circle cx="20" cy="11" r="8" fill="#5dc5f6"/><circle cx="11" cy="27" r="8" fill="#f6c84c"/><circle cx="29" cy="27" r="8" fill="#f76e82"/></svg>}
  </span><span>{kind==='blender'?'Blender':'DaVinci Resolve'}</span>
</div>;

// A real parametric surface, projected into SVG at each requested frame.
// The interfaces around it are illustrative, not screen recordings.
const Torus:React.FC<{frame:number;wire?:number}>=({frame,wire=0})=>{
 const n=32,m=12,angle=frame*.018;
 const points=Array.from({length:n},(_,i)=>Array.from({length:m},(_,j)=>{
  const u=i/n*Math.PI*2,v=j/m*Math.PI*2;
  const x=(1.2+.42*Math.cos(v))*Math.cos(u), y=(1.2+.42*Math.cos(v))*Math.sin(u),z=.42*Math.sin(v);
  const xx=x*Math.cos(angle)+z*Math.sin(angle),zz=-x*Math.sin(angle)+z*Math.cos(angle);
  const yy=y*Math.cos(.9)-zz*Math.sin(.9),depth=y*Math.sin(.9)+zz*Math.cos(.9);
  const k=4.6/(4.6-depth);
  return {x:320+xx*116*k,y:210+yy*116*k,z:depth};
 }));
 const faces=[];
 for(let i=0;i<n;i++)for(let j=0;j<m;j++){
  const ps=[points[i][j],points[(i+1)%n][j],points[(i+1)%n][(j+1)%m],points[i][(j+1)%m]];
  faces.push({key:`${i}-${j}`,z:ps.reduce((s,p)=>s+p.z,0)/4,points:ps.map(p=>`${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' '),light:34+Math.round(27*(.5+.5*Math.sin(i/n*Math.PI*2+angle-.8))*Math.max(.25,Math.cos(j/m*Math.PI*2)))});
 }
 faces.sort((a,b)=>a.z-b.z);
 return <svg viewBox="0 0 640 420" style={{width:'100%',height:'100%'}}>
  <defs><radialGradient id="view-bg"><stop stopColor="#3c424e"/><stop offset="1" stopColor="#20252e"/></radialGradient></defs>
  <rect width="640" height="420" fill="url(#view-bg)"/>
  <g stroke="#ffffff12" strokeWidth="1">{Array.from({length:13},(_,i)=><React.Fragment key={i}><path d={`M ${i*70-110} 420 L ${320+(i-6)*12} 160`}/><path d={`M 0 ${210+i*21} L 640 ${210+i*21}`}/></React.Fragment>)}</g>
  <path d="M 0 345 L 640 345" stroke="#a4474b" strokeWidth="1"/><path d="M 320 160 L 320 420" stroke="#4e845d" strokeWidth="1"/>
  <ellipse cx="324" cy="361" rx="159" ry="26" fill="#050910" opacity=".25"/>
  {faces.map(q=><polygon key={q.key} points={q.points} fill={`hsl(222,90%,${q.light}%)`} fillOpacity={1-wire*.8} stroke={wire>.25?'#ee974c':'#7eafff'} strokeOpacity={wire>.25?.65:.16} strokeWidth={wire>.25?.8:.4}/>)}
  <g transform="translate(586 42)" fontFamily="Inter" fontSize="12" fontWeight="700"><path d="M 0 0 L 24 9 M 0 0 L -16 17 M 0 0 L 0 -23" stroke="#ffffff60"/><circle cx="24" cy="9" r="9" fill="#cb5555"/><text x="20" y="13" fill="white">X</text><circle cx="-16" cy="17" r="9" fill="#57a16f"/><text x="-20" y="21" fill="white">Y</text><circle cx="0" cy="-23" r="9" fill="#558bd1"/><text x="-4" y="-19" fill="white">Z</text></g>
 </svg>;
};

const Cursor:React.FC<{x:number;y:number;click?:boolean}>=({x,y,click})=><svg style={{position:'absolute',left:x,top:y,width:38,height:48,filter:'drop-shadow(0 2px 3px #0009)',zIndex:5}} viewBox="0 0 38 48"><path d="M 2 2 L 3 37 L 13 29 L 22 46 L 29 42 L 20 26 L 34 25 Z" fill="white" stroke="#151922" strokeWidth="2"/>{click&&<circle cx="4" cy="5" r="16" stroke="#79d5ff" fill="none" strokeWidth="2"/>}</svg>;

export const StudioPanel:React.FC<{mode:Mode;frame:number}>=({mode,frame})=>{
 const blender=mode==='model'||mode==='motion', motion=mode==='motion';
 const progress=(frame%120)/120;
 const wave=Array.from({length:70},(_,i)=>Math.abs(Math.sin(i*3.17)*Math.cos(i*.43)));
 return <div style={{width:960,height:650,background:'#171a21',color:'#cbd1dd',fontFamily:'Inter',fontSize:13,overflow:'hidden',border:'1px solid #ffffff28',borderRadius:12,boxSizing:'border-box'}}>
  <div style={{height:49,display:'flex',alignItems:'center',padding:'0 18px',gap:22,borderBottom:'1px solid #414550',background:'#242833'}}><SoftwareBadge kind={blender?'blender':'resolve'} small/><span style={{color:'#999faf',fontSize:12,flex:1}}>{blender?'FORM_01.blend':'COASTLINE / EDIT 01'}</span><span style={{letterSpacing:4,color:'#9fa8b9'}}>− □ ×</span></div>
  <div style={{height:28,display:'flex',gap:22,alignItems:'center',padding:'0 16px',fontSize:11,background:'#20242c'}}>{(blender?['File','Edit','Render','Layout','Modeling','Animation']:['File','Edit','Timeline','Clip','Playback','Color']).map(x=><span key={x} style={{color:(motion&&x==='Animation')||(!blender&&x==='Color'&&mode==='grade')?'#77bcff':undefined}}>{x}</span>)}</div>
  <div style={{height:391,display:'flex',position:'relative'}}>
    <aside style={{width:blender?40:138,background:'#20242d',borderRight:'1px solid #393e49',padding:blender?'15px 7px':'12px 9px',boxSizing:'border-box',flexShrink:0}}>
      {blender?['↖','＋','⟳','↔','▧','◇'].map((x,i)=><div key={i} style={{fontSize:24,height:44,color:i===2?'#80b8ff':'#aaaeb8'}}>{x}</div>):<><div style={{fontSize:11,marginBottom:12}}>MEDIA POOL</div>{['coast-project.png','product-project.png'].map((x,i)=><div key={x} style={{marginBottom:13}}><Img src={staticFile(x)} style={{width:120,height:69,objectFit:'cover',border:i===0?'1px solid #e97555':'1px solid #50596b'}}/><div style={{fontSize:10,marginTop:4}}>{i===0?'COAST_01.mov':'STUDIO_RENDER.png'}</div></div>)}<div style={{height:40,background:'#1d514b',fontSize:10,padding:8}}>▥ ORIGINAL SCORE.wav</div></>}
    </aside>
    <main style={{flex:1,position:'relative',overflow:'hidden',background:'#13161c'}}>
      {blender?<>
        <Torus frame={frame} wire={motion?.08:1-ease((frame%120)/70)}/>
        <div style={{position:'absolute',left:12,top:10,fontSize:10,color:'#c1c8d7'}}>User Perspective<br/><span style={{color:'#e39956'}}>Collection | FORM_01</span></div>
        {motion&&<div style={{position:'absolute',left:60,top:215,fontFamily:'Anton',fontSize:84,color:'#fff',transform:`translateX(${30*Math.sin(frame/14)}px) rotate(-7deg)`,textShadow:'0 3px 20px #06122c'}}>CREATE</div>}
      </>:<>
        <Img src={staticFile('coast-project.png')} style={{width:'100%',height:'100%',objectFit:'cover',transform:`scale(${1.02+progress*.07}) translateX(${-progress*16}px)`,filter:mode==='grade'?`saturate(${.72+ease((frame%50)/30)*.38}) contrast(1.08)`:'none'}}/>
        <div style={{position:'absolute',bottom:12,left:12,fontFamily:'monospace',fontSize:15,background:'#070b1499',padding:'4px 7px'}}>00:00:{String(12+Math.floor(progress*8)).padStart(2,'0')}:{String(frame%30).padStart(2,'0')}</div>
        <div style={{position:'absolute',right:12,top:12,fontSize:11,background:'#070b1499',padding:'4px 7px'}}>1920 × 1080</div>
        {mode==='grade'&&<div style={{position:'absolute',left:`${30+30*Math.sin(frame/60)}%`,top:0,bottom:0,width:2,background:'#e2e7f2',boxShadow:'0 0 5px #111'}}/>}
      </>}
    </main>
    <aside style={{width:blender?167:151,background:'#242833',borderLeft:'1px solid #3f4653',boxSizing:'border-box',padding:12,fontSize:10,flexShrink:0}}>
      {blender?<><div style={{marginBottom:16}}>SCENE COLLECTION</div>{['▧ Camera','☀ Key light','◇ FORM_01'].map((x,i)=><div key={x} style={{padding:'7px 3px',background:i===2?'#355071':'transparent',marginBottom:3}}>{x}</div>)}<div style={{marginTop:26,marginBottom:14}}>TRANSFORM</div>{['Location','Rotation','Scale'].map((name,i)=><div key={name} style={{marginBottom:14}}>{name}<div style={{background:'#171b23',padding:7,marginTop:5,color:'#aebad0'}}>{i===1?`${(frame*.6).toFixed(1)}°`:i===2?'1.000':'0.000 m'}</div></div>)}</>:<><div style={{marginBottom:18}}>INSPECTOR</div>{['Transform','Zoom','Position','Rotation','Color'].map((n,i)=><div key={n} style={{borderBottom:'1px solid #ffffff13',padding:'12px 0'}}>{n}<div style={{height:3,background:'#3c414e',marginTop:10}}><div style={{height:3,width:`${44+i*8}%`,background:'#83aafa'}}/></div></div>)}</>}
    </aside>
    <Cursor x={blender?300+60*Math.sin(frame/25):185+progress*240} y={blender?150+30*Math.cos(frame/32):245} click={frame%50<6}/>
  </div>
  <div style={{height:30,background:'#262b34',display:'flex',alignItems:'center',justifyContent:'center',gap:24,borderTop:'1px solid #454b56',fontSize:12}}><span>◀</span><span>Ⅱ</span><span>▶</span><span style={{color:'#b3c6df',fontFamily:'monospace'}}> {String(frame%240).padStart(4,'0')} </span><span>◆</span></div>
  {mode==='grade'?<div style={{height:150,display:'flex',alignItems:'center',justifyContent:'space-around',background:'#20242c'}}>
    {['Lift','Gamma','Gain'].map((x,i)=><div key={x} style={{textAlign:'center',fontSize:11}}><div style={{width:79,height:79,borderRadius:'50%',background:'conic-gradient(#e26868,#dada6f,#69c99e,#629fdf,#ad71cd,#e26868)',padding:9,boxSizing:'border-box',marginBottom:8}}><div style={{width:'100%',height:'100%',borderRadius:'50%',background:'#303642',position:'relative'}}><div style={{position:'absolute',left:22+5*Math.sin(frame/15+i),top:25,width:6,height:6,border:'1px solid white',borderRadius:'50%'}}/></div></div>{x}</div>)}
    <div style={{display:'flex',gap:12,alignItems:'center'}}>{['01','02','03'].map((x,i)=><React.Fragment key={x}><div style={{border:`2px solid ${i===1?'#e68663':'#5c677b'}`,borderRadius:5,padding:'18px 12px',fontSize:14,background:'#343b48'}}>{x}</div>{i<2&&<span>→</span>}</React.Fragment>)}</div>
  </div>:<div style={{height:150,position:'relative',background:'#1b2029',paddingTop:21,boxSizing:'border-box'}}>
    <div style={{position:'absolute',top:4,left:126,right:10,display:'flex',justifyContent:'space-between',color:'#8791a3',fontSize:9}}>{Array.from({length:9},(_,i)=><span key={i}>{i*30}</span>)}</div>
    {blender?<>
      {['Location','Rotation','Scale'].map((x,i)=><div key={x} style={{height:34,borderTop:'1px solid #333a46',paddingLeft:12,fontSize:10,display:'flex',alignItems:'center'}}>{x}<span style={{position:'absolute',left:180+i*32,color:['#de7777','#81c69a','#81a7e5'][i]}}>◆</span><span style={{position:'absolute',left:550+i*28,color:'#e5bd76'}}>◆</span></div>)}
      {motion&&<svg viewBox="0 0 720 90" style={{position:'absolute',left:135,top:35,width:780,height:100}}><path d="M 0 80 C 140 80 135 5 300 5 S 500 85 720 8" stroke="#86c1ff" fill="none" strokeWidth="2"/><path d="M 0 70 C 100 50 230 80 310 25 S 580 20 720 60" stroke="#eeb07b" fill="none" strokeWidth="2"/></svg>}
    </>:<>
      {['V2','V1','A1'].map((x,i)=><div key={x} style={{height:34,marginBottom:4,display:'flex',alignItems:'center',gap:4,fontSize:10}}><span style={{width:110,paddingLeft:16,boxSizing:'border-box'}}>{x}</span>{Array.from({length:i===2?1:3},(_,j)=><div key={j} style={{position:'relative',height:30,width:i===2?795:208+(j*18),background:i===2?'#266c60':i===1?'#365d95':'#6a5285',border:'1px solid #ffffff20',borderRadius:3,padding:'5px 8px',boxSizing:'border-box'}}>{i===2?<svg width="100%" height="18" viewBox="0 0 750 20">{wave.map((h,k)=><line key={k} x1={k*10+5} x2={k*10+5} y1={10-h*9} y2={10+h*9} stroke="#8fdbbc" strokeWidth="3"/>)}</svg>:i===0?['TITLE','CUT 02','GRAPHICS'][j]:['COAST_01','COAST_02','DETAIL'][j]}</div>)}</div>)}
    </>}
    <div style={{position:'absolute',left:135+progress*770,top:0,bottom:0,width:2,background:blender?'#78b5ef':'#ff6868'}}><div style={{width:10,height:9,background:'inherit',transform:'translateX(-4px)'}}/></div>
  </div>}
 </div>;
};

export const Computer:React.FC<{frame:number}>=({frame})=>{
 const p=clamp(frame/120),enter=ease(frame/16);
 return <div style={{position:'absolute',left:60,top:440,width:960,height:900,transform:`perspective(1700px) translateY(${100*(1-enter)}px) rotateY(${-16+24*p}deg) rotateX(${6-4*p}deg) scale(${.87+.08*enter})`,transformOrigin:'50% 50%',opacity:clamp(frame/5)}}>
  <div style={{position:'absolute',left:80,top:814,width:850,height:60,borderRadius:'50%',background:'#15204030',filter:'blur(22px)'}}/>
  <div style={{position:'absolute',left:428,top:650,width:105,height:156,background:'linear-gradient(90deg,#8490a0,#dae1e9 43%,#8e99aa)',clipPath:'polygon(20% 0,80% 0,100% 100%,0 100%)'}}/>
  <div style={{position:'absolute',left:355,top:791,width:255,height:25,borderRadius:'50%',background:'linear-gradient(#dce3ed,#8792a2)',boxShadow:'0 7px 10px #10243a22'}}/>
  <div style={{position:'absolute',inset:'0 0 auto 0',height:681,background:'linear-gradient(130deg,#c4ccd5,#647384 38%,#d7e0eb)',borderRadius:25,padding:5,boxShadow:'20px 24px 40px #102a6233, inset 0 0 0 2px #edf2f9',boxSizing:'border-box'}}>
    <div style={{height:'100%',background:'#090c12',borderRadius:20,padding:15,boxSizing:'border-box'}}><div style={{width:920,height:624,overflow:'hidden',borderRadius:6}}><div style={{transform:'scale(.9583333)',transformOrigin:'top left'}}><StudioPanel mode="model" frame={frame}/></div></div><div style={{height:20,display:'flex',alignItems:'center',justifyContent:'center'}}><div style={{width:4,height:4,borderRadius:3,background:'#d7e2f2'}}/></div></div>
  </div>
  <svg width="835" height="157" viewBox="0 0 835 157" style={{position:'absolute',left:15,top:785,transform:'perspective(500px) rotateX(28deg)',filter:'drop-shadow(0 12px 12px #1c345333)'}}>
    <defs><linearGradient id="keyboard-shell" x2="0" y2="1"><stop stopColor="#dfe5ed"/><stop offset="1" stopColor="#8996a7"/></linearGradient></defs><rect x="2" y="2" width="830" height="151" rx="15" fill="url(#keyboard-shell)" stroke="#f9fcff"/>
    {Array.from({length:5},(_,row)=>Array.from({length:16},(_,col)=><rect key={`${row}-${col}`} x={18+col*49} y={12+row*26} width={43} height={20} rx={3} fill={row===4&&col>3&&col<11?'#343b47':'#252c36'} stroke="#566273"/>))}
  </svg>
  <div style={{position:'absolute',left:875,top:785,width:72,height:122,borderRadius:'42% 42% 36% 36%',background:'linear-gradient(115deg,#f0f3f8,#9caabd)',boxShadow:'8px 11px 15px #13294533',transform:'rotate(-12deg)'}}><div style={{position:'absolute',left:35,top:5,width:1,height:50,background:'#536171'}}/><div style={{position:'absolute',left:30,top:23,width:11,height:23,background:'#6d798a',borderRadius:7}}/></div>
 </div>;
};

const SoftwareShot:React.FC<{mode:Mode;frame:number}>=({mode,frame})=><div style={{position:'absolute',left:60,top:620,width:960,height:650,transform:`perspective(1800px) translateY(${65*(1-ease(frame/10))}px) rotateY(${Math.sin(frame/40)*4}deg) rotateX(3deg)`,boxShadow:'0 40px 70px #00000055',borderRadius:12,opacity:clamp(frame/3)}}><StudioPanel mode={mode} frame={frame}/></div>;

export const CreativeContent:React.FC<{scene:number;local:number}>=({scene,local})=>{
 if(scene===1)return <Computer frame={local}/>;
 if(scene===3){const part=Math.min(2,Math.floor(local/40));return <SoftwareShot key={part} mode={(['model','edit','motion'] as Mode[])[part]} frame={local%40+15}/>;}
 if(scene===4){const part=Math.min(2,Math.floor(local/50));if(part<2)return <SoftwareShot key={part} mode={part===0?'motion':'grade'} frame={local%50+15}/>;
  return <div style={{position:'absolute',left:120,top:520,width:840,height:845,background:BLUE,overflow:'hidden',transform:`rotate(${-5+Math.sin(local/30)*2}deg) scale(${.93+.07*ease((local-100)/12)})`,boxShadow:'0 35px 100px #0008',border:'1px solid #ffffff44'}}><Img src={staticFile('product-project.png')} style={{width:'100%',height:'100%',objectFit:'cover'}}/><div style={{position:'absolute',top:40,left:40,fontFamily:'Anton',fontSize:100,color:'white',lineHeight:1}}>SOUND<br/>IN FORM.</div><div style={{position:'absolute',bottom:28,left:35,fontSize:15,letterSpacing:6,color:'white'}}>FORM STUDY / 01</div></div>;
 }
 if(scene===5){const part=Math.min(2,Math.floor(local/50)),phase=local%50;
  if(part===0)return <div style={{position:'absolute',left:100,top:520,width:880,height:830,overflow:'hidden',background:BLUE,transform:`rotate(${-6+phase*.06}deg)`,boxShadow:'0 32px 65px #152b6233'}}><Img src={staticFile('product-project.png')} style={{width:'100%',height:'100%',objectFit:'cover',transform:`scale(${1.05+phase*.0015})`}}/><div style={{position:'absolute',left:35,bottom:42,color:'white',fontFamily:'Anton',fontSize:85,lineHeight:1}}>FORM /<br/>FEELING.</div></div>;
  if(part===1)return <div style={{position:'absolute',left:65,top:570,width:950,height:710,overflow:'hidden',boxShadow:'0 30px 55px #152b6233'}}><Img src={staticFile('coast-project.png')} style={{width:'100%',height:'100%',objectFit:'cover',transform:`scale(1.12) translateX(${-phase*.7}px)`}}/><div style={{position:'absolute',inset:18,border:'1px solid #ffffff66'}}/><div style={{position:'absolute',left:45,bottom:45,color:'white',fontFamily:'Anton',fontSize:100,textShadow:'0 2px 12px #071f32'}}>BEYOND.</div><div style={{position:'absolute',left:45,top:35,color:'white',fontSize:15,letterSpacing:5}}>A COASTAL STUDY</div></div>;
  return <div style={{position:'absolute',left:0,top:600,width:1080,height:740,perspective:1800}}>
    <div style={{position:'absolute',left:-110,top:95,width:520,height:600,transform:`rotateY(18deg) rotate(-10deg) translateY(${25*Math.sin(phase/20)}px)`,boxShadow:'0 24px 50px #0b254344'}}><Img src={staticFile('product-project.png')} style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>
    <div style={{position:'absolute',right:-150,top:120,width:640,height:500,transform:`rotateY(-18deg) rotate(9deg) translateY(${-20*Math.sin(phase/20)}px)`,boxShadow:'0 24px 50px #0b254344'}}><Img src={staticFile('coast-project.png')} style={{width:'100%',height:'100%',objectFit:'cover'}}/></div>
    <div style={{position:'absolute',left:260,top:0,width:570,height:530,background:'#0a1745',boxShadow:'0 25px 80px #10193755',border:'1px solid #ffffff44',transform:`rotate(-3deg) scale(${.95+.05*ease(phase/12)})`}}><Torus frame={local*1.4}/><div style={{position:'absolute',bottom:30,left:34,fontFamily:'Anton',fontSize:75,color:'white'}}>IN MOTION.</div></div>
  </div>;
 }
 return null;
};
