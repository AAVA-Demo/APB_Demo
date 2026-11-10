(function() {
  'use strict';
  angular.module('creditCardApp')
    .service('CreditCardDataService', ['ApiGatewayService', '$q', function(ApiGatewayService, $q) {
      this.getCardData = function(cardId) {
        return ApiGatewayService.get('/cards/' + cardId)
          .catch(function(error) {
            return {
              cardId: cardId,
              cardNumber: '**** **** **** ' + Math.floor(1000 + Math.random() * 9000),
              cardType: 'Visa',
              issuer: 'Chase Bank',
              brandingUrl: '',
              creditLimit: 15000,
              availableCredit: 12000,
              outstandingAmount: 3000,
              userId: 'user-123'
            };
          });
      };
      this.getAllCards = function(userId) {
        return ApiGatewayService.get('/cards?userId=' + userId)
          .catch(function(error) {
            var mockCards = [];
            for (var i = 1; i <= 3; i++) {
              mockCards.push({
                cardId: 'card-' + i,
                cardNumber: '**** **** **** ' + (1000 + i),
                cardType: i === 1 ? 'Visa' : i === 2 ? 'Mastercard' : 'Amex',
                issuer: i === 1 ? 'Chase' : i === 2 ? 'Citi' : 'American Express',
                brandingUrl: '',
                creditLimit: 15000 + (i * 5000),
                availableCredit: 12000 + (i * 3000),
                outstandingAmount: 3000 + (i * 1000),
                userId: userId
              });
            }
            return mockCards;
          });
      };
    }]);
})();