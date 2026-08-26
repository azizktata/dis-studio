/**
 * Shared content for the three landing-page concepts.
 *
 * Data and copy only — no styling. Each version imports what it needs and
 * presents it through its own art direction.
 */

/* ------------------------------------------------------------------ *
 * Imagery
 *
 * Two distinct layers, kept apart on purpose (design-ref §6B):
 *   - `ambience`  Unsplash photography. Heroes and section backgrounds ONLY.
 *   - `realWork`  Actual DIS Studio deliverables. Portfolio grid ONLY.
 *
 * They must never share a grid: the site may not imply stock interiors are
 * the studio's own work. A single credit line in the footer covers Unsplash.
 * Every ambience image below was downloaded and visually checked for warm,
 * architectural fit against the bone/clay palette before being listed.
 * ------------------------------------------------------------------ */

/*
 * Served from `public/ambiance/`, downloaded by scripts/fetch-ambience.mjs.
 * Hotlinking Unsplash meant every hero depended on a live third-party fetch;
 * when that fetch was slow the image optimiser timed out and the section
 * rendered blank. The footer credit still applies: these are Unsplash photos.
 */
const unsplash = (key: string) => `/ambiance/${key}.jpg`;

export type Ambience = {
  key: string;
  src: string;
  alt: string;
};

export const ambience = {
  heroSalon: {
    key: "heroSalon",
    src: unsplash("heroSalon"),
    alt: "Séjour lumineux, murs os, cuir fauve et lumière naturelle rasante",
  },
  sejourBois: {
    key: "sejourBois",
    src: unsplash("sejourBois"),
    alt: "Séjour contemporain, menuiseries bois et grandes baies vitrées",
  },
  salonEditorial: {
    key: "salonEditorial",
    src: unsplash("salonEditorial"),
    alt: "Salon éditorial aux tons sable et lin",
  },
  archiVerriere: {
    key: "archiVerriere",
    src: unsplash("archiVerriere"),
    alt: "Espace de vie ouvert, sol bois et verrière pleine hauteur",
  },
  salonBois: {
    key: "salonBois",
    src: unsplash("salonBois"),
    alt: "Séjour ouvert avec paroi de bois et cheminée",
  },
  linTerracotta: {
    key: "linTerracotta",
    src: unsplash("linTerracotta"),
    alt: "Détail de lin terracotta sur tête de lit en chêne clair",
  },
  chambreChaude: {
    key: "chambreChaude",
    src: unsplash("chambreChaude"),
    alt: "Chambre claire, textiles crème et banc en noyer",
  },
  salonPoutres: {
    key: "salonPoutres",
    src: unsplash("salonPoutres"),
    alt: "Séjour cathédrale, poutres apparentes et baies cintrées",
  },
  /*
   * The B2B block sells production capacity, not a finished room: this shows
   * drawing work in progress. No identifiable faces, per design-ref §6B.
   */
  atelierDessin: {
    key: "atelierDessin",
    src: unsplash("atelierDessin"),
    alt: "Plan technique annoté sur une table de travail, crayons et ordinateurs",
  },
} satisfies Record<string, Ambience>;

/* ------------------------------------------------------------------ *
 * Real client work — public/DIS STUDIO/
 *
 * The only imagery the client supplied is 3D product work (yacht, camion).
 * The interior projects exist as PDF drawing sets, so they are represented
 * as typeset entries rather than pictures. Honest, and it keeps the
 * portfolio grid free of stock photography.
 * ------------------------------------------------------------------ */

export type Category =
  | "Résidentiel"
  | "Tertiaire / Bureaux"
  | "Culturel / Institutionnel"
  | "3D spécialisée / Produit";

export type Project = {
  slug: string;
  title: string;
  category: Category;
  software: string;
  year: string;
  location: string;
  summary: string;
  /**
   * Renders extracted from the client's PDF deliverables by
   * `scripts/extract-pdf-images.mjs`. First entry is the card image.
   */
  images?: string[];
  /**
   * Keep this project's images out of the gallery grid. The gallery is for
   * coloured 3D views; dimensioned drawings belong on the project card and in
   * the lightbox, where their detail is readable.
   */
  drawingsOnly?: boolean;
  /** Sheets in the delivered drawing set — used when there is no render. */
  sheets?: number;
  deliverable: string;
};

