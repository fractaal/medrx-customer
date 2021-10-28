import '@firebase/auth';

declare module '@firebase/auth' {
  interface ParsedToken {
    region: string;
    city: string;
    roles: string;
  }
}
