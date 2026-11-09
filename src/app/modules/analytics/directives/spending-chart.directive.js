(function(){
'use strict';
angular.module('creditCard.analytics').directive('spendingChart',function(){
return{
restrict:'E',
scope:{
labels:'=',
data:'=',
type:'@',
onClick:'&'
},
template:'<canvas id="{{chartId}}" class="chart chart-{{type}}" chart-data="data" chart-labels="labels" chart-click="onClick({points:points,evt:evt})"></canvas>',
link:function(scope,element,attrs){
scope.chartId='chart-'+Math.random().toString(36).substr(2,9);
}
};
});
})();