<template>
  <q-page>
    <!-- Mobile Nuber Submission -->
    <div v-if="pageNum === 1">
      <div class="mt-20 text-4xl text-center font-black">Phone Verification</div>
      <div class="px-10 text-sm font-bold">We need your number to verify your identity.</div>
      <div class="gap-4 px-10 grid-cols-1 grid">
        <div>
          <q-input
            v-model="mobileNumber"
            class="text-4xl"
            outlined
            label="Phone Number"
            placeholder="+639123456789"
            :rules="numberRules"
          />
        </div>
        <div align="right">
          <q-btn
            @click="validateTwo()"
            rounded
            unelevated
            color="none"
            label="Continue"
            class="px-8 py-2 font-black bg-gradient-to-tr from-medrx to-green-200"
          />
        </div>
      </div>
    </div>
    <!-- Verification Code Submission -->
    <div v-else-if="pageNum === 2">
      <div class="mt-20 px-10 text-4xl font-black text-MedRx_theme">Almost there!</div>
      <div class="px-10 text-sm font-semibold">Enter the code sent to {{ mobileNumber }}.</div>
      <div class="gap-4 px-10 grid-cols-1 grid">
        <div class="mt-3">
          <q-input class="text-3xl" style="max-width: 100px" v-model="verificationCode" dense outlined label="1234" />
        </div>
        <div>
          <q-btn class="mt-3 w-full md:w-3/4 lg:w-3/5 py-4" color="primary" label="Continue" @click="validateThree()" />
        </div>
        <div align="right" class="font-semibold">Didn't receive a code?</div>
        <div align="right">
          <q-btn no-caps :disabled="countDownDone" @click="countDown()" color="primary" label="Send a new code "
            >({{ timer }}s)</q-btn
          >
        </div>
      </div>
    </div>
    <div id="verify"></div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PhoneVerify',
});
</script>
