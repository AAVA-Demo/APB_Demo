(function(){
'use strict';
angular.module('portfolioModule').controller('PortfolioController',['PortfolioService','CardAnalyticsService','$scope','AuthService',function(PortfolioService,CardAnalyticsService,$scope,AuthService){
const vm=this;
vm.portfolioData=[];
vm.selectedCard=null;
vm.loading=true;
vm.error=null;
function loadPortfolio(){
const userId=AuthService.getUserId();
PortfolioService.getPortfolioData(userId).then(function(data){
vm.portfolioData=data;
vm.loading=false;
},function(err){
vm.error='Failed to load portfolio data.';
vm.loading=false;
});
}
vm.selectCard=function(card){
vm.selectedCard=card;
};
loadPortfolio();
}]);
})();