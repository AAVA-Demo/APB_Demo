(function(){
'use strict';
angular.module('creditCard.analytics').directive('trendAnalysisChart',[function(){
return{restrict:'E',scope:{data:'='},template:'<div class="chart-container"><h3>Monthly Spend Trends</h3><canvas id="trendChart" width="400" height="200"></canvas></div>'};
}]);
})();