(function(){
'use strict';
angular.module('creditCardApp').service('PaginationService',[function(){
var self=this;
self.currentPage=1;
self.pageSize=50;
self.totalPages=0;
self.nextPage=function(){
if(self.currentPage<self.totalPages){
self.currentPage++;
return self.currentPage;
}
return self.currentPage;
};
self.prevPage=function(){
if(self.currentPage>1){
self.currentPage--;
return self.currentPage;
}
return self.currentPage;
};
self.setTotalPages=function(totalCount){
self.totalPages=Math.ceil(totalCount/self.pageSize);
};
}]);
})();