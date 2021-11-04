<template>
  <q-item-label class="font-black" overline>PRESCRIPTION VIEW</q-item-label>

  <transition
    enter-active-class="animated slideInRight"
    leave-active-class="animated slideOutRight"
    mode="out-in"
    appear
    :duration="150"
  >
    <div v-if="viewedPrescriptionRequest">
      <div class="text-4xl font-bold">
        {{ viewedPrescriptionRequest.firstName }}
        {{ viewedPrescriptionRequest.middleName }}
        {{ viewedPrescriptionRequest.lastName }}
      </div>
      <div class="grid grid-cols-8 gap-4">
        <div class="col-span-5">
          <q-img height="500px" class="rounded-xl shadow-lg cursor-pointer" :src="viewedPrescriptionRequest.photoUrl" />
          <div class="my-4">
            <q-btn icon="zoom_in" outline label="View original image" @click="redirectToPhoto()" />
          </div>
        </div>
        <div class="col-span-3 flex space-y-2">
          <q-btn class="w-full bg-medrx text-white p-4 shadow-lg" flat no-caps rounded>
            <div>
              <div class="text-2xl font-black"><q-icon name="check" size="32px" class="-mt-1 mr-2" />CLAIM</div>
              <div>
                Start transcribing this prescription.<br /><br />
                This option prompts you to search for the appropriate items in this prescription among MedRx stores.
              </div>
            </div>
          </q-btn>
          <q-btn
            class="w-full bg-yellow-600 text-white p-4 shadow-lg"
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
    </div>
    <div v-else class="h-full w-full flex flex-col content-center justify-center opacity-50">
      <q-icon name="help" size="72px" class="mx-auto" />
      <div class="font-black italic text-2xl">No prescription request selected</div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import {
  returnPrescriptionRequest as _returnPrescriptionRequest,
  restrictUser as _restrictUser,
  PrescriptionRequest,
  getPrescriptionRequest,
} from 'src/api/pharmacist/prescription-requests';
import { LocalStorage, Dialog } from 'quasar';
import { useRouter } from 'vue-router';
import ReturnPrescriptionDialog from 'src/components/ReturnPrescriptionDialog.vue';

export default defineComponent({
  name: 'PharmacistView',
  setup() {
    const router = useRouter();

    const viewedPrescriptionRequest = ref<PrescriptionRequest | null>(null);

    const restrictUser = () => {
      Dialog.create({
        title: 'Are you sure?',
        message: "By restricting this user, they won't be able send their prescriptions until they are unrestricted.",
        color: 'red',
        cancel: true,
        focus: 'cancel',
      }).onOk(async () => {
        await _restrictUser(
          viewedPrescriptionRequest.value!.userId ?? '',
          'The image you sent was inappropriate and you have been restricted from uploading more prescriptions for a time.'
        );
      });
    };

    const returnPrescriptionRequest = () => {
      Dialog.create({
        component: ReturnPrescriptionDialog,
        componentProps: { prescriptionRequestId: viewedPrescriptionRequest.value!.userId ?? '' },
      }).onOk((data: { message: string }) => {
        _returnPrescriptionRequest(viewedPrescriptionRequest.value!.userId ?? '', data.message);
      });
    };

    onMounted(() => {
      // Get prescription request based on ID from route params on mount:
      getPrescriptionRequest((router.currentRoute.value.params.id as string) ?? '').then((prescriptionRequest) => {
        LocalStorage.set('viewedPrescriptionRequestId', router.currentRoute.value.params.id);
        viewedPrescriptionRequest.value = prescriptionRequest;
      });
    });

    return {
      restrictUser,
      returnPrescriptionRequest,
      viewedPrescriptionRequest,
      redirectToPhoto() {
        window.open(viewedPrescriptionRequest.value!.photoUrl);
      },
    };
  },
});
</script>
