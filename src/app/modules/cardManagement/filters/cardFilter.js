(function(){
'use strict';
angular.module('cardManagement').filter('cardFilter',[function(){
return function(cards,searchTerm){
if(!searchTerm){
return cards;
}
var filtered=[];
var term=searchTerm.toLowerCase();
angular.forEach(cards,function(card){
if((card.cardNumber&&card.cardNumber.toLowerCase().indexOf(term)!==-1)||(card.cardType&&card.cardType.toLowerCase().indexOf(term)!==-1)||(card.cardHolderName&&card.cardHolderName.toLowerCase().indexOf(term)!==-1)){
filtered.push(card);
}
});
return filtered;
};
}]);
})();