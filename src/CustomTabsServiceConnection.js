var Context = android.content.Context;
var Log = android.util.Log;
import { CustomTabsServiceConnection } from "./utils.android";
import { log } from "./utils.common";
var CustomTabsController = /** @class */ (function (_super) {
    __extends(CustomTabsController, _super);
    function CustomTabsController(context) {
        var _this = _super.call(this) || this;
        _this.context = new WeakRef(context);
        return global.__native(_this);
    }
    CustomTabsController.prototype.onCustomTabsServiceConnected = function (_, client) {
        CustomTabsController.customTabsClient = client;
        if (!client.warmup(long(0))) {
            Log.e(CustomTabsController.TAG, "Couldn't warmup custom tabs client");
        }
        var context = this.context.get();
        context.unbindService(this);
        log("Custom tabs service connected");
    };
    CustomTabsController.prototype.onServiceDisconnected = function (_) {
        CustomTabsController.customTabsClient = null;
        log("Custom tabs service disconnected");
    };
    CustomTabsController.TAG = "CustomTabsController";
    return CustomTabsController;
}(CustomTabsServiceConnection));
export { CustomTabsController };
//# sourceMappingURL=CustomTabsServiceConnection.js.map