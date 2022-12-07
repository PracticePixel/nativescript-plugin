// import { Common } from './sanar-telemedicine.common';
import { SanarViewActivityEvents } from './interfaces';
export { SanarViewActivityEvents } from './interfaces';
export const NSAdvancedWebViewEventEmitter = new Observable();
var Uri = android.net.Uri;
var Build = android.os.Build;
var Bundle = android.os.Bundle;
var TextUtils = android.text.TextUtils;
var Intent = android.content.Intent;
var BitmapFactory = android.graphics.BitmapFactory;
var Browser = android.provider.Browser;
var Pattern = java.util.regex.Pattern;
var ArrayList = java.util.ArrayList;
var Log = android.util.Log;
import { Application, Utils, Observable} from "@nativescript/core";
import { BROWSER_ACTIVITY_EVENTS, createDismissIntent, createStartIntent, } from "./ChromeTabsManagerActivity";
import { CustomTabsController } from "./CustomTabsServiceConnection";
import { BROWSER_TYPES, getDefaultOptions, } from "./sanar-telemedicine.common";
import { ARROW_BACK_BLACK, ARROW_BACK_WHITE, closeAuthSessionPolyfillAsync, CustomTabsCallback, CustomTabsClient, CustomTabsIntent, CustomTabsService, DISMISSED_EVENT, getDefaultBrowser, getDrawableId, getPreferredPackages, openAuthSessionPolyfillAsync, toolbarIsLight, } from "./utils.android";
import { tryParseColor } from "./utils.common";
let InAppBrowserModuleInstance;

