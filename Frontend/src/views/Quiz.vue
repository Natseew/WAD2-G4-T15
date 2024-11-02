<template>
    <div class="quiz-container">
      <div class="background-elements">
        <div class="floating-circle circle1"></div>
        <div class="floating-circle circle2"></div>
        <div class="floating-circle circle3"></div>
      </div>
      <div class="big-screen w-full lg:h-full">
        <div class="quiz-form">
          <h1 class="text-3xl title-text" v-if="!quizStarted">Answer some questions for us to evaluate your preferences!</h1>
          <p v-if="!quizStarted">
            <Button label="Start Quiz" icon="pi pi-play" class="p-button-rounded w-48 start-btn" @click="startQuiz" />
          </p>
  
          <div v-if="quizStarted && currentQuestionIndex < questions.length" class="quiz-section fade-in">
            <h2 class="question-text fade-in">{{ questions[currentQuestionIndex].text }}</h2>
            <div v-for="(option, index) in questions[currentQuestionIndex].options" :key="index" class="answer-option fade-in">
              <Button :label="option" class="p-button-outlined option-btn" @click="selectAnswer(index)" />
            </div>
            <p class="timer-text pulse">{{ timeLeft }} seconds remaining</p>
          </div>
  
          <div v-if="quizStarted && currentQuestionIndex >= questions.length" class="quiz-complete scale-up">
            <h1 v-if="loading">Redirecting back to your match...</h1>
            <div v-if="loading" class="loading-spinner"></div>
          </div>
        </div>
      </div>
    </div>
</template>
  
<script setup>
    import { ref, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import Button from 'primevue/button';

    const router = useRouter();
    const quizStarted = ref(false);
    const currentQuestionIndex = ref(0);
    const timeLeft = ref(5);
    const score = ref(0);
    const interval = ref(null);
    const loading = ref(false);

    const questions = ref([
    { text: "What's the capital of France?", options: ["Paris", "London", "Berlin", "Rome"], correct: 0 },
    { text: "Who painted the Mona Lisa?", options: ["Van Gogh", "Leonardo da Vinci", "Picasso", "Rembrandt"], correct: 1 },
    { text: "What's the largest planet?", options: ["Earth", "Mars", "Jupiter", "Saturn"], correct: 2 },
    ]);

    const startQuiz = () => {
    quizStarted.value = true;
    startTimer();
    };

    const startTimer = () => {
    timeLeft.value = 5;
    clearInterval(interval.value);

    interval.value = setInterval(() => {
        if (timeLeft.value > 0) {
        timeLeft.value -= 1;
        } else {
        nextQuestion();
        }
    }, 1000);
    };

    const selectAnswer = (index) => {
    if (index === questions.value[currentQuestionIndex.value].correct) {
        score.value += 1;
    }
    nextQuestion();
    };

    const nextQuestion = () => {
    currentQuestionIndex.value += 1;
    if (currentQuestionIndex.value < questions.value.length) {
        startTimer();
    } else {
        clearInterval(interval.value);
        redirectAfterQuiz();
    }
    };

    const redirectAfterQuiz = () => {
    loading.value = true;
    setTimeout(() => {
        router.push("/chat");
    }, 2000);
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

    @keyframes fade-in {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
    }

    @keyframes pulse {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
    }
    }

    @keyframes scale-up {
    0% {
        transform: scale(0);
    }
    100% {
        transform: scale(1);
    }
    }

    @keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
    }

    @keyframes float {
    0% {
        transform: translateY(0) translateX(0);
    }
    50% {
        transform: translateY(-20px) translateX(20px);
    }
    100% {
        transform: translateY(0) translateX(0);
    }
    }

    .quiz-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    padding: 2rem;
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    background: linear-gradient(90deg, #ff7676, #f54ea2, #ffb3b3, #ffb347);
    background-size: 600% 600%;
    animation: gradient-animation 25s ease infinite;
    overflow: hidden;
    }

    .background-elements {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 0;
    pointer-events: none;
    }

    .floating-circle {
    position: absolute;
    border-radius: 50%;
    opacity: 0.8;
    animation: float 5s ease-in-out infinite;
    background: rgba(255, 255, 255, 0.3);
    }

    .circle1 {
    width: 120px;
    height: 120px;
    top: 10%;
    left: 15%;
    animation-duration: 6s;
    background-color: #ffffff; /* Test solid color for visibility */
    }

    .circle2 {
    width: 80px;
    height: 80px;
    bottom: 20%;
    right: 20%;
    animation-duration: 7s;
    background-color: #ffffff; /* Test solid color for visibility */
    }

    .circle3 {
    width: 150px;
    height: 150px;
    top: 50%;
    left: 60%;
    animation-duration: 8s;
    background-color: #ffffff; /* Test solid color for visibility */
    }

    .quiz-form {
    z-index: 1;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    padding: 50px 30px 30px;
    border-radius: 25px;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    text-align: center;
    }

    .big-screen {
    display: flex;
    justify-content: center;
    align-items: center;
    }

    h1 {
    text-align: center;
    margin-bottom: 2rem;
    }

    .answer-option {
    margin: 10px 0;
    }

    .question-text {
    font-size: 1.5rem;
    margin-bottom: 2rem;
    }

    .fade-in {
    animation: fade-in 0.5s ease-out;
    }

    .pulse {
    animation: pulse 1s infinite;
    }

    .scale-up {
    animation: scale-up 0.8s ease-out;
    }

    .option-btn:hover {
    background-color: #f0f0f0;
    color: #000;
    transition: all 0.3s ease-in-out;
    }

    .timer-text {
    font-weight: bold;
    margin-top: 20px;
    color: #ff4747;
    font-size: 1.2rem;
    }

    .loading-spinner {
    border: 8px solid #f3f3f3;
    border-top: 8px solid #3498db;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    margin: 20px auto;
    animation: spin 1s linear infinite;
    }
</style>
