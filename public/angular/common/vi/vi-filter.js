"use strict";

(function () {

    angular.module('payment.common.vi', [
    ])

        /**
         * filterVi:search:8
         */
        .filter('filterVi', function() {
            function checkOri(hash, decor) {
                return function(str) {
                    var nextFindStart = 0;
                    str = str.toLowerCase();
                    if (decor != null) {
                        str = decor(str);
                    }
                    for (var i in hash) {
                        var found = str.indexOf(hash[i], nextFindStart);
                        if (found == -1) {
                            return false;
                        }
                        nextFindStart = found + hash[i].length + 1;
                    }
                    return true;
                }
            }
            function checkRemMark(hash) {
                return checkOri(hash, function(str) { return Vi.removeMark(str); });
            }
            return function(arr, target, name, limit) {
                if (StringUtil.isBlank(target)) {
                    //if (arr != null && limit != null && arr.length > limit) {
                    //
                    //}
                    return arr;
                }
                target = target.toLowerCase();
                var hash = target.split(" ");

                var check = Vi.hasMark(target)? checkOri(hash, null) : checkRemMark(hash);
                var ret = [];

                for (var i in arr) {
                    var o = arr[i];
                    var str = o[name];

                    if (check(str)) {
                        ret.push(o);
                        if (limit != null && limit <= ret.length) {
                            break;
                        }
                    }
                }

                return ret;
            };
        })


    ;

})();