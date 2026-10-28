(function() {
  'use strict';
  angular.module('fraudAlertApp').factory('emailProviderFactory', ['$http', '$q', 'configService', function($http, $q, configService) {
    const emailProviderUrl = configService.get('emailProviderUrl');
    return {
      sendEmail: (emailAddress, notificationContent) => {
        const payload = {
          to: emailAddress,
          subject: notificationContent.subject,
          body: notificationContent.body,
          from: 'fraud-alerts@example.com'
        };
        return $http.post(`${emailProviderUrl}/email/send`, payload)
          .then(response => {
            console.log('Email sent successfully:', response.data);
            return response.data;
          })
          .catch(error => {
            console.error('Email delivery failed:', error);
            return $q.reject(error);
          });
      }
    };
  }]);
})();