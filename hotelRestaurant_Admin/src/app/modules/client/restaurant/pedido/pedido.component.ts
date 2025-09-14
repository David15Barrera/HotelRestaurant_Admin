import { Component, inject, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';
import { Order } from '../../models/order.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pedido.component.html',
  styleUrl: './pedido.component.scss'
})
export class PedidoComponent implements OnInit {
  private orderService = inject(OrderService);
  private router = inject(Router);

  orders: Order[] = [];
  customerId: string | null = null;

  ngOnInit(): void {
    const session = localStorage.getItem('session');
    if (session) {
      try {
        const parsed = JSON.parse(session);
        this.customerId = parsed.customerId;
      } catch (e) {
        console.error('Error al parsear la sesión del localStorage:', e);
      }
    }

    if (this.customerId) {
      this.orderService.getByCustomer(this.customerId).subscribe({
        next: (data) => this.orders = data,
        error: (err) => console.error('Error al cargar pedidos:', err)
      });
    } else {
      console.error('No se encontró customerId. No se pueden cargar los pedidos.');
      this.router.navigate(['/session/login']);
    }
  }

  verDetalle(orderId: string) {
    this.router.navigate(['/client/pedidos-detail', orderId]);
  }

  cancelarPedido(order: Order) {
    if (confirm('¿Seguro que deseas cancelar este pedido?')) {
      const updatedOrder: Partial<Order> = {
        ...order,
        status: 'CANCELLED'
      };
      this.orderService.update(order.id, updatedOrder).subscribe({
        next: () => {
          order.status = 'CANCELLED';
          alert('Pedido cancelado con éxito');
        },
        error: (err) => console.error('Error al cancelar pedido:', err)
      });
    }
  }
}