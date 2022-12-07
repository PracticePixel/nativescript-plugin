export const InAppBrowserErrorMessage = "Another InAppBrowser is already being presented.";
export var BROWSER_TYPES;
(function (BROWSER_TYPES) {
    BROWSER_TYPES["CANCEL"] = "cancel";
    BROWSER_TYPES["DISMISS"] = "dismiss";
    BROWSER_TYPES["SUCCESS"] = "success";
})(BROWSER_TYPES || (BROWSER_TYPES = {}));
export var DISMISS_BUTTON_STYLES;
(function (DISMISS_BUTTON_STYLES) {
    DISMISS_BUTTON_STYLES["DONE"] = "done";
    DISMISS_BUTTON_STYLES["CLOSE"] = "close";
    DISMISS_BUTTON_STYLES["CANCEL"] = "cancel";
})(DISMISS_BUTTON_STYLES || (DISMISS_BUTTON_STYLES = {}));
export function getDefaultOptions(url, options = {
    animated: true,
    modalEnabled: true,
    dismissButtonStyle: "close",
    readerMode: false,
    enableBarCollapsing: false,
}) {
    return Object.assign(Object.assign({}, options), { url });
}
//# sourceMappingURL=InAppBrowser.common.js.map