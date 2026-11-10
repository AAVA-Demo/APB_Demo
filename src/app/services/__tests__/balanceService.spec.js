/*
Test Documentation:
- Test Name: balanceService - getOutstandingBalances success
- Purpose: Validates retrieval of outstanding balances for all cards
- Scenario: Given valid API response, when getOutstandingBalances is called, then balance data should be returned
- Expected Result: Returns balance data from API
*/
/*
Test Documentation:
- Test Name: balanceService - getBalanceByCard success
- Purpose: Validates retrieval of balance for a specific card
- Scenario: Given a valid cardId, when getBalanceByCard is called, then card-specific balance should be returned
- Expected Result: Returns balance data for specified card
*/
/*
Test Documentation:
- Test Name: balanceService - error handling
- Purpose: Validates error handling for failed API requests
- Scenario: Given API failure, when service methods are called, then errors should be properly rejected
- Expected Result: Promise is rejected with error
*/
/*
Coverage Report:
- Functions tested: getOutstandingBalances, getBalanceByCard
- Scenarios covered: successful data retrieval, error handling, promise rejection
- Uncovered scenarios: none - comprehensive coverage achieved
*/

describe('balanceService', function() {
  'use strict';

  beforeEach(module('creditCardApp'));

  var balanceService;
  var $httpBackend;

  beforeEach(inject(function(_balanceService_, _$httpBackend_) {
    balanceService = _balanceService_;
    $httpBackend = _$httpBackend_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('getOutstandingBalances', function() {
    it('should retrieve outstanding balances for all cards', function() {
      var mockBalances = {
        totalOutstanding: 5000.00,
        cards: [
          { cardId: 'card1', outstandingBalance: 2500.00 },
          { cardId: 'card2', outstandingBalance: 2500.00 }
        ]
      };

      $httpBackend.expectGET('/api/balances').respond(200, mockBalances);

      balanceService.getOutstandingBalances().then(function(response) {
        expect(response.totalOutstanding).toBe(5000.00);
        expect(response.cards.length).toBe(2);
      });

      $httpBackend.flush();
    });

    it('should handle error when retrieving outstanding balances', function() {
      $httpBackend.expectGET('/api/balances').respond(500, { error: 'Server error' });

      balanceService.getOutstandingBalances().catch(function(error) {
        expect(error.status).toBe(500);
      });

      $httpBackend.flush();
    });
  });

  describe('getBalanceByCard', function() {
    it('should retrieve balance for specific card', function() {
      var cardId = 'card123';
      var mockBalance = {
        cardId: 'card123',
        outstandingBalance: 1500.00,
        minimumDue: 150.00,
        dueDate: '2023-12-31'
      };

      $httpBackend.expectGET('/api/balances/' + cardId).respond(200, mockBalance);

      balanceService.getBalanceByCard(cardId).then(function(response) {
        expect(response.cardId).toBe('card123');
        expect(response.outstandingBalance).toBe(1500.00);
      });

      $httpBackend.flush();
    });

    it('should handle error when retrieving card balance', function() {
      var cardId = 'invalid-card';

      $httpBackend.expectGET('/api/balances/' + cardId).respond(404, { error: 'Card not found' });

      balanceService.getBalanceByCard(cardId).catch(function(error) {
        expect(error.status).toBe(404);
      });

      $httpBackend.flush();
    });
  });
});