import Graphic from 'esri/Graphic';
import CIMSymbol from 'esri/symbols/CIMSymbol';
import PictureMarkerSymbol from 'esri/symbols/PictureMarkerSymbol';
import SimpleMarkerSymbol from 'esri/symbols/SimpleMarkerSymbol';
import Symbol from 'esri/symbols/Symbol';


export const routeSVG = `<svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 22.003L18.497 22C11.59 21.958 -4.66213e-05 21.514 -4.66213e-05 19C-4.66213e-05 17.91 1.75595 17.584 4.18695 17.134C5.37995 16.914 7.86395 16.452 8.00095 15.996C7.88495 15.628 5.88395 15.107 3.47795 14.999L2.99995 14.979V14L3.99995 14.026C6.05995 14.154 8.99995 14.586 8.99995 16C8.99995 17.259 6.85395 17.656 4.36795 18.117C3.18795 18.336 1.21495 18.701 0.985953 19.057C1.29495 20.027 9.30995 20.944 18.501 21H19V22.003ZM7.99995 4.133C7.99995 6.412 5.81395 9.5 3.99995 13C2.18595 9.5 -4.66213e-05 6.413 -4.66213e-05 4.132C-0.0122551 3.59712 0.0819001 3.06514 0.276954 2.56694C0.472008 2.06874 0.764075 1.61425 1.1362 1.22984C1.50833 0.845434 1.9531 0.53877 2.44471 0.32765C2.93631 0.116529 3.46496 0.00515793 3.99995 0C4.53495 0.00515793 5.06359 0.116529 5.5552 0.32765C6.0468 0.53877 6.49158 0.845434 6.8637 1.22984C7.23583 1.61425 7.5279 2.06874 7.72295 2.56694C7.91801 3.06514 8.01216 3.59712 7.99995 4.132V4.133ZM4.56495 9.885C5.81695 7.66 6.99995 5.562 6.99995 4.132C7.01289 3.72828 6.9451 3.32604 6.80057 2.94885C6.65604 2.57167 6.43767 2.22713 6.15827 1.93543C5.87886 1.64373 5.54404 1.41074 5.17342 1.25011C4.80281 1.08948 4.40386 1.00445 3.99995 1C3.59605 1.00445 3.1971 1.08948 2.82648 1.25011C2.45587 1.41074 2.12105 1.64373 1.84164 1.93543C1.56223 2.22713 1.34386 2.57167 1.19933 2.94885C1.0548 3.32604 0.987019 3.72828 0.999953 4.132C0.999953 5.562 2.18295 7.662 3.43495 9.885C3.62095 10.217 3.81095 10.553 3.99995 10.895C4.18995 10.553 4.37895 10.217 4.56495 9.885ZM5.99995 4C5.99995 4.39556 5.88266 4.78224 5.66289 5.11114C5.44313 5.44004 5.13077 5.69638 4.76532 5.84776C4.39987 5.99913 3.99773 6.03874 3.60977 5.96157C3.22181 5.8844 2.86544 5.69392 2.58574 5.41421C2.30603 5.13451 2.11555 4.77814 2.03838 4.39018C1.96121 4.00222 2.00082 3.60009 2.15219 3.23463C2.30357 2.86918 2.55991 2.55682 2.88881 2.33706C3.21771 2.1173 3.60439 2 3.99995 2C4.53039 2 5.03909 2.21071 5.41417 2.58579C5.78924 2.96086 5.99995 3.46957 5.99995 4ZM4.99995 4C4.99995 3.80222 4.9413 3.60888 4.83142 3.44443C4.72154 3.27998 4.56536 3.15181 4.38264 3.07612C4.19991 3.00043 3.99884 2.98063 3.80486 3.01921C3.61088 3.0578 3.4327 3.15304 3.29285 3.29289C3.15299 3.43275 3.05775 3.61093 3.01917 3.80491C2.98058 3.99889 3.00039 4.19996 3.07607 4.38268C3.15176 4.56541 3.27993 4.72159 3.44438 4.83147C3.60883 4.94135 3.80217 5 3.99995 5C4.26517 5 4.51952 4.89464 4.70706 4.70711C4.8946 4.51957 4.99995 4.26522 4.99995 4ZM22 11.132C22 13.413 19.814 16.5 18 20C16.186 16.5 14 13.413 14 11.132C13.983 10.5961 14.0739 10.0622 14.2673 9.56209C14.4607 9.06198 14.7526 8.60583 15.1257 8.22074C15.4988 7.83564 15.9455 7.52945 16.4393 7.32035C16.933 7.11124 17.4638 7.00349 18 7.00349C18.5362 7.00349 19.0669 7.11124 19.5606 7.32035C20.0544 7.52945 20.5011 7.83564 20.8742 8.22074C21.2473 8.60583 21.5392 9.06198 21.7326 9.56209C21.926 10.0622 22.0169 10.5961 22 11.132ZM18.565 16.885C19.817 14.66 21 12.562 21 11.132C21.0181 10.7267 20.9539 10.322 20.8113 9.94225C20.6687 9.56248 20.4507 9.21553 20.1703 8.92235C19.89 8.62917 19.5531 8.39583 19.1801 8.23641C18.8071 8.07699 18.4056 7.9948 18 7.9948C17.5943 7.9948 17.1928 8.07699 16.8198 8.23641C16.4468 8.39583 16.1099 8.62917 15.8296 8.92235C15.5492 9.21553 15.3312 9.56248 15.1886 9.94225C15.046 10.322 14.9818 10.7267 15 11.132C15 12.562 16.183 14.662 17.435 16.885C17.621 17.217 17.811 17.553 18 17.895C18.19 17.553 18.379 17.217 18.565 16.885ZM20 11C20 11.3956 19.8827 11.7822 19.6629 12.1111C19.4431 12.44 19.1308 12.6964 18.7653 12.8478C18.3999 12.9991 17.9977 13.0387 17.6098 12.9616C17.2218 12.8844 16.8654 12.6939 16.5857 12.4142C16.306 12.1345 16.1156 11.7781 16.0384 11.3902C15.9612 11.0022 16.0008 10.6001 16.1522 10.2346C16.3036 9.86918 16.5599 9.55682 16.8888 9.33706C17.2177 9.1173 17.6044 9 18 9C18.5304 9 19.0391 9.21071 19.4142 9.58579C19.7892 9.96086 20 10.4696 20 11ZM19 11C19 10.8022 18.9413 10.6089 18.8314 10.4444C18.7215 10.28 18.5654 10.1518 18.3826 10.0761C18.1999 10.0004 17.9988 9.98063 17.8049 10.0192C17.6109 10.0578 17.4327 10.153 17.2928 10.2929C17.153 10.4327 17.0578 10.6109 17.0192 10.8049C16.9806 10.9989 17.0004 11.2 17.0761 11.3827C17.1518 11.5654 17.2799 11.7216 17.4444 11.8315C17.6088 11.9414 17.8022 12 18 12C18.2652 12 18.5195 11.8946 18.7071 11.7071C18.8946 11.5196 19 11.2652 19 11Z" fill="#6A6A6A"/>
                        </svg>
                        `

