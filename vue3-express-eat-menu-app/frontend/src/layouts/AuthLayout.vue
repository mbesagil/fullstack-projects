<template>
  <!--begin::Authentication Layout -->
  <div class="d-flex flex-column flex-lg-row flex-column-fluid">
    <!--begin::Body-->
    <div
      class="d-flex flex-column flex-lg-row-fluid w-lg-50 p-10 order-2 order-lg-1"
    >
      <!--begin::Form-->
      <div class="d-flex flex-center flex-column flex-lg-row-fluid">
        <!--begin::Wrapper-->
        <div class="w-lg-500px p-10">
          <router-view></router-view>
        </div>
        <!--end::Wrapper-->
      </div>
      <!--end::Form-->

      <!--begin::Footer-->
      <div class="d-flex flex-center flex-wrap px-5">
        <!--begin::Links-->
        <div class="d-flex fw-semibold text-primary fs-base">
          <a href="#" class="px-5" target="_blank">Terms</a>

          <a href="#" class="px-5" target="_blank">Plans</a>

          <a href="#" class="px-5" target="_blank">Contact Us</a>
        </div>
        <!--end::Links-->
      </div>
      <!--end::Footer-->
    </div>
    <!--end::Body-->

    <!--begin::Aside-->
    <div
      class="d-flex flex-lg-row-fluid w-lg-50 bgi-size-cover bgi-position-center order-1 order-lg-2"
      :style="`background-image: url('')`"
    >
      <!--begin::Content-->
      <div
        class="d-flex flex-column flex-center py-7 py-lg-15 px-5 px-md-15 w-100"
      >
        <!--begin::Logo-->
        <!-- <router-link to="/" class="mb-0 mb-lg-12">
          <img
            alt="Logo"
            :src="'https://carbonotr.com//yedekler/Carbon/index-img/carbon-logo.png'"
            class="h-60px h-lg-75px"
          />
        </router-link> -->
        <!--end::Logo-->
        <!--begin::Title-->
        <h1
          class="d-none d-lg-block text-primary fs-2qx fw-bolder text-center mb-7"
        >
          HASARCI
        </h1>
        <!--end::Title-->
      </div>
      <!--end::Content-->
    </div>
    <!--end::Aside-->
  </div>
  <!--end::Authentication Layout -->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, onMounted } from "vue";
// import LayoutService from "@/core/services/LayoutService";
import { useBodyStore } from "@/stores/bodyStore";

export default defineComponent({
  name: "auth-layout",
  components: {},
  setup() {
    const store = useBodyStore();


    onMounted(() => {

    });

    return {
      getAssetPath,
    };
  },
});
</script>

<style>

body {

}

</style>