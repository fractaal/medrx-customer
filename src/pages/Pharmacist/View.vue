<template>
  <q-page>
    <q-item-label class="font-black" overline>PRESCRIPTION VIEW</q-item-label>
    <div v-if="viewedPrescriptionRequest">
      <div class="text-4xl font-bold">
        {{ viewedPrescriptionRequest.firstName }}
        {{ viewedPrescriptionRequest.middleName }}
        {{ viewedPrescriptionRequest.lastName }}
      </div>
      <div class="grid grid-cols-8 gap-4">
        <div class="relative group col-span-5">
          <!-- MedRx Image Viewer -->
          <div v-viewer class="h-[calc(100vh-255px)]">
            <q-img
              class="
                rounded-xl
                shadow-lg
                cursor-pointer
                h-[calc(100vh-255px)]
                filter
                group-hover:brightness-[0.15]
                transition-all
              "
              :src="viewedPrescriptionRequest && viewedPrescriptionRequest.photoUrl"
            />
          </div>
          <div class="absolute top-0 h-full w-full flex content-center justify-center pointer-events-none">
            <div class="group-hover:opacity-100 opacity-0 transition-all group-hover:scale-150">
              <q-icon size="72px" name="zoom_in" color="white" />
              <p class="text-white font-black text-center">View image</p>
            </div>
          </div>
        </div>
        <div class="col-span-3 flex space-y-2">
          <q-btn
            @click="transcribePrescriptionRequest"
            class="w-full bg-medrx text-white p-4 shadow-lg ring-1 ring-green-600"
            flat
            no-caps
            rounded
          >
            <div>
              <div class="text-2xl font-black"><q-icon name="check" size="32px" class="-mt-1 mr-2" />CLAIM</div>
              <div>
                Start transcribing this prescription.<br /><br />
                This option prompts you to search for the appropriate items in this prescription among MedRx stores.
              </div>
            </div>
          </q-btn>
          <q-btn
            class="w-full bg-yellow-600 text-white p-4 shadow-lg ring-1 ring-yellow-700"
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
            class="col-span-2 w-full bg-red-600 text-white p-4 shadow-lg ring-1 ring-red-700"
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
    <q-inner-loading :showing="isLoading">
      <q-spinner size="xl" />
    </q-inner-loading>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import {
  returnPrescriptionRequest as _returnPrescriptionRequest,
  restrictUser as _restrictUser,
  PrescriptionRequest,
  getPrescriptionRequest,
  claimPrescriptionRequest,
} from 'src/api/pharmacist/prescription-requests';
import { LocalStorage, Dialog } from 'quasar';
import { useRouter } from 'vue-router';
import ReturnPrescriptionDialog from 'src/components/Pharmacist/ReturnPrescriptionDialog.vue';

export default defineComponent({
  name: 'PharmacistView',
  setup() {
    const router = useRouter();

    const isLoading = ref(true);
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
        router.push('/pharmacist');
      });
    };

    const transcribePrescriptionRequest = async () => {
      await claimPrescriptionRequest(viewedPrescriptionRequest.value!.userId);
      await router.push(`/pharmacist/transcribe-prescription/${viewedPrescriptionRequest.value!.userId}`);
    };

    const returnPrescriptionRequest = () => {
      Dialog.create({
        component: ReturnPrescriptionDialog,
        componentProps: { prescriptionRequestId: viewedPrescriptionRequest.value!.userId ?? '' },
      }).onOk((data: { message: string }) => {
        _returnPrescriptionRequest(viewedPrescriptionRequest.value!.userId ?? '', data.message);
        router.push('/pharmacist');
      });
    };

    onMounted(() => {
      // Get prescription request based on ID from route params on mount:
      isLoading.value = true;
      getPrescriptionRequest((router.currentRoute.value.params.id as string) ?? '').then((prescriptionRequest) => {
        LocalStorage.set('viewedPrescriptionRequestId', router.currentRoute.value.params.id);
        viewedPrescriptionRequest.value = prescriptionRequest;
        isLoading.value = false;
      });
    });

    return {
      restrictUser,
      transcribePrescriptionRequest,
      returnPrescriptionRequest,
      viewedPrescriptionRequest,
      redirectToPhoto: () => window.open(viewedPrescriptionRequest.value!.photoUrl),
      isLoading,
    };
  },
});
</script>
