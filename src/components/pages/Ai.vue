<template>
   <div class="chat-container">
    <div class="chat-messages" ref="chatMessages">
      <div v-for="(message, index) in messageList" :key="index" class="message">
        <div :class="`bubble ${message.author}`">
          <p>{{ message.data.text }}</p>
        </div>
      </div>
    </div>
    <div class="chat-input">
      <input type="text" v-model="userInput" @keyup.enter="sendMessage" placeholder="输入你的消息...">
      <button @click="sendMessage">发送</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name:"ai",
  data() {
    return {
      userInput: '',
      messageList: []
    };
  },
  methods: {
    sendMessage() {
      if (this.userInput.trim() === '') {
        return;
      }

      // 添加用户消息到聊天记录
      this.messageList.push({
        type: 'text',
        author: 'user',
        data: { text: this.userInput }
      });

      // 调用 ai 方法发送消息到后端 API
      this.ai(this.userInput);
      console.log(this.userInput);

      // 清空输入框
      this.userInput = '';
    },
    
    ai(content) {
      console.log(content);
      axios.get("/api?content="+content)
      .then((response) => {
        // 请求成功时，将聊天内容显示到页面上
        console.log("后端连接成功");
        this.messageList.push({
          type: 'text',
          author: 'ai',
          data: { text: response.data }
        });
      })
      .catch(error => {
        // 请求失败时，打印错误信息
        console.error('There has been a problem with your axios operation:', error);
      });
    }
  }
};
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  max-width: 100%;
  margin: 20px auto;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.chat-messages {
  flex: 1;
  padding: 20px;
  background-color: #f9f9f9;
  overflow-y: scroll;
}

.message {
  margin-bottom: 10px;
  text-align: left;
  display: flex;
  align-items: center;
}

.bubble {
  position: relative;
  background: #f3f3f3;
  padding: 10px 15px;
  border-radius: 15px;
  word-wrap: break-word;
  max-width: 70%;
}

.bubble.user {
  margin-left: auto;
  align-self: flex-end;
  background-color: #007bff;
  color: white;
}

.bubble.ai {
  margin-right: auto;
  align-self: flex-start;
  background-color: #cfcece;
  color: rgb(0, 0, 0);
}

.chat-input {
  display: flex;
  padding: 10px;
  background-color: #ffffff;
  border-top: 1px solid #e5e5e5;
}

.chat-input input {
  flex: 1;
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #e5e5e5;
  border-radius: 5px;
  font-size: 16px;
}

.chat-input button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.chat-input button:hover {
  background-color: #0056b3;
}
</style>
