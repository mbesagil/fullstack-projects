<script setup>
import { computed, onMounted, onUnmounted, watch, ref } from "vue";
import Swal from "sweetalert2/dist/sweetalert2.js";
import ApiService from "@/core/services/ApiService";
import { v4 as uuidv4 } from "uuid";
import { toast } from "vue3-toastify";

import { convertToCustomFormat } from "@/core/helpers/timeHelper";

import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps(["tableSettings"]);
const emit = defineEmits(["createItem", "updateItem", "selectedItem", "close"]);

const grid = ref({
  selectedItem: null,
  loading: false,
  data: [],
  where: {},
  pagination: {
    total: 0,
    page: 1,
    limit: 20,
  },
});

const bodyData = computed(() => {
  return props.tableSettings.bodyData || [];
});

// INIT DATA
const initDataForGrid = async () => {
  grid.value.loading = true;

  // const filterJson = grid.data
  //   .find((f) => f.name == com)
  //   .filter.filter((v) => v.value != "")
  //   .map((res) => {
  //     return { [res.name]: res.value };
  //   });

  // console.log("filterJson in gridStore :>> ", filterJson);

  if (props.tableSettings.service.requestUrl) {
    await ApiService.post(
      `${props.tableSettings.service.requestUrl}`,
      {
        page: grid.value.pagination.page,
        limit: grid.value.pagination.limit,
        where: grid.value.where,
      }
      // filterJson
    )
      .then((res) => {
        // console.log("res :>> ", res);

        grid.value.pagination.total = res.data.total;

        if (res.status == 200) {
          grid.value.data = res.data.data;
          grid.value.loading = false;
          if (res.data.data.length == 0) {
            grid.value.empty = 1;
          } else {
            grid.value.empty = 0;
          }
        }
      })
      .catch((err) => {
        // console.log("err :>> ", err);
      });
  }
};

//SELECTION
const changeSelectedItem = (row) => {
  // console.log("changeSelectedItem row", row);
  if (grid.value.selectedItem) {
    if (row.id == grid.value.selectedItem.id) {
      grid.value.selectedItem = null;
    } else {
      grid.value.selectedItem = { ...row };
    }
  } else {
    grid.value.selectedItem = { ...row };
  }
  // console.log(grid.selectedItem);
};

// CHANGE PAGE
const changePage = (type) => {
  changePageFunc(type);
};

const enterKeyPressHandler = () => {
  let res = onlyNumbers(grid.value.pagination.page);
  if (
    grid.value.pagination.page > 0 &&
    grid.value.pagination.page <=
      Math.ceil(grid.value.pagination.total / grid.value.pagination.limit) &&
    res
  ) {
    changePageFunc("page");
  }
};

const changePageFunc = async (type) => {
  // console.log("type :>> ", type);
  switch (type) {
    case "first":
      grid.value.pagination.page = 1;
      break;
    case "prev":
      grid.value.pagination.page =
        grid.value.pagination.page > 1 ? grid.value.pagination.page - 1 : 1;
      break;
    case "next":
      grid.value.pagination.page =
        grid.value.pagination.page <
        Math.ceil(grid.value.pagination.total / grid.value.pagination.limit)
          ? grid.value.pagination.page + 1
          : Math.ceil(
              grid.value.pagination.total / grid.value.pagination.limit
            );
      break;
    case "last":
      grid.value.pagination.page = Math.ceil(
        grid.value.pagination.total / grid.value.pagination.limit
      );
      break;
    case "reload":
      grid.value.pagination.page = 1;
      break;
    case "page":
      // grid.value.pagination.page = page_val;
      break;
    default:
      grid.value.pagination.page = 1;
      break;
  }

  if (props.tableSettings.service.requestUrl) {
    await ApiService.post(
      `${props.tableSettings.service.requestUrl}`,
      {
        page: grid.value.pagination.page,
        limit: grid.value.pagination.limit,
        where: grid.value.where,
      }
      // filterJson
    )
      .then((res) => {
        grid.value.pagination.total = res.data.total;
        grid.value.data = res.data.data;
      })
      .catch((err) => {
        // console.log("err :>> ", err);
      });
  }
};

// CHANGE PAGE END

// TOOLBARS ACTIONS
// search
const search = () => {
  // console.log("search :>> ");

  for (const key in grid.value.where) {
    if (Object.prototype.hasOwnProperty.call(grid.value.where, key)) {
      const element = grid.value.where[key];
      // console.log("element :>> ", element);

      if (grid.value.where[key] == "") {
        delete grid.value.where[key];
      }
    }
  }
  changePageFunc("reload");
};

const addItem = () => {
  emit("createItem", props.tableSettings.service.name);
  // console.log("object :>> ", "add new ");
};

const updateItem = async () => {
  emit("updateItem", grid.value.selectedItem);
  // console.log("updateItemData :>> ", grid.value.selectedItem);
};

