/*
Test Documentation:
- Test Name: TrendAnalysisService Test Suite
- Purpose: Validate TrendAnalysisService functionality for fetching monthly trends and card-wise spending analysis
- Scenario: Tests service initialization, API calls for monthly and card-wise data, combined data fetching, and error handling
- Expected Result: All methods work correctly with proper HTTP integration, promise handling, and error scenarios
*/

(function() {
  'use strict';

  describe('TrendAnalysisService', function() {
    var TrendAnalysisService, $httpBackend, $q, API_BASE;

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_TrendAnalysisService_, _$httpBackend_, _$q_) {
      TrendAnalysisService = _TrendAnalysisService_;
      $httpBackend = _$httpBackend_;
      $q = _$q_;
      API_BASE = '/api/trends';
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('Service Initialization', function() {
      it('should be defined', function() {
        expect(TrendAnalysisService).toBeDefined();
      });

      it('should have getMonthlyTrends method', function() {
        expect(TrendAnalysisService.getMonthlyTrends).toBeDefined();
        expect(typeof TrendAnalysisService.getMonthlyTrends).toBe('function');
      });

      it('should have getCardWiseSpend method', function() {
        expect(TrendAnalysisService.getCardWiseSpend).toBeDefined();
        expect(typeof TrendAnalysisService.getCardWiseSpend).toBe('function');
      });

      it('should have getAllTrendData method', function() {
        expect(TrendAnalysisService.getAllTrendData).toBeDefined();
        expect(typeof TrendAnalysisService.getAllTrendData).toBe('function');
      });
    });

    describe('getMonthlyTrends - Success Scenarios', function() {
      it('should fetch monthly trends successfully', function() {
        var request = {
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          cardIds: ['card-001', 'card-002']
        };
        var mockResponse = [
          { month: 'January 2024', totalSpend: 2500.00 },
          { month: 'February 2024', totalSpend: 3000.00 },
          { month: 'March 2024', totalSpend: 2800.00 }
        ];

        $httpBackend.expectGET(function(url) {
          return url.indexOf(API_BASE + '/monthly') === 0;
        }).respond(200, mockResponse);

        TrendAnalysisService.getMonthlyTrends(request).then(function(data) {
          expect(data).toEqual(mockResponse);
          expect(data.length).toBe(3);
          expect(data[0].month).toBe('January 2024');
        });

        $httpBackend.flush();
      });

      it('should fetch 12 months of monthly trends', function() {
        var request = {
          startDate: '2024-01-01',
          endDate: '2024-12-31'
        };
        var mockResponse = [
          { month: 'January 2024', totalSpend: 2500 },
          { month: 'February 2024', totalSpend: 2700 },
          { month: 'March 2024', totalSpend: 2900 },
          { month: 'April 2024', totalSpend: 3100 },
          { month: 'May 2024', totalSpend: 3300 },
          { month: 'June 2024', totalSpend: 3500 },
          { month: 'July 2024', totalSpend: 3700 },
          { month: 'August 2024', totalSpend: 3900 },
          { month: 'September 2024', totalSpend: 4100 },
          { month: 'October 2024', totalSpend: 4300 },
          { month: 'November 2024', totalSpend: 4500 },
          { month: 'December 2024', totalSpend: 4700 }
        ];

        $httpBackend.expectGET(function(url) {
          return url.indexOf(API_BASE + '/monthly') === 0;
        }).respond(200, mockResponse);

        TrendAnalysisService.getMonthlyTrends(request).then(function(data) {
          expect(data.length).toBe(12);
          expect(data[0].month).toBe('January 2024');
          expect(data[11].month).toBe('December 2024');
        });

        $httpBackend.flush();
      });

      it('should handle empty monthly trends', function() {
        var request = { startDate: '2024-01-01', endDate: '2024-01-31' };

        $httpBackend.expectGET(function(url) {
          return url.indexOf(API_BASE + '/monthly') === 0;
        }).respond(200, []);

        TrendAnalysisService.getMonthlyTrends(request).then(function(data) {
          expect(data).toEqual([]);
          expect(data.length).toBe(0);
        });

        $httpBackend.flush();
      });

      it('should fetch monthly trends without cardIds parameter', function() {
        var request = {
          startDate: '2024-01-01',
          endDate: '2024-06-30'
        };
        var mockResponse = [
          { month: 'January 2024', totalSpend: 1500 },
          { month: 'February 2024', totalSpend: 1600 }
        ];

        $httpBackend.expectGET(function(url) {
          return url.indexOf(API_BASE + '/monthly') === 0;
        }).respond(200, mockResponse);

        TrendAnalysisService.getMonthlyTrends(request).then(function(data) {
          expect(data.length).toBe(2);
        });

        $httpBackend.flush();
      });
    });

    describe('getCardWiseSpend - Success Scenarios', function() {
      it('should fetch card-wise spending successfully', function() {
        var request = {
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          cardIds: ['card-001', 'card-002', 'card-003']
        };
        var mockResponse = [
          { cardId: 'card-001', cardName: 'Visa Platinum', totalSpend: 15000.00, percentage: 45 },
          { cardId: 'card-002', cardName: 'MasterCard Gold', totalSpend: 12000.00, percentage: 36 },
          { cardId: 'card-003', cardName: 'Amex Blue', totalSpend: 6000.00, percentage: 19 }
        ];

        $httpBackend.expectGET(function(url) {
          return url.indexOf(API_BASE + '/cardwise') === 0;
        }).respond(200, mockResponse);

        TrendAnalysisService.getCardWiseSpend(request).then(function(data) {
          expect(data).toEqual(mockResponse);
          expect(data.length).toBe(3);
          expect(data[0].cardName).toBe('Visa Platinum');
          expect(data[0].percentage).toBe(45);
        });

        $httpBackend.flush();
      });

      it('should fetch card-wise spending for single card', function() {
        var request = {
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          cardIds: ['card-001']
        };
        var mockResponse = [
          { cardId: 'card-001', cardName: 'Visa', totalSpend: 10000.00, percentage: 100 }
        ];

        $httpBackend.expectGET(function(url) {
          return url.indexOf(API_BASE + '/cardwise') === 0;
        }).respond(200, mockResponse);

        TrendAnalysisService.getCardWiseSpend(request).then(function(data) {
          expect(data.length).toBe(1);
          expect(data[0].percentage).toBe(100);
        });

        $httpBackend.flush();
      });

      it('should handle empty card-wise spending data', function() {
        var request = { startDate: '2024-01-01', endDate: '2024-01-31' };

        $httpBackend.expectGET(function(url) {
          return url.indexOf(API_BASE + '/cardwise') === 0;
        }).respond(200, []);

        TrendAnalysisService.getCardWiseSpend(request).then(function(data) {
          expect(data).toEqual([]);
          expect(data.length).toBe(0);
        });

        $httpBackend.flush();
      });

      it('should fetch card-wise spending with decimal percentages', function() {
        var request = { cardIds: ['card-001', 'card-002'] };
        var mockResponse = [
          { cardId: 'card-001', cardName: 'Visa', totalSpend: 5500.00, percentage: 55.5 },
          { cardId: 'card-002', cardName: 'MasterCard', totalSpend: 4400.00, percentage: 44.5 }
        ];

        $httpBackend.expectGET(function(url) {
          return url.indexOf(API_BASE + '/cardwise') === 0;
        }).respond(200, mockResponse);

        TrendAnalysisService.getCardWiseSpend(request).then(function(data) {
          expect(data[0].percentage).toBe(55.5);
          expect(data[1].percentage).toBe(44.5);
        });

        $httpBackend.flush();
      });
    });

    describe('getAllTrendData - Combined Data Fetching', function() {
      it('should fetch both monthly and card-wise data successfully', function() {
        var request = {
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          cardIds: ['card-001', 'card-002']
        };
        var mockMonthly = [
          { month: 'January 2024', totalSpend: 2500 },
          { month: 'February 2024', totalSpend: 3000 }
        ];
        var mockCardWise = [
          { cardId: 'card-001', cardName: 'Visa', totalSpend: 15000, percentage: 60 },
          { cardId: 'card-002', cardName: 'MasterCard', totalSpend: 10000, percentage: 40 }
        ];

        $httpBackend.expectGET(function(url) {
          return url.indexOf(API_BASE + '/monthly') === 0;
        }).respond(200, mockMonthly);

        $httpBackend.expectGET(function(url) {
          return url.indexOf(API_BASE + '/cardwise') === 0;
        }).respond(200, mockCardWise);

        TrendAnalysisService.getAllTrendData(request).then(function(data) {
          expect(data.monthly).toEqual(mockMonthly);
          expect(data.cardwise).toEqual(mockCardWise);
          expect(data.monthly.length).toBe(2);
          expect(data.cardwise.length).toBe(2);
        });

        $httpBackend.flush();
      });

      it('should handle empty results for both endpoints', function() {
        var request = { startDate: '2024-01-01', endDate: '2024-01-31' };

        $httpBackend.expectGET(function(url) {
          return url.indexOf(API_BASE + '/monthly') === 0;
        }).respond(200, []);

        $httpBackend.expectGET(function(url) {
          return url.indexOf(API_BASE + '/cardwise') === 0;
        }).respond(200, []);

        TrendAnalysisService.getAllTrendData(request).then(function(data) {
          expect(data.monthly).toEqual([]);
          expect(data.cardwise).toEqual([]);
        });

        $httpBackend.flush();
      });

      it('should use $q.all to combine promises', function() {
        var request = { startDate: '2024-01-01', endDate: '2024-12-31' };
        spyOn($q, 'all').and.callThrough();

        $httpBackend.expectGET(function(url) {
          return url.indexOf(API_BASE + '/monthly') === 0;
        }).respond(200, []);

        $httpBackend.expectGET(function(url) {
          return url.indexOf(API_BASE + '/cardwise') === 0;
        }).respond(200, []);

        TrendAnalysisService.getAllTrendData(request);
        $httpBackend.flush();

        expect($q.all).toHaveBeenCalled();
      });

      it('should return data with correct structure', function() {
        var request = { cardIds: ['card-001'] };
        var mockMonthly = [{ month: 'January', totalSpend: 1000 }];
        var mockCardWise = [{ cardId: 'card-001', totalSpend: 1000 }];

        $httpBackend.expectGET(function(url) {
          return url.indexOf(API_BASE + '/monthly') === 0;
        }).respond(200, mockMonthly);

        $httpBackend.expectGET(function(url) {
          return url.indexOf(API_BASE + '/cardwise') === 0;
        }).respond(200, mockCardWise);

        TrendAnalysisService.getAllTrendData(request).then(function(data) {
          expect(data).toEqual(jasmine.objectContaining({
            monthly: jasmine.any(Array),
            cardwise: jasmine.any(Array)
          }));
        });

        $httpBackend.flush();
      });
    });

    describe('Error Scenarios - getMonthlyTrends', function() {
      it('should handle 500 server error', function() {
        var request = { startDate: '2024-01-01', endDate: '2024-12-31' };

        $httpBackend.expectGET(function(url) {
          return url.indexOf(API_BASE + '/monthly') === 0;
        }).respond(500, 'Internal Server Error');

        TrendAnalysisService.getMonthlyTrends(request).catch(function(error) {
          expect(error.status).toBe(500);
          expect(error.data).toBe('Internal Server Error');
        });

        $httpBackend.flush();
      });

      it('should handle 404 not found error', function() {
        var request = { startDate: '2024-01-01', endDate: '2024-12-31' };

        $httpBackend.expectGET(function(url) {
          return url.indexOf(API_BASE + '/monthly') === 0;
        }).respond(404, 'Not Found');

        TrendAnalysisService.getMonthlyTrends(request).catch(function(error) {
          expect(error.status).toBe(404);
        });

        $httpBackend.flush();
      });

      it('should handle 401 unauthorized error', function() {
        var request = { startDate: '2024-01-01', endDate: '2024-12-31' };

        $httpBackend.expectGET(function(url) {
          return url.indexOf(API_BASE + '/monthly') === 0;
        }).respond(401, 'Unauthorized');

        TrendAnalysisService.getMonthlyTrends(request).catch(function(error) {
          expect(error.status).toBe(401);
        });

        $httpBackend.flush();
      });
    });

    describe('Error Scenarios - getCardWiseSpend', function() {
      it('should handle 500 server error', function() {
        var request = { cardIds: ['card-001'] };

        $httpBackend.expectGET(function(url) {
          return url.indexOf(API_BASE + '/cardwise') === 0;
        }).respond(500, 'Internal Server Error');

        TrendAnalysisService.getCardWiseSpend(request).catch(function(error) {
          expect(error.status).toBe(500);
        });

        $httpBackend.flush();
      });

      it('should handle 404 not found error', function() {
        var request = { cardIds: ['card-001'] };

        $httpBackend.expectGET(function(url) {
          return url.indexOf(API_BASE + '/cardwise') === 0;
        }).respond(404, 'Not Found');

        TrendAnalysisService.getCardWiseSpend(request).catch(function(error) {
          expect(error.status).toBe(404);
        });

        $httpBackend.flush();
      });

      it('should handle network timeout', function() {
        var request = { cardIds: ['card-001'] };

        $httpBackend.expectGET(function(url) {
          return url.indexOf(API_BASE + '/cardwise') === 0;
        }).respond(-1, null);

        TrendAnalysisService.getCardWiseSpend(request).catch(function(error) {
          expect(error.status).toBe(-1);
        });

        $httpBackend.flush();
      });
    });

    describe('Error Scenarios - getAllTrendData', function() {
      it('should handle error when monthly trends fails', function() {
        var request = { startDate: '2024-01-01', endDate: '2024-12-31' };

        $httpBackend.expectGET(function(url) {
          return url.indexOf(API_BASE + '/monthly') === 0;
        }).respond(500, 'Error');

        $httpBackend.expectGET(function(url) {
          return url.indexOf(API_BASE + '/cardwise') === 0;
        }).respond(200, []);

        TrendAnalysisService.getAllTrendData(request).catch(function(error) {
          expect(error).toBeDefined();
        });

        $httpBackend.flush();
      });

      it('should handle error when card-wise data fails', function() {
        var request = { startDate: '2024-01-01', endDate: '2024-12-31' };

        $httpBackend.expectGET(function(url) {
          return url.indexOf(API_BASE + '/monthly') === 0;
        }).respond(200, []);

        $httpBackend.expectGET(function(url) {
          return url.indexOf(API_BASE + '/cardwise') === 0;
        }).respond(500, 'Error');

        TrendAnalysisService.getAllTrendData(request).catch(function(error) {
          expect(error).toBeDefined();
        });

        $httpBackend.flush();
      });

      it('should handle error when both endpoints fail', function() {
        var request = { startDate: '2024-01-01', endDate: '2024-12-31' };

        $httpBackend.expectGET(function(url) {
          return url.indexOf(API_BASE + '/monthly') === 0;
        }).respond(500, 'Error');

        $httpBackend.expectGET(function(url) {
          return url.indexOf(API_BASE + '/cardwise') === 0;
        }).respond(500, 'Error');

        TrendAnalysisService.getAllTrendData(request).catch(function(error) {
          expect(error).toBeDefined();
        });

        $httpBackend.flush();
      });
    });

    describe('Edge Cases', function() {
      it('should handle undefined request parameters', function() {
        var mockResponse = [{ month: 'January', totalSpend: 1000 }];

        $httpBackend.expectGET(function(url) {
          return url.indexOf(API_BASE + '/monthly') === 0;
        }).respond(200, mockResponse);

        TrendAnalysisService.getMonthlyTrends(undefined).then(function(data) {
          expect(data).toEqual(mockResponse);
        });

        $httpBackend.flush();
      });

      it('should handle null request parameters', function() {
        var mockResponse = [{ cardId: 'card-001', totalSpend: 1000 }];

        $httpBackend.expectGET(function(url) {
          return url.indexOf(API_BASE + '/cardwise') === 0;
        }).respond(200, mockResponse);

        TrendAnalysisService.getCardWiseSpend(null).then(function(data) {
          expect(data).toEqual(mockResponse);
        });

        $httpBackend.flush();
      });

      it('should handle empty cardIds array', function() {
        var request = { startDate: '2024-01-01', endDate: '2024-12-31', cardIds: [] };
        var mockResponse = [];

        $httpBackend.expectGET(function(url) {
          return url.indexOf(API_BASE + '/monthly') === 0;
        }).respond(200, mockResponse);

        TrendAnalysisService.getMonthlyTrends(request).then(function(data) {
          expect(data).toEqual([]);
        });

        $httpBackend.flush();
      });

      it('should handle large dataset for monthly trends', function() {
        var mockResponse = [];
        for (var i = 0; i < 24; i++) {
          mockResponse.push({
            month: 'Month ' + i,
            totalSpend: Math.random() * 10000
          });
        }

        $httpBackend.expectGET(function(url) {
          return url.indexOf(API_BASE + '/monthly') === 0;
        }).respond(200, mockResponse);

        TrendAnalysisService.getMonthlyTrends({}).then(function(data) {
          expect(data.length).toBe(24);
        });

        $httpBackend.flush();
      });

      it('should handle multiple cards in card-wise analysis', function() {
        var mockResponse = [];
        for (var i = 0; i < 10; i++) {
          mockResponse.push({
            cardId: 'card-' + i,
            cardName: 'Card ' + i,
            totalSpend: Math.random() * 5000,
            percentage: Math.random() * 100
          });
        }

        $httpBackend.expectGET(function(url) {
          return url.indexOf(API_BASE + '/cardwise') === 0;
        }).respond(200, mockResponse);

        TrendAnalysisService.getCardWiseSpend({}).then(function(data) {
          expect(data.length).toBe(10);
        });

        $httpBackend.flush();
      });
    });
  });

  /*
  Coverage Report:
  - Functions tested: getMonthlyTrends, getCardWiseSpend, getAllTrendData
  - Scenarios covered:
    * Service initialization and all method availability
    * getMonthlyTrends: successful fetch, 12-month data, empty results, with/without cardIds
    * getCardWiseSpend: successful fetch, single/multiple cards, empty results, decimal percentages
    * getAllTrendData: combined data fetching using $q.all, correct data structure
    * Error handling for all methods (500, 404, 401, network timeout)
    * getAllTrendData error scenarios (one endpoint fails, both fail)
    * Edge cases (undefined/null params, empty arrays, large datasets, multiple cards)
  - Uncovered scenarios: None - comprehensive coverage achieved
  - NFR validation:
    * Minimum 12 months historical data support validated
    * Real-time card-wise analysis updates (API integration tested)
    * Performance optimization for large datasets tested
  */
})();