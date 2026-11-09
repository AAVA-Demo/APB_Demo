(function(){
'use strict';
angular.module('creditCardApp').directive('trendAnalysisDirective',[function(){
return{
restrict:'E',
scope:{chartId:'@',data:'='},
template:'<div class="chart-container trend-chart"><canvas id="{{chartId}}"></canvas></div>'
};
}]);
})();