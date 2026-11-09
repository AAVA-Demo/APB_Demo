(function(){
'use strict';
angular.module('creditCardApp').directive('paginationDirective',[function(){
return{
restrict:'E',
scope:{currentPage:'=',totalPages:'=',onPageChange:'&'},
template:'<ul class="pagination" ng-if="totalPages>1"><li ng-class="{disabled:currentPage===1}"><a href="" ng-click="goToPage(currentPage-1)">&laquo;</a></li><li ng-repeat="page in pages track by $index" ng-class="{active:page===currentPage}"><a href="" ng-click="goToPage(page)">{{page}}</a></li><li ng-class="{disabled:currentPage===totalPages}"><a href="" ng-click="goToPage(currentPage+1)">&raquo;</a></li></ul>',
link:function(scope){
scope.$watchGroup(['currentPage','totalPages'],function(){
scope.pages=[];
const start=Math.max(1,scope.currentPage-2);
const end=Math.min(scope.totalPages,scope.currentPage+2);
for(let i=start;i<=end;i++){
scope.pages.push(i);
}
});
scope.goToPage=function(page){
if(page<1||page>scope.totalPages||page===scope.currentPage)return;
scope.onPageChange({page:page});
};
}
};
}]);
})();