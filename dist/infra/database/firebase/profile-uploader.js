"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "FirebaseProfileUploader", {
    enumerable: true,
    get: function() {
        return FirebaseProfileUploader;
    }
});
const _storage = require("firebase/storage");
const _uploader = require("../../../domain/authentication/application/storage/uploader");
const _firebase = require("../../config/services/firebase");
let FirebaseProfileUploader = class FirebaseProfileUploader extends _uploader.StorageUploader {
    async upload(image, filename) {
        const imageReference = (0, _storage.ref)(_firebase.profilesRef, filename);
        await (0, _storage.uploadBytes)(imageReference, image);
        const downloadUrl = await (0, _storage.getDownloadURL)(imageReference);
        return {
            downloadUrl
        };
    }
};

//# sourceMappingURL=profile-uploader.js.map