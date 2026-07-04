/**
 * @format
 */
import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import { name as appName } from './app.json';

// Must be registered outside the React component tree — this is what lets
// Android wake the app to handle a push notification while it's backgrounded
// or fully closed. See NOTIFICATIONS module / src/services/notificationService.ts.
messaging().setBackgroundMessageHandler(async remoteMessage => {
  // The Firestore write that populates the in-app notification feed happens
  // server-side (see notificationService.ts); nothing to do here beyond
  // letting the OS show the notification, which it does automatically for
  // data+notification messages.
  console.log('Aero: background message received', remoteMessage.messageId);
});

AppRegistry.registerComponent(appName, () => App);
