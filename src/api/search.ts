import { ref, watch, computed } from 'vue';
import { api } from 'src/boot/axios';
import { ResponseData } from 'src/models/ResponseData';
import { Product } from 'src/models/Product';

const namespaces: Record<string, ReturnType<typeof useSearch>> = {};

const useSearch = () => {
  const searchResults = ref<Product[]>([]);
  const searchTerm = ref('');
  const searchIsLoading = ref(false);
  const searchIsActive = computed(() => searchTerm.value.length > 2);

  watch(searchTerm, async (newSearchTerm) => {
    searchResults.value = [];
    searchResults.value = await search(newSearchTerm);
  });

  /**
   * Ideally you shouldn't call this on your own. There is an internal watcher for search term changes which then calls this.
   */
  const search = async (searchTerm: string, pageNumber = 0): Promise<Product[]> => {
    if (searchTerm == '') {
      return [];
    }
    console.log('searching for', searchTerm);
    searchIsLoading.value = true;
    const res = await api.post<ResponseData<Record<string, any>>>('/search', { searchTerm, pageNumber });
    searchIsLoading.value = false;
    return res.data.data.results;
  };

  return {
    searchResults: computed(() => searchResults.value),
    searchIsLoading: computed(() => searchIsLoading.value),
    searchIsActive,
    searchTerm,
    search,
  };
};

export const useNamedSearch = (namespace: string) => {
  if (!namespaces[namespace]) {
    namespaces[namespace] = useSearch();
  }
  return namespaces[namespace];
};

export default useSearch;
