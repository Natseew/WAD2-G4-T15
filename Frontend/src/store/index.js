import { createStore } from 'vuex';
import axios from 'axios';
const base_url = import.meta.env.VITE_ENDPOINT ?? `http://localhost:${import.meta.env.VITE_PORT}`;

const store = createStore({
  state() {
    return {
      user: {},
      populateMatches: []
    }
  },
  getters: {
    getUser(state) {
      return state.user;
    },
    getPopulateMatches(state) {
      return state.populateMatches;
    }
  },
  mutations: {
    setUser(state, userData) {
      state.user = userData;
    },
    setPopulateMatches(state, populateMatchesData) {
      state.populateMatches = populateMatchesData;
    },
    addLikeToUser(state, likedUser) {
      if (!state.user.likes) {
        state.user.likes = [];
      }
      state.user.likes.push({
        name: likedUser.name,
        uid: likedUser.id,
      });
    }
  },
  actions: {    
    async fetchMatches({ commit }, uid) {
      try {
        const response = await axios.get(`${base_url}/user/${uid}`);
        // Ensure UID is included in the user data
        const userData = { ...response.data, uid }; // Include the uid
        console.log(userData)
        commit('setUser', userData);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    },

    async populateMatches({ commit }, uid) {
      try {
          const response = await axios.post(`${base_url}/user/populate_homepage/${uid}`);
          commit('setPopulateMatches', response.data);
      } catch (error) {
          console.error("Failed to fetch populateMatches data:", error);
      }
    },

    async likeUser({ commit }, { uid, likedUserId }) {
      try {
        console.log(likedUserId);
        const response = await axios.post(`${base_url}/user/like/${uid}/${likedUserId}`);
        
        if (response.status === 200) {
          commit('addLikeToUser', { uid: likedUserId });
        }
      } catch (error) {
        console.error("Failed to like user:", error);
      }
    },
  }
});

export default store;
