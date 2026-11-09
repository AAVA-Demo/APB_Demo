(function(){'use strict';angular.module('transactionModule').directive('transactionTable',[function(){return{restrict:'E',scope:{transactions:'=',pageSize:'=',currentPage:'='},template:'<div>'+
'<table class="table table-striped">'+
'<thead><tr><th>Date</th><th>Merchant</th><th>Category</th><th>Amount</th><th>Card</th></tr></thead>'+
'<tbody>'+
'<tr ng-repeat="t in paginatedTransactions track by t.transactionId">'+
'<td>{{t.transactionDate | date:"short"}}</td>'+
'<td>{{t.merchant}}</td>'+
'<td>{{t.category}}</td>'+
'<td>${{t.amount | number:2}}</td>'+
'<td>****{{t.cardNumber.slice(-4)}}</td>'+
'</tr>'+
'</tbody>'+
'</table>'+
'<div class="text-center"><ul class="pagination"><li ng-repeat="page in pages" ng-class="{active:page===currentPage}"><a ng-click="goToPage(page)">{{page}}</a></li></ul></div>'+
'</div>',link:function(scope){scope.$watchGroup(['transactions','pageSize','currentPage'],function(){updatePagination();});function updatePagination(){var start=(scope.currentPage-1)*scope.pageSize;var end=start+scope.pageSize;scope.paginatedTransactions=(scope.transactions||[]).slice(start,end);var totalPages=Math.ceil((scope.transactions||[]).length/scope.pageSize);scope.pages=[];for(var i=1;i<=totalPages;i++){scope.pages.push(i);}}scope.goToPage=function(page){scope.currentPage=page;};}};}]);})();