# Education Hub

Svenskt, mobilanpassat appskal för en personlig studie- och planeringsapp. React, TypeScript och Vite med vanlig CSS.

## Starta i VS Code

Öppna den här mappen i VS Code. Installera Node.js (LTS) om det saknas och kör i terminalen:

```sh
npm install
npm run dev
```

Öppna adressen som visas i terminalen. För kontroll och produktionsbygge:

```sh
npm run typecheck
npm run build
npm run preview
```

Projektet innehåller även `pnpm-lock.yaml`, eftersom grundversionen verifierades med pnpm. Med pnpm används `pnpm install`, `pnpm dev`, `pnpm typecheck` och `pnpm build`.

## Struktur och framtida ändringar

- `src/app`: appskal, aktiv vy och bottennavigering. Lägg till nya vyer i `navigation.ts` och `App.tsx`.
- `src/components`: återanvändbara ikoner, tomma tillstånd och snabbmeny.
- `src/features`: en mapp per huvudfunktion. Ändra en vy i dess egen mapp.
- `src/models/entities.ts`: datamodeller. Tidsstämplar är ISO-strängar; kursdatum avses vara YYYY-MM-DD.
- `src/storage/StudyRepository.ts`: asynkront lagringskontrakt för en framtida implementation. Vyerna har ännu ingen datalagring.
- `src/styles/tokens.css`: gemensamma färger, typografi, avstånd och mörkt läge.
- `src/styles/global.css`: layout och komponenternas utseende.
- `public`: framtida statiska resurser som appikoner.

## Omfattning: steg 1 och 2

Navigation, mobilskal, automatiskt ljust/mörkt läge och snabbmeny fungerar. Vyerna är tydliga platshållare. Snabbmenyns två alternativ visar vad som kommer, men öppnar inga formulär. CRUD, lokal lagring, schema, sökning, PWA-installation, databas och inloggning är inte implementerade.

## Granska på mobil

Öppna webbläsarens utvecklarverktyg och välj exempelvis iPhone eller en bredd på 390 px. Prova alla fyra flikar, snabbmenyn, liten skärm, landskap och ljust/mörkt läge. För en fysisk iPhone på samma nätverk kan du använda nätverksadressen från Vite; datorns brandvägg måste tillåta anslutningen. PWA-installation och offlinefunktion kommer i en senare del av fas 1.