const deleteConfirm = () => {
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
      // console.log('object :>> ', object);
      ApiService.delete(
        `/${props.tableSettings.service.deleteServiceName}/delete/${grid.value.selectedItem.id}`
      )
        .then((res) => {
          // console.log("res :>> ", res);
          toast.success("Success Deleted!");
          //reload data
          changePageFunc("reload");
        })
        .catch((err) => {
          // console.log("err :>> ", err);
          toast.error("Error !");
        });
    }
  });
};
// TOOLBARS ACTIONS END

const changeDoubleSelectedItem = (row) => {
  emit("selectedItem", row);
  emit("close");
};

onMounted(() => {
  if (props.tableSettings.service.where) {
    // console.log(
    //   "props.tableSettings.service.where :>> ",
    //   props.tableSettings.service.where
    // );
    grid.value.where = props.tableSettings.service.where;
  }
  initDataForGrid();
});

onUnmounted(() => {});

// HELPERS
function onlyNumbers(inputValue) {
  const regexPattern = /^\d+$/;
  if (regexPattern.test(inputValue)) {
    return true;
  } else {
    return false;
  }
}

const goToDetail = (row) => {
  props.tableSettings.settings.detailBtnCallback(row);
};

defineExpose({
  changePageFunc,
});
</script>

<template>
  <div class="card shadow">
    <div class="card-body">
      <div class="row mt-5">
        <div v-if="tableSettings.settings.filter" class="col-md-3 h-100 mt-16">
          <ul class="p-0 m-0">
            <li
              class="list-unstyled mb-2"
              v-for="(col, index) in bodyData"
              :key="index"
            >
              <div>{{ col?.label }}</div>
              <div>
                <el-input
                  @keyup.enter="search"
                  class="w-100"
                  type="text"
                  v-model="grid.where[col.name]"
                />
              </div>
            </li>
          </ul>
          <div class="d-flex justify-content-end mt-5">
            <button @click="search()" class="btn btn-primary btn-sm">
              Filter
            </button>
          </div>
        </div>
        <div
          class=""
          :class="tableSettings.settings.filter ? 'col-md-9' : 'col-md-12'"
        >
          <div
            id="card_grid_toolbar"
            :class="grid.selectedItem ? 'custom-tab-menu' : ''"
            class="tab-menu d-flex align-items-center justify-content-between rounded-top text-dark"
          >
            <div class="d-flex justify-content-between w-100">
              <div class="d-flex">
                <template v-if="grid.selectedItem">
                  <div
                    v-if="
                      tableSettings.settings
                        ? tableSettings.settings.show.update
                        : true
                    "
                    class="d-flex align-items-center cursor-pointer btn btn-success btn-sm p-2 m-1 ms-2"
                    @click="updateItem()"
                  >
                    <div class="me-1">
                      <i class="fa-solid fa-plus"></i>
                    </div>
                    <span>Güncelle</span>
                  </div>
                  <div
                    v-if="
                      tableSettings.settings
                        ? tableSettings.settings.show.delete
                        : true
                    "
                    class="d-flex align-items-center cursor-pointer btn btn-success btn-sm p-2 m-1 ms-2"
                    @click="deleteConfirm"
                  >
                    <div class="me-1">
                      <i class="fa-solid fa-plus"></i>
                    </div>
                    <span> Sil </span>
                  </div>
                </template>
              </div>
              <div class="d-flex">
                <div
                  v-if="
                    tableSettings.settings
                      ? tableSettings.settings.show.add
                      : true
                  "
                  class="d-flex align-items-center cursor-pointer btn btn-success btn-sm p-2 m-1 ms-2"
                  @click="addItem()"
                >
                  <div class="me-1 d-flex">
                    <i class="fa-solid fa-plus"></i>
                  </div>
                  <span> Ekle </span>
                </div>
              </div>
            </div>
          </div>

          <div id="card_grid_content" class="rounded-2 shadow mt-5">
            <div>
              <div class="rounded-2">
                <div
                  class="ms-0 me-0 rounded-2"
                  style="/* width: calc(100% - 20px); */ height: auto"
                >
                  <div
                    :style="
                      grid.data.length == 0
                        ? 'padding:0px;  text-align:left;  height:calc(522px - 66px);  '
                        : '  text-align:left;   height:calc(527px - 66px); '
                    "
                  >
                    <div v-if="grid.data.length == 0" class="w-100 p-5">
                      <div
                        :colspan="grid.data.length + 1"
                        style="padding: 0px 0px !important"
                        class="w-100 bg-danger"
                      >
                        <div class="no-data" v-if="grid.empty == 0">
                          Filtreleme yapınız.
                        </div>
                        <div class="no-data" v-if="grid.empty == 1">
                          Sonuç bulunamadı.
                        </div>
                      </div>
                    </div>

                    <div
                      class="table-responsive"
                      style="cursor: grab; max-height: 462px !important"
                    >
                      <table
                        class="table table-striped table-sm cursor-pointer"
                      >
                        <thead
                          class="border-bottom-1 border-gray-500 bg-secondary mb-5"
                        >
                          <tr
                            class="py-5 text-gray-800 border-bottom border-gray-200"
                          >
                            <th
                              scope="col"
                              class="fw-bold"
                              v-for="(col, index) in bodyData"
                              :key="index"
                              :class="index == 0 ? 'ps-3' : ''"
                            >
                              {{ col?.label }}
                            </th>
                            <th
                              v-if="tableSettings.settings.detailBtn"
                              class="text-end pe-2"
                            >
                              Detail
                            </th>
                          </tr>
                        </thead>

                        <tbody class="mt-5">
                          <tr
                            v-for="(row, index) in grid.data"
                            :key="index"
                            @click="changeSelectedItem(row)"
                            @dblclick="changeDoubleSelectedItem(row)"
                            class="text-gray-800 border-bottom border-gray-400 table_body_row"
                            :class="
                              row.id == grid?.selectedItem?.id
                                ? ' selected '
                                : ''
                            "
                          >
                            <td
                              v-for="(body, index) in bodyData"
                              :key="index"
                              :class="index == 0 ? 'ps-2' : ''"
                            >
                              <template v-if="body.type == 'select'">{{
                                row[body.name] ? row[body.name][body.key] : "-"
                              }}</template>
                              <template v-else-if="body.type == 'time'">
                                <template v-if="body.timeType">
                                  {{
                                    convertToCustomFormat(row[body.name])[
                                      body.timeType
                                    ] || "-"
                                  }}
                                </template>
                                <!-- default type -->
                                <template v-else>
                                  {{
                                    convertToCustomFormat(row[body.name])
                                      .both || "-"
                                  }}
                                </template>
                              </template>
                              <template v-else> {{ row[body.name] }}</template>
                            </td>
                            <td
                              v-if="tableSettings.settings.detailBtn"
                              class="text-end pe-2"
                            >
                              <button
                                @click.stop="goToDetail(row)"
                                class="btn btn-sm btn-primary p-1 px-3"
                              >
                                Go
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            id="card_grid_pagination"
            v-if="grid.data.length > 0"
            class="mt-5"
          >
            <div class="d-flex align-items-center border-right">
              <div class="d-flex align-items-center">
                <button
                  class="btn btn-sm btn-circle btn-success p-2 m-2"
                  @click="changePage('first')"
                >
                  <a
                    class="round-div"
                    style="
                      align-items: center;
                      justify-content: center;
                      cursor: pointer;
                    "
                    ><i class="fa fa-angles-left"></i>
                  </a>
                </button>
                <button
                  class="btn btn-sm btn-circle btn-success p-2 m-2"
                  @click="changePage('prev')"
                >
                  <a
                    class="round-div"
                    style="
                      align-items: center;
                      justify-content: center;
                      cursor: pointer;
                    "
                    ><i class="fa fa-angle-left"></i>
                  </a>
                </button>
              </div>
              <div class="d-flex align-items-center">
                <label>Page</label>
                <input
                  @keyup.enter="enterKeyPressHandler"
                  style="max-width: 50px"
                  type="text"
                  class="ms-1"
                  v-model="grid.pagination.page"
                />
                <!-- :value="com?.pagination.page"-->
                <label>
                  of total:
                  {{ Math.ceil(grid.pagination.total / grid.pagination.limit) }}
                </label>
              </div>
              <div class="d-flex align-items-center">
                <button
                  class="btn btn-sm btn-circle btn-success p-2 m-2"
                  @click="changePage('next')"
                >
                  <a
                    class="round-div"
                    style="
                      align-items: center;
                      justify-content: center;
                      cursor: pointer;
                    "
                    ><i class="fa fa-angle-right"></i>
                  </a>
                </button>
                <button
                  class="btn btn-sm btn-circle btn-success p-2 m-2"
                  @click="changePage('last')"
                >
                  <a
                    class="round-div"
                    style="
                      align-items: center;
                      justify-content: center;
                      cursor: pointer;
                    "
                    ><i class="fa fa-angles-right"></i>
                  </a>
                </button>
              </div>
              <div class="d-flex align-items-center">
                <button
                  class="btn btn-sm btn-circle btn-success p-2 m-2"
                  @click="changePage('reload')"
                >
                  <a
                    style="
                      align-items: center;
                      justify-content: center;
                      cursor: pointer;
                    "
                    ><i class="fa fa-arrows-rotate"></i>
                  </a>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
tbody > tr.selected {
  border: dotted 2px rgb(97, 78, 78);
}

table input {
  width: 30px;
  height: 15px;
  padding: 3px 3px 3px 3px !important;
  outline: none;
  border-radius: 0px !important;
  border: 1px solid #fafafa;
  margin: 0px 5px 0px 0px;
  text-align: right;
  font-size: 12px;
}
.table_body_row:hover {
  background: #8591a3;
}
</style>
