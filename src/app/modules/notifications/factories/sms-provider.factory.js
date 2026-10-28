(function() {
  'use strict';
  angular.module('fraudAlertApp').factory('smsProviderFactory', ['$http', '$q', 'configService', function($http, $q, configService) {
    const smsProviderUrl = configService.get('smsProviderUrl');
    return {
      sendSms: (phoneNumber, notificationContent) => {
        const payload = {
          to: phoneNumber,
          message: notificationContent.message,
          from: 'FraudAlert'
        };
        return $http.post(`${smsProviderUrl}/sms/send`, payload)
          .then(response => {
            console.log('SMS sent successfully:', response.data);
            return response.data;
          })
          .catch(error => {
            console.error('SMS delivery failed:', error);
            return $q.reject(error);
          });
      }
    };
  }]);
})();