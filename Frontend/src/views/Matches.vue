<template>
    <div class="background">
      <Navbar class="navbar" />
      <div class="red-background"></div>
      <div class="matches-container">
        <div class="matches-list">
          <NewMatchCard
            v-for="match in matchedUsers"
            :key="match.uid"
            v-bind="match"
            class="match-card"
          />
          <div v-if="matchedUsers.length === 0" class="no-matches-message">
            No matches yet.
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed, onMounted } from 'vue';
  import Navbar from '../components/Navbar.vue';
  import NewMatchCard from '../components/NewMatchCard.vue';
  import { getAuth, onAuthStateChanged } from "firebase/auth";
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const auth = getAuth();
  const store = useStore();

  const matchedUsers = computed(() => store.getters.getMatchedUsers);
  
  onAuthStateChanged(auth, (user) => {

    if (user) {
        store.dispatch('fetchMatches', user.uid);
        store.dispatch('fetchMatchedUsers', user.uid);
    } else {
        router.push('/login');
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
  
  .matches-container {
    padding: 20px;
    background: transparent;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 2;
    position: relative;
    margin-top: 0.5vh;
  }
  
  .matches-list {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 500px;
    gap: 0.1rem;
    padding-bottom: 20px;
  }
  
  .match-card {
    width: 100%;
  }
  
  .no-matches-message {
    text-align: center;
    color: #555;
    font-size: 1.2rem;
    padding: 2rem;
  }
  </style>
  