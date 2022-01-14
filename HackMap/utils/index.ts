import Graphic from 'esri/Graphic';
import CIMSymbol from 'esri/symbols/CIMSymbol';
import SimpleMarkerSymbol from 'esri/symbols/SimpleMarkerSymbol';
import Symbol from 'esri/symbols/Symbol';

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
