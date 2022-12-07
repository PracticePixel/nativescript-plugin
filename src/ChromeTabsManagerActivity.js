var Intent = android.content.Intent;
var Log = android.util.Log;
import { Observable } from "@nativescript/core";
import { BROWSER_TYPES } from "./sanar-telemedicine.common";
import { DISMISSED_EVENT } from "./utils.android";
class ChromeTabsEvent extends Observable {
}
const BROWSER_ACTIVITY_EVENTS = new ChromeTabsEvent();
const KEY_BROWSER_INTENT = "browserIntent";
const BROWSER_RESULT_TYPE = "browserResultType";
const DEFAULT_RESULT_TYPE = BROWSER_TYPES.DISMISS;
const TAG = "ChromeTabsManagerActivity";
const notifyMessage = (message, resultType, isError = false) => {
    BROWSER_ACTIVITY_EVENTS.set("message", message);
    BROWSER_ACTIVITY_EVENTS.set("resultType", resultType);
    BROWSER_ACTIVITY_EVENTS.set("isError", isError);
    BROWSER_ACTIVITY_EVENTS.notify({
        eventName: DISMISSED_EVENT,
        object: BROWSER_ACTIVITY_EVENTS,
    });
};
var ChromeTabsManagerActivity = /** @class */ (function (_super) {
    __extends(ChromeTabsManagerActivity, _super);
    function ChromeTabsManagerActivity() {
        var _this = _super.call(this) || this;
        _this.mOpened = false;
        _this.resultType = null;
        _this.isError = false;
        return global.__native(_this);
    }
    ChromeTabsManagerActivity.prototype.onCreate = function (savedInstanceState) {
        try {
            _super.prototype.onCreate.call(this, savedInstanceState);
            // This activity gets opened in 2 different ways. If the extra KEY_BROWSER_INTENT is present we
            // start that intent and if it is not it means this activity was started with FLAG_ACTIVITY_CLEAR_TOP
            // in order to close the intent that was started previously so we just close this.
            if (this.getIntent().hasExtra(KEY_BROWSER_INTENT) &&
                (!savedInstanceState ||
                    !savedInstanceState.getString(BROWSER_RESULT_TYPE))) {
                var browserIntent = (this.getIntent().getParcelableExtra(KEY_BROWSER_INTENT));
                browserIntent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                this.startActivity(browserIntent);
                this.resultType = DEFAULT_RESULT_TYPE;
            }
            else {
                this.finish();
            }
        }
        catch (error) {
            this.isError = true;
            notifyMessage("Unable to open url.", this.resultType, this.isError);
            this.finish();
            Log.e(TAG, error.message);
        }
    };
    ChromeTabsManagerActivity.prototype.onResume = function () {
        _super.prototype.onResume.call(this);
        // onResume will get called twice, the first time when the activity is created and a second
        // time if the user closes the chrome tabs activity. Knowing this we can detect if the user
        // dismissed the activity and send an event accordingly.
        if (!this.mOpened) {
            this.mOpened = true;
        }
        else {
            this.resultType = BROWSER_TYPES.CANCEL;
            this.finish();
        }
    };
    ChromeTabsManagerActivity.prototype.onDestroy = function () {
        if (this.resultType) {
            switch (this.resultType) {
                case BROWSER_TYPES.CANCEL:
                    notifyMessage("chrome tabs activity closed", this.resultType, this.isError);
                    break;
                default:
                    notifyMessage("chrome tabs activity destroyed", DEFAULT_RESULT_TYPE, this.isError);
                    break;
            }
            this.resultType = null;
        }
        _super.prototype.onDestroy.call(this);
    };
    ChromeTabsManagerActivity.prototype.onNewIntent = function (intent) {
        _super.prototype.onNewIntent.call(this, intent);
        this.setIntent(intent);
    };
    ChromeTabsManagerActivity.prototype.onRestoreInstanceState = function (savedInstanceState) {
        _super.prototype.onRestoreInstanceState.call(this, savedInstanceState);
        this.resultType = savedInstanceState.getString(BROWSER_RESULT_TYPE);
    };
    ChromeTabsManagerActivity.prototype.onSaveInstanceState = function (savedInstanceState) {
        savedInstanceState.putString(BROWSER_RESULT_TYPE, DEFAULT_RESULT_TYPE);
        _super.prototype.onSaveInstanceState.call(this, savedInstanceState);
    };
    ChromeTabsManagerActivity = __decorate([
        JavaProxy("com.proyecto26.inappbrowser.ChromeTabsManagerActivity")
    ], ChromeTabsManagerActivity);
    return ChromeTabsManagerActivity;
}(android.app.Activity));
const createStartIntent = (context, authIntent) => {
    let intent = createBaseIntent(context);
    intent.putExtra(KEY_BROWSER_INTENT, authIntent);
    return intent;
};
const createDismissIntent = (context) => {
    let intent = createBaseIntent(context);
    intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
    return intent;
};
const createBaseIntent = (context) => {
    return new Intent(context, ChromeTabsManagerActivity.class);
};
export { BROWSER_ACTIVITY_EVENTS, ChromeTabsEvent, createStartIntent, createDismissIntent, createBaseIntent, ChromeTabsManagerActivity, };
//# sourceMappingURL=ChromeTabsManagerActivity.js.map