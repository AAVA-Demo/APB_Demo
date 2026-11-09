(function(){
'use strict';
angular.module('cardManagementModule').service('cardNavigationService',['$rootScope','$location',function($rootScope,$location){
var selectedCardId=null;
this.selectCard=function(cardId){
selectedCardId=cardId;
$rootScope.$broadcast('card:selected',cardId);
$location.path('/cards/'+cardId);
};
this.getSelectedCardId=function(){
return selectedCardId;
};
}]);
})();