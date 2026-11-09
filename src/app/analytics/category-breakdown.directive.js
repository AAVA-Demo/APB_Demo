(function(){
'use strict';
angular.module('creditCardApp').directive('categoryBreakdown',[function(){
return{restrict:'E',scope:{data:'='},template:'<div class="category-table"><h4>Category Breakdown</h4><table class="table table-striped table-hover"><thead><tr><th>Category</th><th class="text-right">Amount</th><th class="text-right">Transactions</th><th class="text-right">Percentage</th></tr></thead><tbody><tr ng-repeat="item in data"><td><i class="fa fa-circle" ng-style="{color:getColor($index)}"></i> {{item.category}}</td><td class="text-right">${{item.totalAmount}}</td><td class="text-right">{{item.transactionCount}}</td><td class="text-right">{{item.percentage}}%</td></tr></tbody></table></div>',link:function(scope){
var colors=['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40','#FF6384','#C9CBCF','#4BC0C0'];
scope.getColor=function(index){
return colors[index%colors.length];
};
}};
}]);