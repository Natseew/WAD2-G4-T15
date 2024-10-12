import { createStore } from 'vuex';
import axios from 'axios';
const base_url = import.meta.env.VITE_ENDPOINT ?? `http://localhost:${import.meta.env.VITE_PORT}`;

const store = createStore({
  state () {
    return {
      user: {}
    }
  },
  getters: {
    getUser(state) {
      return state.user;
    }
  },
  mutations: {
    setUser(state, userData) {
      state.user = userData;
    }
  },
  actions: {    
    async fetchUser({ commit }) {
      try {
        const response = await axios.get("");
        commit('setUser', response.data);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    }
  }
});

export default store;
