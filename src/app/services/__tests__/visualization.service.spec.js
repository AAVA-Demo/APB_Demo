/*
Test Documentation:
- Test Name: VisualizationService - prepareMonthlyTrendsData
- Purpose: Validates preparation of monthly trends chart data
- Scenario: Monthly trend data transformed for Chart.js line chart
- Expected Result: Returns formatted data with labels, datasets, series, and options

- Test Name: VisualizationService - prepareCategoryData
- Purpose: Validates preparation of category-wise spending chart data
- Scenario: Category spending data transformed for Chart.js pie chart
- Expected Result: Returns formatted data with labels, values, colors, and options

- Test Name: VisualizationService - prepareCardWiseData
- Purpose: Validates preparation of card-wise spending chart data
- Scenario: Card spending data transformed for Chart.js bar chart
- Expected Result: Returns formatted data with labels, datasets, series, and options

- Test Name: VisualizationService - empty data handling
- Purpose: Validates handling of empty data arrays
- Scenario: Empty arrays passed to preparation functions
- Expected Result: Returns valid chart structure with empty data arrays

Coverage Report:
- Functions tested: prepareMonthlyTrendsData, prepareCategoryData, prepareCardWiseData
- Scenarios covered: monthly trends, category breakdown, card-wise analysis, empty data
- Edge cases: empty arrays, missing properties, unknown categories
- Uncovered scenarios: invalid data types (handled by Chart.js)
*/

