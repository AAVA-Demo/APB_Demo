(function() {
'use strict';
angular.module('spendingAnalytics.module')
.controller('AnalyticsViewController', ['$scope', 'AnalyticsProcessingService', function($scope, AnalyticsProcessingService) {
var vm = this;
vm.analyticsSummary = null;
vm.loading = true;
vm.error = null;
vm.dateRange = {
start: new Date(new Date().setMonth(new Date().getMonth() - 12)),
end: new Date()
};
function loadAnalytics() {
vm.loading = true;
AnalyticsProcessingService.getAnalytics('user123', vm.dateRange).then(function(summary) {
vm.analyticsSummary = summary;
vm.loading = false;
}).catch(function(error) {
vm.error = 'Failed to load analytics: ' + (error.message || error);
vm.loading = false;
});
}
loadAnalytics();
}]);
})();