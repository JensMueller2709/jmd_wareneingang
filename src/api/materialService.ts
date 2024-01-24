import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../environments/environment';

@Injectable()
export class MaterialService {
  constructor(private http: HttpClient) { }

  public defaultHeaders = new HttpHeaders();

  getMaterialByMatNumber(username: string, password: string, materialNumber: string): Observable<HttpResponse<String>> {
    //var materialURL = "https://SVMLWBPE01.mysug.de:443/sap/opu/odata/sap/ZMM_API_MATERIALDATA_SERVICE_SRV/SearchMaterialPlantSet"
    //var materialURL = "assets/material.json"
    var materialURL = environment.materialUrl;
    let myHeaders = new HttpHeaders({ Authorization: 'Basic ' + btoa(username + ':' + password) })
      .set('Content-Type', 'application/json');
    return this.http.get<String>(materialURL, {
      params: {
        $filter: "Material eq '" + materialNumber + "' and Plant eq '9600'",
        $format: "json",
        $expand: "toMean"
      },
      headers: myHeaders,
      observe: 'response',
    });
  }

  getMaterialByEAN(username: string, password: string, ean: string): Observable<HttpResponse<String>> {
    //var materialURL = "https://SVMLWBPE01.mysug.de:443/sap/opu/odata/sap/ZMM_API_MATERIALDATA_SERVICE_SRV/SearchMaterialPlantSet"
    //var materialURL = "assets/material.json"
    var materialURL = environment.materialEanUrl;
    let myHeaders = new HttpHeaders({ Authorization: 'Basic ' + btoa(username + ':' + password) })
      .set('Content-Type', 'application/json');
    return this.http.get<String>(materialURL, {
      params: {
        $filter: "EanUpc eq '" + ean + "' and Plant eq '9600'",
        $format: "json",
        $expand: "toMean"
      },
      headers: myHeaders,
      observe: 'response',
    });
  }

}


