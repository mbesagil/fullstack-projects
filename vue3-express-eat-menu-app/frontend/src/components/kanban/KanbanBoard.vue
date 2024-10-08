<script setup>
import { ref, onMounted } from "vue";
import { v4 as uuidv4 } from "uuid";
import ApiService from "../../core/services/ApiService";
import { toast } from "vue3-toastify";
import { useKanbanStore } from "@/stores/kanban/kanbanStore";
import KanbanFileManager from "./KanbanFileManager.vue";
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";
const props = defineProps(["componentSchema"]);

const kanbanStore = useKanbanStore();

const modalData = ref({
  desc: "denemme",
  title: "",
});
const modalPayload = ref({});

// get kabnan konums filter kanban_surec
const getKabanKonums = () => {
  kanbanStore.selectedKanbanKonum = "";
  console.log(
    "kanbanStore.selectedKanbanKonum :>> ",
    kanbanStore.selectedKanbanKonum
  );
  if (kanbanStore.selectedKanbanSurec != "")
    kanbanStore.getKanbanKonums(kanbanStore.selectedKanbanSurec);
};

//REOLOAD CARD DATA
const reload = () => {
  kanbanStore.selectedJob.state = false;
  kanbanStore.getKanbanDurums(kanbanStore.selectedKanbanKonum);
};

// get kabnan durums filter kanban_konum
const getKabanDurums = () => {
  if (kanbanStore.selectedKanbanKonum) console.log("getKanbanDurums calisti");
  kanbanStore.getKanbanDurums(kanbanStore.selectedKanbanKonum);
};

const dragstart = (event, dragDurumData, workid) => {
  console.log(
    "event, dragDurumData, workid :>> ",
    event,
    dragDurumData,
    workid
  );
  // console.log("dragDurumData :>> ", dragDurumData);
  event.dataTransfer.dropEffect = "move";
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("dragDurumData", JSON.stringify(dragDurumData));
  event.dataTransfer.setData("workid", workid);
};

const onDrop = (event, dropDurumData) => {
  // 1- gelen drop datalarini al
  console.log("dropDurumData :>> ", dropDurumData);
  const workid = event.dataTransfer.getData("workid");
  const dragDurumData = JSON.parse(event.dataTransfer.getData("dragDurumData"));

  // console.log("onDrop dragDurumData, :>> ", dragDurumData);

  //2- ayni yere surukleyip birakmiyorsa devam et
  if (dragDurumData.id != dropDurumData.id) {
    // eger suruklenen kart bi sonraki adim yerinde daha sonraki bio adima gecmek istiyorsa buna o konum boyunca izin verme
    if (dragDurumData.rank + 1 >= dropDurumData.rank) {
      console.log("Gönderilen Durum: ", dragDurumData.id);
      console.log("Gönderilen İş: ", workid);
      console.log("Alan Durum:>> ", dropDurumData.id);

      //3- modal payloadunu olustur
      const workCardPayload = kanbanStore.kanbanDurumsData
        .find((a) => a.id == dragDurumData.id)
        .works.find((w) => w.id == workid);

      modalPayload.value = {
        workCardPayload,
        workid,
        dragDurumData,
        dropDurumData,
      };

      // const modalElement = document.getElementById("kanbanChangeLogModal");
      // const modalInstance = new bootstrap.Modal(modalElement, {
      //   keyboard: false,
      // });
      // modalInstance.show();

      Swal.fire({
        title: "Kanban Change Description",
        html: `<div>
                <div>
                  <span>Bu Work Card
                    <span class="badge fs-8 fw-bold badge-light-info">
                      ${modalPayload.value.dragDurumData?.title?.toUpperCase()}
                    </span>
                    Durumundan
                    <span class="badge fs-8 fw-bold badge-light-success">
                      ${modalPayload.value.dropDurumData?.title?.toUpperCase()}
                    </span>
                    Durumuna Guncellenecek
                  </span>
                </div>
                <div class='w-100 mt-2'>
                    <textarea id="kanban_desc_textarea" class="form-control" rows="5" placeholder="Please in Description"></textarea>
                </div>
              </div>`,
        showCancelButton: true,
        showCloseButton: true,
        confirmButtonColor: "green",
        cancelButtonColor: "gray",
        confirmButtonText: "Save description",
        cancelButtonAriaLabel: "Thumbs down",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          const textareaValue = document.getElementById(
            "kanban_desc_textarea"
          ).value;
          modalData.value.desc = textareaValue;
          console.log("log kaydettttttttttttttt", textareaValue);
          //4- eger kullanici aciklmayi girdiyse ve onayladiysa degisim islemlerini baslat
          saveKanbanChangeLogModal();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          /* Read more about handling dismissals below */
          swalWithBootstrapButtons.fire("Cancelled", "error");
        }
      });
    } else {
      toast.error(
        `ilk once  ${
          kanbanStore.kanbanDurumsData.find(
            (el) => el.rank == dragDurumData.rank + 1
          ).title
        } adimina donmelisiniz`,
        {
          position: "top-right",
        }
      );
    }
  } else {
    // alert("ayni yere atayamaz");//
  }
};

