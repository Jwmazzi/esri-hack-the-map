System.register(["jimu-core","jimu-theme","jimu-ui","jimu-ui/advanced/setting-components"],(function(e,t){var s={},r={},i={},o={};return{setters:[function(e){s.React=e.React,s.classNames=e.classNames,s.css=e.css,s.injectIntl=e.injectIntl,s.jsx=e.jsx,s.polished=e.polished},function(e){r.getBuilderThemeVariables=e.getBuilderThemeVariables},function(e){i.Link=e.Link},function(e){o.QuickStylePopper=e.QuickStylePopper}],execute:function(){e((()=>{"use strict";var e={1810:e=>{e.exports=s},83016:e=>{e.exports=r},21835:e=>{e.exports=i},23080:e=>{e.exports=o}},t={};function n(s){var r=t[s];if(void 0!==r)return r.exports;var i=t[s]={exports:{}};return e[s](i,i.exports,n),i.exports}n.d=(e,t)=>{for(var s in t)n.o(t,s)&&!n.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:t[s]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var l={};return(()=>{n.r(l),n.d(l,{default:()=>a});var e=n(1810),t=n(83016),s=n(21835),r=n(23080);const i={_widgetLabel:"Button"};class o extends e.React.PureComponent{constructor(t){super(t),this.THEMETYPES=["default","primary","secondary","tertiary","danger","link"],this.translate=e=>{const{intl:t}=this.props;return t?t.formatMessage({id:e,defaultMessage:i[e]}):""},this.getStyle=t=>e.css`
      width: ${e.polished.rem(360)};
      background-color: ${t.colors.palette.light[300]};
      color: ${t.colors.dark};
      border: 1px solid ${t.colors.palette.light[500]};
      box-shadow: 0 4px 20px 4px ${e.polished.rgba(t.colors.white,.5)};
      .button-item{
        width: 100%;
        font-size: ${e.polished.rem(13)};
      }
      .quick-style-item-container{
        padding-left: 4px;
        padding-right: 4px;
        padding-bottom: 8px;
      }
      .quick-style-item{
        border: 2px solid transparent;
        &.quick-style-item-selected{
          border: 2px solid ${t.colors.palette.primary[600]};
        }
        .quick-style-item-inner{
          background-color: ${t.colors.palette.light[400]};
          cursor: pointer;
        }
      }
    `,this.state={}}render(){return(0,e.jsx)(r.QuickStylePopper,{reference:this.props.reference,open:!0,placement:"right-start",css:this.getStyle((0,t.getBuilderThemeVariables)()),onClose:this.props.onClose,trapFocus:!1,autoFocus:!1},(0,e.jsx)("div",{className:"container-fluid mb-2"},(0,e.jsx)("div",{className:"row no-gutters"},this.THEMETYPES.map(((t,r)=>(0,e.jsx)("div",{key:r,className:"col-4 quick-style-item-container"},(0,e.jsx)("div",{className:(0,e.classNames)("quick-style-item",{"quick-style-item-selected":this.props.selectedType===t})},(0,e.jsx)("div",{className:"quick-style-item-inner p-2",onClick:()=>this.props.onChange(t)},(0,e.jsx)(s.Link,{title:this.translate("_widgetLabel"),className:"d-inline-block button-item text-truncate",themeStyle:{type:t}},this.translate("_widgetLabel"))))))))))}}const a={QuickStyle:(0,e.injectIntl)(o)}})(),l})())}}}));