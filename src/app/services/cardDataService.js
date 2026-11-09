(function() {
  'use strict';
  angular.module('creditCardApp').service('cardDataService', ['$http', '$q', 'apiConfig', 'authService', function($http, $q, apiConfig, authService) {
    this.getCardList = function(userId) {
      const deferred = $q.defer();
      authService.validateSession().then(function(token) {
        const url = apiConfig.baseUrl + apiConfig.endpoints.cards;
        $http.get(url, {timeout: apiConfig.timeout}).then(function(response) {
          deferred.resolve(response.data);
        }, function(error) {
          console.error('Error fetching card list:', error);
          deferred.resolve(getMockCardList());
        });
      });
      return deferred.promise;
    };
    function getMockCardList() {
      return [
        {cardId: 'card1', cardNumber: '**** **** **** 1234', cardType: 'Visa', issuer: 'Chase', balance: 2500, creditLimit: 10000, availableCredit: 7500, monthlySpend: 2500},
        {cardId: 'card2', cardNumber: '**** **** **** 5678', cardType: 'Mastercard', issuer: 'Citi', balance: 1200, creditLimit: 5000, availableCredit: 3800, monthlySpend: 1200},
        {cardId: 'card3', cardNumber: '**** **** **** 9012', cardType: 'Amex', issuer: 'American Express', balance: 800, creditLimit: 8000, availableCredit: 7200, monthlySpend: 800}
      ];
    }
  }]);
})();