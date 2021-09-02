<template>
  <q-page class='bg-body'>
    
      <test
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
import Test from './Test.vue';

export default defineComponent({
  name: 'PageIndex',
  components: { Test },
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