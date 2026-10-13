# TIAVINA NOMENA — CRÉER AVEC IMPACT.

Storyboard technique, tenue jeune demandée par le client — 1080 × 1920, 30 i/s, 900 images, 30,000 secondes.

## Intention et références

Le sujet de la quatrième image reste la référence d’identité. À la demande ultérieure du client (« je veux une tenue jeune »), le costume est remplacé par un t-shirt noir et une veste légère décontractée. La photographie en pull noir sert uniquement de référence de contraste ; l'image « Momentum » suggère l'échelle typographique ; Redmi suggère la profondeur et les courbes. Les visuels reçus ne correspondent pas exactement aux intitulés du brief : aucune publicité North Face ni portrait bleu n'est visible. Aucune marque des références ne sera reproduite.

L'animation est celle des lettres, du cadrage et de la lumière, pas celle du visage. Pas de lèvres animées, pas de rotation de tête inventée, pas de face générée. Le portrait utilisé a été adapté par génération d’image à partir de la référence pour changer sa tenue. Il ne constitue donc pas une conservation pixel pour pixel de la photographie ; la fidélité du visage doit être appréciée sur cette adaptation. Les mouvements dans le film sont ensuite de simples transformations uniformes du portrait, sans animation ni déformation faciale. La parallaxe simule une profondeur de couches ; elle ne recrée pas les côtés du visage absents de la photographie.

Palette : bleu #1246FF ; bleu nuit #03091E ; blanc #F4F5F1 ; graphite #101217 ; argent #ADB4C3. Anton pour la masse condensée ; Inter pour les signatures. Aucun logo de référence. Le mot principal est traité comme une forme spatiale, avec une seconde lecture intégrale lorsqu'il est fortement occulté.

## Géométrie et animation communes

Coordonnées en pixels à partir du coin supérieur gauche. Zone de lecture essentielle x=80–920, y=180–1560 : le côté droit et le bas restent disponibles pour les interfaces des réseaux sociaux. Les grands mots peuvent dépasser cette zone ; nom et signature doivent y tenir.

Profondeur de référence : décor z=-220, mots arrière z=-100, portrait z=0, fragments avant z=+70, signature z=+100. Déplacement relatif arrière 1,25× / portrait 0,65× / avant 1,55× : une caméra latérale de 24 px produit une parallaxe perceptible sans déformer le sujet. Perspective de référence 1400 px, rotations des plans typographiques ±8° ; aucune perspective appliquée au visage.

Entrées en 8–12 images avec accélération rapide puis freinage cubic-bezier(0.16,1,0.3,1), dépassement maximum 3 %. Sorties en 5–7 images. Flou directionnel temporaire uniquement sur les lettres rapides, jamais sur les yeux. La vitesse finale vaut zéro pendant les temps de lecture.

Ordre de compositing : décor → lumière arrière → texte arrière → ombre de contact → portrait détouré → bord lumineux écrêté dans le masque → fragments typographiques avant → signature. Le texte derrière la tête est simplement occulté par l'alpha du portrait, sans masque rectangulaire. Les fragments avant évitent les yeux et la bouche. Bord alpha progressif de 0,7–1,2 px à 1080p, cheveux contrôlés à 200 %.

## Musique et grille

128 BPM, 4/4 : une noire dure 0,46875 s, une mesure 1,875 s. Le film occupe exactement 16 mesures / 64 temps. À 30 i/s un temps fait 14,0625 images : les accents sont calculés depuis leur temps absolu et arrondis, jamais espacés systématiquement de 14 images, ce qui créerait une dérive.

Les coupes imposées à 3, 7, 11, 15, 20 et 25 s ne tombent pas toutes sur une noire. On conserve ces timings et on ajoute des accents de montage à ces instants. La pulsation à 128 BPM continue ; les accents de coupe ne prétendent pas tous être des temps forts de la mesure.

Kick sec et profond, basse courte, clap peu réverbéré, synthé staccato. Pas de texture qui concurrence les consonnes. Musique abaissée de 6–8 dB pendant chaque phrase ; attaques de ducking 60 ms, retour 180 ms. Objectif de mix final : environ -16 LUFS intégrés et plafond -1 dBTP, à mesurer après le montage définitif. La source voix est mono 44,1 kHz ; elle est centrée dans un mix stéréo 48 kHz, sans fausse spatialisation.

## 01 — THE INTRO · 00:00–00:03 · images [0,90[

