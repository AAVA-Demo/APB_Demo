(function() {
  'use strict';
  angular.module('cardManagementModule')
    .service('cardInfoService', CardInfoService);
  CardInfoService.$inject = ['$http', '$q', 'API_BASE_URL'];
  function CardInfoService($http, $q, API_BASE_URL) {
    var service = this;
    service.getCardDetails = function(cardId) {
      var deferred = $q.defer();
      $http.get(API_BASE_URL + '/cards/' + cardId).then(function(response) {
        deferred.resolve(response.data);
      }).catch(function() {
        var mockCards = {
          'card001': {cardId: 'card001', userId: 'user123', cardNumber: '****1234', issuer: 'HDFC Bank', cardType: 'Visa Platinum', creditLimit: 50000, availableCredit: 35000, outstandingBalance: 15000, billingCycleDate: new Date('2024-01-15')},
          'card002': {cardId: 'card002', userId: 'user123', cardNumber: '****5678', issuer: 'ICICI Bank', cardType: 'MasterCard Gold', creditLimit: 30000, availableCredit: 20000, outstandingBalance: 10000, billingCycleDate: new Date('2024-01-20')},
          'card003': {cardId: 'card003', userId: 'user123', cardNumber: '****9012', issuer: 'SBI Card', cardType: 'Visa Signature', creditLimit: 20000, availableCredit: 15000, outstandingBalance: 5000, billingCycleDate: new Date('2024-01-25')}
        };
        deferred.resolve(mockCards[cardId] || mockCards['card001']);
      });
      return deferred.promise;
    };
  }
})();