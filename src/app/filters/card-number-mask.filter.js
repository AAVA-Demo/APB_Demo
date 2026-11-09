(function(){
'use strict';
angular.module('creditCardApp').filter('cardNumberMaskFilter',[function(){
return function(input){
if(!input)return'';
var lastFour=input.slice(-4);
return '**** **** **** '+lastFour;
};
}]);
})();