import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from 'src/model/order';
import { Material } from 'src/model/material';
import { OrderService } from 'src/api/orderService';
import { ToastrService } from 'ngx-toastr';

import { FormControl, FormGroup } from '@angular/forms';
import { MaterialService } from 'src/api/materialService';
import { OrderToBook } from 'src/model/booking/orderToBook';
import { OrderItem } from 'src/model/booking/orderItem';
import { HeaderTitleService } from 'src/service/headerTitle.service';
import { MyCookieService } from 'src/api/cookieService';

@Component({
  selector: 'app-wareneinang',
  templateUrl: './wareneinang.component.html',
  styleUrls: ['./wareneinang.component.css']
})
export class WareneinangComponent implements OnInit {

  constructor(
    private cookieService: MyCookieService,
    private router: Router,
    private materialService: MaterialService,
    private orderService: OrderService,
    private toastr: ToastrService,
    private headerTitleService: HeaderTitleService
  ) {

  }

  addMaterialForm = new FormGroup({
    amountInput: new FormControl(''),
    matNumberInput: new FormControl(''),
    eanInput: new FormControl(''),
    lieferantennummerForm: new FormControl('',)
  });

  lieferantennummerForm = new FormGroup({
    LieferantennummerNumberInput: new FormControl(''),
  });

  BestellungForm = new FormGroup({
    BestellnummerNumberInput: new FormControl(''),
  });

  username: string = "";
  password: string = "";
  orderNumber: string | undefined;
  showSelectedOrder: boolean = false;
  extendedSearch: boolean = false;
  order: Order | undefined;
  materials: Material[] | undefined = [];
  orderToBook: OrderToBook | undefined;
  newMaterialCounter: number = 0;

  deleteMaterial: Material | undefined;

  displayedPositions: number[] = [];
  selectedPosition: number = -1;

  displayedMaterials: Material[] = [];
  materialsWithDifference: Material[] | undefined;

  displayPositionModal: string = "none";
  displaySupplierModal = "none";
  displayEANModal = "none";
  areYouSureToBook = "none";
  areYouSureToCancel = "none";
  areYouSureToDelete = "none";
  showDifferencesModal = 'none';

  openEANModal(): void {
    this.displayEANModal = "block";
  }

  closeEANModal(): void {
    this.displayEANModal = "none";
    this.displayedMaterials = [];
  }

  openSelectPositionModal(): void {
    this.displayPositionModal = "block";
  }

  closeSelectPositionModal(): void {
    this.displayPositionModal = "none";
  }

  openAreYouSureToBookModal() {
    this.areYouSureToBook = "block";
  }

  closeAreYouSureToBookModal() {
    this.areYouSureToBook = "none";
  }

  openAreYouSureToCancelModal() {
    this.areYouSureToCancel = "block";
  }

  closeAreYouSureToCancelModal() {
    this.areYouSureToCancel = "none";
  }

  openAreYouSureToDeleteModal(mat: Material) {
    this.areYouSureToDelete = "block";
    this.deleteMaterial = mat;
  }

  closeAreYouSureToDeleteModal() {
    this.areYouSureToDelete = "none";
    this.deleteMaterial = undefined;
  }

  closeShowDifferencesModal() {
    this.showDifferencesModal = 'none';
  }

  openShowDifferencesModal() {
    this.showDifferencesModal = 'block';
  }

  displayedColumns: string[] =
    [
      "pos", "Material", "Bezeichnung", "Einheit", "Bestellmenge", "Ist"];

  dataSource: Material[] | undefined = [];

  orders: Map<string, Material[]> = new Map<string, Material[]>();
  dataSourceBestellung: string[] | undefined = [];

  supplierNumber: string | undefined;
  supplierName: string | undefined;
  lieferscheinNummer: string | undefined;

  @ViewChild('lieferscheinNummerInput')
  lieferscheinNummerInputElement!: ElementRef;
  @ViewChild('amountInput')
  amountInputElement!: ElementRef;
  ngOnInit(): void {
    if (!this.isLoggedIn()) {
      console.log("User nicht eingeloggt. Leite um auf Login Seite.")
      this.router.navigate(['/Login']);
    }
    this.username = this.cookieService.get("user");
    this.password = this.cookieService.getSecure("password");
    this.newMaterialCounter = 0;
  }

  isLoggedIn(): boolean {
    return this.cookieService.check("user") && this.cookieService.check("password")
  }

