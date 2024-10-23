<template>
  <div class="landing-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="floating-shapes">
        <div class="shape shape-circle"></div>
        <div class="shape shape-square"></div>
        <div class="shape shape-triangle"></div>
      </div>
      <div class="hero-overlay"></div>
      
      <div class="hero-content">
        <h1 class="animate-fade-up-delay text-6xl">NeverAlone</h1>
        <p class="animate-fade-up-slower text-xl">Your companion in staying connected and finding support.</p>
        <router-link to="/login">
          <Button
            label="Get Started"
            icon="pi pi-arrow-right"
            class="p-button-rounded w-48 md:w-2/3 animate-scale-up hover-scale"
          />
        </router-link>
      </div>

      <div class="scroll-indicator">
        <span class="scroll-text">See more</span>
        <i class="pi pi-arrow-down animate-bounce"></i>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <h2 class="section-title">Features</h2>
      <div class="features-list">
        <div class="feature-card animate-slide-left">
          <i class="pi pi-comments feature-icon"></i>
          <h3>Real-time Chat</h3>
          <p>Connect instantly with your matches</p>
        </div>
        <div class="feature-card animate-slide-right">
          <i class="pi pi-users feature-icon"></i>
          <h3>Gamified Dating Experience</h3>
          <p>Participate in our in-app games to gain access to new matches</p>
        </div>
        <div class="feature-card animate-slide-left">
          <i class="pi pi-calendar feature-icon"></i>
          <h3>Unbiased Matchmaking</h3>
          <p>Matchmaking is done by calcilating game scores</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import Button from 'primevue/button';
</script>

<style scoped>
.landing-page {
  font-family: 'Roboto Flex', sans-serif;
  color: #333;
}

.hero-section {
  height: 100vh;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
  background: linear-gradient(120deg, #ff7676, #f54ea2, #ffb3b3);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
  overflow: hidden;
}

.hero-content {
  z-index: 2;
  position: relative;
}

.hero-content h1 {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.hero-content p {
  font-size: 1.5rem;
  margin-bottom: 2rem;
}

.hero-content .p-button {
  animation: scaleUp 1s ease-in-out;
}

.floating-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

.shape {
  position: absolute;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  opacity: 0.7;
  animation: float 10s ease-in-out infinite;
}

.shape-circle {
  width: 100px;
  height: 100px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.shape-square {
  width: 120px;
  height: 120px;
  top: 50%;
  left: 75%;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 0;
  animation-delay: 2s;
}

.shape-triangle {
  width: 0;
  height: 0;
  border-left: 50px solid transparent;
  border-right: 50px solid transparent;
  border-bottom: 100px solid rgba(255, 255, 255, 0.3);
  top: 70%;
  left: 30%;
  animation-delay: 4s;
  transform: rotate(45deg);
}

.scroll-indicator {
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
}

.scroll-text {
  margin-bottom: 8px;
  font-size: 1.2rem;
  opacity: 0.7;
}

.pi-arrow-down {
  font-size: 2rem;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce {
  animation: bounce 1.5s infinite;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255,255,255,0.2), rgba(0,0,0,0.2));
  z-index: 1;
}

@keyframes gradientShift {
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

.hover-scale:hover {
  transform: scale(1.1);
  transition: transform 0.3s ease-in-out;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleUp {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-fade-up-delay {
  animation: fadeUp 1.5s ease-in-out;
}

.animate-fade-up-slower {
  animation: fadeUp 2s ease-in-out;
}

.features-section {
  padding: 4rem 2rem;
  background-color: #f9f9f9;
  text-align: center;
}

.section-title {
  font-size: 2.5rem;
  margin-bottom: 3rem;
}

.features-list {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  width: 300px;
  margin-bottom: 2rem;
  animation: slideUp 1s ease;
}

.feature-card h3 {
  margin: 1rem 0;
  color: #f54ea2;
}

.feature-card p {
  color: #777;
}

.feature-icon {
  font-size: 3rem;
  color: #f54ea2;
}
</style>
