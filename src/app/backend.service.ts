import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class backendService {
  private url = 'https://api.coze.com/open_api/v2/chat';
  private jsonbinUrl = 'https://api.jsonbin.io/v3/b/6660a270e41b4d34e4fef832';

  private headers = new HttpHeaders({
    'Authorization': 'Bearer pat_nm0nwg3AxAvzQTcwkbubf0SMwO4ysV4Ga2by0fFU0rF2ol1Hdib5Ezq0HwusY74S',
    'Host': 'api.coze.com',
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'Connection': 'keep-alive'
  });

  private jsonbinHeaders = new HttpHeaders({
    'X-Master-Key': '$2a$10$uedA67cEsLpTwJeNqY7oceXRfT41fvrR2CMRcfIbO2Z4q3kJXq.G2',
    'Content-Type': 'application/json'
  });

  private pool: any = [
    'pat_V0kd9w2oFr1HI2HOApTS1dpyANOlXdkSY1YLtWkUIDrvRZzHD1rhSoBfCpMzooi8',
    'pat_aAOKvTAVp2KqINIDFTldBCxHMzxLWm6VAkw8CfI2PGK1OxcD9EX5aGt37mAIhjEJ',
    'pat_K1DYpjOuTGzcLTN4QFMdeXwOoeWUp3mZpSHDfMK9BbnhQcAidIybloiMthanTVxa',
    'pat_GfQOPNlAvg9jTwVvEl0EZf1NHhfQyr8oOuLuFxwHmm7pMJiPEf54BcENRmZFwnfT',
    'pat_cfQPxtSpOALKXvflFbpWWsSvx47nEGaWmz4ZrZbs9SYRG4J45xMUwmN3clGhcjck',
    'pat_K00oiFyivySxNt6FZImMWtzroiNcagMZULVvoeE5seaCHKqT2ykiQhDlWwDbNThw'
  ];
  private chatHistory: any[] = [];

  constructor(private http: HttpClient) { }

  sendQuery(id: any = 1, query: string, conversationId = '123', botId = '7375488127156895751', user = '29032201862555', stream = false): Observable<any> {
    this.headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.pool[id],
      'Host': 'api.coze.com',
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'Connection': 'keep-alive'
    });

    const data = {
      conversation_id: conversationId,
      bot_id: botId,
      user: user,
      query: query,
      chat_history: this.chatHistory,
      stream: stream
    };
    console.log(this.headers);
    console.log(data);
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

  getTimes(): Observable<any> {
    return this.http.get<any>(`${this.jsonbinUrl}/latest`, { headers: this.jsonbinHeaders });
  }

  updateTimes(times: any): Observable<any> {
    return this.http.put<any>(this.jsonbinUrl, times, { headers: this.jsonbinHeaders });
  }
}