"use strict";

(function () {

    angular.module('payment.common.excel', [
    ])
        .factory("ExcelService", function($window, $http, $compile) {
            return {
                download: function($scope, options) {

                    $http.get(options.templateUrl).success(function(content) {
                        var scope = $scope.$new();

                        for (var key in options.resolve) {
                            scope[key] = options.resolve[key];
                        }
                        var compiledElem = $compile(angular.element(content))(scope);

                        setTimeout(function() {
                            var html = compiledElem.html().replace(/<input.+?>/g,"");

                            scope.$destroy();
                            var uri='data:application/vnd.ms-excel;base64,';
                            var template='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>';
                            var base64=function(str){
                                return $window.btoa(unescape(encodeURIComponent(str)));
                                //return $window.btoa(str);
                            };
                            var format=function(template,ctx){
                                return template.replace(/{(\w+)}/g,function(m,p){return ctx[p];})
                            };
                            var ctx = { worksheet: options.worksheetName, table: html};
                            var href = uri + base64(format(template,ctx));

                            window.location.href=href;


                        }, 0);
                    });
                }
            };
        })
    ;

})();