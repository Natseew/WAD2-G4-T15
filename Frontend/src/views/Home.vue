<template>
  <div>
    <Navbar  />
    <h1>User signed in</h1>
  </div>
</template>
  
<script setup>
  import { getAuth, onAuthStateChanged } from "firebase/auth";
  import Navbar from '../components/Navbar.vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();

  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
    // User is signed in
    console.log(user)
    } else {
      // User is signed out
      router.push('/login');
    }
  });

</script>

<style scoped>

</style>
