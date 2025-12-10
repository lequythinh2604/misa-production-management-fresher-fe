<template>
  <!-- Container -->
  <div class="app-container">
    <!-- Header -->
    <the-header />
    <!-- Content -->
    <div class="content flex-1 flex" :class="{ 'sidebar-collapse': isSidebarCollapse }">
      <!-- Sidebar -->
      <the-sidebar @addCollapseClass="handleAddCollapseClass" />
      <!-- Main content -->
      <div class="flex-1 page-padding min-w-0 min-w-186">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import TheHeader from "@/layouts/TheHeader.vue";
import TheSidebar from "./layouts/TheSidebar.vue";
import { ref } from "vue";

const isSidebarCollapse = ref(false);
/**
 * Handle add collapse class
 * Created by
 */
function handleAddCollapseClass() {
  isSidebarCollapse.value = !isSidebarCollapse.value;
}
</script>

<style scoped>
/* --- Container --- */
.app-container {
  height: 100vh;
  width: 100%;
  position: fixed;
  display: flex;
  flex-direction: column;
}
/* --- Content --- */
.content {
  flex: 1;
  height: calc(100% - 48px);
  background: #e5e7eb;
}
.page-padding {
  padding: 16px 20px 20px;
}
</style>
