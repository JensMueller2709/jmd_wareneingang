import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderToBook } from 'src/model/booking/orderToBook';
import { environment } from './../environments/environment';

@Injectable()
export class OrderService {
  constructor(private http: HttpClient) { }

  getOrder(username: string, password: string, orderNumber: string): Observable<HttpResponse<String>> {
    //var orderUrl = "https://svmlwbpe01.mysug.de:443/sap/opu/odata/sap/ZMM_API_PURCHASEORDER_SERVICE_SRV/SearchOpenPurchaseOrderSet"
    //var orderUrl = "assets/order.json"
    var orderUrl = environment.orderUrl;
    let myHeaders = new HttpHeaders({ Authorization: 'Basic ' + btoa(username + ':' + password) })
    .set('Content-Type', 'application/json');
    return this.http.get<String>(orderUrl, {
      params: {
        $filter: "PoNumber eq '" + orderNumber + "' and Plant eq '9600'",
        $format: "json"
      },
      headers: myHeaders,
      observe: 'response',
    });
  }

  getOrderBySupplierNumber(username: string, password: string, supplierNumber: string): Observable<HttpResponse<String>> {
    //var orderUrl = "https://svmlwbpe01.mysug.de:443/sap/opu/odata/sap/ZMM_API_PURCHASEORDER_SERVICE_SRV/SearchOpenPurchaseOrderSet"
    //var orderUrl = "assets/orders.json"
    var orderUrl = environment.orderUrl;
    let myHeaders = new HttpHeaders({ Authorization: 'Basic ' + btoa(username + ':' + password) })
    .set('Content-Type', 'application/json');
    return this.http.get<String>(orderUrl, {
      params: {
        $filter: "Vendor eq '" + supplierNumber + "' and Plant eq '9600'",
        $format: "json"
      },
      headers: myHeaders,
      observe: 'response',
    });
  }

  book(username: string, password: string, order: OrderToBook, token: string): Observable<HttpResponse<String>> {
    //var orderUrl = "https://svmlwbpe01.mysug.de:443/sap/opu/odata/sap/ZMM_API_PURCHASEORDER_SERVICE_SRV/PurchaseOrderSet"
    //var orderUrl = "assets/orderResponse.json"
    var orderUrl = environment.bookUrl; 
    let myHeaders = new HttpHeaders({ Authorization: 'Basic ' + btoa(username + ':' + password) })
    .set('Content-Type', 'application/json')
    .set('X-Requested-With', 'X')
    //.set('Accept', 'application/json')
    //.set('X-CSRF-Token', token);
    return this.http.post<any>(orderUrl, JSON.stringify(order), {
      headers: myHeaders,
      observe: 'response',
    });
  }

  getTokenRequest(username: string, password: string): Observable<HttpResponse<any>> {
    //var tokenUrl = "http://SVMLWBPE01.mysug.de/sap/opu/odata/sap/ZMM_API_PURCHASEORDER_SERVICE_SRV/$metadata"
    //var orderUrl = "assets/orderResponse.json"
    var tokenUrl = environment.tokenUrl;
    let myHeaders = new HttpHeaders({ Authorization: 'Basic ' + btoa(username + ':' + password)})
    //.set('Accept-Encoding', '*/*')
    .set('x-csrf-token', 'fetch')
    .set('Content-Type', 'application/json');
    return this.http.request('GET',tokenUrl,{headers: myHeaders, responseType: 'text', observe: 'response'} );
    /*return this.http.get<any>(tokenUrl, {
      headers: myHeaders,
      observe: 'response'
    });
    */
  }

  getToken(response: HttpResponse<any>): string {
    //console.log(response);
    console.log(response.headers);
    var token = response.headers.get("X-Csrf-Token");
    console.log("Token: " + token);
    if (token == null) {
      return "";
    }
    return token;
  }


}

