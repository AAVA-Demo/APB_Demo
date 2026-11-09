/*
Test Documentation:
- Test Name: TransactionFactory
- Purpose: Verify transaction and spending trend model creation
- Scenario: Create transaction and trend objects
- Expected Result: Factory should create properly structured models
*/

describe('TransactionFactory', function() {
  'use strict';

  var TransactionFactory;

  beforeEach(module('analyticsModule'));

  beforeEach(inject(function(_TransactionFactory_) {
    TransactionFactory = _TransactionFactory_;
  }));

  /*
  Test Documentation:
  - Test Name: should be defined
  - Purpose: Verify factory exists
  - Scenario: Inject TransactionFactory
  - Expected Result: Factory should be defined
  */
  it('should be defined', function() {
    expect(TransactionFactory).toBeDefined();
  });

  /*
  Test Documentation:
  - Test Name: should create transaction with all properties
  - Purpose: Verify complete transaction object creation
  - Scenario: Create transaction with full data
  - Expected Result: All properties should be set correctly
  */
  it('should create transaction with all properties', function() {
    var data = {
      id: 'txn123',
      cardId: 'card456',
      amount: 150.50,
      date: '2024-01-15',
      category: 'Food & Dining',
      merchant: 'Restaurant ABC',
      description: 'Dinner'
    };

    var transaction = TransactionFactory.createTransaction(data);

    expect(transaction.id).toBe('txn123');
    expect(transaction.cardId).toBe('card456');
    expect(transaction.amount).toBe(150.50);
    expect(transaction.date instanceof Date).toBe(true);
    expect(transaction.category).toBe('Food & Dining');
    expect(transaction.merchant).toBe('Restaurant ABC');
    expect(transaction.description).toBe('Dinner');
  });

  /*
  Test Documentation:
  - Test Name: should use default values for missing transaction properties
  - Purpose: Verify default values
  - Scenario: Create transaction with empty data
  - Expected Result: All properties should have defaults
  */
  it('should use default values for missing transaction properties', function() {
    var transaction = TransactionFactory.createTransaction({});

    expect(transaction.id).toBe('');
    expect(transaction.cardId).toBe('');
    expect(transaction.amount).toBe(0);
    expect(transaction.date instanceof Date).toBe(true);
    expect(transaction.category).toBe('Miscellaneous');
    expect(transaction.merchant).toBe('');
    expect(transaction.description).toBe('');
  });

  /*
  Test Documentation:
  - Test Name: should create spending trend with all properties
  - Purpose: Verify spending trend object creation
  - Scenario: Create trend with full data
  - Expected Result: All properties should be set correctly
  */
  it('should create spending trend with all properties', function() {
    var data = {
      month: '2024-01',
      totalSpend: 2500.00,
      categoryBreakdown: {
        'Food & Dining': 500,
        'Fuel': 300
      }
    };

    var trend = TransactionFactory.createSpendingTrend(data);

    expect(trend.month).toBe('2024-01');
    expect(trend.totalSpend).toBe(2500.00);
    expect(trend.categoryBreakdown['Food & Dining']).toBe(500);
  });

  /*
  Test Documentation:
  - Test Name: should use default values for missing trend properties
  - Purpose: Verify default values for trends
  - Scenario: Create trend with empty data
  - Expected Result: All properties should have defaults
  */
  it('should use default values for missing trend properties', function() {
    var trend = TransactionFactory.createSpendingTrend({});

    expect(trend.month).toBe('');
    expect(trend.totalSpend).toBe(0);
    expect(Object.keys(trend.categoryBreakdown).length).toBe(0);
  });

  /*
  Test Documentation:
  - Test Name: should create list of trends
  - Purpose: Verify batch trend creation
  - Scenario: Create multiple trends from array
  - Expected Result: Should return array of trend objects
  */
  it('should create list of trends', function() {
    var dataArray = [
      { month: '2024-01', totalSpend: 1000 },
      { month: '2024-02', totalSpend: 1200 }
    ];

    var trends = TransactionFactory.createTrendList(dataArray);

    expect(trends.length).toBe(2);
    expect(trends[0].month).toBe('2024-01');
    expect(trends[1].month).toBe('2024-02');
  });

  /*
  Test Documentation:
  - Test Name: should handle date conversion
  - Purpose: Verify date parsing
  - Scenario: Create transaction with date string
  - Expected Result: date should be Date object
  */
  it('should handle date conversion', function() {
    var transaction = TransactionFactory.createTransaction({
      date: '2024-01-15T10:30:00Z'
    });

    expect(transaction.date instanceof Date).toBe(true);
  });
});

/*
Coverage Report:
- Functions tested: createTransaction, createSpendingTrend, createTrendList
- Scenarios covered: complete object creation, default values, batch creation, date handling
- Uncovered scenarios: none
*/