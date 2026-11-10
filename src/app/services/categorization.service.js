(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('CategorizationService', [function() {
      var self = this;
      var mccMapping = {
        '5812': 'Food & Dining', '5814': 'Food & Dining', '5411': 'Food & Dining',
        '5541': 'Fuel', '5542': 'Fuel',
        '5311': 'Shopping', '5399': 'Shopping', '5651': 'Shopping',
        '3000': 'Travel', '3001': 'Travel', '4511': 'Travel',
        '7832': 'Entertainment', '7841': 'Entertainment',
        '4900': 'Utilities', '4814': 'Utilities',
        '8011': 'Healthcare', '8021': 'Healthcare',
        '8220': 'Education', '8299': 'Education'
      };
      self.categorize = function(transactions) {
        return transactions.map(function(txn) {
          var category = mccMapping[txn.merchantCode] || 'Miscellaneous';
          return angular.extend({}, txn, { category: category });
        });
      };
      self.recategorize = function(transactionId, newCategory) {
        return { transactionId: transactionId, category: newCategory };
      };
    }]);
})();