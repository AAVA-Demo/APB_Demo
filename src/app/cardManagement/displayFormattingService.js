(function(){
'use strict';
angular.module('creditCardApp').service('displayFormattingService',[function(){
const self=this;
self.formatCardPortfolio=function(cards,spendingArray){
const spendingMap=new Map();
spendingArray.forEach(s=>spendingMap.set(s.cardId,s));
return{
cards:cards,
cardSpending:spendingMap,
totalCards:cards.length
};
};
}]);
})();