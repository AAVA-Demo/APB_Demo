(function(){
'use strict';
angular.module('dashboardModule').controller('DashboardController',['CreditCardDataService','KPIAggregationService','AuthService','$interval','$scope',function(CreditCardDataService,KPIAggregationService,AuthService,$interval,$scope){
var vm=this;
vm.kpis=null;
vm.loading=true;
vm.error=null;
var refreshInterval=null;
function loadDashboard(){
vm.loading=true;
AuthService.validateSession().then(function(){
var userId=AuthService.getUserId();
return CreditCardDataService.fetchUserCards(userId);
}).then(function(cards){
vm.kpis=KPIAggregationService.aggregateKPIs(cards);
vm.loading=false;
}).catch(function(err){
vm.error='Failed to load dashboard data';
vm.loading=false;
});
}
vm.init=function(){
loadDashboard();
refreshInterval=$interval(function(){
loadDashboard();
},30000);
};
$scope.$on('$destroy',function(){
if(refreshInterval){
$interval.cancel(refreshInterval);
}
});
vm.init();
}]);
})();