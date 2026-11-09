(function(){
'use strict';
angular.module('creditCard.dashboard').directive('kpiCard',function(){
return{
restrict:'E',
scope:{
title:'@',
value:'=',
icon:'@'
},
templateUrl:'src/app/modules/dashboard/views/kpi-card.template.html'
};
});
})();