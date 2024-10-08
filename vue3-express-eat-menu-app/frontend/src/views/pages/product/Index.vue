<script setup>
import { onMounted, ref } from "vue";
import { Modal } from "bootstrap";
import DataGrid from "@/components/DataGrid.vue";
import Create from "./Create.vue";
import Update from "./Update.vue";
import JwtService from "@/core/services/JwtService";

const tableSettings = ref({
  settings: {
    detailBtn: true,
    detailBtnCallback: (row) => {
      console.log("row in tablesettings :>> ", row);
    },
    show: {
      add: true,
      update: true,
      delete: true,
    },
    filter: true,
  },
  service: {
    requestUrl: "products/list",
    name: "products",
    deleteServiceName: "products",
    createUrl: "products/create",
    updateServiceName: "products",
    where: {},
  },
  bodyData: [
    { label: "Company", name: "company", type: "select", key: "title" },
    { label: "Category", name: "category", type: "select", key: "title" },
    { label: "Title", name: "title" },
    { label: "Description", name: "description" },
   
    // {
    //   label: "Finish Date",
    //   name: "finish_date",
    //   type: "time",
    //   timeType: "onlyYear",
    // },
    // { label: "StartDate", name: "category", type: "select", key: "title" },
  ],
});

const dataGridRef = ref();
const updatePayload = ref({});

let addModal;
let updateModal;

const createItem = (e) => {
  // Diğer kodlar
  addModal = new Modal(document.getElementById("modal_add_profile"));
  addModal.show();
};

const updateItem = (e) => {
  updateModal = new Modal(document.getElementById("modal_update_profile"));
  updateModal.show();
  // console.log("updateItem  :>> ", e);
  updatePayload.value = e;
};

const closeModal = (e) => {
  // location.reload();
  if (e == "add") {
    addModal.hide();
    //RELOAD DATA GRID
    dataGridRef.value.changePageFunc("reload");
  } else if (e == "update") {
    updateModal.hide();
    dataGridRef.value.changePageFunc("reload");
  }
};

onMounted(() => {
  KTComponents.init();

  // configler cakilsin
});
</script>

<template>
  <div class="d-flex flex-column">
    <DataGrid
      ref="dataGridRef"
      :tableSettings="tableSettings"
      @reloadPage="closeModal"
      @createItem="createItem"
      @updateItem="updateItem"
    ></DataGrid>
  </div>

  <!-- modal -->
  <div
    class="modal fade"
    id="modal_add_profile"
    tabindex="-1"
    aria-hidden="true"
  >
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
          <h2 class="fs-2x fw-bold mb-5 text-center">Create Profile</h2>
          <!--begin:Form-->
          <Create
            :createUrl="tableSettings.service.createUrl"
            @closeModal="closeModal"
          ></Create>
          <!--end:Form-->
        </div>
        <!--end::Modal body-->
      </div>
      <!--end::Modal content-->
    </div>
    <!--end::Modal dialog-->
  </div>
  <div
    class="modal fade"
    id="modal_update_profile"
    tabindex="-1"
    aria-hidden="true"
  >
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
          <h2 class="fs-2x fw-bold mb-5 text-center">Update Role</h2>
          <!--begin:Form-->
          <Update
            :updatePayload="updatePayload"
            :serviceName="tableSettings.service.updateServiceName"
            @closeModal="closeModal"
          ></Update>
          <!--end:Form-->
        </div>
        <!--end::Modal body-->
      </div>
      <!--end::Modal content-->
    </div>
    <!--end::Modal dialog-->
  </div>
</template>
