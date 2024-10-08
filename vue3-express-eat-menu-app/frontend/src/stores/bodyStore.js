import { ref } from "vue";
import { defineStore } from "pinia";

export const useBodyStore = defineStore("body", () => {
  const classes = ref({});

  function getClasses(key) {
    return classes.value[key];
  }

  function addBodyClassname(className) {
    document.body.classList.add(className);
  }

  function removeBodyClassName(className) {
    document.body.classList.remove(className);
  }

  function addBodyAttribute(payload) {
    const { qualifiedName, value } = payload;
    document.body.setAttribute(qualifiedName, value);
  }

  function removeBodyAttribute(payload) {
    const { qualifiedName } = payload;
    document.body.removeAttribute(qualifiedName);
  }

  function addClassname(payload) {
    const { position, className } = payload;
    if (!classes.value[position]) {
      classes.value[position] = [className];
    } else {
      classes.value[position].push(className);
    }
  }

  return {
    getClasses,
    addBodyClassname,
    removeBodyClassName,
    addBodyAttribute,
    removeBodyAttribute,
    addClassname,
  };
});
