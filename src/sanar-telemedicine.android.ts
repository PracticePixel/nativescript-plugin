import { Common } from './sanar-telemedicine.common';
import { Application } from "@nativescript/core";

export function SanarTelemedicine() {
    var PackageManager = android.content.pm.PackageManager;
    var pkg = Application.android.context.getPackageManager().getPackageInfo(Application.android.context.getPackageName(),
      PackageManager.GET_META_DATA);
    return pkg.versionName;
}


