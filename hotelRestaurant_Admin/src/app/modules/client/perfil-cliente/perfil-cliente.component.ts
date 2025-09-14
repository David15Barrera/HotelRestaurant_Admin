import { Component, inject, OnInit } from '@angular/core';
import { CustomerService } from '../../admin/services/customer.service';
import { Customer } from '../../admin/models/customer.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-perfil-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil-cliente.component.html',
  styleUrl: './perfil-cliente.component.scss'
})
export class PerfilClienteComponent implements OnInit {

  private customerService = inject(CustomerService);

  customer: Customer | null = null;
  loading = true;
  editing = false;

ngOnInit(): void {
  if (typeof window !== 'undefined' && localStorage) {
    const session = localStorage.getItem('session');
    if (session) {
      const parsed = JSON.parse(session);
      console.log("datos :c", parsed);
      const id = parsed.customerId;

if (id) {
  console.log("Consultando cliente en:", `${this.customerService['API']}/${id}`);
  this.customerService.getById(id).subscribe({
    next: (data) => {
      this.customer = data;
      this.loading = false;
    },
    error: (err) => {
      console.error('Error cargando perfil', err);
      this.loading = false;
    }
  });
} else {
        this.loading = false;
      }
    } else {
      this.loading = false;
    }
  }
}


  toggleEdit() {
    this.editing = !this.editing;
  }

  saveChanges() {
    if (this.customer?.id) {
      this.customerService.update(this.customer.id, this.customer).subscribe({
        next: (updated) => {
          this.customer = updated;
          this.editing = false;
          alert('Perfil actualizado correctamente');
        },
        error: (err) => console.error('Error al actualizar', err)
      });
    }
  }
}