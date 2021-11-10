<template>
  <q-page>
    <q-item-label overline class="font-black">RESTRICTED USERS</q-item-label>
    <!-- Display currently restricted users: -->
    <div class="grid grid-cols-5 gap-4"></div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import * as restrictedUsers from 'src/api/pharmacist/restricted-users';

export default defineComponent({
  name: 'PharmacistRestrictedUsers',
  setup() {
    return {
      ...restrictedUsers,
    };
  },
});
</script>
