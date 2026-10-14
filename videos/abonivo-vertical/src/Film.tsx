import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
// Vendored official Three.js distribution; license is in src/lib.
// @ts-ignore
import {createStage} from './stage.js';

const starts=[0,120,240,420,600,750],ends=[120,240,420,600,750,900];
const ease=(x:number)=>{x=Math.max(0,Math.min(1,x));return 1-Math.pow(1-x,3)};
const fontsReady=Promise.resolve().then(async()=>{if(typeof document==='undefined')return;const f=new FontFace('Inter',`url(${staticFile('Inter.ttf')})`,{weight:'100 900'});await f.load();document.fonts.add(f)});

const Stage:React.FC<{scene:number}>=({scene})=>{
 const frame=useCurrentFrame();const canvas=useRef<HTMLCanvasElement>(null);const stage=useRef<any>(null);
 const [ready]=useState(()=>delayRender('Initialiser la scène 3D'));
 useEffect(()=>{let canceled=false;fontsReady.then(()=>{if(canceled)return;stage.current=createStage(canvas.current,scene);stage.current.setTime(frame/30);continueRender(ready)});return()=>{canceled=true;stage.current?.dispose();stage.current=null}},[scene,ready]);
 useLayoutEffect(()=>{stage.current?.setTime(frame/30)},[frame]);
 return <canvas ref={canvas} width={1080} height={1920} style={{position:'absolute',width:1080,height:1920,top:0,left:0}}/>;
};

const Logo:React.FC<{preview:boolean,size:number}>=({preview,size})=>preview?
 <div style={{width:size,height:size,display:'flex',alignItems:'center',justifyContent:'center',border:'1px dashed #7582a1',borderRadius:44,color:'#9aa9c6',fontSize:23,lineHeight:1.6,textAlign:'center',background:'#0b1030b0'}}>Logo officiel<br/>fichier original à intégrer</div>:
 <Img src={staticFile('logo-officiel.png')} style={{width:size,height:size,objectFit:'contain',borderRadius:42}}/>;

