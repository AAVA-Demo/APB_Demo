(function(){
'use strict';
angular.module('dashboardModule').controller('DashboardController',['$scope','$interval','DataAggregationService','CreditCardDataService','AuthService',function($scope,$interval,DataAggregationService,CreditCardDataService,AuthService){
var vm=this;
vm.kpis={};
vm.cards=[];
vm.loading=true;
vm.error=null;
var refreshInterval;
function init(){
AuthService.validateSession().then(function(){
loadDashboard();
refreshInterval=$interval(function(){
loadDashboard();
},30000);
},function(error){
vm.error='Authentication failed. Please login.';
vm.loading=false;
});
}
function loadDashboard(){
vm.loading=true;
vm.error=null;
DataAggregationService.getKPIs().then(function(kpis){
vm.kpis=kpis;
return CreditCardDataService.getAllCards();
}).then(function(cards){
vm.cards=cards;
vm.loading=false;
},function(error){
vm.error='Failed to load dashboard data. Retrying...';
vm.loading=false;
retryLoad();
});
}
function retryLoad(){
setTimeout(function(){
loadDashboard();
},3000);
}
$scope.$on('$destroy',function(){
if(refreshInterval){
$interval.cancel(refreshInterval);
}
});
init();
}]);
})();