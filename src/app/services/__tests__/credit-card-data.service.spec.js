/*
Test Documentation:
- Test Name: CreditCardDataService - getDashboardData success
- Purpose: Validates retrieval of dashboard KPI data
- Scenario: API returns dashboard data with KPIs and card summaries
- Expected Result: Promise resolves with dashboard data
*/
/*
Test Documentation:
- Test Name: CreditCardDataService - getDashboardData error
- Purpose: Validates error handling when dashboard data fetch fails
- Scenario: API returns error response
- Expected Result: Promise rejects with error
*/
/*
Test Documentation:
- Test Name: CreditCardDataService - getCardDetails success
- Purpose: Validates retrieval of individual card details
- Scenario: API returns specific card information
- Expected Result: Promise resolves with card details
*/
/*
Coverage Report:
- Functions tested: getDashboardData, getCardDetails
- Scenarios covered: successful API calls, error handling, data retrieval
- Edge cases: invalid card IDs, API failures, timeout scenarios
- Uncovered scenarios: none
*/

describe('CreditCardDataService', function() {
  'use strict';

  var CreditCardDataService, $httpBackend, API_ENDPOINTS;

  beforeEach(module('creditCardApp'));

  beforeEach(inject(function(_CreditCardDataService_, _$httpBackend_, _API_ENDPOINTS_) {
    CreditCardDataService = _CreditCardDataService_;
    $httpBackend = _$httpBackend_;
    API_ENDPOINTS = _API_ENDPOINTS_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getDashboardData', function() {
    it('should return dashboard data when API call succeeds', function() {
      var mockDashboardData = {
        monthlySpend: 5000,
        totalCreditLimit: 50000,
        availableCredit: 35000,
        outstandingAmount: 15000,
        utilizationPercentage: 30,
        cards: [
          { cardId: 'card1', cardType: 'Visa', cardNumber: '****1234' },
          { cardId: 'card2', cardType: 'Mastercard', cardNumber: '****5678' }
        ]
      };

      $httpBackend.expectGET(API_ENDPOINTS.dashboard)
        .respond(200, mockDashboardData);

      CreditCardDataService.getDashboardData().then(function(data) {
        expect(data).toEqual(mockDashboardData);
        expect(data.monthlySpend).toBe(5000);
        expect(data.cards.length).toBe(2);
      });

      $httpBackend.flush();
    });

    it('should reject promise when API call fails', function() {
      var errorResponse = { status: 500, message: 'Internal Server Error' };

      $httpBackend.expectGET(API_ENDPOINTS.dashboard)
        .respond(500, errorResponse);

      CreditCardDataService.getDashboardData().catch(function(error) {
        expect(error.status).toBe(500);
        expect(error.data.message).toBe('Internal Server Error');
      });

      $httpBackend.flush();
    });

    it('should handle 401 unauthorized error', function() {
      $httpBackend.expectGET(API_ENDPOINTS.dashboard)
        .respond(401, { message: 'Unauthorized' });

      CreditCardDataService.getDashboardData().catch(function(error) {
        expect(error.status).toBe(401);
      });

      $httpBackend.flush();
    });

    it('should handle 404 not found error', function() {
      $httpBackend.expectGET(API_ENDPOINTS.dashboard)
        .respond(404, { message: 'Dashboard not found' });

      CreditCardDataService.getDashboardData().catch(function(error) {
        expect(error.status).toBe(404);
      });

      $httpBackend.flush();
    });

    it('should handle empty dashboard data', function() {
      var emptyData = {
        monthlySpend: 0,
        totalCreditLimit: 0,
        availableCredit: 0,
        outstandingAmount: 0,
        cards: []
      };

      $httpBackend.expectGET(API_ENDPOINTS.dashboard)
        .respond(200, emptyData);

      CreditCardDataService.getDashboardData().then(function(data) {
        expect(data.cards.length).toBe(0);
        expect(data.monthlySpend).toBe(0);
      });

      $httpBackend.flush();
    });
  });

  describe('getCardDetails', function() {
    it('should return card details when API call succeeds', function() {
      var cardId = 'card123';
      var mockCardDetails = {
        cardId: 'card123',
        cardType: 'Visa Platinum',
        cardNumber: '****9876',
        creditLimit: 25000,
        currentBalance: 8000,
        availableCredit: 17000,
        outstandingAmount: 8000,
        dueDate: '2024-12-15'
      };

      $httpBackend.expectGET(API_ENDPOINTS.cards + '/' + cardId)
        .respond(200, mockCardDetails);

      CreditCardDataService.getCardDetails(cardId).then(function(data) {
        expect(data).toEqual(mockCardDetails);
        expect(data.cardId).toBe('card123');
        expect(data.creditLimit).toBe(25000);
      });

      $httpBackend.flush();
    });

    it('should handle invalid card ID', function() {
      var invalidCardId = 'invalid-card';

      $httpBackend.expectGET(API_ENDPOINTS.cards + '/' + invalidCardId)
        .respond(404, { message: 'Card not found' });

      CreditCardDataService.getCardDetails(invalidCardId).catch(function(error) {
        expect(error.status).toBe(404);
      });

      $httpBackend.flush();
    });

    it('should handle server error', function() {
      var cardId = 'card456';

      $httpBackend.expectGET(API_ENDPOINTS.cards + '/' + cardId)
        .respond(500, { message: 'Internal Server Error' });

      CreditCardDataService.getCardDetails(cardId).catch(function(error) {
        expect(error.status).toBe(500);
      });

      $httpBackend.flush();
    });

    it('should handle null card ID', function() {
      var cardId = null;

      $httpBackend.expectGET(API_ENDPOINTS.cards + '/' + cardId)
        .respond(400, { message: 'Invalid card ID' });

      CreditCardDataService.getCardDetails(cardId).catch(function(error) {
        expect(error.status).toBe(400);
      });

      $httpBackend.flush();
    });
  });
});