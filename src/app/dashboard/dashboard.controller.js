(function(){
'use strict';
angular.module('app.dashboard').controller('DashboardController',['$scope','CreditCardService','KPICalculatorService','AuthService',function($scope,CreditCardService,KPICalculatorService,AuthService){
var vm=this;
vm.kpis=null;
vm.cards=[];
vm.loading=true;
vm.init=function(){
if(!AuthService.validateSession()){
toastr.error('Session validation failed');
return;
}
vm.loadDashboard();
};
vm.loadDashboard=function(){
vm.loading=true;
CreditCardService.getAllCards().then(function(cards){
vm.cards=cards;
vm.kpis=KPICalculatorService.calculateKPIs(cards);
vm.loading=false;
$scope.$apply();
}).catch(function(error){
toastr.error('Failed to load dashboard data');
vm.loading=false;
$scope.$apply();
});
};
vm.init();
}]);
})();