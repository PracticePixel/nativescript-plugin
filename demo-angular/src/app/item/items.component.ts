import { Component, OnInit } from '@angular/core'
import { Utils, Dialogs } from '@nativescript/core';
import { Item } from './item'
import { ItemService } from './item.service'
import { SanarTelemedicine, InAppBrowser, NSAdvancedWebViewEventEmitter } from 'sanar-telemedicine';

@Component({
  selector: 'ns-items',
  templateUrl: './items.component.html',
})
export class ItemsComponent implements OnInit {
  items: Array<Item>
  version: string

  constructor(private itemService: ItemService) { }

  ngOnInit(): void {
    let version = SanarTelemedicine();
    this.items = this.itemService.getItems();
    this.version = version
  }

  async onTap(url: string) {
    try {
      if (url) {
        // Launch & Closed event listners
        NSAdvancedWebViewEventEmitter.once("ON_CLOSED", () => {
          console.log('CLOSED');
        });

        NSAdvancedWebViewEventEmitter.once("LAUNCHED", () => {
          console.log('LAUNCHED_FINISHED');
        });

        NSAdvancedWebViewEventEmitter.once("ERROR", () => {
          console.log('LOAD_ERROR');
        });

        if (await InAppBrowser.isAvailable()) {
          const result = await InAppBrowser.open(url, {
            // iOS Properties
            dismissButtonStyle: 'close',
            preferredBarTintColor: '#FFFFFF',
            preferredControlTintColor: 'blue',
            readerMode: false,
            animated: true,
            modalPresentationStyle: 'fullScreen',
            modalTransitionStyle: 'coverVertical',
            modalEnabled: true,
            enableBarCollapsing: false,
            // Android Properties
            showTitle: false,
            toolbarColor: '#FFFFFF',
            secondaryToolbarColor: 'black',
            navigationBarColor: 'black',
            navigationBarDividerColor: 'white',
            enableUrlBarHiding: true,
            enableDefaultShare: true,
            forceCloseOnRedirection: false,
            // Specify full animation resource identifier(package:anim/name)
            // or only resource name(in case of animation bundled with app).
            animations: {
              startEnter: 'slide_in_right',
              startExit: 'slide_out_left',
              endEnter: 'slide_in_left',
              endExit: 'slide_out_right'
            },
            headers: {
              'my-custom-header': 'my custom header value'
            },
            hasBackButton: true,
            browserPackage: '',
            showInRecents: false
          });
        }
        else {
          Utils.openUrl(url);
        }
      } else {
        alert('Please provide consultation url');
      }
    }
    catch (error) {
      Dialogs.alert({
        title: 'Error',
        message: error.message,
        okButtonText: 'Ok'
      });
    }
  }
}
