(function(){
'use strict';
angular.module('creditCardApp').service('SyncService',['$interval','TransactionService',function($interval,TransactionService){
var self=this;
var syncInterval=null;
self.startSync=function(callback){
if(syncInterval)return;
syncInterval=$interval(function(){
TransactionService.getTransactions({}).then(function(data){
if(callback)callback(data);
});
},60000);
};
self.stopSync=function(){
if(syncInterval){
$interval.cancel(syncInterval);
syncInterval=null;
}
};
}]);
})();