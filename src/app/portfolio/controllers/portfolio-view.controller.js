(function(){
'use strict';
angular.module('creditCard.portfolio').controller('PortfolioViewController',['$scope','PortfolioService',function($scope,PortfolioService){
const vm=this;
vm.portfolioData=null;
vm.loading=false;
vm.error=null;
vm.userId='user123';
vm.selectedCards=[];
vm.comparisonMode=false;
vm.loadPortfolio=function(){
vm.loading=true;
vm.error=null;
PortfolioService.getPortfolioSummary(vm.userId).then(function(data){
vm.portfolioData=data;
vm.loading=false;
},function(error){
vm.error='Failed to load portfolio data. Please try again.';
vm.loading=false;
});
};
vm.toggleCardSelection=function(card){
const index=vm.selectedCards.findIndex(c=>c.cardId===card.cardId);
if(index>-1){
vm.selectedCards.splice(index,1);
}else{
vm.selectedCards.push(card);
}
vm.comparisonMode=vm.selectedCards.length>1;
};
vm.isCardSelected=function(card){
return vm.selectedCards.some(c=>c.cardId===card.cardId);
};
vm.getCardSpending=function(cardId){
if(!vm.portfolioData||!vm.portfolioData.cardSpending)return null;
return vm.portfolioData.cardSpending.get(cardId);
};
vm.loadPortfolio();
}]);
})();