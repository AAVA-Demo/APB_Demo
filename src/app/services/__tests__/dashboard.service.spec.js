/*
Test Documentation:
- Test Name: DashboardService - getKPIs with cache hit
- Purpose: Validates cached KPI data is returned when available
- Scenario: Service has cached KPI data for the user
- Expected Result: Cached data is returned without HTTP call
*/
/*
Test Documentation:
- Test Name: DashboardService - getKPIs with cache miss
- Purpose: Validates HTTP request is made when cache is empty
- Scenario: No cached data exists for the user
- Expected Result: HTTP GET request is made and data is cached
*/
/*
Test Documentation:
- Test Name: DashboardService - getKPIs error handling
- Purpose: Validates error handling when HTTP request fails
- Scenario: HTTP request returns error
- Expected Result: Promise is rejected with error
*/
/*
Test Documentation:
- Test Name: DashboardService - mockGetKPIs returns complete KPI data
- Purpose: Validates mock KPI data structure and completeness
- Scenario: Mock method is called with userId
- Expected Result: Complete KPI data with all four metrics and credit cards returned
*/
/*
Coverage Report:
- Functions tested: getKPIs, mockGetKPIs
- Scenarios covered: cache hit, cache miss, HTTP error, mock data structure, KPI completeness, credit card data
- Edge cases: empty cache, HTTP failure, multiple credit cards
- Uncovered scenarios: cache expiration timing (requires time-based testing)
*/

