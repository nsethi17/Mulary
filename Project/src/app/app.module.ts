import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';  
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SongsComponent } from './songs/songs.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SongsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule   
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