- 0,00–0,18 : noir presque complet ; montée sub très courte. À 0,18 une lame bleue large de 70 px traverse x=-160 à 1240 en 7 images. Pas de flash blanc plein écran.
- 0,35–1,95 : visage prévu en très gros plan ; centre des yeux (540,700), bas du buste hors cadre. Éclairage latéral bleu depuis la gauche, ombres noires à droite. La lumière est un calque écrêté, pas une modification des traits.
- CREATE : Anton 510 px, blanc bleuté, boîte x=-180, y=430, largeur apparente 1440 px. Arrivée depuis x=-460 avec un étirement X de 1,22 vers 1,00 ; inclinaison -7°. Le milieu des lettres passe derrière la tête ; C et E sont volontairement coupés. Un rappel CREATE de 44 px à (84,1460) garantit la lecture.
- Caméra : poussée unique 100→106 % et translation x=+18 px entre 0,40 et 2,65. Le portrait reste une image rigide ; mots arrière se déplacent davantage.
- Voix prévue : « Tout commence par une idée. » vers 0,35–1,91.
- Son : impact à 0,18 ; sweep de 0,12 à 0,42 ; sub contrôlé sous la phrase. Kick à 0,46875 s puis pulsation régulière.
- Transition 2,80–3,00 : un jambage blanc s'élargit, couvre le cadre en diagonale et devient le fond blanc du plan suivant. Transition par la lettre, sans fondu générique.

## 02 — THE VISION · 00:03–00:07 · images [90,210[

- Portrait : plan poitrine, largeur 870 px, point d'ancrage pieds hors cadre à (560,1850), tête centrée vers (555,700). Fond blanc cassé, ombre elliptique très douce au sol.
- VISION : Anton 360 px graphite, inscrit sur un chemin SVG allant de (-280,710) à (1410,760), avec courbure vers y=350. Il entre de gauche et se courbe progressivement ; la courbure passe de presque plate à une flèche de 240 px en 24 images.
- Entre 3,30 et 5,30 : le mot glisse de 180 px le long du chemin. La tête masque la partie centrale ; les lettres extrêmes restent visibles. Un petit VISION immobile à (84,1400) sert d'ancrage.
- Un arc fin argenté reprend le trajet à l'avant uniquement sous les épaules. Aucun texte ne coupe le regard. Le visage ne subit pas la déformation du SVG.
- Caméra : travelling x=-28→+28 px ; échelle du portrait 98→101 %. Le plan typographique fait une rotation Y de -6→+5°.
- Voix prévue : « Une vision qui sort du cadre. » vers 3,32–5,19.
- Son : clap et whoosh à 3,00 ; sweep panoramique court à 4,22 ; respiration musicale de 5,20 à 6,60.
- Transition 6,80–7,00 : VISION s'étire hors champ ; un aplat bleu poussé par le V révèle la scène suivante.

## 03 — NAME REVEAL · 00:07–00:11 · images [210,330[

- Fond bleu électrique. Portrait décalé à droite : centre x=680, tête y=780, largeur 880 px, veste coupée sous y=1800. Lumière neutre sur le visage, liseré bleu discret côté ombre.
- TIAVINA : Anton 260 px, x=70, y=350, inclinaison -5°. Arrive de x=-1150 entre 7,00 et 7,33. NOMENA : Anton 275 px, x=70, y=690 ; monte de y=2050 vers 690 entre 7,18 et 7,60. Les lettres ont des décalages d'entrée de 1 image maximum, sans effet machine à écrire.
- Le personnage masque une partie des grands noms. Pour éviter toute ambiguïté, la ligne « TIAVINA NOMENA » complète en Inter 58 px reste visible à (80,1450) de 7,80 à 10,20 : 2,4 secondes de lecture stable.
- Fragment avant : la barre d'un N passe devant le bas de la veste entre 7,48 et 7,72, jamais devant les yeux. Retour derrière à la fin de l'entrée.
- Caméra : léger arc de translation x=+16→-16 px ; portrait reste de face, sans rotation du visage. Plan arrière tourne de -3→0°.
- Voix prévue : « Tiavina Nomena. » vers 7,40–8,36.
- Son : bass drop à 7,00 ; punch à 7,18 et 7,60 ; espace sonore ensuite pour la mémorisation du nom.
- Transition 10,80–11,00 : le O de NOMENA s'agrandit en masque et ouvre DESIGN.

## 04 — CREATIVE SKILLS · 00:11–00:15 · images [330,450[

