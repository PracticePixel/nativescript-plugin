import { Color } from "@nativescript/core";
export interface RedirectEvent {
    url: "string";
}
export interface BrowserResult {
    type: "cancel" | "dismiss";
    message?: string;
}
export interface RedirectResult {
    type: "success";
    url: string;
}
declare type InAppBrowseriOSOptions = {
    dismissButtonStyle?: "done" | "close" | "cancel";
    preferredBarTintColor?: string | Color;
    preferredControlTintColor?: string | Color;
    readerMode?: boolean;
    animated?: boolean;
    modalPresentationStyle?: "automatic" | "fullScreen" | "pageSheet" | "formSheet" | "currentContext" | "custom" | "overFullScreen" | "overCurrentContext" | "popover" | "none";
    modalTransitionStyle?: "coverVertical" | "flipHorizontal" | "crossDissolve" | "partialCurl";
    modalEnabled?: boolean;
    enableBarCollapsing?: boolean;
    ephemeralWebSession?: boolean;
    formSheetPreferredContentSize?: {
        width: number;
        height: number;
    };
};
export declare type Animations = {
    startEnter: string;
    startExit: string;
    endEnter: string;
    endExit: string;
};
declare type InAppBrowserAndroidOptions = {
    showTitle?: boolean;
    toolbarColor?: string | Color;
    secondaryToolbarColor?: string | Color;
    navigationBarColor?: string | Color;
    navigationBarDividerColor?: string | Color;
    enableUrlBarHiding?: boolean;
    enableDefaultShare?: boolean;
    forceCloseOnRedirection?: boolean;
    animations?: Animations;
    headers?: {
        [key: string]: string;
    };
    hasBackButton?: boolean;
    browserPackage?: string;
    showInRecents?: boolean;
    includeReferrer?: boolean;
};
export declare type InAppBrowserOptions = InAppBrowserAndroidOptions & InAppBrowseriOSOptions;
export declare type AuthSessionResult = RedirectResult | BrowserResult;
export declare type OpenBrowserAsync = (url: string, options?: InAppBrowserOptions) => Promise<BrowserResult>;
export interface InAppBrowserClassMethods {
    open: OpenBrowserAsync;
    close: () => void;
    openAuth: (url: string, redirectUrl: string, options?: InAppBrowserOptions) => Promise<AuthSessionResult>;
    closeAuth: () => void;
    isAvailable: () => Promise<boolean>;
    onStart(): void;
    warmup: () => boolean;
    mayLaunchUrl: (mostLikelyUrl: string, otherUrls: Array<string>) => void;
}
export declare type RedirectResolve = (value?: AuthSessionResult | PromiseLike<AuthSessionResult>) => void;
export declare type RedirectReject = (reason?: Error) => void;
export declare const InAppBrowserErrorMessage = "Another InAppBrowser is already being presented.";
export declare enum BROWSER_TYPES {
    CANCEL = "cancel",
    DISMISS = "dismiss",
    SUCCESS = "success"
}
export declare enum DISMISS_BUTTON_STYLES {
    DONE = "done",
    CLOSE = "close",
    CANCEL = "cancel"
}
export declare function getDefaultOptions(url: string, options?: InAppBrowserOptions): InAppBrowserOptions & {
    url: string;
};

export {};
