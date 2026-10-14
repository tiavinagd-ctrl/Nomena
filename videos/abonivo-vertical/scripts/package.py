from pathlib import Path
import zipfile,json
root=Path(__file__).resolve().parents[1]
target=root/'renders/ABONIVO-livraison.zip'
with zipfile.ZipFile(target,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
 z.write(root/'renders/ABONIVO-30s-apercu.mp4','ABONIVO-30s-apercu.mp4')
 for path in root.rglob('*'):
  rel=path.relative_to(root)
  if any(p in {'node_modules','renders','__pycache__','.git','.venv'} for p in rel.parts):continue
  if path.is_file() and not path.name.endswith('.log'):
   z.write(path,Path('ABONIVO-projet')/rel)
with zipfile.ZipFile(target) as z:assert z.testzip() is None
print(json.dumps({'file':str(target),'bytes':target.stat().st_size,'zip_integrity':'passed'}))
