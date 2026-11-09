(function() {
  'use strict';
  angular.module('creditCardApp').service('creditCardDataService', ['$http', '$q', 'apiConfig', function($http, $q, apiConfig) {
    this.getCreditCardData = function() {
      const deferred = $q.defer();
      const url = apiConfig.baseUrl + apiConfig.endpoints.creditCards;
      $http.get(url, {timeout: apiConfig.timeout}).then(function(response) {
        deferred.resolve(response.data);
      }, function(error) {
        console.error('Error fetching credit card data:', error);
        deferred.resolve(getMockCreditCardData());
      });
      return deferred.promise;
    };
    function getMockCreditCardData() {
      return [
        {cardId: 'card1', cardNumber: '**** **** **** 1234', balance: 2500, creditLimit: 10000, availableCredit: 7500},
        {cardId: 'card2', cardNumber: '**** **** **** 5678', balance: 1200, creditLimit: 5000, availableCredit: 3800},
        {cardId: 'card3', cardNumber: '**** **** **** 9012', balance: 800, creditLimit: 8000, availableCredit: 7200}
      ];
    }
  }]);
})();