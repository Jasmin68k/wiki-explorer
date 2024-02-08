# Wiki Explorer

## Completely client-side, serverless web app for exploring Wikipedia with optional local caching

Search for a Wikipedia page and explore all linked Wikipedia pages with pie navigation (click, touch, drag, mousewheel). Click on any result to make it the new search target.

Results can be filtered by titles and/or categories, just start typing in the corresponding text input fields. Categories can also be filtered with a checkbox filter containing a list of all categories of all results. Missing pages (which are linked to on Wikipedia, but have not yet been created) are marked in red. An extract with image, button to open Wikipedia and categories/redirects (when enabled) is also available.

You can try it out at [https://wiki-explorer.netlify.app/](https://wiki-explorer.netlify.app/), where the master branch is always automatically deployed.

For additional details regarding usage, please check out the built-in help, accessible through the burger menu located in the upper right corner.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run dev
```

### Compiles and minifies for production
```
npm run build
```

### Serve production build
```
npm run preview
```

### Run linter
```
npm run lint
```

### Run formatter
```
npm run format
```
