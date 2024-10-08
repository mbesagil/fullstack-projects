<script setup>
import { onMounted } from "vue";
import BaseModal from "./components/BaseModal.vue";

onMounted(() => {
  KTComponents.init();
  // configler cakilsin
});
</script>

<template>
  <router-view></router-view>
  <base-modal></base-modal>
  <!-- <Drawers></Drawers>
    <DefaultLayout>
        <template #content><Content></Content></template>

</DefaultLayout> -->
</template>

<style >
#app {
  display: contents !important;
}
</style>
