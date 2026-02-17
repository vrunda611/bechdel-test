// ===========================
// Translations — EN / FR
// ===========================

const TRANSLATIONS = {
  en: {
    // Header
    infoToggle: "What is the Bechdel Test?",
    langSwitchText: "FR",
    langSwitchHref: "/fr",

    // Hero
    heroPrefix: "Does",
    heroSuffix: "pass the Bechdel Test?",
    inputPlaceholder: "your fav movie",
    findOut: "Find Out",
    searching: "Searching\u2026",

    // Loading
    loadingText: "Consulting the council of cinema",

    // Results
    yes: "Yes!",
    nope: "Nope",
    didYouMean: 'Did you mean "{title} ({year})"?',
    movieTitle: "{title} ({year})",
    seeMore: "See more on BechdelTest.com \u2192",

    // Error
    notFound: "Couldn\u2019t find \u201c{query}\u201d in our database. Try the full title \u2014 we have ~10,700 movies from 1874\u20132026.",
    genericError: "Something went wrong. Please try again.",

    // Info panel
    infoPanelTitle: "What is the Bechdel test?",
    infoPanelDesc: "The Bechdel Test, or Bechdel\u2013Wallace Test, sometimes called the Mo Movie Measure or Bechdel Rule is a simple test which names the following three criteria:",
    rule1: "It has to have at least two named women in it",
    rule2: "Who talk to each other",
    rule3: "About something besides a man",
    wikiLinkText: "Read more on Wikipedia",
    wikiLinkHref: "https://en.wikipedia.org/wiki/Bechdel_test",

    // Footer
    footerCredit: "Made by Vrunda (& Claude \uD83E\uDD2D)",
    footerData: "Data from",
    footerBechdel: "The Bechdel Test was popularized by Alison Bechdel.",

    // Pass/fail descriptors
    passTexts: [
      "Women talked to each other about something other than a man. The bar is low and yet.",
      "Women had a whole conversation without mentioning a single dude. Revolutionary, apparently.",
      "The women in this film acknowledged each other\u2019s existence. Cinema is healing.",
      "Two women spoke and the world didn\u2019t end. Take notes, Hollywood.",
      "Women talking to women about not-men. Groundbreaking. Literally groundbreaking.",
      "The girls are girlbossing, the plot is plotting, and men are simply not involved.",
      "Proof that women can in fact carry a conversation without a man. Shocking, we know.",
      "The women had things to say to each other. And none of it was about Greg.",
      "Somewhere, a woman talked to another woman about literally anything else. We won.",
      "Women existing beyond the male gaze? In THIS economy? Love that for them.",
      "Two named women. One conversation. Zero men mentioned. That\u2019s cinema, baby.",
      "The bare minimum was met and honestly? We\u2019re celebrating.",
      "Women spoke to each other like real humans do. The representation we deserve.",
      "Not a single \u2018but what does he think?\u2019 in sight. A masterpiece of dialogue.",
      "The women in this movie passed the vibe check AND the Bechdel Test.",
      "Women having conversations about stuff that matters to them. Wild concept, huge if true.",
    ],
    failTexts: [
      "Unfortunately the women were busy existing around men.",
      "The women simply did not have time for each other. Too many men to orbit, apparently.",
      "Shockingly, the women forgot to talk to each other. Must\u2019ve been busy being plot devices.",
      "The girlies never got their moment. Hollywood said \u2018not today.\u2019",
      "Two women could have had a chat. The writers said absolutely not.",
      "The women were there. They just\u2026 never spoke. Like decorative houseplants.",
      "Zero woman-to-woman conversations detected. The algorithm is disappointed.",
      "The women\u2019s dialogue budget was apparently spent on the men. Classic.",
      "Another film where women exist exclusively in relation to men. Groundbreaking.",
      "The women were present but narratively invisible. A tale as old as cinema.",
      "She was there. She was named. She just never talked to another her.",
      "The script really said \u2018women talking to women? Not on my watch.\u2019",
      "Turns out the women had nothing to say to each other. Or weren\u2019t allowed to.",
      "The women in this film communicated exclusively through men. Very carrier pigeon of them.",
      "No woman-to-woman dialogue found. The bar was underground and they brought a shovel.",
      "Hollywood once again confirming that women only exist when men are watching.",
    ],
  },

  fr: {
    // Header
    infoToggle: "C\u2019est quoi le test de Bechdel\u00A0?",
    langSwitchText: "EN",
    langSwitchHref: "/",

    // Hero
    heroPrefix: "Est-ce que",
    heroSuffix: "passe le test de Bechdel\u00A0?",
    inputPlaceholder: "ton film pr\u00E9f\u00E9r\u00E9",
    findOut: "D\u00E9couvrir",
    searching: "Recherche\u2026",

    // Loading
    loadingText: "Consultation du conseil du cin\u00E9ma",

    // Results
    yes: "Oui\u00A0!",
    nope: "Non",
    didYouMean: "Vous cherchiez \u00AB\u00A0{title} ({year})\u00A0\u00BB\u00A0?",
    movieTitle: "{title} ({year})",
    seeMore: "Voir plus sur BechdelTest.com \u2192",

    // Error
    notFound: "Impossible de trouver \u00AB\u00A0{query}\u00A0\u00BB dans notre base. Essayez le titre complet \u2014 nous avons environ 10\u00A0700 films de 1874 \u00E0 2026.",
    genericError: "Quelque chose s\u2019est mal pass\u00E9. Veuillez r\u00E9essayer.",

    // Info panel
    infoPanelTitle: "C\u2019est quoi le test de Bechdel\u00A0?",
    infoPanelDesc: "Le test de Bechdel, ou test de Bechdel-Wallace, parfois appel\u00E9 Mo Movie Measure ou r\u00E8gle de Bechdel, est un test simple qui repose sur trois crit\u00E8res\u00A0:",
    rule1: "Le film doit avoir au moins deux femmes nomm\u00E9es",
    rule2: "Qui se parlent entre elles",
    rule3: "\u00C0 propos d\u2019autre chose qu\u2019un homme",
    wikiLinkText: "En savoir plus sur Wikip\u00E9dia",
    wikiLinkHref: "https://fr.wikipedia.org/wiki/Test_de_Bechdel",

    // Footer
    footerCredit: "Cr\u00E9\u00E9 par Vrunda (et Claude \uD83E\uDD2D)",
    footerData: "Donn\u00E9es de",
    footerBechdel: "Le test de Bechdel a \u00E9t\u00E9 popularis\u00E9 par Alison Bechdel.",

    // Pass/fail descriptors
    passTexts: [
      "Des femmes se sont parl\u00E9 d\u2019autre chose que d\u2019un homme. La barre est basse, et pourtant.",
      "Des femmes ont eu une vraie conversation sans mentionner un seul mec. R\u00E9volutionnaire, apparemment.",
      "Les femmes de ce film ont reconnu l\u2019existence de l\u2019autre. Le cin\u00E9ma gu\u00E9rit.",
      "Deux femmes ont parl\u00E9 et le monde ne s\u2019est pas effondr\u00E9. Prends des notes, Hollywood.",
      "Des femmes parlent \u00E0 des femmes de trucs sans rapport avec les hommes. R\u00E9volutionnaire.",
      "Les filles g\u00E8rent, l\u2019intrigue avance, et les hommes ne sont tout simplement pas impliqu\u00E9s.",
      "La preuve que les femmes peuvent avoir une conversation sans un homme. Choquant, on sait.",
      "Les femmes avaient des choses \u00E0 se dire. Et aucune ne concernait Gr\u00E9goire.",
      "Quelque part, une femme a parl\u00E9 \u00E0 une autre femme de litt\u00E9ralement autre chose. On a gagn\u00E9.",
      "Des femmes qui existent au-del\u00E0 du regard masculin\u00A0? Dans CETTE \u00E9conomie\u00A0? On adore.",
      "Deux femmes nomm\u00E9es. Une conversation. Z\u00E9ro homme mentionn\u00E9. \u00C7a, c\u2019est du cin\u00E9ma.",
      "Le strict minimum a \u00E9t\u00E9 atteint et franchement\u00A0? On c\u00E9l\u00E8bre.",
      "Des femmes se sont parl\u00E9 comme de vraies personnes. La repr\u00E9sentation qu\u2019on m\u00E9rite.",
      "Pas un seul \u00AB\u00A0mais qu\u2019est-ce qu\u2019il en pense\u00A0?\u00A0\u00BB en vue. Un chef-d\u2019\u0153uvre de dialogue.",
      "Les femmes de ce film ont pass\u00E9 le vibe check ET le test de Bechdel.",
      "Des femmes qui parlent de trucs qui comptent pour elles. Concept fou, \u00E9norme si vrai.",
    ],
    failTexts: [
      "Malheureusement, les femmes \u00E9taient trop occup\u00E9es \u00E0 exister autour des hommes.",
      "Les femmes n\u2019avaient tout simplement pas le temps de se parler. Trop d\u2019hommes en orbite.",
      "Les femmes ont oubli\u00E9 de se parler. Elles devaient \u00EAtre trop occup\u00E9es \u00E0 faire de la figuration.",
      "Les filles n\u2019ont jamais eu leur moment. Hollywood a dit \u00AB\u00A0pas aujourd\u2019hui\u00A0\u00BB.",
      "Deux femmes auraient pu discuter. Les sc\u00E9naristes ont dit absolument pas.",
      "Les femmes \u00E9taient l\u00E0. Elles n\u2019ont juste\u2026 jamais parl\u00E9. Comme des plantes d\u00E9coratives.",
      "Z\u00E9ro conversation entre femmes d\u00E9tect\u00E9e. L\u2019algorithme est d\u00E9\u00E7u.",
      "Le budget de dialogues f\u00E9minins a apparemment \u00E9t\u00E9 d\u00E9pens\u00E9 pour les hommes. Classique.",
      "Encore un film o\u00F9 les femmes n\u2019existent qu\u2019en relation avec les hommes. R\u00E9volutionnaire.",
      "Les femmes \u00E9taient pr\u00E9sentes mais narrativement invisibles. Un classique du cin\u00E9ma.",
      "Elle \u00E9tait l\u00E0. Elle avait un nom. Elle n\u2019a juste jamais parl\u00E9 \u00E0 une autre elle.",
      "Le sc\u00E9nario a vraiment dit \u00AB\u00A0des femmes qui se parlent\u00A0? Pas sous ma garde\u00A0\u00BB.",
      "Il s\u2019av\u00E8re que les femmes n\u2019avaient rien \u00E0 se dire. Ou n\u2019en avaient pas le droit.",
      "Les femmes de ce film communiquaient exclusivement via les hommes. Tr\u00E8s pigeon voyageur.",
      "Aucun dialogue entre femmes trouv\u00E9. La barre \u00E9tait sous terre et ils ont amen\u00E9 une pelle.",
      "Hollywood confirme une fois de plus que les femmes n\u2019existent que quand les hommes regardent.",
    ],
  },
};
