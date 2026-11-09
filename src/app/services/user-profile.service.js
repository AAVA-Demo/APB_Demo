(function(){
'use strict';
angular.module('creditCardApp').service('UserProfileService',['ApiFactory','$q',function(ApiFactory,$q){
this.validateOwnership=function(cardId){
return ApiFactory.get('/user/cards/'+cardId+'/validate').then(function(response){
return response.isValid===true;
}).catch(function(){
return false;
});
};
}]);
})();