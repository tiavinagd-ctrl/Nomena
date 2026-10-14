import {existsSync, renameSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
if (!existsSync('public/portrait-cutout.png')) {
  console.error('Portrait détouré manquant : public/portrait-cutout.png. Utiliser render:preview pour une animatique de placement.');
  process.exit(1);
}
const result = spawnSync('npx', ['remotion','render','src/index.ts','Impact','renders/Tiavina-Nomena-V2-30s-Vertical.mp4','--browser-executable=/usr/bin/chromium','--concurrency=4','--codec=h264','--crf=18','--pixel-format=yuv420p'], {stdio:'inherit'});
if (result.status !== 0) process.exit(result.status ?? 1);
// Normalize the full-range browser export to standard limited-range H.264,
// and use the exact 30-second source mix to avoid AAC container padding.
const encoded = spawnSync('ffmpeg', ['-v','error','-y',
  '-i','renders/Tiavina-Nomena-V2-30s-Vertical.mp4','-i','public/mix.wav',
  '-map','0:v:0','-map','1:a:0','-vf','scale=in_range=full:out_range=tv:out_color_matrix=bt709,format=yuv420p',
  '-c:v','libx264','-preset','fast','-crf','17','-threads','4',
  '-color_range','tv','-colorspace','bt709','-color_trc','bt709','-color_primaries','bt709',
  '-c:a','aac','-b:a','192k','-ar','48000','-t','30','-movflags','+faststart',
  'renders/delivery.tmp.mp4'], {stdio:'inherit'});
if (encoded.status !== 0) process.exit(encoded.status ?? 1);
renameSync('renders/delivery.tmp.mp4','renders/Tiavina-Nomena-V2-30s-Vertical.mp4');
