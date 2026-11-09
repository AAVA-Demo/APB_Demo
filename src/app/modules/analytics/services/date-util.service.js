(function(){
'use strict';
angular.module('analyticsModule').service('DateUtilService',[function(){
const self=this;
self.calculateMonthRange=function(dateRange){
return{startDate:moment(dateRange.start).format('YYYY-MM-DD'),endDate:moment(dateRange.end).format('YYYY-MM-DD')};
};
self.getMonthsAgo=function(months){
return moment().subtract(months,'months').toDate();
};
}]);
})();