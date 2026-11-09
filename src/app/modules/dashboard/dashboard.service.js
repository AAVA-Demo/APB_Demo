(function(){
'use strict';
angular.module('dashboardModule').service('DashboardService',['CreditCardFactory','TransactionFactory','KPICalculationService','$q',function(CreditCardFactory,TransactionFactory,KPICalculationService,$q){
const self=this;
self.loadKPIs=function(userId){
const promises={
cards:CreditCardFactory.getAllCards({userId:userId}).$promise,
spend:TransactionFactory.getMonthlySpend({userId:userId}).$promise
};
return $q.all(promises).then(function(results){
const cards=results.cards;
const spendData=results.spend;
return KPICalculationService.calculate(cards,spendData);
});
};
}]);
})();