(function() {
  'use strict';
  angular.module('fraudAlertApp').service('notificationOrchestratorService', ['$q', 'customerProfileService', 'pushNotificationFactory', 'smsProviderFactory', 'emailProviderFactory', 'inAppNotificationService', 'alertFormatterService', 'notificationStatusService', 'analyticsService', function($q, customerProfileService, pushNotificationFactory, smsProviderFactory, emailProviderFactory, inAppNotificationService, alertFormatterService, notificationStatusService, analyticsService) {
    this.sendNotification = (alertData) => {
      const customerId = alertData.customer_id;
      return customerProfileService.getNotificationPreferences(customerId)
        .then(preferences => {
          const primaryChannel = preferences.primary_channel;
          const fallbackChannels = preferences.fallback_channels || [];
          return this._attemptDelivery(alertData, primaryChannel, preferences)
            .catch(error => {
              console.warn(`Primary channel ${primaryChannel} failed, attempting fallback`, error);
              return this._attemptFallback(alertData, fallbackChannels, preferences);
            });
        })
        .catch(error => {
          console.error('Notification orchestration failed:', error);
          return $q.reject(error);
        });
    };
    this._attemptDelivery = (alertData, channel, preferences) => {
      const formattedAlert = alertFormatterService.formatAlert(alertData, channel);
      analyticsService.emitFraudAlertSent(alertData.alert_id, channel);
      switch (channel) {
        case 'push':
          if (!preferences.push_enabled || !preferences.device_tokens || preferences.device_tokens.length === 0) {
            return $q.reject({ reason: 'Push not enabled or no device tokens' });
          }
          return pushNotificationFactory.sendPushNotification(preferences.device_tokens, formattedAlert)
            .then(response => {
              notificationStatusService.recordDelivery(alertData.alert_id, channel, 'delivered', response);
              return { channel: channel, status: 'delivered' };
            })
            .catch(error => {
              notificationStatusService.recordDelivery(alertData.alert_id, channel, 'failed', error);
              return $q.reject(error);
            });
        case 'sms':
          if (!preferences.sms_enabled || !preferences.phone_number) {
            return $q.reject({ reason: 'SMS not enabled or no phone number' });
          }
          return smsProviderFactory.sendSms(preferences.phone_number, formattedAlert)
            .then(response => {
              notificationStatusService.recordDelivery(alertData.alert_id, channel, 'delivered', response);
              return { channel: channel, status: 'delivered' };
            })
            .catch(error => {
              notificationStatusService.recordDelivery(alertData.alert_id, channel, 'failed', error);
              return $q.reject(error);
            });
        case 'email':
          if (!preferences.email_enabled || !preferences.email_address) {
            return $q.reject({ reason: 'Email not enabled or no email address' });
          }
          return emailProviderFactory.sendEmail(preferences.email_address, formattedAlert)
            .then(response => {
              notificationStatusService.recordDelivery(alertData.alert_id, channel, 'delivered', response);
              return { channel: channel, status: 'delivered' };
            })
            .catch(error => {
              notificationStatusService.recordDelivery(alertData.alert_id, channel, 'failed', error);
              return $q.reject(error);
            });
        case 'in-app':
          if (!preferences.in_app_enabled) {
            return $q.reject({ reason: 'In-app notifications not enabled' });
          }
          inAppNotificationService.displayAlert(formattedAlert);
          notificationStatusService.recordDelivery(alertData.alert_id, channel, 'delivered', { success: true });
          return $q.resolve({ channel: channel, status: 'delivered' });
        default:
          return $q.reject({ reason: 'Unknown channel: ' + channel });
      }
    };
    this._attemptFallback = (alertData, fallbackChannels, preferences) => {
      if (!fallbackChannels || fallbackChannels.length === 0) {
        return $q.reject({ reason: 'No fallback channels available' });
      }
      const attemptNext = (index) => {
        if (index >= fallbackChannels.length) {
          return $q.reject({ reason: 'All fallback channels failed' });
        }
        const channel = fallbackChannels[index];
        return this._attemptDelivery(alertData, channel, preferences)
          .catch(error => {
            console.warn(`Fallback channel ${channel} failed, trying next`, error);
            return attemptNext(index + 1);
          });
      };
      return attemptNext(0);
    };
  }]);
})();