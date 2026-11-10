(function() {
  'use strict';
  angular.module('cardManagementModule')
    .service('CardDataService', ['$http', '$q', function($http, $q) {
      const mockData = {
        card1: {cardId: 'card1', cardNumber: '**** **** **** 1234', cardType: 'Visa', creditLimit: 50000, outstandingBalance: 12500, availableCredit: 37500, status: 'active', expiryDate: '12/25'},
        card2: {cardId: 'card2', cardNumber: '**** **** **** 5678', cardType: 'MasterCard', creditLimit: 30000, outstandingBalance: 8000, availableCredit: 22000, status: 'active', expiryDate: '06/26'},
        card3: {cardId: 'card3', cardNumber: '**** **** **** 9012', cardType: 'Amex', creditLimit: 20000, outstandingBalance: 5000, availableCredit: 15000, status: 'active', expiryDate: '03/27'},
        card4: {cardId: 'card4', cardNumber: '**** **** **** 3456', cardType: 'Visa', creditLimit: 40000, outstandingBalance: 15000, availableCredit: 25000, status: 'inactive', expiryDate: '09/24'}
      };
      this.getCardDetails = function(cardId) {
        return $http.get('/api/cards/' + cardId).then(function(response) {
          return response.data;
        }).catch(function() {
          return mockData[cardId] || {};
        });
      };
    }]);
})();