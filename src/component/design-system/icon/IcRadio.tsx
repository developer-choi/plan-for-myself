import {ComponentPropsWithoutRef} from 'react';

export default function IcRadio({fill = "#DBDBDB"}: ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="7.91667" fill={fill}/>
      <circle cx="9.99999" cy="9.99999" r="3.95833" fill="white"/>
    </svg>
  );
}
