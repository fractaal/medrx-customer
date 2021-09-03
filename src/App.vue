<template>
  <router-view />
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth } from 'firebase/auth'
import { init } from 'src/api/firebase'

export default defineComponent({
  name: 'App',
  setup () {
    init()
    
    const router = useRouter()

    getAuth().onAuthStateChanged(user => {
      if (user) {
        router.push('/home')
      }
    })
  }
})
</script>
