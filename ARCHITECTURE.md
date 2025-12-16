# Architecture du projet

## Vue d’ensemble
- **Frontend** : Next.js 16 (App Router) + React 19, composants UI shadcn/tailwind. Une page unique `app/page.tsx` rend le composant central `PuzzleSolver`.
- **Backend** : Spring Boot 3 (Java) exposant une API REST `http://localhost:8082/api/solutions` adossée à une base **H2** en mémoire. Génération et validation des solutions côté serveur via un backtracking exhaustif.
- **Données manipulées** : une solution = `id`, `solution` (tableau de 9 entiers 1..9), `equation`, `result`, `status` (`correct`/`incorrect`), `created_at`.

## Frontend (Next.js)
- **Point d’entrée** : `app/page.tsx` affiche `PuzzleSolver` dans un layout simple.
- **Sources clés** :
  - `components/puzzle-solver.tsx` : orchestre le flux (chargement, génération, suppression, édition, filtrage, tri, affichage).
  - `components/puzzle-grid.tsx` : superpose des valeurs sur le SVG `/public/grille.svg` (slots positionnés en pourcentage pour coller au schéma).
  - `components/solution-grid.tsx` : cartes listant les solutions, avec statut, résultat, boutons modifier/supprimer, et la grille visuelle.
  - `components/edit-solution-dialog.tsx` : modal d’édition d’une solution avec 9 inputs (positions), validation serveur lors de l’enregistrement.
  - `components/puzzle-visual.tsx` : aperçu statique de l’énigme via `PuzzleGrid` rempli de `?`.
  - `lib/api.ts` : base API (`NEXT_PUBLIC_API_BASE` ou `http://localhost:8082/api`).
- **API consommée** : `GET/POST/DELETE /solutions` et `DELETE /solutions/{id}`; `PUT /solutions/{id}` pour l’édition.
- **États principaux (puzzle-solver)** :
  - `solutions` (liste issue du backend), `isGenerating`, `isLoading`, `computationTime`, `selectedSolution`, `sortMode` (4 options : fausses d’abord par défaut, vraies d’abord, id croissant/décroissant), `positionFilters` (9 cases, null ou 1..9).
- **Filtrage** : côté client uniquement. On saisit les 9 positions dans une grille d’inputs à gauche; à droite le SVG numeroté affiche les valeurs saisies. Le filtrage conserve les solutions dont chaque position renseignée correspond exactement.
- **Tri** : appliqué après filtrage. Les solutions sont affichées avec le tri choisi, sélecteur placé au-dessus de la grille de solutions.
- **Actions** :
  - Générer & sauvegarder : POST `/solutions` → calcule côté backend, stocke, remonte `solutions`, `count`, `computationTime`.
  - Supprimer tout : DELETE `/solutions`.
  - Supprimer une solution : DELETE `/solutions/{id}`.
  - Éditer : ouvre `EditSolutionDialog`, PUT `/solutions/{id}` avec le tableau de 9 entiers; le backend recalcule équation, résultat, statut, puis renvoie la solution mise à jour.
- **Styles/typo** : Tailwind 4 + thème custom dans `app/globals.css`; composants shadcn (`Button`, `Card`, `Select`, `Input`, etc.).
- **Attention** : le front utilise uniquement l’API Spring définie dans `lib/api.ts`; aucune dépendance Supabase n’est conservée.

## Backend (Spring Boot)
- **Configuration** : `application.properties` → H2 en mémoire (`jdbc:h2:mem:puzzledb`), port 8082, DDL auto `update`, console H2 à `/h2-console`.
- **Modèle** :
  - `PuzzleSolution` (entité JPA) : `id`, `solution` (persisté en chaîne CSV via `IntegerListConverter`), `equation`, `result`, `status` (`SolutionStatus` enum), `created_at` (timestamp auto).
  - `SolutionStatus` : `CORRECT` / `INCORRECT`.
- **DTO** : `SolutionDto` (snake_case à l’export), `UpdateSolutionRequest` (payload PUT).
- **Repository** : `PuzzleSolutionRepository` (JPA) + recherche par `equation` (ilike) avec tri.
- **Services** :
  - `PuzzleSolverService` : backtracking exhaustif sur 9! permutations ; validation (`validate`) applique l’ordre opératoire (multiplication/division avant addition/soustraction), tolérance `1e-6`, formatage d’équation.
  - `SolutionService` : orchestration métier + persistance (tri par `createdAt DESC`). Génère toutes les solutions via `solverService.solve()`, sauvegarde en base, met à jour une solution (revalide, recalcule equation/result/status), supprime tout ou par id.
- **Contrôleur REST** : `SolutionController` (`/api/solutions`)
  - `GET /api/solutions?filter=` : liste en DTO, filtrage sur `equation` (contains, case-insensitive) côté base.
  - `POST /api/solutions` : génère toutes les solutions, sauvegarde, renvoie `solutions`, `count`, `computationTime`.
  - `DELETE /api/solutions` : supprime tout.
  - `GET /api/solutions/{id}` : récupère une solution.
  - `PUT /api/solutions/{id}` : met à jour `solution` (9 entiers), recalcul du résultat et du statut (`correct/incorrect`).
  - `DELETE /api/solutions/{id}` : supprime par id.
- **Flux typique** :
  1) Le front appelle `POST /api/solutions` → le backend calcule toutes les dispositions valides, les insère en base H2, renvoie la liste.
  2) Le front stocke les solutions en mémoire, applique filtrage/tri client-side pour l’affichage.
  3) Toute modification (PUT/DELETE) reflète immédiatement côté serveur et met à jour l’état local.

## Commandes utiles
- **Frontend** : `npm run dev` (Next), `npm run lint`, `npm run build`.
- **Backend** : lancer l’appli Spring Boot (ex: `./mvnw spring-boot:run` si Maven wrapper présent, sinon via IDE/Java). Port 8082 configuré.

## Points d’attention
- Base H2 en mémoire → données perdues à l’arrêt; ajuster la datasource pour de la persistance.
- Deux implémentations d’API coexistent (Supabase/Next et Spring Boot) ; le front actif pointe vers Spring (voir `lib/api.ts`).
- Filtrage client-side uniquement (positionFilters). Pour un filtrage serveur, ajouter des paramètres et la logique associée côté backend.
