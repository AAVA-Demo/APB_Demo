angular.module('portfolioModule').directive('portfolioSummary',[function(){
return{
restrict:'E',
scope:{summary:'='},
templateUrl:'src/app/portfolio/portfolio-summary.html'
};
}]);