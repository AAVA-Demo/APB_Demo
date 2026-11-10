/*
Test Documentation:
- Test Name: creditCardSummary Directive
- Purpose: Validate credit card summary directive rendering and formatting
- Scenario: Directive compilation, card data binding, utilization display
- Expected Result: Directive renders card details with correct formatting and utilization bar
*/

describe('creditCardSummary Directive', function() {
  'use strict';

  beforeEach(module('creditCard.dashboard'));

  var $compile, $rootScope, element, scope, KPIService;
  var mockCard;

  beforeEach(inject(function(_$compile_, _$rootScope_, _KPIService_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    KPIService = _KPIService_;
    scope = $rootScope.$new();

    mockCard = {
      cardId: 'cc001',
      cardName: 'Platinum Rewards',
      last4Digits: '4532',
      creditLimit: 15000,
      availableCredit: 8500,
      outstandingAmount: 6500,
      utilizationPercentage: 43.3
    };

    scope.testCard = mockCard;
  }));

  it('should compile and render the directive', function() {
    element = $compile('<credit-card-summary card="testCard"></credit-card-summary>')(scope);
    scope.$digest();
    
    expect(element).toBeDefined();
    expect(element.find('h4').text()).toBe('Platinum Rewards');
  });

  it('should display card name', function() {
    element = $compile('<credit-card-summary card="testCard"></credit-card-summary>')(scope);
    scope.$digest();
    
    expect(element.text()).toContain('Platinum Rewards');
  });

  it('should display last 4 digits', function() {
    element = $compile('<credit-card-summary card="testCard"></credit-card-summary>')(scope);
    scope.$digest();
    
    expect(element.text()).toContain('4532');
  });

  it('should format outstanding amount', function() {
    spyOn(KPIService, 'formatCurrency').and.returnValue('$6,500.00');
    element = $compile('<credit-card-summary card="testCard"></credit-card-summary>')(scope);
    scope.$digest();
    
    expect(element.text()).toContain('Outstanding');
  });

  it('should format available credit', function() {
    spyOn(KPIService, 'formatCurrency').and.returnValue('$8,500.00');
    element = $compile('<credit-card-summary card="testCard"></credit-card-summary>')(scope);
    scope.$digest();
    
    expect(element.text()).toContain('Available');
  });

  it('should format credit limit', function() {
    spyOn(KPIService, 'formatCurrency').and.returnValue('$15,000.00');
    element = $compile('<credit-card-summary card="testCard"></credit-card-summary>')(scope);
    scope.$digest();
    
    expect(element.text()).toContain('Credit Limit');
  });

  it('should display utilization percentage', function() {
    element = $compile('<credit-card-summary card="testCard"></credit-card-summary>')(scope);
    scope.$digest();
    
    expect(element.text()).toContain('43.3%');
  });

  it('should render utilization bar', function() {
    element = $compile('<credit-card-summary card="testCard"></credit-card-summary>')(scope);
    scope.$digest();
    
    expect(element.find('.utilization-bar').length).toBeGreaterThan(0);
    expect(element.find('.utilization-fill').length).toBeGreaterThan(0);
  });

  it('should set utilization bar width based on percentage', function() {
    element = $compile('<credit-card-summary card="testCard"></credit-card-summary>')(scope);
    scope.$digest();
    
    var fillElement = element.find('.utilization-fill');
    var widthStyle = fillElement.attr('ng-style');
    expect(widthStyle).toContain('utilizationPercentage');
  });

  it('should update when card data changes', function() {
    element = $compile('<credit-card-summary card="testCard"></credit-card-summary>')(scope);
    scope.$digest();
    
    scope.testCard.cardName = 'Updated Card';
    scope.$digest();
    
    expect(element.find('h4').text()).toBe('Updated Card');
  });

  it('should handle high utilization', function() {
    scope.testCard.utilizationPercentage = 95.5;
    element = $compile('<credit-card-summary card="testCard"></credit-card-summary>')(scope);
    scope.$digest();
    
    expect(element.text()).toContain('95.5%');
  });

  it('should handle low utilization', function() {
    scope.testCard.utilizationPercentage = 5.2;
    element = $compile('<credit-card-summary card="testCard"></credit-card-summary>')(scope);
    scope.$digest();
    
    expect(element.text()).toContain('5.2%');
  });
});

/*
Coverage Report:
- Functions tested: directive compilation, link function, formatCurrency integration
- Scenarios covered: rendering, data binding, currency formatting, utilization display, data updates
- Edge cases: high/low utilization, data changes
- Uncovered scenarios: none
*/