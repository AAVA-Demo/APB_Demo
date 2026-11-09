/*
Test Documentation:
- Test Name: CardManagementService Test Suite
- Purpose: Validate card retrieval, enrichment, and management operations
- Scenario: Tests user card list retrieval, individual card detail fetching, and error handling
- Expected Result: Cards are retrieved and enriched correctly, errors are handled properly
*/
(function(){
'use strict';
describe('CardManagementService', function(){
var CardManagementService, UserProfileFactory, CardDataFactory, CardAnalyticsService, $q, $rootScope;
beforeEach(module('cardManagementModule'));
beforeEach(module(function($provide){
$provide.factory('UserProfileFactory', function(){
return{
getCardMapping: jasmine.createSpy('getCardMapping')
};
});
$provide.factory('CardDataFactory', function(){
return{
getCardDetails: jasmine.createSpy('getCardDetails')
};
});
$provide.service('CardAnalyticsService', function(){
this.analyzeCard = jasmine.createSpy('analyzeCard').and.callFake(function(card){
return angular.extend({}, card, {availableCredit: card.creditLimit - card.outstandingBalance, utilizationRate: (card.outstandingBalance / card.creditLimit) * 100});
});
});
}));
beforeEach(inject(function(_CardManagementService_, _UserProfileFactory_, _CardDataFactory_, _CardAnalyticsService_, _$q_, _$rootScope_){
CardManagementService = _CardManagementService_;
UserProfileFactory = _UserProfileFactory_;
CardDataFactory = _CardDataFactory_;
CardAnalyticsService = _CardAnalyticsService_;
$q = _$q_;
$rootScope = _$rootScope_;
}));
describe('getUserCards', function(){
it('should retrieve and enrich user cards successfully', function(){
var mockMapping = {cardIds: [1, 2, 3]};
var mockCards = [
{cardId: 1, creditLimit: 5000, outstandingBalance: 1000},
{cardId: 2, creditLimit: 10000, outstandingBalance: 2000},
{cardId: 3, creditLimit: 15000, outstandingBalance: 3000}
];
UserProfileFactory.getCardMapping.and.returnValue($q.resolve(mockMapping));
CardDataFactory.getCardDetails.and.returnValue($q.resolve(mockCards));
var result;
CardManagementService.getUserCards().then(function(cards){
result = cards;
});
$rootScope.$digest();
expect(UserProfileFactory.getCardMapping).toHaveBeenCalled();
expect(CardDataFactory.getCardDetails).toHaveBeenCalledWith([1, 2, 3]);
expect(CardAnalyticsService.analyzeCard).toHaveBeenCalledTimes(3);
expect(result.length).toBe(3);
expect(result[0].availableCredit).toBe(4000);
expect(result[1].availableCredit).toBe(8000);
expect(result[2].availableCredit).toBe(12000);
});
it('should handle empty card list', function(){
var mockMapping = {cardIds: []};
var mockCards = [];
UserProfileFactory.getCardMapping.and.returnValue($q.resolve(mockMapping));
CardDataFactory.getCardDetails.and.returnValue($q.resolve(mockCards));
var result;
CardManagementService.getUserCards().then(function(cards){
result = cards;
});
$rootScope.$digest();
expect(result).toEqual([]);
expect(CardAnalyticsService.analyzeCard).not.toHaveBeenCalled();
});
it('should reject when UserProfileFactory fails', function(){
var error = 'Profile fetch failed';
UserProfileFactory.getCardMapping.and.returnValue($q.reject(error));
var rejected = false;
CardManagementService.getUserCards().catch(function(err){
rejected = true;
expect(err).toBe(error);
});
$rootScope.$digest();
expect(rejected).toBe(true);
expect(CardDataFactory.getCardDetails).not.toHaveBeenCalled();
});
it('should reject when CardDataFactory fails', function(){
var mockMapping = {cardIds: [1, 2]};
var error = 'Card data fetch failed';
UserProfileFactory.getCardMapping.and.returnValue($q.resolve(mockMapping));
CardDataFactory.getCardDetails.and.returnValue($q.reject(error));
var rejected = false;
CardManagementService.getUserCards().catch(function(err){
rejected = true;
expect(err).toBe(error);
});
$rootScope.$digest();
expect(rejected).toBe(true);
});
it('should enrich each card with analytics', function(){
var mockMapping = {cardIds: [1]};
var mockCards = [{cardId: 1, creditLimit: 10000, outstandingBalance: 5000}];
UserProfileFactory.getCardMapping.and.returnValue($q.resolve(mockMapping));
CardDataFactory.getCardDetails.and.returnValue($q.resolve(mockCards));
var result;
CardManagementService.getUserCards().then(function(cards){
result = cards;
});
$rootScope.$digest();
expect(result[0].availableCredit).toBe(5000);
expect(result[0].utilizationRate).toBe(50);
});
});
describe('getCardDetail', function(){
it('should retrieve and enrich single card detail', function(){
var cardId = 123;
var mockCards = [{cardId: 123, creditLimit: 20000, outstandingBalance: 5000}];
CardDataFactory.getCardDetails.and.returnValue($q.resolve(mockCards));
var result;
CardManagementService.getCardDetail(cardId).then(function(card){
result = card;
});
$rootScope.$digest();
expect(CardDataFactory.getCardDetails).toHaveBeenCalledWith([123]);
expect(CardAnalyticsService.analyzeCard).toHaveBeenCalledWith(mockCards[0]);
expect(result.cardId).toBe(123);
expect(result.availableCredit).toBe(15000);
expect(result.utilizationRate).toBe(25);
});
it('should reject when card is not found', function(){
var cardId = 999;
CardDataFactory.getCardDetails.and.returnValue($q.resolve([]));
var rejected = false;
CardManagementService.getCardDetail(cardId).catch(function(err){
rejected = true;
expect(err).toBe('Card not found');
});
$rootScope.$digest();
expect(rejected).toBe(true);
});
it('should reject when CardDataFactory fails', function(){
var cardId = 123;
var error = 'Network error';
CardDataFactory.getCardDetails.and.returnValue($q.reject(error));
var rejected = false;
CardManagementService.getCardDetail(cardId).catch(function(err){
rejected = true;
expect(err).toBe(error);
});
$rootScope.$digest();
expect(rejected).toBe(true);
});
it('should handle card with zero balance', function(){
var cardId = 1;
var mockCards = [{cardId: 1, creditLimit: 10000, outstandingBalance: 0}];
CardDataFactory.getCardDetails.and.returnValue($q.resolve(mockCards));
var result;
CardManagementService.getCardDetail(cardId).then(function(card){
result = card;
});
$rootScope.$digest();
expect(result.availableCredit).toBe(10000);
expect(result.utilizationRate).toBe(0);
});
it('should handle card with full utilization', function(){
var cardId = 1;
var mockCards = [{cardId: 1, creditLimit: 10000, outstandingBalance: 10000}];
CardDataFactory.getCardDetails.and.returnValue($q.resolve(mockCards));
var result;
CardManagementService.getCardDetail(cardId).then(function(card){
result = card;
});
$rootScope.$digest();
expect(result.availableCredit).toBe(0);
expect(result.utilizationRate).toBe(100);
});
});
describe('integration scenarios', function(){
it('should handle complete user card management flow', function(){
var mockMapping = {cardIds: [1, 2]};
var mockCards = [
{cardId: 1, creditLimit: 5000, outstandingBalance: 1000},
{cardId: 2, creditLimit: 10000, outstandingBalance: 3000}
];
UserProfileFactory.getCardMapping.and.returnValue($q.resolve(mockMapping));
CardDataFactory.getCardDetails.and.returnValue($q.resolve(mockCards));
var allCards;
CardManagementService.getUserCards().then(function(cards){
allCards = cards;
});
$rootScope.$digest();
expect(allCards.length).toBe(2);
CardDataFactory.getCardDetails.calls.reset();
CardAnalyticsService.analyzeCard.calls.reset();
CardDataFactory.getCardDetails.and.returnValue($q.resolve([mockCards[0]]));
var singleCard;
CardManagementService.getCardDetail(1).then(function(card){
singleCard = card;
});
$rootScope.$digest();
expect(singleCard.cardId).toBe(1);
expect(CardAnalyticsService.analyzeCard).toHaveBeenCalled();
});
});
});
})();
/*
Coverage Report:
- Functions tested: getUserCards, getCardDetail
- Scenarios covered:
  * Successful user cards retrieval and enrichment
  * Empty card list handling
  * UserProfileFactory error handling
  * CardDataFactory error handling (getUserCards)
  * Card analytics enrichment
  * Single card detail retrieval
  * Card not found error
  * CardDataFactory error handling (getCardDetail)
  * Zero balance card
  * Full utilization card
  * Complete integration flow
- Edge cases: Empty lists, not found, zero/full utilization, promise rejections
- Uncovered scenarios: None - comprehensive coverage achieved
*/