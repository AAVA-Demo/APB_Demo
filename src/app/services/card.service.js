(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('CardService', ['$http', '$q', function($http, $q) {
      var service = this;
      service.getCards = function() {
        return $http.get('/api/cards').then(function(response) {
          return response.data;
        }).catch(function(error) {
          console.error('Error fetching cards:', error);
          return $q.reject(error);
        });
      };
      service.getMockCards = function() {
        return $q.resolve([
          {cardId: 'C001', cardNumber: '**** **** **** 1234', cardType: 'Visa', issuer: 'Chase', issuerLogo: '', creditLimit: 10000, outstandingAmount: 2500, availableCredit: 7500, expiryDate: '2026-12-31', status: 'Active'},
          {cardId: 'C002', cardNumber: '**** **** **** 5678', cardType: 'Mastercard', issuer: 'Citi', issuerLogo: '', creditLimit: 15000, outstandingAmount: 8000, availableCredit: 7000, expiryDate: '2027-06-30', status: 'Active'},
          {cardId: 'C003', cardNumber: '**** **** **** 9012', cardType: 'Amex', issuer: 'American Express', issuerLogo: '', creditLimit: 20000, outstandingAmount: 5000, availableCredit: 15000, expiryDate: '2028-03-31', status: 'Active'},
          {cardId: 'C004', cardNumber: '**** **** **** 3456', cardType: 'Visa', issuer: 'Bank of America', issuerLogo: '', creditLimit: 12000, outstandingAmount: 3000, availableCredit: 9000, expiryDate: '2026-09-30', status: 'Active'},
          {cardId: 'C005', cardNumber: '**** **** **** 7890', cardType: 'Discover', issuer: 'Discover', issuerLogo: '', creditLimit: 8000, outstandingAmount: 1500, availableCredit: 6500, expiryDate: '2027-11-30', status: 'Active'}
        ]);
      };
    }]);
})();