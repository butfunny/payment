"use strict";

(function () {

    angular.module('payment-api.billDraft', [
    ])
        .factory("BillDraftService", function($http,dateFilter) {
            return {
                createBillDraft: function(bill){
                    var toSend = angular.copy(bill);

                    if (bill.customer != null) {
                        toSend.customerId = bill.customer.id;
                    }
                    delete toSend.customer;

                    return $http.post("/api/BillDraft",toSend);
                },
                getBillDrafts:function(){
                    return $http.get("/api/BillDraft");
                },
                getBillDraftByDraftId:function(draftId){
                    return $http.get("/api/BillDraft/" + draftId);
                },
                updateBillDraft: function (draftId, bill) {
                    var toSend = angular.copy(bill);

                    if (bill.customer != null) {
                        toSend.customerId = bill.customer.id;
                    }

                    delete toSend.customer;

                    return $http.put("/api/BillDraft/" + draftId, toSend);
                },
                deleteBillDraftByDraftId: function(draftId){
                    return $http.delete("/api/BillDraft/"+ draftId);
                }
            };
        })
    ;

})();