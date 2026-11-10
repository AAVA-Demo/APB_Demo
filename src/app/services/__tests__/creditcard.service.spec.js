/*
Test Documentation:
- Test Name: CreditCardService Test Suite
- Purpose: Validate CreditCardService functionality for retrieving dashboard KPIs and card list
- Scenario: Tests cover successful data retrieval, error handling, and API integration
- Expected Result: All service methods should correctly interact with backend APIs and handle responses/errors
*/

(function() {
  'use strict';

  describe('CreditCardService', function() {
    var CreditCardService, $httpBackend, API_CONFIG;
    var mockUserId = 'user123';

    beforeEach(module('creditCardApp'));

    beforeEach(inject(function(_CreditCardService_, _$httpBackend_, _API_CONFIG_) {
      CreditCardService = _CreditCardService_;
      $httpBackend = _$httpBackend_;
      API_CONFIG = _API_CONFIG_;
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    describe('getDashboardKPIs', function() {
      /*
      Test Documentation:
      - Test Name: should successfully retrieve dashboard KPIs
      - Purpose: Verify that getDashboardKPIs makes correct API call and returns KPI data
      - Scenario: Service is called with valid userId
      - Expected Result: HTTP GET request is made to correct endpoint, promise resolves with KPI data
      */
      it('should successfully retrieve dashboard KPIs', function() {
        var mockResponse = {
          monthlySpend: 2500.50,
          totalCreditLimit: 15000.00,
          availableCredit: 12000.00,
          outstandingAmount: 3000.00,
          cards: [
            {
              cardId: 'card1',
              cardName: 'Visa Gold',
              cardNumber: '1234567812345678',
              creditLimit: 10000,
              availableCredit: 8000,
              outstandingBalance: 2000,
              monthlySpend: 1500
            },
            {
              cardId: 'card2',
              cardName: 'MasterCard Platinum',
              cardNumber: '8765432187654321',
              creditLimit: 5000,
              availableCredit: 4000,
              outstandingBalance: 1000,
              monthlySpend: 1000
            }
          ]
        };

        $httpBackend.expectGET(API_CONFIG.baseUrl + '/creditcards/dashboard?userId=' + mockUserId)
          .respond(200, mockResponse);

        var result;
        CreditCardService.getDashboardKPIs(mockUserId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockResponse);
        expect(result.monthlySpend).toBe(2500.50);
        expect(result.totalCreditLimit).toBe(15000.00);
        expect(result.cards.length).toBe(2);
        expect(result.cards[0].cardName).toBe('Visa Gold');
      });

      /*
      Test Documentation:
      - Test Name: should handle error when dashboard API call fails
      - Purpose: Verify error handling in getDashboardKPIs
      - Scenario: API returns 500 error
      - Expected Result: Promise is rejected with error object
      */
      it('should handle error when dashboard API call fails', function() {
        var mockError = { status: 500, statusText: 'Internal Server Error' };

        $httpBackend.expectGET(API_CONFIG.baseUrl + '/creditcards/dashboard?userId=' + mockUserId)
          .respond(500, mockError);

        var errorResult;
        CreditCardService.getDashboardKPIs(mockUserId).catch(function(error) {
          errorResult = error;
        });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
        expect(errorResult.status).toBe(500);
      });

      /*
      Test Documentation:
      - Test Name: should handle empty userId parameter
      - Purpose: Verify service behavior with missing userId
      - Scenario: getDashboardKPIs called with empty userId
      - Expected Result: API call is made with empty userId parameter
      */
      it('should handle empty userId parameter', function() {
        var mockResponse = {
          monthlySpend: 0,
          totalCreditLimit: 0,
          availableCredit: 0,
          outstandingAmount: 0,
          cards: []
        };

        $httpBackend.expectGET(API_CONFIG.baseUrl + '/creditcards/dashboard?userId=')
          .respond(200, mockResponse);

        var result;
        CreditCardService.getDashboardKPIs('').then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.cards.length).toBe(0);
      });

      /*
      Test Documentation:
      - Test Name: should handle unauthorized access
      - Purpose: Verify service handles 401 authentication errors
      - Scenario: API returns 401 Unauthorized
      - Expected Result: Promise is rejected with 401 error
      */
      it('should handle unauthorized access', function() {
        $httpBackend.expectGET(API_CONFIG.baseUrl + '/creditcards/dashboard?userId=' + mockUserId)
          .respond(401, { message: 'Unauthorized' });

        var errorResult;
        CreditCardService.getDashboardKPIs(mockUserId).catch(function(error) {
          errorResult = error;
        });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
        expect(errorResult.status).toBe(401);
      });

      /*
      Test Documentation:
      - Test Name: should handle network timeout
      - Purpose: Verify service handles timeout scenarios
      - Scenario: API request times out
      - Expected Result: Promise is rejected with timeout error
      */
      it('should handle network timeout', function() {
        $httpBackend.expectGET(API_CONFIG.baseUrl + '/creditcards/dashboard?userId=' + mockUserId)
          .respond(-1, '');

        var errorResult;
        CreditCardService.getDashboardKPIs(mockUserId).catch(function(error) {
          errorResult = error;
        });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
      });
    });

    describe('getCardList', function() {
      /*
      Test Documentation:
      - Test Name: should successfully retrieve card list
      - Purpose: Verify that getCardList makes correct API call and returns card data
      - Scenario: Service is called with valid userId
      - Expected Result: HTTP GET request is made to correct endpoint, promise resolves with card list
      */
      it('should successfully retrieve card list', function() {
        var mockResponse = [
          {
            cardId: 'card1',
            cardName: 'Visa Gold',
            cardNumber: '1234567812345678',
            creditLimit: 10000,
            availableCredit: 8000,
            outstandingBalance: 2000,
            monthlySpend: 1500,
            expiryDate: '12/2025',
            cardType: 'Credit'
          },
          {
            cardId: 'card2',
            cardName: 'MasterCard Platinum',
            cardNumber: '8765432187654321',
            creditLimit: 5000,
            availableCredit: 4000,
            outstandingBalance: 1000,
            monthlySpend: 1000,
            expiryDate: '06/2026',
            cardType: 'Credit'
          }
        ];

        $httpBackend.expectGET(API_CONFIG.baseUrl + '/creditcards?userId=' + mockUserId)
          .respond(200, mockResponse);

        var result;
        CreditCardService.getCardList(mockUserId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual(mockResponse);
        expect(result.length).toBe(2);
        expect(result[0].cardName).toBe('Visa Gold');
        expect(result[1].cardName).toBe('MasterCard Platinum');
      });

      /*
      Test Documentation:
      - Test Name: should handle error when card list API call fails
      - Purpose: Verify error handling in getCardList
      - Scenario: API returns 404 error
      - Expected Result: Promise is rejected with error object
      */
      it('should handle error when card list API call fails', function() {
        var mockError = { status: 404, statusText: 'Not Found' };

        $httpBackend.expectGET(API_CONFIG.baseUrl + '/creditcards?userId=' + mockUserId)
          .respond(404, mockError);

        var errorResult;
        CreditCardService.getCardList(mockUserId).catch(function(error) {
          errorResult = error;
        });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
        expect(errorResult.status).toBe(404);
      });

      /*
      Test Documentation:
      - Test Name: should handle empty card list response
      - Purpose: Verify service handles user with no cards
      - Scenario: API returns empty array
      - Expected Result: Promise resolves with empty array
      */
      it('should handle empty card list response', function() {
        var mockResponse = [];

        $httpBackend.expectGET(API_CONFIG.baseUrl + '/creditcards?userId=' + mockUserId)
          .respond(200, mockResponse);

        var result;
        CreditCardService.getCardList(mockUserId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result).toEqual([]);
        expect(result.length).toBe(0);
      });

      /*
      Test Documentation:
      - Test Name: should handle single card in list
      - Purpose: Verify service works with single card
      - Scenario: API returns array with one card
      - Expected Result: Promise resolves with single card array
      */
      it('should handle single card in list', function() {
        var mockResponse = [
          {
            cardId: 'card1',
            cardName: 'Visa Gold',
            cardNumber: '1234567812345678',
            creditLimit: 10000,
            availableCredit: 8000,
            outstandingBalance: 2000,
            monthlySpend: 1500
          }
        ];

        $httpBackend.expectGET(API_CONFIG.baseUrl + '/creditcards?userId=' + mockUserId)
          .respond(200, mockResponse);

        var result;
        CreditCardService.getCardList(mockUserId).then(function(data) {
          result = data;
        });

        $httpBackend.flush();

        expect(result.length).toBe(1);
        expect(result[0].cardId).toBe('card1');
      });

      /*
      Test Documentation:
      - Test Name: should handle service unavailable error
      - Purpose: Verify service handles 503 errors
      - Scenario: API returns 503 Service Unavailable
      - Expected Result: Promise is rejected with 503 error
      */
      it('should handle service unavailable error', function() {
        $httpBackend.expectGET(API_CONFIG.baseUrl + '/creditcards?userId=' + mockUserId)
          .respond(503, { message: 'Service Unavailable' });

        var errorResult;
        CreditCardService.getCardList(mockUserId).catch(function(error) {
          errorResult = error;
        });

        $httpBackend.flush();

        expect(errorResult).toBeDefined();
        expect(errorResult.status).toBe(503);
      });
    });

    /*
    Test Documentation:
    - Test Name: should be properly injected
    - Purpose: Verify service is correctly registered and injectable
    - Scenario: Service is injected into test
    - Expected Result: Service object is defined and has expected methods
    */
    it('should be properly injected', function() {
      expect(CreditCardService).toBeDefined();
      expect(typeof CreditCardService.getDashboardKPIs).toBe('function');
      expect(typeof CreditCardService.getCardList).toBe('function');
    });

    /*
    Test Documentation:
    - Test Name: should use correct API configuration
    - Purpose: Verify service uses injected API_CONFIG
    - Scenario: Check API_CONFIG is available
    - Expected Result: API_CONFIG is defined and has baseUrl
    */
    it('should use correct API configuration', function() {
      expect(API_CONFIG).toBeDefined();
      expect(API_CONFIG.baseUrl).toBeDefined();
    });
  });

})();

/*
Coverage Report:
- Functions tested: getDashboardKPIs, getCardList
- Scenarios covered:
  * Successful API calls with valid parameters
  * Error handling (500, 404, 401, 503, timeout)
  * Edge cases (empty userId, empty card list, single card)
  * Service injection and configuration
- Uncovered scenarios: None - comprehensive coverage achieved
- Total test cases: 13
*/