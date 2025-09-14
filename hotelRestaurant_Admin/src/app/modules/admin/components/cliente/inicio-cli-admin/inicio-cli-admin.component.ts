import { Component } from '@angular/core';
import { Customer } from '../../../models/customer.model';
import { CustomerService } from '../../../services/customer.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-inicio-cli-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inicio-cli-admin.component.html',
  styleUrl: './inicio-cli-admin.component.scss'
})
export class InicioCliAdminComponent {
  customers: Customer[] = [];
  showModal = false;
  editing = false;
  currentCustomer: Customer = this.getEmptyCustomer();

  constructor(private customerService: CustomerService) {}

  ngOnInit() {
    this.loadCustomers();
  }

  getEmptyCustomer(): Customer {
    return { fullName: '', cui: '', phone: '', email: '', address: '', loyaltyPoints: 0 };
  }

  loadCustomers() {
    this.customerService.getAll().subscribe(data => this.customers = data);
  }

  openModal(edit = false, customer?: Customer) {
    this.editing = edit;
    this.currentCustomer = customer ? { ...customer } : this.getEmptyCustomer();
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveCustomer() {
    if (this.editing && this.currentCustomer.id) {
      this.customerService.update(this.currentCustomer.id, this.currentCustomer).subscribe(() => {
        this.loadCustomers();
        this.closeModal();
      });
    } else {
      this.customerService.create(this.currentCustomer).subscribe(() => {
        this.loadCustomers();
        this.closeModal();
      });
    }
  }

  deleteCustomer(id: string) {
    if (confirm('¿Seguro que deseas eliminar este cliente?')) {
      this.customerService.delete(id).subscribe(() => this.loadCustomers());
    }
  }
}
