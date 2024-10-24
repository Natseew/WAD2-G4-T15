<template>
  <div class="card-wrapper mb-4 w-full md:w-auto">
    <div class="flip-container" :class="{ flipped: isFlipped, [swipeClass]: swipeClass }" ref="flipContainer">
      <!-- Front of the card -->
      <Card class="extended-border-card w-full card-front">
        <template #title>
          <div class="flex items-center justify-between p-4 w-full">
            <div class="flex items-center">
              <div class="flex flex-col justify-center">
                <div class="font-bold text-2xl">
                  <input v-if="isEditable" v-model="editableName" @input="updateName" class="name-input" />
                  <span v-else>{{ name }}</span>
                </div>
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
            <input v-if="isEditable" v-model="editableSubtitle" @input="updateSubtitle" class="subtitle-input" />
            <span v-else>{{ editableSubtitle }}</span>
          </p>
        </template>

        <template #content>
          <div class="flex flex-col gap-2 p-4 text-left">
            <div class="flex flex-col">
              <Chip label="My personality in 5 words" class="desc_chip" />
              <p class="text-sm text-left">
                <input v-if="isEditable" v-model="editablePersonality" @input="updatePersonality" class="desc-input" />
                <span v-else>{{ editablePersonality }}</span>
              </p>
            </div>
            <div class="flex flex-col">
              <Chip label="I love" class="desc_chip" />
              <p class="text-sm text-left">
                <input v-if="isEditable" v-model="editableLove" @input="updateLove" class="desc-input" />
                <span v-else>{{ editableLove }}</span>
              </p>
            </div>
            <div class="flex flex-col">
              <Chip label="I hate" class="desc_chip" />
              <p class="text-sm text-left">
                <input v-if="isEditable" v-model="editableHate" @input="updateHate" class="desc-input" />
                <span v-else>{{ editableHate }}</span>
              </p>
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
    isEditable: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const isFlipped = ref(false);
    const swipeClass = ref('');
    const flipContainer = ref(null);

    const editableName = ref(props.name);
    const editableSubtitle = ref('Lorem ipsum dolor sit amet, consectetur adipisicing elit.');
    const editablePersonality = ref('Description for chip 1.');
    const editableLove = ref('Description for chip 2.');
    const editableHate = ref('Description for chip 3.');

    const flipCard = () => {
      isFlipped.value = !isFlipped.value;
    };

    const swipeRight = () => {
      swipeClass.value = 'swipe-right';
      setTimeout(() => {
        emit('swipe-right');
        swipeClass.value = '';
      }, 300);
    };

    const swipeLeft = () => {
      swipeClass.value = 'swipe-left';
      setTimeout(() => {
        emit('swipe-left');
        swipeClass.value = '';
      }, 300);
    };

    defineExpose({
      swipeRight,
      swipeLeft,
    });

    const imageLoadError = (item) => {
      console.error('Failed to load image:', item);
    };

    // Update methods for editable fields
    const updateName = () => {
      emit('update:name', editableName.value);
    };

    const updateSubtitle = () => {
      emit('update:subtitle', editableSubtitle.value);
    };

    const updatePersonality = () => {
      emit('update:personality', editablePersonality.value);
    };

    const updateLove = () => {
      emit('update:love', editableLove.value);
    };

    const updateHate = () => {
      emit('update:hate', editableHate.value);
    };

    return {
      isFlipped,
      flipCard,
      swipeRight,
      swipeLeft,
      swipeClass,
      flipContainer,
      imageLoadError,
      editableName,
      editableSubtitle,
      editablePersonality,
      editableLove,
      editableHate,
      updateName,
      updateSubtitle,
      updatePersonality,
      updateLove,
      updateHate,
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

.name-input, .subtitle-input, .desc-input {
  border: none;
  background: transparent;
  font-size: inherit;
  padding: 0;
  width: 100%;
}
</style>
