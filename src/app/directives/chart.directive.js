(function(){
'use strict';
angular.module('creditCardApp').directive('chartDirective',[function(){
return{
restrict:'E',
scope:{chartData:'=',chartType:'@',chartOptions:'='},
template:'<canvas></canvas>',
link:function(scope,element){
const canvas=element.find('canvas')[0];
const ctx=canvas.getContext('2d');
let chart=null;
scope.$watch('chartData',function(newData){
if(!newData)return;
if(chart){
chart.destroy();
}
const config={
type:scope.chartType||'line',
data:newData,
options:scope.chartOptions||{}
};
chart=new Chart(ctx,config);
});
scope.$on('$destroy',function(){
if(chart){
chart.destroy();
}
});
}
};
}]);
})();