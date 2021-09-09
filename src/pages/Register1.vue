<template>
    <q-page>
        <div class='mt-20 text-4xl text-center font-black text-MedRx_theme'>Sign Up</div>
        <div class='mt-10 px-10 text-sm  font-semibold'>Let's get you started for your MedRx account first.</div>
        <div class='gap-4 px-10 grid-cols-2 grid'>
            <div>
                    <div class='mt-5 mb-1 text-sm font-semibold'>First name</div>
                    <div style="max-width: 200px">
                        <q-input class='border-green-600' dense outlined label="John" />
                    </div>
            </div>
            <div>
                    <div class='mt-5 mb-1 text-sm font-semibold'>Middle name (Optional)</div>
                    <div style="max-width: 200px">
                        <q-input dense outlined label="Nathan" />
                    </div>
            </div>
            
            </div>
            <div class='gap-4 px-10 grid-cols-2 grid'>
                <div>
                        <div class='mt-5 mb-1 text-sm font-semibold'>Last name</div>
                        <div style="max-width: 200px">
                            <q-input dense outlined label="Doe" />
                        </div>
                </div>
            </div>
            <div class='gap-4 px-10 grid-cols-1 grid'>
                <div>
                        <div class='mt-5 mb-1 text-sm font-semibold'>E-mail address</div>
                        <div>
                            <q-input dense outlined label="youremail@email.com" />
                        </div>
                </div>
            </div>
            <div class='gap-4 px-10 grid-cols-1 grid'>
                <div>
                        <div class='mt-5 mb-1 text-sm font-semibold'>Password</div>
                        <div>
                            <q-input dense outlined label="Password123"/>
                        </div>
                </div>
            </div>
            <div class='gap-4 px-10 mt-3 grid-cols-2 grid'>
                <div/>       
                <div align='right'>            
                    <q-btn color='primary' label="Continue" to='/register2'/> 
                </div>

            </div>

    </q-page>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  setup () {
    return {
    
    }
  }
})

</script>


 