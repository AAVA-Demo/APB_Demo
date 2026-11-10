(function() {
  'use strict';
  angular.module('transaction')
    .service('CreditCardService', ['$q', function($q) {
      const mockCardMetadata = [
        { cardId: 'CC001', cardNumber: '**** 1234', cardType: 'Visa' },
        { cardId: 'CC002', cardNumber: '**** 5678', cardType: 'MasterCard' },
        { cardId: 'CC003', cardNumber: '**** 9012', cardType: 'Amex' }
      ];
      this.getCardMetadata = function(cardIds) {
        return $q.resolve(mockCardMetadata.filter(c => cardIds.includes(c.cardId)));
      };
    }]);
})();