  fetchOrder() {
    if (this.orderNumber == null || this.orderNumber == "") {
      var order = this.BestellungForm.get('BestellnummerNumberInput')?.value;
      if (order != null && order != "") {
        this.orderNumber = order;
      } else {
        this.toastr.warning("Bitte gib eine Bestellnummer an");
        return;
      }
    }
    console.log("Bestellnummer: " + this.orderNumber);

    this.orderService.getOrder(this.username, this.password, this.orderNumber)
      .subscribe(data => {
        //console.log(JSON.stringify(data.body!));
        this.parseOrder(JSON.stringify(data.body!));
        if (this.order != null) {
          this.materialToDataSource(this.order?.materials);
          this.showSelectedOrder = true;
          this.extendedSearch = false;
          this.toastr.success("Bestellung abgerufen", "");
          this.headerTitleService.addTitle(this.order.orderNumber!.toString())
          this.headerTitleService.addTitle(this.order.supplierNumber + " " + this.order.supplierName)
          this.openSupplierNumberModal();
        } else {
          this.toastr.error("Keine Bestellung gefunden", "Fehler");
        }
      },
        error => {
          console.log(error)
          this.toastr.error(error.message, "Fehler");
        }
      )
  }

  fetchOrderBySupplierNumber() {
    var supplier = this.lieferantennummerForm.get('LieferantennummerNumberInput')?.value;
    if (supplier != null && supplier != "") {
      this.supplierNumber = supplier;
    } else {
      this.toastr.warning("Bitte gib eine Lieferantennummer an");
      return;
    }

    this.orderService.getOrderBySupplierNumber(this.username, this.password, this.supplierNumber)
      .subscribe(data => {
        //console.log(JSON.stringify(data.body!));
        this.parseOpenOrdersBySupplier(JSON.stringify(data.body!));
        //this.showSelectedOrder = true;
        this.toastr.success("Bestellungen abgerufen", "", {
          positionClass: 'toast-top-right'
        });
      },
        error => {
          console.log(error)
          this.toastr.error(error.message, "Fehler"
          );
        }
      )
  }

  fetchOrderByNumber(orderNumber: string) {
    this.orderNumber = orderNumber;
    this.fetchOrder();
  }

  fetchOrderByInput() {
    if (this.BestellungForm.get('BestellnummerNumberInput')?.value == "" || this.BestellungForm.get('BestellnummerNumberInput')?.value == null) {
      this.toastr.warning("Bitte gib eine Bestellnummer an");
      return;
    }
    this.orderNumber = this.BestellungForm.get('BestellnummerNumberInput')?.value!;
    this.fetchOrder();
  }

  openSupplierNumberModal() {
    this.displaySupplierModal = "block";
    this.focusOnLSInput();
  }

  focusOnLSInput() {
    setTimeout(() => this.lieferscheinNummerInputElement.nativeElement.focus(), 0);
  }

  setSupplierNumber() {
    //console.log("Supplier " + this.lieferscheinNummer);
    if (this.lieferscheinNummer != null && this.lieferscheinNummer != "") {
      this.displaySupplierModal = "none";
      //this.fetchOrder();
    } else {
      this.toastr.error("Bitte eine LS Nummer eingeben", "Fehlende LS Nummer");
    }
  }

  closeSupplierModal() {
    this.displaySupplierModal = "none";
  }

  displayMaterial(mat: Material) {
    if (mat.materialNumber != null) {
      this.addMaterialForm.controls['matNumberInput'].setValue(mat.materialNumber?.toString());
      this.addMaterialForm.controls['eanInput'].setValue("");
      this.addMaterialForm.controls['amountInput'].setValue("");
      this.focusOnAmountInput();
    }
  }

  focusOnAmountInput() {
    this.amountInputElement.nativeElement.focus();
  }

  async addMaterial() {
    this.displayedPositions = [];
    var matnumber = this.addMaterialForm.get('matNumberInput')?.value;
    var ean = this.addMaterialForm.get('eanInput')?.value;
    if(ean == ""){ 
    this.materials?.filter((x) => x.materialNumber?.toString() == matnumber?.toString())
      .forEach(y => {
        if (this.displayedPositions != null) {
          if (y.position != null) {
            this.displayedPositions.push(y.position)
          }
        }
      });
    }

    if (this.displayedPositions.length > 1) {
      this.openSelectPositionModal();
    } else {
      await this.onAddMaterial();
      this.selectedPosition = -1
      this.displayedPositions = [];
    }
    //clear input fields 
    //this.addMaterialForm.controls['matNumberInput'].setValue("");
    //this.addMaterialForm.controls['eanInput'].setValue("");
    //this.addMaterialForm.controls['amountInput'].setValue("");

  }

