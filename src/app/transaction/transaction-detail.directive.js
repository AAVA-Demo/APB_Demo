(function() {
  'use strict';
  angular.module('transactionModule').directive('transactionDetail', [function() {
    return {
      restrict: 'E',
      scope: { transaction: '=' },
      template: '<div class="transaction-detail"><h3>Transaction Details</h3><div class="row"><div class="col-md-6"><p><strong>Transaction ID:</strong> {{transaction.transactionId}}</p><p><strong>Date:</strong> {{transaction.transactionDate | date:"medium"}}</p><p><strong>Merchant:</strong> {{transaction.merchantName}}</p><p><strong>Category:</strong> {{transaction.category}}</p></div><div class="col-md-6"><p><strong>Amount:</strong> {{transaction.amount | currency}}</p><p><strong>Status:</strong> {{transaction.status}}</p><p><strong>Card:</strong> {{transaction.cardDetails.cardNumber}}</p><p><strong>Description:</strong> {{transaction.description}}</p></div></div></div>'
    };
  }]);
})();