- 11,00–12,33 / DESIGN : fond bleu, portrait à x=655 ; mot blanc Anton 385 px, x=-100, y=520, rotation -11°. Entrée diagonale haut-gauche, 9 images, arrêt franc. Voix « Graphisme. » vers 11,10–11,98 ; impact à 11,00.
- 12,33–13,67 / VIDEO : fond blanc, portrait à x=460, plan poitrine ; mot graphite 365 px étiré X 1,25, y=460. Translation horizontale de +850 vers -100 px, stabilisation 0,65 s. Voix « Vidéo. » vers 12,42–13,16 ; clap sec à 12,33.
- 13,67–15,00 / MOTION : fond bleu nuit, gros plan du portrait ; mot blanc 290 px sur courbe elliptique de rayon visuel 740×260 px autour du haut du buste. Le chemin est scindé en arc arrière et arc avant au niveau de la veste, pour un vrai changement d'occlusion. Voix « Motion design. » vers 13,78–14,94 ; impact à 13,67.
- Caméra : trois cadrages définis, pas trois zooms identiques. DESIGN est un travelling oblique de 20 px ; VIDEO un changement d'échelle en coupe ; MOTION une dérive verticale de 25 px.
- Transitions : DESIGN→VIDEO par wipe vertical de 5 images ; VIDEO→MOTION par compression typographique X pendant 6 images. Flou horizontal de 4 px maximum pendant les déplacements.
- 14,83–15,00 : l'arc de MOTION se retire derrière l'épaule et laisse le noir monter.

## 05 — IDEAS INTO MOTION · 00:15–00:20 · images [450,600[

- Fond bleu noir. Portrait en plan rapproché, largeur 1160 px, visage vers (530,760). Lumière latérale bleue à gauche, reflet argenté très discret sur la veste à droite.
- 15,00–16,67 IMAGINE ; 16,67–18,33 CREATE ; 18,33–20,00 INSPIRE. Anton 385–450 px, y=450, largeur optique 1250 px, centrage avec dépassement de bord de 85 px maximum. Chaque mot possède aussi un rappel intégral de 46 px en bas à gauche.
- Transformation : les glyphes sortants se compressent Y de 1 à 0,12, avec décalage de 2 images entre lettres ; les nouveaux glyphes se déplient depuis la même ligne pendant 10 images. Il s'agit d'une transition graphique contrôlée entre mots, pas d'un morphing prétendu de contours incompatibles. Une version à vrais contours morphés nécessiterait des tracés préparés manuellement.
- Les mots sont derrière les cheveux et les épaules. Une tranche de texte argenté passe à l'avant sous y=1330 ; aucun recouvrement des yeux. Petit mouvement des plans en rotation Y de -7 à +7°, portrait non déformé.
- Caméra : léger roulis du décor -1,5→+1,5°, portrait maintenu vertical ; avance de 3 % seulement.
- Voix prévue : « Des idées qui prennent vie. » vers 15,75–17,45.
- Son : impacts à 15,00 / 16,67 / 18,33 ; synthé montant de 17,40 à 19,70, puis coupure de 100 ms avant le plan suivant.
- Transition 19,80–20,00 : INSPIRE se déploie sur toute la hauteur et révèle le fond clair par son contre-forme.

## 06 — THE IMPACT · 00:20–00:25 · images [600,750[

- 20,00–21,67 RHYTHM : fond blanc, Anton noir 360 px y=390, léger cisaillement -8°. Portrait rapproché décalé à x=600. Le mot arrive de droite, se pose 0,9 s, puis quitte à gauche.
- 21,67–23,33 CREATIVITY : Anton 275 px, deux lignes CREA / TIVITY pour garder de la masse et la lecture mobile, sans diminuer le mot à un sous-titre. Portrait plan poitrine à x=490 ; texte arrière y=360 et y=680. Rappel CREATIVITY intégral en 45 px dans la zone sûre.
- 23,33–25,00 IMPACT : Anton 450 px sur une seule ligne y=400 ; très gros plan du portrait sous le mot. Le I et le T peuvent sortir du cadre, mais IMPACT est repris intégralement à y=1430. Stabilisation de 23,70 à 24,70.
- Le masque du portrait adapté reste identique pour les trois cadrages ; seul son transform uniforme change. Ombres graphiques obliques à l'arrière, jamais une déformation du visage.
- Voix prévue : « Du rythme. » 20,20–21,15 ; « De l'audace. » 21,80–22,84 ; « De l'impact. » 23,55–24,67.
- Son : percussion à 20,00 et 21,67. Silence musical de 23,20 à 23,33, puis impact court à 23,33 ; la réverbération est coupée sous les consonnes de la voix.
- Transition 24,83–25,00 : un trait vertical du M balaie le cadre et installe le bleu final.

