<script setup>
import { ref } from "vue";
import FileUpload from "../uploads/FileUpload.vue";
import ApiService from "@/core/services/ApiService";
import { toast } from "vue3-toastify";

const props = defineProps(["jobcard"]);

const fileData = ref([]);
const fileShow = ref(false);

const oldFilesData = ref({});

const getFile = () => {
  console.log("get file", props.jobcard);

  ApiService.get(
    `${import.meta.env.VITE_SERVICE_FILES}/get/${props.jobcard.file_id}`
  )
    .then((res) => {
      console.log("res :>> ", res);
      oldFilesData.value = res.data.data;
    })
    .catch((err) => {
      console.log("err :>> ", err);
    });

  setTimeout(() => {
    fileShow.value = true;
  }, 500);
};

const saveOwnForm = (form) => {
  console.log(`save, saveOwnForm`, fileData.value, props.jobcard);

  // let newFiles = ref([]);

  // let oldFiles = oldFilesData.value.files.find((file) => {
  //   file.status_id == props.jobcard.status_id;
  // });

  // console.log("oldFiles :>> ", oldFiles);

  let payload = {
    process_id: props.jobcard.process_id,
    process_title: props.jobcard.process.title,
    process_rank: props.jobcard.process.rank,
    position_id: props.jobcard.position_id,
    position_title: props.jobcard.position.title,
    position_rank: props.jobcard.position.rank,
    status_id: props.jobcard.status_id,
    status_title: props.jobcard.status.title,
    status_rank: props.jobcard.status.rank,
    files: fileData.value,
  };

  let oldStausFiles = oldFilesData.value.files.find(
    (file) => file.status_id == props.jobcard.status_id
  );

  if (oldStausFiles) {
    fileData.value.forEach((item) => {
      oldStausFiles.files.push(item);
    });
  } else {
    oldFilesData.value.files.push(payload);
  }

  ApiService.put(
    `${import.meta.env.VITE_SERVICE_FILES}/update/${props.jobcard.file_id}`,
    { files: oldFilesData.value.files }
  )
    .then((res) => {
      console.log("res :>> ", res);
      toast.success("Success Save!");
    })
    .catch((err) => {
      console.log("err :>> ", err);
      toast.error("Error !");
    });

  console.log("payload :>> ", payload);
};

const deleteFileInJobFiles = (ofile) => {
  Swal.fire({
    title: `Delete ${ofile.name} Are you sure?`,
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      console.log("ofile", ofile);

      let statusFiles = oldFilesData.value.files.find(
        (file) => file.status_id == props.jobcard.status_id
      );

      let clearFileList = statusFiles.files.filter(
        (file) => file.id != ofile.id
      );

      statusFiles.files = clearFileList;

      ApiService.put(
        `${import.meta.env.VITE_SERVICE_FILES}/update/${props.jobcard.file_id}`,
        { files: oldFilesData.value.files }
      )
        .then((res) => {
          console.log("res :>> ", res);
          toast.success("Success Delete!");
        })
        .catch((err) => {
          console.log("err :>> ", err);
          toast.error("Error !");
        });
    }
  });
};

const handleSaveFile = (e) => {
  console.log("response emissions save:>> ", e);
  if (e.data) {
    console.log("e :>> ", e);
    fileData.value.push(e.data);

    // addItemPayload.value.data.files.data.push(e.data);
  }
};
const handleDeleteFile = (e) => {
  console.log("response emissions delete:>> ", e);
  fileData.value = fileData.value.filter((file) => file.id != e.data.id);
};
</script>

<template>
  <div class="row mb-2 px-3">
    <div class="col-lg-12 mt-5">
      <div class="d-flex mb-2">
        <button @click="getFile()" class="btn btn-sm btn-success px-2 p-1">
          Add Document
        </button>
      </div>
    </div>

    <div class="col-lg-12 mt-1 p-2 rounded-2 card" v-if="fileShow">
      <div class="mb-5">
        <span>Yuklenmis Dosyalar</span>
        <div
          v-for="(ofile, index) in oldFilesData?.files.find(
            (file) => file.status_id == jobcard.status_id
          )?.files"
          :key="index"
        >
          <div
            class="bg-primary rounded-1 p-1 mb-1 d-flex justify-content-between align-items-center"
          >
            <span data-toggle="tooltip" :title="ofile.name">{{
              ofile.name
            }}</span>
            <span
              @click="deleteFileInJobFiles(ofile)"
              class="cursor-pointer bg-danger rounded-circle p-1"
              ><i class="ki-outline ki-trash"></i
            ></span>
          </div>
        </div>
      </div>

      <div class="mb-5">
        <FileUpload
          @handleSaveFile="handleSaveFile"
          @handleDeleteFile="handleDeleteFile"
        ></FileUpload>
      </div>

      <div class="d-flex justify-content-end">
        <button @click="saveOwnForm()" class="btn btn-primary btn-sm">
          Save
        </button>
      </div>
    </div>
  </div>
</template>
