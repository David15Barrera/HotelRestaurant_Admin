import { Component, inject, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable, { RowInput } from 'jspdf-autotable';
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
import { DishService } from '../../../../client/services/dish.service';
import { Dish } from '../../../../client/models/dish.model';

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
  private dishService = inject(DishService);

  restaurantes: Restaurant[] = [];
  orders: Order[] = [];
  orderDetails: OrderDetail[] = [];
  clientes: Customer[] = [];
  platos: Dish[] = [];

  selectedRestaurantId: string | null = null;

  restauranteMasPopular: Restaurant | null = null;
  ordersRestaurante: Order[] = [];
  totalIngresos: number = 0;

  ngOnInit() {
    this.restaurantService.getAll().subscribe(r => this.restaurantes = r);
    this.orderService.getAll().subscribe(o => this.orders = o);
    this.orderDetailService.getAll().subscribe(od => this.orderDetails = od);
    this.customerService.getAll().subscribe(c => this.clientes = c);
    this.dishService.getAll().subscribe(d => this.platos = d);
  }

  generarReporte() {
    let ordersFiltradas = this.orders;
    if (this.selectedRestaurantId) {
      ordersFiltradas = this.orders.filter(o => o.restaurantId === this.selectedRestaurantId);
    }

    const ingresosMap: { [restaurantId: string]: number } = {};
    for (const o of ordersFiltradas) {
      ingresosMap[o.restaurantId] = (ingresosMap[o.restaurantId] || 0) + o.totalPrice;
    }

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

  getDishesByOrder(orderId: string) {
    const detalles = this.orderDetails.filter(od => od.orderId === orderId);
    return detalles.map(od => {
      const plato = this.platos.find(p => p.id === od.dishId);
      return {
        nombre: plato ? plato.name : od.dishId,
        cantidad: od.quantity,
        subtotal: od.subtotal
      };
    });
  }

descargarPDF() {
  if (!this.restauranteMasPopular) return;

  const doc = new jsPDF();
  const docAny = doc as any; // ⚡ decimos a TS que acepte cualquier cosa

  doc.text('Restaurante Más Popular', 14, 16);
  doc.text(`Restaurante: ${this.restauranteMasPopular.name}`, 14, 24);
  doc.text(`Total Ingresos: Q${this.totalIngresos.toFixed(2)}`, 14, 32);

  for (const o of this.ordersRestaurante) {
    doc.text(
      `Orden: ${o.id} | Cliente: ${this.getCustomerName(o.customerId)} | Fecha: ${o.date}`,
      14,
      docAny.lastAutoTable ? docAny.lastAutoTable.finalY + 10 : 40
    );

    const detalles = this.getDishesByOrder(o.id).map(d => [
      d.nombre,
      d.cantidad,
      `Q${d.subtotal.toFixed(2)}`
    ]);

    autoTable(doc, {
      head: [['Platillo', 'Cantidad', 'Subtotal']],
      body: detalles as RowInput[],
      startY: docAny.lastAutoTable ? docAny.lastAutoTable.finalY + 15 : 50
    });
  }

  doc.save('restaurante-mas-popular.pdf');
}

}