(function(){
'use strict';
angular.module('portfolioModule').factory('TransactionFactory',['$resource','API_ENDPOINTS',function($resource,API_ENDPOINTS){
return $resource(API_ENDPOINTS.transactions+'/card/:cardId',{cardId:'@cardId'},{getCardTransactions:{method:'GET',isArray:true}});
}]);
})();