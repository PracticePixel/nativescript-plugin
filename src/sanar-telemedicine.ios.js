// import { Common } from './sanar-telemedicine.common';
import { Utils, Observable } from "@nativescript/core";
import { parseColor, log } from "./utils.common";
import { getDefaultOptions, BROWSER_TYPES, DISMISS_BUTTON_STYLES, InAppBrowserErrorMessage, } from "./sanar-telemedicine.common";
import { getTransitionStyle, getPresentationStyle, setModalInPresentation, dismissWithoutAnimation, InAppBrowserOpenAuthErrorMessage, getWindow, } from "./utils.ios";
import { SanarViewActivityEvents } from "./interfaces";
export { SanarViewActivityEvents } from "./interfaces";

export const NSAdvancedWebViewEventEmitter = new Observable();

export function SanarTelemedicine() {
  return 'Bismillah by IOS Module';
}

const DEFAULT_PROTOCOLS = [
    SFSafariViewControllerDelegate,
    UIAdaptivePresentationControllerDelegate,
];
const protocols = Utils.ios.MajorVersion >= 13
    ? [...DEFAULT_PROTOCOLS, ASWebAuthenticationPresentationContextProviding]
    : DEFAULT_PROTOCOLS;
let InAppBrowserModuleInstance;
function setup() {
    var InAppBrowserModule = /** @class */ (function (_super) {
    __extends(InAppBrowserModule, _super);
    function InAppBrowserModule() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.safariVC = null;
        _this.redirectResolve = null;
        _this.redirectReject = null;
        _this.authSession = null;
        _this.animated = false;
        return _this;
    }
    InAppBrowserModule.prototype.isAvailable = function () {
        return Promise.resolve(Utils.ios.MajorVersion >= 9);
    };
    InAppBrowserModule.prototype.initializeWebBrowser = function (resolve, reject) {
        if (this.redirectReject) {
            this.redirectReject(new Error(InAppBrowserErrorMessage));
            return false;
        }
        this.redirectResolve = resolve;
        this.redirectReject = reject;
        return true;
    };
    InAppBrowserModule.prototype.open = function (authURL, options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!_this.initializeWebBrowser(resolve, reject))
                return;
            var _a = getDefaultOptions(authURL, options), url = _a.url, animated = _a.animated, enableBarCollapsing = _a.enableBarCollapsing, readerMode = _a.readerMode, dismissButtonStyle = _a.dismissButtonStyle, preferredBarTintColor = _a.preferredBarTintColor, preferredControlTintColor = _a.preferredControlTintColor, modalEnabled = _a.modalEnabled, modalPresentationStyle = _a.modalPresentationStyle, modalTransitionStyle = _a.modalTransitionStyle, formSheetPreferredContentSize = _a.formSheetPreferredContentSize;
            _this.animated = animated;
            try {
                // Safari View Controller to authorize request
                var authURL_1 = NSURL.URLWithString(url);
                if (Utils.ios.MajorVersion >= 11) {
                    var config = SFSafariViewControllerConfiguration.alloc().init();
                    config.barCollapsingEnabled = enableBarCollapsing;
                    config.entersReaderIfAvailable = readerMode;
                    _this.safariVC =
                        SFSafariViewController.alloc().initWithURLConfiguration(authURL_1, config);
                }
                else {
                    _this.safariVC =
                        SFSafariViewController.alloc().initWithURLEntersReaderIfAvailable(authURL_1, readerMode);
                }
            }
            catch (error) {
                reject(new Error("Unable to open url."));
                _this.flowDidFinish();
                log("InAppBrowser: ".concat(error));
                return;
            }
            _this.safariVC.delegate = _this;
            if (Utils.ios.MajorVersion >= 11) {
                if (dismissButtonStyle === DISMISS_BUTTON_STYLES.DONE) {
                    _this.safariVC.dismissButtonStyle =
                        SFSafariViewControllerDismissButtonStyle.Done;
                }
                else if (dismissButtonStyle === DISMISS_BUTTON_STYLES.CLOSE) {
                    _this.safariVC.dismissButtonStyle =
                        SFSafariViewControllerDismissButtonStyle.Close;
                }
                else if (dismissButtonStyle === DISMISS_BUTTON_STYLES.CANCEL) {
                    _this.safariVC.dismissButtonStyle =
                        SFSafariViewControllerDismissButtonStyle.Cancel;
                }
            }
            if (Utils.ios.MajorVersion >= 10) {
                if (preferredBarTintColor) {
                    var color = parseColor(preferredBarTintColor);
                    if (color) {
                        _this.safariVC.preferredBarTintColor = color.ios;
                    }
                }
                if (preferredControlTintColor) {
                    var color = parseColor(preferredControlTintColor);
                    if (color) {
                        _this.safariVC.preferredControlTintColor = color.ios;
                    }
                }
            }
            var window = getWindow();
            var ctrl = window.rootViewController;
            if (modalEnabled) {
                // This is a hack to present the SafariViewController modally
                var safariHackVC = UINavigationController.alloc().initWithRootViewController(_this.safariVC);
                safariHackVC.setNavigationBarHiddenAnimated(true, false);
                // To disable "Swipe to dismiss" gesture which sometimes causes a bug where `safariViewControllerDidFinish`
                // is not called.
                _this.safariVC.modalPresentationStyle =
                    UIModalPresentationStyle.OverFullScreen;
                safariHackVC.modalPresentationStyle = getPresentationStyle(modalPresentationStyle);
                if (_this.animated) {
                    safariHackVC.modalTransitionStyle =
                        getTransitionStyle(modalTransitionStyle);
                }
                if (safariHackVC.modalPresentationStyle ===
                    UIModalPresentationStyle.FormSheet &&
                    formSheetPreferredContentSize) {
                    var width = formSheetPreferredContentSize.width;
                    var height = formSheetPreferredContentSize.height;
                    if (width && height) {
                        safariHackVC.preferredContentSize = CGSizeMake(width, height);
                    }
                }
                if (Utils.ios.MajorVersion >= 13) {
                    safariHackVC.modalInPresentation = true;
                    if (safariHackVC[setModalInPresentation])
                        safariHackVC[setModalInPresentation](true);
                }
                safariHackVC.presentationController.delegate = _this;
                ctrl.presentViewControllerAnimatedCompletion(safariHackVC, animated, null);
            }
            else {
                ctrl.presentViewControllerAnimatedCompletion(_this.safariVC, animated, null);
            }
        });
    };
    InAppBrowserModule.prototype.close = function () {
        var _this = this;
        var window = getWindow();
        var ctrl = window.rootViewController;
        ctrl.dismissViewControllerAnimatedCompletion(this.animated, function () {
            if (_this.redirectResolve) {
                _this.redirectResolve({
                    type: "dismiss",
                });
                _this.flowDidFinish();
            }
        });
    };
    InAppBrowserModule.prototype.openAuth = function (authUrl, redirectUrl, options) {
        return __awaiter(this, void 0, Promise, function () {
            var ephemeralWebSession, response;
            var _this = this;
            return __generator(this, function (_a) {
                ephemeralWebSession = !!(options === null || options === void 0 ? void 0 : options.ephemeralWebSession);
                if (Utils.ios.MajorVersion >= 11) {
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            if (!_this.initializeWebBrowser(resolve, reject))
                                return;
                            var url = NSURL.URLWithString(authUrl);
                            var escapedRedirectURL = null;
                            if (redirectUrl) {
                                escapedRedirectURL = NSURL.URLWithString(redirectUrl).scheme;
                            }
                            _this.authSession = (Utils.ios.MajorVersion >= 12
                                ? ASWebAuthenticationSession
                                : SFAuthenticationSession)
                                .alloc()
                                .initWithURLCallbackURLSchemeCompletionHandler(url, escapedRedirectURL, function (callbackURL, error) {
                                if (_this.redirectResolve) {
                                    if (!error) {
                                        _this.redirectResolve({
                                            type: BROWSER_TYPES.SUCCESS,
                                            url: callbackURL.absoluteString,
                                        });
                                    }
                                    else {
                                        _this.redirectResolve({
                                            type: BROWSER_TYPES.CANCEL,
                                        });
                                    }
                                    _this.flowDidFinish();
                                }
                            });
                            if (Utils.ios.MajorVersion >= 13) {
                                var webAuthSession = _this
                                    .authSession;
                                // Prevent re-use cookie from last auth session
                                webAuthSession.prefersEphemeralWebBrowserSession =
                                    ephemeralWebSession;
                                webAuthSession.presentationContextProvider = _this;
                            }
                            _this.authSession.start();
                        })];
                }
                else {
                    this.flowDidFinish();
                    response = {
                        type: BROWSER_TYPES.CANCEL,
                        message: InAppBrowserOpenAuthErrorMessage,
                    };
                    return [2 /*return*/, Promise.resolve(response)];
                }
                return [2 /*return*/];
            });
        });
    };
    InAppBrowserModule.prototype.closeAuth = function () {
        if (Utils.ios.MajorVersion >= 11) {
            var authSession = this.authSession;
            authSession.cancel();
            if (this.redirectResolve) {
                this.redirectResolve({
                    type: BROWSER_TYPES.DISMISS,
                });
                this.flowDidFinish();
            }
        }
        else {
            this.close();
        }
    };
    InAppBrowserModule.prototype.presentationAnchorForWebAuthenticationSession = function (_) {
        return getWindow();
    };

        /**
     * Tells the delegate that the initial URL load completed.
     * @param controller
     * @param didLoadSuccessfully
     */
         InAppBrowserModule.prototype.safariViewControllerDidCompleteInitialLoad = function (controller, didLoadSuccessfully) {
            if (didLoadSuccessfully === true) {
                NSAdvancedWebViewEventEmitter.notify({
                    eventName: SanarViewActivityEvents.LAUNCHED
                });
            }
            else {
                NSAdvancedWebViewEventEmitter.notify({
                    eventName: SanarViewActivityEvents.ERROR
                });
            }
        };

    InAppBrowserModule.prototype.safariViewControllerDidFinish = function (controller) {
        if (this.redirectResolve) {
            this.redirectResolve({
                type: BROWSER_TYPES.CANCEL,
            });
        }
        this.flowDidFinish();
        if (!this.animated) {
            dismissWithoutAnimation(controller);
        }
    };
    InAppBrowserModule.prototype.flowDidFinish = function () {
        NSAdvancedWebViewEventEmitter.notify({
            eventName: SanarViewActivityEvents.ON_CLOSED
        });
        this.safariVC = null;
        this.redirectResolve = null;
        this.redirectReject = null;
    };
    InAppBrowserModule.prototype.onStart = function () { 
        console.log('starting');
    };
    InAppBrowserModule.prototype.warmup = function () {
        return false;
    };
    InAppBrowserModule.prototype.mayLaunchUrl = function (url, otherUrls) {
        log("mayLaunchUrl is not supported on iOS. url: ".concat(url, ", otherUrls: ").concat(otherUrls));
    };
    InAppBrowserModule.ObjCProtocols = protocols;
    return InAppBrowserModule;
}(NSObject));
    return InAppBrowserModule.new();
}
if (typeof InAppBrowserModuleInstance === "undefined") {
    InAppBrowserModuleInstance = setup();
}
export const InAppBrowser = (InAppBrowserModuleInstance);
//# sourceMappingURL=InAppBrowser.ios.js.map

  
