<template>
    <div class="register-container">
      <h1>Create an Account</h1>
      <div class="register-form">
        <p>
          <InputText v-model="email" placeholder="Email" />
        </p>
        <p>
          <Password v-model="password" toggleMask placeholder="Password" feedback={false} />
        </p>
        <p>
          <Button label="Register" icon="pi pi-check" class="p-button-rounded" @click="register" />
        </p>
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
  
  const register = () => {
    createUserWithEmailAndPassword(getAuth(), email.value, password.value)
      .then((data) => {
        console.log("Successfully registered!");
        router.push('/login');
      })
      .catch((error) => {
        console.log(error.code);
        alert(error.message);
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
    background-color: #fff;
  }
  
  h1 {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .register-form {
    width: 100%;
    max-width: 400px;
  }
  
  .register-form p {
    margin-bottom: 1rem;
  }
  </style>
  