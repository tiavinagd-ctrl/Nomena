from pathlib import Path
import json,subprocess,sys,hashlib
root=Path(__file__).resolve().parents[1]
path=Path(sys.argv[1]) if len(sys.argv)>1 else root/'renders/ABONIVO-30s-apercu.mp4'
probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(path)]))
v=next(x for x in probe['streams'] if x['codec_type']=='video');a=next(x for x in probe['streams'] if x['codec_type']=='audio')
assert (v['width'],v['height'])==(1080,1920)
assert v['avg_frame_rate']=='30/1' and int(v['nb_frames'])==900
assert abs(float(probe['format']['duration'])-30)<.001
assert v['codec_name']=='h264' and v['pix_fmt']=='yuv420p'
assert a['codec_name']=='aac' and a['channels']==2
assert abs(float(a['duration'])-30)<.03
subprocess.run(['ffmpeg','-v','error','-xerror','-i',str(path),'-f','null','-'],check=True)
report={'file':path.name,'bytes':path.stat().st_size,'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'width':v['width'],'height':v['height'],'frames':int(v['nb_frames']),'fps':v['avg_frame_rate'],'duration':probe['format']['duration'],'audio':{'codec':a['codec_name'],'channels':a['channels'],'duration':a['duration']},'full_decode':'passed','status':'preview awaiting original logo' if 'apercu' in path.name else 'rendered with supplied logo; semantic voice alignment still requires listening review'}
(root/'review/verification-export.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
