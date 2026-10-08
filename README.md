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
- `src/storage/StudyRepository.ts`: asynkront lagringskontrakt för en framtida implementation. Anteckningar använder LocalNotesRepository.ts bakom detta kontrakt. useNotes.ts hanterar React-tillstånd; NoteEditor.tsx hanterar formuläret. Valfria kurs- och projekt-ID bevaras vid redigering, men visas ännu inte i gränssnittet.
- `src/styles/tokens.css`: gemensamma färger, typografi, avstånd och mörkt läge.
- `src/styles/global.css`: layout och komponenternas utseende.
- `public`: framtida statiska resurser som appikoner.

## Omfattning: steg 1–4

Navigation, mobilskal, automatiskt ljust/mörkt läge och snabbmeny fungerar. Anteckningar kan skapas, läsas, redigeras och tas bort med bekräftelse. Senast ändrade visas först. Anteckningar lagras lokalt per webbläsare och adress; localhost och nätverksadressen har separata data. Uppgifter kan skapas, redigeras, flyttas mellan Idag/Senare/Klart och tas bort med bekräftelse. Kryssrutan flyttar en uppgift till Klart; avmarkering flyttar den till Idag. Uppgifter lagras separat från anteckningar. Startsidan och studievyn är fortfarande platshållare. Schema, sökning, PWA-installation, databas och inloggning är inte implementerade.

## Granska på mobil

Öppna webbläsarens utvecklarverktyg och välj exempelvis iPhone eller en bredd på 390 px. Prova alla fyra flikar, snabbmenyn, liten skärm, landskap och ljust/mörkt läge. För en fysisk iPhone på samma nätverk kan du använda nätverksadressen från Vite; datorns brandvägg måste tillåta anslutningen. PWA-installation och offlinefunktion kommer i en senare del av fas 1.

## Tester för anteckningar

Kör `node --test tests/notes.test.mjs` med Node.js 24 eller senare. Testerna täcker skapa, läsa, redigera, radering, ordning, omladdning, framtida kopplingar, trasiga data och blockerad/full lagring. Lagringsfel ändrar inte listan och formuläret behåller texten vid sparfel.


## Uppgifter

- `src/features/tasks/TasksView.tsx`: grupper och tomma lägen.
- `TaskRow.tsx`: kryssruta, titel och skapandedatum.
- `TaskEditor.tsx`: titel, status och bekräftad radering. Inmatning behålls vid sparfel.
- `useTasks.ts`: tillstånd, asynkrona ändringar och felhantering.
- `taskStatus.ts`: statusnamn och statusändringar.
- `src/storage/LocalTasksRepository.ts`: versionerad lokal lagring bakom samma EntityRepository-kontrakt som anteckningar. Kurs- och projekt-ID bevaras men exponeras inte i formuläret.

Kör samtliga lagringstester med Node.js 24 eller senare:

```sh
node --test tests/notes.test.mjs tests/tasks.test.mjs
```

Steg 4 ligger på `feature/tasks`. Ingen commit eller merge görs automatiskt.
