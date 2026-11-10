(function() {
  'use strict';
  angular.module('creditCardApp').service('CreditCardService', ['$http', '$q', 'AuthService', function($http, $q, AuthService) {
    var self = this;
    var cache = null;
    self.getPortfolio = function() {
      if (cache) {
        return $q.resolve(cache);
      }
      return $http.get('/api/creditcards/portfolio', {
        headers: { 'Authorization': 'Bearer ' + AuthService.getToken() }
      }).then(function(response) {
        cache = {
          totalCreditLimit: response.data.totalCreditLimit || 0,
          totalAvailableCredit: response.data.totalAvailableCredit || 0,
          totalOutstanding: response.data.totalOutstanding || 0,
          currentMonthSpend: response.data.currentMonthSpend || 0,
          cards: response.data.cards || []
        };
        return cache;
      }).catch(function(error) {
        return $q.reject(error);
      });
    };
    self.getCardById = function(cardId) {
      return $http.get('/api/creditcards/' + cardId, {
        headers: { 'Authorization': 'Bearer ' + AuthService.getToken() }
      }).then(function(response) {
        return response.data;
      }).catch(function(error) {
        return $q.reject(error);
      });
    };
    self.clearCache = function() {
      cache = null;
    };
    self.getMockPortfolio = function() {
      return $q.resolve({
        totalCreditLimit: 150000,
        totalAvailableCredit: 95000,
        totalOutstanding: 55000,
        currentMonthSpend: 32000,
        cards: [
          {
            cardId: 'CC001',
            cardNumber: '**** **** **** 1234',
            cardType: 'Visa Platinum',
            creditLimit: 100000,
            availableCredit: 65000,
            outstandingAmount: 35000,
            monthlySpend: 22000,
            lastUpdated: new Date()
          },
          {
            cardId: 'CC002',
            cardNumber: '**** **** **** 5678',
            cardType: 'Mastercard Gold',
            creditLimit: 50000,
            availableCredit: 30000,
            outstandingAmount: 20000,
            monthlySpend: 10000,
            lastUpdated: new Date()
          }
        ]
      });
    };
  }]);
})();