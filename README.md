# Hack the Map 5

## Dev

Using [Experience Builder](https://developers.arcgis.com/experience-builder/). The content of this repo should go inside `/client/your-extensions/widgets/`, e.g. `/client/your-extensions/widgets/README.md`.

### Use ArcGIS JS API

Just import the module that is needed from `'esri/'`:

```ts
import Map from 'esri/Map';
```

See [guide](https://developers.arcgis.com/experience-builder/guide/extend-base-widget/#modules-in-the-arcgis-api-for-javascript). 

### Formatting

Using [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) to honor `.prettierrc.json` for file formatting.
