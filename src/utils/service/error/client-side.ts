import {useCallback} from 'react';

export function useHandleClientSideError() {
  return useCallback(async (error: any) => {
    alert(JSON.stringify(error));
  }, []);
}
