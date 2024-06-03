import { Component } from '@angular/core';
import { backendService } from './backend.service';
import * as marked from 'marked';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  question: string = '';
  // botDict: { [key: string]: string } = {
  //   'gpt4o': '7375488127156895751',
  //   'gpt4turbo': '7375503601433231377',
  //   'gpt4ocode': '7375560264613396487'
  // };

  // 第二个账号
  botDict: { [key: string]: string } = {
    'gpt4o': '7376235599625895953',
    'gpt4turbo': '7376237551768076289',
    'gpt4ocode': '7376238281664757777'
  };

  botOptions: { name: string, id: string }[] = Object.keys(this.botDict).map(key => ({ name: key, id: this.botDict[key] }));
  chooseBotId: string = this.botDict['gpt4o'];
  chatHistory: any[] = [];
  loading: boolean = false;


  constructor(private chatService: backendService) { }

  sendQuery() {
    if (this.question.trim() === '') return;

    if (this.question === '\\exit') {
      console.log("退出程序");
      return;
    }

    // 添加用户问题到聊天记录
    this.chatHistory.push({
      role: 'user',
      content: this.question,
      contentType: 'text'
    });

    // 设置加载状态
    this.loading = true;

    this.chatService.sendQuery(this.question, '123', this.chooseBotId).subscribe(response => {
      response.messages.forEach((message: any) => {
        if (message.type === 'answer') {
          console.log(message.content);
          this.chatService.updateChatHistory('assistant', message.content);
          this.chatHistory.push({
            role: 'assistant',
            content: marked.parse(message.content),  // 使用 marked 解析 Markdown
            contentType: 'html'  // 将内容类型设置为 HTML
          });
        }
      });
      this.loading = false;
    });

    this.question = '';
  }

  clearChat() {
    this.chatService.clearChatHistory();
    this.chatHistory = [];
    console.log("聊天记录已清空");
  }

  changeMode(botId: string) {
    this.chooseBotId = botId;
    console.log(`已切换到模型：${botId}`);
  }

  handleKeydown(event: KeyboardEvent) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      this.sendQuery();
    }
  }
}
