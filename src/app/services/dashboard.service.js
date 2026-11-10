(function(){
'use strict';
angular.module('creditCardApp').service('DashboardService',['ApiService','$q',function(ApiService,$q){
var self=this;
self.getCardData=function(){
return ApiService.get('/api/cards').then(function(cards){
return cards||[];
}).catch(function(error){
console.error('Failed to fetch card data:',error);
return $q.reject(error);});
};
}]);
})();