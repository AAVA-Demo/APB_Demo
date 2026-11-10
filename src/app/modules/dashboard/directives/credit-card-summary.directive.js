(function(){
'use strict';
angular.module('dashboardModule').directive('creditCardSummary',[function(){
return{restrict:'E',scope:{card:'='},template:'<div class="card-summary"><div class="card-number">{{card.cardType}} ****{{card.cardLast4}}</div><div class="card-detail">Credit Limit: {{card.creditLimit|currency}}</div><div class="card-detail">Available: {{card.availableCredit|currency}}</div><div class="card-detail">Outstanding: {{card.outstandingAmount|currency}}</div><div class="card-detail">Monthly Spend: {{card.monthlySpend|currency}}</div></div>'};
}]);
})();