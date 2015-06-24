"use strict";

(function () {

    angular.module('payment.api.bill', [
    ])
        .factory("BillService", function($http) {
            return {
                createBill: function (bill) {
                    var toSend = angular.copy(bill);

                    if (bill.customer != null) {
                        toSend.customerId = bill.customer.id;
                    }

                    delete toSend.customer;

                    return $http.post("/api/Bills", toSend);
                }
            };
        })
    ;

})();