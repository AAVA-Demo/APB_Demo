(function(){
'use strict';
angular.module('creditCard.dashboard').controller('DashboardController',['DashboardService','CardAggregationFactory','$scope',function(DashboardService,CardAggregationFactory,$scope){
var vm=this;
vm.kpis={};
vm.cards=[];
vm.loading=true;
vm.error=null;
vm.init=function(){
DashboardService.getCardData().then(function(cards){
vm.cards=cards;
vm.kpis=CardAggregationFactory.calculateKPIs(cards);
vm.loading=false;
}).catch(function(error){
vm.error='Failed to load dashboard data. Please try again.';
vm.loading=false;
});
};
vm.refreshDashboard=function(){
vm.loading=true;
vm.error=null;
vm.init();
};
vm.init();
}]);
})();