import { Component, OnInit } from '@angular/core';
import { Promotion } from '../../../client/models/promotiones.model';
import { Hotel } from '../../../client/models/hotel.interface';
import { Restaurant } from '../../../client/models/restaurant.model';
import { Dish } from '../../../client/models/dish.model';
import { PromotionService } from '../../../client/services/promotiones.service';
import { HotelService } from '../../../client/services/hotel.service';
import { RestaurantService } from '../../../client/services/restaurant.service';
import { RoomService } from '../../services/room.service';
import { DishService } from '../../../client/services/dish.service';
import { Room } from '../../models/room.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Customer } from '../../models/customer.model';
import { ReviewService } from '../../../client/services/review.service';
import { CustomerService } from '../../services/customer.service';
import { forkJoin, map } from 'rxjs';
@Component({
  selector: 'app-promotions-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './promotions-admin.component.html',
  styleUrl: './promotions-admin.component.scss'
})
export class PromotionsAdminComponent implements OnInit {
  promotions: Promotion[] = [];
  hotels: Hotel[] = [];
  restaurants: Restaurant[] = [];
  rooms: Room[] = [];
  dishes: Dish[] = [];
  customers: Customer[] = [];

  selectedPromotion: Promotion = this.getEmptyPromotion();
  showModal = false;
  isEditing = false;
  loading = false;

//FILTROS
filterName: string = '';
filterType: string = '';
filterStartDate: string = '';
filterEndDate: string = '';


  constructor(
    private promotionService: PromotionService,
    private hotelService: HotelService,
    private restaurantService: RestaurantService,
    private roomService: RoomService,
    private dishService: DishService,
    private customerService: CustomerService,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    this.loadAllData();
    this.loadPromotions();
  }

  loadAllData() {
    this.hotelService.getHotels().subscribe(data => this.hotels = data);
    this.restaurantService.getAll().subscribe(data => this.restaurants = data);
    this.roomService.getRooms().subscribe(data => this.rooms = data);
    this.dishService.getAll().subscribe(data => this.dishes = data);
    this.customerService.getAll().subscribe(data => this.customers = data);
  }

  loadPromotions() {
    this.loading = true;
    this.promotionService.getAll().subscribe({
      next: data => {
        this.promotions = data;
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  openCreate() {
    this.isEditing = false;
    this.selectedPromotion = this.getEmptyPromotion();
    this.showModal = true;
  }

  openEdit(promotion: Promotion) {
    this.isEditing = true;
    this.selectedPromotion = { ...promotion };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  savePromotion() {
    if (!this.selectedPromotion.name || !this.selectedPromotion.discountPercentage) {
      alert('Nombre y porcentaje de descuento son obligatorios');
      return;
    }

    const promoData: Partial<Promotion> = { ...this.selectedPromotion };

    if (this.isEditing && promoData.id) {
      this.promotionService.update(promoData.id, promoData).subscribe(() => {
        this.loadPromotions();
        this.closeModal();
      });
    } else {
      this.promotionService.create(promoData).subscribe(() => {
        this.loadPromotions();
        this.closeModal();
      });
    }
  }

  deletePromotion(id?: string) {
    if (!id) return;
    if (confirm('¿Está seguro de eliminar esta promoción?')) {
      this.promotionService.delete(id).subscribe(() => this.loadPromotions());
    }
  }

  private getEmptyPromotion(): Promotion {
    return {
      id: '',
      name: '',
      description: '',
      type: '',
      discountPercentage: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      hotelId: undefined,
      restaurantId: undefined,
      roomId: undefined,
      dishId: undefined,
      customerId: undefined
    };
  }

// Habitación más popular
applyPopularRoomPromotion(hotelId: string, discount: number = 10) {
  this.roomService.getRooms().subscribe(rooms => {
    const hotelRooms = rooms.filter(r => r.hotelId === hotelId);
    if (!hotelRooms.length) return;

    const reviewObservables = hotelRooms.map(r => 
      this.reviewService.getByRoom(r.id!).pipe(
        map(reviews => ({
          room: r,
          avgRating: reviews.length ? reviews.reduce((a, rev) => a + rev.rating, 0) / reviews.length : 0
        }))
      )
    );

    forkJoin(reviewObservables).subscribe(results => {
      const popularRoom = results.reduce((prev, curr) => curr.avgRating > prev.avgRating ? curr : prev, { avgRating: -1, room: hotelRooms[0] }).room;

      this.selectedPromotion = {
        ...this.getEmptyPromotion(),
        name: `Promo habitación popular - ${popularRoom.roomNumber}`,
        description: `Descuento del ${discount}% en la habitación más popular`,
        type: 'Habitación popular',
        discountPercentage: discount,
        hotelId,
        roomId: popularRoom.id
      };
      this.showModal = true;        // Abre modal
      this.isEditing = false;       // Indica que es creación
    });
  });
}

// Platillo más popular
applyPopularDishPromotion(restaurantId: string, discount: number = 10) {
  this.dishService.getByRestaurant(restaurantId).subscribe(dishes => {
    if (!dishes.length) return;

    const reviewObservables = dishes.map(d => 
      this.reviewService.getByDish(d.id).pipe(
        map(reviews => ({
          dish: d,
          avgRating: reviews.length ? reviews.reduce((a, rev) => a + rev.rating, 0) / reviews.length : 0
        }))
      )
    );

    forkJoin(reviewObservables).subscribe(results => {
      const popularDish = results.reduce((prev, curr) => curr.avgRating > prev.avgRating ? curr : prev, { avgRating: -1, dish: dishes[0] }).dish;

      this.selectedPromotion = {
        ...this.getEmptyPromotion(),
        name: `Promo platillo popular - ${popularDish.name}`,
        description: `Descuento del ${discount}% en el platillo más popular`,
        type: 'Platillo popular',
        discountPercentage: discount,
        restaurantId,
        dishId: popularDish.id
      };
      this.showModal = true;
      this.isEditing = false;
    });
  });
}

// Clientes más frecuentes (según loyaltyPoints)
applyFrequentCustomerPromotion(discount: number = 10) {
  this.customerService.getAll().subscribe(customers => {
    if (!customers.length) return;

    const frequentCustomer = customers.reduce((prev, curr) =>
      curr.loyaltyPoints > prev.loyaltyPoints ? curr : prev, customers[0]);

    this.selectedPromotion = {
      ...this.getEmptyPromotion(),
      name: `Promo cliente frecuente - ${frequentCustomer.fullName}`,
      description: `Descuento del ${discount}% para clientes frecuentes`,
      type: 'Cliente frecuente',
      discountPercentage: discount,
      customerId: frequentCustomer.id
    };
    this.showModal = true;
  });
}

get filteredPromotions(): Promotion[] {
  return this.promotions.filter(p => {
    const matchesName = p.name.toLowerCase().includes(this.filterName.toLowerCase());
    const matchesType = this.filterType ? p.type === this.filterType : true;

    const start = this.filterStartDate ? new Date(this.filterStartDate) : null;
    const end = this.filterEndDate ? new Date(this.filterEndDate) : null;
    const promoStart = new Date(p.startDate);
    const promoEnd = new Date(p.endDate);

    const matchesDate = (!start || promoEnd >= start) && (!end || promoStart <= end);

    return matchesName && matchesType && matchesDate;
  });
}


}

