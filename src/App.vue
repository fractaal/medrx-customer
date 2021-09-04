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
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth } from 'firebase/auth'
import { init } from 'src/api/firebase'
import { Plugins, StatusBarStyle } from '@capacitor/core'

function useStatusBar() {
  if (!Plugins) return
  const { StatusBar } = Plugins
  if (!StatusBar) return
  console.log(StatusBar)
  StatusBar.setBackgroundColor({color: '#ffffff'})
  StatusBar.setStyle({style: StatusBarStyle.Light})
}

export default defineComponent({
  name: 'App',
  setup () {
    init()
    if (process.env.MODE === 'capacitor') {
      useStatusBar()
    }
    
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
