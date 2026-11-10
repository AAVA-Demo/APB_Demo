(function(){
'use strict';
angular.module('transactionsModule').controller('TransactionFilterController',['$scope',function($scope){
var vm=this;
vm.filterCriteria={dateFrom:null,dateTo:null,cardIds:[],minAmount:null,maxAmount:null};
vm.applyFilter=function(){
$scope.$emit('filterApplied',angular.copy(vm.filterCriteria));
};
vm.resetFilter=function(){
vm.filterCriteria={dateFrom:null,dateTo:null,cardIds:[],minAmount:null,maxAmount:null};
vm.applyFilter();
};
}]);
})();