import { Utils } from "@nativescript/core";
const presentationStyles = {
    none: -1,
    fullScreen: 0,
    pageSheet: 1,
    formSheet: 2,
    currentContext: 3,
    custom: 4,
    overFullScreen: 5,
    overCurrentContext: 6,
    popover: 7,
};
const defaultModalPresentationStyle = Utils.ios.MajorVersion >= 13
    ? -2
    : 0;
const transitionStyles = {
    coverVertical: 0,
    flipHorizontal: 1,
    crossDissolve: 2,
    partialCurl: 3,
};
const animationKey = "dismissInAppBrowser";
export const setModalInPresentation = "setModalInPresentation";
export const InAppBrowserOpenAuthErrorMessage = "openAuth requires iOS 11 or greater";
export function getPresentationStyle(styleKey) {
    return presentationStyles[styleKey] !== undefined
        ? presentationStyles[styleKey]
        : defaultModalPresentationStyle;
}
export function getTransitionStyle(styleKey) {
    return transitionStyles[styleKey] !== undefined
        ? transitionStyles[styleKey]
        : 0;
}
export function getWindow() {
    const sharedApplication = UIApplication.sharedApplication;
    if (sharedApplication.windows.count > 0 && sharedApplication.windows[0]) {
        return sharedApplication.windows[0];
    }
    return sharedApplication.keyWindow;
}
export function dismissWithoutAnimation(controller) {
    const transition = CATransition.animation();
    transition.duration = 0;
    transition.timingFunction = CAMediaTimingFunction.functionWithName(kCAMediaTimingFunctionLinear);
    transition.type = kCATransitionFade;
    transition.subtype = kCATransitionFromBottom;
    controller.view.alpha = 0.05;
    controller.view.frame = CGRectMake(0.0, 0.0, 0.5, 0.5);
    const window = getWindow();
    const ctrl = window.rootViewController;
    ctrl.view.layer.addAnimationForKey(transition, animationKey);
    ctrl.dismissViewControllerAnimatedCompletion(false, () => {
        ctrl.view.layer.removeAnimationForKey(animationKey);
    });
}
//# sourceMappingURL=utils.ios.js.map