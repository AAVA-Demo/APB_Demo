(function(){
'use strict';
angular.module('creditCardApp').factory('CreditCardRepositoryService',['$http','API_ENDPOINTS','$q',function($http,API_ENDPOINTS,$q){
return{getCardDetails:function(cardId){
var deferred=$q.defer();
$http.get(API_ENDPOINTS.baseUrl+API_ENDPOINTS.cards+'/'+cardId).then(function(response){
var card=response.data;
if(card.cardNumber&&!card.cardNumber.startsWith('****')){card.cardNumber='****'+card.cardNumber.slice(-4);}
card.availableBalance=(card.creditLimit||0)-(card.currentBalance||0);
deferred.resolve(card);},function(error){
console.error('Error fetching card details:',error);
deferred.reject(error);});
return deferred.promise;}};
}]);
})();