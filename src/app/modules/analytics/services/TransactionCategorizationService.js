(function() {
  'use strict';
  angular.module('creditCard.analytics')
    .service('TransactionCategorizationService', [function() {
      const categoryMap = {
        '5812': 'Food & Dining',
        '5814': 'Food & Dining',
        '5541': 'Fuel',
        '5542': 'Fuel',
        '5311': 'Shopping',
        '5331': 'Shopping',
        '4511': 'Travel',
        '4722': 'Travel',
        '7832': 'Entertainment',
        '7922': 'Entertainment',
        '4900': 'Utilities',
        '4814': 'Utilities',
        '8011': 'Healthcare',
        '8021': 'Healthcare',
        '8211': 'Education',
        '8220': 'Education'
      };
      this.categorize = function(transaction) {
        if (transaction.category) {
          return transaction.category;
        }
        const category = categoryMap[transaction.merchantCode];
        return category || 'Miscellaneous';
      };
    }]);
})();