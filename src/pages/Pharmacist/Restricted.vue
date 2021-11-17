<template>
  <q-page>
    <q-item-label overline class="font-black">RESTRICTED USERS</q-item-label>
    <!-- Display currently restricted users: -->
    <div class="grid grid-cols-3 gap-4 mt-2" v-if="numRestrictedUsers != 0">
      <q-card v-for="user in restrictedUsers" :key="user.id">
        <q-card-section>
          <p class="font-bold">{{ user.firstName }} {{ user.middleName }} {{ user.lastName }}</p>
          <p>Restricted {{ formatRelative(new Date(user.restrictedOn), new Date()) }}</p>
          <!-- TODO: Make date reactive -->
        </q-card-section>
        <q-card-actions>
          <q-btn flat color="red" @click="unrestrictUserWithPrompt(user.id)">Remove</q-btn>
        </q-card-actions>
      </q-card>
    </div>
    <empty-placeholder icon="sentiment_dissatisfied" text="No restricted users" v-else />
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { formatRelative } from 'date-fns';
import * as restrictedUsers from 'src/api/pharmacist/restricted-users';
import EmptyPlaceholder from 'src/components/EmptyPlaceholder.vue';
import { Dialog } from 'quasar';

export default defineComponent({
  components: { EmptyPlaceholder },
  name: 'PharmacistRestrictedUsers',
  setup() {
    const unrestrictUserWithPrompt = (userId: string) => {
      Dialog.create({
        title: 'Remove Restricted User',
        message: 'Are you sure you want to remove this user from the restricted list?',
        focus: 'cancel',
        cancel: true,
      }).onOk(async () => {
        await restrictedUsers.unrestrictUser(userId);
      });
    };
    return {
      ...restrictedUsers,
      formatRelative,
      unrestrictUserWithPrompt,
    };
  },
});
</script>
