import { createUploaderComponent } from 'quasar';
import { computed, ref, onUpdated } from 'vue';
import { getApp } from '@firebase/app';
import { uploadBytesResumable, ref as storageRef, getStorage, UploadTask } from 'firebase/storage';
import { getAuth } from '@firebase/auth';
import { Notify } from 'quasar';

// export a Vue component
export default createUploaderComponent({
  // defining the QUploader plugin here

  name: 'FirebaseUploader', // your component's name

  props: {
    // ...your custom props
  },

  emits: [
    // ...your custom events name list
  ],

  injectPlugin({ helpers, emit }) {
    onUpdated(() => {
      console.log(helpers.queuedFiles.value[0]);
    });
    const task = ref<UploadTask | null>(null);

    // [ REQUIRED! ]
    // We're working on uploading files
    const isUploading = ref(false);

    // [ optional ]
    // Shows overlay on top of the
    // uploader signaling it's waiting
    // on something (blocks all controls)
    const isBusy = computed(() => {
      return false;
    });

    // [ REQUIRED! ]
    // Abort and clean up any process
    // that is in progress
    function abort() {
      task.value?.cancel();
      isUploading.value = false;
      helpers.updateFileStatus(helpers.queuedFiles.value[0], 'failed');
      emit('failed');
    }

    // [ REQUIRED! ]
    // Start the uploading process
    function upload() {
      const file = helpers.queuedFiles.value[0];
      task.value = uploadBytesResumable(
        storageRef(getStorage(getApp()), `/users/${getAuth().currentUser?.uid}/prescription.png`),
        file
      );
      emit('uploading');
      isUploading.value = true;
      task.value.on(
        'state_changed',
        (snapshot) => {
          helpers.updateFileStatus(file, 'uploading', snapshot.bytesTransferred);
          helpers.uploadedSize.value = snapshot.bytesTransferred;
        },
        (err) => {
          if (err.code === 'storage/canceled') return;
          Notify.create({
            type: 'negative',
            message: "Something went wrong and we couldn't upload your prescription.",
          });
          console.error(err);
          abort();
          // isUploading.value = false;
          // emit('failed');
        },
        () => {
          helpers.updateFileStatus(file, 'uploaded', file.size);
          isUploading.value = false;
          emit('uploaded');
        }
      );
    }

    return {
      isUploading,
      isBusy,

      abort,
      upload,
    };
  },
});
