(function(){
'use strict';
angular.module('creditCardApp').service('CardService',['$http','$q','API_CONFIG',function($http,$q,API_CONFIG){
this.getCardDetails=function(cardId){
var url=API_CONFIG.BASE_URL+API_CONFIG.ENDPOINTS.CARDS+'/'+cardId;
return $http.get(url,{timeout:API_CONFIG.TIMEOUT}).then(function(response){
return response.data;
},function(error){
return $q.reject(error);
});
};
this.getAllCards=function(userId){
var url=API_CONFIG.BASE_URL+API_CONFIG.ENDPOINTS.CARDS+'?userId='+userId;
return $http.get(url,{timeout:API_CONFIG.TIMEOUT}).then(function(response){
return response.data;
},function(error){
return $q.reject(error);
});
};
}]);
})();