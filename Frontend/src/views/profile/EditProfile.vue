<template>
  <v-container class="full-screen" fluid>
    <Navbar />
    <v-row justify="center" align="center" class="main-content">
      <vue-flip ref="flipCard" active-click="false" width="400px" height="85vh">
        <template v-slot:front>
          <div class="front" @click="handleFrontClick" style="cursor: pointer;">
            <h2>{{ frontData.title }}</h2>
            <img @click="overlay = !overlay" :src="backData.images[0]" alt="Profile Picture" class="profile-pic" />
            <p>{{ frontData.description }}</p>
          </div>
            <v-overlay
            v-model="overlay"
            class="align-center justify-center"
          >
          <v-card width="450" align-center justify-center>
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
        </template>
        <template v-slot:back>
          <div class="back" @click="handleBackClick" style="cursor: pointer;">
            <h2>{{ backData.title }}</h2>
            <v-form validate-on="submit lazy" @submit.prevent="submit">
              <v-container>
                <v-row>
                  <v-col cols="12" sm="12">
                    <v-text-field
                      v-model="backData.name"
                      label="Full Name"
                      required
                      variant="outlined"
                      @click.stop
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12">
                    <v-text-field
                      v-model="backData.email"
                      label="E-mail"
                      required
                      variant="outlined"
                      @click.stop
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="backData.age"
                      label="Age"
                      required
                      variant="outlined"
                      @click.stop
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="backData.gender"
                      label="Gender"
                      required
                      variant="outlined"
                      @click.stop
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="backData.hobbies"
                      label="Hobbies"
                      variant="outlined"
                      @click.stop
                    ></v-textarea>
                  </v-col>
                </v-row>
                <v-btn class="mt-2" text="Submit" type="submit" block>Submit</v-btn>
              </v-container>
            </v-form>
          </div>
        </template>
      </vue-flip>
    </v-row>
  </v-container>
</template>

<script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  import { getAuth, onAuthStateChanged } from "firebase/auth";
  import Navbar from '../../components/Navbar.vue';
  import { useRouter } from 'vue-router';
  import { VueFlip } from 'vue-flip';;
  import { getStorage, uploadBytes, getDownloadURL } from "firebase/storage";
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
      const storageRef = firebaseRef(storage, 'gs://wad2-g4-t15.appspot.com/'+file.value.name)
      uploadBytes(storageRef, file.value, metadata).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          backData.value.images.push(url)
          console.log(backData.value)
          submit()
        });
      });
    };
  };

const router = useRouter();
const auth = getAuth();

// Data for the front side of the card
const frontData = ref({
  title: "Profile Info",
  description: "Click to edit your profile."
});

// Data for the back side of the card
const backData = ref({
  title: "Edit Profile",
  name: "",
  email: "",
  age: "",
  gender: "",
  hobbies: "",
  images: []
});

// Loading state for form submission
const loading = ref(false);

let overlay = ref(false)

let userData = ref()

const submit =  (() => {
    if(userData){
      loading.value = true; 
      try{
        axios.post('/user/'+userData.value.uid, backData.value)
        .then(function (response) {
          console.log(response)
        })
      }catch(error){
        console.log(error)
      }
      loading.value = false; 
    }
  });

// Fetch user data upon authentication state change
onAuthStateChanged(auth, (user) => {
  if (user) {
    userData.value = user
    // Fetch user data using the user's UID
    axios.get(`/user/${user.uid}`).then(response => {
      backData.value = response.data;
      backData.value.email = user.email; // Set the email from the Firebase user
    });
  } else {
    router.push('/login'); // Redirect to login if not authenticated
  }
});

// Handles the click event on the front card to flip it
const handleFrontClick = () => {
  const flipCard = $refs.flipCard; // Reference to the flip card component
  flipCard.flip(); // Execute the flip method to flip the card
};

// Handles the click event on the back card to flip back
const handleBackClick = () => {
  const flipCard = $refs.flipCard; // Reference to the flip card component
  flipCard.flip(); // Execute the flip method to flip the card back
};
</script>

<style scoped>
.v-container {
  background: linear-gradient(to top, #fabeff, #ffd6a1);
  padding: 60px;
  min-height: 100vh;
  box-sizing: border-box;
  font-family: 'Montserrat', sans-serif; /* Aesthetic font */
}

.main-content {
  height: 100vh;
}

.front, .back {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30px; /* Increased padding for aesthetics */
  border: none; /* Removed default border */
  border-radius: 20px; /* More rounded corners */
  box-shadow: 0 6px 12px rgba(139, 33, 74, 0.24); /* Softer shadow for depth */
  width: 100%;
  height: 100%;
}

.front {
  background: linear-gradient(to top, #ffb8e2, #ffdba9); /* Soft pastel pink */
  color: #79316a; /* Darker text for readability */
}

.back {
  background-color: #ffe8b3; /* Pastel yellow */
  color: #5d5d5d; /* Darker text for readability */
  padding: 30px;
  overflow: hidden;
  flex-grow: 1;
  max-height: 100%;
  border-radius: 20px; /* Consistent corner rounding */
}

.profile-pic {
  border-radius: 50%;
  width: 400px; /* Profile picture size */
  height: 400px; /* Profile picture size */
  margin-bottom: 15px; /* Space below the profile picture */
  box-shadow: 0 4px 8px rgba(137, 73, 36, 0.6); /* Soft shadow */
}

h2 {
  font-family: 'Playfair Display', serif; /* Stylish font for headings */
  font-size: 40px; /* Increased font size for headings */
  margin-bottom: 15px; /* Space below heading */
  text-align: center; /* Centered text */
}

p {
  font-family: 'Roboto', sans-serif; /* Clean font for body text */
  font-size: 16px; /* Adjusted font size for readability */
  text-align: center; /* Centered text */
  line-height: 1.6; /* Improved readability */
}

.v-text-field, .v-textarea {
  background-color: #ffffff; /* White background for input fields */
  border-radius: 10px; /* Rounded input fields */
}

.v-btn {
  background-color: #fff3a4; /* Button color matching front card */
  color: #5d5d5d; /* Darker text color */
  font-weight: bold;
  border-radius: 20px; /* Rounded button */
}

.v-btn:hover {
  background-color: #fffce1; /* Slightly darker shade on hover */
}

* {
  box-sizing: border-box; /* Universal box-sizing */
}
</style>
