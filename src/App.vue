<template>
  <router-view v-slot="{ Component }">
    <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" appear :duration="1000">
      <component :is="Component"/>
    </transition>
  </router-view>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth } from 'firebase/auth'
import { init } from 'src/api/firebase'

if (process.env.MODE === 'capacitor') {
  import('src/api/mobile')
}

export default defineComponent({
  name: 'App',
  setup () {
    init()
    
    const router = useRouter()

    getAuth().onAuthStateChanged(user => {
      if (user) {
        router.push('/home')
      } else {
        router.push('/login')
      }
    })
  }
})
</script>
