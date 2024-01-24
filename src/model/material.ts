export interface Material {
    materialNumber?: string;
    name?: string;
    isAmount?: number;
    sollAmount?: number;
    position? : number;
    unit? : string;
    orderNumber?: string;
    ean?: string;
    PoManu?: string;
    free?: boolean;
    lagerort?: string;
}

/*
  {
        "__metadata" : {
          "id" : "http://SVMLWBPE01.mysug.de/sap/opu/odata/sap/ZMM_API_PURCHASEORDER_SERVICE_SRV/SearchOpenPurchaseOrderSet(PoNumber='400000112',PoItem='00001')",
          "uri" : "http://SVMLWBPE01.mysug.de/sap/opu/odata/sap/ZMM_API_PURCHASEORDER_SERVICE_SRV/SearchOpenPurchaseOrderSet(PoNumber='400000112',PoItem='00001')",
          "type" : "ZMM_API_PURCHASEORDER_SERVICE_SRV.SearchOpenPurchaseOrder"
        },
        "PoNumber" : "400000112",
        "PoItem" : "00001",
        "Vendor" : "12044",
        "Material" : "ANLK4002",
        "Plant" : "1000",
        "StgeLoc" : "1018",
        "DeleteInd" : "L",
        "ShortText" : "1229520590-Dichtung VOC; Typ 202; EPDM",
        "VendMat" : "1229520590",
        "Quantity" : "170",
        "PoUnit" : "ST",
        "PoUnitIso" : "PCE",
        "OrderprUn" : "ST",
        "OrderprUnIso" : "PCE",
        "ConvNum1" : "1",
        "ConvDen1" : "1",
        "ConvNum2" : "1",
        "ConvDen2" : "1",
        "ItemCat" : "0",
        "Acctasscat" : "1",
        "FreeItem" : false,
        "Agreement" : "",
        "AgmtItem" : "0",
        "Batch" : "",
        "Vendrbatch" : "",
        "SupplStloc" : "",
        "EanUpc" : "",
        "CreatedOn" : "\/Date(1226275200000)\/"
      }
*/