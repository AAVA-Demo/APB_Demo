(function() {
  'use strict';
  angular.module('analyticsModule').directive('chart', ['$timeout', function($timeout) {
    return {
      restrict: 'E',
      scope: {
        data: '=',
        type: '@'
      },
      template: '<div class="chart-container"><svg></svg></div>',
      link: function(scope, element) {
        const svg = d3.select(element[0]).select('svg');
        const width = 600;
        const height = 400;
        svg.attr('width', width).attr('height', height);
        function renderPieChart(data) {
          svg.selectAll('*').remove();
          const radius = Math.min(width, height) / 2;
          const g = svg.append('g').attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
          const color = d3.scaleOrdinal(d3.schemeCategory10);
          const pie = d3.pie().value(function(d) { return d.amount; });
          const arc = d3.arc().innerRadius(0).outerRadius(radius);
          const arcs = g.selectAll('.arc').data(pie(data)).enter().append('g').attr('class', 'arc');
          arcs.append('path').attr('d', arc).attr('fill', function(d, i) { return color(i); });
          arcs.append('text').attr('transform', function(d) { return 'translate(' + arc.centroid(d) + ')'; }).attr('text-anchor', 'middle').attr('font-size', '12px').attr('fill', 'white').text(function(d) { return d.data.category; });
        }
        function renderBarChart(data) {
          svg.selectAll('*').remove();
          const margin = { top: 20, right: 20, bottom: 60, left: 60 };
          const chartWidth = width - margin.left - margin.right;
          const chartHeight = height - margin.top - margin.bottom;
          const g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
          const x = d3.scaleBand().domain(data.map(function(d) { return d.month || d.cardName; })).range([0, chartWidth]).padding(0.1);
          const y = d3.scaleLinear().domain([0, d3.max(data, function(d) { return d.totalSpend; })]).range([chartHeight, 0]);
          g.append('g').attr('transform', 'translate(0,' + chartHeight + ')').call(d3.axisBottom(x)).selectAll('text').attr('transform', 'rotate(-45)').style('text-anchor', 'end');
          g.append('g').call(d3.axisLeft(y));
          g.selectAll('.bar').data(data).enter().append('rect').attr('class', 'bar').attr('x', function(d) { return x(d.month || d.cardName); }).attr('y', function(d) { return y(d.totalSpend); }).attr('width', x.bandwidth()).attr('height', function(d) { return chartHeight - y(d.totalSpend); }).attr('fill', 'steelblue');
        }
        scope.$watch('data', function(newData) {
          if (newData && newData.length > 0) {
            $timeout(function() {
              if (scope.type === 'pie') {
                renderPieChart(newData);
              } else if (scope.type === 'bar') {
                renderBarChart(newData);
              }
            }, 100);
          }
        }, true);
      }
    };
  }]);
})();