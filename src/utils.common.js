import { Application, Color } from "@nativescript/core";
export function parseColor(color) {
    if (color && !(color instanceof Color)) {
        return new Color(color);
    }
    return color;
}
export function tryParseColor(colorString, errorMessage) {
    try {
        return parseColor(colorString);
    }
    catch (error) {
        throw new Error(`${errorMessage} ${colorString}: ${error.message}`);
    }
}
export function log(message, ...optionalParams) {
    const nglog = global.__nslog;
    if (nglog) {
        nglog(message, ...optionalParams);
    }
    if (Application.android) {
        android.util.Log.d("JS", message);
    }
    console.log(message, ...optionalParams);
}
//# sourceMappingURL=utils.common.js.map