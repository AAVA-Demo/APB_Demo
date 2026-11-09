(function(){
'use strict';
angular.module('analytics').directive('spendingChart',[function(){
return{
restrict:'E',
scope:{labels:'=',data:'=',chartType:'@',options:'='},
templateUrl:'src/app/modules/analytics/views/spendingChart.html'
};
}]);
})();