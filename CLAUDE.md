# Investment Projection Dashboard

## Commands
- `pnpm dev` — start Vite dev server
- `pnpm build` — production build
- `pnpm lint` — ESLint (flat config, ESLint 9)
- `pnpm preview` — preview production build

## Tech Stack
- React 19, Vite 6, pnpm
- Redux Toolkit for state management
- Chakra UI v3 + Emotion + Framer Motion
- No TypeScript — plain JSX files
- No test framework configured yet

## Project Structure
```
src/
  main.jsx              # Entry point: StrictMode > react-redux Provider > ChakraProvider > App
  components/           # Feature components
    App.jsx
    notification/       # Notification feature (slice + component + types)
  store/                # Redux store
    index.js            # configureStore
    rootReducer.js      # combineReducers (register new slices here)
  ui/                   # Chakra UI v3 primitives (provider, toaster, tooltip, color-mode)
```

## Conventions

### State Management
- One Redux slice per feature, co-located with its component in `src/components/<feature>/`
- Export actions + default-export reducer from each slice file
- Register new reducers in `src/store/rootReducer.js`

### Notifications
Dispatch Redux actions (`addError`, `addSuccess`, `addWarning`, `addInfo` from `notificationSlicer.js`) to trigger Chakra toasts via the `<Notification/>` component.

### Chakra UI v3
- Uses `defaultSystem` — no custom theme object
- Color mode via `next-themes` (see `src/ui/color-mode.jsx`)
- Reusable UI primitives live in `src/ui/`; use Chakra's snippet CLI pattern

### ESLint
- Flat config (`eslint.config.js`), ESLint 9
- `no-unused-vars` ignores names starting with uppercase or `_`
- react-hooks and react-refresh plugins enabled
