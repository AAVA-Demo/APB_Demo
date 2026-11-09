(function(){
'use strict';
angular.module('creditCard.analytics').factory('TransactionDataFactory',['$resource','API_BASE_URL',function($resource,API_BASE_URL){
return{
getTransactions:function(params){
return $resource(API_BASE_URL+'/transactions',{},{query:{method:'GET',isArray:true}}).query(params);
}
};
}]);
})();