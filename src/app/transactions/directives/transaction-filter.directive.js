(function(){
'use strict';
angular.module('transactionsModule').directive('transactionFilter',[function(){
return{
restrict:'E',scope:{cardList:'='},controller:'TransactionFilterController',controllerAs:'filterVm',template:'<div class="transaction-filter"><div class="filter-row"><label>Date From:<input type="date" ng-model="filterVm.filterCriteria.dateFrom"></label><label>Date To:<input type="date" ng-model="filterVm.filterCriteria.dateTo"></label></div><div class="filter-row"><label>Card:<select ng-model="filterVm.filterCriteria.cardIds" multiple><option ng-repeat="card in cardList" value="{{card.cardId}}">{{card.cardName}}</option></select></label><label>Min Amount:<input type="number" ng-model="filterVm.filterCriteria.minAmount"></label><label>Max Amount:<input type="number" ng-model="filterVm.filterCriteria.maxAmount"></label></div><div class="filter-actions"><button ng-click="filterVm.applyFilter()">Apply</button><button ng-click="filterVm.resetFilter()">Reset</button></div></div>'
};
}]);
})();