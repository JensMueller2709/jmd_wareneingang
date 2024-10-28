export const environment = {
    production: true,
    loginUrl: "https://svmdebppdb.mysug.de:443/sap/opu/odata/sap/ZMM_API_USER_SERVICE_SRV/ParameterSet('WRK')?$format=json",
    materialUrl: 'https://svmdebppdb.mysug.de:443/sap/opu/odata/sap/ZMM_API_MATERIALDATA_SERVICE_SRV/SearchMaterialPlantSet',
    materialEanUrl: 'https://svmdebppdb.mysug.de:443/sap/opu/odata/sap/ZMM_API_MATERIALDATA_SERVICE_SRV/SearchMaterialPlantSet',
    orderUrl: 'https://svmdebppdb.mysug.de:443/sap/opu/odata/sap/ZMM_API_PURCHASEORDER_SERVICE_SRV/SearchOpenPurchaseOrderSet',
    bookUrl: 'https://svmdebppdb.mysug.de:443/sap/opu/odata/sap/ZMM_API_PURCHASEORDER_SERVICE_SRV/PurchaseOrderSet',
    tokenUrl: 'https://svmdebppdb.mysug.de:443/sap/opu/odata/sap/ZMM_API_PURCHASEORDER_SERVICE_SRV/$metadata'
  };