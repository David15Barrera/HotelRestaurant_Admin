import { Injectable } from '@angular/core';
import { environments, environmetsHotel, environmentRest, environmentProm, environmentReviw } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {

  API_BASE = environments.API_URL;
  API_HOTELBASE = environmetsHotel.API_URL;
  API_RESTABASE = environmentRest.API_URL;
  API_PROMOTBASE = environmentProm.API_URL;
  API_REVIEWBASE = environmentReviw.API_URL;
  // AUTH
  API_AUTH = `${this.API_BASE}/v1/auth`;
  API_EMPLOYEE = `${this.API_BASE}/v1/employee`;
  API_CUSTOMER = `${this.API_BASE}/api/v1/customers`;

  //Hotel:
  API_HOTEL = `${this.API_HOTELBASE}/api/v1/hotels`;
  API_ROOMS = `${this.API_HOTELBASE}/api/v1/rooms`;
  API_RESERVAS = `${this.API_HOTELBASE}/api/v1/reservations`;

  //Restaurante
  API_RESTAURANT = `${this.API_RESTABASE}/api/restaurants`;
  API_ORDER = `${this.API_RESTABASE}/api/orders`;
  API_DISHES = `${this.API_RESTABASE}/api/dishes`;
  API_ORDERDETAIL = `${this.API_RESTABASE}/api/order-details`;
  
  //Promociones
  API_PROMOTIONS = `${this.API_PROMOTBASE}/api/v1/promotions`;

  //Reviews
  API_REVIEWS = `${this.API_REVIEWBASE}/v1/reviews`;

}
