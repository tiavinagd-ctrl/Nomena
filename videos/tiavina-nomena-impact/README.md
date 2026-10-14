# Tiavina Nomena — Créer avec impact · V2

Publicité personnelle verticale : 1080 × 1920, 30 i/s, 30 secondes. Projet React / Remotion 4.0.535.

## Livrables

- `STORYBOARD.md` : les sept scènes détaillées, placements typographiques en pixels, masques, mouvements, transitions, grille musicale et voix.
- `renders/Tiavina-Nomena-V2-30s-Vertical.mp4` : version enrichie : portrait, PC animé, Blender, DaVinci Resolve et projets visuels.
- `renders/Tiavina-Nomena-V2-sources.zip` : sources modifiables, ressources et storyboard.
- `renders/Tiavina-Nomena-V2-livraison.zip` : vidéo, affiche, storyboard et archive des sources réunis.
- `review/` : images et contrôles techniques du film.

## Direction artistique et portrait

Le client a demandé ensuite une tenue jeune, à la place du costume de la quatrième référence : t-shirt noir, veste légère décontractée. `public/portrait-cutout.png` est une adaptation générée depuis les images de référence, avec fond transparent. La photographie originale n'est pas conservée pixel pour pixel : la ressemblance de cette adaptation doit être appréciée par le client. Aucun personnage d'une publicité de référence n'est intentionnellement substitué au sujet.

Le film utilise cette photographie adaptée en compositing 2.5D. Le visage n'est ni animé ni déformé. Les courbes SVG et les calques typographiques passent devant et derrière le portrait ; il ne s'agit pas d'un modèle humain 3D. Les transitions IMAGINE / CREATE / INSPIRE compriment et remplacent les glyphes, sans prétendre effectuer un morphing de leurs contours vectoriels.

La fonte Anton est sous licence SIL OFL, de même qu'Inter ; licences conservées dans `public/`. Aucun logo Redmi, Xiaomi, North Face ou Momentum n'est réutilisé.

## Audio

La voix fournie par le client est conservée dans `public/voice-original.mp3` (15,804 s). `scripts/prepare_audio.py` insère des pauses entre les portions de voix, conserve la vitesse d'origine, compose une musique et des effets originaux à 128 BPM, puis produit `public/mix.wav` en stéréo 48 kHz. La source mono reste centrée dans le mix.

Le placement des portions de voix est un prémontage fondé sur les silences détectés et l'ordre du texte fourni. Aucune transcription automatique n'a été effectuée. Le fichier `review/voice-edit.json` donne les coupes exactes à vérifier à l'écoute. Le résultat de normalisation est enregistré dans `review/audio-normalization.txt`.

## Installation et commandes

```sh
npm ci
npm run check
npm run studio
npm run render:final
```

Node.js 24, FFmpeg et Chromium sont utilisés dans l'environnement Nomena. Les commandes configurent `/usr/bin/chromium` ; adapter ce chemin sur une autre machine. Le studio est prévu pour un lancement local par l'utilisateur ; l'interface de configuration cloud ne fournit pas de prévisualisation localhost. Réutiliser le checkout existant, sans worktree.

Le portrait est obligatoire pour l'export `Impact` : le script s'arrête s'il manque. `npm run render:preview` produit une animatique à silhouette de placement explicitement signalée. Aucun accès externe n'est nécessaire pendant le rendu : fontes, portrait et son sont locaux. Les temps sont calculés depuis l'image Remotion courante, sans animation CSS dépendante du temps réel.

Pour recomposer le mix, Python 3 et NumPy sont nécessaires :

```sh
python3 scripts/prepare_audio.py
```

Le brief client original est conservé dans `BRIEF-CLIENT.md`. `STORYBOARD.md` intègre sa correction concernant la tenue.

## Nouvelles séquences V2

Le portrait apparaît pendant 12 secondes (0–3, 7–11 et 25–30). Les 18 secondes restantes montrent un ordinateur de bureau animé en perspective, une surface 3D paramétrique, des interfaces de Blender et DaVinci Resolve, puis des compositions produit et paysage.

Les interfaces sont dessinées pour le film : elles ne sont pas des captures des logiciels, et aucun projet `.blend` ou `.drp` n'est prétendument livré. Le modèle paramétrique visible tourne réellement par projection SVG calculée à chaque image. La timeline, le curseur, les images clés, les courbes et les roues colorimétriques sont animés.

Les deux images `public/product-project.png` et `public/coast-project.png` ont été générées pour illustrer des concepts créatifs de cette publicité. Elles ne sont pas présentées comme des réalisations client existantes. Aucun logo de produit ou partenaire n'a été ajouté. La vidéo V1 reste disponible sur la branche Git `codex/tiavina-impact`.
