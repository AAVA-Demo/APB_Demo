(function(){
'use strict';
angular.module('creditCardApp')
.service('DashboardAggregationService',['AuthService','CreditCardDataFactory','KpiCalculationService','$q',function(AuthService,CreditCardDataFactory,KpiCalculationService,$q){
this.loadDashboard=function(){
var deferred=$q.defer();
AuthService.validateAuth().then(function(){
return CreditCardDataFactory.fetchAllCards();
}).then(function(cards){
var kpis=KpiCalculationService.calculateKpis(cards);
deferred.resolve(kpis);
}).catch(function(error){
deferred.reject(error);
});
return deferred.promise;
};
}]);
})();