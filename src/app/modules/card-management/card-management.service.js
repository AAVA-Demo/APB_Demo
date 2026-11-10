(function() {
  'use strict';
  angular.module('app.cardManagement')
    .factory('CardManagementService', ['ApiGatewayService', '$q', function(ApiGatewayService, $q) {
      return {
        getAllCards: function() {
          var deferred = $q.defer();
          ApiGatewayService.get('/cards')
            .then(function(response) {
              var cards = response.map(function(cardData) {
                return new window.CreditCardModel(cardData);
              });
              deferred.resolve(cards);
            })
            .catch(function(error) {
              var mockCards = [
                {cardId: '1', cardNumber: '**** 1234', cardholderName: 'John Doe', issuer: 'Visa', creditLimit: 50000, availableCredit: 35000, outstandingAmount: 15000, status: 'Active'},
                {cardId: '2', cardNumber: '**** 5678', cardholderName: 'John Doe', issuer: 'Mastercard', creditLimit: 75000, availableCredit: 42549.25, outstandingAmount: 32450.75, status: 'Active'},
                {cardId: '3', cardNumber: '**** 9012', cardholderName: 'John Doe', issuer: 'Amex', creditLimit: 25000, availableCredit: 10000, outstandingAmount: 15000, status: 'Active'}
              ];
              var cards = mockCards.map(function(cardData) {
                return new window.CreditCardModel(cardData);
              });
              deferred.resolve(cards);
            });
          return deferred.promise;
        },
        getCardDetails: function(cardId) {
          var deferred = $q.defer();
          ApiGatewayService.get('/cards/' + cardId + '/spending')
            .then(function(response) {
              var card = new window.CreditCardModel(response.card);
              var spending = new window.CardSpendingModel(response.spending);
              deferred.resolve({card: card, spending: spending});
            })
            .catch(function(error) {
              var mockCard = {cardId: cardId, cardNumber: '**** 1234', cardholderName: 'John Doe', issuer: 'Visa', creditLimit: 50000, availableCredit: 35000, outstandingAmount: 15000, status: 'Active'};
              var mockSpending = {cardId: cardId, monthlySpend: 15000, transactionCount: 45, lastTransactionDate: new Date()};
              deferred.resolve({
                card: new window.CreditCardModel(mockCard),
                spending: new window.CardSpendingModel(mockSpending)
              });
            });
          return deferred.promise;
        }
      };
    }]);
})();