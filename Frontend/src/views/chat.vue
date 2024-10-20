<template>
    <div id="chat">
        <v-container>
            <v-row>
                <v-col cols="2">
                    <v-navigation-drawer app>
                        <v-list>
                            <v-list-item>Chats</v-list-item>
                            <v-divider></v-divider>
                            <v-list-item class="border 1px" v-for="item of matches" @click="joinConversation(item.chatName)">{{ item.name }}</v-list-item>
                        </v-list>
                    </v-navigation-drawer>
                </v-col>
                <v-col cols="10" v-if="activeConversation" class="h-screen flex items-center">
                    <Conversation :active-conversation="activeConversation" :name="name" />
                </v-col>  
                <v-col cols="10" v-else class="h-screen flex items-center">
                    <div>
                        <h1>Connecting Client to Server!</h1>
                        <p>{{ statusString }}</p>
                    </div>       
                </v-col>
            </v-row>
        </v-container>
    </div>

</template>

<script>
import {Client as ConversationsClient} from "@twilio/conversations"
import Conversation from "./conversation.vue"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import axios from 'axios'

export default {
    components: { Conversation},
    data() {
        return {
            statusString: "",
            activeConversation: null,
            name: "",
            nameRegistered: false,
            isConnected: false,
            uid: "",
            matches:[]
        }
    },
    methods: {
        // Create an access token which we will sign and return to the client,
        getToken: async function(identity) {
            const response = await fetch(`http://localhost:3000/chat/auth/${identity}`)
            const responseJson = await response.json()
            return responseJson.token
        },

        initConversationsClient: async function() {
            window.conversationsClient = ConversationsClient;
            const token = await this.getToken(this.uid) 
            this.conversationsClient = new ConversationsClient(token)
            this.statusString = "Connecting to Twilio…"
            this.conversationsClient.on("connectionStateChanged", (state) => {
                switch (state) {
                case "connected":
                    this.statusString = "You are connected."
                    this.isConnected = true
                    break
                case "disconnecting":
                    this.statusString = "Disconnecting from Twilio…"
                    break
                case "disconnected":
                    this.statusString = "Disconnected."
                    break
                case "denied":
                    this.statusString = "Failed to connect."
                    break
                }
            })
        },
        registerName: async function() {
            this.nameRegistered = true
            await this.initConversationsClient()
        },
        createConversation: async function(user2, chatName) {
            // Ensure User1 and User2 have an open client session
            try {
                await this.conversationsClient.getUser(this.uid)
            } catch {
                console.error("Waiting for User1 and User2 client sessions")
                return
            }
            // Try to create a new conversation and add User1 and User2
            // If it already exists, join instead
            try {
                const newConversation = await this.conversationsClient.createConversation({uniqueName: chatName})
                const joinedConversation = await newConversation.join().catch(err => console.log(err))
                await joinedConversation.add(this.uid).catch(err => console.log("error: ", err))
                await joinedConversation.add("NeverAlone").catch(err => console.log("error: ", err))
                await joinedConversation.add(user2).catch(err => console.log("error: ", err))
                this.activeConversation = joinedConversation
            } catch {
               console.log("Conversation Already Exists")
            }
        },
        joinConversation: async function(chatName) {
            this.activeConversation = null
            this.activeConversation = await (this.conversationsClient.getConversationByUniqueName(chatName))
        }
    },
    async mounted() {
        const auth = getAuth();

        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in
                
                this.uid = user.uid
                axios.get('/user/'+user.uid)
                    .then(response =>{
                        // handle success
                        console.log(response.data)
                        this.value = response.data.name
                        for(var item of response.data.matches){
                            this.matches.push(JSON.parse(item))
                        }
                    })
                this.registerName()
                console.log(this.matches)
                console.log(user);
            } else {
                // User is signed out
                router.push('/login');
            }
        })
    }
}


</script>

<style scoped>
ul {
 list-style-type: none;
 padding: 0;
}
 
li {
 display: inline-block;
 margin: 0 10px;
}
 
a {
 color: #42b983;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#app input {
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  margin-right: 5px;
  width: 300px;
}
#app button {
  background-color: #21cfbc;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>