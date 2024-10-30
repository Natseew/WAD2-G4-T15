<template>
  <div class="background"></div>
  <div class="red-background"></div>
  <div class="relative flex justify-center items-center flex-col h-screen">
    <Navbar class="navbar" />
    <div class="relative z-10 flex flex-col items-center max-w-sm w-full h-full">
      <div class="vertical-stack">
        <!-- First card remains as MatchCard -->
        <MatchCard 
          v-bind="matches[0]" 
          :isEditable="isEditMode" 
          ref="card0"
          @swipe-right="handleSwipeRight(0)"
          @swipe-left="handleSwipeLeft(0)"
          @updateMatch="updateMatch(0, $event)" 
        />

        <!-- The rest of the cards will be CustomCards -->
        <CustomCard
          v-for="(match, index) in matches.slice(1)" 
          :key="match.id" 
          :headerText="match.name" 
          :frontColor="getColorByIndex(index)"
          :isEditable="isEditMode" 
          @update="updateMatch(index + 1, $event)"
        />
      </div>
    </div>
    <!-- Fixed Button to toggle edit mode -->
    <button @click="toggleEditMode" class="edit-button">
      {{ isEditMode ? 'Save Changes' : 'Edit Profiles' }}
    </button>
  </div>
</template>

<script>
import MatchCard from '../../components/MatchCard.vue';
import Navbar from '../../components/Navbar.vue';
import CustomCard from '../../components/CustomCard.vue'; // Import CustomCard

export default {
  components: {
    MatchCard,
    Navbar,
    CustomCard, // Register CustomCard
  },
  data() {
    return {
      matches: [
        { id: 1, name: 'John Doe', age: 28, bio: 'Loves hiking and outdoor adventures.' },
        { id: 2, name: 'Jane Smith', age: 25, bio: 'A foodie at heart, loves trying new cuisines.' },
        { id: 3, name: 'Mike Johnson', age: 30, bio: 'Tech enthusiast and gamer.' },
        { id: 4, name: 'Emily Davis', age: 22, bio: 'Enjoys painting and art exhibitions.' },
        { id: 5, name: 'Sarah Wilson', age: 27, bio: 'Passionate about fitness and health.' },
      ],
      isEditMode: false, // Control edit mode state
    };
  },
  methods: {
    toggleEditMode() {
      if (this.isEditMode) {
        // Save changes logic here
        this.saveChanges();
      }
      this.isEditMode = !this.isEditMode;
    },
    saveChanges() {
      // Logic to save changes permanently
      console.log('Changes saved:', this.matches);
    },
    handleSwipeRight(index) {
      // Handle swipe right logic here
    },
    handleSwipeLeft(index) {
      // Handle swipe left logic here
    },
    updateMatch(index, updatedData) {
      // Update the match data with the edited data received from MatchCard or CustomCard
      this.$set(this.matches, index, { ...this.matches[index], ...updatedData });
    },
    getColorByIndex(index) {
      // Example color logic for each CustomCard
      const colors = ['#4CAF50', '#FF5722', '#2196F3', '#FFC107'];
      return colors[index % colors.length]; // Loop through the colors array
    },
  },
};
</script>

<style scoped>
.background {
  background: linear-gradient(to bottom, rgba(255, 118, 118, 0.1), rgba(245, 78, 162, 0.1));
  height: 100vh;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
}

.red-background {
  background: linear-gradient(to bottom, #FD0E42, #C30F31);
  height: 40vh;
  width: 100%;
  position: absolute;
  top: 0;
  border-bottom-left-radius: 1.5rem;
  border-bottom-right-radius: 1.5rem;
  z-index: 1;
}

.edit-button {
  position: fixed; /* Fix the button to a specific position */
  bottom: 20px; /* Position from the bottom */
  right: 20px; /* Position from the right */
  margin: 1rem;
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  z-index: 1000; /* Ensure it appears above other elements */
}

.edit-button:hover {
  background-color: #0056b3;
}
</style>
