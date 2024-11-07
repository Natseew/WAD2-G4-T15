<template>
  <div class="background">
    <Navbar class="navbar" />
    <div class="red-background"></div>
    <div class="flex justify-center items-center flex-col mt-15">
      <div class="flex flex-col items-center w-full">
        <div class="cards-stack relative">

          <div v-if="showingLove && filteredMatches.length === 0" class="no-matches-message">
            No more users looking for love.
          </div>
          
          <div v-if="!showingLove && filteredMatches.length === 0" class="no-matches-message">
            No more users looking for friends.
          </div>

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
        <ButtonGroup @heart-clicked="handleHeartClick" @times-clicked="handleTimesClick" @filter-clicked="handleFilterClick" class="button-group mt-15 z-10" />
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
  const result = matches.value.filter(match => {
    console.log('Match:', match); // Log each match object
    return showingLove.value ? match.lookingFor === 'Love' : match.lookingFor === 'Friends';
  });
  console.log('Filtered Matches:', result); // Log filtered matches
  return result;
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
  console.log('Showing Love:', showingLove.value); // Log state change
};

const swipeCard = (index, isRightSwipe) => {
  const swipedMatch = filteredMatches.value[index];
  if (swipedMatch) {
    if (isRightSwipe) {
      likeUser(swipedMatch);
    } else {
      dislikeUser(swipedMatch);
    }

    const matchIndex = matches.value.findIndex(match => match.uid === swipedMatch.uid);
    if (matchIndex !== -1) {
      matches.value.splice(matchIndex, 1); 
    }

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

@media (max-width: 768px) {
  ::v-deep .main-content {
        display:none;
    }
}

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
  background: linear-gradient(180deg, #ffa578, rgb(255, 128, 192), #a67bf5);
  background-size: 400% 400%;
  animation: spin-gradient 15s ease infinite;
  height: 40vh;
  width: 100%;
  position: absolute;
  top: 0;
  border-bottom-left-radius: 1.5rem;
  border-bottom-right-radius: 1.5rem;
  z-index: 1;
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

.button-group {
  position: relative;
  z-index: 20;
}

.no-matches-message {
  color: #555;
  font-size: 1.2rem;
  text-align: center;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 10%;
  transform: translate(-50%, -50%);
  z-index: 10;
}
</style>
