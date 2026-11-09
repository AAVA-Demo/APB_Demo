(function(){
'use strict';
angular.module('dashboard').factory('kpiCalculationFactory',[function(){
return{
calculateKPIs:function(cards,transactions){
var totalCreditLimit=0;
var outstandingAmount=0;
var monthlySpend=0;
angular.forEach(cards,function(card){
totalCreditLimit+=card.creditLimit||0;
outstandingAmount+=card.currentBalance||0;
});
angular.forEach(transactions,function(transaction){
monthlySpend+=transaction.amount||0;
});
var availableCredit=totalCreditLimit-outstandingAmount;
return{
monthlySpend:monthlySpend,
totalCreditLimit:totalCreditLimit,
availableCredit:availableCredit,
outstandingAmount:outstandingAmount,
lastUpdated:new Date()
};
}
};
}]);
})();