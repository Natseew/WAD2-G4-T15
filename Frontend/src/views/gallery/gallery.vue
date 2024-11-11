<template>
    <div id="app" style="overflow:scroll">
      <Navbar class="navbar" />
      <PhotoGalleryPage class="mt-15 mb-15" />
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import PhotoGalleryPage from '../../components/photogallery.vue';
  import Navbar from '../../components/Navbar.vue';
  
  export default defineComponent({
    components: {
      PhotoGalleryPage,
      Navbar
    },
  });
  </script>

<style scoped>
.navbar {
  z-index: 10;
}
</style>