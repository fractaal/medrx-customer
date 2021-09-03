import { LocalStorage } from 'quasar'
import { ref } from 'vue'

export const seed = ref(LocalStorage.getItem('seed') ?? Math.random() * 1000)

export const randomizeSeed = () => {
    seed.value = Math.random() * 1000
    LocalStorage.set('seed', seed.value)
}

LocalStorage.set('seed', seed.value)

