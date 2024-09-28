<template>
  <div class="background"></div>
  <div class="red-background"></div>
  <div class="relative flex justify-center items-center flex-col h-screen">
    <Navbar class="navbar" />
    <div class="relative z-10 flex flex-col items-center max-w-sm w-full">
      <MatchCard />
      <ButtonGroup />
    </div>
  </div>
</template>

<script setup>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from 'vue-router';
import MatchCard from "../components/MatchCard.vue";
import ButtonGroup from "../components/ButtonGroup.vue";
import Navbar from "../components/Navbar.vue";

const router = useRouter();

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    console.log(user);
  } else {
    // User is signed out
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

.navbar {
  z-index: 10;
}
</style>
