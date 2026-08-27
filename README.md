# AMP Astro – Draft 6

Diese Version überführt den bereitgestellten HTML-Draft in Astro, ohne das Design neu zu interpretieren.

## Start

```bash
npm install
npm run dev
```

## Content pflegen

### Startseite

`src/content/pages/home.md`

Dort liegen:

- Hero
- CTA-Texte
- Know-how-Texte
- Qualitätsbereich
- Kontakt-CTA

Der Markdown-Body wird im Know-how-Bereich ausgegeben.

### Kompetenzen

`src/content/competencies/*.md`

Jede Datei erzeugt:

- automatisch eine Zeile unter „Unsere Kompetenzen“
- automatisch eine Unterseite unter `/kompetenzen/<dateiname>/`

## Bilder

Hero-Bild:

```yaml
heroImage: "/images/hero-placeholder.svg"
```

Ein echtes Bild einfach nach `public/images/` legen und den Pfad im Markdown ändern.

## CSS

`src/styles/global.css`

Die Benennung ist bewusst verständlich:

### Wiederverwendbar

```css
.button
.button--primary
.button--secondary
.eyebrow
.section-heading
.markdown-content
```

### Komponenten

```css
.site-header
.main-navigation__link
.hero__copy
.hero__visual
.competency-row
.competency-row__title
.quality-card
.contact-banner
```

Neue Komponenten sollten zuerst die wiederverwendbaren Klassen nutzen und nur für spezifisches Verhalten eigene Klassen bekommen.


## Image Showcase direkt unter dem Hero

Die Komponente liegt unter:

`src/components/ImageShowcase.astro`

Der Inhalt wird in `src/content/pages/home.md` gepflegt:

```yaml
showcaseImage: "/images/amp-pruefung.jpg"
showcaseImageAlt: "Industrielle Prüftechnik bei AMP"
showcaseEyebrow: "Prüftechnik im Einsatz"
showcaseCaption: "Präzision, Erfahrung und moderne Technik für anspruchsvolle Prüfaufgaben."
```

Das Bild nutzt `object-fit: cover`, behält also seine Proportionen bei und wird nicht verzerrt.


## Logo im Header

Das Header-Logo ist bewusst als HTML/CSS aufgebaut und benötigt keine Bilddatei:

```astro
<a class="brand" href="/" aria-label="AMP Startseite">
  <span class="brand__name">AMP</span>
  <span class="brand__line"></span>
  <span class="brand__subtitle">Zerstörungsfreie Werkstoffprüfung</span>
</a>
```

Dadurch bleibt das Logo auf allen Auflösungen scharf und kann zentral über CSS angepasst werden.


## Industrial Style Variant

The structure and content model are unchanged.

Only the CSS was adjusted to make the design feel more industrial:

- sharper corners
- stronger separators
- more technical typography
- uppercase navigation labels
- reduced soft shadows
- subtle grid detailing
- flatter competency rows
- square action arrows
- more disciplined spacing
- yellow remains the accent color
