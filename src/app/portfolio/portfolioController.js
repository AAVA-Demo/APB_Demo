angular.module('portfolioModule').controller('PortfolioController',['$scope','portfolioManagementService',function($scope,portfolioManagementService){
var vm=this;
vm.portfolio={};
vm.loading=true;
vm.error=null;
portfolioManagementService.getPortfolio().then(function(data){
vm.portfolio=data;
vm.loading=false;
},function(error){
vm.error='Failed to load portfolio data';
vm.loading=false;
});
}]);