<script setup>
import { ref, onMounted } from "vue";
import ApiService from "@/core/services/Apiservice";
import ImageViewer from "@/components/uploads/ImageViewer.vue";
import { useRouter } from "vue-router";

const props = defineProps(["companyId"]);
const router = useRouter();

const company = ref([]);
const categoriesData = ref();

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

const getCategories = () => {
  ApiService.post("categories/listByCompany", {
    limit: 100,
    page: 1,
    where: { company_id: props.companyId },
  }).then((res) => {
    console.log("res :>> ", res);
    categoriesData.value = res.data.data;
  });
};

const goToProducts = (category) => {
  console.log("category :>> ", category);
  router.push({ path: `/menu/products/${category.id}` });
};

onMounted(() => {
  getCompanyData();
  getCategories();

  console.log("KTThemeMode :>> ", KTThemeMode);
});
</script>

<template>
  <div class="p-2">
    <div class="row mb-10">
      <div class="col-12">
        <div class="card card-flush flex-row-fluid p-6 pb-5 mw-100">
          <div class="card-body text-center">
            <template v-for="image in company?.images">
              <ImageViewer :file="image.file" height="300px" width="100%">
              </ImageViewer>
            </template>

            <div class="mb-2">
              <div class="text-center">
                <span
                  class="fw-bold text-gray-800 cursor-pointer text-hover-primary fs-3 fs-xl-1"
                  >{{ company?.title }}</span
                >

                <span class="text-gray-500 fw-semibold d-block fs-6 mt-n1">{{
                  company?.content
                }}</span>
                <div>
                  <span
                    class="fw-bold text-gray-800 cursor-pointer text-hover-primary fs-4"
                  >
                    {{ company?.address }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div
        v-for="category in categoriesData"
        :key="category.id"
        class="col-12 col-md-6 col-xl-4 mb-5"
      >
        <div class="card card-flush flex-row-fluid p-6 pb-5 mw-100">
          <div class="card-body text-center cursor-pointer" @click="goToProducts(category)">
            <template v-for="image in category?.images">
              <ImageViewer :file="image.file" height="200px" width="100%">
              </ImageViewer>
            </template>

            <div class="mb-2">
              <div class="text-center">
                <span
                  class="fw-bold text-gray-800 cursor-pointer text-hover-primary fs-3 fs-xl-1"
                  >{{ category?.title }}</span
                >

                <span class="text-gray-500 fw-semibold d-block fs-6 mt-n1">{{
                  category?.content
                }}</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>
