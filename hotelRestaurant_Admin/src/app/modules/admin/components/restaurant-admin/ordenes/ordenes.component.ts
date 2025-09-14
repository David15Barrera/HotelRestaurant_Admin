import { Component, inject, OnInit } from '@angular/core';
import { OrderService } from '../../../../client/services/order.service';
import { Order } from '../../../../client/models/order.model';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RestaurantService } from '../../../../client/services/restaurant.service';
import { Restaurant } from '../../../../client/models/restaurant.model';
import { finalize } from 'rxjs';
import { CustomerService } from '../../../services/customer.service';
import { Customer } from '../../../models/customer.model';
@Component({
  selector: 'app-ordenes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './ordenes.component.html',
  styleUrl: './ordenes.component.scss'
})
export class OrdenesComponent implements OnInit {
  private router = inject(Router);
  orders: (Order & { restaurantName?: string })[] = [];
  restaurants: Restaurant[] = [];
  loading = true;

  showModal = false;
  isEditing = false;
  selectedOrder: Partial<Order> = {};


  constructor(
    private orderService: OrderService,
    private restaurantService: RestaurantService
  ) {}

  ngOnInit(): void {
    this.loadRestaurants();
    this.loadOrders();
  }

  loadRestaurants() {
    this.restaurantService.getAll().subscribe({
      next: (res) => (this.restaurants = res),
      error: (err) => console.error('Error al cargar restaurantes:', err),
    });
  }

  loadOrders() {
    this.loading = true;
    this.orderService.getAll().subscribe({
      next: (res) => {
        this.orders = res.map(order => {
          const restaurant = this.restaurants.find(r => r.id === order.restaurantId);
          return { ...order, restaurantName: restaurant?.name || 'Sin restaurante' };
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar órdenes:', err);
        this.loading = false;
      }
    });
  }

  openCreateModal() {
    this.isEditing = false;
    this.selectedOrder = {
      totalPrice: 0,
      discountPercentage: 0,
      status: 'PENDIENTE'
    };
    this.showModal = true;
  }

  openEditModal(order: Order) {
    if (order.status !== 'PENDIENTE') {
      alert('Solo se pueden editar órdenes pendientes');
      return;
    }
    this.isEditing = true;
    this.selectedOrder = { ...order };
    this.showModal = true;
  }

saveOrder() {
  if (!this.selectedOrder.customerId || !this.selectedOrder.restaurantId || !this.selectedOrder.status) {
    alert('Todos los campos son obligatorios');
    return;
  }

  // Convertir a número para evitar errores
  let totalPrice = Number(this.selectedOrder.totalPrice) || 0;
  const discountPercentage = Number(this.selectedOrder.discountPercentage) || 0;

  // Solo al crear calculamos el total con descuento
  if (!this.isEditing && discountPercentage > 0) {
    totalPrice = totalPrice - (totalPrice * discountPercentage / 100);
  }

  const payload: Partial<Order> = {
    customerId: this.selectedOrder.customerId,
    restaurantId: this.selectedOrder.restaurantId,
    totalPrice: totalPrice,
    discountPercentage: discountPercentage,
    promotionId: this.selectedOrder.promotionId,
    status: this.selectedOrder.status
  };

  if (this.isEditing && this.selectedOrder.id) {
    // EDITAR
    this.orderService.update(this.selectedOrder.id, payload).subscribe({
      next: () => { this.loadOrders(); this.closeModal(); },
      error: err => console.error('Error al actualizar orden:', err)
    });
  } else {
    // CREAR
    this.orderService.create(payload).subscribe({
      next: () => { this.loadOrders(); this.closeModal(); },
      error: err => console.error('Error al crear orden:', err)
    });
  }
}

  deleteOrder(id: string) {
    if (!confirm('¿Seguro que deseas eliminar esta orden?')) return;

    this.orderService.delete(id).subscribe({
      next: () => this.loadOrders(),
      error: err => console.error('Error al eliminar orden:', err)
    });
  }

  goToDetails(orderId: string) {
    // Aquí puedes usar un router.navigate a /orders/:id
    console.log('Ir a detalles de la orden:', orderId);
    this.router.navigate(['admin/ordenes-admin', orderId]);
//    router.navigate()
  }

  closeModal() {
    this.showModal = false;
    this.selectedOrder = {};
  }

  get discountedTotal(): number {
  const total = Number(this.selectedOrder.totalPrice) || 0;
  const discount = Number(this.selectedOrder.discountPercentage) || 0;
  return total - (total * discount / 100);
}

applyDiscount() {
  const total = Number(this.selectedOrder.totalPrice) || 0;
  const discount = Number(this.selectedOrder.discountPercentage) || 0;
  this.selectedOrder.totalPrice = total - (total * discount / 100);
}

}