<template>
  <div class="sidebar_item">
    <div class="sidebar_item-link">
      <RouterLink v-slot="{ isExactActive }" :to="props.endpoint">
        <div
          class="sidebar_item-content flex justify-between relative"
          :class="{ active: isExactActive }"
          @click="toggleSubMenu"
          @mouseenter="handleOpenHorizontalMenu"
        >
          <div class="flex items-center justify-start gap-2">
            <div class="sidebar_item-icon ml-2">
              <div v-if="!props.isChild" :class="[props.iconName, 'icon-20', 'icon-hover']"></div>
              <div v-else :class="[props.iconName, 'icon-20', 'icon-hover']"></div>
            </div>
            <div class="sidebar_item-title truncate">{{ props.title }}</div>
          </div>
          <div
            v-if="props.children.length > 0"
            class="icon_dropdown-down icon-20 mr-2 icon-hover"
            :class="{ 'rotate-180': isOpen }"
          ></div>
          <div
            v-if="props.horizontalMenu.length > 0"
            class="icon_arrow-right icon-20 mr-2 icon-hover"
          ></div>
          <div
            v-if="props.horizontalMenu.length > 0 && isHorizontalMenuOpen"
            class="horizontal-sub-menu"
          >
            <HorizontalSubMenu
              :menuData="props.horizontalMenu"
              @mouseleave="handleCloseHorizontalMenu"
            />
          </div>
        </div>
      </RouterLink>
    </div>
    <div v-if="props.children.length > 0 && isCurrentlyOpen" class="sub-menu-list">
      <menu-item
        v-for="child in children"
        :key="child.endpoint"
        :iconName="child.iconName"
        :endpoint="child.endpoint"
        :title="child.title"
        :isChild="true"
      ></menu-item>
    </div>
  </div>
</template>
<script setup>
import { useMenuStore } from "@/stores/menuStore";
import { computed, ref } from "vue";
import { RouterLink } from "vue-router";
import HorizontalSubMenu from "./HorizontalSubMenu.vue";

const props = defineProps({
  endpoint: {
    type: String,
    default: "",
  },
  iconName: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "Menu Item",
  },
  children: {
    type: Array,
    default: () => [],
  },
  isChild: {
    type: Boolean,
    default: false,
  },
  horizontalMenu: {
    type: Array,
    default: () => [],
  },
});

const menuStore = useMenuStore();

/**
 * Xác định sub-menu đang mở hay đóng
 */
const isCurrentlyOpen = computed(() => {
  if (props.isChild) return false;
  return menuStore.openEndpoint === props.endpoint;
});

/**
 * Hàm để đóng/mở sub-menu
 * Created by ThinhLQ - 2/12/2025
 */
const toggleSubMenu = () => {
  if (props.children.length > 0) {
    menuStore.toggleOpenEndpoint(props.endpoint);
  }
};

/**
 * Xử lý mở menu ngang khi hover
 * Created by ThinhLQ - 2/12/2025
 */
const isHorizontalMenuOpen = ref(false);
const handleOpenHorizontalMenu = () => {
  isHorizontalMenuOpen.value = true;
};

/**
 * Xử lý đóng menu ngang khi hover
 * Created by ThinhLQ - 2/12/2025
 */
const handleCloseHorizontalMenu = () => {
  isHorizontalMenuOpen.value = false;
};
</script>
<style scoped>
/* -- Sidebar item -- */
.sidebar .sidebar_item {
  font-weight: 500;
  /* height: 40px; */
}
.sidebar .sidebar_item .sidebar_item-content {
  color: #9ca3af;
  border-radius: 4px;
  padding: 9px 0;
}
.sidebar .sidebar_item .sidebar_item-content:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}
.sidebar .sidebar_item .sidebar_item-content:hover .icon-hover {
  background-color: #ffffff;
}
.sidebar .sidebar_item .sidebar_item-content.active {
  background-color: #009b71;
  color: #ffffff;
}
.sidebar .sidebar_item .sidebar_item-content.active .icon-hover {
  background-color: #ffffff;
}
.sidebar_item-title {
  max-width: 150px;
}
.sidebar-collapse .sidebar .sidebar_item-content {
  height: 36px;
}
.sidebar-collapse .sidebar .sidebar_item-content .sidebar_item-icon {
  margin-right: 12px;
}
/* sub-menu */
.sidebar .sub-menu-list {
  transition: all 0.3s ease-in-out;
}
.horizontal-sub-menu {
  position: fixed;
  left: 234px;
  background-color: #111827;
  margin-left: 4px;
  padding: 8px;
  border-radius: 4px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}
.sidebar-collapse .sidebar .horizontal-sub-menu {
  left: 60px;
}
</style>