export const respondSVG = `<svg width="22" height="19" viewBox="0 0 22 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M16.52 0L15.52 1H0V0H16.52ZM0 4V5H11.52L12.52 4H0ZM4.52 12H0V13H3.655C3.72445 12.8459 3.81983 12.7048 3.937 12.583L4.52 12ZM0 8V9H7.52L8.52 8H0ZM20.95 1.934C21.1413 2.11164 21.2524 2.35919 21.258 2.62015C21.2637 2.88112 21.1634 3.13324 20.98 3.319L7.825 16.471L3.73 18.227C3.59051 18.2873 3.42837 18.2564 3.32082 18.149C3.21326 18.0417 3.18203 17.8796 3.242 17.74L4.998 13.643L18.15 0.491C18.3358 0.307619 18.5879 0.207312 18.8488 0.212964C19.1098 0.218617 19.3574 0.329747 19.535 0.521L20.95 1.934ZM7.02 15.728L5.74 14.448L4.78 16.688L7.02 15.728ZM18.093 4.79L16.68 3.376L6.382 13.674L7.795 15.088L18.093 4.79ZM19.958 2.345L19.154 1.507C19.0759 1.42544 18.9683 1.37874 18.8555 1.37743C18.7426 1.37611 18.6339 1.42029 18.554 1.5L17.387 2.67L18.8 4.083L19.952 2.932C20.1131 2.77044 20.1158 2.50982 19.958 2.345Z" fill="#6A6A6A"/>
                          </svg>
                          `

