<script>
import { defineComponent, onMounted, ref } from "vue";
import { string } from "yup";

import { useAuthStore } from "@/stores/auth/authStore";
import ApiService from "@/core/services/ApiService";

import { toast } from "vue3-toastify";

export default defineComponent({
  name: "accident-types-add-modal",
  components: {},
  props: {
    serviceName: string,
  },

  setup(props, context) {
    // console.log("props :>> ", props.tableSettings);
    const authStore = useAuthStore();

    // username
    // name
    // surname
    // email
    // phone
    // password
    // driver_code
    // extras

    const addFormRef = ref(null);
    const addItemPayload = ref({
      data: {
        username: "",
        name: "",
        surname: "",
        email: "",
        phone: "",
        password: "",
        driver_code: "",
        licence_id: "",
        department_id: "",
        role_id: "",
        extras: [], //[{}]
      },
      rule: {
        username: [
          {
            required: true,
            message: "Usernama is required",
            trigger: "change",
          },
        ],
        name: [
          {
            required: true,
            message: "Name is required",
            trigger: "change",
          },
        ],
        surname: [
          {
            required: true,
            message: "Surname is required",
            trigger: "change",
          },
        ],
        email: [
          {
            required: true,
            message: "Email is required",
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
          ApiService.post(
            `${props.serviceName}/create`,
            addItemPayload.value.data
          )
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

    const licenceData = ref([]);
    const getLicenceData = () => {
      console.log("liceneeeeeeeeeee");
      if (licenceData.value.length == 0 && authStore.user.userType == 0)
        ApiService.post(`licences/list`, { page: 1, limit: 100 })
          .then((res) => {
            console.log("res :>> ", res);
            licenceData.value = res.data.data;
          })
          .catch((err) => {
            console.log("err :>> ", err);
          });
    };

    const departmentData = ref([]);
    const getDepartmentData = () => {
      console.log("departmentDataaaaaa");
      ApiService.post(`${import.meta.env.VITE_SERVICE_DEPARTMENTS}/list`, {
        page: 1,
        limit: 100,
      })
        .then((res) => {
          console.log("res :>> ", res);
          departmentData.value = res.data.data;
        })
        .catch((err) => {
          console.log("err :>> ", err);
        });
    };

    const roleData = ref([]);
    const getRoleData = () => {
      if (roleData.value.length == 0)
        ApiService.post(`roles/list`, { page: 1, limit: 100 }).then((res) => {
          console.log("res :>> ", res);
          roleData.value = res.data.data;
        });
    };

    // const profileData = ref([]);
    // const getProfileData = () => {
    //   if (profileData.value.length == 0)
    //     ApiService.post(`profiles/list`, { page: 1, limit: 100 }).then(
    //       (res) => {
    //         console.log("res :>> ", res);
    //         profileData.value = res.data.data;
    //       }
    //     );
    // };

    onMounted(() => {
      console.log("istek atildi");
    });

    return {
      authStore,
      addItemPayload,
      submitSaveItem,
      addFormRef,
      //

      licenceData,
      getLicenceData,
      departmentData,
      getDepartmentData,
      roleData,
      getRoleData,
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

        <div class="fv-row mb-7" v-if="authStore.user.userType == 0">
          <label class="fs-6 fw-semobold mb-2">Licence</label>

          <el-form-item prop="licence">
            <el-select
              @click="getLicenceData()"
              class="w-100"
              v-model="addItemPayload.data.licence_id"
              placeholder="Select an option"
              filterable
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
          <label class="fs-6 fw-semobold mb-2">Deparments</label>

          <el-form-item prop="deparment_id">
            <el-select
              @click="getDepartmentData()"
              class="w-100"
              v-model="addItemPayload.data.department_id"
              placeholder="Select an option"
              filterable
            >
              <el-option
                v-for="scope in departmentData"
                :label="scope.title"
                :value="scope.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>

        <div class="fv-row mb-7">
          <label class="fs-6 fw-semobold mb-2">Role</label>

          <el-form-item prop="role">
            <el-select
              @click="getRoleData()"
              class="w-100"
              v-model="addItemPayload.data.role_id"
              placeholder="Select an option"
              filterable
            >
              <el-option
                v-for="scope in roleData"
                :label="scope.title"
                :value="scope.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>

        <div class="fv-row mb-7">
          <label class="required fs-6 fw-semobold mb-2">Username</label>

          <el-form-item prop="username">
            <el-input
              v-model="addItemPayload.data.username"
              type="text"
              placeholder=""
            />
          </el-form-item>
        </div>

        <div class="fv-row mb-7">
          <label class="fs-6 fw-semobold mb-2">Name</label>

          <el-form-item prop="name">
            <el-input
              v-model="addItemPayload.data.name"
              type="text"
              placeholder=""
            />
          </el-form-item>
        </div>

        <div class="fv-row mb-7">
          <label class="fs-6 fw-semobold mb-2">Surname</label>

          <el-form-item prop="surname">
            <el-input
              v-model="addItemPayload.data.surname"
              type="text"
              placeholder=""
            />
          </el-form-item>
        </div>

        <div class="fv-row mb-7">
          <label class="fs-6 fw-semobold mb-2">Phone</label>

          <el-form-item prop="phone">
            <el-input
              v-model="addItemPayload.data.phone"
              type="text"
              placeholder=""
            />
          </el-form-item>
        </div>

        <div class="fv-row mb-7">
          <label class="fs-6 fw-semobold mb-2">Email</label>

          <el-form-item prop="email">
            <el-input
              v-model="addItemPayload.data.email"
              type="email"
              placeholder=""
            />
          </el-form-item>
        </div>

        <div class="fv-row mb-7">
          <label class="fs-6 fw-semobold mb-2">Password</label>

          <el-form-item prop="password">
            <el-input
              v-model="addItemPayload.data.password"
              type="password"
              placeholder=""
            />
          </el-form-item>
        </div>

        <div class="fv-row mb-7">
          <label class="fs-6 fw-semobold mb-2">Code</label>

          <el-form-item prop="code">
            <el-input
              v-model="addItemPayload.data.code"
              type="text"
              placeholder=""
            />
          </el-form-item>
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
