<template>
  <q-page>
    <div class="mt-20 px-10 text-4xl font-black text-MedRx_theme">Sign Up</div>
    <div class="px-10 text-sm font-semibold">We need your number to verify your identity.</div>
    <div class="gap-4 px-10 grid-cols-1 grid">
      <div class ="mt-5 font-semibold">Mobile number</div>
      <div>
        <q-input v-model='mobnumber' dense outlined label="+639123456789" lazy-rules :rules='numberrules'/>
      </div>
      <div>
        <q-btn class="mt-7 w-full md:w-3/4 lg:w-3/5 py-4" @click='Validate()' color=primary label='Continue' />

      </div>
    </div>

  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { Notify } from 'quasar'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    const mobnumber = ref('');
    const router = useRouter();

		const Validate = () => {
			if(mobnumber.value){
        router.push('/register3')
			}else{
				Notify.create('Please enter your mobile number.')
			}
		}
  
    return {
      mobnumber,
      Validate,
      numberrules: [
				val => (val && val.length === 13 && val.includes('+639')) || 'Please enter a valid phone number'
			],
    }
  }
})

</script>


 
 