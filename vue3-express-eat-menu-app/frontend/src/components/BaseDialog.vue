<script setup lang="ts">
// import FormComponent from "../../components/FormComponent.vue";
// import GridComponent from "../../components/GridComponent.vue";
import { ref, onMounted, computed } from "vue";
import { useBaseDialogStore } from "@/stores/dialogs/baseDialogStore";

const dialogStore = useBaseDialogStore();

const props = defineProps(["dialog"]);
// console.log("dialog :>> ", props.dialog);

const isOpen = ref(false);
const title = ref("");
const message = ref("");
const position = ref({ x: 500, y: 400 });
const isDragging = ref(false);
const mouseOffset = ref({ x: 0, y: 0 });
const zIndex = ref(9999);
const dialog = ref(null);
const width = ref(800);
const height = ref(600);
const isResizing = ref(false);
const startX = ref(0);
const startY = ref(0);

const dialogIndex = computed(() => {
  if (dialogStore.dialogs.length > 0) {
    return dialogStore.dialogs.findIndex(
      (dialog) => dialog.id === props.dialog.id
    );
  }
});

onMounted(() => {
  position.value.x = Math.floor(Math.random() * 201) + 200; // 500 ile 700 arasında rastgele sayı
  position.value.y = Math.floor(Math.random() * 101) + 100; // 400 ile 500 arasında rastgele sayı

  if (dialogStore.dialogs.length > 0) {
    // console.log("props.dialog :>> ", props.dialog.isOpen);

    zIndex.value = computed(
      () => dialogStore.dialogs[dialogIndex.value]?.zIndex
    );
    title.value = props.dialog.title
      ? dialogStore.dialogs[dialogIndex.value]?.title
      : "Dialog";
    message.value = props.dialog.message
      ? dialogStore.dialogs[dialogIndex.value]?.message
      : "CRUD";
  }
  if (props.dialog.size) {
    width.value =
      props.dialog?.size.width < 100 ? 800 : props.dialog?.size.width;
    height.value =
      props.dialog?.size.height < 100 ? 600 : props.dialog?.size.height;
  }

  // console.log("message", message.value);
});

const getCompoent = (componentName) => {
  // switch (componentName) {
  //   case "FormComponent":
  //     return FormComponent;
  //   case "GridComponent":
  //     return GridComponent;
  //   case "timeline":
  //     return TimeLine;
  // }
};

// dialog behavior
const deleteDialog = (dialogId) => {
  dialogStore.deleteDialog(dialogId);
};
const closeDialog = (dialogId) => {
  dialogStore.closeDialog(dialogId);
};
const fullScreenDialogEmit = () => {
  // console.log("full screen clicked");
};
const bringToFront = (dialogId) => {
  // eger dialog pagerende da ana sayfada render olmadisya one getir
  if (!props.dialog.pageData.pageOwnData) dialogStore.bringToFront(dialogId);
};

/// for drag mouseevent
const startDrag = (event) => {
  // console.log('event :>>startDrag ', event);
  isDragging.value = true;
  const dialogRect = dialog.value.getBoundingClientRect();
  mouseOffset.value = {
    x: event.clientX - dialogRect.left,
    y: event.clientY - dialogRect.top,
  };
  document.addEventListener("mousemove", handleDrag);
  document.addEventListener("mouseup", stopDrag);
};
const handleDrag = (event) => {
  if (isDragging.value) {
    const maxWidth = window.innerWidth - dialog.value.offsetWidth - 15;
    const maxHeight = window.innerHeight - dialog.value.offsetHeight - 15;

    let newPositionX = event.clientX - mouseOffset.value.x;
    let newPositionY = event.clientY - mouseOffset.value.y;

    newPositionX = Math.max(0, Math.min(newPositionX, maxWidth));
    newPositionY = Math.max(0, Math.min(newPositionY, maxHeight));

    position.value = {
      x: newPositionX,
      y: newPositionY,
    };
  }
};
const stopDrag = () => {
  isDragging.value = false;
  document.removeEventListener("mousemove", handleDrag);
  document.removeEventListener("mouseup", stopDrag);
};

