export const environment = {
    production: true,
    name: "BPT",
    loginUrl: "https://wareneingang-bpt.mysug.de:443/sap/opu/odata/sap/ZMM_API_USER_SERVICE_SRV/ParameterSet('WRK')?$format=json",
    materialUrl: 'https://wareneingang-bpt.mysug.de:443/sap/opu/odata/sap/ZMM_API_MATERIALDATA_SERVICE_SRV/SearchMaterialPlantSet',
    materialEanUrl: 'https://wareneingang-bpt.mysug.de:443/sap/opu/odata/sap/ZMM_API_MATERIALDATA_SERVICE_SRV/SearchMaterialPlantSet',
    orderUrl: 'https://wareneingang-bpt.mysug.de:443/sap/opu/odata/sap/ZMM_API_PURCHASEORDER_SERVICE_SRV/SearchOpenPurchaseOrderSet',
    bookUrl: 'https://wareneingang-bpt.mysug.de:443/sap/opu/odata/sap/ZMM_API_PURCHASEORDER_SERVICE_SRV/PurchaseOrderSet',
    tokenUrl: 'https://wareneingang-bpt.mysug.de:443/sap/opu/odata/sap/ZMM_API_PURCHASEORDER_SERVICE_SRV/$metadata'
  };