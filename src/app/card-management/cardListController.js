(function(){
'use strict';
angular.module('cardManagementModule').controller('cardListController',['cardDataService','cardNavigationService',function(cardDataService,cardNavigationService){
var vm=this;
vm.cards=[];
vm.loading=true;
vm.error=null;
vm.selectCard=function(cardId){
cardNavigationService.selectCard(cardId);
};
function init(){
cardDataService.getAllCards().then(function(cards){
vm.cards=cards;
vm.loading=false;
},function(error){
vm.error='Failed to load cards';
vm.loading=false;
});
}
init();
}]);
})();