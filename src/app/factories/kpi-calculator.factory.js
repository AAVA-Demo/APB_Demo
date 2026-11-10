(function(){
'use strict';
angular.module('creditCardApp')
.factory('KpiCalculatorFactory',[function(){
return{
calculateKpis:function(cards){
var totalCreditLimit=0;
var outstandingAmount=0;
var monthlySpend=0;
cards.forEach(function(card){
totalCreditLimit+=card.creditLimit;
outstandingAmount+=card.outstandingAmount;
monthlySpend+=card.monthlySpend;
});
var availableCredit=totalCreditLimit-outstandingAmount;
return{
monthlySpend:parseFloat(monthlySpend.toFixed(2)),
totalCreditLimit:parseFloat(totalCreditLimit.toFixed(2)),
availableCredit:parseFloat(availableCredit.toFixed(2)),
outstandingAmount:parseFloat(outstandingAmount.toFixed(2)),
lastUpdated:new Date()
};
}
};
}]);
})();