(function(){
'use strict';
angular.module('app.transactions').controller('TransactionDetailController',['$scope','TransactionService','$routeParams',function($scope,TransactionService,$routeParams){
var vm=this;
vm.transaction=null;
vm.loading=true;
vm.error=null;
vm.init=function(){
var transactionId=$routeParams.id;
TransactionService.getTransactionById(transactionId).then(function(data){
vm.transaction=data;
vm.loading=false;
},function(error){
vm.error='Failed to load transaction details';
vm.loading=false;
});
};
vm.init();
}]);
})();