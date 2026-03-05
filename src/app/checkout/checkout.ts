import { Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-checkout',
  imports: [TabsModule, ButtonModule, CardModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout {}
