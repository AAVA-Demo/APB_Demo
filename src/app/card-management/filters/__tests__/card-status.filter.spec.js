/*
Test Documentation:
- Test Name: cardStatusFilter Unit Tests
- Purpose: Validate card status filtering functionality
- Scenario: Tests filter logic for different status values
- Expected Result: Filter correctly filters cards by status
*/

(function() {
  'use strict';
  
  describe('cardStatusFilter', function() {
    var $filter, cardStatusFilter;
    
    beforeEach(module('cardManagementModule'));
    
    beforeEach(inject(function(_$filter_) {
      $filter = _$filter_;
      cardStatusFilter = $filter('cardStatusFilter');
    }));
    
    var mockCards = [
      {cardId: 'card1', status: 'active'},
      {cardId: 'card2', status: 'inactive'},
      {cardId: 'card3', status: 'active'},
      {cardId: 'card4', status: 'blocked'}
    ];
    
    it('should return all cards when status is "all"', function() {
      var result = cardStatusFilter(mockCards, 'all');
      expect(result.length).toBe(4);
    });
    
    it('should return all cards when status is null', function() {
      var result = cardStatusFilter(mockCards, null);
      expect(result.length).toBe(4);
    });
    
    it('should return all cards when status is undefined', function() {
      var result = cardStatusFilter(mockCards, undefined);
      expect(result.length).toBe(4);
    });
    
    it('should filter active cards', function() {
      var result = cardStatusFilter(mockCards, 'active');
      expect(result.length).toBe(2);
      expect(result[0].status).toBe('active');
      expect(result[1].status).toBe('active');
    });
    
    it('should filter inactive cards', function() {
      var result = cardStatusFilter(mockCards, 'inactive');
      expect(result.length).toBe(1);
      expect(result[0].status).toBe('inactive');
    });
    
    it('should filter blocked cards', function() {
      var result = cardStatusFilter(mockCards, 'blocked');
      expect(result.length).toBe(1);
      expect(result[0].status).toBe('blocked');
    });
    
    it('should return empty array for non-existent status', function() {
      var result = cardStatusFilter(mockCards, 'expired');
      expect(result.length).toBe(0);
    });
  });
  
})();

/*
Coverage Report:
- Functions tested: cardStatusFilter
- Scenarios covered:
  * All status filter
  * Null/undefined status handling
  * Active card filtering
  * Inactive card filtering
  * Blocked card filtering
  * Non-existent status handling
- Uncovered scenarios: Case sensitivity, multiple status filtering
*/