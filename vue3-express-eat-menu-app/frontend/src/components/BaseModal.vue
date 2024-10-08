<script setup>
import { onMounted, nextTick } from "vue";
import { useBaseModalStore } from "@/stores/modal/modalStore";

const modalStore = useBaseModalStore();

onMounted(() => {
  //   console.log("modal mount");
  modalStore.initModalRef(); // modal ref
});
</script>

<template>
  <div class="modal fade" id="base_modal" tabindex="-1" aria-hidden="true">
    <!--begin::Modal dialog-->
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <!--begin::Modal content-->
      <div class="modal-content rounded">
        <!--begin::Modal header-->
        <div class="modal-header pb-0 border-0 justify-content-end">
          <!--begin::Close-->
          <div
            class="btn btn-sm btn-icon btn-active-color-primary"
            data-bs-dismiss="modal"
          >
            <i class="ki-duotone ki-cross fs-1">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
          </div>
          <!--end::Close-->
        </div>
        <!--begin::Modal header-->
        <!--begin::Modal body-->
        <div class="modal-body scroll-y px-10 px-lg-15 pt-0 pb-15">
          <h2 class="fs-2x fw-bold mb-5 text-center">{{ modalStore.title }}</h2>
          <!--begin:Form-->
          <!-- <Update
            :updatePayload="updatePayload"
            :serviceName="tableSettings.service.name"
            @closeModal="closeModal"
          ></Update> -->
          <!--end:Form-->

          <component :is="modalStore.component"></component>
        </div>
        <!--end::Modal body-->
      </div>
      <!--end::Modal content-->
    </div>
    <!--end::Modal dialog-->
  </div>
</template>

<style scoped></style>
