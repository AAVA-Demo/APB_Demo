(function(){
'use strict';
angular.module('creditCard.management').filter('cardFilter',function(){
return function(cards,filterText){
if(!filterText){
return cards;
}
const lower=filterText.toLowerCase();
return cards.filter(function(card){
return(card.cardType||'').toLowerCase().includes(lower)||(card.issuer||'').toLowerCase().includes(lower)||(card.maskedNumber||'').includes(filterText);
});
};
});
})();