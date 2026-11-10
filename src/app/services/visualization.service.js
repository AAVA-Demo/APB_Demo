(function(){
'use strict';
angular.module('creditCardApp').service('VisualizationService',[function(){
var self=this;
self.renderChart=function(canvasId,type,data,options){
var ctx=document.getElementById(canvasId);
if(!ctx)return null;
var chartOptions=angular.extend({responsive:true,maintainAspectRatio:false,animation:{duration:800}},options||{});
return new Chart(ctx,{type:type,data:data,options:chartOptions});
};
self.updateChart=function(chart,newData){
if(chart&&newData){
chart.data=newData;
chart.update();
}
};
self.destroyChart=function(chart){
if(chart)chart.destroy();
};
}]);
})();