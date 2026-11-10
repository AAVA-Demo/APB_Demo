(function(){
'use strict';
angular.module('creditCard.dashboard').service('DashboardService',['CreditCardDataService','KPICalculationService','$q',function(CreditCardDataService,KPICalculationService,$q){
let cachedKPIs=null;
this.getDashboardKPIs=function(forceRefresh){
if(cachedKPIs&&!forceRefresh)return $q.resolve(cachedKPIs);
return CreditCardDataService.fetchAllCards().then(function(cards){
const kpis=KPICalculationService.calculateKPIs(cards);
cachedKPIs=kpis;
return kpis;
}).catch(function(err){
return $q.reject(err);
});
};
}]);
})();