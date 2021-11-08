// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Vue from 'vue';

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    transformPrice: (price: number | string) => string;
  }
}
