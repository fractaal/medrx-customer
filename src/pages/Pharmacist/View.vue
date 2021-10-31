<template>
  <q-item-label class="font-black" overline>PRESCRIPTION VIEW</q-item-label>

  <transition
    enter-active-class="animated slideInRight"
    leave-active-class="animated slideOutRight"
    mode="out-in"
    appear
    :duration="150"
  >
    <div v-if="viewedPrescriptionRequest" class="w-full">
      <div class="text-4xl font-bold">
        {{ viewedPrescriptionRequest.firstName }}
        {{ viewedPrescriptionRequest.middleName }}
        {{ viewedPrescriptionRequest.lastName }}
      </div>
      <q-img
        ratio="4/3"
        height="500px"
        class="rounded-xl shadow-lg flex content-center justify-center cursor-pointer"
        :src="viewedPrescriptionRequest.photoUrl"
      />
      <div class="my-4">
        <q-btn outline label="View original image" @click="redirectToPhoto()" />
      </div>
      <q-separator></q-separator>
      <div class="flex md:grid grid-cols-12 gap-4 mt-4">
        <q-btn class="col-span-6 w-full bg-medrx text-white p-4 shadow-lg" flat no-caps rounded>
          <div>
            <div class="text-2xl font-black"><q-icon name="check" size="32px" class="-mt-1 mr-2" />CLAIM</div>
            <div>
              Start transcribing this prescription.<br /><br />
              This option prompts you to search for the appropriate items in this prescription among MedRx stores.
            </div>
          </div>
        </q-btn>
        <q-btn
          class="col-span-4 w-full bg-yellow-600 text-white p-4 shadow-lg"
          flat
          no-caps
          rounded
          @click="returnPrescriptionRequest()"
        >
          <div>
            <div class="text-2xl font-black"><q-icon name="logout" size="32px" class="-mt-1 mr-2" />RETURN</div>
            <div>
              The image is too blurry, or some other reason makes it difficult to transcribe. <br /><br />
              This option fails the user’s prescription request.
            </div>
          </div>
        </q-btn>
        <q-btn
          class="col-span-2 w-full bg-red-600 text-white p-4 shadow-lg"
          flat
          no-caps
          rounded
          @click="restrictUser()"
        >
          <div>
            <div class="text-2xl font-black"><q-icon name="dangerous" size="32px" class="-mt-1 mr-2" />RESTRICT</div>
            <div>This image is inappropriate.</div>
          </div>
        </q-btn>
      </div>
    </div>
    <div v-else class="h-full w-full flex flex-col content-center justify-center opacity-50">
      <q-icon name="help" size="72px" class="mx-auto" />
      <div class="font-black italic text-2xl">No prescription request selected</div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue';
import {
  returnPrescriptionRequest as _returnPrescriptionRequest,
  restrictUser as _restrictUser,
  PrescriptionRequest,
} from 'src/api/pharmacist/prescription-requests';
import { Dialog } from 'quasar';
import ReturnPrescriptionDialog from 'src/components/ReturnPrescriptionDialog.vue';

export default defineComponent({
  name: 'PharmacistView',
  props: {
    viewedPrescriptionRequest: {
      type: Object as () => PrescriptionRequest,
      required: true,
    },
  },
  setup(props) {
    const { viewedPrescriptionRequest } = toRefs(props);
    const restrictUser = () => {
      Dialog.create({
        title: 'Are you sure?',
        message: "By restricting this user, they won't be able send their prescriptions until they are unrestricted.",
        color: 'red',
        cancel: true,
        focus: 'cancel',
      }).onOk(async () => {
        await _restrictUser(
          viewedPrescriptionRequest.value.userId ?? '',
          'The image you sent was inappropriate and you have been restricted from uploading more prescriptions for a time.'
        );
      });
    };

    const returnPrescriptionRequest = () => {
      Dialog.create({
        component: ReturnPrescriptionDialog,
        componentProps: { prescriptionRequestId: viewedPrescriptionRequest.value.userId ?? '' },
      }).onOk((data: { message: string }) => {
        _returnPrescriptionRequest(viewedPrescriptionRequest.value.userId ?? '', data.message);
      });
    };

    return {
      restrictUser,
      returnPrescriptionRequest,
      redirectToPhoto(url: string) {
        window.open(url);
      },
    };
  },
});
</script>
