(function() {
'use strict';
angular.module('dashboard.module')
.directive('dashboardRefresh', ['$interval', function($interval) {
return {
restrict: 'A',
scope: {
refreshFn: '&',
intervalMs: '@'
},
link: function(scope, element, attrs) {
var interval = $interval(function() {
scope.refreshFn();
}, parseInt(scope.intervalMs) || 30000);
scope.$on('$destroy', function() {
$interval.cancel(interval);
});
}
};
}]);
})();