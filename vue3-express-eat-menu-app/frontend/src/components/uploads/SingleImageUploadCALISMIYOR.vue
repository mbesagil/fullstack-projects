<template>
  <el-upload
    class="avatar-uploader"
    :show-file-list="false"
    :before-upload="beforeAvatarUpload"
    style="30px; !important"
    :action="uploadUrl"
    :headers="{ Authorization: `Bearer ${JwtService.getToken()}` }"
    :on-success="handleSuccess"
    list-type="picture"
  >
    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
    <div
      v-if="backgroundImage"
      :style="{ backgroundImage: 'url(' + backgroundImage + ')' }"
      class="avatar"
    ></div>
    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
  </el-upload>
</template>

<script setup>
import { ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { Plus } from "@element-plus/icons-vue";

import JwtService from "@/core/services/JwtService";
import ApiService from "@/core/services/ApiService";
import buffer from "buffer";

const emit = defineEmits(["handleSaveImage"]);

const imageUrl = ref("");
const backgroundImage = ref();
const uploadUrl = `${import.meta.env.VITE_API_URL}/uploads`; // Replace with the actual URL of your Node.js server

const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== "image/jpeg") {
    ElMessage.error("Avatar picture must be JPG format!");
    return false;
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error("Avatar picture size can not exceed 2MB!");
    return false;
  }
  return true;
};

const handleSuccess = (response, file) => {
  console.log("File uploaded successfully. Response:", response, file);
  emit("handleSaveImage", response);
  fetchImage(`${response.data.id}.${response.data.uzanti}`);
};

const fetchImage = async (file) => {
  try {
    ApiService.get(`uploads/${file}`, {})
      .then((res) => {
        console.log("res :>> ", res);

        const base64 = Buffer.from(this.data).toString("base64");
        return `data:image/jpeg;base64,${base64}`;
      })
      .catch((err) => {
        console.log("err :>> ", err);
      });
  } catch (error) {
    console.error("Resim yüklenirken hata oluştu:", error);
  }
};
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
