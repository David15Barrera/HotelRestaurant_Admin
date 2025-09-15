import { Component, inject, OnInit } from '@angular/core';
import { EmployeeService } from '../../../services/employee.service';
import { HotelService } from '../../../../client/services/hotel.service';
import { RestaurantService } from '../../../../client/services/restaurant.service';
import { Restaurant } from '../../../../client/models/restaurant.model';
import { Hotel } from '../../../../client/models/hotel.interface';
import { Employee } from '../../../models/employee.model';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-report-three',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './report-three.component.html',
  styleUrl: './report-three.component.scss'
})
export class ReportThreeComponent implements OnInit {

  private employeeService = inject(EmployeeService);
  private hotelService = inject(HotelService);
  private restaurantService = inject(RestaurantService);

  hoteles: Hotel[] = [];
  restaurantes: Restaurant[] = [];
  restaurantesFiltrados: Restaurant[] = [];

  empleados: Employee[] = [];
  empleadosFiltrados: Employee[] = [];

  selectedHotelId: string | null = null;
  selectedRestaurantId: string | null = null;

  ngOnInit() {
    this.hotelService.getHotels().subscribe(h => this.hoteles = h);
    this.restaurantService.getAll().subscribe(r => this.restaurantes = r);
    this.employeeService.getEmployeesNoManager().subscribe(e => this.empleados = e);
  }

  filtrarRestaurantes() {
    if (!this.selectedHotelId) {
      this.restaurantesFiltrados = this.restaurantes;
      return;
    }
    this.restaurantesFiltrados = this.restaurantes.filter(r => r.hotelId === this.selectedHotelId);
    this.selectedRestaurantId = null;
  }

  generarReporte() {
    this.empleadosFiltrados = this.empleados.filter(e => 
      (!this.selectedHotelId || e.hotelId === this.selectedHotelId) &&
      (!this.selectedRestaurantId || e.restaurantId === this.selectedRestaurantId)
    );
  }

  descargarPDF() {
    const doc = new jsPDF();
    doc.text('Reporte de Empleados', 14, 16);

    const body = this.empleadosFiltrados.map(e => [
      e.fullName,
      e.cui,
      e.phone,
      e.email,
      e.jobPosition,
      e.salary != null ? `Q${e.salary.toFixed(2)}` : 'Q0.00',
      e.jobArea || '-'
    ]);

    autoTable(doc, {
      head: [['Nombre', 'CUI', 'Teléfono', 'Email', 'Cargo', 'Salario', 'Área']],
      body: body,
      startY: 24
    });

    doc.save('reporte-empleados.pdf');
  }
}