(function() {
  'use strict';

  describe('DashboardService', function() {
    var DashboardService, $httpBackend, $q, $cacheFactory, cache;
    var API_BASE = '/api/dashboard';
    var mockUserId = 'user123';
    var mockKPIData = {
      userId: mockUserId,
      monthlySpend: 12450.75,
      totalCreditLimit: 50000,
      availableCredit: 37549.25,
      outstandingAmount: 12450.75,
      creditCards: [
        {
          cardId: 'card001',
          cardName: 'Visa Platinum',
          cardNumber: '**** **** **** 1234',
          creditLimit: 25000,
          availableCredit: 18750,
          outstandingAmount: 6250,
          monthlySpend: 6250
        }
      ],
      lastUpdated: new Date()
    };

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_DashboardService_, _$httpBackend_, _$q_, _$cacheFactory_) {
      DashboardService = _DashboardService_;
      $httpBackend = _$httpBackend_;
      $q = _$q_;
      $cacheFactory = _$cacheFactory_;
      cache = $cacheFactory.get('dashboardCache');
      if (cache) {
        cache.removeAll();
      }
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
      if (cache) {
        cache.removeAll();
      }
    });

    describe('getKPIs', function() {
      it('should return cached data when available', function() {
        var cacheKey = 'kpis_' + mockUserId;
        cache.put(cacheKey, mockKPIData);

        var result;
        DashboardService.getKPIs(mockUserId).then(function(data) {
          result = data;
        });

        expect(result).toEqual(mockKPIData);
      });

      it('should make HTTP request when cache is empty', function() {
        $httpBackend.expectGET(API_BASE + '/kpis?userId=' + mockUserId)
          .respond(200, mockKPIData);

        var result;
        DashboardService.getKPIs(mockUserId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockKPIData);
      });

      it('should cache data after successful HTTP request', function() {
        $httpBackend.expectGET(API_BASE + '/kpis?userId=' + mockUserId)
          .respond(200, mockKPIData);

        DashboardService.getKPIs(mockUserId);
        $httpBackend.flush();

        var cachedData = cache.get('kpis_' + mockUserId);
        expect(cachedData).toEqual(mockKPIData);
      });

      it('should reject promise when HTTP request fails', function() {
        $httpBackend.expectGET(API_BASE + '/kpis?userId=' + mockUserId)
          .respond(500, 'Internal Server Error');

        var error;
        DashboardService.getKPIs(mockUserId).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(500);
      });

      it('should handle network errors gracefully', function() {
        $httpBackend.expectGET(API_BASE + '/kpis?userId=' + mockUserId)
          .respond(0, '');

        var error;
        DashboardService.getKPIs(mockUserId).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
      });

      it('should handle 404 errors', function() {
        $httpBackend.expectGET(API_BASE + '/kpis?userId=' + mockUserId)
          .respond(404, 'Not Found');

        var error;
        DashboardService.getKPIs(mockUserId).catch(function(err) {
          error = err;
        });

        $httpBackend.flush();

        expect(error).toBeDefined();
        expect(error.status).toBe(404);
      });
    });

    describe('mockGetKPIs', function() {
      it('should return complete KPI data structure', function() {
        var result;
        DashboardService.mockGetKPIs(mockUserId).then(function(data) {
          result = data;
        });

        expect(result).toBeDefined();
        expect(result.userId).toBe(mockUserId);
        expect(result.monthlySpend).toBeDefined();
        expect(result.totalCreditLimit).toBeDefined();
        expect(result.availableCredit).toBeDefined();
        expect(result.outstandingAmount).toBeDefined();
        expect(result.creditCards).toBeDefined();
        expect(result.lastUpdated).toBeDefined();
      });

      it('should return all four KPI metrics', function() {
        var result;
        DashboardService.mockGetKPIs(mockUserId).then(function(data) {
          result = data;
        });

        expect(result.monthlySpend).toBe(12450.75);
        expect(result.totalCreditLimit).toBe(50000);
        expect(result.availableCredit).toBe(37549.25);
        expect(result.outstandingAmount).toBe(12450.75);
      });

      it('should return three credit cards', function() {
        var result;
        DashboardService.mockGetKPIs(mockUserId).then(function(data) {
          result = data;
        });

        expect(result.creditCards.length).toBe(3);
      });

      it('should return credit cards with complete information', function() {
        var result;
        DashboardService.mockGetKPIs(mockUserId).then(function(data) {
          result = data;
        });

        result.creditCards.forEach(function(card) {
          expect(card.cardId).toBeDefined();
          expect(card.cardName).toBeDefined();
          expect(card.cardNumber).toBeDefined();
          expect(card.creditLimit).toBeDefined();
          expect(card.availableCredit).toBeDefined();
          expect(card.outstandingAmount).toBeDefined();
          expect(card.monthlySpend).toBeDefined();
        });
      });

      it('should return masked card numbers', function() {
        var result;
        DashboardService.mockGetKPIs(mockUserId).then(function(data) {
          result = data;
        });

        result.creditCards.forEach(function(card) {
          expect(card.cardNumber).toContain('****');
        });
      });

      it('should return valid numeric KPI values', function() {
        var result;
        DashboardService.mockGetKPIs(mockUserId).then(function(data) {
          result = data;
        });

        expect(typeof result.monthlySpend).toBe('number');
        expect(typeof result.totalCreditLimit).toBe('number');
        expect(typeof result.availableCredit).toBe('number');
        expect(typeof result.outstandingAmount).toBe('number');
      });

      it('should return valid date for lastUpdated', function() {
        var result;
        DashboardService.mockGetKPIs(mockUserId).then(function(data) {
          result = data;
        });

        expect(result.lastUpdated instanceof Date).toBe(true);
      });

      it('should calculate available credit correctly', function() {
        var result;
        DashboardService.mockGetKPIs(mockUserId).then(function(data) {
          result = data;
        });

        var expectedAvailableCredit = result.totalCreditLimit - result.outstandingAmount;
        expect(result.availableCredit).toBe(expectedAvailableCredit);
      });

      it('should return Visa Platinum card', function() {
        var result;
        DashboardService.mockGetKPIs(mockUserId).then(function(data) {
          result = data;
        });

        var visaCard = result.creditCards.find(function(card) {
          return card.cardName === 'Visa Platinum';
        });
        expect(visaCard).toBeDefined();
        expect(visaCard.cardId).toBe('card001');
      });

      it('should return MasterCard Gold card', function() {
        var result;
        DashboardService.mockGetKPIs(mockUserId).then(function(data) {
          result = data;
        });

        var masterCard = result.creditCards.find(function(card) {
          return card.cardName === 'MasterCard Gold';
        });
        expect(masterCard).toBeDefined();
        expect(masterCard.cardId).toBe('card002');
      });

      it('should return Amex Blue card', function() {
        var result;
        DashboardService.mockGetKPIs(mockUserId).then(function(data) {
          result = data;
        });

        var amexCard = result.creditCards.find(function(card) {
          return card.cardName === 'Amex Blue';
        });
        expect(amexCard).toBeDefined();
        expect(amexCard.cardId).toBe('card003');
      });
    });
  });
})();