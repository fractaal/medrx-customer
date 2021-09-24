let api = {} as Record<string, any>;

const statusBarHistory: { color: string; dark: boolean }[] = [];

if (process.env.MODE === 'capacitor') {
  import('@capacitor/core').then(({ Plugins, StatusBarStyle }) => {
    const { StatusBar, PushNotifications } = Plugins;

    api.setStatusBarColor = (color = '#ffffff', dark = false) => {
      console.log(`Setting status bar to ${color} isDark:${dark}`);
      StatusBar.setBackgroundColor({ color });
      StatusBar.setStyle({ style: dark ? StatusBarStyle.Dark : StatusBarStyle.Light });
      statusBarHistory.push({ color, dark });
    };

    api.setStatusBarColor();

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
} else {
  // Proxy that redirects method calls to no-op if the platform is not Capacitor.
  api = new Proxy(api, {
    get(_, propKey: string) {
      return (...args: any[]) => {
        console.log(
          `Intercepted method call to ${propKey} with args ${JSON.stringify(
            args
          )} - Method called is now NO-OP (NOT CAPACITOR APP!)`
        );
      };
    },
  });
}

export default api;
