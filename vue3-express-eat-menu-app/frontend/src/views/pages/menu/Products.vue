<script setup>
import { ref, onMounted } from "vue";
import ApiService from "@/core/services/Apiservice";
import ImageViewer from "@/components/uploads/ImageViewer.vue";
const props = defineProps(["categoryId"]);

const category = ref({});
const productsData = ref([]);

const getCategoryData = () => {
  ApiService.get(`categories/get/${props.categoryId}`)
    .then((res) => {
      console.log("res :>> ", res);
      category.value = res.data.data;
    })
    .catch((err) => {
      console.log("err :>> ", err);
    });
};

const getProducts = () => {
  ApiService.post("products/listByCategory", {
    limit: 100,
    page: 1,
    where: { category_id: props.categoryId },
  }).then((res) => {
    console.log("res :>> ", res);
    productsData.value = res.data.data;
  });
};

const goToProduct = (category) => {
  console.log("category :>> ", category);
  router.push({ path: `/menu/products/${category.id}` });
};

onMounted(() => {
  getCategoryData();
  getProducts();
});
</script>

<template>
  <div class="row">
    <div class="d-flex p-5">
      <div class="cursor-pointer bg-warning rounded-2">
        <div class="d-flex justify-content-between align-items-center p-2 rounded-2" @click="$router.back()">
          <i class="ki ki-duotone ki-black-left"></i> <span>Back</span>
        </div>
      </div>
    </div>
  </div>
  <div class="row mb-10">
    <div class="col-12">
      <div class="card card-flush flex-row-fluid p-6 pb-5 mw-100">
        <div class="card-body text-center">
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
              <div>
                <span
                  class="fw-bold text-gray-800 cursor-pointer text-hover-primary fs-4"
                >
                  {{ category?.description }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="row">
    <template v-if="productsData.length == 0">
      <div class="d-flex justify-content-center">
        <span class="badge badge-warning">Not Have Any Product</span>
      </div>
    </template>

    <template v-else>
      <div
        v-for="category in productsData"
        :key="category.id"
        class="col-12 col-md-6 col-xl-4 mb-5"
      >
        <div class="card card-flush flex-row-fluid p-6 pb-5 mw-100">
          <div class="card-body text-center">
            <div class="cursor-pointer" @click="goToProducts(category)">
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
    </template>
  </div>
</template>
