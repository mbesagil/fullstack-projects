<script setup>
import { ref, onMounted } from "vue";
import ApiService from "@/core/services/ApiService";
import { Modal } from "bootstrap";
import { v4 as uuidv4 } from "uuid";
import { getAssetPath } from "@/core/helpers/assets";

const props = defineProps(["file", "height", "width", "type"]);
const reqPay = ref();
const documentUrl = ref();

const modalRef = ref(null);
const modalId = ref(null);

const getFullView = (file) => {
  if (props.file?.uzanti == "pdf") {
    console.log("istek at");
    getData(`${props.file.id}.${props.file.uzanti}`);
  }
  console.log(" getFullView file :>> ", file);
  // Diğer kodlar
  modalRef.value = new Modal(document.getElementById(modalId.value));
  modalRef.value.show();
};

const getData = (file) => {
  ApiService.post(`/uploads/getFile/${file}`).then((res) => {
    console.log("res :>> ", res);
    reqPay.value = res.data;
  });
};

onMounted(() => {
  modalId.value = uuidv4();

  console.log("import.meta.env.BASE_URL :>> ", import.meta.env.BASE_URL);

  console.log("getAssetPath :>> ", getAssetPath("/asset/media"));

  console.log("file", props.file);

  if (
    props.file.uzanti == "jpg" ||
    props.file.uzanti == "png" ||
    props.file.uzanti == "jpeg"
  ) {
    getData(`${props.file.id}.${props.file.uzanti}`);
  }

  //single image ise
  if (props.type == "image") {
    getData(props.file.file);
  }
});
</script>

<template>
  <template v-if="true">
    <div :style="{ height: `${height}`, width: `${width}` }" class="rounded-2">
      <template
        v-if="
          props.file?.uzanti == 'jpg' ||
          props.file?.uzanti == 'png' ||
          props.file?.uzanti == 'jpeg' ||
          props.type == 'image'
        "
      >
        <img
          @click="getFullView(file)"
          class="rounded-2"
          :style="{ height: `${height}`, width: `${width}` }"
          style="background: center no-repeat"
          :src="reqPay?.data"
        />
      </template>
      <template v-else-if="props.file?.uzanti == 'docx'">
        <div :style="{ height: `${height}`, width: `${width}` }" class="">
          <img :src="getAssetPath('media/svg/files/doc.svg')" alt="doc" />
        </div>
      </template>
      <template v-else-if="props.file?.uzanti == 'pdf'">
        <div
          @click="getFullView(file)"
          :style="{ height: `${height}`, width: `${width}` }"
          class=""
        >
          <img :src="getAssetPath('media/svg/files/pdf.svg')" alt="doc" />
        </div>
      </template>
      <template v-else-if="props.file?.uzanti == 'xlsx'">
        <div :style="{ height: `${height}`, width: `${width}` }" class="">
          <img :src="getAssetPath('media/svg/files/xml.svg')" alt="doc" />
        </div>
      </template>
    </div>
  </template>

  <!-- modal -->
  <div class="modal fade" :id="modalId" tabindex="-1" aria-hidden="true">
    <!--begin::Modal dialog-->
    <div class="modal-dialog modal-dialog-centered" style="max-width: 1200px">
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
          <!--begin:Form-->
          <div>
            <template
              v-if="
                reqPay?.data &&
                (reqPay?.type == 'image/jpg' ||
                  reqPay?.type == 'image/jpeg' ||
                  reqPay?.type == 'image/png')
              "
            >
              <img
                :style="{ height: `100%`, width: `100%` }"
                style="background: center no-repeat"
                :src="reqPay?.data"
              />
            </template>
            <template
              v-else-if="reqPay?.data && reqPay?.type == 'application/pdf'"
            >
              <div class="">
                <iframe
                  height="1000px"
                  class="w-100"
                  :src="reqPay?.data"
                  frameborder="0"
                ></iframe>
                />
              </div>
            </template>
            <template
              v-else-if="
                reqPay?.data &&
                (reqPay?.type == 'application/msword' ||
                  reqPay?.type == 'application/vnd.ms-excel')
              "
            >
              <div class="">
                <iframe
                  height="1000px"
                  class="w-100"
                  :src="reqPay?.data"
                  frameborder="0"
                ></iframe>
              </div>
            </template>
          </div>
          <!--end:Form-->
        </div>
        <!--end::Modal body-->
      </div>
      <!--end::Modal content-->
    </div>
    <!--end::Modal dialog-->
  </div>
</template>
