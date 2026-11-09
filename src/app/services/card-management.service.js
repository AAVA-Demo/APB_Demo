(function() {
  'use strict';
  angular.module('cc.cardManagement')
    .service('CardManagementService', ['CardRepositoryFactory', 'TransactionFactory', CardManagementService]);
  function CardManagementService(CardRepositoryFactory, TransactionFactory) {
    this.getAllCards = function() {
      return CardRepositoryFactory.getCards();
    };
    this.getCardSpending = function(cardId) {
      return TransactionFactory.getCardTransactions(cardId);
    };
  }
})();