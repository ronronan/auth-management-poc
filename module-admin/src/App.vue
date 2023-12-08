<template>
  <header>
    <h1>Module admin</h1>
  </header>

  <main>{{ userInfo }}</main>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);
</script>

<style scoped></style>
