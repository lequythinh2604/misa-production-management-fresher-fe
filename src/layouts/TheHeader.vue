<template>
  <!-- Navbar -->
  <div class="navbar flex justify-between">
    <!-- Navbar left -->
    <div class="navbar_left flex items-center pl-4">
      <div class="icon_menu icon-24 cursor-pointer"></div>
      <div class="logo-item flex">
        <div class="icon_logo icon-30 ml-4"></div>
        <div class="logo-text">Sản xuất</div>
      </div>
      <div class="cursor-pointer flex items-center ml-5">
        <div class="font-bold">COPENHAGEN DELIGHTS</div>
        <div class="icon_dropdown icon-16"></div>
      </div>
    </div>
    <!-- Navbar right -->
    <div class="navbar_right flex items-center">
      <div class="icon-nav-hover mr-3 cursor-pointer">
        <div class="icon_download-status icon-24"></div>
      </div>
      <div class="nav-separator"></div>
      <div class="icon-function-nav">
        <div class="icon_package icon-24"></div>
      </div>
      <div class="icon-function-nav icon-nav-hover">
        <div class="icon_invite-box icon-24"></div>
      </div>
      <div class="icon-function-nav"><div class="icon_bell icon-24"></div></div>
      <div class="icon-function-nav">
        <div class="icon_question-circle icon-24"></div>
      </div>
      <div class="icon-function-nav"><div class="icon_dots-circle-horizontal icon-24"></div></div>
      <div class="icon-function-nav icon-nav-hover">
        <div class="icon_knowledge-trigger icon-24"></div>
      </div>
      <div class="avatar-account-container">
        <img class="avatar-account" :src="avatarImg" alt="misa-avatar" loading="lazy" />
      </div>
    </div>
  </div>
</template>
<script setup>
import avatarImg from "@/assets/images/avatar-don-gian.jpg";
</script>
<style scoped>
/* Navbar */
.navbar {
  height: 48px;
  font-family: Inter;
  border-bottom: 1px solid #d1d5db;
  background: #fff;
}
.logo-item {
  width: 140px;
  cursor: pointer;
}
.navbar_left .logo-item .logo-text {
  font-size: 18px;
  margin-left: 12px;
  font-weight: 700;
  color: #262626;
  white-space: nowrap;
}
.navbar_right {
  padding-right: 16px;
}
.nav-separator {
  width: 1px;
  height: 16px;
  background: #d1d5db;
  align-self: center;
  border-radius: 1px;
}
.icon-function-nav {
  margin-left: 12px;
  cursor: pointer;
}
.icon-nav-hover {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}
.icon-nav-hover:hover {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
}
/* user menu account */
.avatar-account-container {
  border-radius: 50%;
  overflow: hidden;
  width: 32px;
  height: 32px;
  margin-left: 16px;
  cursor: pointer;
}
.avatar-account {
  width: 100%;
  height: 100%;
  max-width: 32px;
  max-height: 32px;
  object-fit: cover;
  /* aspect-ratio: 1 / 1; */
}
</style>
