import { Component, OnInit } from '@angular/core'

import { Item } from './item'
import { ItemService } from './item.service'
import { SanarTelemedicine } from 'sanar-telemedicine';

@Component({
  selector: 'ns-items',
  templateUrl: './items.component.html',
})
export class ItemsComponent implements OnInit {
  items: Array<Item>
  version: string

  constructor(private itemService: ItemService) {}

  ngOnInit(): void {
    let version = SanarTelemedicine();
    this.items = this.itemService.getItems();
    this.version = version
  }
}
