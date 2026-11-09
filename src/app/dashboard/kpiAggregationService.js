(function(){
'use strict';
angular.module('creditCardApp').service('kpiAggregationService',['$q','creditCardDataFactory','transactionDataFactory','calculationService',function($q,creditCardDataFactory,transactionDataFactory,calculationService){
const self=this;
self.getKPIs=function(){
return $q.all({
cards:creditCardDataFactory.fetchCards(),
transactions:transactionDataFactory.fetchMonthlyTransactions()
}).then(function(results){
const kpi=calculationService.calculateKPIs(results.cards,results.transactions);
return{
kpi:kpi,
cards:results.cards,
lastUpdated:new Date()
};
});
};
}]);
})();