/*
Hallo Zusammen, 
zur Abfrage des Materials bitte den Service „ZMM_API_MATERIALDATA_SERVICE_SRV“ verwenden. Die nachfolgenden Informationen sollten ausreichen sein 
um ein Material zu prüfen als auch zu einer Materialnummer oder EAN Nummer das passende Material mit seinen Mengeneinheiten zu ermitteln.  
 
Beschreibung 
Der Service ermittelt auf Basis einer Query bestehend aus entweder EAN oder Materialnummer und des zugehörigen Werks die Material Informationen, 
bestehenden aus Basismengeneinheit, Bestellmengeneinheit, EAN, Beschreibung usw. Es ist immer wichtig das Werks und eine der weiteren Informationen (EAN/MAT) mitzugeben, 
ein komplett Abzug aller Materialnummer zu einem Werk wird nicht gestützt aufgrund der zu erwartenden großen Datenmenge. Die Anmeldung 
erfolgt per http-Authentifikation. Austausch findet gesichert über https statt.  
 
Zur Prüfung auf Seiten des Aufrufers 
Prüfung der CA Stelle, laut meinen Test ist das hinterlegte Root Zertifikat zur Adresse nicht vertrauensvoll. Bitte um Prüfung ob man Seiten des Aufrufers zum selben 
Ergebnis kommt um eine Attacke eines „Man in the Middle“ zu verhindern, bedarf es einer vertrauensvollen Kommunikation. Bitte daher nur Vorab (Benutzer/Passwort) 
Verwenden, die eine reduzierte Berechtigung haben.  
 
Authentifizierung 
HTTP-Authentifikation 

Http Status Codes 
https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 
Service Beschreibung 
GET http://SVMLWBPE01.mysug.de:80/sap/opu/odata/sap/ZMM_API_MATERIALDATA_SERVICE_SRV/$metadata
GET http://SVMLWBPE01.mysug.de:80/sap/opu/odata/sap/ZMM_API_MATERIALDATA_SERVICE_SRV/$metadata?sap-documentation=all
 
Abfrage: 
Ungesichert: GET http://SVMLWBPE01.mysug.de:80/sap/opu/odata/sap/ZMM_API_MATERIALDATA_SERVICE_SRV/SearchMaterialPlantSet/?$expand=toMean&$filter=Material eq '802079' and Plant eq '1100' 
Ungesichert: GET http://SVMLWBPE01.mysug.de:80/sap/opu/odata/sap/ZMM_API_MATERIALDATA_SERVICE_SRV/SearchMaterialPlantSet/?$expand=toMean&$filter=EanUpc eq '4066600143369' and Plant eq '1100' 
 
Gesichert: GET https://SVMLWBPE01.mysug.de:443/sap/opu/odata/sap/ZMM_API_MATERIALDATA_SERVICE_SRV/SearchMaterialPlantSet/?$expand=toMean&$filter=Material eq '802079' and Plant eq '1100'
Gesichert: GET https://SVMLWBPE01.mysug.de:443/sap/opu/odata/sap/ZMM_API_MATERIALDATA_SERVICE_SRV/SearchMaterialPlantSet/?$expand=toMean&$filter=EanUpc eq '4066600143369' and Plant eq '1100'
 
Antwort per JSON: Anhängen des Parameters „format=json“  
GET http://SVMLWBPE01.mysug.de:80/sap/opu/odata/sap/ZMM_API_MATERIALDATA_SERVICE_SRV/SearchMaterialPlantSet/?$expand=toMean&$filter=EanUpc eq '4066600143369' and Plant eq '1100'&$format=json
 
Fehlerfall provozieren per Abfrage:
GET  http://SVMLWBPE01.mysug.de:80/sap/opu/odata/sap/ZMM_API_MATERIALDATA_SERVICE_SRV/SearchMaterialPlantSet/?$expand=toMean&$format=json
 
 
 
Beispiele
 
Positiver Test (http://SVMLWBPE01.mysug.de:80/sap/opu/odata/sap/ZMM_API_MATERIALDATA_SERVICE_SRV/SearchMaterialPlantSet/?$expand=toMean&$filter=EanUpc eq '4066600143369' and Plant eq '1100' 
1.	Ermitteln aller Materialnummern im Werk 1100 zur EAN 4066600143369
 
{
  "d" : {
    "results" : [
      {
        "__metadata" : {
          "id" : "http://SVMLWBPE01.mysug.de/sap/opu/odata/sap/ZMM_API_MATERIALDATA_SERVICE_SRV/SearchMaterialPlantSet(Material='114336',Plant='1100')",
          "uri" : "http://SVMLWBPE01.mysug.de/sap/opu/odata/sap/ZMM_API_MATERIALDATA_SERVICE_SRV/SearchMaterialPlantSet(Material='114336',Plant='1100')",
          "type" : "ZMM_API_MATERIALDATA_SERVICE_SRV.SearchMaterialPlant"
        },
        "Material" : "114336",
        "Plant" : "1100",
        "MatlDesc" : "@PA Weißb. 5+EM Stiefel  1/4CH.oL",
        "SlocExprc" : "1001",
        "EanUpc" : "4066600143369",
        "EanCat" : "HE",
        "BaseUom" : "C4",
        "BaseUomIso" : "ZC4",
        "PoUnit" : "",
        "PoUnitIso" : "",
        "toMean" : {
          "results" : [
            {
              "__metadata" : {
                "id" : "http://SVMLWBPE01.mysug.de/sap/opu/odata/sap/ZMM_API_MATERIALDATA_SERVICE_SRV/MaterialPlantEANSet(Material='114336',Plant='1100',Unit='FL',UnitIso='BO',EanUpc='4066600641964',EanCat='HE',MainEan=true)",
                "uri" : "http://SVMLWBPE01.mysug.de/sap/opu/odata/sap/ZMM_API_MATERIALDATA_SERVICE_SRV/MaterialPlantEANSet(Material='114336',Plant='1100',Unit='FL',UnitIso='BO',EanUpc='4066600641964',EanCat='HE',MainEan=true)",
                "type" : "ZMM_API_MATERIALDATA_SERVICE_SRV.MaterialPlantEAN"
              },
              "Material" : "114336",
              "Plant" : "1100",
              "Unit" : "FL",
              "UnitIso" : "BO",
              "EanUpc" : "4066600641964",
              "EanCat" : "HE",
              "MainEan" : true
            },
            {
              "__metadata" : {
                "id" : "http://SVMLWBPE01.mysug.de/sap/opu/odata/sap/ZMM_API_MATERIALDATA_SERVICE_SRV/MaterialPlantEANSet(Material='114336',Plant='1100',Unit='C4',UnitIso='ZC4',EanUpc='4066600143369',EanCat='HE',MainEan=true)",
                "uri" : "http://SVMLWBPE01.mysug.de/sap/opu/odata/sap/ZMM_API_MATERIALDATA_SERVICE_SRV/MaterialPlantEANSet(Material='114336',Plant='1100',Unit='C4',UnitIso='ZC4',EanUpc='4066600143369',EanCat='HE',MainEan=true)",
                "type" : "ZMM_API_MATERIALDATA_SERVICE_SRV.MaterialPlantEAN"
              },
              "Material" : "114336",
              "Plant" : "1100",
              "Unit" : "C4",
              "UnitIso" : "ZC4",
              "EanUpc" : "4066600143369",
              "EanCat" : "HE",
              "MainEan" : true
            },
            {
              "__metadata" : {
                "id" : "http://SVMLWBPE01.mysug.de/sap/opu/odata/sap/ZMM_API_MATERIALDATA_SERVICE_SRV/MaterialPlantEANSet(Material='114336',Plant='1100',Unit='PAL',UnitIso='PF',EanUpc='4066600243366',EanCat='HE',MainEan=true)",
                "uri" : "http://SVMLWBPE01.mysug.de/sap/opu/odata/sap/ZMM_API_MATERIALDATA_SERVICE_SRV/MaterialPlantEANSet(Material='114336',Plant='1100',Unit='PAL',UnitIso='PF',EanUpc='4066600243366',EanCat='HE',MainEan=true)",
                "type" : "ZMM_API_MATERIALDATA_SERVICE_SRV.MaterialPlantEAN"
              },
              "Material" : "114336",
              "Plant" : "1100",
              "Unit" : "PAL",
              "UnitIso" : "PF",
              "EanUpc" : "4066600243366",
              "EanCat" : "HE",
              "MainEan" : true
            },
            {
              "__metadata" : {
                "id" : "http://SVMLWBPE01.mysug.de/sap/opu/odata/sap/ZMM_API_MATERIALDATA_SERVICE_SRV/MaterialPlantEANSet(Material='114336',Plant='1100',Unit='SXP',UnitIso='ZF9',EanUpc='4066600343363',EanCat='HE',MainEan=true)",
                "uri" : "http://SVMLWBPE01.mysug.de/sap/opu/odata/sap/ZMM_API_MATERIALDATA_SERVICE_SRV/MaterialPlantEANSet(Material='114336',Plant='1100',Unit='SXP',UnitIso='ZF9',EanUpc='4066600343363',EanCat='HE',MainEan=true)",
                "type" : "ZMM_API_MATERIALDATA_SERVICE_SRV.MaterialPlantEAN"
              },
              "Material" : "114336",
              "Plant" : "1100",
              "Unit" : "SXP",
              "UnitIso" : "ZF9",
              "EanUpc" : "4066600343363",
              "EanCat" : "HE",
              "MainEan" : true
            }
          ]
        }
      }
    ]
  }
}
 
 
Negativer Test (http://SVMLWBPE01.mysug.de:80/sap/opu/odata/sap/ZMM_API_MATERIALDATA_SERVICE_SRV/SearchMaterialPlantSet/?$expand=toMean&$format=json) 
1.	Query Parameters unvollständig: Werks, Material / EAN nicht vorhanden 
 
{
  "d" : {
    "results" : [

    ]
  }
}
 
Viele Grüße
Daniel Lange
0151-20110820
 
 
 
 
 
 
 
Daniel Lange 
Lange - SAP Entwickler 

Schörghuber Corporate IT GmbH 
Ohlmüllerstraße 42 
81541 München 
E-Mail Daniel.Lange@schoerghuber-it.de   

Gesellschaft mit beschränkter Haftung - Sitz München - Amtsgericht München HRB 42782 
Geschäftsführer: Dr. Stephan Günther 
                                                                                         
S C H Ö R G H U B E R   U N T E R N E H M E N S G R U P P E 

Hinweise zur Verarbeitung Ihrer personenbezogenen Daten: Verantwortlich für die Verarbeitung Ihrer personenbezogenen Daten ist die Schörghuber Stiftung & Co. Holding KG. Weitere Informationen zur Verarbeitung Ihrer Daten und zu den Ihnen zustehenden Rechten finden Sie unter https://www.schoerghuber-it.de/de/Datenschutz. Gerne können Sie uns dazu auch schriftlich oder telefonisch kontaktieren. 

*/