const saveKanbanChangeLogModal = () => {
  // eger 3 karakterden azsa girilen aciklama hata ver

  console.log("saveKanbanChangeLogModal :>> ", modalPayload.value);

  if (modalData.value.desc.length > 3) {
    console.log(
      "ishaveTarget :>> ",
      modalPayload.value.dropDurumData.have_target
    );
    if (modalPayload.value.dropDurumData.have_target == true) {
      /*******************************************have TARGET */
      // eger bu durumun bir targeti varsa
      console.log("have target");
      //1 ilk once tasinilan karti bu durumda 10 saniye goster veri tabanina kaydet
      console.log("have a target :>> ", modalPayload.value.workCardPayload);

      modalPayload.value.workCardPayload.status_id =
        modalPayload.value.dropDurumData.id;

      let updatedWorkCardData = {
        ...modalPayload.value.workCardPayload,
      };

      console.log("updatedWorkCardData :>> ", updatedWorkCardData);

      ApiService.put(
        `${import.meta.env.VITE_KANBAN_SERVICE_JOB_CARD}/update/${
          updatedWorkCardData.id
        }`,
        updatedWorkCardData
      )
        .then((res) => {
          console.log("res :>> ", res);

          // save changes logs durums for wprk card data
          writeJobCardLog(updatedWorkCardData);

          toast.success(`Work ${updatedWorkCardData.title} updated`, {
            position: "top-right",
          });

          // locale datadan degistir
          kanbanStore.kanbanDurumsData.find(
            (el) => el.id == modalPayload.value?.dragDurumData.id
          ).works = kanbanStore.kanbanDurumsData
            .find((el) => el.id == modalPayload.value?.dragDurumData.id)
            ?.works.filter((el) => el.id != modalPayload.value?.workid);

          //suruklenen duruma kaydet
          kanbanStore.kanbanDurumsData
            .find((el) => el.id == modalPayload.value?.dropDurumData.id)
            .works.push(modalPayload.value?.workCardPayload);

          // targeta gitmeden once kullaniciya 2.5 saniye goster
          setTimeout(() => {
            console.log("target degisitiliyor");
            // yeni target komum surec durum datasini ekle
            /*
             */

            //workcardPayloadi guncelle
            modalPayload.value.workCardPayload.process_id =
              modalPayload.value.dropDurumData.target_process_id;
            modalPayload.value.workCardPayload.position_id =
              modalPayload.value.dropDurumData.target_position_id;
            modalPayload.value.workCardPayload.status_id =
              modalPayload.value.dropDurumData.target_status_id;

            let updatedWorkCardForaTarget = {
              ...modalPayload.value?.workCardPayload,
            };

            console.log(
              "updatedWorkCardForaTarget :>> ",
              updatedWorkCardForaTarget
            );

            // console.log('updatedWorkCardForaTarget :>> ', updatedWorkCardForaTarget);
            ApiService.put(
              `${import.meta.env.VITE_KANBAN_SERVICE_JOB_CARD}/update/${
                updatedWorkCardData.id
              }`,
              updatedWorkCardForaTarget
            )
              .then((res) => {
                console.log("res :>> ", res);

                // save changes logs targets for wprk card data
                writeJobCardLog(updatedWorkCardForaTarget);

                toast.warning(
                  `Work ${updatedWorkCardForaTarget.title} updated Changed another SUREC or KONUM`,
                  {
                    position: "top-right",
                  }
                );
                // locale drop edilen datadan sil cunku baska bi konuma gitmis olbilir
                kanbanStore.kanbanDurumsData.find(
                  (el) => el.id == modalPayload.value?.dropDurumData.id
                ).works = kanbanStore.kanbanDurumsData
                  .find((el) => el.id == modalPayload.value?.dropDurumData.id)
                  ?.works.filter((el) => el.id != modalPayload.value?.workid);
              })
              .catch((err) => {
                console.log("err :>> ", err);
              });
          }, 2500);
        })
        .catch((err) => {
          console.log("err :>> ", err);
        });

      //2 sonrasinda targetinda bulunan bilgilere gore yeni yerine update et ve mevcut durumdan sil
    } else {
      /*******************************************havent TARGET  write only durum*/
      console.log("not have target");

      modalPayload.value.workCardPayload.status_id =
        modalPayload.value.dropDurumData.id;
      let updatedWorkCardData = {
        ...modalPayload.value.workCardPayload,
      };
      console.log(
        "not have target updatedWorkCardData :>> ",
        updatedWorkCardData
      );

      //sadece is cardinin durumunu guncelle
      ApiService.put(
        `${import.meta.env.VITE_KANBAN_SERVICE_JOB_CARD}/update/${
          updatedWorkCardData.id
        }`,
        updatedWorkCardData
      )
        .then((res) => {
          console.log("res :>> ", res);

          // save changes logs durums for wprk card data
          writeJobCardLog(updatedWorkCardData);

          toast.success(`Work ${updatedWorkCardData.title} saved`, {
            position: "top-right",
          });

          // locale datadan degistir
          kanbanStore.kanbanDurumsData.find(
            (el) => el.id == modalPayload.value?.dragDurumData.id
          ).works = kanbanStore.kanbanDurumsData
            .find((el) => el.id == modalPayload.value?.dragDurumData.id)
            ?.works.filter((el) => el.id != modalPayload.value?.workid);

          //suruklenen duruma kaydet
          //bunun yerine yenileyebiliriz.
          kanbanStore.kanbanDurumsData
            .find((el) => el.id == modalPayload.value?.dropDurumData.id)
            .works.push(modalPayload.value?.workCardPayload);
        })
        .catch((err) => {
          console.log("err :>> ", err);
        });
    }

    //onceki durumdan sil

    // console.log("hide modal");
    // const modalElement = document.getElementById("kanbanChangeLogModal");
    // const modalInstance = bootstrap.Modal.getInstance(modalElement);
    // modalInstance.hide();
  } else {
    toast.error(`Hata minimum 3 karakter gir`, {
      position: "top-right",
    });
    // tekrardan modali ac
    Swal.fire({
      title: "Kanban Change Description",
      html: `<div>
                <div>
                  <span>Bu Work Card
                    <span class="badge fs-8 fw-bold badge-light-info">
                      ${modalPayload.value.dragDurumData?.title?.toUpperCase()}
                    </span>
                    Durumundan
                    <span class="badge fs-8 fw-bold badge-light-success">
                      ${modalPayload.value.dropDurumData?.title?.toUpperCase()}
                    </span>
                    Durumuna Guncellenecek
                  </span>
                </div>
                <div class='w-100 mt-2'>
                    <textarea id="kanban_desc_textarea" class="form-control" rows="5" placeholder="Please in Description"></textarea>
                </div>
              </div>`,
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "gray",
      confirmButtonText: "Save description",
      cancelButtonAriaLabel: "Thumbs down",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const textareaValue = document.getElementById(
          "kanban_desc_textarea"
        ).value;
        modalData.value.desc = textareaValue;
        console.log("log kaydettttttttttttttt", textareaValue);
        saveKanbanChangeLogModal();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        /* Read more about handling dismissals below */
        swalWithBootstrapButtons.fire("Cancelled", "error");
      }
    });
  }
};

