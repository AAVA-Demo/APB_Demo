(function(){
'use strict';
angular.module('app.creditCard.dashboard').controller('DashboardController',DashboardController);
DashboardController.$inject=['DashboardService','$scope','$interval'];
function DashboardController(DashboardService,$scope,$interval){
var vm=this;
vm.kpiData=null;
vm.loading=true;
vm.error=null;
vm.refreshKpis=refreshKpis;
var userId='user123';
var refreshInterval;
init();
function init(){
loadKpiData();
refreshInterval=$interval(function(){
loadKpiData();
},60000);
$scope.$on('$destroy',function(){
if(refreshInterval){$interval.cancel(refreshInterval);}
});}
function loadKpiData(){
vm.loading=true;
vm.error=null;
DashboardService.getKpiData(userId).then(function(data){
vm.kpiData=data;
vm.loading=false;
}).catch(function(error){
vm.error='Failed to load dashboard data';
vm.loading=false;
var cached=localStorage.getItem('lastKpiData');
if(cached){vm.kpiData=JSON.parse(cached);}
});}
function refreshKpis(){
loadKpiData();}
$scope.$watch('vm.kpiData',function(newVal){
if(newVal){localStorage.setItem('lastKpiData',JSON.stringify(newVal));}
});}
})();