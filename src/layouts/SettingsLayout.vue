<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
          <q-btn dense flat v-ripple round class='back' to='/home'>
            <q-icon size="2rem" class="p-4">
              <img src="../../public/icons/back_arrow.svg"/>
            </q-icon>
          </q-btn>
          <q-toolbar-title>Settings</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>


<script>
export default {
  name: 'SettingsLayout'
}
</script>



      