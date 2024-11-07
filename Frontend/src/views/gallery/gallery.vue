<template>
    <div id="app">
      <PhotoGalleryPage />
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import PhotoGalleryPage from '../../components/photogallery.vue';
  
  export default defineComponent({
    components: {
      PhotoGalleryPage,
    },
  });
  </script>