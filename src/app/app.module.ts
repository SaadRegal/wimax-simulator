import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


/*=== Angular Modules ===*/
import {RouterModule, Routes} from '@angular/router';

/*=== Component ===*/
import {AppComponent} from './app.component';
import {HomeComponent} from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';


const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,

  },
  {
    path: 'about',
    component: AboutComponent,

  }];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
