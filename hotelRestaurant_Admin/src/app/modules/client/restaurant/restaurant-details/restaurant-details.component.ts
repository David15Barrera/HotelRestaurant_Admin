import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';
import { LocalTime, Restaurant } from '../../models/restaurant.model';
import { DishService } from '../../services/dish.service';
import { Dish } from '../../models/dish.model';
import { OrderService } from '../../services/order.service';
import { OrderDetailService } from '../../services/order-detail.service';
import { Order } from '../../models/order.model';
import { OrderDetail } from '../../models/order-detail.model';
import { Promotion } from '../../models/promotiones.model';
import { PromotionService } from '../../services/promotiones.service';

interface CartItem {
  dish: Dish;
  quantity: number;
  promotion: Promotion | null;
}
@Component({
  selector: 'app-restaurant-details',
  standalone: true,
  imports: [],
  templateUrl: './restaurant-details.component.html',
  styleUrl: './restaurant-details.component.scss'
})
export class RestaurantDetailsComponent implements OnInit {
  private restaurantService = inject(RestaurantService);
  private dishService = inject(DishService);
  private orderService = inject(OrderService);
  private orderDetailService = inject(OrderDetailService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private promotionService = inject(PromotionService);

  restaurant?: Restaurant;
  dishes: Dish[] = [];
  showMenu = false;
  promotions: Promotion[] = [];
  cart: CartItem[] = [];

    ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.restaurantService.getById(id).subscribe({
        next: (data) => {
          this.restaurant = data;

          // cargar promociones del restaurante
          this.promotionService.getByRestaurant(data.id).subscribe({
            next: (promos) => this.promotions = promos,
            error: (err) => console.error('Error al obtener promociones:', err)
          });
        },
        error: (err) => console.error('Error al obtener restaurante:', err)
      });
    }
  }
  irOpiniones(hotelId: string) {
    this.router.navigate(['/client/hoteles-detail', hotelId]);
  }

  irAlMenu(restaurantId: string) {
    this.dishService.getByRestaurant(restaurantId).subscribe({
      next: (data) => { this.dishes = data; this.showMenu = true; },
      error: (err) => console.error('Error al obtener menú:', err)
    });
  }

 irArReviews(restaurantId: string) {
    this.router.navigate(['/client/ver-Reviews', restaurantId]);
  }

  // Añadir al carrito
addToCart(dish: Dish) {

  const promo = this.promotions.find(p => p.dishId === dish.id);

  const item = this.cart.find(i => i.dish.id === dish.id);
  if (item) {
    item.quantity++;
  } else {
    this.cart.push({ dish, quantity: 1, promotion: promo || null });
  }
}

  removeFromCart(dishId: string) {
    this.cart = this.cart.filter(i => i.dish.id !== dishId);
  }

 getTotal() {
  return this.cart.reduce((sum, item) => {
    let price = item.dish.price * item.quantity;

    if (item.promotion) {
      const discount = (price * item.promotion.discountPercentage) / 100;
      price -= discount;
    }

    return sum + price;
  }, 0);
}

confirmarPedido() {
  if (!this.restaurant) return;

  let customerId: string | null = null;
  const session = localStorage.getItem('session');
  if (session) {
    try {
      const parsed = JSON.parse(session);
      customerId = parsed.customerId;
    } catch (e) {
      console.error('Error al parsear la sesión del localStorage:', e);
      alert('Error al entontrar al Usuario');
      return;
    }
  }


  if (!customerId) {
    console.error('No se encontró el customerId en la sesión.');
    return;
  }

  const orderData: Partial<Order> = {
    customerId: customerId,
    restaurantId: this.restaurant.id,
    totalPrice: this.getTotal(),
    discountPercentage: 0,   
    promotionId: undefined,
    status: 'PENDIENTE'
  };

  this.orderService.create(orderData).subscribe({
    next: (order) => {
      // Crear detalles de la orden
      this.cart.forEach(item => {
        const detail: Partial<OrderDetail> = {
          orderId: order.id,
          dishId: item.dish.id,
          quantity: item.quantity,
          unitCost: item.dish.price,
          unitPrice: item.dish.price,
          discountPercentage: item.promotion ? item.promotion.discountPercentage : 0,
          promotionId: item.promotion ? item.promotion.id : undefined
        };
        this.orderDetailService.create(detail).subscribe({
          error: (err) => console.error('Error al crear detalle de pedido:', err)
        });
      });

      alert('Pedido creado con éxito!');
      this.cart = [];
      this.showMenu = false;
    },
    error: (err) => console.error('Error al crear pedido:', err)
  });
}

}