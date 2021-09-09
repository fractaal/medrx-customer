<template>
  <div style="width: 100vw; height: 100vh;" class="flex justify-center content-center">
    <div>
      <video
        ref="video"
        playsinline
        loop
        autoplay
        style="width: 500px;"
        :style="style"
        @loadeddata="show"
        class="mx-auto"
        :class="animation"
      >
        <source src="~assets/MedRx.webm" />
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
      try {
        video.value.play()
      } catch (err) { }
      animation.value = 'splash-logo-enter'
    })

    onBeforeRouteLeave(async () => {
      await new Promise(r => setTimeout(r, 900))
      animation.value = 'splash-logo-leave'
      await new Promise(r => setTimeout(r, 690))
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