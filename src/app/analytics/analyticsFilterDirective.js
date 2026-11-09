angular.module('analyticsModule').directive('analyticsFilter',[function(){
return{
restrict:'E',
scope:{filters:'=',onApply:'&'},
templateUrl:'src/app/analytics/analytics-filter.html'
};
}]);