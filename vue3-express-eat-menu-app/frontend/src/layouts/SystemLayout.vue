<template>
  <!--begin::System Layout-->
  <div class="d-flex flex-column flex-root p-3 " id="kt_app_root">
    <router-view></router-view>
  </div>
  <!--end::System Layout-->
</template>

<script >
import { defineComponent, onMounted } from "vue";
import { useBodyStore } from "@/stores/bodyStore";

export default defineComponent({
  name: "system-layout",
  components: {},
  setup() {
    const store = useBodyStore();

    onMounted(() => {
      KTComponents.init();

      store.addBodyClassname("app-blank");
      store.addBodyClassname("bgi-size-cover");
      store.addBodyClassname("bgi-position-center");
      store.addBodyClassname("bgi-no-repeat");
    });
  },
});
</script>
