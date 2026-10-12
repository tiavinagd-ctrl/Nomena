# DigitalSubMG · Film publicitaire

Composition de 50 secondes, 3840 × 2160, 24 images/s, français, sans voix off.

## Sources et statut

- `user_script.txt` : brief intégral fourni par le client.
- `BRIEF.md`, `STORYBOARD.md`, `frame.md` : intention, montage et direction visuelle.
- `index.html` / `scene.js` : animation Hyperframes et scène Three.js déterministes.
- `assets/score.wav` : musique originale stéréo de 50 secondes, composée par synthèse, avec effets synchronisés. Source : `scripts/compose_audio.py`.
- `assets/mascot.png` : mascotte originale générée, puis animée comme un élément détouré (elle n'est pas un personnage 3D articulé).
- Téléphone et cartes : véritables géométries 3D Three.js, matériaux physiques et éclairage d'environnement. Rendu WebGL rasterisé, pas un rendu ray tracing hors ligne.
- Marques de services : fichiers vectoriels de Simple Icons 11.15.0 (Netflix, Spotify, OpenAI, Canva, Prime Video) ; CapCut depuis Lobe Icons. Les marques identifient les services du brief, sans suggérer de partenariat.
- Police Inter : Google Fonts, licence SIL Open Font License.

Le site officiel est inaccessible depuis cette machine (refus CONNECT 403 du proxy). Le client a ensuite fourni son logo : une version préparée à partir de cette référence est intégrée. L'interface est une illustration du brief, pas une reproduction vérifiée du site. Aucun prix n'est inventé. Avant diffusion commerciale : confronter le catalogue et les modalités aux informations de l'entreprise.

## Ouvrir et exporter

Node.js 24 et FFmpeg sont présents dans l'environnement. Depuis ce dossier :

```sh
npm run check
npm run dev
npm run render
```

Le script npm épingle Hyperframes 0.8.149. Les actifs sont locaux ; aucune ressource distante n'est chargée par la composition. Utiliser le checkout existant ; ne pas créer de worktree pour ce projet vidéo.

Pour reproduire la musique :

```sh
python3 scripts/compose_audio.py
ffmpeg -i assets/score.wav -af loudnorm=I=-18:TP=-1.5:LRA=9 -ar 48000 /tmp/digitalsub-score-normalized.wav
cp /tmp/digitalsub-score-normalized.wav assets/score.wav
```

Les images de contrôle sont dans `review/`. Les modifications de timing doivent conserver exactement 50 secondes.

Après le rendu, `python3 scripts/finalize.py` vérifie le décodage du MP4, sa durée, ses 1 200 images, sa résolution et sa piste audio. Ce script produit la copie Full HD, extrait la planche de contrôle et l'affiche depuis le film terminé, puis rassemble le projet modifiable dans une archive ZIP. Les exports sont dans `renders/` ; le rapport technique est `review/verification-export.json`.
