<script setup>
import { ref, onMounted, watch } from "vue";
import ApiService from "@/core/services/ApiService";

const props = defineProps(["file", "height", "width"]);
const reqPay = ref();

const getData = (file) => {
  ApiService.post(`/uploads/getFile/${file}`).then((res) => {
    // console.log("res :>> ", res);
    reqPay.value = res.data;
  });
};

watch(
  () => props.file,
  () => {
    console.log("degistiriii");
    getData(props.file);
  }
);

onMounted(() => {
  //single image ise
  getData(props.file);
});
</script>

<template>
  <img
    class="rounded-2"
    :style="{ height: `${height}`, width: `${width}` }"
    style="background: center no-repeat"
    :src="reqPay?.data"
  />
</template>