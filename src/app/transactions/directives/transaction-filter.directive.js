(function(){
'use strict';
angular.module('app.transactions').directive('transactionFilter',[function(){
return{restrict:'E',scope:{onFilter:'&',onReset:'&'},templateUrl:'src/app/transactions/directives/transaction-filter.template.html',link:function(scope){
scope.filters={cardId:'',startDate:'',endDate:'',searchTerm:'',category:''};
scope.applyFilter=function(){
scope.onFilter({filters:scope.filters});
};
scope.resetFilter=function(){
scope.filters={cardId:'',startDate:'',endDate:'',searchTerm:'',category:''};
scope.onReset();
};
}};
}]);
})();