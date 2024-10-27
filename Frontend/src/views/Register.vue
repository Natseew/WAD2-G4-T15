<template>
  <div class="register-container">
    <div class="big-screen w-full lg:h-full">
      <div class="register-form">
        <h1 class="text-3xl">Create an Account</h1>
        <p>
          <InputText v-model="email" placeholder="Email" />
        </p>
        <p>
          <Password v-model="password" :toggleMask="true" placeholder="Password" :feedback="true" />
        </p>
        <p>
          <Password v-model="confirmPassword" :toggleMask="true" placeholder="Confirm Password" :feedback="false" />
        </p>
        <p v-if="passwordError" class="error-message">{{ passwordError }}</p>
        <p>
          <Button label="Register" icon="pi pi-check" class="p-button-rounded w-48 md:w-2/3" @click="register" />
        </p>
        <p>Been here before? 
          <router-link to="/login">Login</router-link>
        </p>
        <p v-if="errMsg" class="error-message">{{ errMsg }}</p>
      </div>
      <div class="logo"> 
          NeverAlone. 
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'vue-router';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import axios from 'axios';

const firstName = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const errMsg = ref();
const passwordError = ref("");
const router = useRouter();

const register = () => {
  if (password.value !== confirmPassword.value) {
    errMsg.value = "Passwords do not match";
    return;
  }

  passwordError.value = "";

  createUserWithEmailAndPassword(getAuth(), email.value, password.value)
    .then((response) => {
      console.log(response.user.uid)
      axios.post('/user/'+ response.user.uid, {"name":"newUser", "uid":response.user.uid});
      console.log("Successfully registered!");
      router.push("/editProfile")
    })
    .catch((error) => {
      console.log(error.code);
      errMsg.value = "Error creating account";
    });
};
</script>

<style scoped>

  @keyframes gradient-animation {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
    }
  }

@media (max-width: 1023px) {
  .logo {
    position: absolute;
    display: flex;
    top: 20px;
    left: 20px;
    font-size: 20px;
    font-family: Roboto Flex;
    color: white;
  }

  .register-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    padding: 2rem;
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
    border-radius: 8px;

    background: linear-gradient(90deg, #ff7676, #f54ea2, #ffb3b3);

    background-size: 600% 600%;
    animation: gradient-animation 25s ease infinite;
  }

  .register-form {
    width: 100%;
    max-width: 400px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    padding: 70px 30px 40px 30px;
    border-radius: 25px;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
  }
  .big-screen{
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

@media (min-width: 1024px) {
  .register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    padding: 2rem;
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
    border-radius: 8px;

    background: linear-gradient(90deg, #ff7676, #f54ea2, #ffb3b3);

    background-size: 600% 600%;
    animation: gradient-animation 25s ease infinite;
  }

  .register-form {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 2rem;
  }

  .register-form > * {
    width: 100%;
    max-width: 400px;
  }

  .logo {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 97%;
    width: 50%;
    max-width: 700px;
    font-size: 3rem;
    color: white;
    text-align: center;
    border-radius: 40px;
    font-family: 'Roboto Flex', sans-serif;

    background: linear-gradient(90deg, #ff7676, #f54ea2, #ffb3b3);

    background-size: 600% 600%;
    animation: gradient-animation 25s ease infinite;
  }

  .big-screen{
    display: flex;
    flex-direction: row;
    background: #fff;
    gap: 2em;
    width: 90%;
    max-width: 1400px;
    height: 80%;
    align-items: center;
    border-radius: 40px;
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
}

.register-form p {
  margin-bottom: 1rem;
}

:deep .p-inputtext,
:deep .p-password {
  width: 100%;
}

.error-message {
  color: red;
  text-align: center;
}
</style>