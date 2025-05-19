import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ZoneService, Zone } from '../../services/zone.service';

@Component({
  selector: 'app-zone-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './zone-list.component.html',
  styleUrls: ['./zone-list.component.css']
})
export class ZoneListComponent implements OnInit {
  zones: Zone[] = [];
  selectedZone?: Zone;
  zoneToEdit: Partial<Zone> = {};
  isModalOpen = false;

  constructor(private zoneService: ZoneService) {}

  ngOnInit(): void {
    console.log('ZoneListComponent inicializado');
    this.loadZones();
  }

  loadZones(): void {
    this.zoneService.getActiveZones().subscribe({
      next: (data) => {
        console.log('Zonas recibidas:', data);
        this.zones = data;
      },
      error: (err) => console.error('Error al obtener zonas activas:', err),
    });
  }

  createZone(): void {
    this.zoneService.createZone(this.zoneToEdit).subscribe({
      next: () => {
        console.log('Zona creada con éxito');
        this.loadZones();
        this.resetZoneForm();
      },
      error: (err) => console.error('Error al crear la zona:', err),
    });
  }

  editZone(zone: Zone): void {
    this.selectedZone = zone;
    this.zoneToEdit = { ...zone };
  }

  updateZone(): void {
    if (!this.selectedZone || !this.selectedZone._id) return;

    this.zoneService.updateZone(this.selectedZone._id, this.zoneToEdit as Zone).subscribe({
      next: (updatedZone) => {
        console.log('Zona actualizada:', updatedZone);
        this.loadZones();
        this.resetZoneForm();
      },
      error: (err) => console.error('Error actualizando la zona:', err),
    });
  }

 deleteZone(id: string): void {
  this.zoneService.deleteZone(id).subscribe({
    next: () => {
      console.log('Zona eliminada');
      this.loadZones(); // Recarga la lista después de eliminar
    },
    error: (err) => console.error('Error eliminando la zona:', err),
  });
}


  resetZoneForm(): void {
    this.selectedZone = undefined;
    this.zoneToEdit = { name: '', description: '', officeId: '', status: 'ACTIVE' };
  }

  // Métodos para manejar el modal
  openCreateModal(): void {
    this.resetZoneForm();
    this.isModalOpen = true;
  }

  openEditModal(zone: Zone): void {
    this.editZone(zone);
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  saveZone(): void {
    if (this.selectedZone) {
      this.updateZone();
    } else {
      this.createZone();
    }
    this.closeModal();
  }
}
