(function() {
  'use strict';
  angular.module('analyticsModule')
    .service('transactionDataService', TransactionDataService);
  TransactionDataService.$inject = ['$http', '$q', 'API_BASE_URL'];
  function TransactionDataService($http, $q, API_BASE_URL) {
    var service = this;
    service.getTransactions = function(userId) {
      var deferred = $q.defer();
      $http.get(API_BASE_URL + '/transactions', {
        params: {userId: userId},
        cache: true
      }).then(function(response) {
        deferred.resolve(response.data);
      }).catch(function() {
        var mockTransactions = [
          {transactionId: 'txn001', cardId: 'card001', merchantName: 'Swiggy', amount: 450, transactionDate: new Date('2024-01-10'), transactionType: 'Food'},
          {transactionId: 'txn002', cardId: 'card001', merchantName: 'HP Petrol Pump', amount: 2000, transactionDate: new Date('2024-01-12'), transactionType: 'Fuel'},
          {transactionId: 'txn003', cardId: 'card002', merchantName: 'Amazon', amount: 3500, transactionDate: new Date('2024-01-14'), transactionType: 'Shopping'},
          {transactionId: 'txn004', cardId: 'card002', merchantName: 'BookMyShow', amount: 800, transactionDate: new Date('2024-01-15'), transactionType: 'Entertainment'},
          {transactionId: 'txn005', cardId: 'card003', merchantName: 'Uber', amount: 350, transactionDate: new Date('2024-01-16'), transactionType: 'Travel'},
          {transactionId: 'txn006', cardId: 'card001', merchantName: 'Apollo Pharmacy', amount: 1200, transactionDate: new Date('2024-01-17'), transactionType: 'Healthcare'},
          {transactionId: 'txn007', cardId: 'card002', merchantName: 'Electricity Bill', amount: 1500, transactionDate: new Date('2024-01-18'), transactionType: 'Utilities'},
          {transactionId: 'txn008', cardId: 'card003', merchantName: 'Coursera', amount: 2500, transactionDate: new Date('2024-01-19'), transactionType: 'Education'},
          {transactionId: 'txn009', cardId: 'card001', merchantName: 'Dominos Pizza', amount: 650, transactionDate: new Date('2024-01-20'), transactionType: 'Food'},
          {transactionId: 'txn010', cardId: 'card002', merchantName: 'Flipkart', amount: 4200, transactionDate: new Date('2024-01-21'), transactionType: 'Shopping'}
        ];
        deferred.resolve(mockTransactions);
      });
      return deferred.promise;
    };
  }
})();