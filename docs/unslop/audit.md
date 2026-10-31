# unslop-Audit: Startseite

Skill: [unslop](https://github.com/heydamir/unslop) von Damir Sokolovsky (CC BY 4.0), Checkliste aus `references/signs.md`.
Grundlage: `src/app/page.tsx`, `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`, `src/components/shared/FadeIn.tsx`, `src/app/globals.css` sowie die Screenshots `before-desktop.png` und `before-mobile.png`.

Zeilenangaben beziehen sich auf den Stand vor den Änderungen (Commit `9ea996d`).

## Einstufung

**Mittlere Slop-Stufe.** Die Marke selbst ist echt und frei von Slop: Logo, Primärblau `#103b5c`, Grün `#1c6d26` und Manrope bleiben. Der Slop sitzt in der Umsetzung, also in Verläufen, Farb-Orbs, gesperrten Versal-Labels, fetten Überschriften, generischer Copy und Hover-Bewegungen. Deshalb laufen alle neun Passes, aber die Direction wird aus der bestehenden Marke abgeleitet, statt eine neue zu erfinden.

## Befunde

### Flächen und Farbe

1. Hero-Hintergrund mit Verlauf `bg-gradient-to-br from-primary via-primary to-primary-container`: `src/app/page.tsx:25`
2. Drei unscharfe Farb-Orbs (`blur-3xl`, weiß/tertiary/secondary) hinter dem Hero: `src/app/page.tsx:27-31`
3. Kontakt-CTA mit Verlauf `from-primary via-primary to-tertiary`: `src/app/page.tsx:295`
4. Zwei weitere unscharfe Orbs hinter dem Kontakt-CTA: `src/app/page.tsx:296-299`
5. Glaskarte `bg-white/[0.07] backdrop-blur-sm` für die Sprechzeiten: `src/app/page.tsx:321`
6. Glas-Pills `bg-white/[0.06] backdrop-blur-sm` und Glas-Button `bg-white/[0.08] backdrop-blur-sm` im Hero: `src/app/page.tsx:65`, `:86`
7. Weißer Glow beim Hover der Buttons, `hover:shadow-[0_8px_32px_rgba(255,255,255,0.25)]`: `src/app/page.tsx:58`, `:314`
8. Blau getönte Schatten auf allen Karten, `shadow-[0_20px_40px_rgba(16,59,92,…)]`: `src/app/page.tsx:122`, `:129`, `:136`, `:145`, `:178`, `:228`
9. Header-Button „Anrufen“ mit Verlauf `from-primary to-primary-container` und blauem Glow beim Hover: `src/components/layout/Header.tsx:136`, mobil `:262`
10. Header als Glasfläche `bg-white/60 backdrop-blur-md` mit blau getöntem Schatten beim Scrollen: `src/components/layout/Header.tsx:44-47`, Dropdown `:97`, Mobilmenü `:173`, `:177`
11. Platzhalter-Avatar mit Verlauf `from-primary to-primary-container`: `src/app/page.tsx:240`
12. Zu viele Akzentfarben gleichzeitig: Hellgrün `secondary-fixed` im Eyebrow, Hellblau `tertiary-fixed` in der H1 und im Uhr-Icon, dazu Grün für Icons, Labels und Links: `src/app/page.tsx:36`, `:44`, `:323`
13. Neutrale Flächen leicht violett getönt (`#f4f3f6`, `#eeedf1`, `#e8e7eb`) und damit ohne Bezug zur Praxis: `src/app/globals.css:72-77`

### Typografie

14. Gesperrte Versal-Labels (`uppercase tracking-[0.2em]`) über jeder Sektion: „Zahnarztpraxis in Winsen (Luhe)“, „Willkommen“, „Leistungen“, „Unser Team“: `src/app/page.tsx:36`, `:101`, `:163`, `:208`
15. Gesperrte Versal-Labels im Footer, „Leistungen“, „Sprechzeiten“, „Schnellzugriff“: `src/components/layout/Footer.tsx:54`, `:81`, `:101`
16. `font-bold` (700) auf H1, allen H2, H3, Kennzahlen und dem CTA-Button: `src/app/page.tsx:41`, `:104`, `:124`, `:131`, `:138`, `:147`, `:166`, `:180`, `:211`, `:246`, `:303`, `:314`, `:322`, Footer `:16`
17. Zweifarbige H1, bei der die zweite Zeile wie eine Hervorhebung eingefärbt ist: `src/app/page.tsx:44`
18. Uneinheitliche Größen: 13px-Navigation (`text-[13px]`) neben `text-xs`-Qualifikationen und `text-[2.75rem]`-Überschriften: `src/components/layout/Header.tsx:77`, `:102`, `:114`, `src/app/page.tsx:258`

### Icons

19. `Sparkles` als Deko für „Modernste Technik“: `src/app/page.tsx:137`
20. `Star`, `Shield` und `Heart` als dekorative Icons auf Kennzahl-Karten, 28px und grün eingefärbt statt in Textfarbe: `src/app/page.tsx:123`, `:130`, `:146`
21. Icons in vielen Größen (12, 14, 16, 20, 24, 28px): `src/app/page.tsx:59`, `:68`, `:188`, `:323`, `src/components/layout/Header.tsx:84`, `:152`

### Abstände

22. Krumme Werte abseits des 4px-Rasters: `p-7` (28 ist ok), `py-2.5`, `gap-2.5`, `space-y-3.5`, `px-3.5`, `p-2.5`, `mt-0.5`: `src/app/page.tsx:58`, `:332`, `src/components/layout/Header.tsx:77`, `:97`
23. Hero mit `min-h-screen`, `pt-40` und `mt-20` bei den Pills. Auf dem Desktop bleibt rechts eine leere Fläche ohne Inhalt: `src/app/page.tsx:25`, `:33`, `:80`
24. Sehr große Abstände zwischen Sektionen (`py-36`, also 144px) bei wenig Inhalt, wodurch die Sektionen leer wirken: `src/app/page.tsx:97`, `:159`, `:202`, `:295`
25. Kennzahl-Karten in gleicher Größe mit unterschiedlichem Inhalt (zwei Zahlen, zwei Texte) und ungleichem Rhythmus: `src/app/page.tsx:121-152`

### Copy

26. Generische H1 „Ihre Zahnärzte in Winsen“, die auf jede Praxis im Ort passen würde: `src/app/page.tsx:42-44`
27. Floskel-H2 „Zahnmedizin mit Leidenschaft und Präzision“: `src/app/page.tsx:104-108`
28. Superlativ „modernste Behandlungsmethoden“ und „Modernste Technik“: `src/app/page.tsx:110`, `:139`
29. Ungenaue Kennzahlen „13+ Jahre Erfahrung“ (gemeint ist die Praxis seit 2013) und „10+ Fachbereiche“ (in `content/services.ts` stehen genau 10 Leistungen): `src/app/page.tsx:124-133`
30. Werbliche Button-Texte „Leistungen entdecken“ und „Gesamtes Team kennenlernen“: `src/app/page.tsx:67`, `:221`
31. „Mehr erfahren“ erscheint nur beim Hover und ist auf Touch-Geräten nie zu sehen: `src/app/page.tsx:186-189`
32. Begrüßung als Label („Willkommen“) ohne Informationsgehalt: `src/app/page.tsx:102`

### Komponenten

33. Fünf Chips unter den Hero-Buttons („Implantologie“, „Prophylaxe“ …) doppeln die Leistungssektion und stapeln sich unter den Aktionen: `src/app/page.tsx:79-94`
34. Durchgehend Pills: Buttons, Nav-Hover, Notdienst-Button, Chips und Anrufen-Button sind alle `rounded-full`: `src/app/page.tsx:58`, `:65`, `:86`, `:314`, `src/components/layout/Header.tsx:77`, `:114`, `:128`, `:136`
35. Acht gleich große Leistungskarten mit identischem Aufbau als Template-Raster: `src/app/page.tsx:172-193`
36. Verschachtelte Radien passen nicht: Karte `rounded-xl` (24px) mit Foto `rounded-2xl` (32px) innen: `src/app/page.tsx:228`, `:233`

### Hero und Visuals

37. Der Hero hat kein echtes Bild, nur Verlauf und Orbs, obwohl echte Praxisfotos in `public/images/gallery/` liegen: `src/app/page.tsx:25-31`
38. Alles links gestapelt, rechts daneben eine leere Verlaufsfläche: `src/app/page.tsx:33-95`
39. Teamkarten der Assistentinnen ohne die vorhandenen Fotos (`content/team.ts` hat `image` für alle): `src/app/page.tsx:276-288`

### Bewegung

40. `transition-all duration-500` mit `hover:-translate-y-1` und wachsendem Schatten auf den Leistungskarten: `src/app/page.tsx:178`
41. `transition-all` auf Buttons und Header: `src/app/page.tsx:58`, `:65`, `:314`, `src/components/layout/Header.tsx:44`, `:91`, `:136`, `:166`
42. Mobile Untermenüs animieren `max-height` (Layout-Eigenschaft): `src/components/layout/Header.tsx:217-220`
43. `FadeIn` mit eigener Easing-Kurve, 0.7s und gestaffelten Delays auf jedem Block. Wegen `initial={false}` passiert sichtbar nichts, es kostet aber Client-JS: `src/components/shared/FadeIn.tsx:16-24`, verwendet in `src/app/page.tsx` 14-mal

## Summe

43 Befunde in 9 Gruppen.
