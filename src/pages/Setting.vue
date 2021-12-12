<template>
  <q-page>
    <div>
      <q-img
        class="top rounded-b-2xl"
        src="https://64.media.tumblr.com/85ac3c19f74c65386969162b12e24f46/tumblr_inline_o29dnbbdq41rtb73a_1280.jpg"
        style="height: 130px"
      >
        <div class="absolute-bottom bg-transparent">
          <q-btn round dense flat>
            <q-avatar color="primary" size="70px" @click="randomizeSeed" class="shadow-xl">
              <q-img :src="downloadURL" />
            </q-avatar>
          </q-btn>

          <div class="text-weight-bold">{{ email }}</div>
        </div>
      </q-img>

      <q-list>
        <q-item-label header overline class="font-black">PROFILE</q-item-label>

        <list-item @click="picturechange = true" color="primary" name="person" size="2rem">Profile Picture</list-item>

        <q-dialog persistent v-model="picturechange">
          <q-card style="min-width: 300px">
            <q-card style="min-width: 300px">
              <q-card-section v-show="process === 0">
                <q-btn id="fileSelect" color="primary" unelevated @click="getFile()">
                  <input id="fileSelector" type="file" name="img" style="display: none" @change="showitnow()" />
                  <q-avatar square size="300px">
                    <q-img :src="downloadURL">
                      <div class="rounded-full absolute-center">
                        <q-avatar dense icon="add" size="100px" />
                      </div>
                    </q-img>
                  </q-avatar>
                </q-btn>
              </q-card-section>
              <q-card-section v-show="process === 1">
                <q-avatar square size="300px">
                  <img v-viewer id="pleaseWork" class="object-contain" />
                  <img />
                </q-avatar>
              </q-card-section>
            </q-card>
            <q-card-actions align="right" class="text-primary">
              <q-btn flat label="Cancel" v-close-popup @click="process = 0" />
              <q-btn flat label="Upload" @click="upload()" />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <list-item @click="namechange = true" color="primary" name="badge" size="2rem">Name</list-item>

        <q-dialog v-model="namechange" persistent>
          <q-card style="min-width: 350px">
            <q-card-section>
              <div class="text-h6">Change your name:</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-input dense v-model="firstName" autofocus label="First Name" />
              <q-input dense v-model="middleName" autofocus label="Middle Name" />
              <q-input dense v-model="lastName" autofocus label="Last Name" />
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
              <q-btn flat label="Cancel" v-close-popup />
              <q-btn flat label="Update" v-close-popup @click="updateUser()" />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <list-item @click="phonechange = true" color="primary" name="call" size="2rem">Phone Number</list-item>

        <q-dialog v-model="phonechange" persistent>
          <q-card v-if="pageNum === 0" style="min-width: 350px">
            <q-card-section>
              <div class="text-h6">Change your mobile number:</div>
            </q-card-section>
            <q-card-section class="q-pt-none">
              <q-input dense v-model="phoneNumber" autofocus label="Phone Number" placeholder="+639123456789" />
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
              <q-btn flat label="Cancel" v-close-popup />
              <q-btn flat label="Update" @click="verify()" />
            </q-card-actions>
          </q-card>

          <q-card v-if="pageNum === 1" style="min-width: 350px">
            <q-card-section>
              <div class="text-h6">Enter code:</div>
            </q-card-section>
            <q-card-section class="q-pt-none">
              <q-input dense v-model="verificationCode" autofocus label="Verification Code" maxlength="6" />
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
              <q-btn
                flat
                label="Cancel"
                v-close-popup
                @click="
                  pageNum = 0;
                  phonechange = false;
                "
              />
              <q-btn flat label="Update" v-close-popup @click="updatePhone()" />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <list-item
          id="addressAndLocation"
          @click="addressAndLocationChange = true"
          color="primary"
          name="home"
          size="2rem"
          >Delivery Address & Location</list-item
        >

        <q-dialog v-model="addressAndLocationChange">
          <q-card>
            <q-card-section>
              <div class="text-h6">Change your delivery address or location</div>
            </q-card-section>
            <q-card-section>
              <list-item name="home" @click="addresschange = true">
                <p class="font-black">Change Address</p>
                <p class="text-sm">
                  We'll ask you to write your address down, like how you write it in letters or forms.
                </p>
              </list-item>
              <list-item name="gps_fixed" @click="setDeliveryLocation">
                <p class="font-black">Change Location</p>
                <p class="text-sm">
                  We'll show you a map and ask for the exact location, making it easier for us to deliver to you.
                </p>
              </list-item>
              <list-item class="border-red-200" name="delete" @click="deleteDeliveryLocation">
                <p class="font-black">Delete Location</p>
                <p class="text-sm">If you've previously set a location, press this button to delete it.</p>
              </list-item>
              <q-separator class="my-4" />
              <div class="px-2 pb-4">
                <div class="text-h6 font-black">What's the difference?</div>
                <span class="space-y-4">
                  <li>
                    <b>Privacy.</b>
                    <br />Your location is not stored on our servers. It's <b>stored on your device only</b>, and it is
                    <b>only given to the driver that delivers to you.</b> But, if you use MedRx on multiple devices, you
                    may have to set your location on each device.
                  </li>
                  <li>
                    <b>Ease.</b>
                    <br />Providing an exact location as opposed to just an address will allow us to
                    <b>deliver exactly to where you want without any difficulties.</b>
                  </li>
                  <li>
                    <b>Optionality.</b>
                    <br />You <b>can opt to not provide an exact location</b>, and just provide an address, but you'll
                    have to
                    <b>guide us to the exact location of your address.</b>
                  </li>
                  <li>
                    <b>Inclusivity.</b>
                    <br />You can provide both an address and an exact location, and we'll use the exact location to
                    deliver!
                  </li>
                </span>
              </div>
            </q-card-section>
          </q-card>
        </q-dialog>

        <q-dialog v-model="addresschange" persistent>
          <q-card style="min-width: 350px">
            <q-card-section>
              <div class="text-h6">Change your address:</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-input dense v-model="address" autofocus label="Address" />
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
              <q-btn flat label="Cancel" v-close-popup />
              <q-btn flat label="Update" v-close-popup @click="updateUser()" />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <list-item color="primary" name="shop" size="2rem">Order History</list-item>

        <q-item-label header overline class="font-black">USER CONTROLS</q-item-label>

        <list-item @click="chlang = true" color="primary" name="language" size="2rem"
          >Current Language: {{ locale }}</list-item
        >

        <q-dialog v-model="chlang">
          <q-card>
            <q-list bordered separator>
              <q-item clickable v-ripple>
                <q-item-section
                  v-model="locale"
                  @click="
                    locale = 'TGL';
                    chlang = false;
                  "
                  >Filipino</q-item-section
                >
              </q-item>
              <q-item clickable v-ripple>
                <q-item-section
                  v-model="locale"
                  @click="
                    locale = 'en-US';
                    chlang = false;
                  "
                  >English</q-item-section
                >
              </q-item>
            </q-list>
          </q-card>
        </q-dialog>

        <list-item @click="confirm = true" color="primary" name="logout" size="2rem">Log Out</list-item>

        <q-dialog v-model="confirm" persistent>
          <q-card>
            <q-list>
              <q-card-section class="row items-center">
                <q-avatar icon="warning" color="primary" text-color="white" />
                <span class="q-ml-sm">Are you sure you want to log-out?</span>
              </q-card-section>

              <q-card-actions>
                <q-btn flat label="No" color="primary" style="width: 150px" v-close-popup />
                <q-btn flat label="Yes" color="primary" style="width: 150px" v-close-popup @click="logout" />
              </q-card-actions>
            </q-list>
          </q-card>
        </q-dialog>
        <!-- TODO: Conditionally hide this based on user role -->
        <div v-if="token && token.claims.roles && token.claims.roles.includes('pharmacist')">
          <q-item-label header overline class="font-black">SPECIAL</q-item-label>

          <list-item color="primary" name="dashboard" size="2rem" @click="$router.push('/pharmacist')"
            >Pharmacist Interface</list-item
          >
        </div>
      </q-list>
    </div>
    <div id="verify"></div>
  </q-page>
