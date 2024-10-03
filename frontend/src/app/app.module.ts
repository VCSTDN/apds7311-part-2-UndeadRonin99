// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'; // Import BrowserModule
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { RouterModule } from '@angular/router'; // Import RouterModule if using routing

import { AppComponent } from './app.component'; // Import AppComponent
import { PaymentFormComponent } from './components/payment-form/payment-form.component'; // Import PaymentFormComponent
import { appRoutes } from './app.routes'; // Import your routes if using routing

@NgModule({
  declarations: [ // Add declarations array
    AppComponent,
    PaymentFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes) // Include RouterModule with routes if using routing
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
