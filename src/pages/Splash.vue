<template>
  <div class="min-h-screen">
    <div class="pt-32">
      <video ref="video" playsinline loop autoplay style="width: 75vw;" :style="style" @loadeddata="show" class="mx-auto" :class="animation">
        <source src="~assets/MedRx.webm"/>
      </video>
      <!-- <q-spinner size="32px" :thickness="8" class="mx-auto"/> -->
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
export default defineComponent({
  name: 'Splash',
  setup() {
    const style = ref('display: none; z-index: 10;')
    const animation = ref('')
    const video = ref(null)

    onMounted(() => {
      animation.value = 'splash-logo-enter'
    })

    onBeforeRouteLeave(async () => {
      await new Promise(r => setTimeout(r, 600))
      animation.value = 'splash-logo-leave'
      await new Promise(r => setTimeout(r, 590))
      video.value.pause()
      await new Promise(r => setTimeout(r, 10))
      return true
    })

    return {
      style,
      animation,
      video,
      show: () => style.value = 'display: block; z-index: 10;'
    }
  },
})
</script>