<template>
  <transition
    enter-active-class="animated fadeIn"
    leave-active-class="animated fadeOut"
    appear
    :duration="1000"
  >
    <router-view />
  </transition>
</template>
<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth } from 'firebase/auth'
import { init } from 'src/api/firebase'

export default defineComponent({
  name: 'App',
  setup () {
    init()
    onMounted(async () => {
      if (process.env.MODE === 'capacitor') {
        const { Plugins, StatusBarStyle } = await import('@capacitor/core')
        if (!Plugins) return
        const { StatusBar } = Plugins
        if (!StatusBar) return
        console.log(StatusBar)
        StatusBar.setBackgroundColor({color: '#ffffff'})
        StatusBar.setStyle({style: StatusBarStyle.Light})
      }
    })
    
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