function setup() {
    var InAppBrowserModule = /** @class */ (function (_super) {
    __extends(InAppBrowserModule, _super);
    function InAppBrowserModule() {
        var _this = _super.call(this) || this;
        _this.animationIdentifierPattern = Pattern.compile("^.+:.+/");
        return global.__native(_this);
    }
    InAppBrowserModule.prototype.isAvailable = function () {
        var context = Utils.android.getApplicationContext();
        var resolveInfos = getPreferredPackages(context);
        return Promise.resolve(!(resolveInfos === null || resolveInfos.isEmpty()));
    };
    InAppBrowserModule.prototype.open = function (url, options) {
        return __awaiter(this, void 0, Promise, function () {
            var mOpenBrowserPromise, result_1, result, inAppBrowserOptions, builder, colorString, color, color, color, color, context, animations, customTabsIntent, intent, keyHeaders, headers, key, packageName, packageName;
            return __generator(this, function (_a) {
                mOpenBrowserPromise = InAppBrowserModule.redirectResolve;
                if (mOpenBrowserPromise) {
                    this.flowDidFinish();
                    result_1 = {
                        type: BROWSER_TYPES.CANCEL,
                    };
                    return [2 /*return*/, Promise.resolve(result_1)];
                }
                this.currentActivity =
                    Application.android.foregroundActivity ||
                        Application.android.startActivity;
                if (!this.currentActivity) {
                    return [2 /*return*/, Promise.reject(new Error(InAppBrowserModule.ERROR_CODE))];
                }
                
                result = new Promise(function (resolve, reject) {
                    InAppBrowserModule.redirectResolve = resolve;
                    InAppBrowserModule.redirectReject = reject;
                });
                inAppBrowserOptions = getDefaultOptions(url, options);
                builder = new CustomTabsIntent.Builder();
                colorString = inAppBrowserOptions[InAppBrowserModule.KEY_TOOLBAR_COLOR];
                this.isLightTheme = false;
                if (colorString) {
                    color = tryParseColor(colorString, "Invalid toolbar color");
                    if (color) {
                        builder.setToolbarColor(color.android);
                        this.isLightTheme = toolbarIsLight(color.android);
                    }
                }
                colorString =
                    inAppBrowserOptions[InAppBrowserModule.KEY_SECONDARY_TOOLBAR_COLOR];
                if (colorString) {
                    color = tryParseColor(colorString, "Invalid secondary toolbar color");
                    if (color) {
                        builder.setSecondaryToolbarColor(color.android);
                    }
                }
                colorString =
                    inAppBrowserOptions[InAppBrowserModule.KEY_NAVIGATION_BAR_COLOR];
                if (colorString) {
                    color = tryParseColor(colorString, "Invalid navigation bar color");
                    if (color) {
                        builder.setNavigationBarColor(color.android);
                    }
                }
                colorString =
                    inAppBrowserOptions[InAppBrowserModule.KEY_NAVIGATION_BAR_DIVIDER_COLOR];
                if (colorString) {
                    color = tryParseColor(colorString, "Invalid navigation bar divider color");
                    if (color) {
                        builder.setNavigationBarDividerColor(color.android);
                    }
                }
                if (inAppBrowserOptions[InAppBrowserModule.KEY_DEFAULT_SHARE_MENU_ITEM]) {
                    builder.addDefaultShareMenuItem();
                }
                context = Utils.android.getApplicationContext();
                if (inAppBrowserOptions[InAppBrowserModule.KEY_ANIMATIONS]) {
                    animations = inAppBrowserOptions[InAppBrowserModule.KEY_ANIMATIONS];
                    this.applyAnimation(context, builder, animations);
                }
                if (inAppBrowserOptions[InAppBrowserModule.KEY_HAS_BACK_BUTTON]) {
                    builder.setCloseButtonIcon(BitmapFactory.decodeResource(context.getResources(), this.isLightTheme
                        ? getDrawableId(ARROW_BACK_BLACK)
                        : getDrawableId(ARROW_BACK_WHITE)));
                }
                customTabsIntent = builder.build();
                intent = customTabsIntent.intent;
                keyHeaders = inAppBrowserOptions[InAppBrowserModule.KEY_HEADERS];
                if (keyHeaders) {
                    headers = new Bundle();
                    for (key in keyHeaders) {
                        if (keyHeaders.hasOwnProperty(key)) {
                            headers.putString(key, keyHeaders[key]);
                        }
                    }
                    intent.putExtra(Browser.EXTRA_HEADERS, headers);
                }
                if (inAppBrowserOptions[InAppBrowserModule.KEY_FORCE_CLOSE_ON_REDIRECTION]) {
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                }
                if (!inAppBrowserOptions[InAppBrowserModule.KEY_SHOW_IN_RECENTS]) {
                    intent.addFlags(Intent.FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS);
                    intent.addFlags(Intent.FLAG_ACTIVITY_NO_HISTORY);
                }
                intent.putExtra(CustomTabsIntent.EXTRA_ENABLE_URLBAR_HIDING, !!inAppBrowserOptions[InAppBrowserModule.KEY_ENABLE_URL_BAR_HIDING]);
                try {
                    
                    if (inAppBrowserOptions[InAppBrowserModule.KEY_BROWSER_PACKAGE] !==
                        undefined) {
                        packageName = inAppBrowserOptions[InAppBrowserModule.KEY_BROWSER_PACKAGE];
                        if (!TextUtils.isEmpty(packageName)) {
                            intent.setPackage(packageName);
                        }
                    }
                    else {
                        packageName = getDefaultBrowser(context);
                        intent.setPackage(packageName);
                    }
                }
                catch (error) {
                    if (error.printStackTrace) {
                        error.printStackTrace();
                    }
                }
                this.registerEvent();
                intent.setData(Uri.parse(url));
                if (inAppBrowserOptions[InAppBrowserModule.KEY_SHOW_PAGE_TITLE]) {
                    builder.setShowTitle(!!inAppBrowserOptions[InAppBrowserModule.KEY_SHOW_PAGE_TITLE]);
                }
                else {
                    intent.putExtra(CustomTabsIntent.EXTRA_TITLE_VISIBILITY_STATE, CustomTabsIntent.NO_TITLE);
                }
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1 &&
                    inAppBrowserOptions[InAppBrowserModule.KEY_INCLUDE_REFERRER]) {
                    intent.putExtra(Intent.EXTRA_REFERRER, Uri.parse("android-app://" + context.getApplicationContext().getPackageName()));
                }
                this.currentActivity.startActivity(createStartIntent(this.currentActivity, intent), customTabsIntent.startAnimationBundle);
                NSAdvancedWebViewEventEmitter.notify({
                    eventName: SanarViewActivityEvents.LAUNCHED
                });
                return [2 /*return*/, result];
            });
        });
    };
    InAppBrowserModule.prototype.close = function () {
        if (!InAppBrowserModule.redirectResolve) {
            return;
        }
        if (!this.currentActivity) {
            InAppBrowserModule.redirectReject(new Error(InAppBrowserModule.ERROR_CODE));
            this.flowDidFinish();
            return;
        }
        BROWSER_ACTIVITY_EVENTS.off(DISMISSED_EVENT);
        var result = {
            type: "dismiss",
        };
        InAppBrowserModule.redirectResolve(result);
        this.flowDidFinish();
        NSAdvancedWebViewEventEmitter.notify({
            eventName: SanarViewActivityEvents.ON_CLOSED
        });
        this.currentActivity.startActivity(createDismissIntent(this.currentActivity));
    };
    InAppBrowserModule.prototype.openAuth = function (url, redirectUrl, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, , 2, 3]);
                        return [4 /*yield*/, openAuthSessionPolyfillAsync(function () { return _this.open(url, options); }, redirectUrl)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        closeAuthSessionPolyfillAsync();
                        this.close();
                        return [7 /*endfinally*/];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    InAppBrowserModule.prototype.closeAuth = function () {
        closeAuthSessionPolyfillAsync();
        this.close();
    };
    InAppBrowserModule.prototype.onEvent = function (event) {
        BROWSER_ACTIVITY_EVENTS.off(DISMISSED_EVENT);
        if (!InAppBrowserModule.redirectResolve) {
            return;
        }
        var browserEvent = event.object;
        if (browserEvent.isError) {
            InAppBrowserModule.redirectReject(new Error(browserEvent.message));
        }
        else {
            InAppBrowserModule.redirectResolve({
                type: browserEvent.resultType,
                message: browserEvent.message,
            });
        }
        this.flowDidFinish();
    };
    InAppBrowserModule.prototype.registerEvent = function () {
        var _this = this;
        BROWSER_ACTIVITY_EVENTS.once(DISMISSED_EVENT, function (e) { return _this.onEvent(e); });
    };
    InAppBrowserModule.prototype.resolveAnimationIdentifierIfNeeded = function (context, identifier) {
        if (this.animationIdentifierPattern.matcher(identifier).find()) {
            return context.getResources().getIdentifier(identifier, null, null);
        }
        else {
            return context
                .getResources()
                .getIdentifier(identifier, "anim", context.getPackageName());
        }
    };
    InAppBrowserModule.prototype.applyAnimation = function (context, builder, animations) {
        var startEnterAnimationId = animations[InAppBrowserModule.KEY_ANIMATION_START_ENTER]
            ? this.resolveAnimationIdentifierIfNeeded(context, animations[InAppBrowserModule.KEY_ANIMATION_START_ENTER])
            : -1;
        var startExitAnimationId = animations[InAppBrowserModule.KEY_ANIMATION_START_EXIT]
            ? this.resolveAnimationIdentifierIfNeeded(context, animations[InAppBrowserModule.KEY_ANIMATION_START_EXIT])
            : -1;
        var endEnterAnimationId = animations[InAppBrowserModule.KEY_ANIMATION_END_ENTER]
            ? this.resolveAnimationIdentifierIfNeeded(context, animations[InAppBrowserModule.KEY_ANIMATION_END_ENTER])
            : -1;
        var endExitAnimationId = animations[InAppBrowserModule.KEY_ANIMATION_END_EXIT]
            ? this.resolveAnimationIdentifierIfNeeded(context, animations[InAppBrowserModule.KEY_ANIMATION_END_EXIT])
            : -1;
        if (startEnterAnimationId !== -1 && startExitAnimationId !== -1) {
            builder.setStartAnimations(context, startEnterAnimationId, startExitAnimationId);
        }
        if (endEnterAnimationId !== -1 && endExitAnimationId !== -1) {
            builder.setExitAnimations(context, endEnterAnimationId, endExitAnimationId);
        }
    };
    InAppBrowserModule.prototype.flowDidFinish = function () {
        NSAdvancedWebViewEventEmitter.notify({
            eventName: SanarViewActivityEvents.ON_CLOSED
        });

        InAppBrowserModule.redirectResolve = null;
        InAppBrowserModule.redirectReject = null;
    };
    InAppBrowserModule.prototype.onStart = function () {
        var context = Utils.android.getApplicationContext();
        var connection = new CustomTabsController(context);
        var packageName = getDefaultBrowser(context);
        if (packageName) {
            CustomTabsClient.bindCustomTabsService(context, packageName, connection);
        }
        else {
            NSAdvancedWebViewEventEmitter.notify({
                eventName: SanarViewActivityEvents.ERROR
            });
            Log.e(InAppBrowserModule.ERROR_CODE, "No browser supported to bind custom tab service");
        }
    };
    InAppBrowserModule.prototype.warmup = function () {
        var customTabsClient = CustomTabsController.customTabsClient;
        if (customTabsClient) {
            return customTabsClient.warmup(long(0));
        }
        return false;
    };
    InAppBrowserModule.prototype.mayLaunchUrl = function (mostLikelyUrl, otherUrls) {
        var customTabsClient = CustomTabsController.customTabsClient;
        if (customTabsClient) {
            var customTabsSession = customTabsClient.newSession(new CustomTabsCallback());
            if (customTabsSession != null) {
                var otherUrlBundles = new ArrayList(otherUrls.length);
                for (var index = 0; index < otherUrls.length; index++) {
                    var link = otherUrls[index];
                    if (link) {
                        var bundle = new Bundle();
                        bundle.putParcelable(CustomTabsService.KEY_URL, Uri.parse(link));
                        otherUrlBundles.add(bundle);
                    }
                }
                customTabsSession.mayLaunchUrl(Uri.parse(mostLikelyUrl), null, otherUrlBundles);
                
            }
        }
    };
    InAppBrowserModule.ERROR_CODE = "InAppBrowser";
    InAppBrowserModule.KEY_TOOLBAR_COLOR = "toolbarColor";
    InAppBrowserModule.KEY_SECONDARY_TOOLBAR_COLOR = "secondaryToolbarColor";
    InAppBrowserModule.KEY_NAVIGATION_BAR_COLOR = "navigationBarColor";
    InAppBrowserModule.KEY_NAVIGATION_BAR_DIVIDER_COLOR = "navigationBarDividerColor";
    InAppBrowserModule.KEY_ENABLE_URL_BAR_HIDING = "enableUrlBarHiding";
    InAppBrowserModule.KEY_SHOW_PAGE_TITLE = "showTitle";
    InAppBrowserModule.KEY_DEFAULT_SHARE_MENU_ITEM = "enableDefaultShare";
    InAppBrowserModule.KEY_FORCE_CLOSE_ON_REDIRECTION = "forceCloseOnRedirection";
    InAppBrowserModule.KEY_ANIMATIONS = "animations";
    InAppBrowserModule.KEY_HEADERS = "headers";
    InAppBrowserModule.KEY_ANIMATION_START_ENTER = "startEnter";
    InAppBrowserModule.KEY_ANIMATION_START_EXIT = "startExit";
    InAppBrowserModule.KEY_ANIMATION_END_ENTER = "endEnter";
    InAppBrowserModule.KEY_ANIMATION_END_EXIT = "endExit";
    InAppBrowserModule.KEY_HAS_BACK_BUTTON = "hasBackButton";
    InAppBrowserModule.KEY_BROWSER_PACKAGE = "browserPackage";
    InAppBrowserModule.KEY_SHOW_IN_RECENTS = "showInRecents";
    InAppBrowserModule.KEY_INCLUDE_REFERRER = "includeReferrer";
    return InAppBrowserModule;
}(java.lang.Object));
    return new InAppBrowserModule();
}
if (typeof InAppBrowserModuleInstance === "undefined") {
    InAppBrowserModuleInstance = setup();
}
export const InAppBrowser = InAppBrowserModuleInstance;
//# sourceMappingURL=InAppBrowser.android.js.map

export function SanarTelemedicine() {
    // var PackageManager = Application.android.context.pm.PackageManager;
    // var pkg = Application.android.context.getPackageManager().getPackageInfo(Application.android.context.getPackageName(),
    //   PackageManager.GET_META_DATA);
    // return pkg.versionName;
    return 'v.0'
}


