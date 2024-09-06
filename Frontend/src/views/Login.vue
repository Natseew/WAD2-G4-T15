<template>
    <div class="login-container">
      <h1>Sign in to Your Account</h1>
      <div class="login-form">
        <p>
          <InputText v-model="email" placeholder="Email" />
        </p>
        <p>
          <Password v-model="password" toggleMask placeholder="Password" feedback={false} />
        </p>
        <p>
          <Button label="Submit" icon="pi pi-check" class="p-button-rounded" @click="register" />
        </p>
        <p v-if="errMsg" class="error-message">{{ errMsg }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
  import { useRouter } from 'vue-router';
  import InputText from 'primevue/inputtext';
  import Password from 'primevue/password';
  import Button from 'primevue/button';
  
  const email = ref("");
  const password = ref("");
  const errMsg = ref();
  const router = useRouter();
  
  const register = () => {
    signInWithEmailAndPassword(getAuth(), email.value, password.value)
      .then((data) => {
        console.log("Successfully Signed in!");
        router.push('/home');
      })
      .catch((error) => {
        console.log(error.code);
        switch (error.code) {
          case "auth/invalid-email":
            errMsg.value = "Invalid email";
            break;
          case "auth/user-not-found":
            errMsg.value = "No account with that email was found";
            break;
          case "auth/wrong-password":
            errMsg.value = "Incorrect Password";
            break;
          default:
            errMsg.value = "Email or password was incorrect";
            break;
        }
      });
  };
  </script>
  
  <style scoped>
  .login-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    padding: 2rem;
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    background-color: #fff;
  }
  
  h1 {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .login-form p {
    margin-bottom: 1rem;
  }
  
  .error-message {
    color: red;
    text-align: center;
  }
  </style>
  