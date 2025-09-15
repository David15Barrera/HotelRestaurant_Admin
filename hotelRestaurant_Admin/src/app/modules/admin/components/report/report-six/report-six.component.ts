import { Component, inject, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { RestaurantService } from '../../../../client/services/restaurant.service';
import { OrderService } from '../../../../client/services/order.service';
import { OrderDetailService } from '../../../../client/services/order-detail.service';
import { CustomerService } from '../../../services/customer.service';
import { Restaurant } from '../../../../client/models/restaurant.model';
import { Order } from '../../../../client/models/order.model';
import { OrderDetail } from '../../../../client/models/order-detail.model';
import { Customer } from '../../../models/customer.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-report-six',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './report-six.component.html',
  styleUrl: './report-six.component.scss'
})
export class ReportSixComponent implements OnInit {

  private restaurantService = inject(RestaurantService);
  private orderService = inject(OrderService);
  private orderDetailService = inject(OrderDetailService);
  private customerService = inject(CustomerService);

  restaurantes: Restaurant[] = [];
  orders: Order[] = [];
  orderDetails: OrderDetail[] = [];
  clientes: Customer[] = [];

  selectedRestaurantId: string | null = null;

  restauranteMasPopular: Restaurant | null = null;
  ordersRestaurante: Order[] = [];
  totalIngresos: number = 0;

  ngOnInit() {
    this.restaurantService.getAll().subscribe(r => this.restaurantes = r);
    this.orderService.getAll().subscribe(o => this.orders = o);
    this.orderDetailService.getAll().subscribe(od => this.orderDetails = od);
    this.customerService.getAll().subscribe(c => this.clientes = c);
  }

  generarReporte() {
    // Filtrar órdenes si se selecciona restaurante
    let ordersFiltradas = this.orders;
    if (this.selectedRestaurantId) {
      ordersFiltradas = this.orders.filter(o => o.restaurantId === this.selectedRestaurantId);
    }

    // Calcular ingresos por restaurante
    const ingresosMap: { [restaurantId: string]: number } = {};
    for (const o of ordersFiltradas) {
      ingresosMap[o.restaurantId] = (ingresosMap[o.restaurantId] || 0) + o.totalPrice;
    }

    // Determinar restaurante con más ingresos
    let maxIngresos = 0;
    let restauranteIdMax: string | null = null;
    for (const [restaurantId, ingresos] of Object.entries(ingresosMap)) {
      if (ingresos > maxIngresos) {
        maxIngresos = ingresos;
        restauranteIdMax = restaurantId;
      }
    }

    this.restauranteMasPopular = this.restaurantes.find(r => r.id === restauranteIdMax) || null;
    this.ordersRestaurante = this.orders.filter(o => o.restaurantId === restauranteIdMax);
    this.totalIngresos = maxIngresos;
  }

  getCustomerName(customerId: string): string {
    const cliente = this.clientes.find(c => c.id === customerId);
    return cliente ? cliente.fullName : customerId;
  }

  descargarPDF() {
    if (!this.restauranteMasPopular) return;

    const doc = new jsPDF();
    doc.text('Restaurante Más Popular', 14, 16);
    doc.text(`Restaurante: ${this.restauranteMasPopular.name}`, 14, 24);
    doc.text(`Total Ingresos: Q${this.totalIngresos.toFixed(2)}`, 14, 32);

    const body = this.ordersRestaurante.map(o => [
      o.id,
      this.getCustomerName(o.customerId),
      o.date,
      `Q${o.totalPrice.toFixed(2)}`
    ]);

    autoTable(doc, {
      head: [['ID Orden', 'Cliente', 'Fecha', 'Total']],
      body: body,
      startY: 40
    });

    doc.save('restaurante-mas-popular.pdf');
  }
}
