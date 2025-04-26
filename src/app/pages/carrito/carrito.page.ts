import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Para la navegación

// Define una interfaz para la estructura de los artículos (¡Mejora!)
interface CartItem {
  id: number;
  name: string;
  details?: string; // Ejemplo: 'Rojo, Libro Cuento Infantil y Amor...'
  price: number;
  imageUrl: string;
  shippingInfo: string; // Ejemplo: 'Envío gratis'
  selected: boolean; // Para el checkbox
  vendorType: 'international' | 'national'; // Para agrupar si es necesario
}

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
  standalone: false
})
export class CarritoPage implements OnInit {

  cartItems: CartItem[] = []; // Array para guardar los artículos
  selectAll: boolean = false;
  subtotal: number = 0;
  shippingCost: number | string = 0; // Puede ser 'Gratis' o un número
  total: number = 0;

  // Inyecta el Router
  constructor(private router: Router) { }

  ngOnInit() {
    // --- Cargar Datos de Ejemplo (Reemplazar con servicio real) ---
    this.loadSampleData();
    this.calculateSummary();
  }

  loadSampleData() {
    // Simula la carga de datos del carrito
    this.cartItems = [
      {
        id: 1,
        name: 'El Hilo Rojo Libro Cuento Infantil y Amor',
        details: 'Rojo, Libro Amarillo Infantil', // Detalle extra
        price: 9990990, // Precio como número
        imageUrl: 'assets/img/40.jpg', // Usa una imagen de tus assets
        shippingInfo: 'Envío gratis',
        selected: false,
        vendorType: 'international'
      },
      // ... Puedes añadir más artículos de ejemplo aquí
    ];
    this.updateSelectAllState(); // Asegura que 'Seleccionar todo' esté correcto al inicio
  }

  // --- Cálculos ---
  calculateSummary() {
    this.subtotal = this.cartItems
      .filter(item => item.selected) // Suma solo los seleccionados
      .reduce((sum, item) => sum + item.price, 0);

    // 1. Determina el costo de envío NUMÉRICO primero
    let numericShipping = 0; // Valor numérico por defecto

    // Aplica tus reglas de envío aquí. Ejemplo simple: gratis si hay subtotal > 0
    if (this.subtotal > 0) {
       numericShipping = 0; // Es gratis
    } else {
       numericShipping = 0; // También 0 si no hay nada
    }
    // --- FIN Ejemplo Reglas de Envío ---

    // 2. Asigna el valor a MOSTRAR (puede ser 'Gratis' o el número)
    //    Basado en el costo numérico que calculaste.
    this.shippingCost = (numericShipping === 0 && this.subtotal > 0) ? 'Gratis' : numericShipping;

    // 3. Calcula el total usando SIEMPRE valores numéricos
    this.total = this.subtotal + numericShipping; // ¡Ahora ambos son 'number'!
  }
  // --- Manejo de Selección ---
  toggleSelectAll() {
    this.cartItems.forEach(item => item.selected = this.selectAll);
    this.calculateSummary(); // Recalcular al cambiar selección
  }

  onItemSelectChange() {
    this.updateSelectAllState();
    this.calculateSummary(); // Recalcular al cambiar selección
  }

  updateSelectAllState() {
    // Si todos están seleccionados, marca 'Seleccionar todo'
    this.selectAll = this.cartItems.length > 0 && this.cartItems.every(item => item.selected);
  }

  // --- Acciones ---
  removeSelectedItems() {
    // Filtra los items, manteniendo solo los no seleccionados
    this.cartItems = this.cartItems.filter(item => !item.selected);
    console.log('Borrando artículos seleccionados');
    this.updateSelectAllState();
    this.calculateSummary(); // Recalcular después de borrar
    // Aquí llamarías a tu servicio para actualizar el carrito en el backend
  }

  proceedToCheckout() {
    // Navegar a la página de pago (asegúrate que la ruta exista)
    console.log('Continuando al pago...');
    // Filtrar solo los items seleccionados para enviar al checkout
    const itemsToCheckout = this.cartItems.filter(item => item.selected);
    if (itemsToCheckout.length > 0) {
      // this.router.navigateByUrl('/checkout', { state: { items: itemsToCheckout, total: this.total } });
      alert(`Procediendo al pago con ${itemsToCheckout.length} artículo(s) por un total de ${this.total}`);
    } else {
      alert('Por favor, selecciona al menos un artículo para continuar.');
    }
  }

  // Para obtener la cuenta de artículos TOTALES (no solo seleccionados) para el título "Cesta (X)"
  get totalItemCount(): number {
    return this.cartItems.length;
  }

  // Para obtener la cuenta de artículos SELECCIONADOS para el botón "Continuar (X)"
  get selectedItemCount(): number {
    return this.cartItems.filter(item => item.selected).length;
  }

  // Devuelve la primera imagen seleccionada para el resumen (o una por defecto)
  get summaryImageUrl(): string {
      const firstSelectedItem = this.cartItems.find(item => item.selected);
      return firstSelectedItem?.imageUrl || 'assets/img/40.png'; // Cambia por una imagen por defecto si no hay nada seleccionado
  }
}
