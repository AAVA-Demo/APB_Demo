(function(){
'use strict';
angular.module('creditCard.dashboard').controller('DashboardController',['$scope','$interval','DashboardService','PortfolioFactory',function($scope,$interval,DashboardService,PortfolioFactory){
var vm=this;
vm.portfolio=null;
vm.kpis={};
vm.loading=false;
vm.error=null;
vm.lastUpdated=null;
var refreshInterval;
vm.loadPortfolio=function(){
vm.loading=true;
vm.error=null;
DashboardService.getPortfolioData('user123').then(function(data){
vm.portfolio=data;
vm.kpis=PortfolioFactory.calculateKPIs(data);
vm.lastUpdated=new Date();
vm.loading=false;
},function(err){
vm.error='Failed to load portfolio data. Please try again.';
vm.loading=false;
});
};
vm.refresh=function(){
vm.loadPortfolio();
};
vm.loadPortfolio();
refreshInterval=$interval(function(){
vm.loadPortfolio();
},300000);
$scope.$on('$destroy',function(){
if(refreshInterval){
$interval.cancel(refreshInterval);
}
});
}]);
})();