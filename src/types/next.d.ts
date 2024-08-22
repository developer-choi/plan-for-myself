export declare module 'next' {
  export interface ServerComponentProps {
    params: {
      [key: string]: string | undefined;
    }
    searchParams: {
      [key: string]: string | string[] | undefined
    };
  }
}
