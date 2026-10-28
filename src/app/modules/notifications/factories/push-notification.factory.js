(function() {
  'use strict';
  angular.module('fraudAlertApp').factory('pushNotificationFactory', ['$http', '$q', 'configService', function($http, $q, configService) {
    const pushProviderUrl = configService.get('pushProviderUrl');
    return {
      sendPushNotification: (deviceTokens, notificationContent) => {
        const payload = {
          device_tokens: deviceTokens,
          notification: {
            title: notificationContent.title,
            body: notificationContent.body,
            data: notificationContent.data
          },
          priority: 'high'
        };
        return $http.post(`${pushProviderUrl}/push/send`, payload)
          .then(response => {
            console.log('Push notification sent successfully:', response.data);
            return response.data;
          })
          .catch(error => {
            console.error('Push notification delivery failed:', error);
            return $q.reject(error);
          });
      }
    };
  }]);
})();