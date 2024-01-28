export const environment = {
    production: true,
    loginUrl: "https://SVMLWBPT01.mysug.de:443/sap/opu/odata/sap/ZMM_API_USER_SERVICE_SRV/ParameterSet('WRK')?$format=json",
    materialUrl: 'https://SVMLWBPT01.mysug.de:443/sap/opu/odata/sap/ZMM_API_MATERIALDATA_SERVICE_SRV/SearchMaterialPlantSet',
    materialEanUrl: 'https://SVMLWBPT01.mysug.de:443/sap/opu/odata/sap/ZMM_API_MATERIALDATA_SERVICE_SRV/SearchMaterialPlantSet',
    orderUrl: 'https://svmlwBPT01.mysug.de:443/sap/opu/odata/sap/ZMM_API_PURCHASEORDER_SERVICE_SRV/SearchOpenPurchaseOrderSet',
    bookUrl: 'https://svmlwBPT01.mysug.de:443/sap/opu/odata/sap/ZMM_API_PURCHASEORDER_SERVICE_SRV/PurchaseOrderSet',
    tokenUrl: 'https://SVMLWBPT01.mysug.de:443/sap/opu/odata/sap/ZMM_API_PURCHASEORDER_SERVICE_SRV/$metadata'
  };