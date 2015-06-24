"use strict";

(function () {

    angular.module('payment.common.theme', [
        'payment.common.vi'
    ])
        .directive("decimalFormat", ["numberFilter", function(numberFilter) {
            return {
                restrict: "A",
                require: "ngModel",
                link: function($scope, elem, attrs, ngModelCtrl) {
                    ngModelCtrl.$parsers.push(function(vv) {
                        if (StringUtil.isBlank(vv)) {
                            return null;
                        }
                        if (typeof vv == 'string') {
                            return vv.replace(/,/g, "") * 1;
                        }
                        return vv;
                    });
                    ngModelCtrl.$formatters.push(function(mv) {
                        return numberFilter(mv);
                    });
                    elem.blur(function() {
                        var vv = numberFilter(ngModelCtrl.$modelValue, 0);
                        elem.val(vv);
                    });
                }
            };
        }])
    ;

})();