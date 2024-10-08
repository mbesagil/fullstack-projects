<script>
import { defineComponent, onMounted, ref } from "vue";
import { string } from "yup";
import ApiService from "@/core/services/ApiService.js";
import { useAuthStore } from "@/stores/auth/authStore";
import { toast } from "vue3-toastify";

import FileUpload from "@/components/uploads/FileUpload.vue";

export default defineComponent({
  name: "role-add-form",
  components: {},
  props: {
    createUrl: string,
  },

  setup(props, context) {
    // console.log("props :>> ", props.tableSettings);

    const authStore = useAuthStore();

    // title: {
    //   type: Sequelize.STRING,
    // },
    // description: {
    //   type: Sequelize.STRING,
    // },
    // tax_id: {
    //   type: Sequelize.STRING,
    // },
    // tax_office: {
    //   type: Sequelize.STRING,
    // },
    // address: {
    //   type: Sequelize.STRING,
    // },
    // content: {
    //   type: Sequelize.STRING,
    // },
    // images: {
    //   type: Sequelize.ARRAY(DataTypes.JSON),
    // },

    const addFormRef = ref(null);
    const addItemPayload = ref({
      data: {
        title: "",
        description: "",
        content: "",
        images: [],
        company_id: "",
        category_id: "",
      },
      rule: {
        title: [
          {
            required: true,
            message: "Title is required",
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
          console.log("saved", addItemPayload.value.data);
          ApiService.post(`${props.createUrl}`, addItemPayload.value.data)
            .then((res) => {
              console.log("res :>> ", res);
              toast.success("Success !");

              //close modal
              context.emit("closeModal", "add");
            })
            .catch((err) => {
              console.log("err :>> ", err);
              toast.error("Error !");
            });
        }
      });
    };

    const companyData = ref([]);
    const getCompanyData = async () => {
      return await ApiService.post(`companies/list`).then((res) => {
        console.log("res :>> ", res);
        companyData.value = res.data.data;
      });
    };

    const categoryData = ref([]);
    const getCategoryData = async () => {
      return await ApiService.post(`categories/list`, {
        where: { company_id: addItemPayload.value.company_id },
      }).then((res) => {
        console.log("res :>> ", res);
        categoryData.value = res.data.data;
      });
    };

    //upload
    const handleSaveFile = (e, item) => {
      console.log("response emissions save:>> ", e, item);
      if (e.data) {
        console.log("response emissions save:>> ", e);
        if (e.data) {
          //kenisine ait dosyaya yaz
          addItemPayload.value.data.images.push(e.data);
        }
      }
    };

    const handleDeleteFile = (e, item) => {
      console.log("response emissions delete:>> ", e);
      if (e.data) {
        console.log("sil icinde");

        addItemPayload.value.data.images =
          addItemPayload.value.data.images.filter(
            (file) => file.name != e.data.name
          );
      }
    };

    onMounted(() => {
      console.log("istek atildi");
    });

    return {
      authStore,
      addItemPayload,
      submitSaveItem,
      addFormRef,

      companyData,
      getCompanyData,
      categoryData,
      getCategoryData,

      //upload
      handleSaveFile,
      handleDeleteFile,
    };
  },
});
</script>

<template>
  <el-form
    @submit.prevent="submitSaveItem"
    :model="addItemPayload.data"
    :rules="addItemPayload.rule"
    ref="addFormRef"
  >
    <div class="modal-body py-10 px-lg-17">
      <div
        class="scroll-y me-n7 pe-7"
        id="modal_add_company_scroll"
        data-kt-scroll="true"
        data-kt-scroll-activate="{default: false, lg: true}"
        data-kt-scroll-max-height="auto"
        data-kt-scroll-dependencies="#modal_add_company_header"
        data-kt-scroll-wrappers="#modal_add_company_scroll"
        data-kt-scroll-offset="300px"
      >
        <!-- //body start -->

        <div class="fv-row mb-7">
          <label class="fs-6 fw-semobold mb-2">Company</label>

          <el-form-item prop="company_id">
            <el-select
              @click="getCompanyData()"
              @change="getCategoryData()"
              :popper-append-to-body="false"
              :teleported="false"
              class="w-100"
              v-model="addItemPayload.data.company_id"
              placeholder="Select an option"
            >
              <el-option
                v-for="item in companyData"
                :label="item.title"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>

        <div class="fv-row mb-7">
          <label class="fs-6 fw-semobold mb-2">Category</label>

          <el-form-item prop="category_id">
            <el-select
              :popper-append-to-body="false"
              :teleported="false"
              class="w-100"
              v-model="addItemPayload.data.category_id"
              placeholder="Select an option"
            >
              <el-option
                v-for="item in categoryData"
                :label="item.title"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>

        <div class="fv-row mb-7">
          <label class="required fs-6 fw-semobold mb-2">Title</label>

          <el-form-item prop="title">
            <el-input
              v-model="addItemPayload.data.title"
              type="text"
              placeholder=""
            />
          </el-form-item>
        </div>

        <div class="fv-row mb-7">
          <label class="fs-6 fw-semobold mb-2">Description</label>

          <el-form-item prop="description">
            <el-input
              v-model="addItemPayload.data.description"
              type="text"
              placeholder=""
            />
          </el-form-item>
        </div>

        <div class="fv-row mb-7">
          <label class="fs-6 fw-semobold mb-2">Content</label>

          <el-form-item prop="content">
            <el-input
              v-model="addItemPayload.data.content"
              :autosize="{ minRows: 2, maxRows: 4 }"
              type="textarea"
              placeholder="Please input"
            />
          </el-form-item>
        </div>

        {{ addItemPayload.data.images }}

        <div class="fv-row mb-7">
          <label class="required fs-6 fw-semobold mb-2">Files</label>

          <FileUpload
            fileLimit="3"
            @handleSaveFile="handleSaveFile"
            @handleDeleteFile="handleDeleteFile"
          ></FileUpload>
        </div>

        <!-- //body end -->
      </div>
    </div>

    <div class="modal-footer flex-center">
      <button
        type="reset"
        id="modal_add_company_cancel"
        class="btn btn-light me-3"
      >
        Discard
      </button>

      <button
        :data-kt-indicator="addItemPayload.loading ? 'on' : null"
        class="btn btn-lg btn-primary"
        type="submit"
      >
        <span v-if="!addItemPayload.loading" class="indicator-label">
          Submit
          <KTIcon icon-name="arrow-right" icon-class="fs-2 me-2 me-0" />
        </span>
        <span v-if="addItemPayload.loading" class="indicator-progress">
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
