(function(){
'use strict';
angular.module('creditCardApp').service('KPIAggregationService',['CardFactory',function(CardFactory){
var vm=this;
vm.aggregateKPIs=function(cards){
var kpis={totalMonthlySpend:0,totalCreditLimit:0,totalAvailableCredit:0,totalOutstanding:0,cardCount:cards.length,cards:cards};
angular.forEach(cards,function(card){
kpis.totalMonthlySpend+=card.monthlySpend;
kpis.totalCreditLimit+=card.creditLimit;
kpis.totalAvailableCredit+=card.availableCredit;
kpis.totalOutstanding+=card.outstandingAmount;
});
return kpis;
};
}]);
})();