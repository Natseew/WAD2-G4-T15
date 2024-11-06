<template>
    <div class="photo-gallery">
      <h2 class="mb-8 text-2xl font-bold text-center text-gray-800">Upload Your Photos</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-h-[75vh] overflow-y-auto">
        <div
          v-for="(photo, index) in photos"
          :key="index"
          class="bg-white shadow-lg rounded-md overflow-hidden"
        >
          <div v-if="!photo.file" class="p-4 flex justify-center items-center h-48 bg-gray-100">
            <button
              @click="triggerFileUpload(index)"
              class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
            >
              Upload Photo
            </button>
            <input
              :ref="`photo-input-${index}`"
              :id="`photo-input-${index}`"
              type="file"
              accept="image/*"
              @change="handleFileUpload($event, index)"
              class="hidden"
            />
          </div>
          <div v-else>
            <img
              :src="photo.preview"
              :alt="`Uploaded Photo ${index + 1}`"
              class="w-full h-48 object-cover"
            />
            <div class="p-4">
              <input
                type="text"
                placeholder="Add a caption"
                v-model="photo.caption"
                class="w-full border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                @click="triggerFileUpload(index)"
                class="mt-2 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md"
              >
                Overwrite Photo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        photos: [
          { file: null, caption: '', preview: '' },
          { file: null, caption: '', preview: '' },
          { file: null, caption: '', preview: '' },
          { file: null, caption: '', preview: '' },
          { file: null, caption: '', preview: '' },
          { file: null, caption: '', preview: '' },
        ],
      };
    },
    methods: {
      handleFileUpload(event, index) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
          const preview = URL.createObjectURL(file);
          this.$set(this.photos, index, { file, preview, caption: this.photos[index].caption });
        } else {
          alert('Please upload a valid image file');
        }
      },
      triggerFileUpload(index) {
        this.$refs[`photo-input-${index}`].click();
      },
    },
  };
  </script>
  
  <style scoped>
  .photo-gallery {
    max-width: 1024px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Montserrat', sans-serif;
  }
  
  .grid {
    margin-bottom: 2rem;
  }
  
  button {
    transition: all 0.2s ease-in-out;
  }
  
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  input[type="text"] {
    transition: all 0.2s ease-in-out;
  }
  
  input[type="text"]:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }
  </style>