<template>
  <div class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
    <div class="max-w-md mx-auto">
      <div>
        <q-item-label class="text-h6 mb-4">My Cart</q-item-label>

        <q-item dense clickable v-ripple>
          <q-item-section avatar top>
            <q-avatar icon="place" color="primary" text-color="white" />
          </q-item-section>

          <q-item-section>
            <q-item-label lines="1" class="text-lg">Pin your location</q-item-label>
            <q-item-label caption>{ Address }</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon name="chevron_right" color="black" />
          </q-item-section>
        </q-item>

        <q-separator color="grey" spaced />

        <q-item-label class="text-h6 mb-4">Order Summary</q-item-label>
        <q-item-label class="text-l font-semibold mb-4">General Items</q-item-label>

        <q-item dense v-for="i in 5" :key="i">
          <q-item-section top>{ quantity }</q-item-section>
          <q-item-section>{ item name }</q-item-section>
          <q-item-section side>{ price }</q-item-section>
        </q-item>

        <q-item-label class="text-l font-semibold mb-4">Prescription</q-item-label>
        <q-item dense v-for="i in 5" :key="i">
          <q-item-section top>{ quantity }</q-item-section>
          <q-item-section>{ medicine }</q-item-section>
          <q-item-section side>{ price }</q-item-section>
        </q-item>

        <q-item dense>
          <q-item-section top>Subtotal</q-item-section>
          <q-item-section side>{ subtotal }</q-item-section>
        </q-item>

        <q-item dense>
          <q-item-section top>Delivery fee</q-item-section>
          <q-item-section side>{ delivery fee }</q-item-section>
        </q-item>

        <q-item dense>
          <q-item-section top class="font-semibold">Total</q-item-section>
          <q-item-section side>{ Total }</q-item-section>
        </q-item>
      </div>

      <q-separator color="grey" spaced />

      <q-item-label class="text-l font-semibold mb-4">Payment Method</q-item-label>
      <q-select Rounded filled v-model="model" :options="options" label="Default Payment method">
        <template v-slot:prepend></template>
      </q-select>
      <div class="row justify-center">
        <q-btn class="mt-10" unelevated rounded color="primary" label="Place Order" />
      </div>
    </div>
  </div>
</template> 

<script>
import { ref } from 'vue'
export default {
  setup() {
    return {
      model: ref(null),
      options: [
        'Payment Method1', 'Payment Method2', 'Cash-on-Delivery'
      ]
    }
  }
}
</script>