import { defineStore } from "pinia";
import { Modal } from "bootstrap";
import { ref } from "vue";

// export const useBaseModalStore = defineStore("body", () => {
export const useBaseModalStore = defineStore("baseModalStore", () => {
  const title = ref("");
  const component = ref(null);
  const modalRef = ref(null);

  const initModalRef = () => {
    modalRef.value = new Modal(document.getElementById("base_modal"));
  };

  const open = () => {
    modalRef.value.show();
  };

  const close = () => {
    modalRef.value.hide();
  };

  return {
    title,
    component,
    modalRef,
    open,
    close,
    initModalRef,
  };
});
