<template>
  <div class="background"></div>
  <div class="red-background"></div>
  <div class="relative flex justify-center items-center flex-col h-screen">
    <Navbar class="navbar" />
    <div class="relative z-10 flex flex-col items-center max-w-sm w-full h-full">
      <div class="cards-stack">
        <MatchCard 
          v-for="(match, index) in matches" 
          :key="match.id" 
          v-bind="match" 
          :ref="getCardRef(index)"
          @swipe-right="handleSwipeRight(index)"
          @swipe-left="handleSwipeLeft(index)"
          :style="{ zIndex: matches.length - index }"
        />
      </div>
      <ButtonGroup @heart-clicked="handleHeartClick" @times-clicked="handleTimesClick" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import MatchCard from "../components/MatchCard.vue";
import ButtonGroup from "../components/ButtonGroup.vue";
import Navbar from "../components/Navbar.vue";

const router = useRouter();
const auth = getAuth();
const store = useStore();

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    store.dispatch('populateMatches', user.uid);
  } else {
    // User is signed out
    router.push('/login');
  }
});

// Sample matches data for testing 
const matches = ref([
  { id: 1, name: 'Natalie', },
  { id: 2, name: 'John', },
  { id: 3, name: 'Emma', },
]);

// const matches = ref([]);

const cardRefs = ref([]);

const getCardRef = (index) => (el) => {
  cardRefs.value[index] = el;
};

const handleHeartClick = () => {
  if (matches.value.length === 0) return;
  const topCard = cardRefs.value[0];
  if (topCard) {
    topCard.swipeRight();
  }
};

const handleSwipeRight = (index) => {
  matches.value.splice(index, 1);
  cardRefs.value.splice(index, 1);
  cardRefs.value = cardRefs.value.slice();
};

const handleTimesClick = () => {
  if (matches.value.length === 0) return;
  const topCard = cardRefs.value[0];
  if (topCard) {
    topCard.swipeLeft();
  }
};

const handleSwipeLeft = (index) => {
  matches.value.splice(index, 1);
  cardRefs.value.splice(index, 1);
  cardRefs.value = cardRefs.value.slice();
};

onMounted(() => {
  matches.value = store.getters.getPopulateMatches;
});

store.subscribe((mutation, state) => {
  if (mutation.type === 'setPopulateMatches') {
    matches.value = state.populateMatches; // Update matches when populated
  }
});

</script>

<style scoped>
.background {
  background: linear-gradient(to bottom, rgba(255, 118, 118, 0.1), rgba(245, 78, 162, 0.1));
  height: 100vh;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
}

.red-background {
  background: linear-gradient(to bottom, #FD0E42, #C30F31);
  height: 40vh;
  width: 100%;
  position: absolute;
  top: 0;
  border-bottom-left-radius: 1.5rem;
  border-bottom-right-radius: 1.5rem;
  z-index: 1;
}

.flex {
  display: flex;
}

.h-screen {
  height: 100vh;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.max-w-sm {
  max-width: 25rem;
}

.w-full {
  width: 100%;
}

.h-full {
  height: 100%;
}

.navbar {
  z-index: 10;
}

.cards-stack {
  position: relative;
  width: 24rem;
  height: 40rem;
}

.cards-stack {
  position: relative;
  width: 24rem;
  height: 40rem;
}

.cards-stack > * {
  position: absolute;
  top: 0;
  left: 0;
  transition: transform 0.3s ease;
}

.cards-stack > *:not(:first-child) {
  top: 10px;
  left: 10px;
  transform: scale(0.95);
}

</style>
