import { Color } from "@nativescript/core";
export declare function parseColor(color: string | Color): Color;
export declare function tryParseColor(colorString: string | Color, errorMessage: string): Color;
export declare function log(message: string, ...optionalParams: any[]): void;
