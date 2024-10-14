<template>
  <div class="card-wrapper mb-4 w-full md:w-auto">
    <div class="flip-container" :class="{ flipped: isFlipped, [swipeClass]: swipeClass }" ref="flipContainer">
      <!-- Front of the card -->
      <Card class="extended-border-card w-full card-front">
        <template #title>
          <div class="flex items-center justify-between p-4 w-full">
            <div class="flex items-center">
              <div class="flex flex-col justify-center">
                <div class="font-bold text-2xl">{{ name }}</div>
                <div class="text-sm">
                  <Chip label="Looking for love" style="height: 1.2rem; background-color: pink; color: red;" />
                </div>
                <div class="text-sm">
                  <Chip label="Looking for friends" style="height: 1.2rem; background-color: lightgreen;" />
                </div>
              </div>
            </div>
            <i 
              class="pi pi-images flip-icon cursor-pointer" 
              @click="flipCard" 
              aria-hidden="true" 
            />
          </div>
        </template>

        <template #subtitle>
          <p class="m-4 text-left">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!
          </p>
        </template>

        <template #content>
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

      <!-- Back of the card -->
      <Card class="extended-border-card w-full card-back">
        <template #title>
          <div class="flex justify-between p-4">
            <div class="flex items-center">
              <div class="w-16 h-16 rounded-full overflow-hidden mr-4">
                <img alt="user avatar" :src="avatar" class="w-full h-full object-cover" />
              </div>
            </div>
            <i 
              class="pi pi-images flip-icon cursor-pointer" 
              @click="flipCard" 
              aria-hidden="true" 
            />
          </div>
        </template>

        <template #content>
          <div class="carousel-container">
            <Carousel :value="images" :numVisible="1" :numScroll="1">
              <template #item="{ item }">
                <img 
                  :src="item" 
                  class="carousel-image" 
                  @error="imageLoadError(item)" 
                  alt="User Image" 
                />
              </template>
            </Carousel>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>

<script>
import { ref, defineExpose } from 'vue';
import Card from 'primevue/card';
import Chip from 'primevue/chip';
import Carousel from 'primevue/carousel';

export default {
  name: "MatchCard",
  components: {
    Card,
    Chip,
    Carousel,
  },
  props: {
    name: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      required: false,
      default: 'https://primefaces.org/cdn/primevue/images/usercard.png'
    },
    images: {
      type: Array,
      required: false,
      default: () => ([
        'https://primefaces.org/cdn/primevue/images/usercard.png',
        'https://primefaces.org/cdn/primevue/images/usercard.png',
        'https://primefaces.org/cdn/primevue/images/usercard.png',
      ])
    },
  },
  setup(props, { emit }) {
    const isFlipped = ref(false);
    const swipeClass = ref('');
    const flipContainer = ref(null);

    const flipCard = () => {
      isFlipped.value = !isFlipped.value;
    };

    const swipeRight = () => {
      swipeClass.value = 'swipe-right';
      setTimeout(() => {
        emit('swipe-right');
        swipeClass.value = '';
      }, 300)
    };

    const swipeLeft = () => {
      swipeClass.value = 'swipe-left';
      setTimeout(() => {
        emit('swipe-left');
        swipeClass.value = '';
      }, 300)
    };

    defineExpose({
      swipeRight,
      swipeLeft,
    });

    const imageLoadError = (item) => {
      console.error('Failed to load image:', item);
    };

    return {
      isFlipped,
      flipCard,
      swipeRight,
      swipeLeft,
      swipeClass,
      flipContainer,
      imageLoadError,
    };
  },
};
</script>

<style scoped>
.card-wrapper {
  perspective: 1000px;
  height: 40rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.flip-container {
  position: relative;
  width: 24rem;
  height: 40rem;
  transform-style: preserve-3d;
  transition: transform 0.6s;
  display: flex;
  justify-content: center;
  align-items: center;
}

.flipped {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  position: absolute;
  top: 0;
  left: 0;
  backface-visibility: hidden;
  width: 100%;
  height: 100%;
}

.card-back {
  transform: rotateY(180deg);
}

.extended-border-card {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1), 0 0 0 8px rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  height: 100%;
  width: 100%;
  position: absolute;
}

.flip-icon {
  color: red;
  font-size: 2rem;
  padding: 0.5rem;
  cursor: pointer;
}

.desc_chip {
  color: red;
  height: 2rem;
}

.carousel-container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.carousel-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 8px;
}

.swipe-right {
  transform: translateX(100%) rotate(20deg);
  transition: transform 0.6s ease-out;
}

.swipe-left {
  transform: translateX(-100%) rotate(-20deg);
  transition: transform 0.6s ease-out;
}
</style>
