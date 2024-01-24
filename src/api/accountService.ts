import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../environments/environment';

@Injectable()
export class AccountService {
  constructor(private http: HttpClient) { }
  //loginUrl = "http://SVMLWBPE01.mysug.de:80/sap/opu/odata/sap/ZMM_API_USER_SERVICE_SRV/ParameterSet('WRK')?$format=json";
  //loginUrl = "https://SVMLWBPE01.mysug.de:443/sap/opu/odata/sap/ZMM_API_USER_SERVICE_SRV/ParameterSet('WRK')?$format=json"
  //loginUrl = "assets/user.json"
  loginUrl = environment.loginUrl;
  login(username: string, password : string):Observable<HttpResponse<String>> {
    
    var buffer = btoa(username + ':' + password);
    //console.log(buffer);
    let myHeaders = new HttpHeaders({ Authorization: 'Basic ' + btoa(username + ':' + password) });
    //myHeaders.set('Authorization', 'Basic ' + buffer)
    myHeaders.set('Content-Type', 'application/json')
    return this.http.get<String>(this.loginUrl, {
        headers: myHeaders,
        observe: 'response',
    });
  }

}

/*
Hallo Zusammen, 
zur Abfrage des Werks bitte den Service „ZMM_API_USER_SERVICE_SRV“ verwenden. Die nachfolgenden Informationen sollten ausreichend sein um einen User im SAP zu prüfen, 
und das zugehörige Werks zu ermitteln. 


Beschreibung 
Der Service ermittelt auf Basis der übergebenen Parameter IDs die entsprechende Vorbelegung im System. Mit Abfrage des Parameter („WRK“) ermittelt man das zugehörige Werk 
zum Benutzer. Der Benutzer wird dem Service per http-Authentifikation übermittelt. Austausch findet gesichert über https statt.  
 
Zu Prüfung auf Seiten des Aufrufers 
Prüfung der CA Stelle, laut meinen Test ist das hinterlegte Root Zertifikat zur Adresse nicht vertrauensvoll. Bitte um Prüfung ob man Seiten des Aufrufers zum selben 
Ergebnis kommt um eine Attacke eines „Man in the Middle“ zu verhindern, bedarf es einer vertrauensvollen Kommunikation. Bitte daher nur Vorab (Benutzer/Passwort) 
Verwenden, die eine reduzierte Berechtigung haben.  
 
Authentifizierung 
HTTP-Authentifikation
 
Http Status Codes 

https://developer.mozilla.org/en-US/docs/Web/HTTP/Status


Service Beschreibung 
GET http://SVMLWBPE01.mysug.de:80/sap/opu/odata/sap/ZMM_API_USER_SERVICE_SRV/$metadata
GET http://SVMLWBPE01.mysug.de:80/sap/opu/odata/sap/ZMM_API_USER_SERVICE_SRV/$metadata?sap-documentation=all
 
Abfrage: 
Ungesichert: GET http://SVMLWBPE01.mysug.de:80/sap/opu/odata/sap/ZMM_API_USER_SERVICE_SRV/ParameterSet('WRK')
Gesichert: GET https://SVMLWBPE01.mysug.de:443/sap/opu/odata/sap/ZMM_API_USER_SERVICE_SRV/ParameterSet('WRK')
 
Antwort per JSON: Anhängen des Parameters „format=json“  
GET http://SVMLWBPE01.mysug.de:80/sap/opu/odata/sap/ZMM_API_USER_SERVICE_SRV/ParameterSet('WRK')?$format=json
 
Fehlerfall provozieren per Abfrage:
GET  http://SVMLWBPE01.mysug.de:80/sap/opu/odata/sap/ZMM_API_USER_SERVICE_SRV/ParameterSet('WRK2')
 
 
Beispiele
 
Positiver Test (http://SVMLWBPE01.mysug.de:80/sap/opu/odata/sap/ZMM_API_USER_SERVICE_SRV/ParameterSet('WRK')?$format=json) 
1.	Der SAP User hat den Parameter “WRK” mit 1100 vorbelegt 
 
 
{
    "d" : {
        "__metadata" : {
        "id" : "http://SVMLWBPE01.mysug.de/sap/opu/odata/sap/ZMM_API_USER_SERVICE_SRV/ParameterSet('WRK')",
        "uri" : "http://SVMLWBPE01.mysug.de/sap/opu/odata/sap/ZMM_API_USER_SERVICE_SRV/ParameterSet('WRK')",
        "type" : "ZMM_API_USER_SERVICE_SRV.Parameter"
        },
        "Uname" : "E.LANGEDA",
        "Parid" : "WRK",
        "Parva" : "1100",
        "Partxt" : "Werk"
  }
}
 
Negativer Test (http://SVMLWBPE01.mysug.de:80/sap/opu/odata/sap/ZMM_API_USER_SERVICE_SRV/ParameterSet('WRK2')?$format=json) 
1.	Der SAP User hat den Parameter „WRK2“ initial 
{
  "d" : {
    "__metadata" : {
      "id" : "http://SVMLWBPE01.mysug.de/sap/opu/odata/sap/ZMM_API_USER_SERVICE_SRV/ParameterSet('WRK2')",
      "uri" : "http://SVMLWBPE01.mysug.de/sap/opu/odata/sap/ZMM_API_USER_SERVICE_SRV/ParameterSet('WRK2')",
      "type" : "ZMM_API_USER_SERVICE_SRV.Parameter"
    },
    "Uname" : "E.LANGEDA",
    "Parid" : "WRK2",
    "Parva" : "",
    "Partxt" : ""
  }
}

*/