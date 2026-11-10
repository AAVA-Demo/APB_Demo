(function() {
  'use strict';
  angular.module('dashboardModule').directive('creditcardSummary', creditcardSummary);
  function creditcardSummary() {
    return {
      restrict: 'E',
      scope: {
        card: '='
      },
      template: '<div class="card-summary"><h4>{{card.cardName}}</h4><p><strong>Card Number:</strong> {{card.cardNumber}}</p><div class="row"><div class="col-sm-6"><p><strong>Credit Limit:</strong> ${{card.creditLimit | number:2}}</p><p><strong>Available Credit:</strong> ${{card.availableCredit | number:2}}</p></div><div class="col-sm-6"><p><strong>Current Balance:</strong> ${{card.currentBalance | number:2}}</p><p><strong>Outstanding:</strong> ${{card.outstandingAmount | number:2}}</p></div></div><p ng-if="card.dueDate"><strong>Due Date:</strong> {{card.dueDate | date:"MMM dd, yyyy"}}</p></div>'
    };
  }
})();