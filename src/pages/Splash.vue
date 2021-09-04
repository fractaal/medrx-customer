<template>
  <div class="min-h-screen">
    <div class="pt-32">
      <video playsinline loop autoplay style="width: 75vw;" :style="style" @loadeddata="show" class="mx-auto">
        <source src="~assets/MedRx.webm"/>
      </video>
      <q-spinner size="32px" :thickness="8" class="mx-auto"/>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'Splash',
  setup() {
    const style = ref('display: none;')

    return {
      style,
      show: () => style.value = 'display: block;'
    }
  }
})
</script>