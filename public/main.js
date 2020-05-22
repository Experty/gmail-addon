
// Client ID and API key from the Developer Console
const CLIENT_ID = '416306538306-l4r33seebcbat4mmlrobf8fp5ll56rbi.apps.googleusercontent.com';
const API_KEY = 'AIzaSyC84J16v8gk9OFljKpgp57ljJMOUszZGZs';

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';

const authorizeButton = document.getElementById('authorize_button');
const signoutButton = document.getElementById('signout_button');

function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.addEventListener('click', handleAuthClick);
    signoutButton.addEventListener('click', handleSignoutClick);
  }, error => console.error(error));
}

function updateSigninStatus(isSignedIn) {
  authorizeButton.style.display = isSignedIn ? 'none' : 'block';
  signoutButton.style.display = !isSignedIn ? 'none' : 'block';
  if (isSignedIn) {
    getVacationSetting();
  }
}

function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

const log = str => {
  document.getElementById('result').innerHTML += `${str}\n`;
};

const getVacationSetting = () => {
  gapi.client.gmail.users.settings.getVacation({userId: 'me'}).execute(res => {
    log(JSON.stringify(res, null, '  '));
  });
};
