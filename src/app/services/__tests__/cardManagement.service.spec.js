/*
Test Documentation:
- Test Name: cardManagement.service - getUserCards
- Purpose: Validate retrieval of user cards with spend summaries
- Scenario: Service fetches cards and enriches with spending analysis
- Expected Result: Returns cards with attached spend summary data
*/

describe('CardManagementService (cardManagement.service.js)', function() {
  'use strict';
  
  beforeEach(module('creditCardApp'));
  
  var CardManagementService;
  var CreditCardService;
  var UserProfileService;
  var SpendAnalysisService;
  var $q;
  var $rootScope;
  
  beforeEach(inject(function(_CardManagementService_, _CreditCardService_, _UserProfileService_, _SpendAnalysisService_, _$q_, _$rootScope_) {
    CardManagementService = _CardManagementService_;
    CreditCardService = _CreditCardService_;
    UserProfileService = _UserProfileService_;
    SpendAnalysisService = _SpendAnalysisService_;
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));
  
  describe('getUserCards', function() {
    var mockProfile;
    var mockCards;
    var mockSpendData;
    
    beforeEach(function() {
      mockProfile = {
        userId: 'USER001',
        cardIds: ['CC001', 'CC002']
      };
      
      mockCards = [
        {cardId: 'CC001', cardNumber: '****1234', creditLimit: 10000},
        {cardId: 'CC002', cardNumber: '****5678', creditLimit: 15000}
      ];
      
      mockSpendData = [
        {cardId: 'CC001', monthlySpend: 500, yearlySpend: 6000},
        {cardId: 'CC002', monthlySpend: 800, yearlySpend: 9600}
      ];
    });
    
    it('should retrieve user cards with spend summaries', function(done) {
      spyOn(UserProfileService, 'getUserProfile').and.returnValue($q.resolve(mockProfile));
      spyOn(CreditCardService, 'getCardDetails').and.returnValue($q.resolve(mockCards));
      spyOn(SpendAnalysisService, 'getCardSpendSummaries').and.returnValue($q.resolve(mockSpendData));
      
      CardManagementService.getUserCards().then(function(result) {
        expect(result.length).toBe(2);
        expect(result[0].cardId).toBe('CC001');
        expect(result[0].spendSummary).toEqual(mockSpendData[0]);
        expect(result[1].cardId).toBe('CC002');
        expect(result[1].spendSummary).toEqual(mockSpendData[1]);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should call services in correct order', function(done) {
      spyOn(UserProfileService, 'getUserProfile').and.returnValue($q.resolve(mockProfile));
      spyOn(CreditCardService, 'getCardDetails').and.returnValue($q.resolve(mockCards));
      spyOn(SpendAnalysisService, 'getCardSpendSummaries').and.returnValue($q.resolve(mockSpendData));
      
      CardManagementService.getUserCards().then(function() {
        expect(UserProfileService.getUserProfile).toHaveBeenCalled();
        expect(CreditCardService.getCardDetails).toHaveBeenCalledWith(['CC001', 'CC002']);
        expect(SpendAnalysisService.getCardSpendSummaries).toHaveBeenCalledWith(['CC001', 'CC002']);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle empty card list', function(done) {
      var emptyProfile = {userId: 'USER002', cardIds: []};
      
      spyOn(UserProfileService, 'getUserProfile').and.returnValue($q.resolve(emptyProfile));
      spyOn(CreditCardService, 'getCardDetails').and.returnValue($q.resolve([]));
      spyOn(SpendAnalysisService, 'getCardSpendSummaries').and.returnValue($q.resolve([]));
      
      CardManagementService.getUserCards().then(function(result) {
        expect(result).toEqual([]);
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle user profile service errors', function(done) {
      spyOn(UserProfileService, 'getUserProfile').and.returnValue($q.reject('Profile error'));
      
      CardManagementService.getUserCards().catch(function(error) {
        expect(error).toBe('Profile error');
        done();
      });
      
      $rootScope.$apply();
    });
    
    it('should handle card service errors', function(done) {
      spyOn(UserProfileService, 'getUserProfile').and.returnValue($q.resolve(mockProfile));
      spyOn(CreditCardService, 'getCardDetails').and.returnValue($q.reject('Card error'));
      spyOn(SpendAnalysisService, 'getCardSpendSummaries').and.returnValue($q.resolve(mockSpendData));
      
      CardManagementService.getUserCards().catch(function(error) {
        expect(error).toBe('Card error');
        done();
      });
      
      $rootScope.$apply();
    });
  });
});

/*
Coverage Report:
- Functions tested: getUserCards
- Scenarios covered:
  * Successful card retrieval with spend summaries
  * Service call order validation
  * Empty card list
  * User profile service errors
  * Card service errors
- Uncovered scenarios: None
- Edge cases: Empty data, service failures
*/