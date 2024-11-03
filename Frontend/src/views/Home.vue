<template>
  <div class="background">
    <Navbar class="navbar" />
    <div>Hello</div>
    <div class="red-background"></div>
    <div class="flex justify-center items-center flex-col mt-15">
      <div class="flex flex-col items-center w-full">
        <div class="cards-stack">
          <NewMatchCard 
            v-for="(match, index) in filteredMatches" 
            :key="match.id" 
            v-bind="match" 
            :ref="getCardRef(index)"
            @swipe-right="handleSwipeRight(index)"
            @swipe-left="handleSwipeLeft(index)"
            :style="{ 
              '--z-index': matches.length - index, 
              '--animation-delay': `${index * 0.2}s` 
            }"
          />
        </div>
        <ButtonGroup @heart-clicked="handleHeartClick" @times-clicked="handleTimesClick" @filter-clicked="handleFilterClick" class="mt-15 z-10" />
      </div>
    </div>

    <MatchNotification v-if="showNotification" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import NewMatchCard from "../components/NewMatchCard.vue";
import ButtonGroup from "../components/ButtonGroup.vue";
import Navbar from "../components/Navbar.vue";
import MatchNotification from '../components/MatchNotification.vue';

const router = useRouter();
const auth = getAuth();
const store = useStore();

onAuthStateChanged(auth, (user) => {
  if (user) {
    if (user.name === "newUser") {
      router.push('/editProfile');
    }
    store.dispatch('fetchMatches', user.uid);
    store.dispatch('populateMatches', user.uid);
  } else {
    router.push('/login');
  }
});

const matches = ref([]);
const cardRefs = ref([]);

const showingLove = ref(true);

const filteredMatches = computed(() => {
  return matches.value.filter(match => 
    showingLove.value ? match.lookingFor === 'Love' : match.lookingFor === 'Friends'
  );
});

const getCardRef = (index) => (el) => {
  cardRefs.value[index] = el;
};

const handleHeartClick = () => {
  if (filteredMatches.value.length === 0) return;
  const topCard = cardRefs.value[0];
  if (topCard) {
    topCard.swipeRight();
  }
};

const handleTimesClick = () => {
  if (filteredMatches.value.length === 0) return;
  const topCard = cardRefs.value[0];
  if (topCard) {
    topCard.swipeLeft();
  }
};

const handleFilterClick = () => {
  showingLove.value = !showingLove.value;
  console.log({
    showingLove: showingLove.value,
    allMatches: matches.value,
    filteredMatches: filteredMatches.value
  });
};

const swipeCard = (index, isRightSwipe) => {
  const swipedMatch = filteredMatches.value[index];
  if (swipedMatch) {
    if (isRightSwipe) {
      likeUser(swipedMatch);
    } else {
      dislikeUser(swipedMatch);
    }
    matches.value.splice(index, 1);
    cardRefs.value.splice(index, 1);
    cardRefs.value = cardRefs.value.slice();

    if (matches.value.length === 0) return;
  }
};

const likeUser = (match) => {
  const uid = store.getters.getUser.uid;
  const likedUserId = match.uid;
  store.dispatch('likeUser', { uid, likedUserId });
};

const dislikeUser = (match) => {
  const uid = store.getters.getUser.uid;
  const dislikedUserId = match.uid;
  store.dispatch('dislikeUser', { uid, dislikedUserId });
};

const handleSwipeLeft = (index) => {
  swipeCard(index, false);
};

const handleSwipeRight = (index) => {
  swipeCard(index, true);
};

onMounted(() => {
  matches.value = store.getters.getPopulateMatches;
});

store.subscribe((mutation, state) => {
  if (mutation.type === 'setPopulateMatches') {
    matches.value = state.populateMatches;
  }
});

const showNotification = computed(() => !!store.getters.getMatchNotification);

</script>

<style scoped>
.background {
  background: linear-gradient(to bottom, rgba(255, 118, 118, 0.1), rgba(245, 78, 162, 0.1));
  height: 100vh;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  overflow: auto;
}

.red-background {
  background: linear-gradient(to bottom, #B0190F, #c58550);
  height: 40vh;
  width: 100%;
  position: absolute;
  top: 0;
  border-bottom-left-radius: 1.5rem;
  border-bottom-right-radius: 1.5rem;
  z-index: 1;
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
  animation: stackAnimation 0.8s ease forwards;
  opacity: 0;
  z-index: var(--z-index);
  animation-delay: var(--animation-delay);
}

@keyframes stackAnimation {
  from {
    transform: translateY(100%) scale(0.9);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}
</style>
