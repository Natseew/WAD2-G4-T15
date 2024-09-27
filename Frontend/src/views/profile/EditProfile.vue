<template>
  <v-container class="full-screen" fluid>
    <Navbar />
    <v-row justify="center" align="center" class="main-content">
      <vue-flip ref="flipCard" active-click="false" width="400px" height="80vh">
        <template v-slot:front>
          <div class="front" @click="handleFrontClick" style="cursor: pointer;">
            <h2>{{ frontData.title }}</h2>
            <img :src="frontData.image" alt="Profile Picture" class="profile-pic" />
            <p>{{ frontData.description }}</p>
          </div>
        </template>
        <template v-slot:back>
          <div class="back" @click="handleBackClick" style="cursor: pointer;">
            <h2>{{ backData.title }}</h2>
            <v-form @submit.prevent="submitForm">
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="backData.name"
                      label="Full Name"
                      required
                      variant="outlined"
                      @click.stop
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6">
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
import { VueFlip } from 'vue-flip';

const router = useRouter();
const auth = getAuth();

// Data for the front side of the card
const frontData = ref({
  title: "Profile Info",
  image: "https://2.img-dpreview.com/files/p/E~C1000x0S4000x4000T1200x1200~articles/3925134721/0266554465.jpeg",
  description: "Click to edit your profile."
});

// Data for the back side of the card
const backData = ref({
  title: "Edit Profile",
  name: "",
  email: "",
  age: "",
  gender: "",
  hobbies: ""
});

// Loading state for form submission
const loading = ref(false);

// Handles form submission and logging of data
const submitForm = () => {
  loading.value = true; 
  console.log("Form submitted:", backData.value); // Logs the submitted data
  // Add your submission logic here (e.g., API call)
  loading.value = false; 
};

// Fetch user data upon authentication state change
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Fetch user data using the user's UID
    axios.get(`/user/${user.uid}`).then(response => {
      backData.value.name = response.data.name; // Set the name from the response
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