  selectPosition(pos: number) {
    this.selectedPosition = pos;
    this.closeSelectPositionModal();
    this.onAddMaterial();
    this.selectedPosition = -1
    this.displayedPositions = [];
  }

  selectEANMaterial(mat: Material) {
    this.closeEANModal();
    var searchedMat = this.materials?.find((xmat) => (xmat.materialNumber?.toString() == mat.materialNumber?.toString() &&
      mat.unit == xmat.unit));
    var amount = mat.isAmount;
    if (searchedMat != null) {
      this.calculateAmount(searchedMat, amount!);
    } else {
      this.createNewMaterial(mat, amount!);
      this.materials?.push(mat);
    }
    this.displayedMaterials = [];
  }

  async onAddMaterial() {
    var ean = this.addMaterialForm.get('eanInput')?.value;
    var amount = Number.parseInt(this.addMaterialForm.get('amountInput')?.value!);
    var matnumber = this.addMaterialForm.get('matNumberInput')?.value;

    if (matnumber != "" && ean != "") {
      this.toastr.warning("Bitte entweder Materialnummer oder EAN angeben.", "Fehler");
      return;
    }
    if (amount == null || Number.isNaN(amount)) {
      this.toastr.warning("Bitte eine Menge angeben", "Fehler");
      return;
    }

    var searchedMat = ean == "" ? this.materials?.find((mat) => (mat.materialNumber?.toString() == matnumber?.toString())) : null;
    var comparePosition = this.selectedPosition == -1 ? searchedMat?.position : this.selectedPosition;

    if (searchedMat == null && matnumber != null && matnumber != "" && this.materials != null && amount != null) {
      console.log(searchedMat + " " + matnumber + " " + amount);
      this.fetchMaterialAndAddToList(matnumber, amount);
      this.clearInput();
      return;
    }

    if (searchedMat == null && ean != null && this.materials != null && amount != null) {
      console.log("EAN: " + ean);
      this.fetchMaterialEAN(ean, amount);
      this.clearInput();
      return;
    }

    this.materials?.forEach(x => {
      if (x.materialNumber?.toString() == matnumber?.toString() && x.position?.toString() == comparePosition?.toString()) {
        this.calculateAmount(x, amount);
      }
    })
    this.clearInput();
  }

  clearInput(){
    this.addMaterialForm.controls['matNumberInput'].setValue("");
    this.addMaterialForm.controls['eanInput'].setValue("");
    this.addMaterialForm.controls['amountInput'].setValue("");
  }

  calculateAmount(mat: Material, amount: number) {
    if (amount != null) {
      if (amount == 0) {
        mat.isAmount = 0;
      } else {
        mat.isAmount = mat.isAmount! + amount

      }
      this.toastr.success("Materialmenge gesetzt", "Erfassung")
      //console.log("Material gesetzt: " + x.materialNumber + " = " + x.isAmount)
      return;
    } else {
      console.log("Amount is null")
      return;
    }
  }

  fetchMaterialAndAddToList(matNumber: string, amount: number): Material {
    this.materialService.getMaterialByMatNumber(this.username, this.password, matNumber)
      .subscribe(data => {
        //console.log(JSON.stringify(data.body!));
        this.parseMaterialAndAddToList(data, amount);
      },
        error => {
          console.log(error)
          this.toastr.error(error.message, "Fehler", {
            positionClass: 'toast-top-right'
          });
          return {};
        }
      )
    return {};
  }

  fetchMaterialEAN(ean: string, amount: number): Material {
    this.materialService.getMaterialByEAN(this.username, this.password, ean)
      .subscribe(data => {
        this.displayedMaterials = this.parseEANMaterials(data, amount);
        this.openEANModal();
      },
        error => {
          console.log(error)
          this.toastr.error(error.message, "Fehler")
          return {};
        }
      )
    return {};
  }

  private parseEANMaterials(data: any, amount: number): Material[] {
    try {
      var tmpMaterial = JSON.parse(JSON.stringify(data.body!));
      var name = tmpMaterial.d.results[0].MatlDesc;
      var materials: Material[] = [];
      tmpMaterial.d.results.forEach((y: any) =>
      y.toMean.results.forEach((x: any) => {
        materials.push(
          {
            materialNumber: x["Material"],
            name: name,
            unit: x["Unit"],
            ean: x["EanUpc"],
            free: false,
            isAmount: amount
          }
        )
      }));
      return materials;
    }

    catch (error) {
      return [];
    }
  }

