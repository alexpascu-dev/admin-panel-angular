import { Component, inject } from '@angular/core';
import { DashboardDataService } from '../../services/dashboard-data.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-reports',
  templateUrl: './user-reports.html',
  standalone: true,
  imports: [FormsModule, CommonModule],  
  styleUrls: ['./user-reports.css']
})
export class UserReports {
  private dataService: DashboardDataService = inject(DashboardDataService);

  startDate: string = '';
  endDate: string = '';
  reportData: any[] = [];
  isLoading: boolean = false;
  showTable: boolean = false;
  isExporting: boolean = false;


  generateReport() {
    if (!this.startDate || !this.endDate) {
      alert('Please select both dates');
      return;
    }

    if (new Date(this.startDate) > new Date(this.endDate)) {
      alert('Start date cannot be after end date');
      return;
    }

    this.isLoading = true;
    this.showTable = false;

    this.dataService.getReportPreview(this.startDate, this.endDate).subscribe({
      next: (data: any[]) => {
        this.reportData = data;
        this.showTable = true;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error generating report:', error);
        alert('Error generating report. Please try again.');
        this.isLoading = false;
      }
    });
  }

  exportReport() {
    this.isExporting = true;
    
    this.dataService.exportReport(this.startDate, this.endDate).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `users_report_${this.startDate}_to_${this.endDate}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.isExporting = false;
      },
      error: (error: any) => {
        console.error('Error exporting report:', error);
        alert('Error exporting report. Please try again.');
        this.isExporting = false;
      }
    });
  }
}