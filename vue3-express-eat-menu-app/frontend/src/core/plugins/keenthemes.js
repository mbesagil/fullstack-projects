
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";

/**
 * Initialize KTIcon global component instance
 * @param app vue instance
 */
function initKtIcon(app) {
  app.component("KTIcon", KTIcon);
}

export {
  initKtIcon,
};
