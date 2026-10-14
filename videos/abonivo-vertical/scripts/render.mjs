import {existsSync,renameSync,mkdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
const preview=process.argv.includes('--preview');
if(!preview&&!existsSync('public/logo-officiel.png')){
 console.error('Export final bloqué : le fichier ORIGINAL du logo est requis dans public/logo-officiel.png. Les images visibles dans le chat ne sont pas des fichiers accessibles ici. Aucun logo ne sera redessiné.');process.exit(2);
}
mkdirSync('renders',{recursive:true});
const run=(exe,args)=>{const p=spawnSync(exe,args,{stdio:'inherit'});if(p.status!==0)process.exit(p.status??1)};
if(!existsSync('public/mix.wav'))run('python3',['scripts/prepare_audio.py']);
const output=`renders/ABONIVO-30s-${preview?'apercu':'final'}.mp4`;
run('npx',['remotion','render','src/index.ts',preview?'AbonivoPreview':'Abonivo','renders/render.tmp.mp4','--browser-executable=/usr/bin/chromium','--gl=swangle','--concurrency=3','--codec=h264','--crf=18','--pixel-format=yuv420p']);
run('ffmpeg',['-v','error','-y','-i','renders/render.tmp.mp4','-i','public/mix.wav','-map','0:v:0','-map','1:a:0','-vf','scale=in_range=full:out_range=tv:out_color_matrix=bt709,format=yuv420p','-c:v','libx264','-preset','fast','-crf','18','-threads','4','-color_range','tv','-colorspace','bt709','-color_trc','bt709','-color_primaries','bt709','-c:a','aac','-b:a','192k','-ar','48000','-t','30','-movflags','+faststart',output]);
run('python3',['scripts/verify.py',output]);
