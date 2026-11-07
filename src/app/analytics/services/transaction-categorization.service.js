(function() {
  'use strict';
  angular.module('app.analytics').service('TransactionCategorizationService', [function() {
    var categoryMap = new Map([
      ['Starbucks', 'Food & Dining'],
      ['Dominos', 'Food & Dining'],
      ['Restaurant', 'Food & Dining'],
      ['Shell Petrol', 'Fuel'],
      ['HP Petrol', 'Fuel'],
      ['Petrol Pump', 'Fuel'],
      ['Amazon', 'Shopping'],
      ['Store', 'Shopping'],
      ['MakeMyTrip', 'Travel'],
      ['Travel Agency', 'Travel'],
      ['PVR Cinemas', 'Entertainment'],
      ['Cinema', 'Entertainment'],
      ['Electricity Board', 'Utilities'],
      ['Utility Provider', 'Utilities'],
      ['Apollo Pharmacy', 'Healthcare'],
      ['Pharmacy', 'Healthcare'],
      ['Coursera', 'Education'],
      ['School', 'Education']
    ]);
    this.categorizeTransactions = function(transactions) {
      return transactions.map(function(txn) {
        if (!txn.merchantCategory || txn.merchantCategory === 'Miscellaneous') {
          var found = false;
          categoryMap.forEach(function(category, merchant) {
            if (txn.merchantName.indexOf(merchant) !== -1) {
              txn.merchantCategory = category;
              found = true;
            }
          });
          if (!found) txn.merchantCategory = 'Miscellaneous';
        }
        return txn;
      });
    };
  }]);
})();