<template>
  <q-page class='bg-body'>
      
    
    <transition name="fade" mode="out-in">
      <firebase-uploader
        v-if="!uploadComplete"
        color='bg-uploadheader'
        class='fixed-center'
        style="max-width: 500px"
        label="Upload your prescription here."
        accept=".jpg, image/*"
        @uploaded="uploadComplete = true"
      />
      <div v-else class="text-h1 font-black text-center pt-64">FUCK YOU</div>
    </transition>
  


  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import FirebaseUploader from 'src/components/FirebaseUploader';

export default defineComponent({
  name: 'PageIndex',
  components: { FirebaseUploader },
  setup () {
    const uploadComplete = ref(false)
    return {
      tab: ref('mails'),
      uploadComplete,
    }
  }
})


</script>

<style scoped>
.bg-body {
  background: #97f4e6;
}


</style>