export const environment = {
    production: true,
    name: "BPE",
    loginUrl: "https://wareneingang-bpe.mysug.de:443/sap/opu/odata/sap/ZMM_API_USER_SERVICE_SRV/ParameterSet('WRK')?$format=json",
    materialUrl: 'https://wareneingang-bpe.mysug.de:443/sap/opu/odata/sap/ZMM_API_MATERIALDATA_SERVICE_SRV/SearchMaterialPlantSet',
    materialEanUrl: 'https://wareneingang-bpe.mysug.de:443/sap/opu/odata/sap/ZMM_API_MATERIALDATA_SERVICE_SRV/SearchMaterialPlantSet',
    orderUrl: 'https://wareneingang-bpe.mysug.de:443/sap/opu/odata/sap/ZMM_API_PURCHASEORDER_SERVICE_SRV/SearchOpenPurchaseOrderSet',
    bookUrl: 'https://wareneingang-bpe.mysug.de:443/sap/opu/odata/sap/ZMM_API_PURCHASEORDER_SERVICE_SRV/PurchaseOrderSet',
    tokenUrl: 'https://wareneingang-bpe.mysug.de:443/sap/opu/odata/sap/ZMM_API_PURCHASEORDER_SERVICE_SRV/$metadata'
  };