  private parseMaterialAndAddToList(data: any, amount: number) {
    try {
      var tmpMaterial = JSON.parse(JSON.stringify(data.body!));
      let newMat = this.parseNewMaterial(tmpMaterial.d.results[0]);

      if (newMat != null && amount != null && this.materials != null) {
        console.log("Amount: " + amount);
        this.createNewMaterial(newMat, amount);
      }
      console.log(newMat.materialNumber);
      this.materials?.push(newMat);
      this.toastr.success("Material abgerufen", "", {
        positionClass: 'toast-top-right'
      });
    }
    catch (error) {
      console.log(error)
      this.toastr.error("Material wurde nicht gefunden", "Fehler", {
        positionClass: 'toast-top-right'
      });
    }
  }

  createNewMaterial(newMat: Material, amount: number) {
    newMat.isAmount = amount;
    newMat.sollAmount = 0;
    newMat.orderNumber = this.orderNumber;
    newMat.position = 90000 + (this.newMaterialCounter++) * 10;
    newMat.PoManu = "X";
  }

  deleteSelectedMaterial() {
    if (this.deleteMaterial != undefined) {
      this.deleteNewMaterial(this.deleteMaterial);
    }
    this.closeAreYouSureToDeleteModal();
    this.clearInput();
  }

  deleteNewMaterial(mat: Material) {
    const index = this.materials?.indexOf(mat, 0);
    if (index != null) {
      if (index > -1) {
        this.materials?.splice(index, 1);
        this.newMaterialCounter--;
      }
    }
  }

  changeIsFree(mat: Material) {
    console.log("Checkbox isFree");
    this.clearInput();
    if (mat.free) {
      mat.free = false;
      console.log(mat.free);
      return;
    }
    if (!mat.free) {
      mat.free = true;
      console.log(mat.free);
      return;
    }
  }

  computeAllMaterialsWithDifference() {
    this.materialsWithDifference = this.materials?.filter(material => material.isAmount !== material.sollAmount);
  }

  prepareBooking() {
    if (this.orderNumber == null || this.orderNumber == "0" || this.orderNumber == "") {
      this.toastr.warning("Bitte gib eine Bestellnummer an");
      return;
    }
    if (this.lieferscheinNummer == null || this.lieferscheinNummer == "0" || this.lieferscheinNummer == "") {
      this.toastr.warning("Bitte gib eine Lieferscheinnummer an");
      return;
    }
    this.computeAllMaterialsWithDifference();
    if (this.materialsWithDifference?.length != 0) {
      this.openShowDifferencesModal();
    } else {
      this.book();
    }
    this.closeAreYouSureToBookModal();
  }

  book() {
    this.orderToBook = {
      PurchaseOrderItemSet: [],
      PurchaseOrderResultSet: []
    }

    this.materials?.forEach(mat => {
      this.orderToBook?.PurchaseOrderItemSet.push(
        this.materialToOrderItem(mat)
      )
    })
    this.closeShowDifferencesModal();
    this.bookToSAP(this.orderToBook);

  }

  materialToOrderItem(mat: Material): OrderItem {
    const DEFAULT_PLANT = "9600";
    if (mat.PoManu == "X") {
      return {
        PoItem: mat.position?.toString(),
        PoNumber: this.orderNumber?.toString(),
        PoUnit: mat.unit?.toString(),
        Quantity: mat.isAmount?.toString(),
        DeliveryRefnumber: this.lieferscheinNummer,
        Material: mat.materialNumber,
        Plant: DEFAULT_PLANT,
        PoManu: "X",
        StgeLoc: mat.lagerort
      }
    } else {
      return {
        PoItem: mat.position?.toString(),
        PoNumber: this.orderNumber?.toString(),
        PoUnit: mat.unit?.toString(),
        Quantity: mat.isAmount?.toString(),
        DeliveryRefnumber: this.lieferscheinNummer,
        Material: mat.materialNumber,
        Plant: DEFAULT_PLANT,
        PoManu: "",
        StgeLoc: mat.lagerort
      }
    }
  }

