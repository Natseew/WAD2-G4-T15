<template>
  <div class="card flex-1">
    <Toolbar class="custom-toolbar">
      <template #start>
        <div class="flex items-center gap-2">
          <span class="nav-link" @click="navigateTo('')">Home</span>
          <span class="nav-link" @click="navigateTo('Profile')">Profile</span>
          <span class="nav-link" @click="navigateTo('view')">View</span>
        </div>
      </template>

      <template #end>
        <div class="flex items-center gap-2">
          <Avatar 
            v-on:click="router.push('/profile')" 
            image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" 
            style="width: 32px; height: 32px" 
          />
        </div>
      </template>
    </Toolbar>
  </div>
</template>

<script setup>
import Toolbar from 'primevue/toolbar';
import Avatar from 'primevue/avatar';
import { useRouter } from 'vue-router';
const router = useRouter();

const navigateTo = (route) => {
  router.push(`/${route}`);
};
</script>

<style scoped>
.custom-toolbar {
  border: none;
  background: transparent;
}

.nav-link {
  cursor: pointer;
  padding: 0.5rem 1rem;
  position: relative;
  text-align: center;
  color: white;
}

.nav-link:hover::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background-color: white;
  transition: width 0.3s ease;
}
</style>
