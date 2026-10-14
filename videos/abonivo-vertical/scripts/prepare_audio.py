"""Original 120 BPM score and supplied Audrey voice; phrase edit at detected pauses.
Semantic alignment must be reviewed by listening: no transcription service is available.
"""
from pathlib import Path
import json,subprocess,wave
import numpy as np
ROOT=Path(__file__).resolve().parents[1]
SR=48000;N=30*SR;t=np.arange(N)/SR
source=np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(ROOT/'public/voice-original.mp3'),'-ar',str(SR),'-ac','1','-f','f32le','-']),dtype='<f4').copy()
boundaries=[0,2.15,4.34,9.27,13.04,15.64,len(source)/SR]
targets=[.18,4.25,8.20,14.35,20.35,25.20]
voice=np.zeros(N);duck=np.ones(N);edits=[]
for j,start in enumerate(targets):
 a,b=boundaries[j:j+2];s=source[round(a*SR):round(b*SR)];offset=round(start*SR)
 assert offset+len(s)<=N
 voice[offset:offset+len(s)]+=s
 end=start+len(s)/SR
 e=np.minimum(np.clip((t-start+.08)/.08,0,1),np.clip((end+.25-t)/.25,0,1));duck=np.minimum(duck,1-.68*e)
 edits.append(dict(scene=j+1,source_start=a,source_end=b,timeline_start=start,timeline_end=end))
voice*=.67/max(.01,float(abs(voice).max()))
music=np.zeros((N,2));fx=np.zeros_like(music);rng=np.random.default_rng(261379)
def add(dst,s,start,gain,pan=0):
 i=round(start*SR);n=min(len(s),N-i)
 if i<0 or n<=0:return
 dst[i:i+n,0]+=s[:n]*gain*np.sqrt((1-pan)/2);dst[i:i+n,1]+=s[:n]*gain*np.sqrt((1+pan)/2)
def note(freq,dur,decay=4):
 tt=np.arange(round(dur*SR))/SR
 return (np.sin(2*np.pi*freq*tt)+.14*np.sin(4*np.pi*freq*tt))*np.exp(-tt*decay)*(1-np.exp(-tt*100))
for beat in range(60):
 at=beat*.5
 if at>28.5:continue
 tt=np.arange(round(.35*SR))/SR;kick=np.sin(2*np.pi*(48*tt+1.7*(1-np.exp(-tt*38))))*np.exp(-tt*18)
 add(music,kick,at,.18)
 root=[45,41,48,43][(beat//8)%4]
 add(music,note(440*2**((root-69)/12),.5,7),at+.25,.08)
 if beat%2:
  tt=np.arange(round(.10*SR))/SR;noise=rng.normal(0,1,len(tt));noise=np.r_[0,np.diff(noise)]
  add(music,noise*np.exp(-tt*65),at,.023)
 for j in range(2):
  tt=np.arange(round(.045*SR))/SR
  add(music,rng.normal(0,1,len(tt))*np.exp(-tt*140),at+j*.25,.011,(-1)**j*.4)
 if beat>3:
  midi=root+[24,31,28,36][beat%4]
  add(music,note(440*2**((midi-69)/12),1,5),at+.125,.047,np.sin(beat*.7)*.6)
for bar in range(8):
 start=bar*4;root=[45,41,48,43][bar%4]
 for step in [12,19,24,28]:
  tt=np.arange(4*SR)/SR;env=np.minimum(tt/.5,1)*np.clip((4-tt)/.8,0,1)
  add(music,np.sin(2*np.pi*440*2**((root+step-69)/12)*tt)*env,start,.016,step/28-.5)
for j,at in enumerate([0,4,8,9.2,10.4,11.6,12.8,14,17.8,20.35,21.15,22.0,25]):
 add(fx,note(72 if j%2 else 55,.7,7),at,.12)
 tt=np.arange(round(.28*SR))/SR;noise=np.convolve(rng.normal(0,1,len(tt)),np.ones(20)/20,mode='same')
 add(fx,noise*np.sin(np.pi*tt/.28)**2,max(0,at-.18),.07,(-1)**j*.35)
for at in [15.5,17.8]:add(fx,note(1800,.04,90),at,.025)
for j,midi in enumerate([69,76,81]):add(music,note(440*2**((midi-69)/12),1.4,3),28.5+j*.08,.09,(j-1)*.3)
music*=duck[:,None];fx*=np.maximum(duck,.6)[:,None]
music*=np.minimum(t/.04,1)[:,None]*np.clip((30-t)/.7,0,1)[:,None]
mix=music+fx+voice[:,None];mix*=.9/max(.9,float(abs(mix).max()))
def save(path,array):
 with wave.open(str(path),'wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((array*32767).astype('<i2').tobytes())
save(ROOT/'public/mix.pre.wav',mix)
p=subprocess.run(['ffmpeg','-hide_banner','-y','-i',str(ROOT/'public/mix.pre.wav'),'-af','loudnorm=I=-16:TP=-1:LRA=9:print_format=json','-ar',str(SR),str(ROOT/'public/mix.wav')],capture_output=True,text=True,check=True)
(ROOT/'public/mix.pre.wav').unlink();(ROOT/'review/audio-normalization.txt').write_text(p.stderr)
(ROOT/'review/voice-edit.json').write_text(json.dumps({'source':'Audrey supplied by user, explicitly selected in chat','source_duration':len(source)/SR,'all_source_samples_preserved':sum(round(boundaries[i+1]*SR)-round(boundaries[i]*SR) for i in range(6))==len(source),'alignment':'Provisional phrase alignment at detected pauses; not semantically verified by transcription/listening.','bpm':120,'segments':edits},indent=2))
print('30-second stereo mix written. Original recording retained at original speed; added pauses between scenes.')
