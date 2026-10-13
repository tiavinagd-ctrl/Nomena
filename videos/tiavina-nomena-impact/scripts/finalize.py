"""Verify the actual export, extract review frames, and package editable sources."""
import json
from pathlib import Path
import subprocess
import zipfile

ROOT=Path(__file__).resolve().parents[1]
movie=ROOT/'renders/Tiavina-Nomena-30s-Vertical.mp4'
def run(*args):
 return subprocess.run(args,cwd=ROOT,capture_output=True,text=True,check=True)
meta=json.loads(run('ffprobe','-v','error','-show_streams','-show_format','-of','json',str(movie)).stdout)
video=next(s for s in meta['streams'] if s['codec_type']=='video')
audio=next(s for s in meta['streams'] if s['codec_type']=='audio')
assert (video['width'],video['height'])==(1080,1920)
assert video['codec_name']=='h264' and video['pix_fmt']=='yuv420p'
assert video['r_frame_rate']=='30/1' and int(video['nb_frames'])==900
assert abs(float(meta['format']['duration'])-30)<.05
assert audio['channels']==2 and audio['codec_name']=='aac'
decode=run('ffmpeg','-v','error','-xerror','-i',str(movie),'-f','null','-')
assert not decode.stderr.strip(),decode.stderr
meta['verification']={'full_decode_errors':0,'frames_expected':900,'typescript':'passed'}
(ROOT/'review/verification-export.json').write_text(json.dumps(meta,indent=2,ensure_ascii=False))
print('Export verified: 900 frames, 1080x1920, 30 fps, H.264, stereo AAC, no decode errors.',flush=True)
pick='+'.join(f'eq(n,{round(t*30)})' for t in [1.6,4.6,8.7,14.3,17.3,24.1,28.5])
run('ffmpeg','-v','error','-y','-i',str(movie),'-vf',f"select='{pick}',scale=270:480,tile=4x2:nb_frames=7:padding=10:margin=10:color=0x101217",'-frames:v','1','-q:v','2','review/planche-film.jpg')
run('ffmpeg','-v','error','-y','-ss','28.5','-i',str(movie),'-frames:v','1','review/affiche.png')
with zipfile.ZipFile(ROOT/'renders/Tiavina-Nomena-sources.zip','w',zipfile.ZIP_DEFLATED,compresslevel=5) as z:
 for p in sorted(ROOT.rglob('*')):
  relative=p.relative_to(ROOT)
  if not p.is_file() or any(part in {'node_modules','renders','.git','__pycache__'} for part in relative.parts) or p.name=='renders.log':continue
  z.write(p,'Tiavina-Nomena/'+relative.as_posix())
print('Review contact sheet, poster, and source ZIP ready.',flush=True)
with zipfile.ZipFile(ROOT/'renders/Tiavina-Nomena-livraison.zip','w',zipfile.ZIP_STORED) as z:
 for path,name in [(movie,movie.name),(ROOT/'STORYBOARD.md','STORYBOARD.md'),(ROOT/'renders/Tiavina-Nomena-sources.zip','Tiavina-Nomena-sources.zip'),(ROOT/'review/affiche.png','Affiche.png')]:
  z.write(path,name)
print('Complete delivery ZIP ready.',flush=True)
