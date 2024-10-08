<script setup>
import html2canvas from "html2canvas";
import { onMounted, ref, computed } from "vue";
import ApiService from "@/core/services/ApiService";

const props = defineProps(["register_id"]);

const joblogsData = ref([]);
const jobData = ref({});

onMounted(() => {
  ApiService.setHeader();
  getWorkCardData();
  getWorksData();

  console.log("register_id :>> ", props.register_id);
  // get Printed HTLM elements
  exportContainer.value = document.getElementById("exportContainer");
});

const getWorksData = () => {
  ApiService.post(`${import.meta.env.VITE_KANBAN_SERVICE_JOB_CARD_LOG}/list`, {
    page: 1,
    limit: 100,
    where: { job_card_id: props.register_id },
  })
    .then((res) => {
      console.log("getWorksData res :>> ", res);
      let worksCards = res.data.data;
      let orderedWorksCards = worksCards.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );

      joblogsData.value = orderedWorksCards;
      console.log("joblogsData.value :>> ", joblogsData.value);
    })
    .catch((err) => {
      console.log("getWorkData err :>> ", err);
    });
};

const dateObject = (date_time) => {
  let dateObject = new Date(date_time);
  if (dateObject == "Invalid Date") {
    return { time: "-", date: "-" };
  }
  let payload = {
    time: `${dateObject.getHours().toString().padStart(2, "0")}.${dateObject
      .getMinutes()
      .toString()
      .padStart(2, "0")}.${dateObject
      .getSeconds()
      .toString()
      .padStart(2, "0")} `,
    date: `${dateObject.getFullYear()}.${(dateObject.getMonth() + 1)
      .toString()
      .padStart(2, "0")}.${dateObject.getDate().toString().padStart(2, "0")} `,
  };

  return payload;
};

const getWorkCardData = () => {
  ApiService.get(
    `${import.meta.env.VITE_KANBAN_SERVICE_JOB_CARD}/get/${props.register_id}`
  )
    .then((res) => {
      console.log("getWorkData res :>> ", res);
      jobData.value = res.data.data;
    })
    .catch((err) => {
      console.log("getWorkData err :>> ", err);
    });
};

/// for export

const exportContainer = ref(null);

const exportToPNG = () => {
  if (!exportContainer.value) return;

  html2canvas(exportContainer.value).then((canvas) => {
    const link = document.createElement("a");
    link.download = "exported_work_card.png";
    link.href = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    link.click();
  });
};

const exportToJPEG = () => {
  if (!exportContainer.value) return;

  html2canvas(exportContainer.value).then((canvas) => {
    const link = document.createElement("a");
    link.download = "exported_work_card.jpg";
    link.href = canvas
      .toDataURL("image/jpeg")
      .replace("image/jpeg", "image/octet-stream");
    link.click();
  });
};
</script>

