<template>
  <div>
    <Navbar  />
    <h1>Profile Page</h1>
    <div>
      <p>Name: {{ data.name }}</p>
      <p>Age: {{ data.age }}</p>
      <p>Gender: {{ data.gender }}</p>
      <p>Hobbies: {{ data.hobbies }}</p>
    </div>
  </div>
</template>

<script setup>
  import axios from 'axios'
  import { getAuth, onAuthStateChanged } from "firebase/auth";
  import Navbar from '../../components/Navbar.vue';
  import { useRouter } from 'vue-router';
  import { ref } from 'vue'

  const router = useRouter();

  const auth = getAuth();

  let data = ref({
    "name": "",
    "age": "",
    "gender": "",
    "hobbies": ""
  });

  onAuthStateChanged(auth, (user) => {
    if (user) {
    // User is signed in
    axios.get('/user/'+user.uid)
      .then(function (response) {
        // handle success
        data.value = response.data
      })
    } else {
      // User is signed out
      router.push('/login');
    }
  });



</script>

<style scoped>

</style>