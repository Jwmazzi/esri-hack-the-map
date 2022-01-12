# Hack the Map 5

## Dev

Using [Experience Builder 1.6](https://developers.arcgis.com/experience-builder/). The content of this repo should go inside `/client/your-extensions/widgets/`, e.g. `/client/your-extensions/widgets/README.md`.

Note that there's a bug in 1.6 with Node.js 16 when you try to download the experience as static files. Please use patch [here](https://github.com/Esri/arcgis-experience-builder-sdk-resources/tree/master/patches/1.6/patch1/arcgis-experience-builder).

### Use ArcGIS JS API

Just import the module that is needed from `'esri/'`:

```ts
import Map from 'esri/Map';
```

See [guide](https://developers.arcgis.com/experience-builder/guide/extend-base-widget/#modules-in-the-arcgis-api-for-javascript). 

### Formatting

Using [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) to honor `.prettierrc.json` for file formatting.

### UI library

E.g.

```ts
import { Button } from 'jimu-ui';
```

See [jimu-UI](https://developers.arcgis.com/experience-builder/storybook)

### Style widget

See [CSS-in-JS](https://developers.arcgis.com/experience-builder/guide/widget-ui/#%EF%B8%8Fcss-in-js-recommended)
