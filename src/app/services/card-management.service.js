(function(){
'use strict';
angular.module('cardManagementModule').service('CardManagementService',['CardDataFactory','$q',function(CardDataFactory,$q){
var service=this;
service.getAllCards=function(){
return CardDataFactory.getAllCards();
};
}]);
})();