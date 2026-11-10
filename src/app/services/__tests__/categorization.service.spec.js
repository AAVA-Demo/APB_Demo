/*
Test Documentation:
- Test Name: CategorizationService - getCategorizedTransactions success
- Purpose: Validates retrieval of categorized transaction data
- Scenario: HTTP GET to /api/transactions/categorized returns transaction array with categories
- Expected Result: Promise resolves with categorized transactions
*/
/*
Test Documentation:
- Test Name: CategorizationService - getCategorizedTransactions handles error
- Purpose: Validates error handling when categorization API fails
- Scenario: HTTP GET to /api/transactions/categorized returns error
- Expected Result: Promise is rejected with error
*/
/*
Test Documentation:
- Test Name: CategorizationService - getCategorizedTransactions handles empty data
- Purpose: Validates handling of empty transaction list
- Scenario: HTTP GET returns empty array
- Expected Result: Promise resolves with empty array
*/
/*
Coverage Report:
- Functions tested: getCategorizedTransactions
- Scenarios covered: success with data, HTTP errors, empty data, network errors
- Uncovered scenarios: none
*/

describe('CategorizationService', function() {
  'use strict';

  beforeEach(module('app.analytics'));

  var CategorizationService, $httpBackend, $rootScope;
  var API_BASE = '/api/transactions/categorized';

  beforeEach(inject(function(_CategorizationService_, _$httpBackend_, _$rootScope_) {
    CategorizationService = _CategorizationService_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getCategorizedTransactions', function() {
    it('should retrieve categorized transactions successfully', function(done) {
      var mockTransactions = [
        { date: '2023-01-15', category: 'Food & Dining', amount: 45.50 },
        { date: '2023-01-14', category: 'Fuel', amount: 60.00 },
        { date: '2023-01-13', category: 'Shopping', amount: 120.75 },
        { date: '2023-01-12', category: 'Travel', amount: 300.00 }
      ];

      $httpBackend.expectGET(API_BASE).respond(200, mockTransactions);

      CategorizationService.getCategorizedTransactions().then(function(result) {
        expect(result).toEqual(mockTransactions);
        expect(result.length).toBe(4);
        expect(result[0].category).toBe('Food & Dining');
        expect(result[1].category).toBe('Fuel');
        done();
      });

      $httpBackend.flush();
    });

    it('should handle HTTP error when fetching categorized transactions', function(done) {
      $httpBackend.expectGET(API_BASE).respond(500, 'Internal Server Error');

      CategorizationService.getCategorizedTransactions().catch(function(error) {
        expect(error.status).toBe(500);
        done();
      });

      $httpBackend.flush();
    });

    it('should return empty array when no transactions exist', function(done) {
      $httpBackend.expectGET(API_BASE).respond(200, []);

      CategorizationService.getCategorizedTransactions().then(function(result) {
        expect(result).toEqual([]);
        expect(result.length).toBe(0);
        done();
      });

      $httpBackend.flush();
    });

    it('should handle network timeout', function(done) {
      $httpBackend.expectGET(API_BASE).respond(-1, '');

      CategorizationService.getCategorizedTransactions().catch(function(error) {
        expect(error.status).toBe(-1);
        done();
      });

      $httpBackend.flush();
    });

    it('should handle unauthorized access', function(done) {
      $httpBackend.expectGET(API_BASE).respond(401, 'Unauthorized');

      CategorizationService.getCategorizedTransactions().catch(function(error) {
        expect(error.status).toBe(401);
        done();
      });

      $httpBackend.flush();
    });

    it('should handle transactions with all nine categories', function(done) {
      var mockTransactions = [
        { date: '2023-01-15', category: 'Food & Dining', amount: 45.50 },
        { date: '2023-01-14', category: 'Fuel', amount: 60.00 },
        { date: '2023-01-13', category: 'Shopping', amount: 120.75 },
        { date: '2023-01-12', category: 'Travel', amount: 300.00 },
        { date: '2023-01-11', category: 'Entertainment', amount: 80.00 },
        { date: '2023-01-10', category: 'Utilities', amount: 150.00 },
        { date: '2023-01-09', category: 'Healthcare', amount: 200.00 },
        { date: '2023-01-08', category: 'Education', amount: 500.00 },
        { date: '2023-01-07', category: 'Miscellaneous', amount: 25.00 }
      ];

      $httpBackend.expectGET(API_BASE).respond(200, mockTransactions);

      CategorizationService.getCategorizedTransactions().then(function(result) {
        expect(result.length).toBe(9);
        var categories = result.map(function(t) { return t.category; });
        expect(categories).toContain('Food & Dining');
        expect(categories).toContain('Fuel');
        expect(categories).toContain('Shopping');
        expect(categories).toContain('Travel');
        expect(categories).toContain('Entertainment');
        expect(categories).toContain('Utilities');
        expect(categories).toContain('Healthcare');
        expect(categories).toContain('Education');
        expect(categories).toContain('Miscellaneous');
        done();
      });

      $httpBackend.flush();
    });
  });
});