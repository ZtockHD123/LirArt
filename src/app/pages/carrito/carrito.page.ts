import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface CartItem {
  id: number;
  name: string;
  details?: string;
  price: number;
  imageUrl: string;
  shippingInfo: string;
  selected: boolean;
  vendorType: 'international' | 'national';
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

  constructor(private router: Router) { }

  ngOnInit() {
    this.loadSampleData();
    this.calculateSummary();
  }

  loadSampleData() {
    this.cartItems = [
      {
        id: 1,
        name: 'El Hilo Rojo Libro Cuento Infantil y Amor',
        details: 'Rojo, Libro Amarillo Infantil',
        price: 9990990,
        imageUrl: 'assets/img/40.jpg',
        shippingInfo: 'Envío gratis',
        selected: false,
        vendorType: 'international'
      },
    ];
    this.updateSelectAllState();
  }

  calculateSummary() {
    this.subtotal = this.cartItems
      .filter(item => item.selected)
      .reduce((sum, item) => sum + item.price, 0);

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

  proceedToCheckout() {
    console.log('Continuando al pago...');
    const itemsToCheckout = this.cartItems.filter(item => item.selected);
    if (itemsToCheckout.length > 0) {
      alert(`Procediendo al pago con ${itemsToCheckout.length} artículo(s) por un total de ${this.total}`);
    } else {
      alert('Por favor, selecciona al menos un artículo para continuar.');
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
