import Context = android.content.Context;
import Intent = android.content.Intent;
import Bundle = android.os.Bundle;
import { Observable } from "@nativescript/core";
declare class ChromeTabsEvent extends Observable {
    message: string;
    resultType: string;
    isError: boolean;
}
declare const BROWSER_ACTIVITY_EVENTS: ChromeTabsEvent;
declare class ChromeTabsManagerActivity extends android.app.Activity {
    private mOpened;
    private resultType;
    private isError;
    constructor();
    onCreate(savedInstanceState?: Bundle): void;
    onResume(): void;
    onDestroy(): void;
    onNewIntent(intent: Intent): void;
    onRestoreInstanceState(savedInstanceState: Bundle): void;
    onSaveInstanceState(savedInstanceState: Bundle): void;
}
declare const createStartIntent: (context: Context, authIntent: Intent) => Intent;
declare const createDismissIntent: (context: Context) => Intent;
declare const createBaseIntent: (context: Context) => Intent;
export { BROWSER_ACTIVITY_EVENTS, ChromeTabsEvent, createStartIntent, createDismissIntent, createBaseIntent, ChromeTabsManagerActivity, };
