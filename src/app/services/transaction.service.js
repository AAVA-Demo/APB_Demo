(function(){
'use strict';
angular.module('creditCardApp').service('TransactionService',['ApiFactory','$httpParamSerializer',function(ApiFactory,$httpParamSerializer){
this.getTransactions=function(cardId,page,pageSize){
const params={cardId:cardId,page:page||1,size:pageSize||50};
const queryString=$httpParamSerializer(params);
return ApiFactory.get('/transactions?'+queryString).then(function(response){
return{transactions:response.transactions||[],currentPage:response.currentPage||1,totalPages:response.totalPages||1,pageSize:response.pageSize||50,totalCount:response.totalCount||0};
});
};
}]);
})();