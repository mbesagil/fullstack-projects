import { ref, watch } from "vue";
import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";

export const usePermissionStore = defineStore("permission", () => {
  const rolesData = ref([]);
  const selectedRole = ref({});
  const selectedLicence = ref({});
  const licencesData = ref([]);
  const serviceData = ref([
    {
      title: "Users",
      description: "users",
      name: "users",
      create: false,
      read: false,
      update: false,
      delete: false,
      import: false,
      export: false,
    },
    {
      title: "roles",
      description: "roles",
      name: "Roles",
      create: false,
      read: false,
      update: false,
      delete: false,
      import: false,
      export: false,
    },
    {
      title: "licence_card",
      description: "licence_card",
      name: "licence_card",
      create: false,
      read: false,
      update: false,
      delete: false,
      import: false,
      export: false,
    },
    {
      title: "uploads",
      description: "uploads",
      name: "uploads",
      create: false,
      read: false,
      update: false,
      delete: false,
      import: false,
      export: false,
    },
  ]);

  const selectedRoleHelper = ref({
    create: false,
    create: false,
    read: false,
    update: false,
    delete: false,
    import: false,
    export: false,
  });

  const getLicencesData = () => {
    if (licencesData.value.length == 0)
      ApiService.post("licences/list", {
        page: 1,
        limit: 1000,
      }).then((res) => {
        console.log("res :>> ", res);
        licencesData.value = res.data.data;
      });
  };

  const getRoleData = () => {
    if (rolesData.value.length == 0)
      ApiService.post("roles/list", {
        page: 1,
        limit: 1000,
      }).then((res) => {
        console.log("res :>> ", res);
        rolesData.value = res.data.data;
      });
  };
  const getOldPermission = () => {
    if (
      selectedLicence.value != "" &&
      Object.keys(selectedRole.value.id).length != 0
    ) {
      console.log("istek atilacak");
      ApiService.post("rolepermissions/list", {
        page: 1,
        limit: 1000,
        where: {
          role_id: selectedRole.value.id,
          licence_id: selectedLicence.value,
        },
      }).then((res) => {
        console.log("res :>> ", res);

        if (res.data.data.length > 0) {
          res.data.data.forEach((rolper) => {
            // console.log("rolper.name :>> ", rolper.name);
            const station = serviceData.value.find(
              (ser) => ser.name == rolper.name
            );
            if (station) {
              // console.log("station :>> ", station);
              station.create = rolper.create;
              station.read = rolper.read;
              station.update = rolper.update;
              station.delete = rolper.delete;
              station.import = rolper.import;
              station.export = rolper.export;
            }
          });
        }
      });
    }
  };

  const changeAllMethod = (type) => {
    console.log("type :>> ", type);
    let state = selectedRoleHelper.value[type];

    serviceData.value.forEach((rolper) => {
      // console.log("rolper :>> ", rolper);
      rolper[type] = state;
    });

    if (state) {
      console.log("selectedRoleHelper.value[type] :>> ", state);
    }
  };

  const clearForm = () => {
    selectedRoleHelper.value.create = false;
    selectedRoleHelper.value.read = false;
    selectedRoleHelper.value.update = false;
    selectedRoleHelper.value.delete = false;
    selectedRoleHelper.value.import = false;
    selectedRoleHelper.value.export = false;

    serviceData.value.forEach((serDa) => {
      serDa.create = false;
      serDa.read = false;
      serDa.update = false;
      serDa.delete = false;
      serDa.import = false;
      serDa.export = false;
    });
  };

  watch(
    () => selectedRole.value,
    (data) => {
      console.log("degisti :>> ", data);
      clearForm();
      getOldPermission();
    }
  );

  return {
    //licence
    selectedLicence,
    licencesData,
    getLicencesData,
    //service
    serviceData,
    clearForm,
    getRoleData,
    rolesData,
    selectedRole,
    selectedRoleHelper,
    changeAllMethod,
  };
});
