<template>
    <div id="conversation" class="h-100">
      <div class="conversation-container">
        <div 
          v-for="message in messages" :key="message.index"
          class="bubble-container"
          :class="{ myMessage: message?.state?.author === name }"
        >
          <div class="message-row">
            <div class="bubble">
              <div class="name">{{ message?.state?.author }}:</div>
              <div class="message">{{ message?.state?.body }}</div>
            </div>
            <div class="flex items-end chat-profile">
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
    props: ["activeConversation", "name"],
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
    }
}
}
</script>

<style scoped>

#conversation{
  width: 100%;
  background-color: white;
  border-radius: 20px;
}
.conversation-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    max-height: 77vh;
    padding: 20px;
    overflow-y: auto;
}

.message-row{
  display: flex;
}

.chat-profile{
  margin: 10px;
}

.bubble-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.bubble {
 border: 2px solid #f1f1f1;
 background-color: #fdfbfa;
 border-radius: 5px;
 padding: 10px;
 margin: 10px 0;
 width: 230px;
 text-align: left;
}

.bubble-container.myMessage {
  align-items: flex-start;
}
 
.myMessage .bubble {
 background-color: #abf1ea;
 border: 2px solid #87E0D7;
}
 
.name {
 padding-right: 8px;
 font-size: 11px;
}

.input-container{
  position: absolute;
  bottom: 10px;
  right: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 90%;
  margin: auto;
  padding: 5px;
  border-radius: 10px;
  border: 2px solid #FD0E42;
}

.input-container input {
  flex-grow: 1; 
  padding: 10px;
  border-radius: 5px;
  margin-right: 10px;
}

.input-container button {
  background-color: #FD0E42;
  border: none !important;
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
}

input:focus{
  box-shadow: none;
}

.input-container button:hover {
  background-color: #c10d36;
}
 
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