import Context = android.content.Context;
import ComponentName = android.content.ComponentName;
import CustomTabsClient = androidx.browser.customtabs.CustomTabsClient;
import { CustomTabsServiceConnection } from "./utils.android";
declare class CustomTabsController extends CustomTabsServiceConnection {
    private static readonly TAG;
    private readonly context;
    static customTabsClient: CustomTabsClient;
    constructor(context: Context);
    onCustomTabsServiceConnected(_: ComponentName, client: CustomTabsClient): void;
    onServiceDisconnected(_: ComponentName): void;
}
export { CustomTabsController };
