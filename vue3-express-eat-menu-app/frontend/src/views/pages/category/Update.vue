<script>
import { defineComponent, onMounted, ref, watch } from "vue";
import ApiService from "@/core/services/ApiService.js";
import { useAuthStore } from "@/stores/auth/authStore";
import { toast } from "vue3-toastify";

export default defineComponent({
  name: "pages-category-add-modal",
  components: {},
  props: {
    serviceName: String,
    updatePayload: Object,
  },

  setup(props, context) {
    // console.log("props :>> ", props.tableSettings);
    const authStore = useAuthStore();

    // title
    // description
    // extras

    const addFormRef = ref(null);
    const updateItemPayload = ref({
      data: {
        title: "",
        description: "",
        tax: "",
        tax_number: "",
        address: "",
        licence_id: "",
      },
      rule: {
        title: [
          {
            required: true,
            message: "title is required",
            trigger: "change",
          },
        ],
      },
      loading: false,
    });

    const submitSaveItem = (e) => {
      console.log("submit save add Item", e);

      if (!addFormRef.value) {
        return;
      }

      addFormRef.value.validate((valid) => {
        if (valid) {
          console.log("saved", updateItemPayload.value.data);
          ApiService.put(
            `${props.serviceName}/update/${props?.updatePayload.id}`,
            updateItemPayload.value.data
          )
            .then((res) => {
              console.log("res :>> ", res);
              toast.success("Success !");
              //close modal
              context.emit("closeModal", "update");
            })
            .catch((err) => {
              toast.error("Error !");
              console.log("err :>> ", err);
            });
        }
      });
    };

    const licenceData = ref([]);
    const getLicenceData = () => {
      ApiService.post(`licences/list`, { page: 1, limit: 100 }).then((res) => {
        console.log("res :>> ", res);
        licenceData.value = res.data.data;
      });
    };

    watch(
      () => props.updatePayload,
      (data) => {
        console.log("degisti  :>> ", data);

        getLicenceData();
        updateItemPayload.value.data.title = props?.updatePayload.title || "";
        updateItemPayload.value.data.description =
          props?.updatePayload.description || "";
        updateItemPayload.value.data.licence_id =
          props?.updatePayload.licence_id || "";
        updateItemPayload.value.data.tax = props?.updatePayload.tax || "";
        updateItemPayload.value.data.tax_number =
          props?.updatePayload.tax_number || "";
        updateItemPayload.value.data.address =
          props?.updatePayload.address || "";
      }
    );

    onMounted(() => {
      console.log("istek atildi");
    });

    return {
      authStore,
      updateItemPayload,
      submitSaveItem,
      addFormRef,

      //

      licenceData,
      getLicenceData,
    };
  },
});
</script>

<template>
  <el-form
    @submit.prevent="submitSaveItem"
    :model="updateItemPayload.data"
    :rules="updateItemPayload.rule"
    ref="addFormRef"
  >
    <div class="modal-body py-10 px-lg-17">
      <div
        class="scroll-y me-n7 pe-7"
        id="modal_update_company_scroll"
        data-kt-scroll="true"
        data-kt-scroll-activate="{default: false, lg: true}"
        data-kt-scroll-max-height="auto"
        data-kt-scroll-dependencies="#modal_update_company_header"
        data-kt-scroll-wrappers="#modal_update_company_scroll"
        data-kt-scroll-offset="300px"
      >
        <!-- //body start -->

        <div class="fv-row mb-7" v-if="authStore.user.userType == 0">
          <label class="fs-6 fw-semobold mb-2">Licence</label>

          <el-form-item prop="licence">
            <el-select
              @click="getLicenceData"
              class="w-100"
              v-model="updateItemPayload.data.licence_id"
              placeholder="Select an option"
            >
              <el-option
                v-for="scope in licenceData"
                :label="scope.title"
                :value="scope.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>

        <div class="fv-row mb-7">
          <label class="required fs-6 fw-semobold mb-2">Title</label>

          <el-form-item prop="title">
            <el-input
              v-model="updateItemPayload.data.title"
              type="text"
              placeholder=""
            />
          </el-form-item>
        </div>

        <div class="fv-row mb-7">
          <label class="fs-6 fw-semobold mb-2">Description</label>

          <el-form-item prop="description">
            <el-input
              v-model="updateItemPayload.data.description"
              type="text"
              placeholder=""
            />
          </el-form-item>
        </div>

        <div class="row">
          <div class="col-md-6">
            <div class="fv-row mb-7">
              <label class="fs-6 fw-semobold mb-2">Tax</label>

              <el-form-item prop="tax">
                <el-input v-model="updateItemPayload.data.tax" type="text" />
              </el-form-item>
            </div>
          </div>
          <div class="col-md-6">
            <div class="fv-row mb-7">
              <label class="fs-6 fw-semobold mb-2">Tax Number</label>

              <el-form-item prop="tax_number">
                <el-input
                  v-model="updateItemPayload.data.tax_number"
                  type="text"
                />
              </el-form-item>
            </div>
          </div>
        </div>

        <div class="fv-row mb-7">
          <label class="fs-6 fw-semobold mb-2">Address</label>

          <el-form-item prop="address">
            <el-input
              v-model="updateItemPayload.data.address"
              :autosize="{ minRows: 2, maxRows: 4 }"
              type="textarea"
              placeholder="Please input"
            />
          </el-form-item>
        </div>

        <!-- //body end -->
      </div>
    </div>

    <div class="modal-footer flex-center">
      <button
        type="reset"
        id="modal_update_company_cancel"
        class="btn btn-light me-3"
      >
        Discard
      </button>

      <button
        :data-kt-indicator="updateItemPayload.loading ? 'on' : null"
        class="btn btn-lg btn-primary"
        type="submit"
      >
        <span v-if="!updateItemPayload.loading" class="indicator-label">
          Submit
          <KTIcon icon-name="arrow-right" icon-class="fs-2 me-2 me-0" />
        </span>
        <span v-if="updateItemPayload.loading" class="indicator-progress">
          Please wait...
          <span
            class="spinner-border spinner-border-sm align-middle ms-2"
          ></span>
        </span>
      </button>
    </div>
  </el-form>
</template>

<style scope></style>
