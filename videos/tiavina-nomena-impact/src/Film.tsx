import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Img, cancelRender, continueRender, delayRender, staticFile, useCurrentFrame} from 'remotion';

const BLUE='#1246ff', WHITE='#f4f5f1', INK='#101217';
const cuts=[0,90,210,330,450,600,750,900];
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const ease=(v:number)=>1-Math.pow(1-clamp(v),4);
const lerp=(a:number,b:number,p:number)=>a+(b-a)*p;
const poses=[
  {x:40,y:350,scale:1.45}, {x:0,y:365,scale:1}, {x:155,y:390,scale:1.03},
  {x:95,y:370,scale:1.08}, {x:-10,y:390,scale:1.34}, {x:70,y:400,scale:1.12}, {x:0,y:410,scale:1},
];

function useFonts(){
  const [handle]=useState(()=>delayRender('Local typography'));
  useEffect(()=>{
    Promise.all([['Anton','Anton.ttf'],['Inter','Inter.ttf']].map(async([name,file])=>{
      const f=new FontFace(name,`url(${staticFile(file)})`); await f.load(); document.fonts.add(f);
    })).then(()=>continueRender(handle)).catch(cancelRender);
  },[handle]);
}

const Giant:React.FC<{text:string,y:number,size?:number,x?:number,color?:string,rotate?:number,enter:number,stretch?:number,tracking?:number}>=({text,y,size=400,x=0,color=WHITE,rotate=-4,enter,stretch=1,tracking=-7})=>{
  const entrance=ease(enter/12);
  return <div style={{position:'absolute',left:x-500*(1-entrance),top:y,width:1500,fontFamily:'Anton',fontSize:size,lineHeight:1,whiteSpace:'nowrap',letterSpacing:tracking,color,
    transform:`rotate(${rotate}deg) scaleX(${lerp(stretch*1.16,stretch,entrance)})`,transformOrigin:'50% 50%',opacity:clamp(enter/3),filter:enter<8?`blur(${(1-entrance)*6}px)`:'none'}}>
    {text.split('').map((c,i)=><span key={i} style={{display:'inline-block',transform:`translateY(${(1-ease((enter-i*.7)/11))*190}px) rotate(${(1-ease((enter-i*.7)/11))*-14}deg)`}}>{c}</span>)}
  </div>;
};

const Arc:React.FC<{word:string,t:number,color:string,front?:boolean}>=({word,t,color,front=false})=>{
  const bend=lerp(630,260,ease(t/35));
  return <svg viewBox="0 0 1080 1920" style={{position:'absolute',inset:0,width:'100%',height:'100%',overflow:'visible'}}>
    <defs><path id={front?'arc-front':'arc-back'} d={front?'M -380 1110 Q 550 1650 1500 1020':`M -480 870 Q 530 ${bend} 1560 780`}/></defs>
    <text fill={color} fontFamily="Anton" fontSize={front?180:365} letterSpacing={-5}>
      <textPath href={front?'#arc-front':'#arc-back'} startOffset={`${front?26:18+Math.sin(t/48)*3}%`}>{word}</textPath>
    </text>
  </svg>;
};

const Subject:React.FC<{preview:boolean,x:number,y:number,scale:number,dark:boolean}>=({preview,x,y,scale,dark})=><div style={{position:'absolute',left:x,top:y,width:1080,height:1580,transform:`scale(${scale})`,transformOrigin:'50% 20%'}}>
  {preview?<svg viewBox="0 0 1080 1580" style={{width:'100%',height:'100%'}}>
    <defs><linearGradient id="body" x1="0" x2="1"><stop stopColor="#333b50"/><stop offset="1" stopColor="#111521"/></linearGradient></defs>
    <path d="M 396 436 Q 295 450 235 558 L 120 1200 L 190 1580 L 900 1580 L 962 1200 L 848 558 Q 790 450 674 436 L 636 381 L 444 381 Z" fill="url(#body)"/>
    <ellipse cx="540" cy="250" rx="150" ry="205" fill="#333b50"/>
    <text x="540" y="830" textAnchor="middle" fill="#a8b5d8" fontFamily="Inter" fontSize="27">PORTRAIT · PLACEMENT</text>
  </svg>:<Img src={staticFile('portrait-cutout.png')} style={{width:'100%',height:'100%',objectFit:'contain',objectPosition:'top center',filter:dark?'brightness(.72) contrast(1.17) saturate(.7) drop-shadow(-10px 0 14px #1d50ff80)':'contrast(1.03) drop-shadow(14px 16px 12px #00000020)'}}/>}
