# ABONIVO — spot vertical 30 secondes

Projet natif 1080 × 1920, 30 images/s, 900 images. Remotion/React pour la composition,
Three.js pour les appareils et mouvements de caméra 3D, FFmpeg pour le mixage,
l'encodage H.264/AAC et les contrôles. Aucune vidéo horizontale recadrée.

## État actuel

**Aperçu de travail, pas un master final conforme.** Les deux variantes du logo sont
visibles dans la conversation, mais aucun de leurs fichiers image n'est présent dans
le workspace. Le projet ne les redessine pas et réserve leur emplacement. L'export
final exige `public/logo-officiel.png`, à fournir à partir du PNG original approuvé.

La voix **Audrey fournie par le client et explicitement choisie dans le chat** est
conservée à sa vitesse et hauteur originales. L'enregistrement dure environ 19,88 s.
Le montage ajoute des pauses entre six segments, découpés au milieu des silences.
Tous les échantillons de la source sont conservés. Les correspondances sémantiques
phrase/scène sont provisoires : elles n'ont pas été vérifiées par transcription ou
écoute humaine. Voir `review/voice-edit.json` ; les points de coupe sont modifiables
dans `scripts/prepare_audio.py`.

La musique originale à 120 BPM, les accents de transition et les clics sont générés
par synthèse. Le mix réduit la musique pendant les segments parlés, puis normalise
la sortie vers −16 LUFS et −1 dBTP. Les appareils sont des modèles procéduraux 3D,
pas des photographies. Les interfaces sont des maquettes illustratives ; aucun
catalogue, prix ou partenariat commercial n'est affirmé.

## Reproduction

Prérequis : Node.js 22+, npm, Chromium, FFmpeg/ffprobe, Python 3 et NumPy.

```bash
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
npm ci
npm run check
npm run audio
npm run render:preview
```

Pour le master : déposer le PNG original du logo dans `public/logo-officiel.png`,
vérifier les six phrases à l'écoute puis `npm run render:final`.
Adapter `/usr/bin/chromium` dans les scripts si nécessaire sur une autre machine.
`npm run studio` ouvre l'éditeur Remotion sur une machine locale qui accepte cette interface.

## Fichiers à modifier

- `src/Film.tsx` : textes, scène finale, marges et transitions.
- `src/stage.js` : géométrie, matériaux, caméras, interfaces et animations des écrans.
- `scripts/prepare_audio.py` : montage de la voix, musique, effets et mixage.
- `src/Root.tsx` : durée, FPS, dimensions et compositions aperçu/final.

Les éléments essentiels restent dans une zone de sécurité conservatrice :
x = 88–952 px, y = 176–1580 px. Le CTA complet est présent dès l'image 750
(25,000 s) et reste affiché jusqu'à l'image 899. Les interfaces sociales varient
selon la plateforme ; cette marge n'est pas une garantie pour toute surimpression.

Les bibliothèques Three.js et Inter sont accompagnées de leurs licences.
Le logo et l'enregistrement vocal restent des ressources fournies par le client.

Versions utilisées pour l'aperçu : Node.js 24.19.0, FFmpeg 7.1.5,
Chromium 154, NumPy 2.3.5, Remotion 4.0.535. Le rendu utilise le moteur
WebGL logiciel `swangle` ; les autres options OpenGL testées n'ont pas permis
d'initialiser le contexte 3D dans cet environnement.