export const getPointGraphic = (
  { longitude, latitude }: { longitude: number; latitude: number },
  color: string | number[] = '#f00'
) => {
  const geometry = {
    type: 'point',
    x: longitude,
    y: latitude,
    spatialReference: {
      wkid: 4326,
    },
  };

  return new Graphic({ geometry, symbol: getCirclePointSymbol(color) });
};

export const getPinPointSymbol = () => {
  // TODO:
};

export const getCirclePointSymbol = (color: string | number[]): SimpleMarkerSymbol => {
  return {
    type: 'simple-marker',
    // @ts-expect-error auto cast
    size: '18px', // pixels
    outline: {
      // @ts-expect-error auto cast
      color: '#fff',
      // @ts-expect-error auto cast
      width: '3px',
    },
    // @ts-expect-error auto cast
    color,
  };
};

export const getPolylineSymbol = (): Symbol => {
  return {
    type: 'simple-line',
    width: '7px',
    // @ts-expect-error auto cast
    color: '#0066FF',
  };
};

export const getSvgDataUrl = (svg) => {
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}


export const getLabelSVGSymbol = (text: string, width = 64): PictureMarkerSymbol => {

  const height = 32;

  const svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { text-anchor: middle; }
    tspan { font: 12px Avenir Next; fill: #fff; }
  </style>
  <rect width="100%" height="100%" rx="8" fill="#0066FF"/>
  <text x="50%" y="50%" transform="translate(0,4)"><tspan>${text}</tspan></text>
</svg>`;

  return {
    type: 'picture-marker',
    url: getSvgDataUrl(svg),
    // @ts-expect-error can use string
    width: `${width}px`,
    // @ts-expect-error can use string
    height: `${height}px`,
  };
};

// CIMSymbol doesn't support rounded corner as easy as SVG
export const getLabelCIMSymbol = (textString: string): CIMSymbol => {
  return {
    type: 'cim',
    data: {
      type: 'CIMSymbolReference',
      symbol: {
        type: 'CIMPointSymbol',
        symbolLayers: [
          {
            type: 'CIMVectorMarker',
            enable: true,
            size: 10.5,
            colorLocked: true,
            anchorPointUnits: 'Relative',
            frame: {
              xmin: 0,
              ymin: -5.25,
              xmax: 0,
              ymax: 5.25,
            },
            markerGraphics: [
              {
                type: 'CIMMarkerGraphic',
                geometry: {
                  x: 0,
                  y: 0,
                },
                symbol: {
                  type: 'CIMTextSymbol',
                  fontFamilyName: 'Avenir Next LT Pro Regular',
                  fontStyleName: 'normal',
                  height: 10.5,
                  horizontalAlignment: 'Center',
                  offsetX: 0,
                  offsetY: 19.5,
                  symbol: {
                    type: 'CIMPolygonSymbol',
                    symbolLayers: [
                      {
                        type: 'CIMSolidFill',
                        enable: true,
                        color: [255, 255, 255, 255],
                      },
                    ],
                  },
                  verticalAlignment: 'Center',
                  // @ts-expect-error
                  font: {
                    family: 'Avenir Next LT Pro Regular',
                    decoration: 'none',
                    style: 'normal',
                    weight: 'normal',
                  },
                },
                textString,
              },
            ],
            scaleSymbolsProportionally: true,
            respectFrame: true,
          },
          {
            type: 'CIMVectorMarker',
            enable: true,
            anchorPointUnits: 'Relative',
            size: 39,
            frame: {
              xmin: 0,
              ymin: 0,
              xmax: 136.5,
              ymax: 39,
            },
            markerGraphics: [
              {
                type: 'CIMMarkerGraphic',
                geometry: {
                  rings: [
                    [
                      [0, 39],
                      [136.5, 39],
                      [136.5, 0],
                      [0, 0],
                      [0, 39],
                    ],
                  ],
                },
                symbol: {
                  type: 'CIMPolygonSymbol',
                  symbolLayers: [
                    {
                      type: 'CIMSolidFill',
                      enable: true,
                      color: [0, 102, 255, 255],
                    },
                  ],
                },
              },
            ],
            scaleSymbolsProportionally: false,
            respectFrame: true,
            offsetX: 0,
            offsetY: 19.5,
            anchorPoint: {
              x: 0,
              y: 0,
            },
            rotateClockwise: false,
          },
        ],
      },
    },
  };
};