</div>;

export const Film:React.FC<{preview:boolean}>=({preview})=>{
  useFonts();
  const f=useCurrentFrame(),t=f/30;
  const s=Math.min(6,cuts.findIndex((start,i)=>i<7&&f>=start&&f<cuts[i+1]));
  const local=f-cuts[s],p=local/(cuts[s+1]-cuts[s]);
  const skill=Math.min(2,Math.floor(local/40));
  const idea=Math.min(2,Math.floor(local/50));
  const impact=Math.min(2,Math.floor(local/50));
  const light=s===1||(s===3&&skill===1)||s===5;
  const dark=s===0||s===4||(s===3&&skill===2);
  const bg=light?WHITE:dark?'#03091e':BLUE;
  const fg=light?INK:WHITE;
  const words=s===0?'CREATE':s===1?'VISION':s===2?'TIAVINA NOMENA':s===3?['DESIGN','VIDEO','MOTION'][skill]:s===4?['IMAGINE','CREATE','INSPIRE'][idea]:s===5?['RHYTHM','CREATIVITY','IMPACT'][impact]:'TIAVINA NOMENA';
  const pose={...poses[s]};
  if(s===3){pose.x=[110,-65,0][skill];pose.scale=[1.05,1,1.28][skill];}
  if(s===5){pose.scale=[1.18,.93,1.45][impact];pose.x=[75,-40,15][impact];}
  const drift=Math.sin(p*Math.PI)*22;
  const scale=pose.scale*(s===6?lerp(1.04,1,ease(local/95)):lerp(1,1.025,p));
  const tag=['THE INTRO','THE VISION','THE NAME','THE SKILLS','THE IDEAS','THE IMPACT','THE SIGNATURE'][s];
  const transition=ease((local-(cuts[s+1]-cuts[s]-6))/6);
  const nextLight=s===0||s===4||(s===2);
  return <AbsoluteFill style={{background:bg,overflow:'hidden',fontFamily:'Inter'}}>
    <Audio src={staticFile('mix.wav')}/>
    <div style={{position:'absolute',inset:0,background:light?'radial-gradient(ellipse at 65% 42%, #fff 0%, #f4f5f1 58%, #dce0e7 100%)':dark?'radial-gradient(ellipse at 20% 40%, #1442a9 0%, transparent 53%)':'radial-gradient(ellipse at 50% 35%, #3b68ff 0%, transparent 62%)'}}/>
    {s===5&&<div style={{position:'absolute',left:650,top:-200,width:240,height:2450,background:'#1012170c',transform:'rotate(24deg)'}}/>}
    <div style={{position:'absolute',left:-drift*.9,top:0,width:1080,height:1920,transform:`perspective(1400px) rotateY(${Math.sin(p*Math.PI*2)*4}deg)`}}>
      {s===0&&<Giant text="CREATE" x={-170} y={440} size={485} enter={local-7}/>}
      {s===1&&<Arc word="VISION" t={local} color={INK}/>}
      {(s===2||s===6)&&<>
        <Giant text="TIAVINA" x={45} y={310} size={265} enter={local} rotate={s===6?0:-5}/>
        <Giant text="NOMENA" x={55} y={630} size={292} enter={local-6} rotate={s===6?0:-5}/>
      </>}
      {s===3&&skill<2&&<Giant text={words} x={-100} y={430} size={405} color={fg} enter={local%40} rotate={skill===0?-11:0} stretch={skill===1?1.23:1}/>}
      {s===3&&skill===2&&<Arc word="MOTION" t={local%40} color={WHITE}/>}
      {s===4&&<div style={{transform:`translateY(${(1-ease((local%50)/10))*200}px) scaleY(${.14+.86*ease((local%50)/10)})`,transformOrigin:'540px 650px'}}><Giant text={words} y={460} size={words==='IMAGINE'?385:440} x={-105} rotate={-5+8*p} enter={local%50}/></div>}
      {s===5&&impact!==1&&<Giant text={words} x={-60} y={440} size={impact===2?440:380} color={INK} enter={local%50} rotate={-7}/>}
      {s===5&&impact===1&&<><Giant text="CREA" x={80} y={290} size={365} color={INK} enter={local%50} rotate={0}/><Giant text="TIVITY" x={-50} y={630} size={365} color={INK} enter={(local%50)-3} rotate={0}/></>}
    </div>
    <Subject preview={preview} x={pose.x+drift*.55} y={pose.y} scale={scale} dark={dark}/>
    {s===3&&skill===2&&<div style={{position:'absolute',inset:0,clipPath:'inset(62% 0 0 0)'}}><Arc word="MOTION" t={local%40} color={WHITE} front/></div>}
    {(s===2||s===4)&&<div style={{position:'absolute',left:730-drift,top:1070,fontFamily:'Anton',fontSize:530,color:'transparent',WebkitTextStroke:`2px ${WHITE}99`,transform:'rotate(-9deg)',opacity:s===2?.3:.17}}>N</div>}
    {light&&<div style={{position:'absolute',left:0,right:0,top:1280,bottom:0,background:'linear-gradient(to bottom, rgba(244,245,241,0), rgba(244,245,241,.96) 22%, #f4f5f1 100%)'}}/>}
    <div style={{position:'absolute',left:80,right:110,top:180,display:'flex',alignItems:'center',justifyContent:'space-between',fontSize:22,fontWeight:650,letterSpacing:4,color:fg}}>
      <span style={{display:'inline-block',width:56,height:5,background:fg,marginRight:25}}/><span style={{flex:1}}>TIAVINA NOMENA</span><span style={{opacity:.7}}>0{s+1}</span>
    </div>
    <div style={{position:'absolute',left:80,top:s===6?1370:1410,color:fg,width:840,opacity:ease((local-10)/12),transform:`translateY(${(1-ease((local-10)/12))*45}px)`}}>
      <div style={{fontSize:18,letterSpacing:5,fontWeight:500,marginBottom:20,opacity:.72}}>{tag}</div>
      <div style={{fontWeight:850,fontSize:words==='TIAVINA NOMENA'?52:64,letterSpacing:-2,lineHeight:1.05,textShadow:light?'0 2px 20px #f4f5f1':'0 2px 20px #031336'}}>{words}</div>
      {s===6&&<div style={{fontSize:48,fontWeight:800,letterSpacing:-1,marginTop:35,opacity:ease((local-65)/10),clipPath:`inset(0 ${(1-ease((local-65)/10))*100}% 0 0)`}}>CRÉER AVEC IMPACT.</div>}
    </div>
    <div style={{position:'absolute',bottom:220,left:80,right:110,height:1,background:fg,opacity:.25}}/>
    <div style={{position:'absolute',bottom:174,left:80,right:110,display:'flex',justifyContent:'space-between',color:fg,fontSize:17,letterSpacing:3,opacity:.75}}><span>DESIGN / VIDEO / MOTION</span><span>CRÉER AVEC IMPACT.</span></div>
    {s===0&&local<14&&<div style={{position:'absolute',left:-300+local*125,top:-200,width:70,height:2400,background:'#4379ff',transform:'rotate(14deg)',opacity:local<5?0:1-(local-5)/9}}/>}
    {s<6&&transition>0&&<div style={{position:'absolute',inset:-300,background:nextLight?WHITE:BLUE,transform:`translateX(${(1-transition)*1650}px) skewX(-12deg)`}}/>}
    {preview&&<div style={{position:'absolute',left:0,right:0,top:55,textAlign:'center',fontSize:20,letterSpacing:3,color:fg}}>ANIMATIQUE · PORTRAIT DE PLACEMENT</div>}
    {f<6&&<AbsoluteFill style={{background:'#000',opacity:1-f/6}}/>}
  </AbsoluteFill>;
};
