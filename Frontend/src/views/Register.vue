<template>
    <div class="register-container">
        <div class="logo"> 
          Dating App. 
        </div>
        <div class="register-form">
          <h1 class=text-3xl>Create an Account</h1>
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
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
  import { useRouter } from 'vue-router';
  import InputText from 'primevue/inputtext';
  import Password from 'primevue/password';
  import Button from 'primevue/button';
  
  const email = ref("");
  const password = ref("");
  const router = useRouter();
  const errMsg = ref();
  const confirmPassword = ref("");
  
  const register = () => {

    //Password and Confirm password Validation
    if (password.value !== confirmPassword.value){
      errMsg.value = "Passwords do not match";
      return;
    } 

    passwordError.value = "";

    //Firebase Authentication
    createUserWithEmailAndPassword(getAuth(), email.value, password.value)
      .then((data) => {
        console.log("Successfully registered!");
        router.push('/login');
      })
      .catch((error) => {
        console.log(error.code);
        errMsg.value = "Error creating account"
      });
  };
  </script>
  
  <style scoped>
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
    background: linear-gradient(180deg, #FF7676 0%, #F54EA2 100%);
  }
  
  h1 {
    text-align: center;
    margin-bottom: 2rem;
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
  
  .register-form p {
    margin-bottom: 1rem;
  }

  .logo{
    position: absolute;
    display: flex;
    top: 20px;
    left: 20px;
    font-size: 20px;
    font-family: Roboto Flex;
    color: white;
  }

  :deep .p-inputtext,
  :deep .p-password
  {
    width: 100%;
  }

  .error-message {
    color: red;
    text-align: center;
  }
  </style>
  