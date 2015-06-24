/**
 * Created by Admin on 11/06/2015.
 */
"use strict";

(function () {

    angular.module('payment.api.customer', [
    ])
        .factory("CustomerService", function($http) {
            return {
                getCustomers: function(){
                    return $http.get("/api/Customers");
                },
                updateCustomer: function(customer){
                    return $http.put("/api/Customer/" + customer._id,customer);
                },
                insertCustomer: function(customer){
                    return $http.post("/api/Customers",customer);
                },
                getCustomersByIds: function(ids){
                    return $http.post("/api/Customers/select", ids);
                },
                getCustomerById :function(id){
                    return $http.get("/api/Customers/"+ id);
                }
            };
        })
    ;

})();