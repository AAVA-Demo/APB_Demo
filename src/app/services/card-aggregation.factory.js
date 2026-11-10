(function(){
'use strict';
angular.module('creditCardApp').factory('CardAggregationFactory',[function(){
return{
calculateKPIs:function(cards){
if(!cards||cards.length===0){return{totalCreditLimit:0,totalAvailableCredit:0,totalOutstanding:0,totalMonthlySpend:0,cardCount:0};}
var kpis={totalCreditLimit:0,totalAvailableCredit:0,totalOutstanding:0,totalMonthlySpend:0,cardCount:cards.length};
cards.forEach(function(card){
kpis.totalCreditLimit+=card.creditLimit||0;
kpis.totalAvailableCredit+=card.availableCredit||0;
kpis.totalOutstanding+=card.outstandingAmount||0;
kpis.totalMonthlySpend+=card.monthlySpend||0;
});
return kpis;
}
};
}]);
})();