<script>
import { defineComponent, onMounted, ref } from "vue";
import { string } from "yup";
import { useAuthStore } from "@/stores/auth/authStore";
import ApiService from "@/core/services/ApiService";
import FileUpload from "@/components/uploads/FileUpload.vue";
import { v4 as uuidv4 } from "uuid";

import { toast } from "vue3-toastify";

export default defineComponent({
  name: "jobcards-add-form",
  components: {},
  props: {
    createUrl: string,
  },

  setup(props, context) {
    // console.log("props :>> ", props.tableSettings);
    const authStore = useAuthStore();

    // title: { type: DataTypes.STRING },
    // description: { type: DataTypes.STRING },
    // files: { type: DataTypes.ARRAY(DataTypes.JSON) }, // type ve dosya adı hatta açıklama vb alınabilir kullanıcıdan
    // planned_start_date: { type: DataTypes.DATE },
    // planned_finish_date: { type: DataTypes.DATE },
    // start_date: { type: DataTypes.DATE },
    // finish_date: { type: DataTypes.DATE },

    const addFormRef = ref(null);
    const addItemPayload = ref({
      data: {
        title: "",
        description: "",
        planned_start_date: "",
        planned_finish_date: "",
        start_date: "",
        finish_date: "",
        vehicle_id: "",

        // for files
        km: 0,
        accident_type_id: "",
        accident_location: { latitude: "", longitude: "" },
        accident_date: "",
        defect_vehicles: [],
        file_number: "",
        files: {
          data: [],
        },
        extras: [], //[{}]
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
          addItemPayload.value.data.file_number = new Date().getTime();

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

    const profileData = ref([]);
    const getProfileData = () => {
      ApiService.post(
        `${import.meta.env.VITE_SERVICE_PROFILES}/userOfProfilesList`,
        {
          page: 1,
          limit: 100,
          where: {},
        }
      ).then((res) => {
        console.log("res :>> ", res);
        profileData.value = res.data.data;
      });
    };

    const vehicleData = ref([]);
    const getVehicleData = () => {
      addItemPayload.value.data.vehicle_id = "";
      vehicleData.value = [];

      ApiService.post(`${import.meta.env.VITE_SERVICE_VEHICLES}/list`, {
        page: 1,
        limit: 100,
        where: {
          profile_id: addItemPayload.value.data.profile_id,
        },
      }).then((res) => {
        console.log("res :>> ", res);
        vehicleData.value = res.data.data;
      });
    };

    const accidentData = ref([]);
    const getAccidentData = () => {
      ApiService.post(`${import.meta.env.VITE_SERVICE_ACCIDENT_TYPES}/list`, {
        page: 1,
        limit: 100,
      }).then((res) => {
        console.log("res :>> ", res);
        accidentData.value = res.data.data;
      });
    };

    //upload

    const addNewFileField = () => {
      let payload = {
        id: uuidv4(),
        label: "",
        files: [],
      };

      addItemPayload.value.data.files.data.push(payload);
      console.log("addItemPayload.value :>> ", addItemPayload.value);
    };

    const deleteFilesField = (id) => {
      addItemPayload.value.data.files.data =
        addItemPayload.value.data.files.data.filter((item) => item.id != id);
    };

    const handleSaveFile = (e, item) => {
      console.log("response emissions save:>> ", e, item);
      if (e.data) {
        console.log("response emissions save:>> ", e);
        if (e.data) {
          //kenisine ait dosyaya yaz
          addItemPayload.value.data.files.data
            .find((file) => file.id == item.id)
            .files.push(e.data);
        }
      }
    };

    const handleDeleteFile = (e, item) => {
      console.log("response emissions delete:>> ", e);
      if (e.data) {
        console.log("sil icinde");

        addItemPayload.value.data.files.data.find(
          (file) => file.id == item.id
        ).files = addItemPayload.value.data.files.data
          .find((file) => file.id == item.id)
          .files.filter((file) => file.name != e.data.name);
      }
    };

    /****************************************************defect vehicles */
    const addNewFileDefectVehicleField = () => {
      let payload = {
        id: uuidv4(),
        title: "",
        plate: "",
        color: "",
        brand: "",
        model: "",
        series: "",
        chassis: "",
        engine_code: "",
        year: "",
        class: "",
        owner: "",
        phone: "",
        insurance: {},
        files: [],
      };

      addItemPayload.value.data.defect_vehicles.push(payload);
      console.log("addItemPayload.value :>> ", addItemPayload.value);
    };

    const deleteFileDefectVehicleField = (id) => {
      addItemPayload.value.data.defect_vehicles =
        addItemPayload.value.data.defect_vehicles.filter(
          (item) => item.id != id
        );
    };

    const handleSaveDefectVehiclecFile = (e, item) => {
      console.log("response emissions save:>> ", e, item);
      if (e.data) {
        console.log("response emissions save:>> ", e);
        if (e.data) {
          //kenisine ait dosyaya yaz
          addItemPayload.value.data.defect_vehicles
            .find((file) => file.id == item.id)
            .files.push(e.data);
        }
      }
    };

    const handleDeleteDefectVehicleFile = (e, item) => {
      console.log("response emissions delete:>> ", e);
      if (e.data) {
        console.log("sil icinde");

        addItemPayload.value.data.defect_vehicles.find(
          (file) => file.id == item.id
        ).files = addItemPayload.value.data.defect_vehicles
          .find((file) => file.id == item.id)
          .files.filter((file) => file.name != e.data.name);
      }
    };
    /****************************************************defect vehicles end */

    onMounted(() => {
      console.log("istek atildi");
    });

    return {
      authStore,
      addItemPayload,
      submitSaveItem,
      addFormRef,
      //

      profileData,
      getProfileData,
      vehicleData,
      getVehicleData,
      accidentData,
      getAccidentData,

      //upload
      addNewFileField,
      deleteFilesField,
      handleSaveFile,
      handleDeleteFile,
      // ddefect-vehicle
      addNewFileDefectVehicleField,
      deleteFileDefectVehicleField,
      handleSaveDefectVehiclecFile,
      handleDeleteDefectVehicleFile,
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
    <div class="py-10 px-lg-17">
      <div>
        <!-- //body start -->

        <div class="fv-row mb-7">
          <label class="fs-6 fw-semobold mb-2">Profiles</label>

          <el-form-item prop="profile_id">
            <el-select
              :popper-append-to-body="false"
              :teleported="false"
              @click="getProfileData()"
              @change="getVehicleData()"
              class="w-100"
              v-model="addItemPayload.data.profile_id"
              placeholder="Select an option"
              filterable
            >
              <el-option
                v-for="scope in profileData"
                :label="scope.title"
                :value="scope.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>

        <div class="fv-row mb-7" v-if="addItemPayload.data.profile_id != ''">
          <label class="fs-6 fw-semobold mb-2">Vehicles</label>
          <!-- @click="getVehicleData()" -->

          <el-form-item prop="vehicle_id">
            <el-select
              :popper-append-to-body="false"
              :teleported="false"
              class="w-100"
              v-model="addItemPayload.data.vehicle_id"
              placeholder="Select an option"
            >
              <el-option
                v-for="scope in vehicleData"
                :label="scope.title"
                :value="scope.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>

        <div class="fv-row mb-7">
          <label class="fs-6 fw-semobold mb-2">Accident Type</label>
          <!-- @click="getVehicleData()" -->

          <el-form-item prop="accident_id">
            <el-select
              :popper-append-to-body="false"
              :teleported="false"
              @click="getAccidentData()"
              class="w-100"
              v-model="addItemPayload.data.accident_type_id"
              placeholder="Select an option"
            >
              <el-option
                v-for="scope in accidentData"
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
              v-model="addItemPayload.data.title"
              type="text"
              placeholder=""
            />
          </el-form-item>
        </div>

        <div class="fv-row mb-7">
          <label class="required fs-6 fw-semobold mb-2">Description</label>

          <el-form-item prop="title">
            <el-input
              v-model="addItemPayload.data.description"
              type="text"
              placeholder=""
            />
          </el-form-item>
        </div>

        <!-- //files -->

        <div class="fv-row mb-7">
          <label class="required fs-6 fw-semobold mb-2">Km</label>

          <el-form-item prop="km">
            <el-input
              v-model="addItemPayload.data.km"
              type="number"
              placeholder=""
            />
          </el-form-item>
        </div>

        <div class="fv-row mb-7">
          <label class="required fs-6 fw-semobold mb-2">Accident Date</label>

          <el-form-item prop="accident_date">
            <el-date-picker
              class="w-100"
              v-model="addItemPayload.data.accident_date"
              type="date"
              placeholder="Pick a day"
            />
          </el-form-item>
        </div>

        <div class="row">
          <div class="col-md-6">
            <div class="fv-row mb-7">
              <label class="required fs-6 fw-semobold mb-2">Latitude</label>

              <el-form-item prop="latitude">
                <el-input
                  class="w-100"
                  v-model="addItemPayload.data.accident_location.latitude"
                  type="text"
                />
              </el-form-item>
            </div>
          </div>
          <div class="col-md-6">
            <div class="fv-row mb-7">
              <label class="required fs-6 fw-semobold mb-2">Longitude</label>

              <el-form-item prop="longitude">
                <el-input
                  class="w-100"
                  v-model="addItemPayload.data.accident_location.longitude"
                  type="text"
                />
              </el-form-item>
            </div>
          </div>
        </div>

        kazaya karisan araclar ~!!!!!!!!!!!!!!!!!!!

        <div class="fv-row mb-7">
          <div
            class="d-flex justify-content-between align-items-center pe-5 mb-2"
          >
            <label class="required fs-6 fw-semobold mb-2"
              >Defect Vehicles</label
            >
            <button
              type="button"
              class="btn btn-sm btn-success px-2 p-1"
              @click="addNewFileDefectVehicleField()"
            >
              Ekle
            </button>
          </div>
          <template
            v-for="(item, index) in addItemPayload.data.defect_vehicles"
          >
            <div
              class="d-flex justify-content-between align-items-center gap-7 border p-1 mb-1"
            >
              <!-- 
            title: "",
            plate: "",
            color: "",
            brand: "",
            model: "",
            series: "",
            chassis: "",
            engine_code: "",
            year: "",
            class: "",
            owner: "",
            insurance: {}, -->

              <div class="w-100">
                <div class="form">
                  <label for=""> Vehicle-{{ index + 1 }}</label>
                  <div class="row">
                    <div class="col-md-6">
                      <el-input
                        v-model="item.title"
                        class="mb-2"
                        type="text"
                        placeholder="Title"
                      />
                    </div>
                    <div class="col-md-6">
                      <el-input
                        v-model="item.plate"
                        class="mb-2"
                        type="text"
                        placeholder="plate"
                      />
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-md-6">
                      <el-input
                        v-model="item.color"
                        class="mb-2"
                        type="text"
                        placeholder="color"
                      />
                    </div>
                    <div class="col-md-6">
                      <el-input
                        v-model="item.brand"
                        class="mb-2"
                        type="text"
                        placeholder="brand"
                      />
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-md-6">
                      <el-input
                        v-model="item.model"
                        class="mb-2"
                        type="text"
                        placeholder="model"
                      />
                    </div>
                    <div class="col-md-6">
                      <el-input
                        v-model="item.series"
                        class="mb-2"
                        type="text"
                        placeholder="series"
                      />
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-md-6">
                      <el-input
                        v-model="item.chassis"
                        class="mb-2"
                        type="text"
                        placeholder="chassis"
                      />
                    </div>
                    <div class="col-md-6">
                      <el-input
                        v-model="item.engine_code"
                        class="mb-2"
                        type="text"
                        placeholder="engine_code"
                      />
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-md-6">
                      <el-input
                        v-model="item.year"
                        class="mb-2"
                        type="text"
                        placeholder="year"
                      />
                    </div>
                    <div class="col-md-6">
                      <el-input
                        v-model="item.class"
                        class="mb-2"
                        type="text"
                        placeholder="class"
                      />
                    </div>
                  </div>

                  <div class="row">
                    <div class="col-md-6">
                      <el-input
                        v-model="item.owner"
                        class="mb-2"
                        type="text"
                        placeholder="owner"
                      />
                    </div>
                    <div class="col-md-6">
                      <el-input
                        v-model="item.phone"
                        class="mb-2"
                        type="text"
                        placeholder="phone"
                      />
                    </div>
                  </div>
                </div>

                <FileUpload
                  @handleSaveFile="(e) => handleSaveDefectVehiclecFile(e, item)"
                  @handleDeleteFile="
                    (e) => handleDeleteDefectVehicleFile(e, item)
                  "
                ></FileUpload>
              </div>
              <div>
                <span
                  @click="deleteFileDefectVehicleField(item.id)"
                  class="btn btn-danger px-2 d-flex justify-content-center align-items-center"
                  ><i class="ki-outline fs-2 ki-trash p-0"></i
                ></span>
              </div>
            </div>
          </template>
        </div>

        <div class="fv-row mb-7">
          <div
            class="d-flex justify-content-between align-items-center pe-5 mb-2"
          >
            <label class="required fs-6 fw-semobold mb-2">Files</label>
            <button
              type="button"
              class="btn btn-sm btn-success px-2 p-1"
              @click="addNewFileField()"
            >
              Ekle
            </button>
          </div>
          <template v-for="item in addItemPayload.data.files.data">
            <div
              class="d-flex justify-content-between align-items-center gap-7 border p-1 mb-1"
            >
              <div class="w-100">
                <el-input
                  v-model="item.label"
                  class="mb-2"
                  type="text"
                  placeholder="title"
                />

                <FileUpload
                  @handleSaveFile="(e) => handleSaveFile(e, item)"
                  @handleDeleteFile="(e) => handleDeleteFile(e, item)"
                ></FileUpload>
              </div>
              <div>
                <span
                  @click="deleteFilesField(item.id)"
                  class="btn btn-danger px-2 d-flex justify-content-center align-items-center"
                  ><i class="ki-outline fs-2 ki-trash p-0"></i
                ></span>
              </div>
            </div>
          </template>
        </div>
        // km // kaza tipi // accident_date // accident location // kazaya
        karisan araclar

        <!-- dosya tipini ve hasar durumunu uzaman gucelleyecek -->

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
