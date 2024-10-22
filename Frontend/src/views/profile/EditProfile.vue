<template>
  <div class="background">
    <div class="card-scroll-wrapper">
      <div class="card-scroll-container">
        <!-- Loop through items -->
        <div
          class="card-scroll--card"
          v-for="(item, index) in items"
          :key="item.name"
          :style="{ backgroundColor: item.color }"
          @click="openModal(item)" 
        >
          <div class="card-scroll--card--content">
            <h3>{{ item.name }}</h3> <!-- Card title -->
            <div class="card-scroll--card--textbox">
              <p v-if="item.notes">{{ item.notes }}</p> <!-- Display saved notes in a textbox -->
            </div>
          </div>
          <div class="card-scroll--card--footer">
            <p>Click to edit notes</p> <!-- Footer with edit prompt -->
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for editing the selected card notes -->
    <div v-if="isModalOpen" class="modal" @click.self="closeModal">
      <div class="modal-content">
        <h2>Edit Card</h2>
        <p>Notes:</p>
        <textarea v-model="notes" placeholder="Enter additional notes..."></textarea>
        <button @click="saveChanges">Save</button>
        <button @click="closeModal">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isModalOpen: false,
      selectedItem: null,
      notes: '', // For additional notes input
      items: [
        { name: 'Profile', color: '#FFABAB', notes: '' },
        { name: 'Best Memory', color: '#FFC3A0', notes: '' },
        { name: 'Milano', color: '#FF677D', notes: '' },
        { name: 'Tsing Tao', color: '#D9BF77', notes: '' },
        { name: 'Frances', color: '#6BAF92', notes: '' },
        { name: 'Burma Superstar', color: '#FF6F61', notes: '' },
        { name: 'Salt and Straw', color: '#FFD166', notes: '' },
        { name: 'Tsing Tao', color: '#6A0572', notes: '' },
        { name: 'Frances', color: '#B9D8D5', notes: '' },
        { name: 'Burma Superstar', color: '#F3E9A1', notes: '' },
        { name: 'Salt and Straw', color: '#FFB6C1', notes: '' },
      ],
    };
  },
  methods: {
    openModal(item) {
      this.selectedItem = item;
      this.notes = item.notes;
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
      this.selectedItem = null;
      this.notes = '';
    },
    saveChanges() {
      const index = this.items.findIndex(item => item.name === this.selectedItem.name);
      if (index !== -1) {
        this.items[index].notes = this.notes;
      }
      this.closeModal();
    },
  },
};
</script>

<style scoped>
body {
  min-height: 100vh;
  margin: 0;
  overflow: hidden;
}

.background {
  background: linear-gradient(132deg, #FC415A, #591BC5, #212335);
  background-size: 400% 400%;
  animation: Gradient 15s ease infinite;
  position: relative;
  height: 100vh;
  width: 100%;
  padding: 0;
  margin: 0;
  overflow-y: scroll; /* Allow vertical scrolling */
}

/* Card Scroll Wrapper */
.card-scroll-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
}

.card-scroll-container {
  display: flex;
  flex-direction: column;
  gap: 20px; /* Space between cards */
}

/* Card Style */
.card-scroll--card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 400px; /* Increased card width */
  height: 500px; /* Increased card height with same aspect ratio */
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  color: white;
  position: relative;
  padding: 15px;
  transition: transform 0.3s;
}

.card-scroll--card:hover {
  transform: scale(1.05); /* Card hover effect */
}

.card-scroll--card--content {
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-scroll--card--textbox {
  width: 90%;
  background-color: rgba(0, 0, 0, 0.2);
  padding: 10px;
  margin-top: 15px;
  border-radius: 5px;
  text-align: center;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.card-scroll--card--footer {
  padding: 5px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 0 0 10px 10px;
  text-align: center;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
}

textarea {
  width: 100%;
  height: 100px;
  margin-bottom: 10px;
}
</style>
