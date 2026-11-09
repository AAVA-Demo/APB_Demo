(function(){
'use strict';
angular.module('cardManagementModule').service('CardAnalyticsService',['$filter',function($filter){
var self=this;
self.analyzeCard=function(card){
var availableCredit=card.creditLimit-card.outstandingBalance;
var utilizationRate=(card.outstandingBalance/card.creditLimit)*100;
return angular.extend({},card,{availableCredit:availableCredit,utilizationRate:utilizationRate});
};
}]);
})();