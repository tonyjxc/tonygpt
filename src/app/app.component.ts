import { Component } from '@angular/core';
import { backendService } from './backend.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  question: string = '';
  botDict: { [key: string]: string } = {
    'gpt4o': '7375488127156895751',
    'gpt4turbo': '7375503601433231377',
    'gpt4ocode': '7375560264613396487'
  };
  chooseBotId: string = this.botDict['gpt4o'];
  chatHistory: any[] = [];

  constructor(private chatService: backendService) { }

  sendQuery() {
    if (this.question === '\\clear') {
      this.chatService.clearChatHistory();
      this.chatHistory = [];
      console.log("聊天记录已清空");
    } else if (this.question === '\\changemode') {
      console.log("可选模型：", Object.keys(this.botDict));
      const aimode = prompt("请选择你需要的模型：");
      if (aimode && this.botDict[aimode]) {
        this.chooseBotId = this.botDict[aimode];
        console.log(`已切换到模型：${aimode}`);
      } else {
        console.log("无效的模型名称，请重新选择");
      }
    } else if (this.question === '\\exit') {
      console.log("退出程序");
    } else {
      this.chatService.sendQuery(this.question, '123', this.chooseBotId).subscribe(response => {
        response.messages.forEach((message: any) => {
          if (message.type === 'answer') {
            console.log(message.content);
            this.chatService.updateChatHistory('assistant', message.content);
            this.chatHistory.push({
              role: 'assistant',
              content: message.content
            });
          }
        });
        this.chatService.updateChatHistory('user', this.question);
        this.chatHistory.push({
          role: 'user',
          content: this.question
        });
      });
    }
    this.question = '';
  }
}