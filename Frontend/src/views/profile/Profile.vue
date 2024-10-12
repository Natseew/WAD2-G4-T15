<template>
  <v-container class="">
    <Navbar  />
    <v-row>
      <h1>Profile</h1>
    </v-row>
    <v-spacer></v-spacer>
    <v-avatar image="https://2.img-dpreview.com/files/p/E~C1000x0S4000x4000T1200x1200~articles/3925134721/0266554465.jpeg" size="350"></v-avatar>
    <v-spacer></v-spacer>
    <h2>{{ data.name }}</h2>
    <v-form disabled>
    <v-container>
      <v-row>
        <v-col
          cols="12"
          sm="12"
        >
          <v-text-field
            v-model="data.name"
            :counter="10"
            :rules="nameRules"
            label="Fullname"
            hide-details
            required
            variant="outlined"
          ></v-text-field>
        </v-col>

        <v-col
          cols="12"
          sm="12"
        >
          <v-text-field
            v-model="data.email"
            :rules="emailRules"
            label="E-mail"
            hide-details
            required
            variant="outlined"
          ></v-text-field>
        </v-col>

        <v-col
          cols="12"
          sm="6"
        >
          <v-text-field
            v-model="data.age"
            label="Age"
            required
            variant="outlined"
          ></v-text-field>
        </v-col>
        <v-col
          cols="12"
          sm="6"
        >
          <v-text-field
            v-model="data.gender"
            label="Gender"
            required
            variant="outlined"
          ></v-text-field>
        </v-col>
        <v-col
          cols="12"
          sm="12"
        >
          <v-textarea label="Hobbies" variant="outlined"></v-textarea>
        </v-col>
      </v-row>
    </v-container>
  </v-form>

  </v-container>
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
        data.value = response.data;
        data.value.email = user.email;
      })
    } else {
      // User is signed out
      router.push('/login');
    }
  });
</script>

<style scoped>

</style>