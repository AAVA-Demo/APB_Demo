(function() {
  'use strict';
  angular.module('fraudAlertApp').service('configService', [function() {
    const config = {
      apiBaseUrl: 'https://api.fraudalert.example.com',
      riskEngineUrl: 'https://risk-engine.example.com/api/v1',
      pushProviderUrl: 'https://push.example.com/api/v1',
      smsProviderUrl: 'https://sms.example.com/api/v1',
      emailProviderUrl: 'https://email.example.com/api/v1',
      alertThresholds: {
        low: 25,
        medium: 50,
        high: 75,
        critical: 90
      },
      alertExpiryHours: 72
    };
    this.get = (key) => config[key];
    this.getAll = () => config;
  }]);
})();