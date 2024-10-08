<script setup>
import ApiService from "@/core/services/ApiService";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import QRCode from "qrcode-generator";
import ImageViewer from "@/components/uploads/ImageViewer.vue";
import FileUpload from "@/components/uploads/FileUpload.vue";

const props = defineProps(["companyId"]);
const router = useRouter();

const company = ref([]);

const getCompanyData = () => {
  ApiService.get(`companies/get/${props.companyId}`)
    .then((res) => {
      console.log("res :>> ", res);
      company.value = res.data.data;
    })
    .catch((err) => {
      console.log("err :>> ", err);
    });
};
const goToMenu = () => {
  router.push({ path: `/menu/${props.companyId}` });
};

const companyQr = ref();
const createQr = () => {
  // QR kodu oluşturun
  const qr = QRCode(0, "H");
  qr.addData(
    `${window.location.protocol}//${window.location.host}/menu/${props.companyId}`
  );
  qr.make();

  // Oluşturulan QR kodunun veri URL'ini döndürün
  companyQr.value = qr.createDataURL();
  return qr.createDataURL();
};

const updateCompanyData = async (e) => {
  if (company.value.icon?.id) {
    const deleteResponse = await ApiService.delete(
      `uploads/${company.value.icon.file}`
    );
  }

  ApiService.put(`companies/update/${props.companyId}`, {
    icon: e.data,
  })
    .then((res) => {
      console.log("res :>> ", res);
      getCompanyData();
    })
    .catch((err) => {
      console.log("err :>> ", err);
    });
};

onMounted(() => {
  getCompanyData();
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  console.log("Base URL:", baseUrl);

  console.log("import.meta.env.BASE_URL :>> ", import.meta.env.BASE_URL);
});
</script>

Selam ben Company

<template>
  <div class="card mb-5">
    <div class="card-body">Company Data</div>
  </div>

  <div class="card mb-5">
    <div class="card-body">
      <h3>Company Detail</h3>

      <div class="p-5 mb-5">
        <h3>Company Icon</h3>

        <div>
          <ImageViewer
            v-if="company.icon"
            :file="company.icon.file"
            height="100px"
          ></ImageViewer>
          <div>
            <span>Upload Icon</span>
            <FileUpload
              :fileListShow="false"
              @click=""
              @handleSaveFile="updateCompanyData"
            ></FileUpload>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="card mb-5">
    <div class="card-body">
      <h3>Company Menu</h3>

      <div class="p-5 mb-5">
        <button @click="goToMenu()" class="btn btn-primary">Menuye git</button>
      </div>

      <div class="p-5 mb-5">
        <button @click="createQr()" class="btn btn-primary">
          Menuye KareKod Olustur
        </button>

        <template v-if="companyQr">
          <img
            :src="companyQr"
            style="height: 100px; width: 100px"
            alt="QR Code"
          />
        </template>
      </div>
    </div>
  </div>

  {{ company }}
</template>

<style scope></style>
