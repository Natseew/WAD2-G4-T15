<template>
  <div>
    <div class="fixed top-0 left-0 right-0 z-50">
      <Toolbar class="custom-toolbar">
        <template #start>
          <div class="flex items-center gap-4">
            <span
              class="nav-link"
              :class="{ active: isActive('Home') }"
              @click="navigateTo('Home')"
            >
              Home
            </span>
            <span
              class="nav-link"
              :class="{ active: isActive('Profile') }"
              @click="navigateTo('Profile')"
            >
              Profile
            </span>
            <span
              class="nav-link"
              :class="{ active: isActive('view') }"
              @click="navigateTo('view')"
            >
              View
            </span>
          </div>
        </template>

        <template #end>
          <div class="flex items-center gap-2">
            <Avatar 
              v-on:click="router.push('/profile')" 
              image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" 
              class="avatar" 
            />
          </div>
        </template>
      </Toolbar>
    </div>

    <!-- Main Content Wrapper -->
    <div class="main-content">
      <!-- Your other components or content go here -->
    </div>
  </div>
</template>

<script setup>
import Toolbar from 'primevue/toolbar';
import Avatar from 'primevue/avatar';
import { useRouter, useRoute } from 'vue-router'; // Import useRoute to get current route
const router = useRouter();
const route = useRoute(); // Access the current route

const navigateTo = (path) => {
  router.push(`/${path}`);
};

// Function to check if the current route matches the provided path
const isActive = (path) => {
  return route.path === `/${path}`; // Compare the current route with the provided path
};
</script>

<style scoped>
.custom-toolbar {
  border: none;
  background: rgba(30, 30, 30, 0.8); /* Semi-transparent dark background */
  backdrop-filter: blur(5px); /* Blur effect to the background */
  padding: 0.5rem 1rem; /* Padding */
  width: 100%; /* Full width */
  margin: 0; /* No margin */
  border-radius: 0; /* No border radius */
  display: flex; /* Use flexbox for layout */
  justify-content: space-between; /* Spacing between nav links and avatar */
  align-items: center; /* Center items vertically */
}

/* Apply box-sizing globally */
*, *::before, *::after {
  box-sizing: border-box; /* Include padding and borders in total width */
}

.nav-link {
  cursor: pointer;
  padding: 0.5rem 1rem;
  position: relative;
  text-align: center;
  color: white;
  transition: color 0.3s ease; 
}

.nav-link:hover {
  color: #FFD700; 
}

.nav-link.active {
  color: #FFD700; /* Highlight color for the active link */
  font-weight: bold; /* Optional: make the active link bold */
}

.nav-link:hover::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -4px; 
  height: 2px;
  background-color: #FFD700; 
  transition: width 0.3s ease;
}

.avatar {
  width: 36px; 
  height: 36px; 
  border-radius: 50%; /* To ensure profile picture is circular */
  cursor: pointer;
  transition: opacity 0.3s ease; /* Blur transition */
}

.avatar:hover {
  opacity: 0.8; /* Slightly transparent on hover */
}

/* Main content styling */
.main-content {
  margin-top: 80px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .custom-toolbar {
    flex-direction: column; 
    align-items: center; 
  }

  .nav-link {
    padding: 0.5rem;
  }

  .avatar {
    width: 32px; 
    height: 32px; 
  }

  .main-content {
    margin-top: 60px; 
  }
}

@media (min-width: 769px) {
  .custom-toolbar {
    flex-direction: row;
  }
}
</style>