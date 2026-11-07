(function() {
  'use strict';
  angular.module('ccApp').factory('CreditCard', [function() {
    function CreditCard(data) {
      this.id = data.id || '';
      this.cardNumber = data.cardNumber || '';
      this.cardName = data.cardName || '';
      this.cardType = data.cardType || '';
      this.creditLimit = data.creditLimit || 0;
      this.availableCredit = data.availableCredit || 0;
      this.outstandingAmount = data.outstandingAmount || 0;
      this.monthlySpend = data.monthlySpend || 0;
      this.dueDate = data.dueDate ? new Date(data.dueDate) : null;
      this.status = data.status || 'active';
    }
    CreditCard.prototype.getUtilizationPercentage = function() {
      return this.creditLimit > 0 ? ((this.creditLimit - this.availableCredit) / this.creditLimit * 100).toFixed(2) : 0;
    };
    CreditCard.prototype.isActive = function() {
      return this.status === 'active';
    };
    return CreditCard;
  }]);
})();