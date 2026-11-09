(function(){
'use strict';
angular.module('creditCard.dashboard').factory('CreditCardDataFactory',['$resource','API_BASE_URL',function($resource,API_BASE_URL){
return{
getCardBalances:function(){
return $resource(API_BASE_URL+'/cards/balances',{},{query:{method:'GET',isArray:true}}).query();
},
getTransactions:function(params){
return $resource(API_BASE_URL+'/transactions',{},{query:{method:'GET',isArray:true}}).query(params);
}
};
}]);
})();