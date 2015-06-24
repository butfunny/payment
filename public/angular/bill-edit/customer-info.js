"use strict";

(function () {

    angular.module('payment.payment-bill.customer-info', [
    ])
        .directive("customerInfo", function(CustomerService) {
            return {
                restrict: "E",
                templateUrl: "angular/bill-edit/customer-info.html",
                link: function($scope, elem, attrs) {

                    $scope.view = {};

                    $scope.$watch("view.customerChoosing",function(customerChoosing){
                        if (typeof customerChoosing == 'string') {
                            $scope.bill.customer = {};
                            $scope.bill.customer.customerName = customerChoosing;
                            $scope.bill.customer.receiverName = customerChoosing;
                        } else {
                            $scope.bill.customer = customerChoosing;
                        }
                    });

                    $scope.$watch("bill.customer", function(customer) {
                        $scope.view.customerChoosing = customer;
                    });


                }
            };
        })
    ;

})();