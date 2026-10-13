# Tiavina Nomena — Créer avec impact

Publicité personnelle verticale : 1080 × 1920, 30 i/s, 30 secondes. Projet React / Remotion 4.0.535.

## Livrables

- `STORYBOARD.md` : les sept scènes détaillées, placements typographiques en pixels, masques, mouvements, transitions, grille musicale et voix.
- `renders/Tiavina-Nomena-30s-Vertical.mp4` : première version avec le portrait adapté en tenue jeune.
- `renders/Tiavina-Nomena-sources.zip` : sources modifiables, ressources et storyboard.
- `renders/Tiavina-Nomena-livraison.zip` : vidéo, affiche, storyboard et archive des sources réunis.
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
