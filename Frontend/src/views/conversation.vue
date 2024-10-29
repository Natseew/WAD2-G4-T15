<template>
    <div id="conversation">
      <div class="chat-title">
        <span class="back-button pi pi-chevron-left d-lg-none" @click="$emit('reverse-chat-list')"></span>
        <span>{{ shownName }} </span>
      </div>
      <div class="conversation-container">
        <div 
          v-for="(message, index) in messages" 
          :key="message.index"
          class="bubble-container"
          :class="{ 
            myMessage: message?.state?.author === name,
            senderMessage: message?.state?.author !== name,
            noAvatar: shouldHideAvatar(message, index)
          }"
        >
          <div class="message-row">
            <div class="bubble">
              <div class="name" v-if="message?.state?.author !== name">{{ message?.state?.author === name ? authorName : receiverName }}</div>
              <div class="message">{{ message?.state?.body }}</div>
            </div>
            <div class="flex items-end chat-profile" v-if="!shouldHideAvatar(message, index)">
              <v-avatar color="surface-variant" rounded="1">
                <v-img
                  src="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" 
                >
                </v-img>
              </v-avatar>
            </div>
          </div>
        </div>
      </div>
      <div class="input-container">
        <input @keyup.enter="sendMessage" v-model="messageText" placeholder="Enter your message">
        <button class="pi pi-send" @click="sendMessage"></button>
      </div>
    </div>
</template>

<script>
import "primeicons/primeicons.css";

export default {
    props: ["activeConversation", "name", "shownName", "authorName", "receiverName"],
    data() {
        return {
            messages: [],
            messageText: "",
            isSignedInUser: false
        }
    },
    mounted() {
    this.activeConversation.getMessages()
        .then((newMessages) => {
            this.messages = [...this.messages, ...newMessages.items]
        })
    this.activeConversation.on("messageAdded", (message) => {
        this.messages = [...this.messages, message]
    })
},
methods: {
    sendMessage: function() {
        this.activeConversation.sendMessage(this.messageText)
            .then(() => {
                this.messageText = ""
            })
    },
    shouldHideAvatar(message, index) {
        // First get the next message
        const nextMessage = this.messages[index + 1];
                
        // Hide avatar if next message is also from the current user
        return nextMessage && nextMessage.state.author === message.state.author;

    }
  }
}
</script>

<style scoped>
/* Main conversation area */

@media (max-width: 769px){
  .conversation-container {
    max-height: calc(100vh - 250px);
  }
}

@media (min-width: 769px){ 
  .conversation-container {
    max-height: calc(100vh - 310px);
    padding: 20px;
  }
}

#conversation {
  width: 100%;
  background-color: white;
  border-radius: 20px;
}

/* Messages container with overflow scrolling */
.conversation-container {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

/* Row for each message bubble and avatar */
.message-row{
  display: flex;
}

/* Styles for avatar in the chat */
.chat-profile {
  margin: 10px;
}

/* Chat title styling */
.chat-title {
  text-align: left;
  padding: 15px 16px 5px 0;
  font-weight: bold;
  font-size: 20px;
  color: rgba(0, 0, 0, 0.87);
  background: #fff;
}

/* Bubble container with alignment for sent vs received messages */
.bubble-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

/* Message bubble styling */
.bubble {
  border: 2px solid #f1f1f1;
  background-color: #fdfbfa;
  border-radius: 5px;
  padding: 10px;
  margin: 10px 0;
  min-width: 80px;
  max-width: 230px;
  text-align: left;
}

/* Styling for the sender's own messages */
.bubble-container.myMessage {
  align-items: flex-end;
}

/* Styling for the matches messages */
.bubble-container.senderMessage .message-row{
  flex-direction: row-reverse;
}

.noAvatar .message-row .bubble{
  margin-bottom: 0px;
}

/*Style positioning of bubble */
.myMessage.noAvatar .bubble{
  margin-right: 60px;
}

.senderMessage.noAvatar .bubble{
  margin-left: 60px;
}

.back-button{
  margin: auto 10px;
}

.myMessage .bubble {
  background-color: #abf1ea;
  border: 2px solid #87E0D7;
}

.name {
  padding-right: 8px;
  font-size: 11px;
}

/* Input container for message entry */
.input-container {
  position: absolute;
  bottom: 15px;
  right: 30px;
  left: 30px;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 10px;
  max-width: 85%;
  margin: auto;
  padding: 5px 5px 5px 5px;
  border-radius: 10px;
  border: 2px solid #FD0E42;
  background-color: white;
}

.input-container input {
  padding: 10px;
  font-size: clamp(13px, 1.5vw, 16px);
  border: none;
  outline: none;
  width: 100%;
}

.input-container button {
  background-color: #FD0E42;
  border: none !important;
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
}

.input-container button:hover {
  background-color: #c10d36;
}

input:focus {
  box-shadow: none;
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