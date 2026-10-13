"""Original 128 BPM score; draft edit of the supplied voice at detected silences."""
from pathlib import Path
import json, subprocess, wave
import numpy as np

ROOT=Path(__file__).resolve().parents[1]
SR=48000; DUR=30; N=SR*DUR
segments=[
 ('Tout commence par une idée.',0,1.56,.35),
 ('Une vision qui sort du cadre.',2.04,3.91,3.32),
 ('Tiavina Nomena.',3.99,4.95,7.40),
 ('Graphisme.',5.06,5.94,11.10),('Vidéo.',6.05,6.79,12.42),
 ('Motion design.',6.87,8.03,13.78),('Des idées qui prennent vie.',8.07,9.77,15.75),
 ('Du rythme.',9.82,10.77,20.20),('De l’audace.',10.80,11.84,21.80),
 ('De l’impact.',11.88,13.00,23.55),('Tiavina Nomena.',13.03,13.97,25.75),
 ('Créer avec impact.',14.01,15.70,27.35)]
source=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(ROOT/'public/voice-original.mp3'),'-ar',str(SR),'-ac','1','-f','f32le','-']),dtype='<f4').copy()
source*=.65/max(.01,float(np.max(np.abs(source))))
voice=np.zeros(N);duck=np.ones(N); time=np.arange(N)/SR
for text,a,b,start in segments:
 s=source[round(a*SR):round(b*SR)].copy();r=min(round(.003*SR),len(s)//2)
 s[:r]*=np.linspace(0,1,r);s[-r:]*=np.linspace(1,0,r)
 i=round(start*SR); voice[i:i+len(s)]+=s
 end=start+len(s)/SR
 env=np.minimum(np.clip((time-start+.06)/.06,0,1),np.clip((end+.18-time)/.18,0,1))
 duck=np.minimum(duck,1-.69*env)

music=np.zeros((N,2));rng=np.random.default_rng(743)
def add(s,start,gain=1,pan=0):
 i=round(start*SR);n=min(len(s),N-i)
 if i<0 or n<=0:return
 music[i:i+n,0]+=s[:n]*gain*np.sqrt((1-pan)/2)
 music[i:i+n,1]+=s[:n]*gain*np.sqrt((1+pan)/2)
def tone(freq,duration,decay=5):
 t=np.arange(round(duration*SR))/SR
 return (np.sin(2*np.pi*freq*t)+.16*np.sin(2*np.pi*freq*2*t))*np.exp(-t*decay)*(1-np.exp(-t*220))
beat=60/128
for k in range(64):
 at=k*beat
 if 23.2<at<23.34 or 29.1<at:continue
 tt=np.arange(int(.30*SR))/SR
 kick=np.sin(2*np.pi*(48*tt+55*.025*(1-np.exp(-tt/.025))))*np.exp(-tt*20)
 add(kick,at,gain=.13 if k<54 else .075)
 if k%2:
  tt=np.arange(int(.1*SR))/SR
  hiss=rng.normal(0,1,len(tt));hiss=np.r_[0,np.diff(hiss)]
  add(hiss*np.exp(-tt*70),at,gain=.026)
 for sub in [0,.5]:
  tt=np.arange(int(.05*SR))/SR;noise=rng.normal(0,1,len(tt))
  add(noise*np.exp(-tt*170),at+sub*beat,gain=.013,pan=.35 if sub else -.2)
 roots=[43,46,39,41];root=roots[(k//16)%4]
 add(tone(440*2**((root-69)/12),.35,9),at+.5*beat,gain=.058)
 if k>=8:
  note=root+[24,31,27,34][k%4]
  add(tone(440*2**((note-69)/12),.6,7),at+.25*beat,gain=.038,pan=np.sin(k)*.5)

accents=[.18,3,7,7.6,11,12+1/3,13+2/3,15,16+2/3,18+1/3,20,21+2/3,23+1/3,25,29.0625]
for j,at in enumerate(accents):
 add(tone(62,.6,8),at,gain=.19)
 tt=np.arange(round(.22*SR))/SR
 noise=rng.normal(0,1,len(tt));noise=np.convolve(noise,np.ones(13)/13,mode='same')
 add(noise*np.sin(np.pi*tt/.22)**2,at-.14 if at>.14 else 0,gain=.085,pan=(-1)**j*.3)
for j,note in enumerate([67,74,79]):add(tone(440*2**((note-69)/12),.8,5),29.0625+j*.07,gain=.065,pan=(j-1)*.2)
music*=duck[:,None]
mute=np.ones(N);mute[round(23.2*SR):round((23+1/3)*SR)]=0
music*=mute[:,None]
music*=np.minimum(time/.12,1)[:,None]*np.clip((29.95-time)/.45,0,1)[:,None]
mix=music+np.repeat(voice[:,None],2,axis=1)
mix*=.89/max(.89,float(np.max(np.abs(mix))))
temp=ROOT/'public/mix.pre.wav'
with wave.open(str(temp),'wb') as w:
 w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((mix*32767).astype('<i2').tobytes())
report=subprocess.run(['ffmpeg','-hide_banner','-y','-i',str(temp),'-af','loudnorm=I=-16:TP=-1:LRA=9:print_format=json','-ar',str(SR),str(ROOT/'public/mix.wav')],capture_output=True,text=True,check=True)
temp.unlink()
(ROOT/'review/audio-normalization.txt').write_text(report.stderr)
(ROOT/'review/voice-edit.json').write_text(json.dumps({'status':'premontage fondé sur les silences ; texte non transcrit automatiquement','source_duration':len(source)/SR,'segments':[dict(expected_text=s[0],source_start=s[1],source_end=s[2],timeline_start=s[3]) for s in segments]},ensure_ascii=False,indent=2))
print('30s stereo mix prepared, 128 BPM, original score, supplied voice preserved at original speed.')
