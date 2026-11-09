(function(){'use strict';angular.module('transactionModule').directive('transactionPagination',function(){return{restrict:'E',scope:{pagination:'=',onPageChange:'&'},template:'<div class="pagination-controls">'+
'<button class="btn btn-default" ng-click="goToPage(1)" ng-disabled="pagination.currentPage===1"><i class="fa fa-angle-double-left"></i></button>'+
'<button class="btn btn-default" ng-click="goToPage(pagination.currentPage-1)" ng-disabled="pagination.currentPage===1"><i class="fa fa-angle-left"></i> Previous</button>'+
'<span style="margin:0 15px;">Page {{pagination.currentPage}} of {{pagination.totalPages}}</span>'+
'<button class="btn btn-default" ng-click="goToPage(pagination.currentPage+1)" ng-disabled="pagination.currentPage===pagination.totalPages">Next <i class="fa fa-angle-right"></i></button>'+
'<button class="btn btn-default" ng-click="goToPage(pagination.totalPages)" ng-disabled="pagination.currentPage===pagination.totalPages"><i class="fa fa-angle-double-right"></i></button>'+
'</div>',link:function(scope){scope.goToPage=function(page){scope.onPageChange({page:page});};}};});})();