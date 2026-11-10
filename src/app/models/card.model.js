(function() {
  'use strict';
  angular.module('creditCardApp').factory('CardModel', [function() {
    function Card(data) {
      this.cardId = data.cardId || '';
      this.userId = data.userId || '';
      this.cardNumber = data.cardNumber || '';
      this.cardType = data.cardType || '';
      this.creditLimit = data.creditLimit || 0;
      this.currentBalance = data.currentBalance || 0;
      this.availableCredit = data.availableCredit || 0;
      this.utilizationRate = data.utilizationRate || 0;
      this.monthlySpend = data.monthlySpend || 0;
      this.lastUpdated = data.lastUpdated || new Date();
    }
    
    Card.prototype.getUtilizationPercentage = function() {
      return ((this.currentBalance / this.creditLimit) * 100).toFixed(2);
    };
    
    return Card;
  }]);
})();