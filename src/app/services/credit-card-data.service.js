(function(){
'use strict';
angular.module('creditCardApp').factory('CreditCardDataService',CreditCardDataService);
CreditCardDataService.$inject=['$http','$q'];
function CreditCardDataService($http,$q){
var service={getAllCards:getAllCards,getCardDetails:getCardDetails};
return service;
function getAllCards(userId){
return $http.get('/api/cards/summary',{params:{userId:userId}}).then(function(response){
return response.data;
}).catch(function(error){
return $q.reject(error);
});}
function getCardDetails(cardId){
return $http.get('/api/cards/'+cardId+'/details').then(function(response){
return response.data;
}).catch(function(error){
return $q.reject(error);
});}
}
})();