const shot = (slug: string, n: number) =>
  `/projets/${slug}/${String(n).padStart(2, "0")}.jpg`;

/**
 * Every page of a rendered dossier, in order.
 *
 * Written by `scripts/render-dossiers.mjs` as `p01.jpg …`. Kept separate from
 * `shot()` because these are complete documents the visitor pages through,
 * not a curated selection.
 *
 * Both wrappers are dropped. Page 1 is a near-blank cover carrying only the
 * document title, and the last page is a « MERCI POUR VOTRE ATTENTION » slide
 * — neither is a drawing, and the cover made a poor card thumbnail. `pages` is
 * the PDF's own page count, so the drawing sheets are pages 2 … n-1.
 */
const dossier = (slug: string, pages: number) =>
  Array.from(
    { length: pages - 2 },
    (_, i) => `/projets/${slug}/p${String(i + 2).padStart(2, "0")}.jpg`,
  );

/*
 * Order is deliberate: the interior work leads, because that is what the studio
 * sells. The 3D product study (yacht + van, one merged entry) closes the list
 * and keeps its renders off the page — they read as the wrong studio next to
 * interiors — so they appear only when the card is opened.
 */
export const projects: Project[] = [
  {
    slug: "villa-wabi-sabi",
    title: "Villa wabi-sabi",
    category: "Résidentiel",
    software: "3ds Max",
    year: "2024",
    location: "Tunisie",
    summary:
      "Séjour et circulation en bois clair, pierre et lin : une matière chaude tenue d'un bout à l'autre.",
    images: [shot("villa-wabi-sabi", 1), shot("villa-wabi-sabi", 2), shot("villa-wabi-sabi", 3)],
    deliverable: "Concept + rendus · 3 vues",
  },
  {
    slug: "villa-contemporaine",
    title: "Villa contemporaine",
    category: "Résidentiel",
    software: "3ds Max · Revit",
    year: "2024",
    location: "Tunisie",
    summary:
      "Villa complète : séjour, salle à manger, cuisine ouverte et dressing, du concept jusqu'aux plans d'exécution.",
    images: [
      shot("villa-contemporaine", 3),
      shot("villa-contemporaine", 1),
      shot("villa-contemporaine", 2),
      shot("villa-contemporaine", 4),
      shot("villa-contemporaine", 5),
      shot("villa-contemporaine", 6),
    ],
    deliverable: "Concept + plans · 6 vues",
  },
  {
    slug: "villa-neoclassique",
    title: "Villa néoclassique",
    category: "Résidentiel",
    software: "3ds Max",
    year: "2024",
    location: "Tunisie",
    summary:
      "Double hauteur, marbre et laiton : un registre classique tenu sans lourdeur, du séjour à la chambre.",
    images: [
      shot("villa-neoclassique", 1),
      shot("villa-neoclassique", 2),
      shot("villa-neoclassique", 3),
      shot("villa-neoclassique", 4),
    ],
    deliverable: "Concept + rendus · 4 vues",
  },
  {
    slug: "dossier-villa",
    title: "Villa, dossier d'exécution",
    category: "Résidentiel",
    software: "SketchUp",
    year: "2022",
    location: "Tunisie",
    summary:
      "Chambre, dressing, salle de bain et cuisine : plan, élévations et vues 3D réunis sur une planche par pièce.",
    images: [
      shot("dossier-chambre", 1),
      shot("dossier-dressing", 1),
      shot("dossier-sdb", 1),
      shot("dossier-cuisine", 1),
    ],
    drawingsOnly: true,
    deliverable: "Dossier d'exécution · 4 planches",
  },
  {
    slug: "showroom-jeremy",
    title: "Matériauthèque & showroom",
    category: "Tertiaire / Bureaux",
    software: "SketchUp",
    year: "2022",
    location: "France",
    summary:
      "Mobilier sur mesure coté au millimètre : comptoir, claustra, banque d'accueil et rangements d'atelier.",
    /* The complete dossier, browsable page by page. */
    images: dossier("showroom-jeremy", 30),
    drawingsOnly: true,
    deliverable: "Dossier d'exécution · 28 planches",
  },
  {
    slug: "showroom-siceram",
    title: "Showroom céramique",
    category: "Tertiaire / Bureaux",
    software: "3ds Max",
    year: "2023",
    location: "Tunisie",
    summary:
      "Parcours d'exposition et linéaires d'échantillons pour un showroom de revêtements.",
    images: [shot("showroom-siceram", 1), shot("showroom-siceram", 2)],
    deliverable: "Concept + rendus · 10 vues",
  },
  {
    slug: "mareli",
    title: "Buanderie & rangements",
    category: "Résidentiel",
    software: "SketchUp",
    year: "2022",
    location: "France",
    summary:
      "Buanderie et rangements en stratifié : caissons, étagères et façades push-to-open, cotés pour l'atelier.",
    images: dossier("mareli", 22),
    drawingsOnly: true,
    deliverable: "Dossier de consultation · 20 planches",
  },
  {
    /* Vector AutoCAD sheets, rasterised by scripts/render-pdf-pages.mjs. */
    slug: "plans-habitation",
    title: "Habitation, plans",
    category: "Résidentiel",
    software: "AutoCAD",
    year: "2023",
    location: "Tunisie",
    summary:
      "Plans d'aménagement, plans de masse et façades pour villas et studios, cotés et prêts pour le chantier.",
    images: [
      shot("plans-habitation", 1),
      shot("plans-habitation", 2),
      shot("plans-habitation", 3),
    ],
    drawingsOnly: true,
    deliverable: "Dossier d'exécution · 21 planches",
  },
  {
    slug: "maison-de-culture",
    title: "Maison de culture",
    category: "Culturel / Institutionnel",
    software: "AutoCAD",
    year: "2023",
    location: "Tunisie",
    summary:
      "Salle de spectacle de 350 places, bibliothèque et clubs : zoning, aménagement, coupes et façades.",
    images: [
      shot("maison-de-culture", 1),
      shot("maison-de-culture", 2),
      shot("maison-de-culture", 3),
    ],
    drawingsOnly: true,
    deliverable: "Dossier technique · 13 planches",
  },
  /*
   * The remaining execution dossiers, rendered page by page by
   * scripts/render-dossiers.mjs. All `drawingsOnly` — 165 technical sheets
   * would bury the rendered interiors in the gallery.
   */
  {
    slug: "maurice-bares",
    title: "Résidence, aménagement complet",
    category: "Résidentiel",
    software: "SketchUp",
    year: "2023",
    location: "France",
    summary:
      "Cuisine, dégagements et rangements sur mesure : le dossier le plus complet, pièce par pièce.",
    images: dossier("maurice-bares", 70),
    drawingsOnly: true,
    deliverable: "Dossier d'exécution · 68 planches",
  },
  {
    slug: "joana",
    title: "Chambres & dressings",
    category: "Résidentiel",
    software: "SketchUp",
    year: "2023",
    location: "France",
    summary:
      "Bureau de chambre, penderies et niches en MDF plaqué chêne : élévations et perspectives cotées.",
    images: dossier("joana", 24),
    drawingsOnly: true,
    deliverable: "Dossier d'exécution · 22 planches",
  },
  {
    slug: "joanna-dayan",
    title: "Meuble encastré & cheminée",
    category: "Résidentiel",
    software: "SketchUp",
    year: "2022",
    location: "France",
    summary:
      "Bibliothèque encastrée avec panneaux coulissants : perspective, coupes et détails de fixation invisible.",
    images: dossier("joanna-dayan", 8),
    drawingsOnly: true,
    deliverable: "Dossier de consultation · 6 planches",
  },
  {
    slug: "pharmacie-juan",
    title: "Pharmacie, mobilier commercial",
    category: "Tertiaire / Bureaux",
    software: "SketchUp",
    year: "2023",
    location: "France",
    summary:
      "Linéaires sur rails aluminium, étagères verre et stratifié noir mat : agencement complet d'officine.",
    images: dossier("pharmacie-juan", 7),
    drawingsOnly: true,
    deliverable: "Dossier d'exécution · 5 planches",
  },
  {
    slug: "eleonore",
    title: "Bibliothèque sur mesure",
    category: "Résidentiel",
    software: "SketchUp",
    year: "2022",
    location: "France",
    summary:
      "Étagères et socle en chêne naturel : plan, face, perspective et détails de fixation, cotés au millimètre.",
    images: dossier("eleonore", 4),
    drawingsOnly: true,
    deliverable: "Dossier d'exécution · 2 planches",
  },
  {
    /* Yacht and van merged: same discipline, same story. A 3ds Max render is
       the card thumbnail; the rest of the set opens in the lightbox. */
    slug: "modelisation-produit",
    title: "Modélisation produit",
    category: "3D spécialisée / Produit",
    software: "3ds Max",
    year: "2024",
    location: "Tunisie",
    summary:
      "Volumes et matières hors bâtiment : aménagement d'un yacht et mise en situation d'un porteur utilitaire.",
    images: [
      shot("modelisation-produit", 1),
      shot("modelisation-produit", 2),
      shot("modelisation-produit", 3),
      shot("modelisation-produit", 4),
      shot("modelisation-produit", 5),
      shot("modelisation-produit", 6),
    ],
    drawingsOnly: true,
    deliverable: "Modélisation 3D · 11 vues",
  },
];

