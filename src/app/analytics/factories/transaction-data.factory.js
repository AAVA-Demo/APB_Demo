(function(){
'use strict';
angular.module('app.analytics').factory('TransactionDataFactory',['TransactionFactory',function(TransactionFactory){
return{
fetchTransactions:function(startDate,endDate){
return TransactionFactory.fetchTransactions(startDate,endDate).then(function(response){
return response.data;
});
}
};
}]);
})();