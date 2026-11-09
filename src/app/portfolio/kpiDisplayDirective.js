(function(){
'use strict';
angular.module('portfolioModule').directive('kpiDisplay',[function(){
return{
restrict:'E',
scope:{label:'@',value:'=',icon:'@',format:'@'},
template:'<div class="kpi-card">'+
'<i class="glyphicon glyphicon-{{icon}}"></i>'+
'<h3>{{label}}</h3>'+
'<div class="value">{{formattedValue}}</div>'+
'</div>',
link:function(scope){
scope.$watch('value',function(newVal){
if(scope.format==='currency'){
scope.formattedValue='$'+(newVal||0).toFixed(2).replace(/\d(?=(\d{3})+\.)/g,'$&,');
}else if(scope.format==='percent'){
scope.formattedValue=(newVal||0).toFixed(1)+'%';
}else{
scope.formattedValue=(newVal||0).toString();
}
});
}
};
}]);
})();