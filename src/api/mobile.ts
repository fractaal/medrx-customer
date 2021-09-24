const api = {} as Record<string, any>;

const statusBarHistory: { color: string; dark: boolean }[] = [];

if (process.env.MODE === 'capacitor') {
  import('@capacitor/core').then(({ Plugins, StatusBarStyle }) => {
    const { StatusBar, PushNotifications } = Plugins;

    api.setStatusBarColor = (color: string, dark = false) => {
      StatusBar.setBackgroundColor({ color });
      StatusBar.setStyle({ style: dark ? StatusBarStyle.Dark : StatusBarStyle.Light });
      statusBarHistory.push({ color, dark });
    };

    api.goBackToPreviousStatusBarStyle = () => {
      const { color, dark } = statusBarHistory.pop()!;
      StatusBar.setBackgroundColor({ color: color ?? '#ffffff' });
      StatusBar.setStyle({ style: dark ?? false ? StatusBarStyle.Dark : StatusBarStyle.Light });
    };

    api.setStatusBarColor('#ffffff');

    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    try {
      PushNotifications.register();
    } catch (err) {
      console.log('Whoops, trying to register push notifications failed...');
    }

    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration', (token: any) => {
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      console.log('Push registration success, token: ' + token.value);
    });

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError', (error: any) => {
      console.log('Error on registration: ' + JSON.stringify(error));
    });

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived', (notification: any) => {
      console.log('Push received: ' + JSON.stringify(notification));
    });

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed', (notification: any) => {
      console.log('Push action performed: ' + JSON.stringify(notification));
    });
  });
}

export default api;
