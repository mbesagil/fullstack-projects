<script setup>
import { ref, watch, onMounted, defineExpose } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import ApiService from "@/core/services/ApiService";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import Swal from "sweetalert2";

import JwtService from "@/core/services/JwtService";
import { toast } from "vue3-toastify";

const emit = defineEmits(["handleSaveFile", "handleDeleteFile"]);

// fileLimit prop'unu tanımla
const props = defineProps({
  fileLimit: {
    type: Number,
    default: 10, // Eğer bir değer belirtilmezse varsayılan olarak 10 olarak ayarla
  },
  fileListShow: {
    type: Boolean,
    default: true,
  },
});

const uploadRef = ref();

const fileList = ref([]);
const fileLimit = ref(10);
const uploadUrl = `${import.meta.env.VITE_API_URL}/uploads`; // Replace with the actual URL of your Node.js server

const onFilePicked = (event) => {
  const files = event.target.files;
  if (!files.length) return;

  if (fileList.value.length + files.length > props.fileLimit) {
    toast.error(`En fazla ${props.fileLimit} dosya yüklenebilir.`);
    return;
  }

  // Dosyalar üzerinde işlem yapmak için döngü
  console.log("files :>> ", files);
  for (let i = 0; i < files.length; i++) {
    if (files[i].size > 10 * 1024 * 1024) {
      // 10MB kontrolü
      toast.error("Dosya boyutu 10MB'dan büyük olamaz.");
      console.error("Dosya boyutu 10MB'dan büyük olamaz."); // Uygun bir hata mesajı veya uyarı mekanizması
      continue; // Bu dosyayı atla ve diğerine geç
    }

    console.log("files[i] :>> ", files[i]);
    let payload = {
      id: uuidv4(),
      uploaded: false,
      name: files[i].name,
      file: files[i],
    };

    fileList.value.push(payload);
    uploadFile(payload); // Dosyayı yükleme fonksiyonunu çağır
  }
};

const uploadFile = async (filePayload) => {
  if (!filePayload.file.type.startsWith("image/")) {
    // Dosya bir resim değilse, doğrudan yükle
    await sendFileToServer(filePayload);
    return;
  }

  // Resim dosyasını işle ve boyutunu düşür
  const resizedImage = await resizeImage(filePayload.file);
  console.log("resizedImage", resizedImage);
  const formData = new FormData();
  formData.append("file", resizedImage, filePayload.file.name);

  await sendFileToServer(filePayload, formData);
};

// Resim dosyasının boyutunu düşürme işlemi
const resizeImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Boyutları yarıya indir
        const width = img.width / 2;
        const height = img.height / 2;

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Kaliteyi %50 olarak ayarla
        // JPEG için 0.5 kullanın. PNG gibi kayıpsız formatlar için bu parametre etkisizdir.
        canvas.toBlob((blob) => resolve(blob), file.type, 0.85);
      };
      img.onerror = reject;
      img.src = event.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Sunucuya dosya gönderme işlemi
const sendFileToServer = async (filePayload, formData = null) => {
  if (!formData) {
    formData = new FormData();
    formData.append("file", filePayload.file);
  }

  try {
    const token = await JwtService.getToken();

    const response = await axios.post(uploadUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    let currentFile = fileList.value.find((file) => file.id == filePayload.id);
    currentFile.uploaded = true;
    currentFile.response = response.data;
    handleSuccess(currentFile);
    console.log("Yükleme başarılı:", response.data);
  } catch (error) {
    console.error("Yükleme hatası:", error);
  }
};

const beforeRemove = (file) => {
  Swal.fire({
    title: "Kayıt silmek istiyor musunuz?",
    text: "",
    icon: "error",
    showCancelButton: true,
    confirmButtonColor: "red",
    cancelButtonColor: "gray",
    cancelButtonText: "Hayır",
    confirmButtonText: "Evet",
  }).then((result) => {
    if (result.isConfirmed) {
      handleRemove(file);
      // console.log('object :>> ', object);
    }
  });
};

const handleRemove = (filePayload) => {
  const fileId = filePayload.response.data.id; // Dosyanın yanıtını (response) alın
  const uzanti = filePayload.response.data.uzanti; // uzanti
  ApiService.delete(`uploads/${fileId}.${uzanti}`)
    .then((response) => {
      console.log(
        `File with ${filePayload.response.data.name} removed successfully`
      );

      // localden de sil
      fileList.value = fileList.value.filter(
        (file) => file.id != filePayload.id
      );

      //callbackde don
      let removeResponseData = {
        data: {
          id: filePayload.response.data.id,
          name: filePayload.name,
          uzanti: filePayload.response.data.uzanti,
          file: `${filePayload.response.data.id}.${filePayload.response.data.uzanti}`,
        },
      };
      console.log("removeResponseData :>> ", removeResponseData);
      emit("handleDeleteFile", removeResponseData);
      // Dosya başarıyla kaldırıldığında yapılması gereken işlemleri burada gerçekleştirin
    })
    .catch((error) => {
      console.error(`Error removing file with ID ${fileId}:`, error);
      // Hata durumunda yapılması gereken işlemleri burada gerçekleştirin
    });
};

const handleSuccess = (filePayload) => {
  console.log("File uploaded successfully. Response:", filePayload);
  if (filePayload) {
    // console.log("response :>> ", response);
    let successResponseData = {
      data: {
        id: filePayload.response.data.id,
        name: filePayload.name,
        uzanti: filePayload.response.data.uzanti,
        file: `${filePayload.response.data.id}.${filePayload.response.data.uzanti}`,
      },
    };
    console.log("successResponseData :>> ", successResponseData);
    emit("handleSaveFile", successResponseData);
    // Dosya yükleme başarılı olduğunda yapılması gereken işlemleri burada gerçekleştirin
  }
};

const clearFiles = () => {
  console.log("clearFileList clicked");
  fileList.value = [];
};

onMounted(() => {});

defineExpose({
  clearFiles,
});
</script>

<template>
  <div class="mb-3" style="max-width: 400px">
    <button
      type="button"
      class="btn bt-sm btn-primary px-2 py-1 mb-1 rounded-2"
      @click="this.$refs.uploadRef.click()"
    >
      Dosya Yükle
    </button>
    <input
      type="file"
      style="display: none"
      ref="uploadRef"
      @change="onFilePicked"
      multiple
    />

    <div class="bg-gray-400 rouned-2" v-if="fileListShow">
      <div
        v-for="file in fileList"
        :key="file.id"
        class="p-1 mb-1 bg-dark rounded-2"
      >
        <div
          class="file-item d-flex justify-content-between align-items-center p-1 rouned-2 bg-hover-gray-800"
        >
          <span
            class="text-nowrap overflow-hidden"
            style="height: calc(100% - 35px)"
            >{{ file.file.name }}</span
          >
          <span>
            <span v-if="file.uploaded" class="d-flex">
              <span
                @click="beforeRemove(file)"
                class="bg-danger rounded-circle p-1 d-flex justify-content-center align-items-center cursor-pointer"
                style="height: 25px; width: 25px"
                ><i
                  class="fa fa-trash fs-6"
                  style="width: 16px; height: 16px"
                ></i
              ></span>
            </span>
            <div v-else class="spinner-border text-primary"></div>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.file-item {
  display: flex;
  align-items: center;
}

.file-item .delete-icon {
  display: none; /* Başlangıçta silme ikonunu gizle */
}

.file-item:hover .check-icon {
  display: none; /* Hover durumunda kontrol ikonunu gizle */
}

.file-item:hover .delete-icon {
  display: flex; /* Hover durumunda silme ikonunu göster */
}
</style>
