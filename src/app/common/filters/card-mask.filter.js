(function(){
'use strict';
angular.module('creditCardApp').filter('cardMask',cardMask);
function cardMask(){
return function(cardNumber){
if(!cardNumber||cardNumber.length<4){
return'**** **** **** ****';
}
var last4=cardNumber.slice(-4);
var masked='*'.repeat(12)+last4;
return masked.match(/.{1,4}/g).join(' ');
};
}
})();