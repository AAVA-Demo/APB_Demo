(function() {
  'use strict';
  angular.module('creditCard.analytics')
    .directive('trendGraph', ['ChartConfigFactory', trendGraph]);
  function trendGraph(ChartConfigFactory) {
    return {
      restrict: 'E',
      scope: {
        monthlyTrends: '='
      },
      template: '<div class="chart-container">' +
                '  <h3>Monthly Spend Trends</h3>' +
                '  <div id="trend-graph"></div>' +
                '</div>',
      link: function(scope, element) {
        scope.$watch('monthlyTrends', function(newVal) {
          if (newVal && newVal.length > 0) {
            renderGraph(newVal);
          }
        });
        function renderGraph(data) {
          const chartDiv = element.find('#trend-graph')[0];
          chartDiv.innerHTML = '';
          const margin = { top: 20, right: 30, bottom: 50, left: 70 };
          const width = 500 - margin.left - margin.right;
          const height = 300 - margin.top - margin.bottom;
          const svg = d3.select(chartDiv)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
          const x = d3.scaleBand()
            .domain(data.map(function(d) { return d.month; }))
            .range([0, width])
            .padding(0.1);
          const y = d3.scaleLinear()
            .domain([0, d3.max(data, function(d) { return d.totalSpend; })])
            .range([height, 0]);
          svg.append('g')
            .attr('transform', 'translate(0,' + height + ')')
            .call(d3.axisBottom(x))
            .selectAll('text')
            .attr('transform', 'rotate(-45)')
            .style('text-anchor', 'end');
          svg.append('g')
            .call(d3.axisLeft(y));
          const line = d3.line()
            .x(function(d) { return x(d.month) + x.bandwidth() / 2; })
            .y(function(d) { return y(d.totalSpend); });
          svg.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', '#007bff')
            .attr('stroke-width', 2)
            .attr('d', line);
          svg.selectAll('dot')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', function(d) { return x(d.month) + x.bandwidth() / 2; })
            .attr('cy', function(d) { return y(d.totalSpend); })
            .attr('r', 5)
            .attr('fill', '#007bff')
            .append('title')
            .text(function(d) { return d.month + ': ₹' + d.totalSpend.toLocaleString('en-IN'); });
        }
      }
    };
  }
})();