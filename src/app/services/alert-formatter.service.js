(function() {
  'use strict';
  angular.module('fraudAlertApp').service('alertFormatterService', ['$filter', function($filter) {
    this.formatAlert = (alertData, channel) => {
      const transaction = alertData.transaction_details;
      const maskedCard = this._maskCardNumber(transaction.card_id);
      const formattedAmount = $filter('currency')(transaction.amount, transaction.currency);
      const formattedTime = $filter('date')(transaction.timestamp, 'short');
      const baseMessage = `Fraud Alert: Transaction of ${formattedAmount} at ${transaction.merchant} on ${formattedTime} with card ${maskedCard}.`;
      const actionMessage = 'Was this you? Tap to confirm or report.';
      switch (channel) {
        case 'push':
          return {
            title: 'Fraud Alert',
            body: baseMessage + ' ' + actionMessage,
            data: {
              alert_id: alertData.alert_id,
              deep_link: `/alert/${alertData.alert_id}`
            }
          };
        case 'sms':
          return {
            message: baseMessage + ' Reply YES if this was you, or NO to report fraud. Or visit the app for more details.'
          };
        case 'email':
          return {
            subject: 'Fraud Alert - Action Required',
            body: `<h2>Fraud Alert</h2><p>${baseMessage}</p><p>${actionMessage}</p><p><a href="https://app.example.com/alert/${alertData.alert_id}">View Alert</a></p>`
          };
        case 'in-app':
          return {
            title: 'Fraud Alert',
            message: baseMessage,
            alert_id: alertData.alert_id,
            severity: alertData.severity,
            transaction: {
              masked_card: maskedCard,
              amount: formattedAmount,
              merchant: transaction.merchant,
              time: formattedTime,
              location: transaction.location || 'Unknown'
            }
          };
        default:
          return { message: baseMessage };
      }
    };
    this._maskCardNumber = (cardId) => {
      if (!cardId) return '****';
      const cardStr = String(cardId);
      if (cardStr.length < 4) return '****';
      return '****' + cardStr.slice(-4);
    };
  }]);
})();