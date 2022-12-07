// for android
// export var AdvancedWebviewEvents;
// (function (AdvancedWebviewEvents) {
//     // AdvancedWebviewEvents["LoadStarted"] = "LoadStarted";
//     AdvancedWebviewEvents["LAUNCHED"] = "LAUNCHED";
//     AdvancedWebviewEvents["ERROR"] = "ERROR";
//     AdvancedWebviewEvents["ON_CLOSED"] = "ON_CLOSED";
// })(AdvancedWebviewEvents || (AdvancedWebviewEvents = {}));

// for IOS
export var SanarViewActivityEvents;
(function (SanarViewActivityEvents) {
    SanarViewActivityEvents["LAUNCHED"] = "LAUNCHED";
    SanarViewActivityEvents["ON_CLOSED"] = "ON_CLOSED";
    SanarViewActivityEvents["ERROR"] = "ERROR";
})(SanarViewActivityEvents || (SanarViewActivityEvents = {}));
