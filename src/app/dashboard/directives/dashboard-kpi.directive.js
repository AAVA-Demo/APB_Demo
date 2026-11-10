(function(){
'use strict';
angular.module('app.dashboard').directive('dashboardKpi',[function(){
return{
restrict:'E',
scope:{label:'@',value:'@',icon:'@',color:'@'},
template:'<div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">'+
'<div class="panel panel-{{color}}">'+
'<div class="panel-heading">'+
'<div class="row">'+
'<div class="col-xs-3"><i class="fa {{icon}} fa-3x"></i></div>'+
'<div class="col-xs-9 text-right">'+
'<div class="kpi-value">{{formattedValue}}</div>'+
'<div>{{label}}</div>'+
'</div>'+
'</div>'+
'</div>'+
'</div>'+
'</div>',
link:function(scope,element,attrs){
scope.$watch('value',function(newVal){
if(newVal){
var num=parseFloat(newVal);
scope.formattedValue=isNaN(num)?newVal:'$'+num.toLocaleString();
}
});
}
};
}]);
})();