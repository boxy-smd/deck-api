"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: Object.getOwnPropertyDescriptor(all, name).get
    });
}
_export(exports, {
    get bannersRef () {
        return bannersRef;
    },
    get profilesRef () {
        return profilesRef;
    }
});
const _app = require("firebase/app");
const _storage = require("firebase/storage");
const _env = require("../env/env");
const firebaseApp = (0, _app.initializeApp)({
    apiKey: _env.env.FIREBASE_API_KEY,
    appId: _env.env.FIREBASE_APP_ID,
    authDomain: _env.env.FIREBASE_AUTH_DOMAIN,
    messagingSenderId: _env.env.FIREBASE_MESSAGING_SENDER_ID,
    projectId: _env.env.FIREBASE_PROJECT_ID,
    storageBucket: _env.env.FIREBASE_STORAGE_BUCKET
});
const storage = (0, _storage.getStorage)(firebaseApp);
const bannersRef = (0, _storage.ref)(storage, 'images');
const profilesRef = (0, _storage.ref)(storage, 'profiles');

//# sourceMappingURL=firebase.js.map