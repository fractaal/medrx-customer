<template>
  <!-- notice dialogRef here -->
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin p-8">
      <div class="font-black text-xl">Return Prescription</div>
      <p>You're about to return this prescription. Please specify a reason why.</p>
      <br />
      <q-select label="Reason..." rounded outlined :options="reasons" v-model="selectedReason" />
      <br />
      <q-input label="Custom reason..." rounded outlined v-if="isCustomReasonSelected" v-model="customReason" />
      <br />
      <q-card-actions align="right">
        <q-btn unelevated color="red" label="OK" @click="onOKClick" />
        <q-btn unelevated color="primary" label="Cancel" @click="onCancelClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { ref, computed } from 'vue';
import { Notify, useDialogPluginComponent } from 'quasar';

export default {
  props: {
    // ...your custom props
  },

  emits: [
    // REQUIRED; need to specify some events that your
    // component will emit through useDialogPluginComponent()
    ...useDialogPluginComponent.emits,
  ],

  setup() {
    // REQUIRED; must be called inside of setup()
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();
    // dialogRef      - Vue ref to be applied to QDialog
    // onDialogHide   - Function to be used as handler for @hide on QDialog
    // onDialogOK     - Function to call to settle dialog with "ok" outcome
    //                    example: onDialogOK() - no payload
    //                    example: onDialogOK({ /*.../* }) - with payload
    // onDialogCancel - Function to call to settle dialog with "cancel" outcome

    const selectedReason = ref<string | null>(null);
    const reasons = ref([
      'The image was blurry.',
      'The image is not a prescription.',
      'The prescription was not valid.',
      'We could not fulfill your prescription.',
      'Other...',
    ]);

    const isCustomReasonSelected = computed(() => {
      if (selectedReason.value === 'Other...') {
        return true;
      } else {
        return false;
      }
    });
    const customReason = ref('');

    return {
      selectedReason,
      reasons,
      isCustomReasonSelected,
      customReason,

      // This is REQUIRED;
      // Need to inject these (from useDialogPluginComponent() call)
      // into the vue scope for the vue html template
      dialogRef,
      onDialogHide,

      // other methods that we used in our vue html template;
      // these are part of our example (so not required)
      onOKClick() {
        if ((isCustomReasonSelected.value && customReason.value === '') || selectedReason.value === null) {
          Notify.create({
            type: 'negative',
            message: 'You need to have a reason to return this prescription.',
            position: 'center',
          });
          return;
        }

        if (isCustomReasonSelected.value) {
          onDialogOK({ message: customReason.value });
        } else {
          onDialogOK({ message: selectedReason.value });
        }
        // on OK, it is REQUIRED to
        // call onDialogOK (with optional payload)
        // or with payload: onDialogOK({ ... })
        // ...and it will also hide the dialog automatically
      },

      // we can passthrough onDialogCancel directly
      onCancelClick: onDialogCancel,
    };
  },
};
</script>
