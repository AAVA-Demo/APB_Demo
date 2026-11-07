(function() {
  'use strict';
  angular.module('creditCardApp').factory('TransactionDataFactory', ['$http', '$q', 'API_CONFIG', function($http, $q, API_CONFIG) {
    var mockTransactions = [
      {transactionId: 'TXN001', cardId: 'CC001', cardName: 'Visa *1234', merchantName: 'Starbucks', merchantCategory: 'Food & Dining', amount: 450, currency: 'INR', transactionDate: new Date('2024-01-15'), postingDate: new Date('2024-01-16'), status: 'Posted', description: 'Coffee purchase', referenceNumber: 'REF001'},
      {transactionId: 'TXN002', cardId: 'CC002', cardName: 'Mastercard *5678', merchantName: 'Shell Petrol', merchantCategory: 'Fuel', amount: 3200, currency: 'INR', transactionDate: new Date('2024-01-14'), postingDate: new Date('2024-01-15'), status: 'Posted', description: 'Fuel purchase', referenceNumber: 'REF002'},
      {transactionId: 'TXN003', cardId: 'CC001', cardName: 'Visa *1234', merchantName: 'Amazon', merchantCategory: 'Shopping', amount: 5600, currency: 'INR', transactionDate: new Date('2024-01-13'), postingDate: new Date('2024-01-14'), status: 'Posted', description: 'Online shopping', referenceNumber: 'REF003'},
      {transactionId: 'TXN004', cardId: 'CC003', cardName: 'Amex *9012', merchantName: 'MakeMyTrip', merchantCategory: 'Travel', amount: 15000, currency: 'INR', transactionDate: new Date('2024-01-12'), postingDate: new Date('2024-01-13'), status: 'Posted', description: 'Flight booking', referenceNumber: 'REF004'},
      {transactionId: 'TXN005', cardId: 'CC002', cardName: 'Mastercard *5678', merchantName: 'PVR Cinemas', merchantCategory: 'Entertainment', amount: 1200, currency: 'INR', transactionDate: new Date('2024-01-11'), postingDate: new Date('2024-01-12'), status: 'Posted', description: 'Movie tickets', referenceNumber: 'REF005'},
      {transactionId: 'TXN006', cardId: 'CC001', cardName: 'Visa *1234', merchantName: 'Electricity Board', merchantCategory: 'Utilities', amount: 2500, currency: 'INR', transactionDate: new Date('2024-01-10'), postingDate: new Date('2024-01-11'), status: 'Posted', description: 'Electricity bill', referenceNumber: 'REF006'},
      {transactionId: 'TXN007', cardId: 'CC003', cardName: 'Amex *9012', merchantName: 'Apollo Pharmacy', merchantCategory: 'Healthcare', amount: 850, currency: 'INR', transactionDate: new Date('2024-01-09'), postingDate: new Date('2024-01-10'), status: 'Posted', description: 'Medicine purchase', referenceNumber: 'REF007'},
      {transactionId: 'TXN008', cardId: 'CC002', cardName: 'Mastercard *5678', merchantName: 'Coursera', merchantCategory: 'Education', amount: 3500, currency: 'INR', transactionDate: new Date('2024-01-08'), postingDate: new Date('2024-01-09'), status: 'Posted', description: 'Online course', referenceNumber: 'REF008'},
      {transactionId: 'TXN009', cardId: 'CC001', cardName: 'Visa *1234', merchantName: 'Dominos', merchantCategory: 'Food & Dining', amount: 750, currency: 'INR', transactionDate: new Date('2024-01-07'), postingDate: new Date('2024-01-08'), status: 'Posted', description: 'Pizza delivery', referenceNumber: 'REF009'},
      {transactionId: 'TXN010', cardId: 'CC003', cardName: 'Amex *9012', merchantName: 'HP Petrol', merchantCategory: 'Fuel', amount: 2800, currency: 'INR', transactionDate: new Date('2024-01-06'), postingDate: new Date('2024-01-07'), status: 'Posted', description: 'Fuel purchase', referenceNumber: 'REF010'}
    ];
    for (var i = 11; i <= 120; i++) {
      var categories = ['Food & Dining', 'Fuel', 'Shopping', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Education', 'Miscellaneous'];
      var merchants = ['Restaurant', 'Petrol Pump', 'Store', 'Travel Agency', 'Cinema', 'Utility Provider', 'Pharmacy', 'School', 'Other'];
      var catIdx = Math.floor(Math.random() * categories.length);
      mockTransactions.push({
        transactionId: 'TXN' + String(i).padStart(3, '0'),
        cardId: ['CC001', 'CC002', 'CC003'][Math.floor(Math.random() * 3)],
        cardName: ['Visa *1234', 'Mastercard *5678', 'Amex *9012'][Math.floor(Math.random() * 3)],
        merchantName: merchants[catIdx] + ' ' + i,
        merchantCategory: categories[catIdx],
        amount: Math.floor(Math.random() * 10000) + 100,
        currency: 'INR',
        transactionDate: new Date(2024, 0, Math.floor(Math.random() * 30) + 1),
        postingDate: new Date(2024, 0, Math.floor(Math.random() * 30) + 1),
        status: 'Posted',
        description: 'Transaction ' + i,
        referenceNumber: 'REF' + String(i).padStart(3, '0')
      });
    }
    return {
      getCurrentMonthTransactions: function() {
        var deferred = $q.defer();
        setTimeout(function() {
          var currentMonth = new Date().getMonth();
          var filtered = mockTransactions.filter(function(t) {
            return t.transactionDate.getMonth() === currentMonth;
          });
          deferred.resolve(angular.copy(filtered));
        }, 400);
        return deferred.promise;
      },
      getTransactions: function(dateRange) {
        var deferred = $q.defer();
        setTimeout(function() {
          deferred.resolve(angular.copy(mockTransactions));
        }, 400);
        return deferred.promise;
      },
      fetchTransactions: function(page, pageSize, filters) {
        var deferred = $q.defer();
        setTimeout(function() {
          var filtered = angular.copy(mockTransactions);
          if (filters && filters.cardId && filters.cardId !== 'all') {
            filtered = filtered.filter(function(t) { return t.cardId === filters.cardId; });
          }
          var start = (page - 1) * pageSize;
          var end = start + pageSize;
          var paginated = filtered.slice(start, end);
          deferred.resolve({
            transactions: paginated,
            pagination: {
              currentPage: page,
              pageSize: pageSize,
              totalRecords: filtered.length,
              totalPages: Math.ceil(filtered.length / pageSize),
              hasNextPage: end < filtered.length,
              hasPreviousPage: page > 1
            }
          });
        }, 300);
        return deferred.promise;
      },
      getTransactionById: function(transactionId) {
        var deferred = $q.defer();
        setTimeout(function() {
          var found = mockTransactions.find(function(t) { return t.transactionId === transactionId; });
          deferred.resolve(angular.copy(found));
        }, 200);
        return deferred.promise;
      }
    };
  }]);
})();