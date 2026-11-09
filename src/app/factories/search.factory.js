(function(){
'use strict';
angular.module('creditCardApp').factory('SearchFactory',[function(){
let filterCriteria={cardId:null,startDate:null,endDate:null,searchTerm:'',category:null};
return{getFilterCriteria:function(){
return angular.copy(filterCriteria);
},updateFilters:function(newCriteria){
angular.extend(filterCriteria,newCriteria);
},resetFilters:function(){
filterCriteria={cardId:null,startDate:null,endDate:null,searchTerm:'',category:null};
}};
}]);
})();