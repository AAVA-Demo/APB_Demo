/*
Test Documentation:
- Test Name: CategoryService classification and category management
- Purpose: Validates transaction classification, category retrieval, and color mapping
- Scenario: Test category classification, category list retrieval, and color assignment
- Expected Result: Service should properly classify transactions and provide category metadata
*/
/*
Coverage Report:
- Functions tested: classifyTransactions, getCategories, getCategoryColor
- Scenarios covered: transaction classification, category list retrieval, color mapping, invalid category
- Dependencies mocked: none (pure service)
- Uncovered scenarios: none
*/

describe('CategoryService', function() {
  'use strict';
  
  beforeEach(module('creditCard.analytics'));
  
  var service;
  
  beforeEach(inject(function(_CategoryService_) {
    service = _CategoryService_;
  }));
  
  it('should be defined', function() {
    expect(service).toBeDefined();
  });
  
  it('should have all required methods', function() {
    expect(service.classifyTransactions).toBeDefined();
    expect(service.getCategories).toBeDefined();
    expect(service.getCategoryColor).toBeDefined();
  });
  
  it('should return transactions as-is when classifying', function() {
    var transactions = [
      { id: '1', amount: 1000, category: 'Food & Dining' },
      { id: '2', amount: 2000, category: 'Fuel' }
    ];
    
    var result = service.classifyTransactions(transactions);
    
    expect(result).toEqual(transactions);
  });
  
  it('should return all 9 categories', function() {
    var categories = service.getCategories();
    
    expect(categories.length).toBe(9);
    expect(categories[0]).toHaveProperty('name');
    expect(categories[0]).toHaveProperty('color');
  });
  
  it('should include all required category names', function() {
    var categories = service.getCategories();
    var categoryNames = categories.map(function(c) { return c.name; });
    
    expect(categoryNames).toContain('Food & Dining');
    expect(categoryNames).toContain('Fuel');
    expect(categoryNames).toContain('Shopping');
    expect(categoryNames).toContain('Travel');
    expect(categoryNames).toContain('Entertainment');
    expect(categoryNames).toContain('Utilities');
    expect(categoryNames).toContain('Healthcare');
    expect(categoryNames).toContain('Education');
    expect(categoryNames).toContain('Miscellaneous');
  });
  
  it('should return correct color for valid category', function() {
    var color = service.getCategoryColor('Food & Dining');
    
    expect(color).toBe('#FF6384');
  });
  
  it('should return default color for invalid category', function() {
    var color = service.getCategoryColor('Invalid Category');
    
    expect(color).toBe('#999999');
  });
  
  it('should return different colors for different categories', function() {
    var color1 = service.getCategoryColor('Food & Dining');
    var color2 = service.getCategoryColor('Fuel');
    
    expect(color1).not.toBe(color2);
  });
  
  it('should handle null or undefined category name', function() {
    var colorNull = service.getCategoryColor(null);
    var colorUndefined = service.getCategoryColor(undefined);
    
    expect(colorNull).toBe('#999999');
    expect(colorUndefined).toBe('#999999');
  });
});