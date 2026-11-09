(function(){
'use strict';
angular.module('creditCardApp').directive('spendingChart',[function(){
return{
restrict:'E',
scope:{
chartConfig:'=',
chartId:'='
},
template:'<canvas id="{{chartId}}" width="400" height="300"></canvas>',
link:function(scope,element){
scope.$watch('chartConfig',function(config){
if(config){
var ctx=document.getElementById(scope.chartId);
if(ctx){
new Chart(ctx.getContext('2d'),config);
}
}
});
}
};
}]);
})();