export const categories: Category[] = [
  "Résidentiel",
  "Tertiaire / Bureaux",
  "Culturel / Institutionnel",
  "3D spécialisée / Produit",
];

/* ------------------------------------------------------------------ *
 * Services, software, studio
 * ------------------------------------------------------------------ */

export type Service = {
  index: string;
  title: string;
  summary: string;
  detail: string[];
};

/*
 * The four steps of the collaboration, as supplied by the client. Same shape as
 * before, so both versions render them without any component change.
 */
export const services: Service[] = [
  {
    index: "01",
    title: "Analyse & prise de brief",
    summary:
      "Nous recevons le mandat, les besoins, les standards, les fichiers existants et les contraintes du client professionnel.",
    detail: [
      "Rencontre découverte",
      "Analyse des besoins",
      "Cahier des charges",
      "Validation des objectifs",
    ],
  },
  {
    index: "02",
    title: "Conception & production",
    summary:
      " Le projet est confié au designer de notre équipe dont les compétences correspondent le mieux au mandat. La production est réalisée selon les logiciels, standards et exigences convenus avec le client.",
    detail: [
      "Conception sur mesure",
      "Plans techniques 2D",
      "Modélisation 3D",
      "Choix des matériaux",
    ],
  },
  {
    index: "03",
    title: "Révision & validation",
    summary:
      "DIS Studio vérifie les livrables avant leur transmission. Les ajustements nécessaires sont effectués jusqu’à validation.",
    detail: [
      "Contrôle qualité",
      "Présentation au client",
      "Modifications",
      "Validation finale",
    ],
  },
  {
    index: "04",
    title: "Livraison & accompagnement",
    summary:
      "Les fichiers finaux et fichiers sources sont remis au client professionnel dans les formats convenus, prêts à être intégrés à son projet, transmis à son équipe, à l’atelier ou au chantier.",
    detail: [
      "Plans d'exécution",
      "Dossier technique complet",
      "Rendus finaux",
      "Assistance et suivi",
    ],
  },
];

