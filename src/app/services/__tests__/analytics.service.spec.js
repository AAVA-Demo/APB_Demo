/*
Test Documentation:
- Test Name: analyticsService - computeBenchmarks
- Purpose: Validate benchmark computation logic across normal, edge, and error scenarios
- Scenario: Empty companies, single company, multiple companies with alerts
- Expected Result: Correct avgSpend, maxSpend, minSpend, totalAlerts returned

- Test Name: analyticsService - detectAnomalies
- Purpose: Ensure anomaly detection flags companies spending 50% above average
- Scenario: No anomalies, one anomaly, all anomalies
- Expected Result: Anomaly array contains correct companyId and reason

- Test Name: analyticsService - generateRecommendations
- Purpose: Validate recommendation generation for budget_exceeded and stale data
- Scenario: budget_exceeded alert, stale data, both conditions, no conditions
- Expected Result: Correct recommendations with proper priority levels
*/

describe('analyticsService', function() {
  'use strict';

  var analyticsService;
  var mockDataAggregationFactory;
  var mockCompanyModel;

  beforeEach(module('dashboardModule'));

  beforeEach(function() {
    mockDataAggregationFactory = {};
    mockCompanyModel = {};

    module(function($provide) {
      $provide.value('dataAggregationFactory', mockDataAggregationFactory);
      $provide.value('CompanyModel', mockCompanyModel);
    });
  });

  beforeEach(inject(function(_analyticsService_) {
    analyticsService = _analyticsService_;
  }));

  // ─── computeBenchmarks ───────────────────────────────────────────────────────

  describe('computeBenchmarks', function() {

    it('should return zero benchmarks when companies array is empty', function() {
      var mockPortfolio = { getCompanies: function() { return []; } };
      var result = analyticsService.computeBenchmarks(mockPortfolio);
      expect(result.avgSpend).toBe(0);
      expect(result.maxSpend).toBe(0);
      expect(result.minSpend).toBe(0);
      expect(result.totalAlerts).toBe(0);
    });

    it('should return zero benchmarks when companies is null', function() {
      var mockPortfolio = { getCompanies: function() { return null; } };
      var result = analyticsService.computeBenchmarks(mockPortfolio);
      expect(result.avgSpend).toBe(0);
      expect(result.maxSpend).toBe(0);
      expect(result.minSpend).toBe(0);
      expect(result.totalAlerts).toBe(0);
    });

    it('should correctly compute benchmarks for a single company with no alerts', function() {
      var mockPortfolio = {
        getCompanies: function() {
          return [{ totalSpend: 1000, alertStatus: 'none' }];
        }
      };
      var result = analyticsService.computeBenchmarks(mockPortfolio);
      expect(result.avgSpend).toBe(1000);
      expect(result.maxSpend).toBe(1000);
      expect(result.minSpend).toBe(1000);
      expect(result.totalAlerts).toBe(0);
    });

    it('should correctly compute benchmarks for multiple companies', function() {
      var mockPortfolio = {
        getCompanies: function() {
          return [
            { totalSpend: 1000, alertStatus: 'none' },
            { totalSpend: 3000, alertStatus: 'budget_exceeded' },
            { totalSpend: 2000, alertStatus: 'none' }
          ];
        }
      };
      var result = analyticsService.computeBenchmarks(mockPortfolio);
      expect(result.avgSpend).toBe(2000);
      expect(result.maxSpend).toBe(3000);
      expect(result.minSpend).toBe(1000);
      expect(result.totalAlerts).toBe(1);
    });

    it('should count all non-none alert statuses as alerts', function() {
      var mockPortfolio = {
        getCompanies: function() {
          return [
            { totalSpend: 500, alertStatus: 'budget_exceeded' },
            { totalSpend: 500, alertStatus: 'warning' },
            { totalSpend: 500, alertStatus: 'none' }
          ];
        }
      };
      var result = analyticsService.computeBenchmarks(mockPortfolio);
      expect(result.totalAlerts).toBe(2);
    });

    it('should handle companies with missing totalSpend (treat as 0)', function() {
      var mockPortfolio = {
        getCompanies: function() {
          return [
            { alertStatus: 'none' },
            { totalSpend: 2000, alertStatus: 'none' }
          ];
        }
      };
      var result = analyticsService.computeBenchmarks(mockPortfolio);
      expect(result.avgSpend).toBe(1000);
      expect(result.minSpend).toBe(0);
      expect(result.maxSpend).toBe(2000);
    });

    it('should return minSpend as 0 when only one company with 0 spend', function() {
      var mockPortfolio = {
        getCompanies: function() {
          return [{ totalSpend: 0, alertStatus: 'none' }];
        }
      };
      var result = analyticsService.computeBenchmarks(mockPortfolio);
      expect(result.minSpend).toBe(0);
    });
  });

  // ─── detectAnomalies ─────────────────────────────────────────────────────────

  describe('detectAnomalies', function() {

    it('should return empty array when no companies exceed 1.5x average spend', function() {
      var mockPortfolio = {
        getCompanies: function() {
          return [
            { companyId: 'c1', companyName: 'Alpha', totalSpend: 1000, alertStatus: 'none' },
            { companyId: 'c2', companyName: 'Beta',  totalSpend: 1000, alertStatus: 'none' }
          ];
        }
      };
      var result = analyticsService.detectAnomalies(mockPortfolio);
      expect(result.length).toBe(0);
    });

    it('should flag a company whose spend is more than 1.5x the average', function() {
      var mockPortfolio = {
        getCompanies: function() {
          return [
            { companyId: 'c1', companyName: 'Alpha', totalSpend: 500,  alertStatus: 'none' },
            { companyId: 'c2', companyName: 'Beta',  totalSpend: 500,  alertStatus: 'none' },
            { companyId: 'c3', companyName: 'Gamma', totalSpend: 3000, alertStatus: 'none' }
          ];
        }
      };
      var result = analyticsService.detectAnomalies(mockPortfolio);
      expect(result.length).toBe(1);
      expect(result[0].companyId).toBe('c3');
      expect(result[0].reason).toBe('Spend 50% above average');
      expect(result[0].spend).toBe(3000);
    });

    it('should flag multiple anomalous companies', function() {
      var mockPortfolio = {
        getCompanies: function() {
          return [
            { companyId: 'c1', companyName: 'Alpha', totalSpend: 100,  alertStatus: 'none' },
            { companyId: 'c2', companyName: 'Beta',  totalSpend: 5000, alertStatus: 'none' },
            { companyId: 'c3', companyName: 'Gamma', totalSpend: 6000, alertStatus: 'none' }
          ];
        }
      };
      var result = analyticsService.detectAnomalies(mockPortfolio);
      expect(result.length).toBe(2);
    });

    it('should return empty array when portfolio has no companies', function() {
      var mockPortfolio = { getCompanies: function() { return []; } };
      var result = analyticsService.detectAnomalies(mockPortfolio);
      expect(result.length).toBe(0);
    });

    it('should include companyName in anomaly object', function() {
      var mockPortfolio = {
        getCompanies: function() {
          return [
            { companyId: 'c1', companyName: 'LowSpender',  totalSpend: 100,  alertStatus: 'none' },
            { companyId: 'c2', companyName: 'HighSpender', totalSpend: 9000, alertStatus: 'none' }
          ];
        }
      };
      var result = analyticsService.detectAnomalies(mockPortfolio);
      expect(result[0].companyName).toBe('HighSpender');
    });
  });

  // ─── generateRecommendations ─────────────────────────────────────────────────

  describe('generateRecommendations', function() {

    it('should return empty array when no companies have issues', function() {
      var mockPortfolio = {
        getCompanies: function() {
          return [{ companyId: 'c1', companyName: 'Alpha', alertStatus: 'none', isDataFresh: true }];
        }
      };
      var result = analyticsService.generateRecommendations(mockPortfolio);
      expect(result.length).toBe(0);
    });

    it('should generate high priority recommendation for budget_exceeded alert', function() {
      var mockPortfolio = {
        getCompanies: function() {
          return [{ companyId: 'c1', companyName: 'Alpha', alertStatus: 'budget_exceeded', isDataFresh: true }];
        }
      };
      var result = analyticsService.generateRecommendations(mockPortfolio);
      expect(result.length).toBe(1);
      expect(result[0].priority).toBe('high');
      expect(result[0].recommendation).toBe('Review AI spend - budget threshold exceeded');
      expect(result[0].companyId).toBe('c1');
    });

    it('should generate medium priority recommendation for stale data', function() {
      var mockPortfolio = {
        getCompanies: function() {
          return [{ companyId: 'c2', companyName: 'Beta', alertStatus: 'none', isDataFresh: false }];
        }
      };
      var result = analyticsService.generateRecommendations(mockPortfolio);
      expect(result.length).toBe(1);
      expect(result[0].priority).toBe('medium');
      expect(result[0].recommendation).toBe('Data sync required - last update over 24 hours ago');
    });

    it('should generate two recommendations when both conditions are true', function() {
      var mockPortfolio = {
        getCompanies: function() {
          return [{ companyId: 'c3', companyName: 'Gamma', alertStatus: 'budget_exceeded', isDataFresh: false }];
        }
      };
      var result = analyticsService.generateRecommendations(mockPortfolio);
      expect(result.length).toBe(2);
      expect(result[0].priority).toBe('high');
      expect(result[1].priority).toBe('medium');
    });

    it('should handle multiple companies and accumulate all recommendations', function() {
      var mockPortfolio = {
        getCompanies: function() {
          return [
            { companyId: 'c1', companyName: 'Alpha', alertStatus: 'budget_exceeded', isDataFresh: true },
            { companyId: 'c2', companyName: 'Beta',  alertStatus: 'none',            isDataFresh: false },
            { companyId: 'c3', companyName: 'Gamma', alertStatus: 'none',            isDataFresh: true }
          ];
        }
      };
      var result = analyticsService.generateRecommendations(mockPortfolio);
      expect(result.length).toBe(2);
    });
  });
});

/*
Coverage Report:
- Functions tested: computeBenchmarks, detectAnomalies, generateRecommendations
- Scenarios covered: empty input, null input, single company, multiple companies, alert counting, anomaly thresholds, recommendation priorities, combined conditions
- Uncovered scenarios: none
*/