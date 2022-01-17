System.register(["jimu-core/data-source","jimu-core"],(function(e,t){var r={},a={};return{setters:[function(e){r.AbstractSetDataSource=e.AbstractSetDataSource,r.DataSourceTypes=e.DataSourceTypes},function(e){a.Immutable=e.Immutable,a.SupportedLayerTypes=e.SupportedLayerTypes,a.dataSourceUtils=e.dataSourceUtils,a.loadArcGISJSAPIModules=e.loadArcGISJSAPIModules,a.portalUrlUtils=e.portalUrlUtils}],execute:function(){e((()=>{"use strict";var e={810:e=>{e.exports=a},198:e=>{e.exports=r}},t={};function o(r){var a=t[r];if(void 0!==a)return a.exports;var i=t[r]={exports:{}};return e[r](i,i.exports,o),i.exports}o.d=(e,t)=>{for(var r in t)o.o(t,r)&&!o.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},o.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),o.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var i={};return(()=>{var e,t;o.r(i),o.d(i,{ArcGISDataSourceFactory:()=>h,ArcGISDataSourceTypes:()=>e,DataSourceTypes:()=>e,LayerTypes:()=>t,MapDataSourceImpl:()=>l,WebMapDataSourceImpl:()=>u,WebSceneDataSourceImpl:()=>d,default:()=>y}),function(e){e.Map="MAP",e.WebMap="WEB_MAP",e.WebScene="WEB_SCENE"}(e||(e={})),function(e){e.BaseDynamicLayer="base-dynamic",e.BaseElevationLayer="base-elevation",e.BaseTileLayer="base-tile",e.BuildingSceneLayer="building-scene",e.CSVLayer="csv",e.ElevationLayer="elevation",e.FeatureLayer="feature",e.GeoJSONLayer="geojson",e.GeoRSSLayer="geo-rss",e.GraphicsLayer="graphics",e.GroupLayer="group",e.ImageryLayer="imagery",e.IntegratedMeshLayer="integrated-mesh",e.KMLLayer="kml",e.MapImageLayer="map-image",e.MapNotesLayer="map-notes",e.PointCloudLayer="point-cloud",e.SceneLayer="scene",e.TileLayer="tile",e.UnknownLayer="unknown",e.UnsupportedLayer="unsupported",e.VectorTileLayer="vector-tile",e.WMSLayer="wms",e.WMTSLayer="wmts",e.WebTileLayer="web-tile"}(t||(t={}));var r=o(198),a=o(810),s=function(e,t,r,a){return new(r||(r=Promise))((function(o,i){function s(e){try{c(a.next(e))}catch(e){i(e)}}function l(e){try{c(a.throw(e))}catch(e){i(e)}}function c(e){var t;e.done?o(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(s,l)}c((a=a.apply(e,t||[])).next())}))};class l extends r.AbstractSetDataSource{constructor(t){super(t),this.type=e.Map,this.map=t.map}ready(){return s(this,void 0,void 0,(function*(){return yield(0,a.loadArcGISJSAPIModules)(["esri/Map","esri/layers/FeatureLayer"]).then((e=>s(this,void 0,void 0,(function*(){return[this.Map,this.FeatureLayer]=e,this.map||this.createMap(),yield this.createChildDataSources()}))))}))}fetchSchema(){var e,t;return s(this,void 0,void 0,(function*(){const r=this.getChildDataSources();let o=(0,a.Immutable)({childSchemas:{},label:null===(t=null===(e=this.map)||void 0===e?void 0:e.portalItem)||void 0===t?void 0:t.title});return r.forEach(((e,t)=>{const r=e.getFetchedSchema();o=o.setIn(["childSchemas",e.jimuChildId],r)})),Promise.resolve(o)}))}getDataSourceByLayer(e,t){return"number"==typeof e&&(e=`${e}`),e?this.deepSearchDataSourceByLayer(this,e,t):null}getDataSourcesByType(e){if(!e)return[];const t=[];return this.traverseToGetDataSourcesByType(e,this,t),t}createChildDataSources(){return s(this,void 0,void 0,(function*(){const e=[],t=[];return a.dataSourceUtils.getWhetherUseProxy()&&this.map.allLayers.toArray().forEach((e=>{const t=a.dataSourceUtils.getUrlByLayer(e);if(!t)return;const r=a.dataSourceUtils.getDataSourceProxyUrl(t);r&&(e.url=r)})),this.map.layers.toArray().reverse().forEach(((r,o)=>{const i=a.dataSourceUtils.getUrlByLayer(r),s=a.dataSourceUtils.getDataSourceSourceUrl(i),l=a.dataSourceUtils.getFixedLayerIdByLayer(r);t.push(this.getDataSourceConstructorOptions(l,o,s,this.getDataSourceJson(),r).then((t=>{t.forEach((t=>{e.push(this.dataSourceManager.createDataSource(t))}))})))})),this.childDataSourcesPromise=Promise.allSettled(t).then((()=>s(this,void 0,void 0,(function*(){return yield Promise.allSettled(e).then((e=>s(this,void 0,void 0,(function*(){const t=[],r=e.filter((e=>"fulfilled"===e.status)).map((e=>e.value));return r&&r.length>0&&r.forEach((e=>this.traverseToCreateLayerForDataSource(e,t))),Promise.allSettled(t.map((e=>s(this,void 0,void 0,(function*(){return yield e.load()}))))).then((e=>r))}))))})))),this.childDataSourcesPromise}))}deepSearchDataSourceByLayer(e,t,r){if(!e||!t)return null;if(this.isDataSourceWithLayer(e,t,r))return e;let a=null;const o=e.isDataSourceSet&&e.getChildDataSources();if(o)for(let e=0;e<o.length&&(a=this.deepSearchDataSourceByLayer(o[e],t,r),!a);e++);return a}traverseToGetDataSourcesByType(e,t,r){if(!e||!t||!r)return;t.type===e&&r.push(t);const a=t.isDataSourceSet&&t.getChildDataSources();a&&a.forEach((t=>{this.traverseToGetDataSourcesByType(e,t,r)}))}traverseToCreateLayerForDataSource(e,t){if(!e)return;this.getWhetherNeedToCreateLayer(e)&&e.type===r.DataSourceTypes.FeatureLayer&&e.layer.url&&(e.layer=new this.FeatureLayer({id:e.layer.id,title:e.layer.title,url:a.dataSourceUtils.getUrlByLayer(e.layer),renderer:e.layer.renderer,popupTemplate:e.layer.popupTemplate}),e.getAllDerivedDataSources().forEach((t=>{t.clearRecords(),t.layer=e.layer})),t.push(e.layer));const o=e.isDataSourceSet&&e.getChildDataSources();o&&o.forEach((e=>{this.traverseToCreateLayerForDataSource(e,t)}))}getWhetherNeedToCreateLayer(e){return!(!e||e.layer&&"esri.layers.support.Sublayer"!==e.layer.declaredClass)}isDataSourceWithLayer(e,t,a){var o,i,s;if(`${null===(i=null===(o=e)||void 0===o?void 0:o.layer)||void 0===i?void 0:i.id}`==`${t}`){if(a){let t=null,o=null==e?void 0:e.parentDataSource;for(;o;){if(o.type===r.DataSourceTypes.MapService){t=o;break}o=o.parentDataSource}return a===(null===(s=null==t?void 0:t.layer)||void 0===s?void 0:s.id)}return!0}return!1}createMap(){this.map=new this.Map,this.getDataSourceJson().layers.forEach((e=>{this.map.layers.add(new this.FeatureLayer(e))}))}getDataSourceConstructorOptions(e,t,o,i,l){return s(this,void 0,void 0,(function*(){if(!e)return yield Promise.resolve([]);const c=[],u=[],n=[];return this.getJimuChildId(e).forEach((e=>{var d;const h=this.getDataSourceJson().schema?this.getDataSourceJson().schema.childSchemas[e]:null,y=this.getChildDataSourceId(e),p=(null==i?void 0:i.childDataSourceJsons)&&i.childDataSourceJsons[e]?i.childDataSourceJsons[e]:null;let S,m=(0,a.Immutable)({id:y,type:r.DataSourceTypes.FeatureLayer});if(p&&(m=m.merge(p.asMutable({deep:!0}))),o&&(m=m.set("url",o.replace(/^http:/,"https:"))),h&&(m=m.set("schema",h)),l){if((null===(d=l.portalItem)||void 0===d?void 0:d.id)&&(m=m.set("portalUrl",l.portalItem.portal.url).set("itemId",l.portalItem.id)),l.type===a.SupportedLayerTypes.SceneLayer)u.push(l.load().then((()=>s(this,void 0,void 0,(function*(){return l.associatedLayer?yield Promise.resolve({id:m.id,dataSourceJson:m.set("type",r.DataSourceTypes.SceneLayer),layer:l,parentDataSource:this,jimuChildId:e,order:t}):yield Promise.reject(null)})))));else switch(l.type){case a.SupportedLayerTypes.FeatureLayer:n.push(l.load().then((()=>s(this,void 0,void 0,(function*(){if("multipatch"===l.geometryType||"mesh"===l.geometryType){const e="Do not support feature layer which geometry type is multipatch or mesh.";return console.error(e,l),yield Promise.reject(e)}const r=l.geometryType?`esriGeometry${l.geometryType.charAt(0).toUpperCase()}${l.geometryType.slice(1)}`:null;return yield Promise.resolve({id:m.id,dataSourceJson:m.set("geometryType",r),layer:l,parentDataSource:this,jimuChildId:e,order:t})})))));break;case a.SupportedLayerTypes.MapImageLayer:case a.SupportedLayerTypes.TileLayer:S={id:m.id,dataSourceJson:m.set("type",r.DataSourceTypes.MapService),layer:l,parentDataSource:this,jimuChildId:e,order:t};break;case a.SupportedLayerTypes.GroupLayer:S={id:m.id,dataSourceJson:m.set("type",r.DataSourceTypes.GroupLayer),layer:l,parentDataSource:this,jimuChildId:e,order:t}}S&&c.push(Promise.resolve(S))}else S={id:m.id,dataSourceJson:m,parentDataSource:this,jimuChildId:e,order:t},c.push(Promise.resolve(S))})),yield Promise.allSettled(c.concat(u).concat(n)).then((e=>e.filter((e=>"fulfilled"===e.status)).map((e=>e.value))))}))}}var c=function(e,t,r,a){return new(r||(r=Promise))((function(o,i){function s(e){try{c(a.next(e))}catch(e){i(e)}}function l(e){try{c(a.throw(e))}catch(e){i(e)}}function c(e){var t;e.done?o(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(s,l)}c((a=a.apply(e,t||[])).next())}))};class u extends l{constructor(){super(...arguments),this.type=e.WebMap}ready(){return c(this,void 0,void 0,(function*(){return yield(0,a.loadArcGISJSAPIModules)(["esri/WebMap","esri/portal/Portal","esri/portal/PortalItem","esri/layers/FeatureLayer"]).then((e=>c(this,void 0,void 0,(function*(){return[this.WebMap,this.Portal,this.PortalItem,this.FeatureLayer]=e,this.map||this.createMap(),yield this.createChildDataSources()}))))}))}createMap(){if(this.getDataSourceJson().portalUrl){const e=new this.Portal({url:a.portalUrlUtils.getHostUrlByOrgUrl(this.getDataSourceJson().portalUrl)});this.map=new this.WebMap({portalItem:new this.PortalItem({id:this.getDataSourceJson().itemId,portal:e})})}else this.map=new this.WebMap({portalItem:new this.PortalItem({id:this.getDataSourceJson().itemId})});this.map.isFulfilled()||this.map.load()}createChildDataSources(){const e=Object.create(null,{createChildDataSources:{get:()=>super.createChildDataSources}});return c(this,void 0,void 0,(function*(){return this.childDataSourcesPromise=this.map.when((()=>c(this,void 0,void 0,(function*(){const t=this.map.tables?this.map.tables.toArray():[];a.dataSourceUtils.getWhetherUseProxy()&&t.forEach((e=>{const t=a.dataSourceUtils.getUrlByLayer(e);if(!t)return;const r=a.dataSourceUtils.getDataSourceProxyUrl(t);r&&(e.url=r)}));const r=[],o=[],i=this.map.layers.toArray().length;t.reverse().forEach(((e,t)=>{o.push(this.getDataSourceConstructorOptions(a.dataSourceUtils.getFixedLayerIdByLayer(e),i+t,a.dataSourceUtils.getDataSourceSourceUrl(a.dataSourceUtils.getUrlByLayer(e)),this.getDataSourceJson(),e).then((e=>{e.forEach((e=>{r.push(this.dataSourceManager.createDataSource(e))}))})))}));const s=e.createChildDataSources.call(this),l=Promise.allSettled(o).then((()=>c(this,void 0,void 0,(function*(){return yield Promise.allSettled(r).then((e=>e.filter((e=>"fulfilled"===e.status)).map((e=>e.value))))}))));return Promise.all([s,l]).then((e=>e[0].concat(e[1])))})))),this.childDataSourcesPromise}))}}var n=function(e,t,r,a){return new(r||(r=Promise))((function(o,i){function s(e){try{c(a.next(e))}catch(e){i(e)}}function l(e){try{c(a.throw(e))}catch(e){i(e)}}function c(e){var t;e.done?o(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(s,l)}c((a=a.apply(e,t||[])).next())}))};class d extends l{constructor(){super(...arguments),this.type=e.WebScene}ready(){return n(this,void 0,void 0,(function*(){return yield(0,a.loadArcGISJSAPIModules)(["esri/WebScene","esri/portal/Portal","esri/portal/PortalItem","esri/layers/FeatureLayer"]).then((e=>n(this,void 0,void 0,(function*(){return[this.WebScene,this.Portal,this.PortalItem,this.FeatureLayer]=e,this.map||this.createMap(),yield this.createChildDataSources()}))))}))}createMap(){if(this.getDataSourceJson().portalUrl){const e=new this.Portal({url:a.portalUrlUtils.getHostUrlByOrgUrl(this.getDataSourceJson().portalUrl)});this.map=new this.WebScene({portalItem:new this.PortalItem({id:this.getDataSourceJson().itemId,portal:e})})}else this.map=new this.WebScene({portalItem:new this.PortalItem({id:this.getDataSourceJson().itemId})});this.map.isFulfilled()||this.map.load()}createChildDataSources(){const e=Object.create(null,{createChildDataSources:{get:()=>super.createChildDataSources}});return n(this,void 0,void 0,(function*(){return this.childDataSourcesPromise=this.map.when((()=>n(this,void 0,void 0,(function*(){return yield e.createChildDataSources.call(this)})))),this.childDataSourcesPromise}))}}class h{createDataSource(t){var r;const a=null!==(r=t.dataSourceJson)&&void 0!==r?r:t.belongToDataSource.getMainDataSource().getDataSourceJson(),o=t.dataViewId&&a.dataViews&&a.dataViews[t.dataViewId]&&a.dataViews[t.dataViewId].type||a.type;return o===e.Map?new l(t):o===e.WebMap?new u(t):o===e.WebScene?new d(t):void console.error("Unimplemented data source type.",o)}}const y=h})(),i})())}}}));