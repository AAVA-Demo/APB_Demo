(function(){
'use strict';
angular.module('creditCardApp').service('CardService',['ApiService','$q',function(ApiService,$q){
var self=this;
self.getUserCards=function(){
return ApiService.get('/api/cards').then(function(cards){
return cards||[];
}).catch(function(error){
console.error('Failed to fetch user cards:',error);
return $q.reject(error);});
};
}]);
})();