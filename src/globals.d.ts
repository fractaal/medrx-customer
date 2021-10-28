import '@firebase/auth';

declare module '@capacitor/core';
declare module '@capacitor/status-bar';
declare module '@firebase/auth' {
  interface ParsedToken {
    region: string;
    city: string;
    roles: string;
  }
}