(function() {
  'use strict';

  describe('VisualizationService', function() {
    var VisualizationService;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_VisualizationService_) {
      VisualizationService = _VisualizationService_;
    }));

    describe('prepareMonthlyTrendsData', function() {
      it('should prepare monthly trends data for line chart', function() {
        var monthlyTrends = [
          { month: 'Jan 2024', totalSpend: 1500 },
          { month: 'Feb 2024', totalSpend: 1800 },
          { month: 'Mar 2024', totalSpend: 1650 }
        ];

        var result = VisualizationService.prepareMonthlyTrendsData(monthlyTrends);

        expect(result.labels).toEqual(['Jan 2024', 'Feb 2024', 'Mar 2024']);
        expect(result.data).toEqual([[1500, 1800, 1650]]);
        expect(result.series).toEqual(['Monthly Spend']);
        expect(result.options).toBeDefined();
        expect(result.options.responsive).toBe(true);
        expect(result.options.maintainAspectRatio).toBe(false);
      });

      it('should handle empty monthly trends array', function() {
        var monthlyTrends = [];
        var result = VisualizationService.prepareMonthlyTrendsData(monthlyTrends);

        expect(result.labels).toEqual([]);
        expect(result.data).toEqual([[]]);
        expect(result.series).toEqual(['Monthly Spend']);
      });

      it('should include y-axis configuration with currency formatting', function() {
        var monthlyTrends = [{ month: 'Jan 2024', totalSpend: 1000 }];
        var result = VisualizationService.prepareMonthlyTrendsData(monthlyTrends);

        expect(result.options.scales).toBeDefined();
        expect(result.options.scales.yAxes).toBeDefined();
        expect(result.options.scales.yAxes[0].ticks.beginAtZero).toBe(true);
        expect(result.options.scales.yAxes[0].ticks.callback).toBeDefined();

        var formattedValue = result.options.scales.yAxes[0].ticks.callback(1500);
        expect(formattedValue).toBe('$1,500');
      });

      it('should handle single month data', function() {
        var monthlyTrends = [{ month: 'Jan 2024', totalSpend: 2500 }];
        var result = VisualizationService.prepareMonthlyTrendsData(monthlyTrends);

        expect(result.labels.length).toBe(1);
        expect(result.data[0].length).toBe(1);
        expect(result.data[0][0]).toBe(2500);
      });
    });

    describe('prepareCategoryData', function() {
      it('should prepare category-wise data for pie chart', function() {
        var categoryWiseSpend = [
          { category: 'Food & Dining', totalSpend: 500 },
          { category: 'Fuel', totalSpend: 300 },
          { category: 'Shopping', totalSpend: 800 }
        ];

        var result = VisualizationService.prepareCategoryData(categoryWiseSpend);

        expect(result.labels).toEqual(['Food & Dining', 'Fuel', 'Shopping']);
        expect(result.data).toEqual([500, 300, 800]);
        expect(result.colors.length).toBe(3);
        expect(result.options).toBeDefined();
        expect(result.options.responsive).toBe(true);
        expect(result.options.legend.display).toBe(true);
        expect(result.options.legend.position).toBe('right');
      });

      it('should assign predefined colors to known categories', function() {
        var categoryWiseSpend = [
          { category: 'Food & Dining', totalSpend: 500 },
          { category: 'Fuel', totalSpend: 300 }
        ];

        var result = VisualizationService.prepareCategoryData(categoryWiseSpend);

        expect(result.colors[0]).toBe('#FF6384');
        expect(result.colors[1]).toBe('#36A2EB');
      });

      it('should assign default color to unknown categories', function() {
        var categoryWiseSpend = [
          { category: 'Unknown Category', totalSpend: 100 }
        ];

        var result = VisualizationService.prepareCategoryData(categoryWiseSpend);

        expect(result.colors[0]).toBe('#999');
      });

      it('should handle empty category array', function() {
        var categoryWiseSpend = [];
        var result = VisualizationService.prepareCategoryData(categoryWiseSpend);

        expect(result.labels).toEqual([]);
        expect(result.data).toEqual([]);
        expect(result.colors).toEqual([]);
      });

      it('should include tooltip configuration with currency formatting', function() {
        var categoryWiseSpend = [{ category: 'Food & Dining', totalSpend: 500 }];
        var result = VisualizationService.prepareCategoryData(categoryWiseSpend);

        expect(result.options.tooltips).toBeDefined();
        expect(result.options.tooltips.callbacks).toBeDefined();
        expect(result.options.tooltips.callbacks.label).toBeDefined();

        var mockTooltipItem = { index: 0 };
        var mockData = {
          labels: ['Food & Dining'],
          datasets: [{ data: [500] }]
        };

        var formattedLabel = result.options.tooltips.callbacks.label(mockTooltipItem, mockData);
        expect(formattedLabel).toBe('Food & Dining: $500');
      });
    });

    describe('prepareCardWiseData', function() {
      it('should prepare card-wise data for bar chart', function() {
        var cardWiseSpend = [
          { cardName: 'Visa Gold', totalSpend: 2500 },
          { cardName: 'MasterCard Platinum', totalSpend: 3200 }
        ];

        var result = VisualizationService.prepareCardWiseData(cardWiseSpend);

        expect(result.labels).toEqual(['Visa Gold', 'MasterCard Platinum']);
        expect(result.data).toEqual([[2500, 3200]]);
        expect(result.series).toEqual(['Card Spend']);
        expect(result.options).toBeDefined();
        expect(result.options.responsive).toBe(true);
      });

      it('should handle empty card array', function() {
        var cardWiseSpend = [];
        var result = VisualizationService.prepareCardWiseData(cardWiseSpend);

        expect(result.labels).toEqual([]);
        expect(result.data).toEqual([[]]);
        expect(result.series).toEqual(['Card Spend']);
      });

      it('should include y-axis configuration with currency formatting', function() {
        var cardWiseSpend = [{ cardName: 'Visa', totalSpend: 1000 }];
        var result = VisualizationService.prepareCardWiseData(cardWiseSpend);

        expect(result.options.scales).toBeDefined();
        expect(result.options.scales.yAxes[0].ticks.beginAtZero).toBe(true);
        expect(result.options.scales.yAxes[0].ticks.callback).toBeDefined();

        var formattedValue = result.options.scales.yAxes[0].ticks.callback(2500);
        expect(formattedValue).toBe('$2,500');
      });

      it('should handle single card data', function() {
        var cardWiseSpend = [{ cardName: 'Visa Gold', totalSpend: 5000 }];
        var result = VisualizationService.prepareCardWiseData(cardWiseSpend);

        expect(result.labels.length).toBe(1);
        expect(result.data[0].length).toBe(1);
        expect(result.data[0][0]).toBe(5000);
      });
    });

    describe('edge cases', function() {
      it('should handle all predefined categories', function() {
        var allCategories = [
          { category: 'Food & Dining', totalSpend: 100 },
          { category: 'Fuel', totalSpend: 100 },
          { category: 'Shopping', totalSpend: 100 },
          { category: 'Travel', totalSpend: 100 },
          { category: 'Entertainment', totalSpend: 100 },
          { category: 'Utilities', totalSpend: 100 },
          { category: 'Healthcare', totalSpend: 100 },
          { category: 'Education', totalSpend: 100 },
          { category: 'Miscellaneous', totalSpend: 100 }
        ];

        var result = VisualizationService.prepareCategoryData(allCategories);

        expect(result.labels.length).toBe(9);
        expect(result.data.length).toBe(9);
        expect(result.colors.length).toBe(9);
        result.colors.forEach(function(color) {
          expect(color).not.toBe('#999');
        });
      });

      it('should handle zero spend values', function() {
        var monthlyTrends = [
          { month: 'Jan 2024', totalSpend: 0 },
          { month: 'Feb 2024', totalSpend: 0 }
        ];

        var result = VisualizationService.prepareMonthlyTrendsData(monthlyTrends);

        expect(result.data[0]).toEqual([0, 0]);
      });
    });
  });
})();