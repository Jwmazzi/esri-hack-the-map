import { React } from 'jimu-core';
import { Button } from 'jimu-ui';
import { ReactElement } from 'react';

export const FullWidthButton = ({ onClick, children }: { onClick: () => void; children: ReactElement }) => {
  return (
    <Button
      type="primary"
      size="lg"
      style={{ width: '100%', background: '#007AC2', maxWidth: '360px' }}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};
