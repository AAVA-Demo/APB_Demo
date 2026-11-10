(function(){
'use strict';
angular.module('dashboardModule').service('DashboardService',['KPICalculationService','CreditCardDataFactory','$q',function(KPICalculationService,CreditCardDataFactory,$q){
this.loadDashboard=function(userId){
var deferred=$q.defer();
CreditCardDataFactory.fetchCreditCards(userId).then(function(cards){
var kpis=KPICalculationService.calculateKPIs(cards);
deferred.resolve(kpis);
},function(error){
deferred.reject(error);
});
return deferred.promise;
};
this.refreshDashboard=function(userId){
return this.loadDashboard(userId);
};
}]);
})();