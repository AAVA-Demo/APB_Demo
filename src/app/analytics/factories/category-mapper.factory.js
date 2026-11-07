(function() {
  'use strict';
  angular.module('creditCard.analytics')
    .factory('CategoryMapper', [function() {
      const CATEGORIES = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
      return {
        categorizeTransactions: function(transactions) {
          return transactions.map(function(txn) {
            if (!txn.category || CATEGORIES.indexOf(txn.category) === -1) {
              txn.category = mapMerchantToCategory(txn.merchantName, txn.merchantCategory);
            }
            return txn;
          });
        },
        getCategories: function() {
          return CATEGORIES;
        }
      };
      function mapMerchantToCategory(merchantName, merchantCategory) {
        if (!merchantName && !merchantCategory) return 'Miscellaneous';
        const name = (merchantName || '').toLowerCase();
        const cat = (merchantCategory || '').toLowerCase();
        if (name.includes('restaurant') || name.includes('starbucks') || name.includes('cafe') || cat.includes('dining')) return 'Food & Dining';
        if (name.includes('shell') || name.includes('gas') || name.includes('fuel') || cat.includes('fuel')) return 'Fuel';
        if (name.includes('amazon') || name.includes('walmart') || name.includes('target') || cat.includes('shopping')) return 'Shopping';
        if (name.includes('airline') || name.includes('hotel') || name.includes('uber') || cat.includes('travel')) return 'Travel';
        if (name.includes('netflix') || name.includes('cinema') || name.includes('spotify') || cat.includes('entertainment')) return 'Entertainment';
        if (name.includes('electric') || name.includes('water') || name.includes('internet') || cat.includes('utilities')) return 'Utilities';
        if (name.includes('hospital') || name.includes('pharmacy') || name.includes('doctor') || cat.includes('healthcare')) return 'Healthcare';
        if (name.includes('school') || name.includes('university') || name.includes('course') || cat.includes('education')) return 'Education';
        return 'Miscellaneous';
      }
    }]);
})();