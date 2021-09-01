<template>
  <q-page class='bg-body'>
    
      <q-uploader
        color='bg-uploadheader'
        class='fixed-center'
        style="max-width: 300px"
        url="http://localhost:4444/upload"
        label="Upload your images here:"
        multiple
        accept=".jpg, image/*"
        @rejected="onRejected"
      />
    
 

  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import { ref } from 'vue';

export default defineComponent({
  name: 'PageIndex',
  setup () {
    return {
      tab: ref('mails')
    }
  }
})


</script>

<style scoped>
.bg-body {
  background: #97f4e6;
}


</style>