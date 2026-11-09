(function(){
'use strict';
angular.module('dashboardModule').directive('kpiCard',[function(){
return{
restrict:'E',
scope:{label:'@',value:'=',format:'@'},
template:'<div class="kpi-card">'+
'<h3>{{label}}</h3>'+
'<div class="value">{{formattedValue}}</div>'+
'</div>',
link:function(scope){
scope.$watch('value',function(newVal){
if(scope.format==='currency'){
scope.formattedValue='$'+(newVal||0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g,'$&,');
}else if(scope.format==='number'){
scope.formattedValue=(newVal||0).toString();
}else{
scope.formattedValue=newVal||'N/A';
}
});
}
};
}]);
})();