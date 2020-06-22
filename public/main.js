import { gapi } from 'gapi-script';

export const GmailAddon = (CLIENT_ID, API_KEY) => {
  const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest'];
  const SCOPES = 'https://www.googleapis.com/auth/gmail.settings.basic';

  const signInCallbacks = [];
  const signOutCallbacks = [];
  const updateSigninStatus = status => {
    (status ? signInCallbacks : signOutCallbacks).map(cb => cb());
  };

  const setVacationSetting = config => new Promise((resolve, reject) => {
    gapi.client.gmail.users.settings.updateVacation({userId: 'me'}, config).execute(res => {
      if ('error' in res) {
        reject(res.error);
      } else {
        resolve(res);
      }
    });
  });

  const isSignedIn = () => gapi.auth2.getAuthInstance().isSignedIn.get();
  const setAutoresponder = (message, topic = '', restrictToContacts = false) => {
    return setVacationSetting({
      enableAutoReply: true,
      responseSubject: topic,
      responseBodyHtml: message,
      restrictToContacts,
    });
  };
  const resetAutoresponder = () => setVacationSetting({ enableAutoReply: false });
  const signIn = () => new Promise((resolve, reject) => {
    const DELAY = 50;
    const signInObj = gapi.auth2.getAuthInstance().signIn();
    const statusProp = 'Da';
    const errorProp = 'Rf';
    (function loop() {
      const status = signInObj[statusProp];
      if (status === 2) {
        resolve();
      } else if (status === 3) {
        reject(signInObj[errorProp]);
      } else {
        setTimeout(loop, DELAY);
      }
    })();
  });
  const signOut = () => new Promise((resolve, reject) => {
    try {
      gapi.auth2.getAuthInstance().signOut();
      resolve(); 
    } catch(error) {
      reject(error);
    }
  });
  const getAutoresponder = () => new Promise((resolve, reject) => {
    gapi.client.gmail.users.settings.getVacation({userId: 'me'}).execute(res => {
      if ('error' in res) {
        reject(res.error);
      } else {
        resolve(res);
      }
    });
  });
  const getUserInfo = () => {
    if (!isSignedIn()) return false;
    const props = {
      fullname: 'Bd',
      email: 'Du',
      lastname: 'FU',
      name: 'FW',
      image: 'hL',
    };
    const res = {};
    const userInfo = gapi.auth2.getAuthInstance().currentUser.ke.Tt;
    Object.keys(props).map(prop => res[prop] = userInfo[props[prop]]);
    return res;
  };
  const onSignIn = callback => signInCallbacks.push(callback);
  const onSignOut = callback => signOutCallbacks.push(callback);

  new Promise((resolve, reject) => {
    gapi.load('client:auth2', () => {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
      }).then(() => {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        updateSigninStatus(isSignedIn());
        resolve();
      }, error => {
        reject(error);
      });
    });
  });

  return {
    isSignedIn,
    setAutoresponder,
    resetAutoresponder,
    getAutoresponder,
    signIn,
    signOut,
    onSignIn,
    onSignOut,
    getUserInfo,
  };
};

function handleClientLoad() {
  const CLIENT_ID = '416306538306-l4r33seebcbat4mmlrobf8fp5ll56rbi.apps.googleusercontent.com';
  const API_KEY = 'AIzaSyC7iIOvCCPrSPF4L46bRpKEjDNylEccAM0';

  const authorizeButton = document.getElementById('signin_button');
  const signoutButton = document.getElementById('signout_button');
  const setAutoresponderButton = document.getElementById('set_autoresponder_button');
  const resetAutoresponderButton = document.getElementById('reset_autoresponder_button');
  const getAutoresponderButton = document.getElementById('get_autoresponder_button');
  const isSignedinButton = document.getElementById('is_signedin_button');
  const getUserInfoButton = document.getElementById('get_user_info_button');

  const log = str => {
    document.getElementById('result').innerHTML = `${str}\n${document.getElementById('result').innerHTML}`;
  };
  const logJSON = (desc, json) => {
    log(`${desc}: ${JSON.stringify(json, null, '  ')}`);
  };

  const gmailAddon = GmailAddon(CLIENT_ID, API_KEY);

  authorizeButton.addEventListener('click', () => {
    gmailAddon.signIn().then(() => {
      log('Signed in');
    }, error => {
      logJSON('Error while signing in', error);
    });
  });

  signoutButton.addEventListener('click', () => {
    gmailAddon.signOut().then(() => {
      log('Signed out');
    });
  });

  setAutoresponderButton.addEventListener('click', () => {
    gmailAddon.setAutoresponder('HTML Message', 'Topic')
      .then(res => logJSON('Set Autoresponder', res));
  });
  resetAutoresponderButton.addEventListener('click', () => {
    gmailAddon.resetAutoresponder()
      .then(res => logJSON('Reset Autoresponder', res));
  });
  getAutoresponderButton.addEventListener('click', () => {
    gmailAddon.getAutoresponder()
      .then(res => logJSON('Get Autoresponder', res));
  });
  isSignedinButton.addEventListener('click', () => {
    log(`is signed in: ${gmailAddon.isSignedIn()}`);
  });
  getUserInfoButton.addEventListener('click', () => {
    log(`user info: ${JSON.stringify(gmailAddon.getUserInfo(), null, '  ')}`);
  });

  gmailAddon.onSignIn(() => log('Event: Signed in'));
  gmailAddon.onSignOut(() => log('Event: Signed out'));
}

