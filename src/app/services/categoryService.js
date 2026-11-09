angular.module('creditCardApp').service('categoryService',['$http','$q',function($http,$q){
var service=this;
service.getCategoryMappings=function(){
var deferred=$q.defer();
setTimeout(function(){
deferred.resolve({categories:['Food & Dining','Fuel','Shopping','Travel','Entertainment','Utilities','Healthcare','Education','Miscellaneous']});
},100);
return deferred.promise;
};
}]);