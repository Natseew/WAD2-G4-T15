<template>
  <div class="card-wrapper">
    <Card class="extended-border-card" style="width: 24rem; height: 40rem; overflow: hidden">
      <template #header>
        <div class="flex items-center p-4 w-full">
          <div class="w-16 h-16 rounded-full overflow-hidden mr-4">
            <img alt="user avatar" src="https://primefaces.org/cdn/primevue/images/usercard.png" class="w-full h-full object-cover" />
          </div>
          <div class="flex flex-col justify-center">
            <div class="font-bold text-lg">Meet Natalie</div>
            <div class="text-sm">
              <Chip label="Looking for love" style="height: 1rem; background-color: pink; color: red;" />
            </div>
            <div class="text-sm">
              <Chip label="Looking for friends" style="height: 1rem; background-color: lightgreen;" />
            </div>
          </div>
        </div>
      </template>

      <template #content>
        <p class="m-4 text-left">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!
        </p>
      </template>

      <template #footer>
        <div class="flex flex-col gap-2 p-4 text-left">
          <div class="flex flex-col">
            <Chip label="My personality in 5 words" class="desc_chip" />
            <p class="text-sm text-left">Description for chip 1.</p>
          </div>
          <div class="flex flex-col">
            <Chip label="I love" class="desc_chip" />
            <p class="text-sm text-left">Description for chip 2.</p>
          </div>
          <div class="flex flex-col">
            <Chip label="I hate" class="desc_chip" />
            <p class="text-sm text-left">Description for chip 3.</p>
          </div>
        </div>
      </template>
    </Card>

    <div class="flex justify-around p-4 mt-4 buttons-container">
      <Button icon="pi pi-times" severity="secondary" text raised rounded class="round-button" />
      <Button icon="pi pi-star" severity="info" text raised rounded />
      <Button icon="pi pi-thumbs-up" severity="success" text raised rounded />
      <Button icon="pi pi-heart" severity="danger" text raised rounded />
    </div>
  </div>
</template>

<script>
import Button from 'primevue/button';
import Card from 'primevue/card';
import Chip from 'primevue/chip';

export default {
  name: "MatchCard",
  components: {
    Button,
    Card,
    Chip,
  },
};
</script>

<style scoped>
.card-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 15rem;
}

.extended-border-card {
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1),
              0 0 0 8px rgba(255, 255, 255, 0.3);
  border-radius: 8px;
}

.round-button {
  width: 40px;
  height: 40px;
}

.p-button-white {
  background-color: white;
  color: black;
}

.buttons-container {
  width: 24rem;
}

.desc_chip {
  color: red;
  height: 2rem;
}
</style>
