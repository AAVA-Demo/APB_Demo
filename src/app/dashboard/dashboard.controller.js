(function(){
'use strict';
angular.module('app.dashboard').controller('DashboardController',['$scope','$interval','CreditCardService',function($scope,$interval,CreditCardService){
const vm=this;
vm.kpis={};
vm.cards=[];
vm.loading=true;
vm.error=null;
vm.init=function(){
vm.loadDashboard();
const refreshInterval=$interval(function(){
vm.refreshData();
},45000);
$scope.$on('$destroy',function(){
$interval.cancel(refreshInterval);
});
};
vm.loadDashboard=function(){
vm.loading=true;
CreditCardService.getCardPortfolio().then(function(data){
vm.kpis=data.kpis;
vm.cards=data.cards;
vm.loading=false;
}).catch(function(error){
vm.error='Failed to load dashboard data';
vm.loading=false;
});
};
vm.refreshData=function(){
CreditCardService.refreshData().then(function(data){
vm.kpis=data.kpis;
vm.cards=data.cards;
}).catch(function(error){
console.error('Auto-refresh failed',error);
});
};
vm.init();
}]);
})();