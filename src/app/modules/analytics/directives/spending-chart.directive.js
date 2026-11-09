(function() {
  'use strict';
  angular.module('creditCard.analytics')
    .directive('spendingChart', ['ChartConfigFactory', 'CategoryService', spendingChart]);
  function spendingChart(ChartConfigFactory, CategoryService) {
    return {
      restrict: 'E',
      scope: {
        categorySummaries: '=',
        onCategoryClick: '&'
      },
      template: '<div class="chart-container">' +
                '  <h3>Category-Wise Spending</h3>' +
                '  <div id="spending-chart"></div>' +
                '</div>',
      link: function(scope, element) {
        scope.$watch('categorySummaries', function(newVal) {
          if (newVal && newVal.length > 0) {
            renderChart(newVal);
          }
        });
        function renderChart(data) {
          const chartDiv = element.find('#spending-chart')[0];
          chartDiv.innerHTML = '';
          const width = 400;
          const height = 400;
          const radius = Math.min(width, height) / 2;
          const svg = d3.select(chartDiv)
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
          const color = d3.scaleOrdinal()
            .domain(data.map(function(d) { return d.categoryName; }))
            .range(data.map(function(d) { return CategoryService.getCategoryColor(d.categoryName); }));
          const pie = d3.pie()
            .value(function(d) { return d.totalAmount; });
          const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);
          const arcs = svg.selectAll('arc')
            .data(pie(data))
            .enter()
            .append('g');
          arcs.append('path')
            .attr('d', arc)
            .attr('fill', function(d) { return color(d.data.categoryName); })
            .attr('stroke', 'white')
            .style('stroke-width', '2px')
            .on('click', function(event, d) {
              scope.$apply(function() {
                scope.onCategoryClick({ category: d.data.categoryName });
              });
            })
            .style('cursor', 'pointer');
          arcs.append('text')
            .attr('transform', function(d) { return 'translate(' + arc.centroid(d) + ')'; })
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('fill', 'white')
            .text(function(d) { return d.data.percentage > 5 ? d.data.categoryName : ''; });
        }
      }
    };
  }
})();