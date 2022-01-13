import Graphic from 'esri/Graphic';

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

  const symbol = {
    type: 'simple-marker',
    size: '16px', // pixels
    outline: {
      // autocasts as new SimpleLineSymbol()
      color: '#fff',
      width: '6px',
    },
    color,
  };

  return new Graphic({ geometry, symbol });
};
