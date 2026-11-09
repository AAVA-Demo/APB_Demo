(function(){
'use strict';
angular.module('creditCardApp').service('CardManagementService',['$http','$q','API_ENDPOINTS',function($http,$q,API_ENDPOINTS){
var vm=this;
vm.getCards=function(cardIds){
var params=cardIds&&cardIds.length>0?{ids:cardIds.join(',')}:{};
return $http.get(API_ENDPOINTS.cards,{params:params}).then(function(response){
return response.data.map(function(card){
card.availableCredit=(card.creditLimit-card.outstandingBalance).toFixed(2);
return card;
});
}).catch(function(error){
toastr.error('Failed to load cards');
return $q.reject(error);
});
};
vm.getCardDetails=function(cardId){
return $http.get(API_ENDPOINTS.cards+'/'+cardId).then(function(response){
var card=response.data;
card.availableCredit=(card.creditLimit-card.outstandingBalance).toFixed(2);
return card;
}).catch(function(error){
toastr.error('Failed to load card details');
return $q.reject(error);
});
};
vm.addCard=function(cardData){
return $http.post(API_ENDPOINTS.cards,cardData).then(function(response){
toastr.success('Card added successfully');
return response.data;
}).catch(function(error){
toastr.error('Failed to add card');
return $q.reject(error);
});
};
}]);