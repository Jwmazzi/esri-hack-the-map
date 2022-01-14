System.register(["jimu-core","esri/Map","esri/views/MapView","esri/layers/FeatureLayer","esri/widgets/Locate","esri/rest/route","esri/Graphic","esri/rest/support/FeatureSet","esri/rest/support/ServiceAreaParameters","esri/rest/serviceArea","esri/rest/support/RouteParameters","jimu-ui"],(function(e,t){var o={},s={},i={},r={},a={},n={},l={},u={},d={},p={},c={},h={};return{setters:[function(e){o.React=e.React,o.jsx=e.jsx},function(e){s.default=e.default},function(e){i.default=e.default},function(e){r.default=e.default},function(e){a.default=e.default},function(e){n.default=e.default},function(e){l.default=e.default},function(e){u.default=e.default},function(e){d.default=e.default},function(e){p.default=e.default},function(e){c.default=e.default},function(e){h.Button=e.Button,h.Form=e.Form,h.FormGroup=e.FormGroup,h.Input=e.Input,h.Label=e.Label,h.Modal=e.Modal,h.ModalBody=e.ModalBody,h.ModalFooter=e.ModalFooter,h.ModalHeader=e.ModalHeader,h.TextInput=e.TextInput}],execute:function(){e((()=>{var e={282:e=>{"use strict";e.exports=l},254:e=>{"use strict";e.exports=s},37:e=>{"use strict";e.exports=r},820:e=>{"use strict";e.exports=n},632:e=>{"use strict";e.exports=p},903:e=>{"use strict";e.exports=u},440:e=>{"use strict";e.exports=c},836:e=>{"use strict";e.exports=d},591:e=>{"use strict";e.exports=i},380:e=>{"use strict";e.exports=a},810:e=>{"use strict";e.exports=o},835:e=>{"use strict";e.exports=h}},t={};function m(o){var s=t[o];if(void 0!==s)return s.exports;var i=t[o]={exports:{}};return e[o](i,i.exports,m),i.exports}m.d=(e,t)=>{for(var o in t)m.o(t,o)&&!m.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})},m.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),m.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},m.p="";var f={};return m.p=window.jimuConfig.baseUrl,(()=>{"use strict";m.r(f),m.d(f,{default:()=>b});var e=m(810),t=m(254),o=m(591),s=m(37),i=m(380),r=m(820),a=m(282),n=m(903),l=m(836),u=m(632),d=m(440);const p=({longitude:e,latitude:t},o="#f00")=>{const s={type:"point",x:e,y:t,spatialReference:{wkid:4326}};return new a.default({geometry:s,symbol:c(o)})},c=e=>({type:"simple-marker",size:"18px",outline:{color:"#fff",width:"3px"},color:e}),h=(e,t=64)=>{return{type:"picture-marker",url:(o=`<svg width="${t}" height="32" viewBox="0 0 ${t} 32" fill="none" xmlns="http://www.w3.org/2000/svg">\n  <style>\n    text { text-anchor: middle; }\n    tspan { font: 12px Avenir Next; fill: #fff; }\n  </style>\n  <rect width="100%" height="100%" rx="8" fill="#0066FF"/>\n  <text x="50%" y="50%" transform="translate(0,4)"><tspan>${e}</tspan></text>\n</svg>`,`data:image/svg+xml;base64,${btoa(o)}`),width:`${t}px`,height:"32px"};var o};var g=m(835);const x=({onClick:t,children:o})=>e.React.createElement(g.Button,{type:"primary",size:"lg",style:{width:"100%",background:"#007AC2",maxWidth:"360px"},onClick:t},o);class y extends e.React.PureComponent{constructor(e){super(e),this.handleSubmitSmartRoute=()=>{this.props.onSubmit({searchFor:["testingKits","inPersonTest"],transportMethod:"driving",maxTime:60}),this.props.toggle()},this.state={}}render(){return(0,e.jsx)(g.Modal,{toggle:this.props.toggle,isOpen:this.props.isOpen,centered:!0},(0,e.jsx)(g.ModalHeader,{toggle:this.props.toggle},"SmartRoute"),(0,e.jsx)(g.ModalBody,null,"I'm searching for..."),(0,e.jsx)(g.ModalFooter,null,(0,e.jsx)(x,{onClick:this.handleSubmitSmartRoute},"Create route")))}}class v extends e.React.PureComponent{constructor(e){super(e),this.submitResponse=e=>{e.preventDefault();var t=Array.from(document.querySelectorAll("[data-tk]")).filter((e=>e.checked));t=t.length>0?t[0].defaultValue:"N/A";var o=Array.from(document.querySelectorAll("[data-wk]")).filter((e=>e.checked));o=o.length>0?o[0].defaultValue:"N/A";const s=new a.default({attributes:{SiteID:this.props.siteFeature.attributes.SiteID,TK_Answer:t,WK_Answer:o,Comments:document.getElementById("userComment").value}});this.feedbackFL.applyEdits({addFeatures:[s]}),this.props.toggle()},this.handleSubmitSmartRoute=()=>{this.props.onSubmit({searchFor:["testingKits","inPersonTest"],transportMethod:"driving",maxTime:60}),this.props.toggle()},this.feedbackFL=new s.default({url:this.props.config.feedbackURL}),this.state={checked:!1}}render(){return(0,e.jsx)(g.Modal,{toggle:this.props.toggle,isOpen:this.props.isOpen,centered:!0},(0,e.jsx)(g.ModalHeader,{toggle:this.props.toggle},"Comment on Current Facility Status"),(0,e.jsx)(g.ModalBody,null,(0,e.jsx)(g.Form,null,(0,e.jsx)(g.FormGroup,{tag:"fieldset"},(0,e.jsx)("legend",null,"Test Kit Availability"),(0,e.jsx)(g.FormGroup,{check:!0},(0,e.jsx)(g.Input,{"data-tk":!0,value:"yes",name:"radio1",type:"radio"})," ",(0,e.jsx)(g.Label,{check:!0},"There was plent of stock.")),(0,e.jsx)(g.FormGroup,{check:!0},(0,e.jsx)(g.Input,{"data-tk":!0,value:"no",name:"radio1",type:"radio"})," ",(0,e.jsx)(g.Label,{check:!0},"Inventory is running low."))),(0,e.jsx)(g.FormGroup,{tag:"fieldset"},(0,e.jsx)("legend",null,"Walk-in Availability"),(0,e.jsx)(g.FormGroup,{check:!0},(0,e.jsx)(g.Input,{"data-wk":!0,value:"yes",name:"radio2",type:"radio"})," ",(0,e.jsx)(g.Label,{check:!0},"I was seen without an appointment.")),(0,e.jsx)(g.FormGroup,{check:!0},(0,e.jsx)(g.Input,{"data-wk":!0,value:"no",name:"radio2",type:"radio"})," ",(0,e.jsx)(g.Label,{check:!0},"Wait times are too long at this location."))),(0,e.jsx)(g.FormGroup,null,(0,e.jsx)(g.Label,{for:"userComment"},"Comments"),(0,e.jsx)(g.TextInput,{id:"userComment",name:"userComment",placeholder:"General observations . . ."})),(0,e.jsx)(g.Button,{block:!0,type:"primary",onClick:this.submitResponse},"Submit Response"))))}}var w=function(e,t,o,s){return new(o||(o=Promise))((function(i,r){function a(e){try{l(s.next(e))}catch(e){r(e)}}function n(e){try{l(s.throw(e))}catch(e){r(e)}}function l(e){var t;e.done?i(e.value):(t=e.value,t instanceof o?t:new o((function(e){e(t)}))).then(a,n)}l((s=s.apply(e,t||[])).next())}))};class b extends e.React.PureComponent{constructor(e){super(e),this.openSmartRouteModal=()=>{this.setState({showModal:!0})},this.closeSmartRouteModal=()=>{this.setState({showModal:!1})},this.openRespondModal=()=>{this.setState({showResponseModal:!0})},this.closeRespondModal=()=>{this.setState({showResponseModal:!1})},this.handleSubmitSmartRoute=e=>w(this,void 0,void 0,(function*(){console.log({info:e});const t=p({longitude:-117.182541,latitude:34.055569}),o=new l.default({apiKey:this.props.config.apiKey,facilities:new n.default({features:[t]}),defaultBreaks:[2.5],travelMode:{type:"automobile"},travelDirection:"to-facility",outSpatialReference:{wkid:3857},trimOuterPolygon:!0}),s=yield u.default.solve("https://route-api.arcgis.com/arcgis/rest/services/World/ServiceAreas/NAServer/ServiceArea_World/solveServiceArea",o);console.log(s),this.closeSmartRouteModal()})),this.state={routeCalculation:"idle",isViewReady:!1,showModal:!1,showResponseModal:!1},this.providerFL=new s.default({title:"SB County Providers",url:this.props.config.providerURL,outFields:["*"],popupTemplate:{title:"{SiteName}",lastEditInfoEnabled:!1,actions:[{title:"Directions",id:"routeIt"},{title:"Respond",id:"respondIt"}],expressionInfos:[{name:"testingKits",expression:'var sum = $feature.TestsInStockPCR + $feature.TestsInStockRapid;\n                         if (sum <= 50) {\n                           return "red"\n                         } \n                         return "green"\n                        '},{name:"walkingIn",expression:'if ($feature.WalkInsAccepted == "Yes") {\n                           return "green";\n                         } \n                         return "red";\n                        '},{name:"editElapse",expression:'return Round(DateDiff(Now(), Date($feature.LastUpdateDate), "hours"));'}],content:'\n                <p style="margin: auto">{SiteAddress}</p>\n                <p>Last Updated {expression/editElapse} Hours Ago</p>\n                <table>\n                  <tr>\n                    <td><span style="height: 15px; width: 15px; border-radius: 50%; display: inline-block; background-color: {expression/testingKits}"></span></td>\n                    <td><p style="margin: auto; padding-left: 10px">Testing Kits</p></td>\n                  </tr>\n                  <tr>\n                    <td><span style="height: 15px; width: 15px; border-radius: 50%; display: inline-block; background-color: {expression/walkingIn}"></span></td>\n                    <td><p style="margin: auto; padding-left: 10px">Walk-ins Accepted</p></td>\n                  </tr>\n                </table>\n                 '}}),this.routingTargetFL=new s.default({url:this.props.config.routingTargetsURL}),this.map=new t.default({basemap:"streets-navigation-vector",layers:[this.providerFL]})}componentDidMount(){return w(this,void 0,void 0,(function*(){this.view=new o.default({container:"edit-map",map:this.map,zoom:10,center:[-117.182541,34.055569],popup:{dockEnabled:!1,dockOptions:{buttonEnabled:!1,position:"bottom-right",breakpoint:!1}}}),yield this.view.when(),this.setState({isViewReady:!0}),this.view.popup.on("trigger-action",(e=>{"routeIt"===e.action.id&&this.handleRouting(),"respondIt"===e.action.id&&this.openRespondModal()})),this.locator=new i.default({view:this.view,goToLocationEnabled:!1}),this.view.ui.add(this.locator,"top-left")}))}handleRouting(){return w(this,void 0,void 0,(function*(){this.setState({routeCalculation:"calculating"}),this.view.graphics.removeAll();const e=this.view.popup.selectedFeature,t={coords:{longitude:-117.182541,latitude:34.055569}};if(!t||!e)return void this.setState({routeCalculation:"failed"});const o=e.geometry,s=p(t.coords,"#62C1FB"),i=p(o,"#35AC46"),l=new n.default({features:[s,i]}),u=new d.default({apiKey:this.props.config.apiKey,stops:l,outSpatialReference:{wkid:3857},directionsOutputType:"standard",returnDirections:!0});try{const t=(yield r.default.solve("https://route-api.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World",u)).routeResults[0].route;t.symbol={type:"simple-line",width:"7px",color:"#0066FF"};const o=t.geometry,n=Math.floor(o.paths[0].length/2),l=o.paths[0][n],d=new a.default({attributes:{route:0},geometry:{type:"point",x:l[0],y:l[1],spatialReference:{wkid:3857}},symbol:h(`${Math.ceil(t.attributes.Total_TravelTime)} min`)});this.view.graphics.addMany([t,s,i,d]),this.view.goTo(o.extent),this.routingTargetFL.applyEdits({addFeatures:[new a.default({attributes:{SiteID:e.attributes.SiteID}})]}),this.setState({routeCalculation:"complete"})}catch(e){console.error(e),this.setState({routeCalculation:"failed"})}}))}componentDidUpdate(e,t){this.props.activeType&&(this.providerFL.definitionExpression=`SiteType = '${this.props.activeType}'`)}render(){return(0,e.jsx)("div",{style:{height:"100%"}},(0,e.jsx)("div",{className:"widget-hack-map",id:"edit-map",style:{height:"100%"}}),(0,e.jsx)("div",{className:"button-container",style:{position:"absolute",bottom:0,width:"100%",textAlign:"center",padding:"0 32px 24px"}},(0,e.jsx)(x,{onClick:this.openSmartRouteModal},"SmartRoute")),(0,e.jsx)(y,{toggle:this.closeSmartRouteModal,isOpen:this.state.showModal,onSubmit:this.handleSubmitSmartRoute}),(0,e.jsx)(v,{toggle:this.closeRespondModal,isOpen:this.state.showResponseModal,onSubmit:this.handleSubmitSmartRoute,config:this.props.config,siteFeature:null!=this.view?this.view.popup.selectedFeature:-1}))}}b.mapExtraStateProps=e=>{if(e.widgetsState.hack)return{activeType:e.widgetsState.hack.activeType}}})(),f})())}}}));