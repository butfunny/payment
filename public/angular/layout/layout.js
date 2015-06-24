"use strict";

(function () {

    angular.module('payment.layout', [
    ])
        .directive("paymentHeader", function(User,SecurityService) {
            return {
                restrict: "A",
                scope: true,
                link: function($scope, elem, attrs) {
                    $scope.User = User;
                    console.log($scope.User);
                    $scope.logout = SecurityService.logout;
                }
            };
        })
    ;

})();