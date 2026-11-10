(function() {
  'use strict';
  angular.module('dashboard')
    .factory('CreditCardDataFactory', ['$http', '$q', function($http, $q) {
      var cache = null;
      var cacheTime = null;
      var CACHE_DURATION = 300000;
      return {
        getAllCards: function() {
          if (cache && cacheTime && (Date.now() - cacheTime < CACHE_DURATION)) {
            return $q.resolve(cache);
          }
          var mockData = [
            {cardId: 'c1', cardNumber: '**** **** **** 1234', issuer: 'Chase', cardType: 'Visa', creditLimit: 10000, currentBalance: 3500, availableCredit: 6500, outstandingAmount: 3500, monthlySpend: 1200, status: 'active', expiryDate: '12/2026'},
            {cardId: 'c2', cardNumber: '**** **** **** 5678', issuer: 'Citi', cardType: 'MasterCard', creditLimit: 15000, currentBalance: 5000, availableCredit: 10000, outstandingAmount: 5000, monthlySpend: 1800, status: 'active', expiryDate: '08/2025'},
            {cardId: 'c3', cardNumber: '**** **** **** 9012', issuer: 'Amex', cardType: 'American Express', creditLimit: 20000, currentBalance: 7500, availableCredit: 12500, outstandingAmount: 7500, monthlySpend: 2500, status: 'active', expiryDate: '03/2027'}
          ];
          cache = mockData;
          cacheTime = Date.now();
          return $q.resolve(mockData);
        }
      };
    }]);
})();