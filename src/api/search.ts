import { ref, watch } from 'vue';
import { api } from 'src/boot/axios';
import { ResponseData } from 'src/models/ResponseData';
import { Product } from 'src/models/Product';

export const searchResults = ref<Product[]>([]);
export const searchTerm = ref('');
export const isLoading = ref(false);

watch(searchTerm, async (newSearchTerm) => {
  searchResults.value = [];
  searchResults.value = await search(newSearchTerm);
});

export const search = async (searchTerm: string) => {
  if (searchTerm == '') {
    return [];
  }
  console.log('searching for', searchTerm);
  isLoading.value = true;
  const res = await api.post<ResponseData<Record<string, any>>>('/search', { searchTerm });
  isLoading.value = false;
  return res.data.data.results;
};
