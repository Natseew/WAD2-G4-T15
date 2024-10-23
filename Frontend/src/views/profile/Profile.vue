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

<template>
  <div class="background"></div>
  <div class="red-background"></div>
  <div class="relative min-h-screen">
    <Navbar class="navbar" />

    <div class="container mx-auto px-4 pt-20 pb-8 relative z-10">
      <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <!-- Profile Header -->
        <div class="flex flex-col items-center mb-8">
          <div class="relative mb-4">
            <img
              :src="data.images[0] || 'https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png'" 
              alt="Profile"
              class="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
            />
          </div>
          <h1 class="text-2xl font-bold text-gray-800 mb-2">{{ data.name }}</h1>
          <p class="text-gray-600">{{ data.email }}</p>
        </div>

        <!-- Profile Information -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Basic Info Section -->
          <div class="space-y-4">
            <div class="profile-field">
              <label>Age</label>
              <input type="text" v-model="data.age" disabled class="profile-input" />
            </div>
            
            <div class="profile-field">
              <label>Gender</label>
              <input type="text" v-model="data.gender" disabled class="profile-input" />
            </div>

            <div class="profile-field">
              <label>Religion</label>
              <input type="text" v-model="data.religion" disabled class="profile-input" />
            </div>

            <div class="profile-field">
              <label>Looking For</label>
              <input type="text" v-model="data.lookingFor" disabled class="profile-input" />
            </div>
          </div>

          <!-- About Section -->
          <div class="space-y-4">
            <div class="profile-field">
              <label>Introduction</label>
              <textarea v-model="data.introduction" disabled class="profile-textarea"></textarea>
            </div>
          </div>

          <!-- Full Width Sections -->
          <div class="col-span-1 md:col-span-2 space-y-4">
            <div class="profile-field">
              <label>Personality Description</label>
              <textarea v-model="data.personalityDescription" disabled class="profile-textarea"></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="profile-field">
                <label>What I Love</label>
                <textarea v-model="data.loves" disabled class="profile-textarea"></textarea>
              </div>
              <div class="profile-field">
                <label>What I Hate</label>
                <textarea v-model="data.hate" disabled class="profile-textarea"></textarea>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="profile-field">
                <label>Goals</label>
                <textarea v-model="data.goals" disabled class="profile-textarea"></textarea>
              </div>
              <div class="profile-field">
                <label>Dealbreakers</label>
                <textarea v-model="data.dealbreakers" disabled class="profile-textarea"></textarea>
              </div>
            </div>

            <div class="profile-field">
              <label>Hobbies</label>
              <textarea v-model="data.hobbies" disabled class="profile-textarea"></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Navbar from '../../components/Navbar.vue';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

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
    axios.get('/user/'+user.uid)
      .then(function (response) {
        data.value = response.data;
        data.value.email = user.email;
      })
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

.profile-field {
  @apply space-y-2;
}

.profile-field label {
  @apply block text-sm font-medium text-gray-700;
}

.profile-input {
  @apply w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500;
}

.profile-textarea {
  @apply w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500 min-h-[100px] resize-none;
}

.navbar {
  z-index: 10;
}
</style>