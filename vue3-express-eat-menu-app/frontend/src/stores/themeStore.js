import { ref } from "vue";
import { defineStore } from "pinia";
import { useColorMode } from "@vueuse/core";
// import KTThemeMode from "public/assets/js/scripts.bundle";

export const useThemeStore = defineStore("theme", () => {
  const mode = ref();
  const useUseColorMode = useColorMode();
  mode.value = localStorage.getItem("data-bs-them") || "light";

  const setMode = (modeData) => {
    KTThemeMode.setMode(modeData);
    mode.value = modeData;
    useUseColorMode.value = modeData;
  };

  return {
    mode,
    setMode,
  };
});