</template>

<script lang="ts">
import { seed, randomizeSeed } from 'src/api/seed';
import { useI18n } from 'vue-i18n';
import { ref, watch } from 'vue';
import { getAuth, signOut, updatePhoneNumber, RecaptchaVerifier, PhoneAuthProvider } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { update } from 'src/api/firebase';
import { Dialog, useQuasar } from 'quasar';
import { token } from 'src/api/auth';
import ListItem from 'src/components/ListItem.vue';
import { firstName, middleName, lastName, phoneNumber, address, email, region, city } from 'src/api/settings';
import * as deliveryLocation from 'src/api/delivery-location';
import { uploadImage, downloadURL } from 'src/api/profpicuploader';

export default {
  components: { ListItem },
  setup() {
    const router = useRouter();
    const { locale } = useI18n({ useScope: 'global' });
    const auth = getAuth();
    const quasar = useQuasar();
    const pageNum = ref(0);
    const process = ref(0);
    const verificationCode = ref('');
    const verificationId = ref('');
    const phonechange = ref(false);
    const namechange = ref(false);
    const addresschange = ref(false);
    const picturechange = ref(false);
    const addressAndLocationChange = ref(false);
    const recaptchaVerifier = ref(null as unknown as RecaptchaVerifier);
    //get User dat

    //Add methods here to update specific User data.
    const updateUser = () => {
      update(firstName.value, middleName.value, lastName.value, address.value, region.value, city.value);
    };

    watch(pageNum, async (newPageNum) => {
      if (newPageNum === 1) {
        quasar.loading.show();
        const auth = getAuth();

        if (auth.currentUser) {
          const provider = new PhoneAuthProvider(auth);
          verificationId.value = await provider.verifyPhoneNumber(phoneNumber.value, recaptchaVerifier.value);
          console.log('OTP code sent');
        } else {
          quasar.notify({
            type: 'negative',
            message: "You're not logged in!",
          });
        }
        quasar.loading.hide();
      }
    });

    const verify = async () => {
      if (phoneNumber.value.length === 13 && phoneNumber.value.includes('+639')) {
        pageNum.value = 1;

        recaptchaVerifier.value = new RecaptchaVerifier('verify', { size: 'invisible' }, getAuth());
        console.log('Verifier mounted: ', recaptchaVerifier.value, ' not verifying...');
        await recaptchaVerifier.value.verify();
        console.log('reCAPTCHA verified!');
      } else {
        quasar.notify({ type: 'negative', message: 'Please enter a valid phone number' });
      }
    };

    const updatePhone = async () => {
      try {
        const auth = getAuth();
        quasar.loading.show();
        const phoneCredential = PhoneAuthProvider.credential(verificationId.value, verificationCode.value);
        if (auth.currentUser) {
          await updatePhoneNumber(auth.currentUser, phoneCredential);
          console.log('Phone numbers linked!');
        }
      } catch (err) {
        quasar.notify({ type: 'negative', message: 'The code was invalid. Try again!' });
      } finally {
        quasar.loading.hide();
      }
    };

    const logout = async () => {
      await signOut(auth);
      router.push('/login');
    };
    // Sign-out successful.

    const upload = () => {
      console.log('Uploaded oten');
      picturechange.value = false;
      process.value = 0;
      const image = (<HTMLInputElement>document.getElementById('fileSelector')).files![0];
      uploadImage(image);
    };

    const getFile = () => {
      document.getElementById('fileSelector')?.click();
    };

    const showitnow = () => {
      process.value = 1;
      const image = (<HTMLInputElement>document.getElementById('fileSelector')).files![0];
      const objectURL = window.URL.createObjectURL(image);
      const img = document.getElementById('pleaseWork');
      console.log(img);
      img?.setAttribute('src', objectURL);
    };

    return {
      randomizeSeed,
      seed,
      locale,
      email,
      chlang: ref(false),
      confirm: ref(false),
      pageNum,

      //user change reference and methods
      firstName,
      middleName,
      lastName,
      phoneNumber,
      address,

      //methods
      updateUser,
      updatePhone,
      verificationCode,
      verify,
      upload,
      setDeliveryLocation: deliveryLocation.promptForDeliveryLocationAndSet,
      deleteDeliveryLocation: () => {
        Dialog.create({
          title: 'Delete Delivery Location',
          message: 'Are you sure you want to delete your delivery location?',
          color: 'red',
          focus: 'cancel',
          cancel: true,
          persistent: true,
        }).onOk(() => {
          deliveryLocation.setDeliveryLocation(null);
        });
      },
      //dialog triggers
      namechange,
      phonechange,
      addresschange,
      picturechange,
      addressAndLocationChange,

      // auth token
      token,
      logout,
      process,
      getFile,
      showitnow,

      downloadURL,
    };
  },
};
</script>