/// for resise mouseevent
const startResize = (event) => {
  // console.log('event startResize:>> ', event);
  const { offsetX, offsetY } = event;
  const isRightEdge = offsetX > event.target.clientWidth - 10;
  const isBottomEdge = offsetY > event.target.clientHeight - 10;

  if (isRightEdge || isBottomEdge) {
    event.preventDefault();
    isResizing.value = true;
    startX.value = event.clientX;
    startY.value = event.clientY;
    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResize);
  }
};
const resize = (event) => {
  if (!isResizing.value) return;

  const widthChange = event.clientX - startX.value;
  const heightChange = event.clientY - startY.value;

  width.value += widthChange;
  height.value += heightChange;
  startX.value = event.clientX;
  startY.value = event.clientY;
};
const stopResize = () => {
  isResizing.value = false;
  document.removeEventListener("mousemove", resize);
  document.removeEventListener("mouseup", stopResize);
};
</script>

<template>
  <div
    id="base-dialog"
    class="dialog-overlay bg-dark"
    :style="{
      display: props.dialog.isOpen ? ' block' : 'none',
      zIndex: zIndex.value,
    }"
  >
    <div
      @mousedown.stop="startResize"
      class="ui-dialog rounded-2 border border-2 border-gray-500 bg-light"
      :style="{
        top: position.y + 'px',
        left: position.x + 'px',
        zIndex: zIndex.value,
        width: width + 'px',
        height: height + 'px',
      }"
      ref="dialog"
      @click="bringToFront(props.dialog.id)"
    >
      <div class="ui-dialog-body rounded-2 h-100 p-0">
        <div
          class="ui-dialog-titlebar bg-light border-bottom border-gray-500"
          @mousedown.stop="startDrag"
        >
          <div class="ui-dialog-title px-2">
            <div
              class="dialog-module-name d-flex justify-content-center align-items-center p-0"
              style="width: fit-content;!important"
            >
              <span class="text-gray-700 fs-3">{{ title }}</span>
            </div>
            <div
              class="dialog-module-title border-start border-gray-500 ms-2 text-gray-500 fs-6"
            >
              {{ message }}
            </div>
          </div>
          <div
            v-if="props.dialog.renderedParentPageId != null"
            class="ui-dialog-titlebar-content-minus"
            @click="closeDialog(props.dialog.id)"
          >
            <i class="fa fa-minus"></i>
          </div>
          <div
            class="ui-dialog-titlebar-content-close"
            @click="fullScreenDialogEmit()"
          >
            <i class="fa fa-caret-down"></i>
          </div>
          <div
            class="ui-dialog-titlebar-close"
            @click="deleteDialog(props.dialog.id)"
          >
            <i class="fa fa-times"></i>
          </div>
        </div>
        <div
          class="ui-dialog-content bg-secondary"
          style="height: calc(100% - 80px)"
        >
          <div class="dialog-content">
            <!-- header -->
            <slot name="special_dialog_content"></slot>

            <div v-if="false" class="h-100 p-3">
              <!-- //herhangi bi ozellestirilmis dialog contenti icin -->

              <!-- <div v-if="props.dialog.dialogType == 'component'">
                <div class="row">
                  <template v-for="component in props.dialog.componentData">
                    <div :class="component.class ? component.class : 'col-12'">
                      <component
                        :is="getCompoent(component.componentName)"
                        :crud_name="component.crud_name"
                        :crud_type="component.crud_type"
                        :dialogId="props.dialog.id"
                      >
                      </component>
                    </div>
                  </template>
                </div>
              </div>
              <div v-else-if="props.dialog.dialogType == 'pageRender'">
                <slot name="page_render_dialog_render_zone"></slot>
              </div>
              <div
                v-else-if="props.dialog.dialogType == 'iframe'"
                class="h-100"
              >
                <iframe
                  :src="props.dialog?.iframeData?.src"
                  frameborder="0"
                  width="100%"
                  height="100%"
                ></iframe>
              </div> -->
            </div>
          </div>
        </div>
        <div class="ui-dialog-footer bg-light border-top border-gray-500"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dialog-module-name {
  font-size: 12px;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.ui-dialog {
  width: 600px;
  height: 500px;
  overflow: absolute;
  position: fixed;
  display: flex;
  flex-direction: column;
  cursor: move;
  resize: both;
  overflow: auto;
}

.ui-dialog-body {
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: absolute;
  display: flex;
  flex-direction: column;
  cursor: auto;
}

.ui-dialog-titlebar {
  height: 40px;
  position: relative;
  cursor: move;
  background: #fafafa;
  justify-content: center;
}
.ui-dialog-titlebar .dialog-module-name {
  width: 85px;
  height: 40px;
  float: left;
  line-height: 1;
  /* margin-right: 10px; */
  color: #d9d9d9;
  padding-left: 5px;
  padding-top: 5px;
}
.ui-dialog-titlebar .dialog-module-name span:nth-child(1) {
  color: #999;
  font-weight: 600;
}
.ui-dialog-titlebar .dialog-module-title {
  color: #182b53;
  font-weight: 600;
}

.ui-dialog-titlebar .dialog-module-title {
  height: 40px;
  padding-left: 10px;
  float: left;
}
.ui-dialog-title {
  float: left;
  white-space: nowrap;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 40px;
  font-size: 16px;
  user-select: none;
}

.ui-dialog-titlebar-close {
  margin-top: 10px;
  width: 21px;
  height: 21px;
  border-radius: 50%;
  border: 2px solid #ea3a3d;
  background: #ea3a3d;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  right: 5px;
  position: absolute;
  cursor: pointer;
}
.ui-dialog-titlebar-close i {
  display: none;
}

.ui-dialog-titlebar-close:hover i {
  display: block;
  color: #fff;
  font-size: 12px;
}

.ui-dialog-titlebar-content-close {
  margin-top: 10px;
  width: 21px;
  height: 21px;
  border-radius: 50%;
  border: 2px solid #1ad598;
  background: #1ad598;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  right: 30px;
  position: absolute;
  cursor: pointer;
}
.ui-dialog-titlebar-content-close i {
  display: none;
}
.ui-dialog-titlebar-content-close:hover i {
  display: block;
  color: #fff;
  font-size: 12px;
}
.ui-dialog-titlebar-content-minus {
  margin-top: 10px;
  width: 21px;
  height: 21px;
  border-radius: 50%;
  border: 2px solid #d9d9d9;
  background: #d9d9d9;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  right: 55px;
  position: absolute;
  cursor: pointer;
}
.ui-dialog-titlebar-content-minus i {
  display: none;
  font-size: 12px;
}
.ui-dialog-titlebar-content-minus:hover i {
  display: block;
  color: #182b53;
  font-size: 12px;
}
.ui-dialog-content {
  position: relative;
  background: none;
  overflow: hidden;
}

.ui-dialog-content .dialog-left-image {
  float: left;
  width: 95px;
  height: 100%;
  position: relative;
}

.ui-dialog-content .dialog-left-image::before {
  content: "";
  position: absolute;
  top: 0;
  width: 95px;
  height: 100%;
  background: url(../media/header/dialogleft.jpg) no-repeat center;
  background-size: cover;
  z-index: -1;
}

.ui-dialog-content .dialog-content {
  float: right;
  width: 100%;
  /* width: calc(100% - 95px); */
  height: 100%;
  position: relative;
  overflow: auto;
  padding-bottom: 20px;
}

.ui-dialog-footer {
  height: 40px !important;
  width: 100%;
  flex-grow: 1;
  position: absolute;
  z-index: 100;
  bottom: 0px;
}
</style>
