import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { backendService } from './backend.service';
import { FormsModule } from '@angular/forms';  // 确保导入 FormsModule
import { MarkdownModule } from 'ngx-markdown';

@NgModule({
  declarations: [
    AppComponent  // 声明 AppComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    MarkdownModule.forRoot()
  ],
  providers: [backendService],
  bootstrap: [AppComponent]  // 引导 AppComponent
})
export class AppModule { }
