(function(){
'use strict';
angular.module('creditCardDashboardModule').controller('DashboardController',['$scope','KpiAggregationService',function($scope,KpiAggregationService){
var vm=this;
vm.kpis={totalCreditLimit:0,totalAvailableCredit:0,totalOutstandingAmount:0,totalMonthlySpend:0,cardCount:0};
vm.loading=true;
vm.error=null;
vm.init=function(){
KpiAggregationService.getConsolidatedKpis().then(function(data){
vm.kpis=data;
vm.loading=false;
},function(error){
vm.error='Failed to load dashboard data. Please try again.';
vm.loading=false;
});
};
vm.init();
}]);
})();