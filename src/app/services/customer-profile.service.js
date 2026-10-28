(function() {
  'use strict';
  angular.module('fraudAlertApp').service('customerProfileService', ['$http', '$q', 'configService', function($http, $q, configService) {
    const baseUrl = configService.get('apiBaseUrl');
    this.getNotificationPreferences = (customerId) => {
      return $http.get(`${baseUrl}/customers/${customerId}/preferences`)
        .then(response => response.data)
        .catch(error => {
          console.error('Failed to retrieve notification preferences:', error);
          return $q.resolve({
            customer_id: customerId,
            primary_channel: 'push',
            fallback_channels: ['sms', 'email'],
            push_enabled: true,
            sms_enabled: true,
            email_enabled: true,
            in_app_enabled: true,
            phone_number: null,
            email_address: null,
            device_tokens: []
          });
        });
    };
    this.updateNotificationPreferences = (customerId, preferences) => {
      return $http.put(`${baseUrl}/customers/${customerId}/preferences`, preferences)
        .then(response => response.data)
        .catch(error => {
          console.error('Failed to update notification preferences:', error);
          return $q.reject(error);
        });
    };
  }]);
})();