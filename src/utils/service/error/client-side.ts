import {useCallback} from 'react';

export function useHandleClientSideError() {
  return useCallback(async (error: any) => {
    console.error(error);
    alert(JSON.stringify(error));
  }, []);
}