export type Software = {
  name: string;
  use: string;
};

export const software: Software[] = [
  { name: "AutoCAD", use: "Plans 2D, dessins techniques, documentation" },
  { name: "3ds Max", use: "Modélisation 3D, visualisation et rendus" },
  { name: "Revit", use: "Modélisation BIM et plans coordonnés" },
  { name: "SketchUp", use: "Conception et modélisation rapide des espaces" },
];

export const studio = {
  name: "DIS Studio",
  /* « DIS Studio » is the brand; everywhere else the copy says what we do. */
  tagline: "Conception, dessin technique et modélisation 3D",
  positioning:
    "DIS Studio prend en charge la conception, le dessin technique et la modélisation 3D des firmes de design, cabinets d'architecture et fabricants de mobilier, comme une extension de leur équipe.",
  /* Hero copy lives here: the client has revised it twice, so one source. */
  /*
   * One headline per hero slide, changing with the image. Each is two lines —
   * a plain first line and a gold second — so the block never reflows to three.
   * Order runs from what DIS Studio *is*, to what it *does*, to the scope.
   */
  heroTitles: [
    { lead: "Une équipe de conception", accent: "qui renforce la vôtre." },
    { lead: "Le partenaire technique", accent: "des firmes de design." },
    // { lead: "Vous concevez.", accent: "Nous donnons vie à vos projets." },
    { lead: "De la première esquisse", accent: "aux plans d'exécution." },
  ],
  heroLede:
    "Augmentez votre capacité de production grâce à une équipe technique qui s’intègre à la vôtre: Conception, dessin technique et modélisation 3D pour les firmes de design, cabinets d’architecture, fabricants de mobilier et entreprises d’aménagement.",
  location: "UPTON,QUÉBEC J0H2E0 CANADA",
  email: "contact@disstudio.tn",
  /* Earliest delivered project. Must never post-date the portfolio. */
  since: "2022",
};

