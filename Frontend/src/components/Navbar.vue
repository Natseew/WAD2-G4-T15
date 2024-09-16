<template>
  <div class="card flex-1">
  <Toolbar style="border-radius: 3rem; padding: 1rem 1rem 1rem 1.5rem">
      <template #start>
        <div class="flex items-center gap-2">
          <Button label="Home" text plain></Button>
          <Button label="Edit" text plain></Button>
          <Button label="View" text plain></Button>
        </div>
      </template>

      <template #end>
        <div class="flex items-center gap-2">
            <Avatar v-on:click="router.push('/profile')" image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" style="width: 32px; height: 32px" />
        </div>
      </template>  
  </Toolbar>
  </div>
</template>

<script setup>
  import Toolbar from 'primevue/toolbar';
  import Button from 'primevue/button';
  import Avatar from 'primevue/avatar';
  import { useRouter } from 'vue-router';
  const router = useRouter();
  
</script>

<style>

</style>