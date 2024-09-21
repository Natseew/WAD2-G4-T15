<template>
  <div class="red-background"></div>
  <div class="relative">
    <div class="relative z-10">
      <MatchCard />
      <Navbar />
    </div>
  </div>
</template>

<script setup>
  import { getAuth, onAuthStateChanged } from "firebase/auth";
  import { useRouter } from 'vue-router';
  import Navbar from '../components/Navbar.vue';
  import MatchCard from "../components/MatchCard.vue";


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
.red-background {
  background: linear-gradient(to bottom, #FD0E42, #C30F31);
  height: 40vh;
  width: 100%;
  position: absolute;
  top: 0;
  border-bottom-left-radius: 1.5rem;
  border-bottom-right-radius: 1.5rem;
  z-index: 0;
}
</style>