export const b2b = {
  title: "Pour les professionnels de l'aménagement",
  /* Short enough to hold two lines at the display size. */
  lede: "Une équipe de conception qui renforce la vôtre",
  body: "DIS Studio accompagne les firmes de design, les cabinets d'architecture, les fabricants de mobilier et les entreprises d'aménagement en prenant en charge une partie ou la totalité de leurs besoins en conception, dessin technique et modélisation 3D. Nous agissons comme une extension de votre équipe, pour livrer vos projets plus rapidement sans embaucher.",
  points: [
    {
      title: "Une collaboration discrète et confidentielle",
      body: "Vous demeurez le seul point de contact avec votre client. Tout est produit selon vos standards, vos méthodes et votre image de marque.",
    },
    {
      title: "Des livrables prêts à être utilisés",
      body: "Plans techniques 2D, modélisation et rendus 3D, plans de fabrication, détails de mobilier sur mesure et documentation technique, directement exploitables par vos équipes et vos entrepreneurs.",
    },
    {
      title: "Une solution flexible selon vos besoins",
      body: "D'un seul dessin au développement complet d'un projet, nous ajustons notre capacité à votre charge de travail.",
    },
  ],
  /* Typeset as a ruled list, never as pills. ✓ is a text marker, not an emoji. */
  reasonsTitle: "Pourquoi choisir DIS Studio",
  /*
   * Capacity and deadlines moved up to `whyDis`, which now answers those two
   * points before the visitor reaches this section. Repeating them here would
   * make the page say the same thing twice.
   */
  reasons: [
    "une capacité de conception externalisée et flexible qui vient renforcer les équipes des entreprises clientes.",
    "Confiez vos projets à une équipe spécialisée en design et en documentation technique.",
    "Recevez des livrables professionnels, conformes à vos exigences.",
    "Travaillez avec un partenaire qui s'intègre à votre façon de travailler.",
  ],
};

/*
 * The three benefits a prospect weighs before asking for a quote. Sits
 * directly under the intro so it answers "pourquoi DIS ?" while the visitor is
 * still learning who they are — the hero CTA points straight at it.
 */
export const whyDis = {
  label: "Pourquoi DIS",
  title: "Ce que vous gagnez à travailler avec nous.",
  /*
   * A delivered commercial interior, not an ambience photo. The section claims
   * production capability, and a showroom of this scale is better evidence of
   * it than a domestic room. Its dark ceiling also gives the gold watermark
   * something to sit against. Sheet 02 of this project is deliberately not
   * used: it carries the end client's own signage, which would compete with
   * the DIS mark laid over it. Landscape source — never crop it portrait.
   */
  image: {
    src: shot("showroom-siceram", 1),
    alt: "Showroom de revêtements : présentoirs de dalles, éclairage sur rail et parcours d'exposition",
  },
  benefits: [
    {
      index: "01",
      title: "Plus de capacité",
      body: "Augmentez votre capacité de production sans recruter de nouvelles ressources.",
    },
    {
      index: "02",
      title: "Plus de rapidité",
      body: "Respectez vos échéanciers, même lors des périodes de forte charge de travail.",
    },
    {
      index: "03",
      title: "Plus de rentabilité",
      body: "Réduisez vos coûts fixes et bénéficiez d'une équipe technique flexible selon vos besoins.",
    },
  ],
};

/* ------------------------------------------------------------------ *
 * Intake wizard (tunnel de demande)
 * ------------------------------------------------------------------ */

export type ServiceKey = "design" | "plans2d" | "rendus3d" | "b2b";

export const intakeServices: {
  key: ServiceKey;
  label: string;
  hint: string;
}[] = [
  {
    key: "design",
    label: "Design complet",
    hint: "Concept, aménagement et matières pour un lieu entier",
  },
  {
    key: "plans2d",
    label: "Plans 2D",
    hint: "Plans techniques, coupes, façades et documentation",
  },
  {
    key: "rendus3d",
    label: "Rendus 3D",
    hint: "Modélisation et images d'ambiance ou de produit",
  },
  {
    key: "b2b",
    label: "Partenaire technique (B2B)",
    hint: "Capacité de conception pour une firme de design ou un fabricant",
  },
];