  bookToSAP(orderToBook: OrderToBook) {
    if (this.orderToBook == undefined) {
      this.toastr.warning("Keine Buchung vorhanden");
      return;
    }
    var token = "unused";
    this.orderService.book(this.username, this.password, orderToBook, token)
      .subscribe(data => {
        //console.log(JSON.stringify(data.body!));
        const tmpBookingResponse = JSON.parse(JSON.stringify(data.body!));
        try {
          var messages: string[] = [];
          var isError = false;
          tmpBookingResponse.d.PurchaseOrderResultSet.results.forEach((x: { Message: string; Type: string; }) => {
            if (!messages.includes(x.Message)) {
              messages.push(x.Message);
            }
            if (x.Type == "E") {
              isError = true
            }
          })

          var message = "";
          messages.forEach(x => {
            message = message + "----\n" + x;
          })
          if (isError && messages.length != 0) {
            this.toastr.error(message, "Bestellung konnte nicht gebucht werden", { timeOut: 0, extendedTimeOut: 0 });
            return;
          } else {
            this.toastr.info(message, "Bestellung wurde gebucht. Info", { timeOut: 0, extendedTimeOut: 0 });
          }
        }
        catch (error) {
          console.log(error);
          this.toastr.error("Bestellung konnte nicht gebucht werden");
          return;
        }
        this.showSelectedOrder = false;
        this.extendedSearch = false;
        this.newMaterialCounter = 0;
        this.toastr.success("Bestellung gebucht", "");
        this.clearAll();
      },
        error => {
          console.log(error)
          this.toastr.error(error.message, "Fehler");
        }
      )
  }

  cancel() {
    this.clearAll();
  }

  clearAll() {
    this.order = undefined;
    this.dataSource = [];
    this.orderNumber = undefined;
    this.orderToBook = undefined;
    this.order = undefined;
    this.supplierNumber = undefined;
    this.materials = undefined;
    this.showSelectedOrder = false;
    this.extendedSearch = false;
    this.lieferscheinNummer = undefined;
    this.areYouSureToCancel = "none";
    this.newMaterialCounter = 0;
    this.headerTitleService.setTitle(this.username);
    this.BestellungForm.reset();
    this.addMaterialForm.reset();
    this.lieferantennummerForm.reset();
    this.displayedMaterials = [];
    this.materials = [];
    this.orders = new Map<string, Material[]>();
    this.dataSourceBestellung = [];
  }

  extendSearch() {
    this.extendedSearch = true;
  }

  materialToDataSource(mat: Material[] | undefined) {
    this.dataSource = mat;
  }

  parseOrder(body: string) {
    const tmpOrder = JSON.parse(body);
    try {
      this.order = {
        orderNumber: tmpOrder.d.results[0].PoNumber,
        supplierNumber: tmpOrder.d.results[0].Vendor,
        supplierName: tmpOrder.d.results[0].VendorName1 + " " + tmpOrder.d.results[0].VendorName2 + " " + tmpOrder.d.results[0].VendorName3 + " " + tmpOrder.d.results[0].VendorName4,
        materials: this.parseMaterials(tmpOrder.d.results)
      }
      this.materials = this.order.materials;
      this.supplierNumber = this.order.supplierNumber;
      this.supplierName = this.order.supplierName;
    } catch (error) {
      console.log(error);
      this.toastr.info("Keine Bestellung gefunden");
    }
  }

  parseOpenOrdersBySupplier(body: string) {
    const tmpOrder = JSON.parse(body);
    try {
      var materials = this.parseMaterials(tmpOrder.d.results);
      materials.forEach(mat => {
        if (mat.orderNumber != null) {
          if (!this.orders.has(mat.orderNumber)) {
            this.orders.set(mat.orderNumber, [mat])
            this.dataSourceBestellung?.push(mat.orderNumber);
          } else {
            this.orders.get(mat.orderNumber)?.push(mat);
          }
        }
      });
    } catch (error) {
      console.log(error);
      this.toastr.info("Keine Bestellung gefunden");
    }
  }

  parseMaterials(body: any): Material[] {
    return body.map((item: any) => this.parseMaterial(item));
  }

  parseMaterial(data: any): Material {
    return {
      materialNumber: data["Material"],
      name: data["ShortText"],
      isAmount: 0,
      sollAmount: +(+data["Quantity"]).toFixed(),
      position: +data["PoItem"],
      unit: data["PoUnit"],
      orderNumber: data["PoNumber"],
      ean: data["EanUPC"],
      free: data["FreeItem"],
      lagerort: data["SlocExprc"]
    }
  }

  parseNewMaterial(data: any): Material {
    console.log("Parse Material");
    console.log(data);
    return {
      materialNumber: data["Material"],
      name: data["MatlDesc"],
      isAmount: 0,
      sollAmount: 0,
      unit: data["BaseUom"],
      ean: data["EanUPC"],
      free: false,
      lagerort: data["SlocExprc"]
    }
  }

}
