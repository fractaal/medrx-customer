<template>
  <q-card style="min-width: 300px">
    <q-card-section v-show="process === 0">
      <q-btn id="fileSelect" color="primary" unelevated @click="getFile()">
        <input id="fileSelector" type="file" name="img" style="display: none" @change="showitnow()" />
        <q-avatar square size="300px">
          <q-img :src="`https://avatars.dicebear.com/api/micah/${seed}.svg`">
            <div class="rounded-full absolute-center">
              <q-avatar dense icon="add" size="100px" />
            </div>
          </q-img>
        </q-avatar>
      </q-btn>
    </q-card-section>
    <q-card-section v-show="process === 1">
      <q-avatar square size="300px">
        <img v-viewer id="pleaseWork" class="object-contain" />
        <img />
      </q-avatar>
    </q-card-section>
  </q-card>
  <q-card-actions align="right" class="text-primary">
    <q-btn flat label="Cancel" v-close-popup />
    <q-btn flat label="Upload" @click="upload()" />
  </q-card-actions>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { seed } from 'src/api/seed';
import { uploadImage } from 'src/api/profpicuploader';

export default defineComponent({
  name: 'ImageUploader',
  setup() {
    const process = ref(0);

    const getFile = () => {
      document.getElementById('fileSelector')?.click();
    };

    // const preview = () => {
    //   image.value = document.getElementById('fileSelector').files[0];
    // }

    const showitnow = () => {
      process.value = 1;
      const image = (<HTMLInputElement>document.getElementById('fileSelector')).files[0];
      const objectURL = window.URL.createObjectURL(image);
      const img = document.getElementById('pleaseWork');
      console.log(img);
      img?.setAttribute('src', objectURL);
    };

    return {
      process,
      seed,
      getFile,
      showitnow,
    };
  },
});
</script>
