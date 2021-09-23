<template>
  <q-page>
    <!-- Mobile Nuber Submission -->
    <div v-if="pageNum === 0">
      <div class="mt-20 text-4xl text-center font-black">Phone Verification</div>
      <div class="px-10 text-sm font-bold">We need your number to verify your identity.</div>
      <div class="gap-4 px-10 grid-cols-1 grid">
        <div>
          <q-input
            v-model="mobileNumber"
            class="text-3xl"
            outlined
            label="Phone Number"
            placeholder="+639123456789"
            :rules="numberRules"
          />
        </div>
        <div align="right">
          <q-btn
            @click="stepOneValidation()"
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
    <div v-else-if="pageNum === 1">
      <div class="mt-20 px-10 text-4xl font-black text-MedRx_theme">Almost there!</div>
      <div class="px-10 text-sm font-semibold">Enter the code sent to {{ mobileNumber }}.</div>
      <div class="px-10 text-sm font-semibold">It should be 6 digits long.</div>
      <div class="gap-4 px-10 grid-cols-1 grid">
        <div class="mt-3">
          <q-input class="text-4xl" v-model="verificationCode" outlined label="Verification Code" maxlength="6" />
        </div>
        <div>
          <q-btn
            class="px-8 py-2 font-black bg-gradient-to-tr from-medrx to-green-200"
            color="none"
            label="Continue"
            @click="stepTwoValidation()"
            unelevated
          />
        </div>
        <div align="right" class="font-semibold">Didn't receive a code?</div>
        <div align="right">
          <q-btn
            no-caps
            :disabled="countDownDone"
            @click="countDown()"
            class="px-8 py-2 font-black bg-gradient-to-tr from-medrx to-green-200"
            color="none"
            unelevated
            >Send a new code ({{ timer }}s)</q-btn
          >
        </div>
      </div>
    </div>
    <div id="verify"></div>
  </q-page>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { defineComponent, ref, onMounted, watch } from 'vue';
import { linkWithPhoneNumber, RecaptchaVerifier, getAuth, ConfirmationResult } from 'firebase/auth';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'PhoneVerify',
  setup() {
    const quasar = useQuasar();
    const router = useRouter();

    const pageNum = ref(1);

    const recaptchaVerifier = ref(null as unknown as RecaptchaVerifier);

    const mobileNumber = ref('+639');
    const verificationCode = ref('');
    const confirmationResult = ref<ConfirmationResult>(null as unknown as ConfirmationResult);
    const timer = ref(0);
    const countDownDone = ref(false);

    const countDown = () => {
      timer.value = 25;
      countDownDone.value = true;

      const interv = setInterval(function () {
        if (timer.value !== 0) {
          timer.value--;
        } else {
          countDownDone.value = false;
          clearInterval(interv);
        }
        console.log(timer.value);
      }, 1000);
    };

    // On mounted, start the invisible recaptcha verifier.
    onMounted(async () => {
      recaptchaVerifier.value = new RecaptchaVerifier('verify', { size: 'invisible' }, getAuth());
      console.log('Verifier mounted: ', recaptchaVerifier.value, ' not verifying...');
      await recaptchaVerifier.value.verify();
      console.log('reCAPTCHA verified!');
    });

    // Ensure number starts with +639.
    watch(mobileNumber, (newNum) => {
      if (!newNum.startsWith('+639') || /[a-zA-Z]/g.test(newNum)) {
        mobileNumber.value = '+639';
      }
    });

    // If we're on the 2nd page, send OTP code.
    watch(pageNum, async (newPageNum) => {
      if (newPageNum === 1) {
        quasar.loading.show();
        const auth = getAuth();

        if (auth.currentUser) {
          confirmationResult.value = await linkWithPhoneNumber(
            auth.currentUser,
            mobileNumber.value,
            recaptchaVerifier.value
          );
          console.log('OTP code sent');
        } else {
          quasar.notify({
            type: 'negative',
            message: `You're not logged in!`,
          });
        }
        quasar.loading.hide();
      }
    });

    const stepOneValidation = () => {
      if (mobileNumber.value) {
        pageNum.value = 1;
        countDown();
      } else {
        quasar.notify('Please enter your mobile number.');
      }
    };

    // OTP code confirmation.
    const stepTwoValidation = async () => {
      try {
        quasar.loading.show();
        await confirmationResult.value.confirm(verificationCode.value);
        console.log('Phone numbers linked!');
        router.push('/home');
      } catch (err) {
        quasar.notify({ type: 'negative', message: 'The code was invalid. Try again!' });
      } finally {
        quasar.loading.hide();
      }
    };

    return {
      // Rules
      numberRules: [
        (val: string) => (val && val.length === 13 && val.includes('+639')) || 'Please enter a valid phone number',
      ],

      // Form fields
      verificationCode,
      mobileNumber,

      // Functions
      stepOneValidation,
      stepTwoValidation,
      countDown,

      // Plain values
      countDownDone,
      timer,
      pageNum,
    };
  },
});
</script>
