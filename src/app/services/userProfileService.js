angular.module('creditCardApp').service('userProfileService',['$http','$q',function($http,$q){
var service=this;
service.getUserCardAssociations=function(){
var deferred=$q.defer();
setTimeout(function(){
deferred.resolve({cardIds:['card1','card2','card3']});
},200);
return deferred.promise;
};
}]);