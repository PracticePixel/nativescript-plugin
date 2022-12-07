# nativescript-sanar-telemedicine

Nativescript Library for Sanar Telemedicine

## Prerequisites / Requirements

### Android

To enable camera usage and microphone usage you will need to add camera and audio permissions to your `AndroidManifest.xml` file:

```xml
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-feature android:name="android.hardware.camera" android:required="false" />
    <uses-feature android:name="android.hardware.camera.autofocus" android:required="false" />
    <uses-feature android:name="android.hardware.microphone" android:required="false" />
```

### IOS
To enable camera usage and microphone usage you will need to add the following entries to your `Info.plist` file:

```
<key>NSCameraUsageDescription</key>
<string>Your message to user when the camera is accessed for the first time</string>
<key>NSMicrophoneUsageDescription</key>
<string>Your message to user when the microphone is accessed for the first time</string>
// v2 required permissions
<key>NSPhotoLibraryUsageDescription</key>
<string>Your message to user when the Photo/Library is accessed for the first time</string>
```
## Getting Started
### Installation Steps

```
tns plugin add git_hub_url
```

### import the sdk in to the project

```
import { InAppBrowser } from 'sanar-telemedicine';
```

### Open the SanarTelemedicine consultation page

```
if (await InAppBrowser.isAvailable()) {
    const result = await InAppBrowser.open(url, {
    // iOS Properties
    dismissButtonStyle: 'close',
    preferredBarTintColor: '#FFFFFF',
    preferredControlTintColor: 'blue',
    readerMode: false,
    animated: true,
    modalPresentationStyle: 'fullScreen',
    modalTransitionStyle: 'coverVertical',
    modalEnabled: true,
    enableBarCollapsing: false,
    // Android Properties
    showTitle: false,
    toolbarColor: '#FFFFFF',
    secondaryToolbarColor: 'black',
    navigationBarColor: 'black',
    navigationBarDividerColor: 'white',
    enableUrlBarHiding: true,
    enableDefaultShare: true,
    forceCloseOnRedirection: false,
    // Specify full animation resource identifier(package:anim/name)
    // or only resource name(in case of animation bundled with app).
    animations: {
        startEnter: 'slide_in_right',
        startExit: 'slide_out_left',
        endEnter: 'slide_in_left',
        endExit: 'slide_out_right'
    },
    headers: {
        'my-custom-header': 'my custom header value'
    },
    hasBackButton: true,
    browserPackage: '',
    showInRecents: false
    });
} else {
    Utils.openUrl(url);
}
```

### Listen to SanarView Events

```
NSAdvancedWebViewEventEmitter.once("ON_CLOSED", () => {
    console.log('CLOSED');
});

NSAdvancedWebViewEventEmitter.once("LAUNCHED", () => {
    console.log('LAUNCHED_FINISHED');
});

NSAdvancedWebViewEventEmitter.once("ERROR", () => {
    console.log('LOAD_ERROR');
});
```

## Usage

Methods       | Action
------------- | ------
`open`        | Opens the url with Safari in a modal on iOS using **SFSafariViewController**, and Chrome in a new custom tab on Android. On iOS, the modal Safari will not share cookies with the system Safari.
`isAvailable` | Detect if the device supports this plugin.

### iOS Options

Property       | Description
-------------- | ------
`dismissButtonStyle` (String)        | The style of the dismiss button. [`done`/`close`/`cancel`]
`preferredBarTintColor` (String)     | The color to tint the background of the navigation bar and the toolbar. [`white`/`#FFFFFF`]
`preferredControlTintColor` (String) | The color to tint the control buttons on the navigation bar and the toolbar. [`gray`/`#808080`]
`readerMode` (Boolean)               | A value that specifies whether Safari should enter Reader mode, if it is available. [`true`/`false`]
`animated` (Boolean)                 | Animate the presentation. [`true`/`false`]
`modalPresentationStyle` (String)    | The presentation style for modally presented view controllers. [`automatic`/`none`/`fullScreen`/`pageSheet`/`formSheet`/`currentContext`/`custom`/`overFullScreen`/`overCurrentContext`/`popover`]
`modalTransitionStyle` (String)      | The transition style to use when presenting the view controller. [`coverVertical`/`flipHorizontal`/`crossDissolve`/`partialCurl`]
`modalEnabled` (Boolean)             | Present the **SafariViewController** modally or as push instead. [`true`/`false`]
`enableBarCollapsing` (Boolean)      | Determines whether the browser's tool bars will collapse or not. [`true`/`false`]
`ephemeralWebSession` (Boolean)      | Prevent re-use cookies of previous session (openAuth only) [`true`/`false`]
`formSheetPreferredContentSize` (Object)      | Custom size for iPad `formSheet` modals [`{width: 400, height: 500}`]

### Android Options
Property       | Description
-------------- | ------
`showTitle` (Boolean)   | Sets whether the title should be shown in the custom tab. [`true`/`false`]
`toolbarColor` (String)           | Sets the toolbar color. [`gray`/`#808080`]
`secondaryToolbarColor` (String)  | Sets the color of the secondary toolbar. [`white`/`#FFFFFF`]
`navigationBarColor` (String)     | Sets the navigation bar color. [`gray`/`#808080`]
`navigationBarDividerColor` (String) | Sets the navigation bar divider color.  [`white`/`#FFFFFF`]
`enableUrlBarHiding` (Boolean)    | Enables the url bar to hide as the user scrolls down on the page. [`true`/`false`]
`enableDefaultShare` (Boolean)    | Adds a default share item to the menu. [`true`/`false`]
`animations` (Object)             | Sets the start and exit animations. [`{ startEnter, startExit, endEnter, endExit }`]
`headers` (Object)                | The data are key/value pairs, they will be sent in the HTTP request headers for the provided url. [`{ 'Authorization': 'Bearer ...' }`]
`forceCloseOnRedirection` (Boolean) | Open Custom Tab in a new task to avoid issues redirecting back to app scheme. [`true`/`false`]
`hasBackButton` (Boolean)         | Sets a back arrow instead of the default `X` icon to close the custom tab. [`true`/`false`]
`browserPackage` (String)         | Package name of a browser to be used to handle Custom Tabs.
`showInRecents` (Boolean)         | Determining whether browsed website should be shown as separate entry in Android recents/multitasking view. [`true`/`false`]
`includeReferrer` (Boolean)       | Determining whether to include your package name as referrer for the website to track. [`true`/`false`]
    
### Example

Check Example for reference : [Example](https://git.marensolutions.com)
