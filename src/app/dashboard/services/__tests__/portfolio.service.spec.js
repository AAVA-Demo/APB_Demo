/*
Test Documentation:
- Test Name: PortfolioService - getPortfolio success
- Purpose: Validates successful portfolio data retrieval
- Scenario: HTTP call succeeds
- Expected Result: Returns portfolio data
*/
/*
Test Documentation:
- Test Name: PortfolioService - getPortfolio error
- Purpose: Validates error handling
- Scenario: HTTP call fails
- Expected Result: Promise is rejected
*/
/*
Coverage Report:
- Functions tested: getPortfolio
- Scenarios covered: success, error
- Uncovered scenarios: none
*/

describe('PortfolioService', function() {
  'use strict';
  
  beforeEach(module('dashboardModule'));
  
  var PortfolioService, $httpBackend;
  var mockResponse = {
    cards: [
      { cardId: '1', cardName: 'Visa Platinum', creditLimit: 50000 },
      { cardId: '2', cardName: 'MasterCard Gold', creditLimit: 30000 }
    ]
  };
  
  beforeEach(inject(function(_PortfolioService_, _$httpBackend_) {
    PortfolioService = _PortfolioService_;
    $httpBackend = _$httpBackend_;
  }));
  
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
  describe('getPortfolio', function() {
    it('should fetch portfolio data successfully', function() {
      $httpBackend.expectGET('/api/portfolio').respond(200, mockResponse);
      
      var result;
      PortfolioService.getPortfolio().then(function(data) {
        result = data;
      });
      
      $httpBackend.flush();
      
      expect(result).toEqual(mockResponse);
      expect(result.cards.length).toBe(2);
    });
    
    it('should handle HTTP errors', function() {
      $httpBackend.expectGET('/api/portfolio').respond(500, 'Server Error');
      
      var rejected = false;
      PortfolioService.getPortfolio().catch(function() {
        rejected = true;
      });
      
      $httpBackend.flush();
      
      expect(rejected).toBe(true);
    });
    
    it('should handle network errors', function() {
      $httpBackend.expectGET('/api/portfolio').respond(0, '');
      
      var rejected = false;
      PortfolioService.getPortfolio().catch(function() {
        rejected = true;
      });
      
      $httpBackend.flush();
      
      expect(rejected).toBe(true);
    });
  });
});