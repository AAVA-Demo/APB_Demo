(function(){
'use strict';
angular.module('creditCard.transactions').directive('transactionFilter',['$timeout',function($timeout){
return{
restrict:'E',scope:{onFilterChange:'&'},template:'<div class="filter-panel"><h4>Filter Transactions</h4><div class="row"><div class="col-md-3"><label>Search</label><input type="text" class="form-control" ng-model="filters.searchTerm" ng-change="debouncedApply()" placeholder="Merchant or description"></div><div class="col-md-3"><label>Category</label><select class="form-control" ng-model="filters.category" ng-change="apply()"><option value="">All Categories</option><option value="Food & Dining">Food & Dining</option><option value="Fuel">Fuel</option><option value="Shopping">Shopping</option><option value="Travel">Travel</option><option value="Entertainment">Entertainment</option><option value="Utilities">Utilities</option><option value="Healthcare">Healthcare</option><option value="Education">Education</option><option value="Miscellaneous">Miscellaneous</option></select></div><div class="col-md-3"><label>Start Date</label><input type="date" class="form-control" ng-model="filters.startDate" ng-change="apply()"></div><div class="col-md-3"><label>End Date</label><input type="date" class="form-control" ng-model="filters.endDate" ng-change="apply()"></div></div><div class="row" style="margin-top:10px;"><div class="col-md-3"><label>Min Amount</label><input type="number" class="form-control" ng-model="filters.minAmount" ng-change="apply()" placeholder="0.00"></div><div class="col-md-3"><label>Max Amount</label><input type="number" class="form-control" ng-model="filters.maxAmount" ng-change="apply()" placeholder="0.00"></div><div class="col-md-3" style="padding-top:25px;"><button class="btn btn-default" ng-click="reset()">Reset Filters</button></div></div></div>',link:function(scope){
scope.filters={searchTerm:'',category:'',startDate:null,endDate:null,minAmount:null,maxAmount:null};
var debounceTimer=null;
scope.apply=function(){
var filterObj={cardIds:[],categories:scope.filters.category?[scope.filters.category]:[],dateRange:{startDate:scope.filters.startDate,endDate:scope.filters.endDate},amountRange:{min:scope.filters.minAmount,max:scope.filters.maxAmount},searchTerm:scope.filters.searchTerm};
scope.onFilterChange({filters:filterObj});
};
scope.debouncedApply=function(){
if(debounceTimer){
$timeout.cancel(debounceTimer);
}
debounceTimer=$timeout(function(){
scope.apply();
},300);
};
scope.reset=function(){
scope.filters={searchTerm:'',category:'',startDate:null,endDate:null,minAmount:null,maxAmount:null};
scope.apply();
};
}
};
}]);
})();