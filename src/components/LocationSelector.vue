<template>
  <div class="gap-4 px-10 grid-cols-2 grid">
    <q-select dense outlined label="Region" :options="regions" v-model="selectedRegion" class="w-full" />
    <q-select
      dense
      outlined
      label="City"
      :disable="cities.length === 0"
      :options="cities"
      v-model="selectedCity"
      class="w-full"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, watch } from 'vue';
import { firestore } from 'src/api/firebase';
import { useQuasar } from 'quasar';
import { getDoc, doc, collection, DocumentData } from 'firebase/firestore';

export default defineComponent({
  name: 'LocationSelector',
  setup(_, { emit }) {
    const quasar = useQuasar();

    const selectedRegion = ref('');
    const selectedCity = ref('');

    const data = ref<DocumentData>({});
    const regions = ref<string[]>([]);
    const cities = computed<string[]>(() => data.value[selectedRegion.value] ?? []);

    onMounted(async () => {
      quasar.loading.show();
      data.value = (await getDoc(doc(collection(firestore, 'service'), 'regions'))).data() ?? {};

      regions.value = Object.keys(data.value).map((region) => region);
      quasar.loading.hide();
    });

    watch([selectedRegion, selectedCity], () => {
      console.log('emitting!');
      emit('input', { region: selectedRegion.value, city: selectedCity.value });
    });

    return {
      // Field values
      selectedRegion,
      selectedCity,

      // Plain values
      regions,
      cities,
    };
  },
});
</script>