const Scene:React.FC<{index:number,preview:boolean}>=({index,preview})=>{
 const f=useCurrentFrame(),t=f/30;
 const entry=ease(f/22);const duration=ends[index]-starts[index];
 const outgoing=index===5?1:interpolate(f,[duration-9,duration],[1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 const light=index===0||index===4;
 const darken=index===4?ease((t-3.2)/1.5):0;
 const title=[<>Trop<br/>d’abonnements&nbsp;?</>,<>Découvrez<br/><span style={{color:'#37DDC3'}}>ABONIVO.</span></>,<>Tous vos univers.<br/><span style={{fontWeight:400}}>Un même endroit.</span></>,<>Vos besoins.<br/><span style={{color:'#37DDC3'}}>Vos choix.</span></>,null,null][index];
 const ink=light?'#0b1030':'#f7f9ff';
 return <AbsoluteFill style={{opacity:outgoing,background:light?'#edf1fa':'#0B1030',color:ink,overflow:'hidden'}}>
   <AbsoluteFill style={{background:light?'radial-gradient(ellipse at 90% 10%,#ffffff 0%,transparent 50%),radial-gradient(ellipse at 10% 70%,#3478f633,transparent 65%)':'radial-gradient(ellipse at 85% 40%,#3478f62b,transparent 48%),radial-gradient(ellipse at 12% 75%,#5643e936,transparent 50%)'}}/>
   {index===4&&<AbsoluteFill style={{background:'#0B1030',opacity:darken}}/>}
   <div style={{position:'absolute',left:-130,top:760,width:1340,height:440,borderRadius:'50%',border:`1px solid ${light?'#3478f621':'#6a7ab51a'}`,transform:`rotate(-24deg) translateY(${Math.sin(t*.6)*25}px)`}}/>
   <div style={{position:'absolute',top:176,left:88,right:128,display:'flex',alignItems:'center',justifyContent:'space-between',fontSize:21,letterSpacing:4,fontWeight:650,color:index===4&&darken>.5?'#b5c0da':light?'#505c7d':'#a4b2d0'}}><span>ABONIVO</span><span style={{fontSize:17,letterSpacing:2}}>VOTRE UNIVERS NUMÉRIQUE</span></div>
   <Stage scene={index}/>
   {title&&<div style={{position:'absolute',left:88,right:124,top:290,fontSize:index===0?83:76,letterSpacing:-4.5,fontWeight:750,lineHeight:1.09,opacity:entry,transform:`translateY(${(1-entry)*30}px)`}}>{title}</div>}
   {index===0&&<div style={{position:'absolute',left:88,bottom:345,fontSize:27,letterSpacing:.2,color:'#505c7d'}}>Et si tout devenait plus simple&nbsp;?</div>}
   {index===1&&<div style={{position:'absolute',top:690,left:255,transform:`scale(${.9+.1*entry})`,opacity:entry}}><Logo preview={preview} size={570}/></div>}
   {index===1&&<div style={{position:'absolute',top:1390,left:88,right:128,textAlign:'center',fontSize:33,color:'#bdc9e3'}}>Une autre façon de choisir.</div>}
   {index===2&&<><div style={{position:'absolute',top:1335,left:88,right:128,textAlign:'center',fontSize:56,fontWeight:750,letterSpacing:-2,color:'#37ddc3'}}>{['STREAMING','IA','CRÉATION','LOGICIELS','FORMATION'][Math.min(4,Math.floor(t/1.2))]}</div><div style={{position:'absolute',left:230,right:270,top:1450,display:'flex',gap:18}}>{[0,1,2,3,4].map(i=><div key={i} style={{height:5,flex:1,borderRadius:3,background:Math.floor(t/1.2)>=i?'#37ddc3':'#334060'}}/>)}</div></>}
   {index===3&&<div style={{position:'absolute',top:1535,left:88,right:128,textAlign:'center',fontSize:24,color:'#a5b4ce'}}>Explorez. Découvrez. Choisissez.</div>}
   {index===4&&<div style={{position:'absolute',top:375,left:88,fontSize:85,fontWeight:800,letterSpacing:-4,lineHeight:1.5}}>{['CLAIR.','SIMPLE.','PRATIQUE.'].map((s,i)=>{const a=ease((t-[.3,1.1,1.85][i])/.35);return <div key={s} style={{opacity:a,transform:`translateX(${(1-a)*-60}px)`,color:i===1?'#5643E9':darken>.5?'#F7F9FF':'#0B1030',textShadow:darken>.5?'0 3px 20px #0b1030':undefined}}>{s}</div>})}</div>}
   {index===4&&<div style={{position:'absolute',top:1450,left:88,right:128,fontSize:31,color:darken>.5?'#c2cce4':'#505c7d'}}>Votre quotidien numérique, simplifié.</div>}
   {index===5&&<>
     <div style={{position:'absolute',top:380,left:305,transform:`translateY(${Math.sin(t*.6)*5}px)`}}><Logo preview={preview} size={470}/></div>
     <div style={{position:'absolute',top:925,left:88,right:128,textAlign:'center',fontSize:91,fontWeight:800,letterSpacing:-4}}>ABONIVO</div>
     <div style={{position:'absolute',top:1068,left:105,right:145,textAlign:'center',fontSize:36,lineHeight:1.4,fontWeight:450}}>Vos abonnements numériques,<br/>simplifiés.</div>
     <div style={{position:'absolute',top:1295,left:165,right:205,height:90,borderRadius:45,background:'#37DDC3',color:'#0B1030',display:'flex',alignItems:'center',justifyContent:'center',fontSize:29,fontWeight:800,letterSpacing:2}}>CONTACTEZ-NOUS</div>
     <div style={{position:'absolute',top:1438,left:88,right:128,textAlign:'center',fontSize:51,fontWeight:650,letterSpacing:1}}>+261 37 9148089</div>
   </>}
   {preview&&<div style={{position:'absolute',bottom:120,left:88,right:128,fontSize:18,textAlign:'center',letterSpacing:1.4,color:light&&darken<.5?'#68748e':'#8694b5'}}>APERÇU DE TRAVAIL · LOGO ORIGINAL À INTÉGRER</div>}
 </AbsoluteFill>;
};

export const Film:React.FC<{preview:boolean}>=({preview})=>{
 const [handle]=useState(()=>delayRender('Charger la typographie'));
 useEffect(()=>{fontsReady.then(()=>continueRender(handle))},[handle]);
 return <AbsoluteFill style={{fontFamily:'Inter, sans-serif',background:'#0b1030'}}>
   <Audio src={staticFile('mix.wav')}/>
   {starts.map((s,i)=><Sequence key={i} from={s} durationInFrames={ends[i]-s} premountFor={10}><Scene index={i} preview={preview}/></Sequence>)}
 </AbsoluteFill>;
};
