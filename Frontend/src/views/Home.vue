<template>
  <h1>User signed in</h1>
</template>
  
<script setup>
  import { ref } from 'vue';
  import { getAuth, onAuthStateChanged } from "firebase/auth";
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
