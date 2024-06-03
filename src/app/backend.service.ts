import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class backendService {
  private url = 'https://api.coze.com/open_api/v2/chat';

  private headers = new HttpHeaders({
    'Authorization': 'Bearer pat_nm0nwg3AxAvzQTcwkbubf0SMwO4ysV4Ga2by0fFU0rF2ol1Hdib5Ezq0HwusY74S',
    'Host': 'api.coze.com',
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'Connection': 'keep-alive'
  });

  private chatHistory: any[] = [];

  constructor(private http: HttpClient) { }

  sendQuery(id:any=1, query: string, conversationId = '123', botId = '7375488127156895751', user = '29032201862555', stream = false): Observable<any> {
    if(id==2){
        this.headers = new HttpHeaders({
          'Authorization': 'Bearer pat_V0kd9w2oFr1HI2HOApTS1dpyANOlXdkSY1YLtWkUIDrvRZzHD1rhSoBfCpMzooi8',
          'Host': 'api.coze.com',
          'Content-Type': 'application/json',
          'Accept': '*/*',
          'Connection': 'keep-alive'
        });
    }

    const data = {
      conversation_id: conversationId,
      bot_id: botId,
      user: user,
      query: query,
      chat_history: this.chatHistory,
      stream: stream
    };
      console.log(this.headers)
      console.log(data)
    return this.http.post<any>(this.url, JSON.stringify(data), { headers: this.headers });
  }

  updateChatHistory(role: string, content: string, type: string = 'text') {
    this.chatHistory.push({
      role: role,
      content: content,
      content_type: type
    });
  }

  getChatHistory() {
    return this.chatHistory;
  }

  clearChatHistory() {
    this.chatHistory = [];
  }
}