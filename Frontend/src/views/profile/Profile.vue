<template>
  <div>
    <h2>Profile</h2>
    <div v-for="(match, index) in matches" :key="match.id">
      <h3>{{ match.name }}</h3>
      <!-- Other details or information about the match -->
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps(['matches']); // Receiving matches from the parent or Vuex store

</script>

<style scoped>
/* Your styles */
</style>












































<!-- <template>
  <v-container class="full-screen">
    <Navbar  />
    <v-row>
      <h1>Profile</h1>
    </v-row>
    <v-spacer></v-spacer>
    <v-avatar size="350">
      <v-img
        alt="John"
        v-bind:src="data.images[0]"
      ></v-img>
    </v-avatar>
    <v-spacer></v-spacer>
    <h2>{{ data.name }}</h2>
    <v-form disabled>
    <v-container>
      <v-row>
        <v-col
          cols="12"
          sm="6"
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
          sm="6"
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
          sm="6"
        >
          <v-text-field
            v-model="data.religion"
            label="Religion"
            required
            variant="outlined"
          ></v-text-field>
        </v-col>
        <v-col
          cols="12"
          sm="6"
        >
          <v-text-field
            v-model="data.lookingFor"
            label="Looking For"
            required
            variant="outlined"
          ></v-text-field>
        </v-col>
        <v-col
          cols="12"
          sm="12"
        >
          <v-textarea label="Introduction" variant="outlined" v-model="data.introduction"></v-textarea>
        </v-col>
        <v-col
          cols="12"
          sm="12"
        >
          <v-textarea label="Describe My Personality" variant="outlined" v-model="data.personalityDescription"></v-textarea>
        </v-col>
        <v-col
          cols="12"
          sm="6"
        >
          <v-textarea label="What I Love" variant="outlined" v-model="data.loves"></v-textarea>
        </v-col>
        <v-col
          cols="12"
          sm="6"
        >
          <v-textarea label="What I Hate" variant="outlined" v-model="data.hate"></v-textarea>
        </v-col>
        <v-col
          cols="12"
          sm="6"
        >
          <v-textarea label="Goals" variant="outlined" v-model="data.goals"></v-textarea>
        </v-col>
        <v-col
          cols="12"
          sm="6"
        >
          <v-textarea label="Dealbreakers" variant="outlined" v-model="data.dealbreakers"></v-textarea>
        </v-col>
        <v-col
          cols="12"
          sm="12"
        >
          <v-textarea label="Hobbies" variant="outlined" v-model="data.hobbies"></v-textarea>
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
    "hobbies": "",
    "religion":"",
    "lookingFor": "",
    "introduction":"",
    "personalityDescription":"",
    "loves":"",
    "hates":"",
    "dealbreakers":"",
    "goals":"",
    "images":[]
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

.full-screen{
  height:100vh;
}

</style> -->