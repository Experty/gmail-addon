"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GmailAddon = void 0;
var EventEmitter = require('events');
var gapi = require('gapi-script');
exports.GmailAddon = function (CLIENT_ID, API_KEY) {
    var DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest'];
    var SCOPES = 'https://www.googleapis.com/auth/gmail.settings.basic';
    var eventEmitter = new EventEmitter();
    var updateSigninStatus = function (status) {
        var event = status ? 'signIn' : 'signOut';
        eventEmitter.emit(event, status);
    };
    var setVacationSetting = function (config) { return new Promise(function (resolve, reject) {
        gapi.client.gmail.users.settings.updateVacation({ userId: 'me' }, config).execute(function (res) {
            if ('error' in res) {
                reject(res.error);
            }
            else {
                resolve(res);
            }
        });
    }); };
    var isSignedIn = function () { return gapi.auth2.getAuthInstance().isSignedIn.get(); };
    var setAutoresponder = function (message, topic, restrictToContacts) {
        if (topic === void 0) { topic = ''; }
        if (restrictToContacts === void 0) { restrictToContacts = false; }
        return setVacationSetting({
            enableAutoReply: true,
            responseSubject: topic,
            responseBodyHtml: message,
            restrictToContacts: restrictToContacts,
        });
    };
    var resetAutoresponder = function () { return setVacationSetting({ enableAutoReply: false }); };
    var signIn = function () { return new Promise(function (resolve, reject) {
        var DELAY = 50;
        var signInObj = gapi.auth2.getAuthInstance().signIn();
        var statusProp = 'Da';
        var errorProp = 'Rf';
        (function loop() {
            var status = signInObj[statusProp];
            if (status === 2) {
                resolve();
            }
            else if (status === 3) {
                reject(signInObj[errorProp]);
            }
            else {
                setTimeout(loop, DELAY);
            }
        })();
    }); };
    var signOut = function () { return new Promise(function (resolve, reject) {
        try {
            gapi.auth2.getAuthInstance().signOut();
            resolve();
        }
        catch (error) {
            reject(error);
        }
    }); };
    var getAutoresponder = function () { return new Promise(function (resolve, reject) {
        gapi.client.gmail.users.settings.getVacation({ userId: 'me' }).execute(function (res) {
            if ('error' in res) {
                reject(res.error);
            }
            else {
                resolve(res);
            }
        });
    }); };
    var getUserInfo = function () {
        if (!isSignedIn())
            return false;
        var props = {
            fullname: 'Bd',
            email: 'Du',
            lastname: 'FU',
            name: 'FW',
            image: 'hL',
        };
        var res = {};
        var userInfo = gapi.auth2.getAuthInstance().currentUser.ke.Tt;
        Object.keys(props).map(function (prop) { return res[prop] = userInfo[props[prop]]; });
        return res;
    };
    new Promise(function (resolve, reject) {
        gapi.load('client:auth2', function () {
            gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: DISCOVERY_DOCS,
                scope: SCOPES
            }).then(function () {
                gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
                updateSigninStatus(isSignedIn());
                resolve();
            }, function (error) {
                reject(error);
            });
        });
    });
    return {
        isSignedIn: isSignedIn,
        setAutoresponder: setAutoresponder,
        resetAutoresponder: resetAutoresponder,
        getAutoresponder: getAutoresponder,
        signIn: signIn,
        signOut: signOut,
        getUserInfo: getUserInfo,
        eventEmitter: eventEmitter,
    };
};
//# sourceMappingURL=index.js.map