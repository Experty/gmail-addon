
// function handleClientLoad() {
//   const CLIENT_ID = '416306538306-l4r33seebcbat4mmlrobf8fp5ll56rbi.apps.googleusercontent.com';
//   const API_KEY = 'AIzaSyC7iIOvCCPrSPF4L46bRpKEjDNylEccAM0';

//   const authorizeButton = document.getElementById('signin_button');
//   const signoutButton = document.getElementById('signout_button');
//   const setAutoresponderButton = document.getElementById('set_autoresponder_button');
//   const resetAutoresponderButton = document.getElementById('reset_autoresponder_button');
//   const getAutoresponderButton = document.getElementById('get_autoresponder_button');
//   const isSignedinButton = document.getElementById('is_signedin_button');
//   const getUserInfoButton = document.getElementById('get_user_info_button');

//   const log = str => {
//     document.getElementById('result').innerHTML = `${str}\n${document.getElementById('result').innerHTML}`;
//   };
//   const logJSON = (desc, json) => {
//     log(`${desc}: ${JSON.stringify(json, null, '  ')}`);
//   };

//   const gmailAddon = GmailAddon(CLIENT_ID, API_KEY);

//   authorizeButton.addEventListener('click', () => {
//     gmailAddon.signIn().then(() => {
//       log('Signed in');
//     }, error => {
//       logJSON('Error while signing in', error);
//     });
//   });

//   signoutButton.addEventListener('click', () => {
//     gmailAddon.signOut().then(() => {
//       log('Signed out');
//     });
//   });

//   setAutoresponderButton.addEventListener('click', () => {
//     gmailAddon.setAutoresponder('HTML Message', 'Topic')
//       .then(res => logJSON('Set Autoresponder', res));
//   });
//   resetAutoresponderButton.addEventListener('click', () => {
//     gmailAddon.resetAutoresponder()
//       .then(res => logJSON('Reset Autoresponder', res));
//   });
//   getAutoresponderButton.addEventListener('click', () => {
//     gmailAddon.getAutoresponder()
//       .then(res => logJSON('Get Autoresponder', res));
//   });
//   isSignedinButton.addEventListener('click', () => {
//     log(`is signed in: ${gmailAddon.isSignedIn()}`);
//   });
//   getUserInfoButton.addEventListener('click', () => {
//     log(`user info: ${JSON.stringify(gmailAddon.getUserInfo(), null, '  ')}`);
//   });

//   gmailAddon.onSignIn(() => log('Event: Signed in'));
//   gmailAddon.onSignOut(() => log('Event: Signed out'));
// }

