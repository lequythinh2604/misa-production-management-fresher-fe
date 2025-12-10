<template>
  <div class="horizontal-menu-container flex gap-1">
    <div v-for="group in menuData" :key="group.group" class="menu-column flex flex-col gap-2">
      <div class="menu-group-title px-8">{{ group.group }}</div>
      <RouterLink
        v-for="item in group.items"
        :key="item.endpoint"
        :to="item.endpoint"
        v-slot="{ isExactActive }"
      >
        <div class="menu-item-link pl-1 pr-8" :class="{ active: isExactActive }">
          <div class="menu-item-content flex gap-2">
            <div class="icon_arrow-down-right icon-20 icon-hover"></div>
            <span>{{ item.title }}</span>
          </div>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from "vue-router";

defineProps({
  menuData: {
    type: Array,
    required: true,
  },
});
</script>

<style scoped>
.menu-group-title {
  color: #4b5563;
  align-content: center;
}
.menu-group-title,
.menu-item-link {
  height: 32px;
  font-weight: 500;
  align-content: center;
  border-radius: 4px;
}
.menu-item-content {
  color: #9ca3af;
}
.horizontal-menu-container .menu-item-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
.horizontal-menu-container .menu-item-link:hover .menu-item-content {
  color: #ffffff;
}
.horizontal-menu-container .menu-item-link:hover .icon-hover {
  background-color: #fff;
}
.horizontal-menu-container .menu-item-link.active {
  background-color: rgba(255, 255, 255, 0.25);
}
.horizontal-menu-container .menu-item-link.active .menu-item-content {
  color: #ffffff;
}
.horizontal-menu-container .menu-item-link.active .icon-hover {
  background-color: #fff;
}
</style>