## 07 — FINAL SIGNATURE · 00:25–00:30 · images [750,900[

- Fond bleu électrique, studio sans décor parasite. Portrait en tenue jeune centré, plan taille, tête vers (540,800), largeur 850 px. Ombre douce et liseré fin ; visage conserve ses couleurs et proportions.
- Grand bloc arrière sur deux lignes : TIAVINA y=330 puis NOMENA y=600, Anton 265 px. Étirement X 1,08→1,00 entre 25,00 et 25,55. Débordement volontaire limité ; nom complet rappelé en Inter 54 px à (80,1370).
- Signature avant : « CRÉER AVEC IMPACT. », Inter ExtraBold 54 px, x=80, y=1460, largeur maximale 840 px. Apparition par masque horizontal de 27,20 à 27,50, puis immobilité.
- Caméra : retrait élégant 104→100 % de 25,30 à 28,10, puis arrêt. Toutes les lettres stabilisées dès 28,20. Aucun CTA, site ou numéro inventé.
- Voix prévue : « Tiavina Nomena. » 25,75–26,69 ; « Créer avec impact. » 27,35–29,04.
- Son : basse résolue à 25,00, percussion allégée sous la signature, impact final à 29,0625 (temps 62), réverbération courte puis extinction à 29,90. Dernière image tenue jusqu'à 30,00, sans couper le mot « impact ».

## Conformation de la voix fournie

Le MP3 reçu mesure 15,804 s, mono 44,1 kHz. Le texte du brief est la référence éditoriale ; aucune transcription automatique n'a été effectuée. Les bornes suivantes sont déduites des silences détectés et de l'ordre du script : elles constituent un prémontage à valider à l'écoute, pas un alignement sémantique certifié.

| Phrase attendue | Portion source (s) | Départ dans le film (s) |
|---|---:|---:|
| Tout commence par une idée. | 0,00–1,56 | 0,35 |
| Une vision qui sort du cadre. | 2,04–3,91 | 3,32 |
| Tiavina Nomena. | 3,99–4,95 | 7,40 |
| Graphisme. | 5,06–5,94 | 11,10 |
| Vidéo. | 6,05–6,79 | 12,42 |
| Motion design. | 6,87–8,03 | 13,78 |
| Des idées qui prennent vie. | 8,07–9,77 | 15,75 |
| Du rythme. | 9,82–10,77 | 20,20 |
| De l'audace. | 10,80–11,84 | 21,80 |
| De l'impact. | 11,88–13,00 | 23,55 |
| Tiavina Nomena. | 13,03–13,97 | 25,75 |
| Créer avec impact. | 14,01–15,70 | 27,35 |

Ne pas ralentir globalement le fichier à 52,7 % pour remplir 30 secondes : cela changerait le jeu et risquerait d'abîmer la voix. Garder le débit original et redistribuer les pauses. Microfondus de 3 ms aux coupes, uniquement dans les marges silencieuses. Source originale conservée séparément.

## Implémentation et état de livraison

Projet React / Remotion fourni, 30 i/s. Une composition animatique exportable montre la hiérarchie, les courbes SVG, les lettres individuelles, la parallaxe et le montage sonore. Son sujet est une silhouette de placement explicitement signalée : ce n'est pas la publicité finale ni une reproduction du visage.

Le portrait adapté en tenue jeune est fourni dans `public/portrait-cutout.png`. Le rendu `Impact` emploie cette image avec alpha. `ImpactPreview` conserve une silhouette de placement pour examiner séparément la construction typographique. Le détourage, les plans SVG et les calques de lumière restent modifiables ; le PNG original de la photo n'a pas été prétendument retrouvé dans le workspace. Les changements de tenue ont été demandés explicitement par le client.

Contrôles de livraison finale : durée 30,000 s / 900 images, H.264 yuv420p, AAC stéréo 48 kHz, lisibilité du nom, absence de logos de référence, revue des bords de détourage, contrôle à l'écoute des douze segments et mesure du mix. L'export avec portrait est une première version à examiner, notamment pour la ressemblance et le prémontage des phrases. La silhouette n'est jamais présentée comme un portrait final.
