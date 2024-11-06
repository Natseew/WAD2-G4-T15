<template>
    <div class="match-notification" @click.self="closeNotification">
      <div class="content">
        <!-- <img src="https://img.icons8.com/fluent/48/000000/filled-like.png" alt="match-icon" class="icon" /> -->
        <p class="message">It's a match with {{ matchedUser?.name || 'someone special' }}!</p>
        <div class="heart" :class="{'matching': isMatching, 'popped': isPopped}"></div>
        <button @click="closeNotification" class="close-button">Keep Swiping</button>
      </div>
    </div>
  </template>
  
  <script>
  import { useStore } from 'vuex';
  import { computed } from 'vue';
  
  export default {
    data() {
      return {
        isMatching: false,  
        isPopped: false
      };
    },
    mounted() {
      this.triggerHeartAnimation(); // Trigger animation only once when the component mounts
    },
    methods: {
      triggerHeartAnimation() {
        setTimeout(() => {
          this.isMatching = true;  
          this.isPopped = true;    
        }, 200); // Delay before starting the animation
      },
    },
    setup() {
      const store = useStore();
  
      const matchedUser = computed(() => store.getters.getMatchNotification);
  
      const closeNotification = () => {
        store.dispatch('clearMatchNotification');
      };
  
      return { matchedUser, closeNotification };
    }
  };
  </script>
  
  <style scoped>
  .match-notification {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.6); /* Dark overlay background */
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    animation: fadeIn 0.4s ease forwards;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  .content {
    border-left: 1px solid rgba(255,255,255,0.4);
    border-top: 1px solid rgba(255,255,255,0.4);
    background: rgba(255,255,255,0.3);
    padding: 2rem;
    backdrop-filter: blur(10px);
    border-radius: 12px;
    text-align: center;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
    animation: popIn 0.6s ease forwards;
  }
  
  @keyframes popIn {
    from {
      transform: scale(0.8);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
  
  .icon {
    width: 60px;
    height: 60px;
    margin-bottom: 1rem;
    animation: pulse 1.2s infinite;
    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5)); /* Glowing effect */
  }

  .heart {
    position: relative; 
    margin: auto;
    background-color: white;
    height: 30px; 
    width: 30px;  
    transform: rotate(-45deg);
    transition: background-color 0.3s ease-in-out;
  }

  .heart:after {
      background-color: white;
      content: "";
      border-radius: 50%;
      position: absolute;
      width: 30px; 
      height: 30px; 
      top: 0px;
      left: 15px;
      transition: background-color 1s ease-in-out;
  }

  .heart:before {
      background-color: white;
      content: "";
      border-radius: 50%;
      position: absolute;
      width: 30px; 
      height: 30px; 
      top: -15px;
      left: 0px;
      transition: background-color 1s ease-in-out;
  }

  .heart.matching,
  .heart.matching:before,
  .heart.matching:after {
    background-color: red;
  }

  .heart.popped {
    animation: beat 1s cubic-bezier(0.17, 0.89, 0.32, 1.49);
  }

  @keyframes beat {
    0% {
      transform: scale(1) rotate(-45deg);
    }
    50% {
      transform: scale(0.6) rotate(-45deg);
    }
    100% {
      transform: scale(1) rotate(-45deg);
    }
  }
  
  .message {
    font-size: 1.5rem;
    font-weight: bold;
    margin: 1rem 0 2rem 0;
    color: #ffecec;
  }
  
  .close-button {
    background-color: #ffffff;
    color: #ff4f5a;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 8px;
    font-weight: bold;
    font-size: 1rem;
    margin-top: 3rem;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
  }
  
  .close-button:hover {
    background-color: #ff6f61;
    transform: scale(1.05); /* Slight scaling on hover */
    color: white;
  }
  </style>
  