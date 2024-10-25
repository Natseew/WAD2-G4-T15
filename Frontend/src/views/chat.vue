<template>
    <div id="chat">
        <v-container class="h-screen d-flex flex-column">
            <Navbar class="navbar" />
            <v-row>
                 <v-col cols="12" v-if="isConnected" class="h-full">
                    <div class="chat-container">
                        <v-row class="h-full">
                            <v-col cols="4">
                                <v-list lines="three">
                                    <div class="chat-list">
                                        <v-list-item 
                                            v-for="item of matches" 
                                            @click="joinConversation(item.chatName)" 
                                            :class="{ 'active-chat': activeConversation && activeConversation.uniqueName === item.chatName }"
                                        >
                                            <div class="d-flex">
                                                <Avatar 
                                                    :label="item.name[0].toUpperCase()" 
                                                    class="mr-5" 
                                                    size="large" 
                                                    style="background-color: #FD0E42; color: #fff"
                                                />
                                                <span class="font-bold">{{ item.name }}</span>
                                            </div>
                                        </v-list-item>
                                    </div>
                                </v-list>
                            </v-col>
                            <v-col cols="8" class="conversation-col">
                                <div v-if="activeConversation">
                                    <Conversation 
                                        :active-conversation="activeConversation" 
                                        :name="name" 
                                    />
                                </div>
                                <div v-else class="no-chat">
                                    <h3>Select a chat to start messaging</h3>
                                </div>
                            </v-col>
                        </v-row>
                    </div>
                </v-col>

                <v-col cols="12" v-else class="h-screen w-full flex flex-col items-center justify-center">
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
import Navbar from "../components/Navbar.vue";
import Avatar from 'primevue/avatar';
import axios from 'axios'

export default {
    components: { Conversation, Avatar, Navbar},
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
#chat {
    background: linear-gradient(to bottom, #FD0E42, #C30F31);
    height: 100vh;
    width: 100vw;
}

.v-container {
    height: 100%;
    max-width: 85%;
}

.v-col {
    height: 100%;
}

.v-row {
    height: 100%;
}

.conversation-col {
    position: relative;
}

.chat-container {
    margin: 16px;
    background: white;
    border-radius: 20px;
    overflow: hidden;
    height: calc(100% - 60px);
}

.chat-list {
    margin: 8px;
}

.chat-list .v-list-item {
    border-radius: 10px !important;
    margin-bottom: 10px;
}

.chat-list .v-list-item:hover {
    background-color: rgba(0, 0, 0, 0.2);
}

.chat-list .v-list-item.active-chat {
    background-color: rgba(0, 0, 0, 0.3);
}

.no-chat {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(0, 0, 0, 0.6);
}
</style>