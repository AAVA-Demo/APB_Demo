(function(){
'use strict';
angular.module('creditCardApp').factory('PaginationFactory',[function(){
return{
create:function(totalItems,pageSize){
var totalPages=Math.ceil(totalItems/pageSize);
return{
totalItems:totalItems,
pageSize:pageSize,
totalPages:totalPages,
currentPage:1,
getPages:function(){
var pages=[];
for(var i=1;i<=totalPages;i++){
pages.push(i);
}
return pages;
},
setPage:function(page){
if(page>=1&&page<=totalPages){
this.currentPage=page;
}
}
};
}
};
}]);
})();