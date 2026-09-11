// TODO: Find a way to retrieve that configuration from the astro config!

export const languages = {
    en: "En",
    de: "De",
  };
  
  export const defaultLang = "de";
  
  export const ui = {
    en: {
      "nav.home": "Home",
      "nav.about": "About",
      "nav.twitter": "Twitter",
    },
    de: {
      "nav.home": "Accueil",
      "nav.about": "À propos",
    },
  } as const;