import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import 'primeicons/primeicons.css';
import './style.css'
import Aura from '@primevue/themes/lara';
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDjFeBjJy7sKz9FNff-4whDQVNM-4NCBDQ",
  authDomain: "wad2-g4-t15.firebaseapp.com",
  projectId: "wad2-g4-t15",
  storageBucket: "wad2-g4-t15.appspot.com",
  messagingSenderId: "163643103363",
  appId: "1:163643103363:web:6217522d7fb853acb5e3b6",
  measurementId: "G-Z92QP38VPB"
};

initializeApp(firebaseConfig);

createApp(App)
    .use(ToastService)
    .use(router)
    .use(PrimeVue, {
      theme: {
        preset: Aura
      }
    })
    .mount('#app')