/* -- Wareneingang buchen --
Hallo Zusammen, 
zum Absetzen eines Posts zur Bestelländerung / Warenbuchung bitte den Service "ZMM_API_PURCHASEORDER_SERVICE_SRV" verwenden. Die nachfolgenden Informationen sollten ausreichen sein 
um ein POST Nachricht abzusetzen. Die Informationen sollten ausreichend sein um den Service vollständig zu implementieren. Die Verbuchung der Bestelldaten übernehme ich kommende Woche, das 
hat kein Einfluss auf den Service. Die Logik werde ich erst einhängen sobald du für den Test bereit bist. 

 
Beschreibung 
Der Service liefert zu jeder Bestellung eine eindeutige Fehler Nachricht "TYPE = E" oder eine Erfolgsmeldung "TYPE = S". Die Meldung muss über eine leeres Array explizit angefordert werden, 
beim Empfang der Anfrage im ERP wird die Nachricht zu Beginn in der Tabelle "ZMM_API_PODATA / ZMM_API_POHEAD" gehalten um später nachzuvollziehen zu können was passiert ist. 

Positionen welche neu erfasst werden, welche neu einer Bestellung zugeordnet werden müssen sollte mit dem Kennzeichen PoManu = "X" gekennzeichnet werden und einer beliebigen Positionsnummer
möglichst maximal 5 Stellen numerisch. Bspw. 90001, 90002 usw. Jede Übertragung wird als Paket betrachtet, das heißt bei erfolgreicher Übermittlung erfolgt eine  Generierung der PoGuid, 
die PoGuid kann in der Mitteilungen / Nachrichten zur Bestellung dem Anwender zusätzlich mitgeteilt werden. Ein Logging der Guid und der jeweiligen Meldung sollte in der externen Anwendung erfolgen. 

Details zur Übermittlung können dann mittels der Guid im ERP erfragt werden. Ähnelt daher den Ablauf wie in anderen Projekten wo im Grunde für jede Übertragung eine VorgangsId ermittelt werden, 
um bei Telefonischer Rückfrage schneller das Problem zu finden. 
•	Bei Erfassung eine Menge zu einer Bestellposition bedarf es lediglich die Übermittlung: Bestellnummer, Bestellposition und Menge und Verkaufsmengeneinheit 
•	Bei neu Erfassung einer Position bedarf es allen notwendigen Informationen zur Eröffnung einer Bestellposition, es findet daher keine Anreicherung der Daten statt.   
Inhaltliche Fehler: Ausnahme (falsche Datentypen: Statt Zahl ein Text im Dezimalfeld) führen nicht zu Abruch mittels HTTP Code. Fehler in der Buchung sind dem Result Array zu entnehmen., die Felder Type, Message und PoGuid sind wichtig für den Anwender.   
Die Anmeldung erfolgt per http-Authentifikation. Austausch findet gesichert über https statt.  
 
Zur Prüfung auf Seiten des Aufrufers 
Prüfung der CA Stelle, laut meinen Test ist das hinterlegte Root Zertifikat zur Adresse nicht vertrauensvoll. Bitte um Prüfung ob man Seiten des Aufrufers zum selben 
Ergebnis kommt um eine Attacke eines „Man in the Middle“ zu verhindern, bedarf es einer vertrauensvollen Kommunikation. Bitte daher nur Vorab (Benutzer/Passwort) 
Verwenden, die eine reduzierte Berechtigung haben.  
 
Authentifizierung 
HTTP-Authentifikation 

Http Status Codes 
https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 
Service Beschreibung 
GET http://SVMLWBPE01.mysug.de:80/sap/opu/odata/sap/ZMM_API_PURCHASEORDER_SERVICE_SRV/$metadata
GET http://SVMLWBPE01.mysug.de:80/sap/opu/odata/sap/ZMM_API_PURCHASEORDER_SERVICE_SRV/$metadata?sap-documentation=all

HTTP Header

Im SAP-Standard erfolgt die Antwort als Xml Baum. Um die Antwort als Jason zu forden, muss das dem Server per HTTP Attribute mitgeteilt werden
-----------
Header-Name: Accept
Header-Wert: application/JSON
-----------

 
Abfrage: 
Ungesichert: GET http://SVMLWBPE01.mysug.de:80/sap/opu/odata/sap/ZMM_API_PURCHASEORDER_SERVICE_SRV/PurchaseOrderSet 
  
 
Gesichert: GET https://SVMLWBPE01.mysug.de:443/sap/opu/odata/sap/ZMM_API_PURCHASEORDER_SERVICE_SRV/PurchaseOrderSet


*/

