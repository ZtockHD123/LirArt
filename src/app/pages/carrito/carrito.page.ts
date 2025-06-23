import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

interface CartItem {
  id: number;
  name: string;
  details?: string;
  price: number;
  imageUrl: string;
  shippingInfo: string;
  selected: boolean;
  vendorType: 'international' | 'national';
  quantity: number;
}

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
  standalone: false
})
export class CarritoPage implements OnInit {

  cartItems: CartItem[] = [];
  selectAll: boolean = false;
  subtotal: number = 0;
  shippingCost: number | string = 0;
  total: number = 0;

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.loadSampleData();
    this.calculateSummary();
  }

  loadSampleData() {
    this.cartItems = [
      {
        id: 1,
        name: 'El Hilo Rojo Libro',
        details: 'Un libro que te conmoverá',
        price: 9990,
        imageUrl: 'assets/img/ventas6.png',
        shippingInfo: 'Envío gratis',
        selected: false,
        vendorType: 'international',
        quantity: 1
      },
      {
        id: 2,
        name: 'Set de Stickers de Minecraft',
        details: 'Paquete de 15 Stickers de Minecraft',
        price: 3000,
        imageUrl: 'assets/img/ventas7.png',
        shippingInfo: 'Envío Estándar',
        selected: false,
        vendorType: 'national',
        quantity: 1
      }
    ];
    this.updateSelectAllState();
  }

  calculateSummary() {
    this.subtotal = this.cartItems
      .filter(item => item.selected)
      .reduce((sum, item) => sum + (item.price * item.quantity), 0);

    let numericShipping = 0;
    if (this.subtotal > 0) {
       numericShipping = 0;
    } else {
       numericShipping = 0;
    }
    this.shippingCost = (numericShipping === 0 && this.subtotal > 0) ? 'Gratis' : numericShipping;
    this.total = this.subtotal + numericShipping;
  }

  // --- Manejo de Selección ---
  toggleSelectAll() {
    this.cartItems.forEach(item => item.selected = this.selectAll);
    this.calculateSummary();
  }

  onItemSelectChange() {
    this.updateSelectAllState();
    this.calculateSummary();
  }

  updateSelectAllState() {
    this.selectAll = this.cartItems.length > 0 && this.cartItems.every(item => item.selected);
  }

  removeSelectedItems() {
    this.cartItems = this.cartItems.filter(item => !item.selected);
    console.log('Borrando artículos seleccionados');
    this.updateSelectAllState();
    this.calculateSummary();
  }

  async proceedToCheckout() {
    console.log('Continuando al pago...');
    const selectedItems = this.cartItems.filter(item => item.selected);

    if (selectedItems.length === 0) {
      alert('Por favor, selecciona al menos un artículo para continuar.');
      return;
    }

    try {
      const paymentItems = selectedItems.map(item => ({
        title: item.name,
        unit_price: Number(item.price),
        quantity: Number(item.quantity)
      }));

      const backendUrl = environment.backendUrl;
      const response: any = await this.http.post(`${backendUrl}/api/create-preference`, { items: paymentItems }).toPromise();

      if (response && response.init_point) {
        window.location.href = response.init_point;
      } else {
        console.error('No se recibió init_point del backend para iniciar el pago.');
        alert('Error al iniciar el pago. Por favor, inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      alert('Hubo un error al procesar tu pago. Por favor, inténtalo de nuevo más tarde.');
    }
  }

  get totalItemCount(): number {
    return this.cartItems.length;
  }

  get selectedItemCount(): number {
    return this.cartItems.filter(item => item.selected).length;
  }

  get summaryImageUrl(): string {
      const firstSelectedItem = this.cartItems.find(item => item.selected);
      return firstSelectedItem?.imageUrl || 'assets/img/40.png';
  }
}