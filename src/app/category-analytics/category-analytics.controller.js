(function(){
'use strict';
angular.module('creditCardApp')
.controller('CategoryAnalyticsController',['CategoryAnalyticsService','$scope','$filter','NgTableParams',function(CategoryAnalyticsService,$scope,$filter,NgTableParams){
var vm=this;
vm.categoryData={};
vm.loading=true;
vm.error=null;
vm.selectedCategory=null;
vm.searchText='';
function loadCategoryAnalytics(){
vm.loading=true;
CategoryAnalyticsService.getCategoryAnalytics().then(function(data){
vm.categoryData=data;
vm.tableParams=new NgTableParams({count:10},{dataset:data.transactions});
vm.loading=false;
}).catch(function(error){
vm.error='Failed to load category analytics';
vm.loading=false;
});
}
vm.filterByCategory=function(category){
vm.selectedCategory=category;
var filtered=vm.categoryData.transactions;
if(category){
filtered=filtered.filter(function(t){return t.category===category;});
}
if(vm.searchText){
filtered=filtered.filter(function(t){
return t.merchant.toLowerCase().indexOf(vm.searchText.toLowerCase())>=0||
t.description.toLowerCase().indexOf(vm.searchText.toLowerCase())>=0;
});
}
vm.tableParams.settings({dataset:filtered});
};
vm.searchTransactions=function(){
vm.filterByCategory(vm.selectedCategory);
};
loadCategoryAnalytics();
}]);
})();