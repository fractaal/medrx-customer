<template>
  <q-page>
    <div class="mt-20 px-10 text-4xl font-black text-MedRx_theme">Almost there!</div>
    <div class="px-10 text-sm font-semibold">Enter the code sent to</div>
    <div class="gap-4 px-10 grid-cols-1 grid">
      <div class="mt-3">
        <q-input class='text-3xl' style="max-width:100px" v-model='code' dense outlined label = "1234"/>
      </div>
      <div>
        <q-btn class="mt-3 w-full md:w-3/4 lg:w-3/5 py-4" color=primary label='Continue' />
      </div>
      <div align='right' class='font-semibold'>Didn't receive a code?</div>
      <div align='right'>
        <q-btn no-caps :disabled='countDownDone' @click='countDown()' color=primary label='Send a new code '>({{timer}}s)
        </q-btn>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({

  setup() {

    const code = ref('');
    const timer = ref('');
    const countDownDone = ref('')

    const countDown = () => {
      timer.value = 25
      countDownDone.value = true
      
      const interv = setInterval(function() {
        if(timer.value !== 0){
          timer.value--
        }else{
          countDownDone.value = false
          clearInterval(interv)
        }
        console.log(timer.value)
      }, 1000);
    }

    onMounted(() => {
      countDown()
    })
    return {
      code,
      countDownDone,
      timer,
      countDown
    }
  },

})

</script>


 
 