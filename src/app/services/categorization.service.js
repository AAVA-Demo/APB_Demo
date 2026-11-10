(function() {
  'use strict';
  angular.module('creditCardApp').service('CategorizationService', [function() {
    const CATEGORIES = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
    this.aggregateByCategory = function(transactions) {
      if (!transactions || transactions.length === 0) {
        return CATEGORIES.map(cat => ({category: cat, total: 0, transactionCount: 0, percentage: 0}));
      }
      const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
      const categoryMap = {};
      CATEGORIES.forEach(cat => {
        categoryMap[cat] = {category: cat, total: 0, transactionCount: 0, percentage: 0};
      });
      transactions.forEach(t => {
        if (categoryMap[t.category]) {
          categoryMap[t.category].total += t.amount;
          categoryMap[t.category].transactionCount++;
        }
      });
      return CATEGORIES.map(cat => {
        const data = categoryMap[cat];
        data.percentage = totalAmount > 0 ? (data.total / totalAmount * 100).toFixed(2) : 0;
        return data;
      });
    };
    this.getCategories = function() {
      return angular.copy(CATEGORIES);
    };
  }]);
})();