"use strict";

(function(){
    angular.module('payment.draft-bills',[
        'payment-api.billDraft',
        'payment.api.customer',
        'payment.api.store-item',
        'payment.api.bill'
    ])

        .config(["$stateProvider",function($stateProvider){
            $stateProvider
                .state('draft-bills',{
                    url:'/draft-bills',
                    templateUrl:"angular/draft-bills/draft-bills.html",
                    controller:"draft-bills.ctrl"

                });
        }])

        .controller("draft-bills.ctrl",function($scope, $state,BillDraftService, StoreItemService, CustomerService, ExcelService,$window){

            var allCustomerIds = [];
            var allItemIdx = [];

            BillDraftService.getBillDrafts().success(function(billDrafts){
                $scope.billDrafts = billDrafts;

                for(var i in $scope.billDrafts){
                    var billDraft = $scope.billDrafts[i];

                    if (billDraft.customerId != null) {
                        allCustomerIds.push(billDraft.customerId);
                    }

                    for(var j in billDraft.items){
                        var item = billDraft.items[j];
                        allItemIdx.push(item.storeItemId);
                    }
                }

                if(Cols.isNotEmpty(allCustomerIds)){
                    CustomerService.getCustomersByIds(allCustomerIds).success(function(customers){
                        var index = Cols.index(customers,"id");

                        for(var i in $scope.billDrafts){
                            var billDraft = $scope.billDrafts[i];

                            if (billDraft.customerId != null) {
                                billDraft.customer = index[billDraft.customerId][0];
                            }

                            delete billDraft.customerId;
                        }
                    })
                }

                if(Cols.isNotEmpty(allItemIdx)){
                    StoreItemService.getStoreItemsByIds(allItemIdx).success(function(items){
                        var index = Cols.index(items,"id");

                        for(var i in $scope.billDrafts){
                            var billDraft = $scope.billDrafts[i];
                            for (var j in billDraft.items){
                                var billDraftItem = billDraft.items[j];
                                var storeItem = index[billDraftItem.storeItemId];
                                if (storeItem != null) {
                                    billDraftItem.storeItem = storeItem[0];
                                }
                                delete  billDraftItem.storeItemId;
                            }
                        }
                    })
                }

                $scope.exportToExcel = function (){
                   ExcelService.download($scope,{
                       worksheetName : "Báo cáo hóa đơn lưu",
                       templateUrl:"angular/draft-bills/draft-bills.html",
                       resolve:{
                           billDrafts : billDrafts
                       }
                   })
                }

            });


            $scope.viewBillDraft = function(billDraft){
                $state.go("payment", {draftId: billDraft.id});

            }

            $scope.delete = function(billDraft, $event){

                Cols.remove(billDraft, $scope.billDrafts);

                BillDraftService.deleteBillDraftByDraftId(billDraft.id);

                $event.preventDefault();
                $event.stopPropagation();

            }

        })
})();