/* -- Offene Bestellungen abrufen --
Hallo Zusammen, 
zur Abfrage der offene Bestellungen bitte den Service „ZMM_API_PURCHASEORDER_SERVICE_SRV“ verwenden. Die nachfolgenden Informationen sollten ausreichen sein 
um die offene Bestellung zu ermitteln.   
 
Beschreibung 
Der Service ermittelt auf Basis einer Query bestehend aus entweder Bestellnummer oder Lieferantennummer und des zugehörigen Werks die offenen Bestellung(en). 
Es ist immer wichtig das Werk und eine der weiteren Informationen mitzugeben, ein komplett Abzug aller Bestellungen zu einem Werk wird nicht gestützt aufgrund der zu erwartenden großen Datenmenge. 
Die Anmeldung erfolgt per http-Authentifikation. Austausch findet gesichert über https statt.  
 
Authentifizierung 
HTTP-Authentifikation 
 
Service Beschreibung 
GET http://SVMLWBPE01.mysug.de:80/sap/opu/odata/sap/ZMM_API_PURCHASEORDER_SERVICE_SRV/$metadata
GET  http://SVMLWBPE01.mysug.de:80/sap/opu/odata/sap/ZMM_API_PURCHASEORDER_SERVICE_SRV/$metadata?sap-documentation=all
 
Abfrage: 
Ungesichert: GET http://SVMLWBPE01.mysug.de:80/sap/opu/odata/sap/ZMM_API_PURCHASEORDER_SERVICE_SRV/SearchOpenPurchaseOrderSet?$filter=Vendor eq '12044' and Plant eq '1000'
Ungesichert: GET http://SVMLWBPE01.mysug.de:80/sap/opu/odata/sap/ZMM_API_PURCHASEORDER_SERVICE_SRV/SearchOpenPurchaseOrderSet?$filter=PoNumber eq '400000112' and Plant eq '1000'
 
 
Gesichert: GET https://SVMLWBPE01.mysug.de:443/sap/opu/odata/sap/ZMM_API_PURCHASEORDER_SERVICE_SRV/SearchOpenPurchaseOrderSet?$filter=Vendor eq '12044' and Plant eq '1000'
Gesichert: GET https://SVMLWBPE01.mysug.de:443/sap/opu/odata/sap/ZMM_API_PURCHASEORDER_SERVICE_SRV/SearchOpenPurchaseOrderSet?$filter=PoNumber eq '400000112' and Plant eq '1000'
 
Antwort per JSON: Anhängen des Parameters „format=json“  
GET http://SVMLWBPE01.mysug.de/sap/opu/odata/sap/ZMM_API_PURCHASEORDER_SERVICE_SRV/SearchOpenPurchaseOrderSet?$filter=PoNumber eq '400000112' and Plant eq '1000'&$format=json
 
Fehlerfall provozieren per Abfrage:
GET  http://SVMLWBPE01.mysug.de/sap/opu/odata/sap/ZMM_API_PURCHASEORDER_SERVICE_SRV/SearchOpenPurchaseOrderSet?&$format=json
 
 
 
Beispiele
 
Positiver Test (http://SVMLWBPE01.mysug.de:80/sap/opu/odata/sap/ZMM_API_PURCHASEORDER_SERVICE_SRV/SearchOpenPurchaseOrderSet?$filter=PoNumber eq '400000112' and Plant eq '1000'&$format=json) 
Ermitteln der Bestellung 4000000112 zum Werk 1000 
 
{
  "d" : {
    "results" : [
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
    ]
  }
}
 
Negativer Test (http://SVMLWBPE01.mysug.de:80/sap/opu/odata/sap/ZMM_API_PURCHASEORDER_SERVICE_SRV/SearchOpenPurchaseOrderSet?$format=json) 
1.	Keine Daten ermittelt 
 
{
  "d" : {
    "results" : [

    ]
  }
}
 
Viele Grüße
Daniel Lange
0151-20110820
*/