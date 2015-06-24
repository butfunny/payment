"use strict";

(function () {

    angular.module('payment.kho', [
        'payment.common.excel',
        'payment.api.store-item',
        'payment.api.bill'
    ])

        .config(["$stateProvider", function ($stateProvider) {

            $stateProvider
                .state('kho', {
                    url: '/kho',
                    templateUrl: "angular/kho/kho.html",
                    controller: "kho.ctrl"
                })
            ;
        }])
        .controller("kho.ctrl",function($scope, StoreItemService,$modal,ExcelService, $timeout){
            //$scope.items = [];
            $scope.currentPage = 1;
            var loadStoreItems = function(){

                StoreItemService.getStoreItems().success(function(storeItems) {
                    $scope.storeItems = storeItems;
                    $scope.exportToExcel = function(){
                        ExcelService.download($scope,{
                            worksheetName:"Báo cáo kho",
                            templateUrl:"angular/kho/kho-table.html",
                            resolve:{
                                storeItems : storeItems
                            }
                        });
                    }
                });
            };

            loadStoreItems();

            $scope.delete = function(storeItem){
                if (!confirm("Xóa " + storeItem.itemName + " ?")) {
                    return;
                }

                StoreItemService.deleteItem(storeItem);
                Cols.remove(storeItem,$scope.storeItems);
                loadStoreItems();
                $scope.currentPage = 1;

            };

            $scope.insertItem = function () {
                $modal.open({
                    templateUrl:"angular/kho/insert-item.html",
                    controller:"insert-item.ctrl",
                    resolve: {
                        loadStoreItems: function(){
                            return loadStoreItems;
                        }

                    }

                })
                    .result.then(function() {
                        $scope.success = "Insert successful";
                        $scope.currentPage = 1;
                        $timeout(function(){
                            $scope.success = "";
                        },2000);

                    });
            };


            $scope.$watch("keyword",function(){
                $scope.currentPage = 1;
            })

        })

        .filter('slice', function() {
            return function(arr, start, limit) {
                return (arr || []).slice(start, start + limit);
            };
        })

        .controller("insert-item.ctrl", function ($scope, $modalInstance, StoreItemService,loadStoreItems) {
            $scope.close = function(){
              $modalInstance.dismiss();
            };

            $scope.insert = function (storeItem) {
                StoreItemService.insertItem(storeItem)
                    .success(function(data,status,headers,config){
                        $modalInstance.close();
                        loadStoreItems();
                    })
                        .error(function(data,status,header,config){
                        console.log(config);
                    })
                ;

            };
        })

        .directive("storeItemRow", function(StoreItemService) {
            return {
                restrict: "A",
                link: function($scope, elem, attrs) {
                    $scope.$watch("storeItem", function(storeItem, old) {
                        if (old == null) return;

                        StoreItemService.updateItem(storeItem);
                    }, true);

                }
            };
        })

        .directive("khoTable",function(){
            return{
                restrict:"E",
                templateUrl:"angular/kho/kho-table.html",
                link:function($scope,elem,attrs){

                }
            }
        })

    ;

})();