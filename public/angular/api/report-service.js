"use strict";

(function () {

    angular.module('payment.api.report', [
    ])
        .factory("ReportService", function($http, dateFilter) {
            return {
               getBills: function(date){
                   return $http.get("/api/Bills/" + dateFilter(date, "yyyy.MM.dd"));
               }
            };
        })
    ;

})();