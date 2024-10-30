<template>
    <div id="chat">
        <v-container class="h-screen d-flex flex-column">
            <Navbar class="navbar"/>
            <v-row>
                <v-col cols="12" v-if="isConnected">
                    <div class="chat-container">
                        <v-row>
                            <transition name="slide-x-reverse-transition" mode="out-in">
                                <v-col cols="12" md="4" sm="12" class="chat-list-col" v-if="showList()">
                                    <v-list lines="three">
                                        <div class="chat-list">
                                            <v-list-item 
                                                v-for="item of matches" 
                                                @click="() => { joinConversation(item.uid, item.chatName); reverseChatList(); shownChatName = `${item.name}'s and ${name}'s chat`; receiverName=item.name}" 
                                                :class="{ 'active-chat': activeConversation && activeConversation.uniqueName === item.chatName }"
                                            >
                                                <div class="d-flex">
                                                    <!--:label="item.name[0].toUpperCase()"-->
                                                    <Avatar 
                                                        shape="circle"
                                                        class="mr-5" 
                                                        size="large" 
                                                    >
                                                        <v-img src="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" />
                                                    </Avatar>
                                                    <span class="font-bold">{{ item.name }}</span>
                                                </div>
                                            </v-list-item>
                                        </div>
                                    </v-list>
                                </v-col>
                            </transition>
                            <v-col cols="12" lg="8" md="8" sm="12" class="conversation-col" v-if="showConversation()">
                                <transition name="slide-x-reverse-transition" mode="out-in">
                                    <div v-if="activeConversation">
                                        <Conversation 
                                            :active-conversation="activeConversation" 
                                            :name="uid" 
                                            :shownName = "shownChatName"
                                            :authorName = "name"
                                            :receiverName = "receiverName"
                                            @reverse-chat-list="reverseChatList()"
                                        />
                                    </div>
                                    <div v-else class="no-chat" v-if="!isScreenMediumOrLess()">
                                        <h3>Select a chat to start messaging</h3>
                                    </div>
                                </transition>
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
            isConnected: false,
            uid: "",
            matches:[],
            showChatList: true,
            shownChatName: "",
            receiverName: "",
            windowWidth: window.innerWidth
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
                await joinedConversation.add(user2).catch(err => console.log("error: ", err))
                await joinedConversation.add("NeverAlone").catch(err => console.log("error: ", err))
                this.activeConversation = joinedConversation
            } catch {
                this.activeConversation = await (this.conversationsClient.getConversationByUniqueName(chatName))
            }
        },
        joinConversation: async function(user2, chatName) {
            this.activeConversation = null
            this.createConversation(user2 ,chatName)
        },
        showList() {
            if(this.isScreenMediumOrLess()){
                if(this.showChatList){
                    return true;
                }
                return false;
            }
            return true;
        },
        showConversation() {
            if(this.isScreenMediumOrLess()){
                if(!this.showChatList){
                    return true;
                }
                return false;
            }
            return true;
        },
        isScreenMediumOrLess() {
            return this.windowWidth <= 960;
        },
        reverseChatList(){
            this.activeConversation = null
            this.showChatList = !this.showChatList;
        },
        handleResize() {
            this.windowWidth = window.innerWidth;
            console.log("Window resized to:", window.innerWidth);
            if(this.isScreenMediumOrLess()){
                this.showChatList = !this.activeConversation;
            }
            else{
                this.showChatList = true;
            }
            console.log(this.showChatList);
        }
    },
    async mounted() {

        window.addEventListener("resize", this.handleResize);

        const auth = getAuth();

        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in
                
                this.uid = user.uid
                axios.get('/user/'+user.uid)
                    .then(response =>{
                        // handle success
                        console.log(response.data)
                        this.name = response.data.name
                        for(var item of response.data.matches){
                            this.matches.push(item)
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
    },

    beforeDestroy() {
        window.removeEventListener("resize", this.handleResize);
    }
}


</script>

<style scoped>

@media (max-width: 769px){
    ::v-deep .main-content {
        display:none;
    }

    .v-container{
        height: 100%;
        max-width: 98%;
    }

    .chat-container{
        height: calc(100% - 90px);
    }
}

@media (min-width: 769px){ 
    .v-container {
        height: 100%;
        max-width: 85%;
    }

    .chat-container{
        height: calc(100% - 100px);
    }
}

#chat {
    background: linear-gradient(to bottom, #FD0E42, #C30F31);
}

.v-col {
    height: 100%;
    padding: 0px;
}

.v-row {
    height: 100%;
    overflow: hidden;
}

.chat-list-col{
    height: 100%;
}

.chat-list-col{
    height: 100%;
    overflow-y: auto;
}

.conversation-col {
    position: relative;
    height: 100%;
}

.chat-container {
    background: white;
    overflow: hidden;
    border-radius: 10px;
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

/* Custom scrollbar styling */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-thumb {
  border-radius: 20px;
  background: linear-gradient(to bottom, #FD0E42, #C30F31);
  border: 2px solid transparent;
  background-clip: content-box;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>