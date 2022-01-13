import Graphic from 'esri/Graphic';
import SimpleMarkerSymbol from 'esri/symbols/SimpleMarkerSymbol';
import Symbol from 'esri/symbols/Symbol';

export const getPointGraphic = (
  { longitude, latitude }: { longitude: number; latitude: number },
  color: string | number[]
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
