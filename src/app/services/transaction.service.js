(function() {
  'use strict';
  angular.module('creditCardApp').factory('TransactionService', ['$http', '$q', 'AuthService', function($http, $q, AuthService) {
    const mockTransactions = [
      {id: 't1', cardId: 'card-1', amount: 125.50, category: 'Food & Dining', merchant: 'Restaurant ABC', date: new Date('2024-01-15'), description: 'Dinner'},
      {id: 't2', cardId: 'card-1', amount: 60.00, category: 'Fuel', merchant: 'Gas Station XYZ', date: new Date('2024-01-14'), description: 'Fuel'},
      {id: 't3', cardId: 'card-2', amount: 299.99, category: 'Shopping', merchant: 'Online Store', date: new Date('2024-01-13'), description: 'Electronics'},
      {id: 't4', cardId: 'card-2', amount: 450.00, category: 'Travel', merchant: 'Airline', date: new Date('2024-01-12'), description: 'Flight ticket'},
      {id: 't5', cardId: 'card-3', amount: 89.99, category: 'Entertainment', merchant: 'Cinema', date: new Date('2024-01-11'), description: 'Movie tickets'},
      {id: 't6', cardId: 'card-1', amount: 150.00, category: 'Utilities', merchant: 'Electric Company', date: new Date('2024-01-10'), description: 'Bill payment'},
      {id: 't7', cardId: 'card-2', amount: 200.00, category: 'Healthcare', merchant: 'Pharmacy', date: new Date('2024-01-09'), description: 'Medicines'},
      {id: 't8', cardId: 'card-3', amount: 500.00, category: 'Education', merchant: 'Online Course', date: new Date('2024-01-08'), description: 'Course fee'},
      {id: 't9', cardId: 'card-1', amount: 75.25, category: 'Miscellaneous', merchant: 'General Store', date: new Date('2024-01-07'), description: 'Misc items'},
      {id: 't10', cardId: 'card-2', amount: 180.00, category: 'Food & Dining', merchant: 'Cafe', date: new Date('2024-01-06'), description: 'Brunch'},
      {id: 't11', cardId: 'card-1', amount: 95.50, category: 'Shopping', merchant: 'Clothing Store', date: new Date('2023-12-28'), description: 'Apparel'},
      {id: 't12', cardId: 'card-2', amount: 320.00, category: 'Travel', merchant: 'Hotel', date: new Date('2023-12-25'), description: 'Accommodation'},
      {id: 't13', cardId: 'card-3', amount: 110.00, category: 'Entertainment', merchant: 'Concert', date: new Date('2023-12-20'), description: 'Event tickets'},
      {id: 't14', cardId: 'card-1', amount: 140.00, category: 'Utilities', merchant: 'Internet Provider', date: new Date('2023-12-15'), description: 'Monthly bill'},
      {id: 't15', cardId: 'card-2', amount: 250.00, category: 'Healthcare', merchant: 'Clinic', date: new Date('2023-12-10'), description: 'Consultation'}
    ];
    return {
      getTransactions: function(userId, period) {
        const deferred = $q.defer();
        setTimeout(() => {
          deferred.resolve(angular.copy(mockTransactions));
        }, 400);
        return deferred.promise;
      },
      getMonthlySummary: function(userId) {
        const deferred = $q.defer();
        setTimeout(() => {
          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();
          const monthlyTotal = mockTransactions
            .filter(t => {
              const tDate = new Date(t.date);
              return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
            })
            .reduce((sum, t) => sum + t.amount, 0);
          deferred.resolve({monthlySpend: monthlyTotal});
        }, 300);
        return deferred.promise;
      },
      getTransactionsByCard: function(cardId) {
        const deferred = $q.defer();
        setTimeout(() => {
          const filtered = mockTransactions.filter(t => t.cardId === cardId);
          deferred.resolve(angular.copy(filtered));
        }, 250);
        return deferred.promise;
      }
    };
  }]);
})();