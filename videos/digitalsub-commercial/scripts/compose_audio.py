"""Original deterministic electronic score and synced interface cues; no samples."""
from pathlib import Path
import numpy as np
import wave

SR=48000
DUR=50
rng=np.random.default_rng(716)
mix=np.zeros((SR*DUR,2),dtype=np.float64)
def hz(n): return 440*2**((n-69)/12)
def add(sig,start,pan=0,gain=1):
    i=int(start*SR); n=min(len(sig),len(mix)-i)
    if n<=0:return
    mix[i:i+n,0]+=sig[:n]*gain*np.sqrt((1-pan)/2)
    mix[i:i+n,1]+=sig[:n]*gain*np.sqrt((1+pan)/2)
def tone(note,duration,kind='bell'):
    t=np.arange(int(SR*duration))/SR; f=hz(note)
    if kind=='pad':
        s=sum(np.sin(2*np.pi*f*r*t+p) for r,p in [(0.998,0),(1.002,.4),(2,.8)])/3
        env=np.minimum(t/1.4,1)*np.minimum((duration-t)/2,1)
    else:
        s=np.sin(2*np.pi*f*t)+.24*np.sin(2*np.pi*f*2*t)*np.exp(-t*4)+.07*np.sin(2*np.pi*f*3*t)
        env=(1-np.exp(-t*180))*np.exp(-t*2.9)
    return s*env

# Ebmaj9 / Bbadd9 / Cm9 / Abmaj9, delicate extended harmonies.
chords=[[51,58,62,65],[46,53,60,62],[48,55,58,62],[44,51,55,58]]
for j,start in enumerate([0,5,13,21,29,37,44]):
    chord=chords[j%4]; end=[5,13,21,29,37,44,50][j]
    for k,n in enumerate(chord):
        add(tone(n,end-start+1.5,'pad'),start,pan=(k-1.5)/3,gain=.042)
    if j:
        for k,n in enumerate([chord[0]+24,chord[2]+24,chord[3]+24]):
            add(tone(n,2.0),start+.12+k*.105,pan=(k-1)*.3,gain=.033)

# Soft bass heartbeat, a restrained pulse rather than an EDM drum track.
for beat in np.arange(5,44,.5):
    t=np.arange(int(SR*.20))/SR
    s=np.sin(2*np.pi*(47*t+42*.028*(1-np.exp(-t/.028))))*np.exp(-t*24)
    add(s,beat,gain=.105 if int(beat*2)%4==0 else .035)
for k,beat in enumerate(np.arange(6,44,.5)):
    chord=chords[(max(0,int((beat-5)//8))+1)%4]
    n=chord[[0,2,1,3,2,1,3,2][k%8]]+24
    add(tone(n,1.25),beat+.25,pan=.42*np.sin(k*1.7),gain=.030)
    if k%2:
        t=np.arange(int(SR*.065))/SR
        noise=rng.normal(0,1,len(t));noise=np.concatenate(([0],np.diff(noise)))
        add(noise*np.exp(-t*100),beat,pan=.25,gain=.009)

# Air transitions tied to the edit, then small tactile UI taps.
for point in [4.7,12.7,20.7,28.7,36.7,43.7]:
    t=np.arange(int(.8*SR))/SR
    n=rng.normal(0,1,len(t));n=np.convolve(n,np.ones(35)/35,mode='same')
    add(n*np.sin(np.pi*t/.8)**2,point-.2,pan=-.2,gain=.15)
for point in [15.8,18.2,23.8,26.1,31.2,33.1,39.2,41.2]:
    add(tone(87,.28),point,pan=.1,gain=.030)
# Brand's three-note ascending signature; resolved ending.
for j,n in enumerate([75,79,82]):add(tone(n,3.3),44.9+j*.28,pan=(j-1)*.2,gain=.085)
t=np.arange(len(mix))/SR
fade=np.minimum(t/1.2,1)*np.minimum((DUR-t)/1.7,1)
mix*=fade[:,None]
peak=np.max(np.abs(mix));mix*=.75/max(peak,.75)
out=Path(__file__).resolve().parents[1]/'assets/score.wav'
with wave.open(str(out),'wb') as w:
    w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR)
    w.writeframes((np.clip(mix,-1,1)*32767).astype('<i2').tobytes())
print(f'{out.name}: {DUR}s stereo {SR} Hz; original score, peak {np.max(np.abs(mix)):.3f}')
