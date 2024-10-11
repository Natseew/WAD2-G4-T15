<template>
  <v-container class="">
    <Navbar  />
    <v-row>
      <h1>EditProfile</h1>
    </v-row>
    <v-spacer></v-spacer>
    <v-avatar @click="overlay = !overlay" image="https://2.img-dpreview.com/files/p/E~C1000x0S4000x4000T1200x1200~articles/3925134721/0266554465.jpeg" size="350"></v-avatar>
    <v-spacer></v-spacer>
    <v-overlay
      v-model="overlay"
      class="align-center justify-center"
    >
    <v-card height="80" width="450" align-center justify-center>
      <v-row>
        <v-col sm="8">
        <v-file-input
          label="File input"
          show-size
          prepend-icon="mdi-camera"
          variant="filled"
          v-model="file"
          clearable
        ></v-file-input>
      </v-col>
      <v-col sm="4">
        <v-btn
          :loading="loading"
          class="mt-2"
          text="Submit"
          v-on:click="uploadTask"
        ></v-btn>
      </v-col>
    </v-row>
    </v-card>
    </v-overlay>
    <h2>{{ data.name }}</h2>
    <v-form validate-on="submit lazy" @submit.prevent="submit">
    <!-- <v-form> -->
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
          <v-textarea v-model="data.hobbies" label="Hobbies" variant="outlined"></v-textarea>
        </v-col>
      </v-row>

      <v-btn
        :loading="loading"
        class="mt-2"
        text="Save"
        type="submit"
        block
      ></v-btn>
    </v-container>
  </v-form>

  </v-container>
</template>

<script setup>
  import axios from 'axios'
  import { getAuth, onAuthStateChanged } from "firebase/auth";
  import Navbar from '../../components/Navbar.vue';
  import { useRouter } from 'vue-router';
  import { ref } from 'vue';
  import { getStorage, uploadBytes } from "firebase/storage";
  import {ref as firebaseRef} from "firebase/storage";

  const storage = getStorage();
  

  // Create file metadata including the content type
  /* @type {any} */
  const metadata = {
    contentType: 'image/jpg',
  };
  const file = ref()
  // Upload the file and metadata

  const uploadTask = () => {
    if(file){
      console.log(file)
      const storageRef = firebaseRef(storage, 'gs://wad2-g4-t15.appspot.com/'+file.value.name)
      uploadBytes(storageRef, file.value, metadata)
    }
  };

  const router = useRouter();

  const auth = getAuth();

  let data = ref({
    "name": "",
    "age": "",
    "gender": "",
    "hobbies": ""
  });

  let loading = ref(false)

  let overlay = ref(false)

  let userData = ref()
  onAuthStateChanged(auth, (user) => {
    if (user) {
    userData.value = user
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

  const submit =  (() => {
    if(userData){
      loading = true
      try{
        axios.post('/user/'+userData.value.uid, data.value)
        .then(function (response) {
          console.log(response)
        })
      }catch(error){
        console.log(error)
      }
      loading = false
    }
  });


</script>

<style scoped>

</style>