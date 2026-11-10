(function() {
  'use strict';
  angular.module('creditCardApp')
    .factory('CreditCardDataFactory', ['$http', '$q', 'API_CONFIG', 'AuthService', function($http, $q, API_CONFIG, AuthService) {
      var factory = {};
      factory.getCards = function(userId) {
        var deferred = $q.defer();
        var token = AuthService.getToken();
        var mockCards = [
          { cardId: 'card-001', cardNumber: '****1234', issuer: 'Chase', cardType: 'Visa', creditLimit: 10000, currentBalance: 2500, availableCredit: 7500, expiryDate: '12/28', status: 'Active' },
          { cardId: 'card-002', cardNumber: '****5678', issuer: 'Citi', cardType: 'Mastercard', creditLimit: 15000, currentBalance: 5000, availableCredit: 10000, expiryDate: '06/27', status: 'Active' },
          { cardId: 'card-003', cardNumber: '****9012', issuer: 'Amex', cardType: 'Amex', creditLimit: 20000, currentBalance: 8000, availableCredit: 12000, expiryDate: '03/29', status: 'Active' },
          { cardId: 'card-004', cardNumber: '****3456', issuer: 'Discover', cardType: 'Discover', creditLimit: 8000, currentBalance: 1500, availableCredit: 6500, expiryDate: '09/26', status: 'Active' },
          { cardId: 'card-005', cardNumber: '****7890', issuer: 'Wells Fargo', cardType: 'Visa', creditLimit: 12000, currentBalance: 3000, availableCredit: 9000, expiryDate: '11/28', status: 'Active' }
        ];
        setTimeout(function() {
          deferred.resolve(mockCards);
        }, 500);
        return deferred.promise;
      };
      return factory;
    }]);
})();