export const surfaces = [
  "Moins de 50 m²",
  "50 – 120 m²",
  "120 – 300 m²",
  "Plus de 300 m²",
];

export const timelines = [
  "Dès que possible",
  "Sous 1 à 3 mois",
  "Sous 3 à 6 mois",
  "Pas encore arrêté",
];

export const budgets = [
  "Moins de 5 000 $",
  "5 000 – 15 000 $",
  "15 000 – 40 000 $",
  "À définir ensemble",
];

export const b2bVolumes = [
  "Une planche ponctuelle",
  "Un dossier complet",
  "Plusieurs projets par mois",
  "Collaboration continue",
];

export const b2bSoftware = ["AutoCAD", "3ds Max", "Revit", "SketchUp"];

/* ------------------------------------------------------------------ *
 * Espace client preview
 * ------------------------------------------------------------------ */

export const requestStages = [
  "Soumise",
  "En étude",
  "En cours",
  "Terminée",
] as const;

export const portalRequest = {
  reference: "DIS-2026-087",
  title: "Villa contemporaine, étage",
  service: "Design complet",
  stageIndex: 2,
  updated: "il y a 2 jours",
};

export const portalDocuments = [
  {
    name: "Plan d'aménagement, étage",
    kind: "PDF",
    size: "2,4 Mo",
    date: "12 mars",
  },
  {
    name: "Rendu séjour, vue 01",
    kind: "JPG",
    size: "4,1 Mo",
    date: "09 mars",
  },
  {
    name: "Coupe AA, détails",
    kind: "PDF",
    size: "1,7 Mo",
    date: "02 mars",
  },
];

export const portalMessages = [
  {
    from: "DIS Studio",
    body: "Les plans de l'étage sont déposés. Nous attendons votre retour sur l'implantation de la salle d'eau.",
    at: "12 mars",
  },
  {
    from: "Vous",
    body: "Parfait. Je regarde ça cette semaine et je reviens vers vous.",
    at: "12 mars",
  },
];

export const loyalty = {
  points: 640,
  nextAt: 750,
  rewards: [
    { at: 500, label: "Rendu panorama 3D offert", unlocked: true },
    { at: 750, label: "Planche de matières sur mesure", unlocked: false },
    { at: 1200, label: "Visite virtuelle du projet", unlocked: false },
  ],
};

/* ------------------------------------------------------------------ *
 * Chatbot — scripted, no API
 * ------------------------------------------------------------------ */

export const chatIntro =
  "Bonjour. Je réponds aux questions courantes sur nos services, nos délais et le suivi de projet.";

export const chatScript: { q: string; a: string }[] = [
  {
    /*
     * No fixed turnaround here on purpose: DIS Studio has not committed to an
     * SLA, and a promise the team can miss costs more than a careful answer.
     */
    q: "Quels sont vos délais pour des rendus 3D ?",
    a: "Le délai dépend du nombre de vues, de la complexité du modèle et de l'état des fichiers de départ. Nous confirmons un échéancier précis à la réception de votre demande, et nous replanifions volontiers les projets urgents.",
  },
  {
    q: "Comment fonctionne la collaboration avec les firmes de design ?",
    a: "Vous nous transmettez vos gabarits et vos références ; nous produisons à votre charte et vous livrons des fichiers sources exploitables. Les livrables partent sous votre nom, et vous demeurez le seul point de contact avec votre client. Nous prenons aussi bien une planche isolée qu'un dossier d'exécution complet.",
  },
  {
    q: "Puis-je suivre mon projet en ligne ?",
    a: "Oui. Chaque demande ouvre un espace client où vous suivez l'avancement, échangez avec l'équipe et téléchargez les documents au fur et à mesure. Vous recevez un courriel à chaque changement d'étape.",
  },
];

export const chatFallback =
  "Je n'ai pas la réponse à celle-là. Écrivez-nous à contact@disstudio.tn ou ouvrez une demande : nous revenons vers vous rapidement.";

export const photoCredit =
  "Photographies d'ambiance : Unsplash. Les projets présentés dans le portfolio sont des réalisations DIS Studio.";
