<template>
    <div id="chat">
        <v-container class="h-screen d-flex flex-column">
            <Navbar class="navbar"/>
            <v-row>
                <v-col cols="12" v-if="isConnected">
                    <div class="chat-container" v-if="matches.length > 0">
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
                                                        <v-img 
                                                            :src="latestMessages[item.chatName]?.receiverProfile || 'https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png'"
                                                        />
                                                    </Avatar>
                                                    <div class="d-flex flex-column align-start">
                                                        <span class="font-bold">{{ item.name }}</span>
                                                        <span v-if="latestMessages[item.chatName]" class="message-text"> 
                                                            {{ latestMessages[item.chatName]?.sender }}: {{ latestMessages[item.chatName]?.body }} 
                                                        </span>
                                                        <span v-else class="message-text">
                                                            No Message Yet
                                                        </span>
                                                    </div>
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
                                            :userImage = "userImage"
                                            :receiverImage = "latestMessages[activeConversation.uniqueName]?.receiverProfile"
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
                    <div v-else class="no-matches-message">
                        Keep looking for love.
                    </div>
                </v-col>

                <v-col cols="12" v-else class="h-screen w-full flex flex-col items-center justify-center">
                    <div class="heart"></div>
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
import "primeicons/primeicons.css";
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
            userImage: "",
            matches:[],
            latestMessages: {},
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

        async fetchLatestMessage(match) {
            try {
                const userResponse = await axios.get('/user/' + match.uid);
                const receiverProfile = userResponse.data.images?.length > 0 ? 
                    userResponse.data.images[0] : 
                    "https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png";
                
                const conversation = await this.conversationsClient.getConversationByUniqueName(match.chatName);
                const messages = await conversation.getMessages(1); // Get only the latest message

                if (messages.items.length > 0) {
                    const latestMessage = messages.items[0];
                    const senderName = latestMessage.author === this.uid ? "You" : this.receiverName; 

                    // Update the latestMessages object with both sender and message body
                    this.latestMessages = {
                        ...this.latestMessages,
                        [match.chatName]: {
                            body: latestMessage.body,
                            sender: senderName,
                            receiverProfile: receiverProfile
                        }
                    };
                }
            } catch (error) {
                console.error(`Error fetching latest message for ${match.chatName}:`, error);
                this.latestMessages = {
                    ...this.latestMessages,
                    [match.chatName]: {
                        body: 'No messages yet',
                        sender: '',
                        receiverProfile: "https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
                    }
                };
            }
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
            if(this.isScreenMediumOrLess()){
                this.showChatList = !this.activeConversation;
            }
            else{
                this.showChatList = true;
            }
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
                        this.userImage = response.data.images[0]
                        for(var item of response.data.matches){
                            this.matches.push(item)
                            this.fetchLatestMessage(item);
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
 background: linear-gradient(180deg, #ffa578, rgb(255, 128, 192), #a67bf5);
  background-size: 400% 400%;
  animation: spin-gradient 15s ease infinite;

}

@keyframes spin-gradient {
            0% {
                background-position: 0% 50%; /* Start from the left */
            }
            25% {
                background-position: 100% 50%; /* Move to the right */
            }
            50% {
                background-position: 100% 0%; /* Move to the top */
            }
            75% {
                background-position: 0% 0%; /* Move to the left */
            }
            100% {
                background-position: 0% 50%; /* Move back to the original position */
            }
        }

.v-col {
    height: 100%;
    padding: 0px;
}

.v-row {
    height: 100%;
    overflow: hidden;
}

.v-list{
    background: transparent;
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
    background: rgba(255,255,255);
    border-radius: 10px;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);;
    border: 1px solid rgba(255,255,255,0.5);
}

.chat-list {
    margin: 8px;
}

.chat-list .v-list-item {
    border-radius: 10px !important;
    margin-bottom: 10px !important;
}

.chat-list .v-list-item .message-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 16rem;
    font-size: 15px; 
}

.chat-list .v-list-item:hover {
    background-color: rgba(0, 0, 0, 0.1);
}

.chat-list .v-list-item.active-chat {
  /* Create gradient border effect */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    padding: 3px; /* Border width */
    background: conic-gradient(
      from var(--angle),
      #c58550 25%,
      #ffb3b3,
      #B0190F 75%,
      #c58550 
    );
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    --angle: 0deg;
    animation: rotate 3s linear infinite;
  }
}

/* Rotation animation */
@keyframes rotate {
  to {
    --angle: 360deg;
  }
}

/* Support for @property (modern browsers) */
@property --angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}

.no-chat {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(0, 0, 0, 0.6);
}

/* Heart Loading*/
.heart {
    position: absolute;
    margin: auto;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: white;
    height: 50px;
    width: 50px;
    transform: rotate(-45deg);
    animation-name: beat;
    animation-duration: 1s;
    animation-iteration-count: infinite;
}

.heart:after {
    background-color: white;
    content: "";
    border-radius: 50%;
    position: absolute;
    width: 50px;
    height: 50px;
    top: 0px;
    left: 25px;
}
  .heart:before {
    background-color: white;
    content: "";
    border-radius: 50%;
    position: absolute;
    width: 50px;
    height: 50px;
    top: -25px;
    left: 0px;
}

.no-matches-message {
    color: #fff;
    font-size: 1.5rem;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%; 
    animation: stackAnimation 0.8s ease forwards;
}

@keyframes stackAnimation {
  from {
    transform: translateY(100%) scale(0.9);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

@keyframes beat {
    0% {
      transform: scale(1) rotate(-45deg);
    }
    50% {
      transform: scale(0.6) rotate(-45deg);
    }
}

/* Custom scrollbar styling */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-thumb {
  border-radius: 20px;
  background: linear-gradient(to bottom, #B0190F, #c58550);
  border: 2px solid transparent;
  background-clip: content-box;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>