const writeJobCardLog = async (jobcard) => {
  let logDurumData = {
    job_card_id: jobcard.id,
    process_id: jobcard.process_id,
    position_id: jobcard.position_id,
    status_id: jobcard.status_id,
    vehicle_id: jobcard.vehicle_id,
    description: modalData.value?.desc,
  };
  console.log("logDurumData :>> ", logDurumData);

  ApiService.post(
    `${import.meta.env.VITE_KANBAN_SERVICE_JOB_CARD_LOG}/create`,
    logDurumData
  )
    .then((res) => console.log("res :>> ", res))
    .catch((err) => {
      console.log("err :>> ", err);
    });
};

const goToIframe = (workCard) => {
  let url = `/#/timeline/${workCard.id}`;

  // console.log("src :>> ", src);
  window.open(url, "_blank");

  // let sendData = {
  //   dialogType: "iframe",
  //   title: workCard.name || "",
  //   message: "take your enjoy",
  //   isOpen: true,
  //   pagaData: {},
  //   componentData: [],
  //   iframeData: {
  //     src: src,
  //   },
  // };
  // BaseStore.dialogs.baseDialog.createDialog(sendData);
};

onMounted(() => {
  // cagir datalari gelsin
  kanbanStore.getKanbanSurecs();
  KTComponents.init();
  // kanbanStore.getKanbanWorkCards();
});
</script>

