import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
export const useBaseDialogStore = defineStore({
  id: "baseDialogStore",
  state: () => ({
    dialogs: [
      // {
      //   dialogType: "component",
      //   title: "Uzman Profili",
      //   message: "Create",
      //   isOpen: true,
      //   pagaData: [],
      //   componentData: [
      //     {
      //       compName: "Form",
      //       crud_name: "main_menu",
      //       crud_type: "create",
      //     },
      //   ],
      //   iframeData: [],
      //   // crud_type: data?.crud_type,
      //   // crud_name: data?.crud_name,
      //   // renderedParentPageId: data.renderedParentPageId,
      // },
    ],
  }),
  actions: {
    async createDialog(data) {
      // console.log("create.....: baseDialog", data);

      const dataCreate = {
        id: uuidv4(),
        dialogType: data.dialogType,
        renderedParentPageId: data.renderedParentPageId || null,
        title: data?.title || "",
        message: data?.message || "",
        size: data.size,
        isOpen: true,
        selectedItem: data.selectedItem || null,
        specialData: data.specialData || {},
        pageData: data.pageData || {},
        iframeData: data.iframeData || {},
        componentData: data.componentData || [],
        zIndex: this.getDialogZIndex(),
      };

      // console.log("dataCreate :>> ", dataCreate);

      this.dialogs.push(dataCreate);

      // console.log("this.dialogs :>> ", this.dialogs);
    },
    openDialog(dialogId) {
      // console.log("open.....:", dialogId);
      const dialogIndex = this.dialogs.findIndex(
        (dialog) => dialog.id === dialogId
      );
      if (dialogIndex > -1) {
        this.dialogs[dialogIndex].isOpen = true;
        this.dialogs[dialogIndex].zIndex = this.getDialogZIndex();
        // console.log("open... true", dialogIndex);
      } else {
        this.createDialog(dialogId);
      }
    },

    closeDialog(dialogId) {
      // console.log("pageOwnDialog close.....:", dialogId);
      this.dialogs.find((dialog) => dialog.id == dialogId).isOpen = false;
    },

    deleteDialog(dialogId) {
      // console.log("pageOwnDialog delete.....:", dialogId);
      this.dialogs = this.dialogs.filter((dialog) => dialog.id != dialogId);
    },

    getDialogZIndex() {
      let defaultZindex = 9999;
      this.dialogs?.forEach((a) => {
        if (a.zIndex > defaultZindex) {
          defaultZindex = a.zIndex;
        }
      });
      return defaultZindex + 1;
    },

    bringToFront(id) {
      if (this.dialogs.find((a) => a.id == id))
        this.dialogs.find((a) => a.id == id).zIndex = this.getDialogZIndex();
    },
  },
});
