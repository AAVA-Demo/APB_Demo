/*
Test Documentation:
- Test Name: KpiFactory
- Purpose: Verify KPI model creation and value formatting
- Scenario: Create KPI models with various data inputs
- Expected Result: Factory should create properly formatted KPI objects
*/

describe('KpiFactory', function() {
  'use strict';

  var KpiFactory;

  beforeEach(module('dashboardModule'));

  beforeEach(inject(function(_KpiFactory_) {
    KpiFactory = _KpiFactory_;
  }));

  /*
  Test Documentation:
  - Test Name: should be defined
  - Purpose: Verify factory exists
  - Scenario: Inject KpiFactory
  - Expected Result: Factory should be defined
  */
  it('should be defined', function() {
    expect(KpiFactory).toBeDefined();
  });

  /*
  Test Documentation:
  - Test Name: should create KPI model with all properties
  - Purpose: Verify complete KPI object creation
  - Scenario: Create KPI with full data
  - Expected Result: All properties should be set correctly
  */
  it('should create KPI model with all properties', function() {
    var data = {
      label: 'Monthly Spend',
      value: 1500.50,
      trend: 'up',
      trendPercentage: 5.2,
      icon: 'glyphicon-credit-card'
    };
    var kpi = KpiFactory.create(data);

    expect(kpi.label).toBe('Monthly Spend');
    expect(kpi.value).toBe(1500.50);
    expect(kpi.trend).toBe('up');
    expect(kpi.trendPercentage).toBe(5.2);
    expect(kpi.icon).toBe('glyphicon-credit-card');
  });

  /*
  Test Documentation:
  - Test Name: should format numeric value as currency
  - Purpose: Verify value formatting with currency symbol and commas
  - Scenario: Create KPI with numeric value
  - Expected Result: formattedValue should have $ and comma separators
  */
  it('should format numeric value as currency', function() {
    var kpi = KpiFactory.create({ value: 12345.67 });
    expect(kpi.formattedValue).toBe('$12,345.67');
  });

  /*
  Test Documentation:
  - Test Name: should handle zero value
  - Purpose: Verify zero value formatting
  - Scenario: Create KPI with zero value
  - Expected Result: formattedValue should be $0.00
  */
  it('should handle zero value', function() {
    var kpi = KpiFactory.create({ value: 0 });
    expect(kpi.formattedValue).toBe('$0.00');
  });

  /*
  Test Documentation:
  - Test Name: should use default values for missing properties
  - Purpose: Verify default values are applied
  - Scenario: Create KPI with empty data
  - Expected Result: All properties should have default values
  */
  it('should use default values for missing properties', function() {
    var kpi = KpiFactory.create({});

    expect(kpi.label).toBe('');
    expect(kpi.value).toBe(0);
    expect(kpi.trend).toBe('neutral');
    expect(kpi.trendPercentage).toBe(0);
    expect(kpi.icon).toBe('');
  });

  /*
  Test Documentation:
  - Test Name: should handle large numbers with proper formatting
  - Purpose: Verify formatting for large values
  - Scenario: Create KPI with value over 1 million
  - Expected Result: formattedValue should have multiple comma separators
  */
  it('should handle large numbers with proper formatting', function() {
    var kpi = KpiFactory.create({ value: 1234567.89 });
    expect(kpi.formattedValue).toBe('$1,234,567.89');
  });

  /*
  Test Documentation:
  - Test Name: should handle non-numeric value
  - Purpose: Verify behavior with non-numeric input
  - Scenario: Create KPI with string value
  - Expected Result: formattedValue should return the value as-is
  */
  it('should handle non-numeric value', function() {
    var kpi = KpiFactory.create({ value: 'N/A' });
    expect(kpi.formattedValue).toBe('N/A');
  });
});

/*
Coverage Report:
- Functions tested: create, formatValue
- Scenarios covered: complete object creation, currency formatting, default values, edge cases (zero, large numbers, non-numeric)
- Uncovered scenarios: none
*/