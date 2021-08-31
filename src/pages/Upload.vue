<template>
  <q-page class='bg-body'>

    <q-footer>
      <q-tabs
            v-model="tab"
            dense
            class="navigation-menu"
          >
            <q-route-tab name="mails" label="Shop" to='/home'>
              <img src='../../public/icons/shop.svg'>
            </q-route-tab>
            <q-route-tab name="alarms" label="Prescription">
              <img src='../../public/icons/upload.svg'>
            </q-route-tab>
            <q-route-tab name="movies" label="Soon">
              <img src='../../public/icons/soon.svg'>
            </q-route-tab>
          </q-tabs>
    </q-footer>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import { ref } from 'vue';

export default defineComponent({
  name: 'PageIndex',
  setup () {
    return {
      tab: ref('mails')
    }
  }
})


</script>

<style scoped>
.bg-body {
  background: #97f4e6;
}


.shadow-box {
  width: 90px;
  height: 90px;
  margin: 25px;
  font-size: 12px;
}

.navigation-menu {
  background: #6ae0ce;
  color: #ffffff;

}

</style>