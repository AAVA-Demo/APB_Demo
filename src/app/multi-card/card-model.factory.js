(function() {
  'use strict';
  angular.module('creditCard.multiCardModule')
    .factory('CardModel', [function() {
      function CardModel(data) {
        this.cardId = data.cardId;
        this.cardNumber = data.cardNumber;
        this.cardType = data.cardType;
        this.cardHolderName = data.cardHolderName;
        this.creditLimit = data.creditLimit;
        this.availableCredit = data.availableCredit;
        this.outstandingAmount = data.outstandingAmount;
        this.monthlySpend = data.monthlySpend;
        this.utilizationRate = data.utilizationRate;
        this.lastUpdated = data.lastUpdated;
      }
      CardModel.prototype.getMaskedNumber = function() {
        if (!this.cardNumber) return '****0000';
        var last4 = this.cardNumber.slice(-4);
        return '****' + last4;
      };
      CardModel.prototype.getUtilizationStatus = function() {
        if (this.utilizationRate < 30) return 'Low';
        if (this.utilizationRate < 70) return 'Medium';
        return 'High';
      };
      return CardModel;
    }]);
})();