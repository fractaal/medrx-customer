<template>
  <q-skeleton
    class="p-8"
    :class="isActive ? 'bg-gray-100' : 'bg-transparent'"
    style="display: flex"
    :animation="isActive ? 'wave' : 'none'"
  >
    <span v-if="isActive" class="absolute h-6 w-6 rounded-full bg-blue-500 animate-ping duration-75" />
    <span class="absolute h-6 w-6 rounded-full" :class="isActive ? 'bg-blue-500' : 'bg-gray-600'" />
    <span class="absolute h-[120px] -mt-8 w-0.5 ml-[11px] z-[-5] bg-gray-200" />
    <span>
      <p class="ml-12 font-medium">{{ deliveryLog.message }}</p>
      <p class="ml-12 text-sm">
        {{ formatDistanceToNow(deliveryLog.dateTime, { includeSeconds: true, addSuffix: true }) }}
      </p>
    </span>
  </q-skeleton>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { formatDistanceToNow } from 'date-fns';
import { DeliveryLog } from 'src/models/DeliveryLog';

export default defineComponent({
  name: 'DeliveryLog',
  props: {
    isActive: {
      required: true,
      type: Boolean,
    },
    deliveryLog: {
      required: true,
      type: Object as () => DeliveryLog,
    },
  },
  setup: () => ({ formatDistanceToNow }),
});
</script>
