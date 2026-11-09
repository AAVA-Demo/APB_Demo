(function(){
'use strict';
angular.module('dashboardModule').directive('kpiCard',['$window',function($window){
return{
restrict:'E',
scope:{title:'@',value:'=',icon:'@'},
template:'<div class="kpi-card col-lg-3 col-md-6 col-sm-12"><div class="kpi-inner"><h4>{{title}}</h4><p class="kpi-value">{{value|currency}}</p></div></div>',
link:function(scope,element,attrs){
angular.element($window).on('resize',function(){
scope.$apply();
});
}
};
}]);
})();