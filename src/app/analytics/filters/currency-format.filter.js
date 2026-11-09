(function(){
'use strict';
angular.module('creditCard.analytics').filter('currencyFormat',['$filter',function($filter){
return function(input,symbol){
if(!input)return'$0.00';
const currencyFilter=$filter('currency');
return currencyFilter(input,symbol||'$');
};
}]);
})();