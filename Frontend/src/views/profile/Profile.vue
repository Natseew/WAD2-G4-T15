<template>
  <div class="background"></div>
  <div class="red-background"></div>
  <div class="relative min-h-screen">
    <Navbar class="navbar" />

    <div class="container mx-auto px-4 pt-20 pb-8 relative z-10">
      <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <!-- Profile Header -->
        <div v-if="loading == true">
          <v-progress-circular color="blue-lighten-3" indeterminate :size="56"></v-progress-circular>
        </div>
        <div v-else>
          <div class="flex flex-col items-center mb-8 relative">
            <PencilSquareIcon @click="disabled = !disabled" class="absolute right-0" style="width: 1.8rem; height: 1.8rem;"></PencilSquareIcon>
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
          <v-form validate-on="submit lazy" @submit.prevent="submit" class="relative">
          <v-row>
            <!-- Introduction Section -->
            <v-col cols="12">
              <div class="profile-field">
                <label>Introduction</label>
                <textarea v-model="data.introduction" :disabled="disabled" class="profile-textarea" style="width: 100%; height: 100%"></textarea>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <!-- Basic Info Section -->
            <v-col cols="6">
              <div class="profile-field">
                <label>Age</label>
                <input type="text" v-model="data.age" :disabled="disabled" class="profile-input" />
              </div>
              
              <div class="profile-field">
                <label>Gender</label>
                <input type="text" v-model="data.gender" :disabled="disabled" class="profile-input" />
              </div>
            </v-col>
            <v-col cols="6">
              <div class="profile-field">
                <label>Religion</label>
                <input type="text" v-model="data.religion" :disabled="disabled" class="profile-input" />
              </div>

              <div class="profile-field">
                <label>Looking For</label>
                <input type="text" v-model="data.lookingFor" :disabled="disabled" class="profile-input" />
              </div>
            </v-col>
          </v-row>

            <!-- Full Width Sections -->
          <v-row class="space-y-4">
            <v-col class="profile-field">
              <label>Personality Description</label>
              <textarea v-model="data.personalityDescription" :disabled="disabled" class="profile-textarea"></textarea>
            </v-col>
          </v-row>

            <v-row class="gap-4">
              <v-col class="profile-field">
                <label>What I Love</label>
                <textarea v-model="data.loves" :disabled="disabled" class="profile-textarea"></textarea>
              </v-col>
              <v-col class="profile-field">
                <label>What I Hate</label>
                <textarea v-model="data.hates" :disabled="disabled" class="profile-textarea"></textarea>
              </v-col>
            </v-row>

              <v-row class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <v-col class="profile-field">
                  <label>Goals</label>
                  <textarea v-model="data.goals" :disabled="disabled" class="profile-textarea"></textarea>
                </v-col>
                <v-col class="profile-field">
                  <label>Dealbreakers</label>
                  <textarea v-model="data.dealbreakers" :disabled="disabled" class="profile-textarea"></textarea>
                </v-col>
              </v-row>

              <v-row class="profile-field">
                <label>Hobbies</label>
                <textarea v-model="data.hobbies" :disabled="disabled" class="profile-textarea"></textarea>
              </v-row>

              <v-row v-if="!disabled">
                <v-btn class="mt-2" text="Submit" type="submit" block>Submit</v-btn>
              </v-row>
            </v-form>
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
import { PencilSquareIcon } from '@heroicons/vue/24/solid';

const router = useRouter();
const auth = getAuth();
let userData = ref()

const loading = ref(true);
let disabled = ref(true)


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
    "images":[],
    "likes": [],
    "matches": []
});

onAuthStateChanged(auth, (user) => {
  loading.value = true
  if (user) {
    userData.value = user
    axios.get('/user/'+user.uid)
      .then(function (response) {
        data.value = response.data;
        data.value.email = user.email;
        loading.value = false
    })
  } else {
    router.push('/login');
  }
});

const submit =  (() => {
  if(userData){
    loading.value = true; 
    try{
      axios.post('/user/'+userData.value.uid, data.value)
      .then(function (response) {
        console.log(response)
      })
    }catch(error){
      console.log(error)
    }
    loading.value = false; 
    overlay.value = false;
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

.profile-textarea   {
  @apply w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500 min-h-[100px] resize-none;
}

.navbar {
  z-index: 10;
}
</style>
