var Intent = android.content.Intent;
var NfcAdapter = android.nfc.NfcAdapter;
var Arrays = java.util.Arrays;
import { AndroidApplication, Application, Utils, } from "@nativescript/core";
import { BROWSER_TYPES, } from "./sanar-telemedicine.common";
export function useAndroidX() {
    return global.androidx && global.androidx.browser;
}
export const CustomTabsIntent = (useAndroidX() ? androidx.browser : android.support).customtabs.CustomTabsIntent;
export const CustomTabsClient = (useAndroidX() ? androidx.browser : android.support).customtabs.CustomTabsClient;
export const CustomTabsServiceConnection = (useAndroidX() ? androidx.browser : android.support).customtabs.CustomTabsServiceConnection;
export const CustomTabsService = (useAndroidX() ? androidx.browser : android.support).customtabs.CustomTabsService;
export const CustomTabsCallback = (useAndroidX() ? androidx.browser : android.support).customtabs.CustomTabsCallback;
export const ColorUtils = (useAndroidX() ? androidx.core.graphics : android.support.v4.graphics).ColorUtils;
export const CHROME_PACKAGE_STABLE = "com.android.chrome";
export const CHROME_PACKAGE_BETA = "com.chrome.beta";
export const CHROME_PACKAGE_DEV = "com.chrome.dev";
export const LOCAL_PACKAGE = "com.google.android.apps.chrome";
export const ACTION_CUSTOM_TABS_CONNECTION = "android.support.customtabs.action.CustomTabsService";
export const ARROW_BACK_BLACK = "ic_arrow_back_black";
export const ARROW_BACK_WHITE = "ic_arrow_back_white";
export const DISMISSED_EVENT = "DismissedEvent";
let _redirectHandler;
let initialUrl = "";
export const getDrawableId = Utils.ad.resources.getDrawableId;
export function getInitialURL(activity) {
    if (activity) {
        const intent = activity.getIntent();
        const action = intent.getAction();
        const uri = intent.getData();
        if (uri !== null &&
            (Intent.ACTION_VIEW === action ||
                NfcAdapter.ACTION_NDEF_DISCOVERED === action)) {
            const url = "" + uri;
            if (url === initialUrl)
                return null;
            initialUrl = url;
            return url;
        }
    }
    return null;
}
function waitForRedirectAsync(returnUrl) {
    return new Promise((resolve) => {
        _redirectHandler = (args) => {
            const url = getInitialURL(args.android);
            if (url && url.startsWith(returnUrl)) {
                resolve({ url: url, type: BROWSER_TYPES.SUCCESS });
            }
        };
        Application.on(Application.resumeEvent, _redirectHandler);
    });
}
function handleAppStateActiveOnce() {
    return new Promise(function (resolve) {
        if (!Application.android.paused && Application.android.foregroundActivity) {
            resolve(Application.android.foregroundActivity);
        }
        function handleAppStateChange(args) {
            resolve(args.activity);
        }
        Application.android.once(AndroidApplication.activityResumedEvent, handleAppStateChange);
    });
}
async function checkResultAndReturnUrl(returnUrl, result) {
    if (Application.android && result.type !== BROWSER_TYPES.CANCEL) {
        try {
            const activity = await handleAppStateActiveOnce();
            const url = getInitialURL(activity);
            return url && url.startsWith(returnUrl)
                ? { url: url, type: BROWSER_TYPES.SUCCESS }
                : result;
        }
        catch (error) {
            return result;
        }
    }
    return result;
}
export async function openAuthSessionPolyfillAsync(open, returnUrl) {
    return await Promise.race([
        open().then(function (result) {
            return checkResultAndReturnUrl(returnUrl, result);
        }),
        waitForRedirectAsync(returnUrl),
    ]);
}
export function closeAuthSessionPolyfillAsync() {
    if (_redirectHandler) {
        Application.off(Application.resumeEvent, _redirectHandler);
        _redirectHandler = null;
    }
}
export function getPreferredPackages(context) {
    const serviceIntent = new Intent(ACTION_CUSTOM_TABS_CONNECTION);
    const resolveInfos = context
        .getPackageManager()
        .queryIntentServices(serviceIntent, 0);
    return resolveInfos;
}
export function toolbarIsLight(themeColor) {
    return ColorUtils.calculateLuminance(themeColor) > 0.5;
}
export function getDefaultBrowser(context) {
    const resolveInfos = getPreferredPackages(context);
    const packageName = CustomTabsClient.getPackageName(context, Arrays.asList([
        CHROME_PACKAGE_STABLE,
        CHROME_PACKAGE_BETA,
        CHROME_PACKAGE_DEV,
        LOCAL_PACKAGE,
    ]));
    if (packageName == null && resolveInfos != null && resolveInfos.size() > 0) {
        return resolveInfos.get(0).serviceInfo.packageName;
    }
    return packageName;
}
//# sourceMappingURL=utils.android.js.map