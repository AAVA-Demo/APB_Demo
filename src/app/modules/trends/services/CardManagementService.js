(function(){
'use strict';
angular.module('spendTrendsModule').service('CardManagementService',['ApiService',function(ApiService){
this.getCardDetails=function(){
return ApiService.getCardDetails();
};
}]);
})();