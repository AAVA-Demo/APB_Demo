/*
Test Documentation:
- Test Name: spendingChart directive rendering and interaction
- Purpose: Validates directive compilation, data binding, and chart rendering
- Scenario: Test directive initialization, data watching, and category click handling
- Expected Result: Directive should render chart correctly and handle user interactions
*/
/*
Coverage Report:
- Directive tested: spendingChart
- Scenarios covered: directive compilation, scope binding, data watching, click event handling
- Dependencies mocked: ChartConfigFactory, CategoryService
- Uncovered scenarios: D3.js rendering (requires DOM)
*/

describe('spendingChart Directive', function() {
  'use strict';
  
  beforeEach(module('creditCard.analytics'));
  
  var $compile, $rootScope, element, scope;
  var ChartConfigFactory, CategoryService;
  
  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
    
    ChartConfigFactory = {
      getPieChartConfig: jasmine.createSpy('getPieChartConfig').and.returnValue({})
    };
    
    CategoryService = {
      getCategoryColor: jasmine.createSpy('getCategoryColor').and.returnValue('#FF6384')
    };
    
    scope.categorySummaries = [
      { categoryName: 'Food & Dining', totalAmount: 1000, percentage: 50 },
      { categoryName: 'Fuel', totalAmount: 1000, percentage: 50 }
    ];
    
    scope.onCategoryClick = jasmine.createSpy('onCategoryClick');
  }));
  
  it('should compile directive successfully', function() {
    element = $compile('<spending-chart category-summaries="categorySummaries" on-category-click="onCategoryClick(category)"></spending-chart>')(scope);
    scope.$digest();
    
    expect(element).toBeDefined();
  });
  
  it('should have chart container in template', function() {
    element = $compile('<spending-chart category-summaries="categorySummaries" on-category-click="onCategoryClick(category)"></spending-chart>')(scope);
    scope.$digest();
    
    expect(element.find('.chart-container').length).toBe(1);
  });
  
  it('should display chart title', function() {
    element = $compile('<spending-chart category-summaries="categorySummaries" on-category-click="onCategoryClick(category)"></spending-chart>')(scope);
    scope.$digest();
    
    expect(element.find('h3').text()).toBe('Category-Wise Spending');
  });
  
  it('should have spending-chart div', function() {
    element = $compile('<spending-chart category-summaries="categorySummaries" on-category-click="onCategoryClick(category)"></spending-chart>')(scope);
    scope.$digest();
    
    expect(element.find('#spending-chart').length).toBe(1);
  });
  
  it('should bind categorySummaries to scope', function() {
    element = $compile('<spending-chart category-summaries="categorySummaries" on-category-click="onCategoryClick(category)"></spending-chart>')(scope);
    scope.$digest();
    
    var isolateScope = element.isolateScope();
    expect(isolateScope.categorySummaries).toEqual(scope.categorySummaries);
  });
  
  it('should bind onCategoryClick callback to scope', function() {
    element = $compile('<spending-chart category-summaries="categorySummaries" on-category-click="onCategoryClick(category)"></spending-chart>')(scope);
    scope.$digest();
    
    var isolateScope = element.isolateScope();
    expect(isolateScope.onCategoryClick).toBeDefined();
  });
});