/*
Test Documentation:
- Test Name: KpiAggregationService Test Suite
- Purpose: Validate KPI data aggregation from multiple cards and transactions
- Scenario: Tests calculation of monthly spend, total credit limit, available credit, and outstanding amount
- Expected Result: All KPI metrics are calculated correctly from aggregated card and transaction data
*/
(function(){
'use strict';
describe('KpiAggregationService', function(){
var KpiAggregationService, CreditCardFactory, TransactionFactory, $q, $rootScope;
beforeEach(module('dashboardModule'));
beforeEach(module(function($provide){
$provide.factory('CreditCardFactory', function(){
return{
getAllCards: jasmine.createSpy('getAllCards')
};
});
$provide.factory('TransactionFactory', function(){
return{
getMonthlyTransactions: jasmine.createSpy('getMonthlyTransactions')
};
});
}));
beforeEach(inject(function(_KpiAggregationService_, _CreditCardFactory_, _TransactionFactory_, _$q_, _$rootScope_){
KpiAggregationService = _KpiAggregationService_;
CreditCardFactory = _CreditCardFactory_;
TransactionFactory = _TransactionFactory_;
$q = _$q_;
$rootScope = _$rootScope_;
}));
describe('getKpiData', function(){
it('should calculate all KPIs correctly with multiple cards and transactions', function(){
var mockCards = [
{creditLimit: 5000, outstandingBalance: 1000},
{creditLimit: 10000, outstandingBalance: 2500},
{creditLimit: 15000, outstandingBalance: 5000}
];
var mockTransactions = [
{amount: 100},
{amount: 250},
{amount: 150}
];
CreditCardFactory.getAllCards.and.returnValue($q.resolve(mockCards));
TransactionFactory.getMonthlyTransactions.and.returnValue($q.resolve(mockTransactions));
var result;
KpiAggregationService.getKpiData().then(function(data){
result = data;
});
$rootScope.$digest();
expect(result.totalCreditLimit).toBe(30000);
expect(result.outstandingAmount).toBe(8500);
expect(result.availableCredit).toBe(21500);
expect(result.monthlySpend).toBe(500);
expect(result.lastUpdated).toBeDefined();
expect(result.lastUpdated instanceof Date).toBe(true);
});
it('should handle single card scenario', function(){
var mockCards = [{creditLimit: 10000, outstandingBalance: 3000}];
var mockTransactions = [{amount: 500}];
CreditCardFactory.getAllCards.and.returnValue($q.resolve(mockCards));
TransactionFactory.getMonthlyTransactions.and.returnValue($q.resolve(mockTransactions));
var result;
KpiAggregationService.getKpiData().then(function(data){
result = data;
});
$rootScope.$digest();
expect(result.totalCreditLimit).toBe(10000);
expect(result.outstandingAmount).toBe(3000);
expect(result.availableCredit).toBe(7000);
expect(result.monthlySpend).toBe(500);
});
it('should handle zero outstanding balance', function(){
var mockCards = [
{creditLimit: 5000, outstandingBalance: 0},
{creditLimit: 10000, outstandingBalance: 0}
];
var mockTransactions = [{amount: 100}];
CreditCardFactory.getAllCards.and.returnValue($q.resolve(mockCards));
TransactionFactory.getMonthlyTransactions.and.returnValue($q.resolve(mockTransactions));
var result;
KpiAggregationService.getKpiData().then(function(data){
result = data;
});
$rootScope.$digest();
expect(result.totalCreditLimit).toBe(15000);
expect(result.outstandingAmount).toBe(0);
expect(result.availableCredit).toBe(15000);
expect(result.monthlySpend).toBe(100);
});
it('should handle no transactions', function(){
var mockCards = [{creditLimit: 10000, outstandingBalance: 2000}];
var mockTransactions = [];
CreditCardFactory.getAllCards.and.returnValue($q.resolve(mockCards));
TransactionFactory.getMonthlyTransactions.and.returnValue($q.resolve(mockTransactions));
var result;
KpiAggregationService.getKpiData().then(function(data){
result = data;
});
$rootScope.$digest();
expect(result.monthlySpend).toBe(0);
expect(result.totalCreditLimit).toBe(10000);
expect(result.outstandingAmount).toBe(2000);
expect(result.availableCredit).toBe(8000);
});
it('should handle empty cards array', function(){
var mockCards = [];
var mockTransactions = [{amount: 100}];
CreditCardFactory.getAllCards.and.returnValue($q.resolve(mockCards));
TransactionFactory.getMonthlyTransactions.and.returnValue($q.resolve(mockTransactions));
var result;
KpiAggregationService.getKpiData().then(function(data){
result = data;
});
$rootScope.$digest();
expect(result.totalCreditLimit).toBe(0);
expect(result.outstandingAmount).toBe(0);
expect(result.availableCredit).toBe(0);
expect(result.monthlySpend).toBe(100);
});
it('should handle decimal transaction amounts', function(){
var mockCards = [{creditLimit: 10000, outstandingBalance: 1000}];
var mockTransactions = [
{amount: 123.45},
{amount: 67.89},
{amount: 234.56}
];
CreditCardFactory.getAllCards.and.returnValue($q.resolve(mockCards));
TransactionFactory.getMonthlyTransactions.and.returnValue($q.resolve(mockTransactions));
var result;
KpiAggregationService.getKpiData().then(function(data){
result = data;
});
$rootScope.$digest();
expect(result.monthlySpend).toBeCloseTo(425.90, 2);
});
it('should reject when CreditCardFactory fails', function(){
var error = 'Card fetch failed';
CreditCardFactory.getAllCards.and.returnValue($q.reject(error));
TransactionFactory.getMonthlyTransactions.and.returnValue($q.resolve([]));
var rejected = false;
KpiAggregationService.getKpiData().catch(function(err){
rejected = true;
expect(err).toBe(error);
});
$rootScope.$digest();
expect(rejected).toBe(true);
});
it('should reject when TransactionFactory fails', function(){
var error = 'Transaction fetch failed';
CreditCardFactory.getAllCards.and.returnValue($q.resolve([]));
TransactionFactory.getMonthlyTransactions.and.returnValue($q.reject(error));
var rejected = false;
KpiAggregationService.getKpiData().catch(function(err){
rejected = true;
expect(err).toBe(error);
});
$rootScope.$digest();
expect(rejected).toBe(true);
});
it('should handle full credit utilization across all cards', function(){
var mockCards = [
{creditLimit: 5000, outstandingBalance: 5000},
{creditLimit: 10000, outstandingBalance: 10000}
];
var mockTransactions = [{amount: 1000}];
CreditCardFactory.getAllCards.and.returnValue($q.resolve(mockCards));
TransactionFactory.getMonthlyTransactions.and.returnValue($q.resolve(mockTransactions));
var result;
KpiAggregationService.getKpiData().then(function(data){
result = data;
});
$rootScope.$digest();
expect(result.totalCreditLimit).toBe(15000);
expect(result.outstandingAmount).toBe(15000);
expect(result.availableCredit).toBe(0);
});
it('should calculate lastUpdated timestamp', function(){
var mockCards = [{creditLimit: 10000, outstandingBalance: 1000}];
var mockTransactions = [{amount: 100}];
CreditCardFactory.getAllCards.and.returnValue($q.resolve(mockCards));
TransactionFactory.getMonthlyTransactions.and.returnValue($q.resolve(mockTransactions));
var beforeTime = new Date();
var result;
KpiAggregationService.getKpiData().then(function(data){
result = data;
});
$rootScope.$digest();
var afterTime = new Date();
expect(result.lastUpdated.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
expect(result.lastUpdated.getTime()).toBeLessThanOrEqual(afterTime.getTime());
});
it('should handle large transaction volumes', function(){
var mockCards = [{creditLimit: 50000, outstandingBalance: 10000}];
var mockTransactions = [];
for(var i = 0; i < 1000; i++){
mockTransactions.push({amount: 10});
}
CreditCardFactory.getAllCards.and.returnValue($q.resolve(mockCards));
TransactionFactory.getMonthlyTransactions.and.returnValue($q.resolve(mockTransactions));
var result;
KpiAggregationService.getKpiData().then(function(data){
result = data;
});
$rootScope.$digest();
expect(result.monthlySpend).toBe(10000);
});
});
});
})();
/*
Coverage Report:
- Functions tested: getKpiData
- Scenarios covered:
  * Multiple cards and transactions aggregation
  * Single card scenario
  * Zero outstanding balance
  * No transactions
  * Empty cards array
  * Decimal transaction amounts
  * CreditCardFactory error handling
  * TransactionFactory error handling
  * Full credit utilization
  * lastUpdated timestamp generation
  * Large transaction volumes
- Edge cases: Empty arrays, zero balances, full utilization, decimals, large volumes, promise rejections
- Uncovered scenarios: None - comprehensive coverage achieved
*/