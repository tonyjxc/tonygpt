import { Component, OnInit } from '@angular/core';
import { backendService } from './backend.service';
import * as marked from 'marked';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  question: string = '';
  id = 2;
  botPool: any = [
    {
      'gpt4o': '7376235599625895953',
      'gpt4turbo': '7376237551768076289',
      'gpt4ocode': '7376238281664757777'
    },
    {
      'gpt4o': '7377050024372518929'
    },
    {
      'gpt4o': '7377053267182321671'
    },
    {
      'gpt4o': '7377061109939109895'
    },
    {
      'gpt4o': '7377062080744669185'
    },
    {
      'gpt4o': '7377063271486078983'
    }
  ];
  times: { [key: string]: number } = {};
  botDict: { [key: string]: string } = {};
  botOptions: { name: string, id: string }[] = [];
  chooseBotId: string = '';
  chatHistory: any[] = [];
  loading: boolean = false;

  constructor(private chatService: backendService) { }

  ngOnInit() {
    this.id = Math.floor(Math.random() * this.botPool.length);
    console.log(this.id)
    this.botDict = this.botPool[this.id];

    // 更新 botOptions 和 chooseBotId
    this.botOptions = Object.keys(this.botDict).map(key => ({ name: key, id: this.botDict[key] }));
    this.chooseBotId = this.botDict['gpt4o'];

    // 从 JSONBin 加载 times 数据
    this.chatService.getTimes().subscribe(data => {
      this.times = data.record || {};
      console.log(this.times);
    });
  }

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

    this.chatService.sendQuery(this.id, this.question, '123', this.chooseBotId).subscribe(response => {
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

      if (!this.times[this.chooseBotId]) {
        this.times[this.chooseBotId] = 0;
      }
      this.times[this.chooseBotId] += 1;

      // 将 times 数据保存到 JSONBin
      this.chatService.updateTimes(this.times).subscribe();

      this.loading = false;
    });

    this.question = '';
  }

  clearChat() {
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

  getUsageCount(): number {
    return this.times[this.chooseBotId] || 0;
  }
}