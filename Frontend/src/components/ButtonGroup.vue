<template>
    <div class="flex justify-around p-4 mt-4 buttons-container">
      <Button icon="pi pi-times" severity="secondary" text raised rounded class="round-button" />
      <Button icon="pi pi-star" severity="info" text raised rounded />
      <Button icon="pi pi-thumbs-up" severity="success" text raised rounded />
      <Button icon="pi pi-heart" severity="danger" text raised rounded />
    </div>
</template>

<script>
import Button from 'primevue/button';

export default {
  name: "ButtonGroup",
  components: {
    Button,
  },
};
</script>

<style>

.round-button {
  width: 40px;
  height: 40px;
}

.buttons-container {
  width: 24rem;
}

</style>