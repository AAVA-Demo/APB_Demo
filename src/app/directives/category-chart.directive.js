(function(){
'use strict';
angular.module('creditCardApp').directive('categoryChartDirective',[function(){
return{
restrict:'E',
scope:{chartId:'@',data:'='},
template:'<div class="chart-container"><canvas id="{{chartId}}"></canvas></div>'
};
}]);
})();