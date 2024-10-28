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
    },
    addDislikeToUser(state, dislikedUser) {
      if (!state.user.dislikes) {
        state.user.dislikes = [];
      }
      state.user.dislikes.push({
        name: dislikedUser.name,
        uid: dislikedUser.id,
      });
    },
  },
  actions: {    
    async fetchMatches({ commit }, uid) {
      try {
        const response = await axios.get(`${base_url}/user/${uid}`);
        const userData = { ...response.data, uid }
        console.log(userData)
        commit('setUser', userData);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    },

    async populateMatches({ commit }, uid) {
      try {
          const response = await axios.post(`${base_url}/user/populate_homepage/${uid}`);
          console.log(response.data)
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

    async dislikeUser({ commit }, { uid, dislikedUserId }) {
      try {
        console.log(dislikedUserId);
        const response = await axios.post(`${base_url}/user/dislike/${uid}/${dislikedUserId}`);
        
        if (response.status === 200) {
          commit('addDislikeToUser', { uid: dislikedUserId });
        }
      } catch (error) {
        console.error("Failed to dislike user:", error);
      }
    },
  }
});

export default store;
