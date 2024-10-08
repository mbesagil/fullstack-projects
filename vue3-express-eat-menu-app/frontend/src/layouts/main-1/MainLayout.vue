<script setup>
import { useThemeStore } from "@/stores/themeStore";
import { onMounted } from "vue";

const themeStore = useThemeStore();

onMounted(() => {
  console.log("testttttttt");
  KTComponents.init();
  KTThemeMode.init();
});
</script>

<template>
  <div class="d-flex flex-column flex-root app-root" id="kt_app_root">
    <!--begin::Page-->
    <div class="app-page flex-column flex-column-fluid" id="kt_app_page">
      <div
        id="kt_app_header"
        class="app-header"
        data-kt-sticky="true"
        data-kt-sticky-activate-="true"
        data-kt-sticky-name="app-header-sticky"
        data-kt-sticky-offset="{default: '200px', lg: '300px'}"
        style="animation-duration: 0.3s; top: 0px"
        data-kt-sticky-enabled="true"
      >
        <!--begin::Header container-->
        <div
          class="app-container container-xxl d-flex align-items-stretch justify-content-between"
          id="kt_app_header_container"
        >
          <!--begin::Header wrapper-->
          <div
            class="app-header-wrapper d-flex flex-grow-1 align-items-stretch justify-content-between"
            id="kt_app_header_wrapper"
          >
            <!--begin::Menu wrapper-->

            <!--end::Menu wrapper-->
            <!--begin::Logo wrapper-->
            <div class="d-flex align-items-center">
              <!--begin::Logo wrapper-->
              <div
                class="btn btn-icon btn-color-gray-600 btn-active-color-primary ms-n3 me-2 d-flex d-lg-none"
                id="kt_app_sidebar_toggle"
              >
                <i class="ki-outline ki-abstract-14 fs-2"></i>
              </div>
              <!--end::Logo wrapper-->
              <!--begin::Logo image-->
              <a href="index.html" class="d-flex d-lg-none">
                <img
                  alt="Logo"
                  src="/public/assets/media/icons/eat/eat_app_icon.png"
                  class="h-20px"
                />
              </a>
              <!--end::Logo image-->
            </div>
            <!--end::Logo wrapper-->
            <!--begin::Navbar-->
            <div class="app-navbar flex-shrink-0">
              <!--begin::Chat-->
              <div class="app-navbar-item ms-1 ms-lg-3">
                <!--begin::Menu wrapper-->
                <div>
                  <button
                    class="btn btn-icon-gray-500"
                    v-if="themeStore.mode == 'light'"
                    @click="themeStore.setMode('dark')"
                  >
                    <i class="fa fa-sun fs-4"></i>
                  </button>

                  <button
                    class="btn btn-icon-gray-500"
                    v-else
                    @click="themeStore.setMode('light')"
                  >
                    <i class="fa fa-moon fs-4"></i>
                  </button>
                </div>
                <!--end::Menu wrapper-->
              </div>
              <!--end::Chat-->
              <!--begin::Header menu mobile toggle-->
              <!-- <div
                class="app-navbar-item d-lg-none ms-2 me-n4"
                title="Show header menu"
              >
                <div
                  class="btn btn-icon btn-color-gray-600 btn-active-color-primary"
                  id="kt_app_header_menu_toggle"
                >
                  <i class="ki-outline ki-text-align-left fs-2 fw-bold"></i>
                </div>
              </div> -->
              <!--end::Header menu mobile toggle-->
            </div>
            <!--end::Navbar-->
          </div>
          <!--end::Header wrapper-->
        </div>
        <!--end::Header container-->
      </div>
      <!--begin::Wrapper-->
      <div class="app-wrapper flex-column flex-row-fluid" id="kt_app_wrapper">
        <!--begin::Sidebar-->
        <div
          id="kt_app_sidebar"
          class="app-sidebar flex-column"
          data-kt-drawer="true"
          data-kt-drawer-name="app-sidebar"
          data-kt-drawer-activate="{default: true, lg: false}"
          data-kt-drawer-overlay="true"
          data-kt-drawer-width="275px"
          data-kt-drawer-direction="start"
          data-kt-drawer-toggle="#kt_app_sidebar_toggle"
        >
          <!--begin::Logo-->
          <div
            class="d-flex flex-stack px-4 px-lg-6 py-3 py-lg-8"
            id="kt_app_sidebar_logo"
          >
            <!--begin::Logo image-->
            <a href="index.html">
              <img
                alt="Logo"
                src="/public/assets/media/icons/eat/eat_app_icon.png"
                class="h-30px"
              />
            </a>
            <!--end::Logo image-->
            <!--begin::User menu-->
            <div class="ms-3">
              <!--begin::Menu wrapper-->
              <div
                class="cursor-pointer position-relative symbol symbol-circle symbol-40px"
                data-kt-menu-trigger="{default: 'click', lg: 'hover'}"
                data-kt-menu-attach="parent"
                data-kt-menu-placement="bottom-end"
              >
                <img src="assets/media/avatars/300-2.jpg" alt="user" />
                <div
                  class="position-absolute rounded-circle bg-success start-100 top-100 h-8px w-8px ms-n3 mt-n3"
                ></div>
              </div>
              <!--begin::User account menu-->
              <div
                class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg menu-state-color fw-semibold py-4 fs-6 w-275px"
                data-kt-menu="true"
              >
                <!--begin::Menu item-->
                <div class="menu-item px-3">
                  <div class="menu-content d-flex align-items-center px-3">
                    <!--begin::Avatar-->
                    <div class="symbol symbol-50px me-5">
                      <img alt="Logo" src="assets/media/avatars/300-2.jpg" />
                    </div>
                    <!--end::Avatar-->
                    <!--begin::Username-->
                    <div class="d-flex flex-column">
                      <div class="fw-bold d-flex align-items-center fs-5">
                        Max Smith
                        <span
                          class="badge badge-light-success fw-bold fs-8 px-2 py-1 ms-2"
                          >Pro</span
                        >
                      </div>
                      <a
                        href="#"
                        class="fw-semibold text-muted text-hover-primary fs-7"
                        >max@kt.com</a
                      >
                    </div>
                    <!--end::Username-->
                  </div>
                </div>
                <!--end::Menu item-->
                <!--begin::Menu separator-->
                <div class="separator my-2"></div>
                <!--end::Menu separator-->
                <!--begin::Menu item-->
                <div class="menu-item px-5">
                  <a href="account/overview.html" class="menu-link px-5"
                    >My Profile</a
                  >
                </div>
                <!--end::Menu item-->
                <!--begin::Menu item-->
                <div class="menu-item px-5">
                  <a href="apps/projects/list.html" class="menu-link px-5">
                    <span class="menu-text">My Projects</span>
                    <span class="menu-badge">
                      <span
                        class="badge badge-light-danger badge-circle fw-bold fs-7"
                        >3</span
                      >
                    </span>
                  </a>
                </div>
                <!--end::Menu item-->
                <!--begin::Menu item-->
                <div
                  class="menu-item px-5"
                  data-kt-menu-trigger="{default: 'click', lg: 'hover'}"
                  data-kt-menu-placement="left-start"
                  data-kt-menu-offset="-15px, 0"
                >
                  <a href="#" class="menu-link px-5">
                    <span class="menu-title">My Subscription</span>
                    <span class="menu-arrow"></span>
                  </a>
                  <!--begin::Menu sub-->
                  <div class="menu-sub menu-sub-dropdown w-175px py-4">
                    <!--begin::Menu item-->
                    <div class="menu-item px-3">
                      <a href="account/referrals.html" class="menu-link px-5"
                        >Referrals</a
                      >
                    </div>
                    <!--end::Menu item-->
                    <!--begin::Menu item-->
                    <div class="menu-item px-3">
                      <a href="account/billing.html" class="menu-link px-5"
                        >Billing</a
                      >
                    </div>
                    <!--end::Menu item-->
                    <!--begin::Menu item-->
                    <div class="menu-item px-3">
                      <a href="account/statements.html" class="menu-link px-5"
                        >Payments</a
                      >
                    </div>
                    <!--end::Menu item-->
                    <!--begin::Menu item-->
                    <div class="menu-item px-3">
                      <a
                        href="account/statements.html"
                        class="menu-link d-flex flex-stack px-5"
                        >Statements
                        <span
                          class="ms-2 lh-0"
                          data-bs-toggle="tooltip"
                          aria-label="View your statements"
                          data-bs-original-title="View your statements"
                          data-kt-initialized="1"
                        >
                          <i
                            class="ki-outline ki-information-5 fs-5"
                          ></i> </span
                      ></a>
                    </div>
                    <!--end::Menu item-->
                    <!--begin::Menu separator-->
                    <div class="separator my-2"></div>
                    <!--end::Menu separator-->
                    <!--begin::Menu item-->
                    <div class="menu-item px-3">
                      <div class="menu-content px-3">
                        <label
                          class="form-check form-switch form-check-custom form-check-solid"
                        >
                          <input
                            class="form-check-input w-30px h-20px"
                            type="checkbox"
                            value="1"
                            checked="checked"
                            name="notifications"
                          />
                          <span class="form-check-label text-muted fs-7"
                            >Notifications</span
                          >
                        </label>
                      </div>
                    </div>
                    <!--end::Menu item-->
                  </div>
                  <!--end::Menu sub-->
                </div>
                <!--end::Menu item-->
                <!--begin::Menu item-->
                <div class="menu-item px-5">
                  <a href="account/statements.html" class="menu-link px-5"
                    >My Statements</a
                  >
                </div>
                <!--end::Menu item-->
                <!--begin::Menu separator-->
                <div class="separator my-2"></div>
                <!--end::Menu separator-->
                <!--begin::Menu item-->
                <div
                  class="menu-item px-5"
                  data-kt-menu-trigger="{default: 'click', lg: 'hover'}"
                  data-kt-menu-placement="left-start"
                  data-kt-menu-offset="-15px, 0"
                >
                  <a href="#" class="menu-link px-5">
                    <span class="menu-title position-relative"
                      >Mode
                      <span
                        class="ms-5 position-absolute translate-middle-y top-50 end-0"
                      >
                        <i
                          class="ki-outline ki-night-day theme-light-show fs-2"
                        ></i>
                        <i
                          class="ki-outline ki-moon theme-dark-show fs-2"
                        ></i> </span
                    ></span>
                  </a>
                  <!--begin::Menu-->
                  <div
                    class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-title-gray-700 menu-icon-gray-500 menu-active-bg menu-state-color fw-semibold py-4 fs-base w-150px"
                    data-kt-menu="true"
                    data-kt-element="theme-mode-menu"
                  >
                    <!--begin::Menu item-->
                    <div class="menu-item px-3 my-0">
                      <!-- data-kt-value="light"
                        data-kt-element="mode"
                      href="#"
                    -->
                      <a
                        class="menu-link px-3 py-2"
                        :class="themeStore.mode == 'light' ? 'active' : ''"
                        @click="themeStore.setMode('light')"
                      >
                        <span class="menu-icon" data-kt-element="icon">
                          <i class="ki-outline ki-night-day fs-2"></i>
                        </span>
                        <span class="menu-title">Light</span>
                      </a>
                    </div>
                    <!--end::Menu item-->
                    <!--begin::Menu item-->
                    <div class="menu-item px-3 my-0">
                      <!-- data-kt-value="dark"
                      href="#"
                      data-kt-element="mode"
                    -->
                      <a
                        class="menu-link px-3 py-2"
                        :class="themeStore.mode == 'dark' ? 'active' : ''"
                        @click="themeStore.setMode('dark')"
                      >
                        <span class="menu-icon" data-kt-element="icon">
                          <i class="ki-outline ki-moon fs-2"></i>
                        </span>
                        <span class="menu-title">Dark</span>
                      </a>
                    </div>
                    <!--end::Menu item-->
                    <!--begin::Menu item-->
                    <div class="menu-item px-3 my-0">
                      <a
                        href="#"
                        class="menu-link px-3 py-2"
                        data-kt-element="mode"
                        data-kt-value="system"
                      >
                        <span class="menu-icon" data-kt-element="icon">
                          <i class="ki-outline ki-screen fs-2"></i>
                        </span>
                        <span class="menu-title">System</span>
                      </a>
                    </div>
                    <!--end::Menu item-->
                  </div>
                  <!--end::Menu-->
                </div>
                <!--end::Menu item-->
                <!--begin::Menu item-->
                <div
                  class="menu-item px-5"
                  data-kt-menu-trigger="{default: 'click', lg: 'hover'}"
                  data-kt-menu-placement="left-start"
                  data-kt-menu-offset="-15px, 0"
                >
                  <a href="#" class="menu-link px-5">
                    <span class="menu-title position-relative"
                      >Language
                      <span
                        class="fs-8 rounded bg-light px-3 py-2 position-absolute translate-middle-y top-50 end-0"
                        >English
                        <img
                          class="w-15px h-15px rounded-1 ms-2"
                          src="assets/media/flags/united-states.svg"
                          alt="" /></span
                    ></span>
                  </a>
                  <!--begin::Menu sub-->
                  <div class="menu-sub menu-sub-dropdown w-175px py-4">
                    <!--begin::Menu item-->
                    <div class="menu-item px-3">
                      <a
                        href="account/settings.html"
                        class="menu-link d-flex px-5 active"
                      >
                        <span class="symbol symbol-20px me-4">
                          <img
                            class="rounded-1"
                            src="assets/media/flags/united-states.svg"
                            alt=""
                          /> </span
                        >English</a
                      >
                    </div>
                    <!--end::Menu item-->
                    <!--begin::Menu item-->
                    <div class="menu-item px-3">
                      <a
                        href="account/settings.html"
                        class="menu-link d-flex px-5"
                      >
                        <span class="symbol symbol-20px me-4">
                          <img
                            class="rounded-1"
                            src="assets/media/flags/spain.svg"
                            alt=""
                          /> </span
                        >Spanish</a
                      >
                    </div>
                    <!--end::Menu item-->
                    <!--begin::Menu item-->
                    <div class="menu-item px-3">
                      <a
                        href="account/settings.html"
                        class="menu-link d-flex px-5"
                      >
                        <span class="symbol symbol-20px me-4">
                          <img
                            class="rounded-1"
                            src="assets/media/flags/germany.svg"
                            alt=""
                          /> </span
                        >German</a
                      >
                    </div>
                    <!--end::Menu item-->
                    <!--begin::Menu item-->
                    <div class="menu-item px-3">
                      <a
                        href="account/settings.html"
                        class="menu-link d-flex px-5"
                      >
                        <span class="symbol symbol-20px me-4">
                          <img
                            class="rounded-1"
                            src="assets/media/flags/japan.svg"
                            alt=""
                          /> </span
                        >Japanese</a
                      >
                    </div>
                    <!--end::Menu item-->
                    <!--begin::Menu item-->
                    <div class="menu-item px-3">
                      <a
                        href="account/settings.html"
                        class="menu-link d-flex px-5"
                      >
                        <span class="symbol symbol-20px me-4">
                          <img
                            class="rounded-1"
                            src="assets/media/flags/france.svg"
                            alt=""
                          /> </span
                        >French</a
                      >
                    </div>
                    <!--end::Menu item-->
                  </div>
                  <!--end::Menu sub-->
                </div>
                <!--end::Menu item-->
                <!--begin::Menu item-->
                <div class="menu-item px-5 my-1">
                  <a href="account/settings.html" class="menu-link px-5"
                    >Account Settings</a
                  >
                </div>
                <!--end::Menu item-->
                <!--begin::Menu item-->
                <div class="menu-item px-5">
                  <a
                    href="authentication/layouts/corporate/sign-in.html"
                    class="menu-link px-5"
                    >Sign Out</a
                  >
                </div>
                <!--end::Menu item-->
              </div>
              <!--end::User account menu-->
              <!--end::Menu wrapper-->
            </div>
            <!--end::User menu-->
          </div>
          <!--end::Logo-->
          <!--begin::Sidebar nav-->
          <div
            class="flex-column-fluid px-4 px-lg-8 py-4"
            id="kt_app_sidebar_nav"
          >
            <!--begin::Nav wrapper-->
            <div
              id="kt_app_sidebar_nav_wrapper"
              class="d-flex flex-column hover-scroll-y pe-4 me-n4"
              data-kt-scroll="true"
              data-kt-scroll-activate="true"
              data-kt-scroll-height="auto"
              data-kt-scroll-dependencies="#kt_app_sidebar_logo, #kt_app_sidebar_footer"
              data-kt-scroll-wrappers="#kt_app_sidebar, #kt_app_sidebar_nav"
              data-kt-scroll-offset="5px"
              style="height: 516px"
            >
              <!--begin::Stats-->
              <div class="d-flex mb-3 mb-lg-6">
                <!--begin::Stat-->
                <div
                  class="border border-gray-300 border-dashed rounded min-w-100px w-100 py-2 px-4 me-6"
                >
                  <!--begin::Date-->
                  <span class="fs-6 text-gray-500 fw-bold">Category</span>
                  <!--end::Date-->
                  <!--begin::Label-->
                  <div class="fs-2 fw-bold text-success">10</div>
                  <!--end::Label-->
                </div>
                <!--end::Stat-->
                <!--begin::Stat-->
                <div
                  class="border border-gray-300 border-dashed rounded min-w-100px w-100 py-2 px-4"
                >
                  <!--begin::Date-->
                  <span class="fs-6 text-gray-500 fw-bold">Product</span>
                  <!--end::Date-->
                  <!--begin::Label-->
                  <div class="fs-2 fw-bold text-danger">20</div>
                  <!--end::Label-->
                </div>
                <!--end::Stat-->
              </div>
              <!--end::Stats-->
              <!--begin::Links-->
              <div class="mb-6">
                <!--begin::Title-->
                <h3 class="text-gray-800 fw-bold mb-8">Menu</h3>
                <!--end::Title-->
                <!--begin::Row-->
                <div
                  class="row row-cols-3"
                  data-kt-buttons="true"
                  data-kt-buttons-target="[data-kt-button]"
                  data-kt-initialized="1"
                >
                  <!--begin::Col-->
                  <div class="col mb-4">
                    <!--begin::Link-->
                    <router-link
                      active-class="active"
                      to="/company"
                      class="btn btn-icon btn-outline btn-bg-light btn-active-light-primary btn-flex flex-column flex-center w-lg-90px h-lg-90px w-70px h-70px border-gray-200"
                      data-kt-button="true"
                    >
                      <!--begin::Icon-->
                      <span class="mb-2">
                        <i class="ki-outline ki-abstract-28 fs-1"></i>
                      </span>
                      <!--end::Icon-->
                      <!--begin::Label-->
                      <span class="fs-7 fw-bold">Company</span>
                      <!--end::Label-->
                    </router-link>
                    <!--end::Link-->
                  </div>
                  <!--end::Col-->
                  <!--begin::Col-->
                  <div class="col mb-4">
                    <!--begin::Link-->
                    <router-link
                      to="/category"
                      active-class="active"
                      class="btn btn-icon btn-outline btn-bg-light btn-active-light-primary btn-flex flex-column flex-center w-lg-90px h-lg-90px w-70px h-70px border-gray-200"
                      data-kt-button="true"
                    >
                      <!--begin::Icon-->
                      <span class="mb-2">
                        <i class="ki-outline ki-abstract-28 fs-1"></i>
                      </span>
                      <!--end::Icon-->
                      <!--begin::Label-->
                      <span class="fs-7 fw-bold">Category</span>
                      <!--end::Label-->
                    </router-link>
                    <!--end::Link-->
                  </div>
                  <!--end::Col-->
                  <!--begin::Col-->
                  <div class="col mb-4">
                    <!--begin::Link-->
                    <router-link
                      to="/product"
                      active-class="active"
                      class="btn btn-icon btn-outline btn-bg-light btn-active-light-primary btn-flex flex-column flex-center w-lg-90px h-lg-90px w-70px h-70px border-gray-200"
                      data-kt-button="true"
                    >
                      <!--begin::Icon-->
                      <span class="mb-2">
                        <i class="ki-outline ki-abstract-28 fs-1"></i>
                      </span>
                      <!--end::Icon-->
                      <!--begin::Label-->
                      <span class="fs-7 fw-bold">Product</span>
                      <!--end::Label-->
                    </router-link>
                    <!--end::Link-->
                  </div>
                  <!--end::Col-->
                </div>
                <!--end::Row-->
              </div>
              <!--end::Links-->
            </div>
            <!--end::Nav wrapper-->
          </div>
          <!--end::Sidebar nav-->
          <!--begin::Footer-->
          <div
            class="flex-column-auto d-flex flex-center px-4 px-lg-8 py-3 py-lg-8"
            id="kt_app_sidebar_footer"
          >
            <!--begin::Quick links-->
            <div class="app-footer-item me-6">
              <!--begin::Menu- wrapper-->
              <div
                class="btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px w-md-40px h-md-40px"
                data-kt-menu-trigger="{default: 'click', lg: 'hover'}"
                data-kt-menu-attach="parent"
                data-kt-menu-placement="bottom-start"
              >
                <i class="ki-outline ki-notification-status fs-2"></i>
              </div>
              <!--begin::Menu-->
              <div
                class="menu menu-sub menu-sub-dropdown menu-column w-250px w-lg-325px"
                data-kt-menu="true"
              >
                <!--begin::Heading-->
                <div
                  class="d-flex flex-column flex-center bgi-no-repeat rounded-top px-9 py-10"
                  style="
                    background-image: url('assets/media/misc/menu-header-bg.jpg');
                  "
                >
                  <!--begin::Title-->
                  <h3 class="text-white fw-semibold mb-3">Quick Links</h3>
                  <!--end::Title-->
                  <!--begin::Status-->
                  <span class="badge bg-primary text-inverse-primary py-2 px-3"
                    >25 pending tasks</span
                  >
                  <!--end::Status-->
                </div>
                <!--end::Heading-->
                <!--begin::View more-->
                <div class="py-2 text-center border-top">
                  <a
                    href="pages/user-profile/activity.html"
                    class="btn btn-color-gray-600 btn-active-color-primary"
                    >View All <i class="ki-outline ki-arrow-right fs-5"></i
                  ></a>
                </div>
                <!--end::View more-->
              </div>
              <!--end::Menu-->
              <!--end::Menu wrapper-->
            </div>
            <!--end::Quick links-->
          </div>
          <!--end::Footer-->
        </div>
        <!--end::Sidebar-->
        <!--begin::Main-->
        <div class="app-main flex-column flex-row-fluid" id="kt_app_main">
          <!--begin::Content wrapper-->
          <div class="d-flex flex-column flex-column-fluid">
            <!--begin::Content-->
            <div id="kt_app_content" class="app-content flex-column-fluid">
              <!--begin::Content container-->
              <div
                id="kt_app_content_container"
                class="app-container container-xxl"
              >
                <router-view></router-view>
              </div>
              <!--end::Content container-->
            </div>
            <!--end::Content-->
          </div>
          <!--end::Content wrapper-->
          <!--begin::Footer-->
          <div id="kt_app_footer" class="app-footer">
            <!--begin::Footer container-->
            <div
              class="app-container container-xxl d-flex flex-column flex-md-row flex-center flex-md-stack py-3"
            >
              <!--begin::Copyright-->
              <div class="text-gray-900 order-2 order-md-1">
                <span class="text-muted fw-semibold me-1">{{new Date().getFullYear()}}©</span>
                <a
                  class="text-gray-800 text-hover-primary"
                  >EatFast</a
                >
              </div>
              <!--end::Copyright-->

            </div>
            <!--end::Footer container-->
          </div>
          <!--end::Footer-->
        </div>
        <!--end:::Main-->
      </div>
      <!--end::Wrapper-->
    </div>
    <!--end::Page-->
  </div>
</template>