<template>
  <div class="container-lg mt-3">
    <div class="row">
      <div class="col-md-4 mb-5">
        <div class="card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <h5>Job Files</h5>
              <button class="btn btn-sm btn-primary">Update</button>
            </div>

            <div class="table-responsive">
              <!--begin::Table-->
              <table class="table align-middle gs-0 gy-3">
                <!--begin::Table body-->
                <tbody>
                  <tr>
                    <td>
                      <span
                        class="text-dark fw-bold text-hover-primary mb-1 fs-6"
                      >
                        Accident Date
                      </span>
                    </td>
                    <td class="text-muted fw-bold">
                      {{ dateObject(jobData?.job_file?.accident_date).date }}
                      -
                      {{ dateObject(jobData?.job_file?.accident_date).time }}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <span
                        class="text-dark fw-bold text-hover-primary mb-1 fs-6"
                      >
                        Work Description
                      </span>
                    </td>
                    <td class="text-muted fw-bold">
                      {{ jobData?.description }}
                    </td>
                  </tr>
                </tbody>
                <!--end::Table body-->
              </table>
              <!--end::Table-->
            </div>

            <div>
              <span>Accident Cars</span>
              <div
                v-for="(vehicle, index) in jobData?.job_file?.defect_vehicles"
                :key="vehicle.id"
                class="border p-1 rounded-2"
              >
                <h9>Car {{ index + 1 }}</h9>
                <table class="table align-middle">
                  <!--begin::Table body-->
                  <tbody>
                    <tr>
                      <td>
                        <span class="text-dark fw-bold text-hover-primary">
                          Title
                        </span>
                      </td>
                      <td class="text-muted fw-bold">
                        {{ vehicle.title }}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span class="text-dark fw-bold text-hover-primary">
                          Plate
                        </span>
                      </td>
                      <td class="text-muted fw-bold">
                        {{ vehicle.plate }}
                      </td>
                    </tr>
                  </tbody>
                  <!--end::Table body-->
                </table>

                <div
                  v-for="(vfile, index) in vehicle?.files"
                  :key="index"
                  class="px-3"
                >
                  <div class="bg-secondary p-1 w-100 rounded-1">
                    {{ vfile.name }}
                  </div>
                </div>
              </div>
              <div class="mt-5">
                <h6>job file files</h6>
                <div>
                  {{ jobData?.job_file?.files }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-8">
        <div class="card bg-body mb-5">
          <!--begin::Body-->
          <div
            class="card-body d-flex justify-content-center flex-wrap ps-xl-15 pe-0"
          >
            <!--begin::Wrapper-->
            <div class="flex-grow-1 mt-2 me-9 me-md-0">
              <!--begin::Title-->
              <div
                class="position-relative text-gray-800 fs-1 z-index-2 fw-bold mb-5"
              >
                Car Zone
              </div>
              <!--end::Title-->

              <!--begin::Text-->
              <span class="text-gray-600 fw-semibold fs-6 mb-6 d-block">
                Car Info
                <br />
                Profile Department
              </span>
              <!--end::Text-->

              <!--begin::Action-->
              <div class="mb-7">
                {{ jobData.vehicle }}
              </div>
              <!--begin::Action-->
            </div>
            <!--begin::Wrapper-->
          </div>
          <!--end::Body-->
        </div>

        <div class="row g-xl-10">
          <!--begin::Col-->
          <div class="col-xl-4 mb-5">
            <!--begin::Slider Widget 7-->
            <div class="card h-100">
              <!--begin::Card body-->
              <div class="card-body p-9">
                <!--begin::Heading-->
                <div class="fs-4 fw-semibold text-gray-500 mb-7">
                  Complete Status
                </div>
                <!--end::Heading-->

                <!--begin::Wrapper-->
                <div class="d-flex flex-wrap">
                  <!--begin::Chart-->
                  <div class="d-flex flex-center h-100px w-100px me-9 mb-5">
                    <canvas
                      id="kt_project_list_chart"
                      style="
                        display: block;
                        box-sizing: border-box;
                        height: 100px;
                        width: 100px;
                      "
                      width="89"
                      height="89"
                    ></canvas>
                  </div>
                  <!--end::Chart-->

                  <!--begin::Labels-->
                  <div
                    class="d-flex flex-column justify-content-center flex-row-fluid pe-11 mb-5"
                  >
                    <!--begin::Label-->
                    <div
                      class="d-flex fs-6 fw-semibold align-items-center mb-3"
                    >
                      <div class="bullet bg-primary me-3"></div>
                      <div class="text-gray-500">Active</div>
                      <div class="ms-auto fw-bold text-gray-700">30</div>
                    </div>
                    <!--end::Label-->

                    <!--begin::Label-->
                    <div
                      class="d-flex fs-6 fw-semibold align-items-center mb-3"
                    >
                      <div class="bullet bg-success me-3"></div>
                      <div class="text-gray-500">Completed</div>
                      <div class="ms-auto fw-bold text-gray-700">45</div>
                    </div>
                    <!--end::Label-->

                    <!--begin::Label-->
                    <div class="d-flex fs-6 fw-semibold align-items-center">
                      <div class="bullet bg-gray-300 me-3"></div>
                      <div class="text-gray-500">Yet to start</div>
                      <div class="ms-auto fw-bold text-gray-700">25</div>
                    </div>
                    <!--end::Label-->
                  </div>
                  <!--end::Labels-->
                </div>
                <!--end::Wrapper-->
              </div>
              <!--end::Card body-->
            </div>
            <!--end::Slider Widget 7-->
          </div>
          <!--end::Col-->

          <!--begin::Col-->
          <div class="col-xl-8 mb-5 mb-xl-10">
            <!--begin::Engage widget 12-->
            <div class="card card-custom bg-body">
              <!--begin::Body-->
              <div
                class="card-body d-flex justify-content-center flex-wrap ps-xl-15 pe-0"
              >
                <!--begin::Wrapper-->
                <div class="flex-grow-1 mt-2 me-9 me-md-0">
                  <!--begin::Title-->
                  <div
                    class="position-relative text-gray-800 fs-1 z-index-2 fw-bold mb-5"
                  >
                    User Zone
                  </div>
                  <!--end::Title-->

                  <!--begin::Text-->
                  <span class="text-gray-600 fw-semibold fs-6 mb-6 d-block">
                    User Info
                    <br />
                    Department
                  </span>
                  <!--end::Text-->

                  <!--begin::Action-->
                  <div class="mb-7">
                    {{ jobData.user }}
                  </div>
                  <!--begin::Action-->
                </div>
                <!--begin::Wrapper-->
              </div>
              <!--end::Body-->
            </div>
            <!--end::Engage widget 12-->
          </div>
          <!--end::Col-->
        </div>

        <div class="card card-xl-stretch mb-xl-5 pt-2">
          <!--begin::Body-->
          <div class="card-body" id="exportContainer">
            <div id="work_card_detail" class="" style="padding: 0 2.25rem">
              <h3>
                <span class="fw-bold mb-2 text-dark">File Detail Log </span>
              </h3>

              <div class="d-flex justify-content-end">
                <div>
                  Burn Date -
                  <span>{{ dateObject(jobData.createdAt).date }}</span>
                </div>
              </div>
            </div>

            <div class="card-header align-items-center border-0 mt-4">
              <h3 class="card-title align-items-start flex-column">
                <span class="fw-bold mb-2 text-dark"
                  >Work Activities <i class="bi bi-arrow-right"></i>
                  <span class="text-muted fw-semibold fs-4 ps-2">{{
                    joblogsData.length
                  }}</span>
                </span>
              </h3>
            </div>

            <!--begin::Timeline-->
            <div class="timeline-label">
              <template v-for="work in joblogsData" :key="work.id">
                <!--begin::Item-->
                <div class="timeline-item">
                  <!--begin::Label-->
                  <div class="timeline-label fw-bold text-gray-800 fs-6">
                    <div>
                      {{ dateObject(work.createdAt).time }}
                    </div>
                    <div class="text-gray-400">
                      {{ dateObject(work.createdAt).date }}
                    </div>
                  </div>
                  <!--end::Label-->

                  <!--begin::Badge-->
                  <div class="timeline-badge">
                    <i class="fa fa-genderless text-success fs-1"></i>
                  </div>
                  <!--end::Badge-->

                  <!--begin::Text-->
                  <div class="d-block" style="flex: 1">
                    <div
                      id="work_history"
                      class="d-flex justify-content-between align-items-center"
                    >
                      <div class="fw-mormal text-muted ps-3 text-gray-800">
                        <span class="badge badge-light-primary">{{
                          work.process.title
                        }}</span>
                        <i class="bi bi-arrow-right"></i>
                        <span class="badge badge-light-info">{{
                          work.position.title
                        }}</span>
                        <i class="bi bi-arrow-right"></i>
                        <span class="badge badge-light-success">{{
                          work.status.title
                        }}</span>
                      </div>
                      <div id="user_detail" class="badge badge-light-warning">
                        {{ work.user.email }}
                      </div>
                    </div>

                    <div class="fw-mormal text-muted ps-3 text-gray-500">
                      {{ work.description }}
                      <div>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Ab, fugit earum, tempora optio ut facilis sed inventore
                        numquam aperiam deserunt corrupti magni cumque rem
                        aliquid, beatae vero dolorum rerum nulla?
                      </div>
                    </div>
                  </div>
                  <!--end::Text-->
                </div>
                <!--end::Item-->
              </template>
            </div>
            <!--end::Timeline-->
          </div>
          <!--end: Card Body-->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.timeline-label .timeline-label {
  width: 80px;
  flex-shrink: 0;
  position: relative;
  color: var(--kt-gray-800);
}
.timeline-label:before {
  content: "";
  position: absolute;
  left: 81px;
  width: 3px;
  top: 0;
  bottom: 0;
  background-color: var(--kt-gray-200);
}
</style>
