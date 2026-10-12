"""Verify the completed master, create a sharing copy, and package the sources."""
import json
from pathlib import Path
import subprocess
import zipfile

ROOT = Path(__file__).resolve().parents[1]
MASTER = ROOT / 'renders/DigitalSubMG-50s-4K.mp4'

def run(*args):
    return subprocess.run(args, cwd=ROOT, check=True, capture_output=True, text=True)

metadata = json.loads(run('ffprobe', '-v', 'error', '-show_streams', '-show_format',
                          '-of', 'json', str(MASTER)).stdout)
video = next(s for s in metadata['streams'] if s['codec_type'] == 'video')
audio = next(s for s in metadata['streams'] if s['codec_type'] == 'audio')
assert (video['width'], video['height']) == (3840, 2160)
assert video['r_frame_rate'] == '24/1'
assert int(video['nb_frames']) == 1200
assert abs(float(metadata['format']['duration']) - 50) < .05
assert int(audio['sample_rate']) == 48000 and audio['channels'] == 2
decoded = run('ffmpeg', '-v', 'error', '-i', str(MASTER), '-f', 'null', '-')
assert not decoded.stderr.strip(), decoded.stderr
metadata['verification'] = {'decode_errors': 0, 'expected_frames': 1200,
                            'expected_duration_seconds': 50}
(ROOT / 'review/verification-export.json').write_text(
    json.dumps(metadata, indent=2, ensure_ascii=False) + '\n')
print('Master verified: 4K, 24 fps, 1,200 frames, 50 seconds, stereo audio.', flush=True)

selection = '+'.join(f'eq(n,{round(t * 24)})' for t in [3, 9, 17, 25, 34, 40, 47])
run('ffmpeg', '-v', 'error', '-y', '-i', str(MASTER), '-vf',
    f"select='{selection}',scale=640:360,tile=4x2:nb_frames=7:padding=12:margin=12:color=0x08152e",
    '-frames:v', '1', '-q:v', '2', 'review/planche-apercu.jpg')
run('ffmpeg', '-v', 'error', '-y', '-ss', '47', '-i', str(MASTER),
    '-frames:v', '1', 'review/affiche-4K.png')
print('Review images extracted from the finished movie.', flush=True)

run('ffmpeg', '-v', 'error', '-y', '-i', str(MASTER), '-vf', 'scale=1920:1080',
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '20', '-threads', '4',
    '-c:a', 'copy', '-movflags', '+faststart', 'renders/DigitalSubMG-50s-FullHD.mp4')
print('Full HD sharing copy ready.', flush=True)

excluded = {'renders', 'node_modules', '.hyperframes', '.media', '__pycache__'}
with zipfile.ZipFile(ROOT / 'renders/DigitalSubMG-projet.zip', 'w',
                     zipfile.ZIP_DEFLATED, compresslevel=5) as archive:
    for path in sorted(ROOT.rglob('*')):
        relative = path.relative_to(ROOT)
        if path.is_file() and not any(part in excluded for part in relative.parts):
            archive.write(path, 'DigitalSubMG/' + relative.as_posix())
print('Editable source archive ready.', flush=True)
