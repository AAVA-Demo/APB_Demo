(function(){
'use strict';
angular.module('creditCard.dashboard').directive('cardSummary',[function(){
return{
restrict:'E',scope:{card:'='},template:'<div class="card-tile"><div class="card-name">{{card.cardName}}</div><div class="card-number">****{{card.lastFourDigits}}</div><div><strong>Balance:</strong> <span class="card-balance">{{card.outstandingBalance|currency}}</span></div><div><strong>Limit:</strong> {{card.creditLimit|currency}}</div><div><strong>Available:</strong> {{card.availableCredit|currency}}</div><div><strong>Monthly Spend:</strong> {{card.monthlySpend|currency}}</div></div>'
};
}]);
})();