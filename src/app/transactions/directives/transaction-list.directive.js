(function(){
'use strict';
angular.module('transactionManagement').directive('transactionList',transactionList);
function transactionList(){
return{restrict:'E',scope:{transactions:'=',sortField:'=',sortReverse:'=',onSort:'&'},templateUrl:'src/app/transactions/views/transaction-list.html'};
}
})();