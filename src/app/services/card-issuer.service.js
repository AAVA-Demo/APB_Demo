(function(){
'use strict';
angular.module('creditCardApp').service('CardIssuerService',['$http','$interval',function($http,$interval){
var vm=this;
vm.syncCardData=function(cardId){
return $http.get('/api/card-issuer/sync/'+cardId).then(function(response){
return response.data;
}).catch(function(error){
console.error('Card issuer sync failed',error);
return null;
});
};
}]);