<template>
  <!--begin::System Layout-->
  <div class="w-100 h-100" id="kt_app_report" style="background-color: white">
    <router-view></router-view>
  </div>
  <!--end::System Layout-->
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { useBodyStore } from "@/stores/body";

export default defineComponent({
  name: "report-layout",
  components: {},
  setup() {},
});
</script>
