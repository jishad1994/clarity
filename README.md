# Clarity — Task Management Module

A task management module built with Angular standalone components: a task list, a create/edit
form with a rich-text description, a task details page with nested comments, and a bonus
calendar view of tasks by deadline.

## Angular version

**Angular 21.2** (`@angular/core@^21.2.0`), generated with the current Angular CLI application
builder (`@angular/build`), using standalone components throughout (no `NgModule`s).

## Setup instructions

```bash
npm install
npm start
```

The app runs at `http://localhost:4200`. No environment variables, API keys, or backend
services are required — everything runs client-side.

Other available scripts:

```bash
npm run build   # production build, output to dist/clarity
npm run lint    # angular-eslint
npm test        # vitest unit tests
```


## Packages used

| Package | Purpose |
|---|---|
| `@angular/core`, `common`, `forms`, `router`, `platform-browser`, `compiler` | Angular framework |
| `@ckeditor/ckeditor5-angular` + `ckeditor5` | Rich-text description editor (Bold, Italic, Underline, Bulleted/Numbered List) |
| `angular-calendar` + `date-fns` | Bonus month-view calendar, showing tasks by deadline, color-coded by status |
| `rxjs` | Used at the HTTP/resolver boundary (`TaskService`, route resolver) |
| `tailwindcss` (v4) + `@tailwindcss/postcss` | Styling |
| `zone.js` | Change detection |
| `angular-eslint`, `eslint`, `typescript-eslint`, `prettier` | Linting/formatting (dev only) |
| `vitest`, `jsdom` | Unit testing (dev only) |



## Assumptions made

- **No backend / no persistence beyond a single session.** The brief allows loading tasks from
  either `assets/tasks.json` or an in-memory API, and explicitly says comment persistence isn't
  required. Both tasks and comments are held purely in memory (Angular signals) for the current
  browser session — **refreshing the page reloads the original seed data from
  `assets/tasks.json` and discards any tasks/comments added, edited, or deleted during that
  session.** This was a deliberate reading of "backend persistence not required," not an
  oversight; see the note at the end of this README if session-persistence (e.g. via
  `localStorage`) is expected instead.
- **Comment authorship is free text.** There's no user/auth system in scope, so each comment
  form just asks for a display name typed at submission time rather than pulling from a logged-in
  user.
- **The optional "deadline cannot be in the past" validation is enforced**, since the brief
  listed it as an example of validation to include.
- **The calendar view shows month granularity only** (no week/day views), since the brief's
  requirement is "tasks based on their deadlines," which a month grid satisfies directly.

## Architecture

```
src/app/
├── core/
│   ├── models/     → Task, TaskStatus, Comment interfaces (no `any` anywhere)
│   ├── services/   → TaskService: thin HttpClient wrapper around assets/tasks.json
│   ├── state/      → TaskStore, CommentStore (signals) + route resolver
│   └── utils/      → id generator, deadline validator
├── features/
│   ├── task-list/      → list page, filtering, delete confirmation
│   ├── task-form/       → shared reactive form for create + edit
│   ├── task-details/    → full task view + comments
│   └── calendar-view/   → bonus month view (angular-calendar)
└── shared/          → status badge, confirm dialog, small pipes
```

**State management — Angular signals, not NgRx/MobX.** `TaskStore` and `CommentStore` are
`providedIn: 'root'` services holding private `signal()` state, exposed as read-only signals
and `computed()` selectors (e.g. tasks sorted by deadline, counts per status, a comment tree
per task). Components read state directly in their templates by calling the signal — no
`async` pipes, no manual subscriptions. For a single, flat, client-only data set with plain
CRUD operations, this gives the same core benefit NgRx would (single source of truth, derived
reactive views) without actions/reducers/effects boilerplate that wouldn't pay for itself at
this scale.

**Data loading.** A route resolver (`tasksLoadedResolver`) calls `TaskStore.loadTasks()` before
any task-dependent route activates, which in turn calls `TaskService.fetchTasks()` — the
single `HttpClient.get('assets/tasks.json')` call in the whole app. After that first load,
every component (list, details, form, calendar) reads and mutates tasks purely through
`TaskStore`'s signals; nothing else talks to `HttpClient` directly.

**Comments.** Stored in `CommentStore` as a tree per task (`Comment.replies: Comment[]`). A
single recursive component renders a comment and re-renders itself for each reply, which is
what gives unlimited nesting depth without any extra plumbing. Reply submissions bubble up
through component outputs to the top-level comment list, which is the only place that talks to
`CommentStore`.

**Forms.** One reusable reactive form component serves both `/tasks/new` and
`/tasks/:id/edit`. Validators: `required` on all fields, plus a custom validator rejecting a
deadline earlier than today. CKEditor 5 (`<ckeditor formControlName="description">`) is bound
like any other form control since it implements `ControlValueAccessor`; the stored value is
plain HTML, rendered via `[innerHTML]` on the details page.

## Architecture decisions

**Rich text editor: CKEditor 5, not ngx-quill.** The app initially used `ngx-quill`, per a
common recommendation for Angular rich-text editors. In practice, `ngx-quill@30.1.3` hit a
reproducible Angular AOT compiler error ("Value could not be determined statically") when
referenced in a standalone component's `imports` array, traced to an Ivy metadata issue in how
the package was published rather than anything fixable in application code. `CKEditor 5`
(`@ckeditor/ckeditor5-angular` + `ckeditor5`) was substituted instead, configured with the
`Essentials`, `Paragraph`, `Bold`, `Italic`, `Underline`, and `List` plugins and a matching
toolbar — same four required formatting options, no packaging issue. It runs under the free
`licenseKey: 'GPL'`, which is why a small "Powered by CKEditor" badge appears in the editor;
per CKEditor's own licensing terms this is a required, non-removable part of free/GPL usage
(only a paid commercial license removes it), so it's left in place rather than worked around.

**Calendar: `angular-calendar`.** Chosen because it explicitly lists a broad, forward-leaning
Angular peer range rather than pinning to an old major. Tasks are mapped to `CalendarEvent`
objects (color derived from status), rendered via `mwl-calendar-month-view`, with
`(eventClicked)` routing to the task's details page. Its stylesheet has to be registered via
`angular.json`'s `styles` array rather than a bare `@import` in `styles.css` — the package's
`package.json` restricts which subpaths are importable by name (`exports` field), and its CSS
file isn't one of them; registering it in `angular.json` resolves it as a plain file path
instead, which sidesteps that restriction.

**Styling: Tailwind CSS v4.** Custom design tokens (the `brand` color used for primary actions)
are defined via a `@theme { --color-brand-500: ...; }` block directly in `styles.css`, which is
how Tailwind v4 expects custom theme values to be declared — it no longer reads a
`tailwind.config.js` automatically the way v3 did.