<template>
  <div class="h-100 card">
    <div class="card-body">
      <div
        class="my-2 d-flex flex-wrap justify-content-between align-items-center"
        style=""
      >
        <!-- SUREC SEC -->
        <div class="d-flex flex-wrap justify-content-between">
          <span class="me-2"
            ><el-select
              class=""
              style="min-width: 200px"
              v-model="kanbanStore.selectedKanbanSurec"
              @change="getKabanKonums"
              ><el-option
                v-for="element in kanbanStore.kanbanSurecsData"
                :key="element.id"
                :value="element.id"
                :label="element.title"
              ></el-option
            ></el-select>
          </span>

          <!-- KONUM SEC -->
          <span class="me-2"
            ><el-select
              style="min-width: 200px"
              v-model="kanbanStore.selectedKanbanKonum"
              @change="getKabanDurums"
              ><el-option
                v-for="element in kanbanStore.kanbanKonumsData"
                :key="element"
                :value="element.id"
                :label="element.title"
              ></el-option></el-select
          ></span>
        </div>
        <!-- <span>{{ selectedKanbanSurec }} -> {{ kanbanStore.selectedKanbanKonum }}</span> -->
        <span class="cursor-pointer btn btn-sm btn-primary" @click="reload()"
          >Reload</span
        >
      </div>
      <div class="card-area" style="height: 100%; min-height: 600px">
        <div
          class="d-flex"
          style="height: 90%; overflow-x: scroll"
          v-if="
            kanbanStore.selectedKanbanSurec != '' &&
            kanbanStore.selectedKanbanKonum != ''
          "
        >
          <div
            class="card-item ms-4 mt-4"
            style="height: 98%; min-width: 250px"
            v-for="(item, index) in kanbanStore.kanbanDurumsData"
            :key="item.id"
            @drop.prevent="onDrop($event, item)"
            @dragenter.prevent
            @dragover.prevent
          >
            <h6
              class="py-4 ps-4 mb-0 text-white"
              :style="{ 'background-color': 'gray' }"
              :class="item.class"
            >
              {{ item.title }} / {{ item?.works?.length }}
            </h6>
            <div
              class="p-3 overflow-auto rounded-2 bg-light"
              style="height: calc(100% - 50px)"
            >
              <div
                v-for="work in item?.works"
                class="position-relative border shadow-lg work-item border mb-5 bg-gray-500 p-1 rounded-2"
                draggable="true"
                @dragstart="dragstart($event, item, work.id)"
              >
                <div class="pb-2 my-2">
                  <div
                    class="d-flex justify-content-between align-items-center px-2"
                  >
                    <div
                      class=" fw-bold p-1"
                      style="
                        width: 130px;
                        overflow: hidden;
                        display: inline-block;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                      "
                    >
                      {{ work?.title?.toUpperCase() }}
                    </div>
                    <button
                      class="btn btn-sm btn-info"
                      @click="goToIframe(work)"
                    >
                      Detail
                    </button>
                  </div>

                  <template v-if="item.have_form">
                    <KanbanFileManager :jobcard="work"></KanbanFileManager>
                  </template>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal -->
          <div
            class="modal fade"
            id="kanbanChangeLogModal"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabindex="-1"
            aria-labelledby="kanbanChangeLogModalLabel"
            aria-hidden="true"
          >
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header py-2">
                  <h5 class="modal-title" id="kanbanChangeLogModalLabel">
                    Description -
                    {{ modalPayload?.workCardPayload?.title?.toUpperCase() }}
                  </h5>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div class="modal-body">
                  <div>
                    <span
                      >Bu Work Card
                      <span class="badge fs-8 fw-bold badge-light-info">
                        {{ modalPayload?.dragDurumData?.title?.toUpperCase() }}
                      </span>
                      Durumundan
                      <span class="badge fs-8 fw-bold badge-light-success">
                        {{ modalPayload?.dropDurumData?.title?.toUpperCase() }}
                      </span>
                      Durumuna Guncellenecek</span
                    >
                  </div>
                  <div>
                    <el-input
                      v-model="modalData.desc"
                      :rows="2"
                      type="textarea"
                      placeholder="please write description before save"
                    />
                  </div>
                </div>
                <div class="modal-footer py-2">
                  <button
                    class="btn btn-sm btn-primary"
                    @click="saveKanbanChangeLogModal"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-else
          class="d-flex h-100 flex-grow-1 justify-content-center align-items-center"
        >
          <div>Loading..</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.work-item {
  width: 100%;
  border-radius: 8px;
}

.work-item-danger .fa-circle-exclamation {
  color: red;
  font-size: 18px;
  background: white;
}

.work-item-success .fa-check {
  color: white;
  font-size: 12px;
  background: #2ac7a3;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  padding: 10px;
}

.card-item {
  width: 250px;
  height: 600px;
  border-radius: 8px;
  overflow: hidden;
}

.box-shadow {
  box-shadow: rgba(50, 50, 105, 0.15) 0px 2px 5px 0px,
    rgba(0, 0, 0, 0.05) 0px 1px 1px 0px;
}

.text-sm {
  font-size: 12px;
}

.c-bg-blue {
  background-color: #00275e;
}
.c-bg-danger {
  background-color: #e2455a;
}
.c-bg-gray {
  background-color: #f1f1f1;
}
.c-bg-gray-2 {
  background-color: #9e9e9e;
}
.c-text-blue {
  color: #00275e;
}
.c-bg-blue-2 {
  background-color: #0087c1;
}
.c-bg-success {
  background-color: #01c973;
}
.c-rounded {
  border-radius: 5px;
}
</style>
