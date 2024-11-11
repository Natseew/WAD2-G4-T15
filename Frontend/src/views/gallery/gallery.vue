<template>
    <div id="app" style="overflow:scroll">
      <Navbar class="navbar" />
      <PhotoGalleryPage class="mt-15 mb-15 z-2" />
      <div class="background"></div>
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

.background {
  background: linear-gradient(180deg, #ffa578, rgb(255, 128, 192), #a67bf5);
  background-size: 400% 400%;
  animation: spin-gradient 15s ease infinite;
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
}

@keyframes spin-gradient {
    0% {
        background-position: 0% 50%; /* Start from the left */
    }
    25% {
        background-position: 100% 50%; /* Move to the right */
    }
    50% {
        background-position: 100% 0%; /* Move to the top */
    }
    75% {
        background-position: 0% 0%; /* Move to the left */
    }
    100% {
        background-position: 0% 50%; /* Move back to the original position */
    }
}

</style>