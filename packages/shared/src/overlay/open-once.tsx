import {type ComponentProps, useEffect} from 'react';
import {overlay, type OverlayControllerComponent} from 'overlay-kit';

export function openOnce(key: string, controller: OverlayControllerComponent): void {
  if (openOwners.has(key)) {
    return;
  }
  const owner = Symbol(key);
  openOwners.set(key, owner);

  overlay.open((props) => <OpenOnceOverlay {...props} controller={controller} openKey={key} owner={owner} />);
}

interface OpenOnceOverlayProps extends ComponentProps<OverlayControllerComponent> {
  controller: OverlayControllerComponent;
  openKey: string;
  owner: symbol;
}

function OpenOnceOverlay({controller: Controller, openKey, owner, ...props}: OpenOnceOverlayProps) {
  useEffect(() => {
    openOwners.set(openKey, owner);
    return () => release(openKey, owner);
  }, [openKey, owner]);

  const close = () => {
    release(openKey, owner);
    props.close();
  };

  return <Controller {...props} close={close} />;
}

function release(key: string, owner: symbol) {
  if (openOwners.get(key) === owner) {
    openOwners.delete(key);
  }
}

const openOwners = new Map<string, symbol>();
