import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { AgGridModule } from 'ag-grid-angular';
import { AppModule } from '../app.module';
import { CheckboxCellRendererComponent } from './checkbox-cell-renderer/checkbox-cell-renderer.component';
import { ImageCellRendererComponent } from './image-cell-renderer/image-cell-renderer.component';
import { ImageGalleryComponent } from './image-gallery/image-gallery.component';
import { ModalConfirmComponent } from './modal-confirm/modal-confirm.component';
import { ModalTemplateComponent } from './modal-template/modal-template.component';
import { ModalWarningComponent } from './modal-warning/modal-warning.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PicturesSelectorComponent } from './pictures/pictures.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { WarningDeletedComponent } from './warning-deleted/warning-deleted.component';

@NgModule({
  declarations: [
    WarningDeletedComponent,
    ModalWarningComponent,
    ModalTemplateComponent,
    PageNotFoundComponent,
    ModalConfirmComponent,
    SidebarComponent,
    CheckboxCellRendererComponent,
    ImageCellRendererComponent,
    ImageGalleryComponent,
    PicturesSelectorComponent,
  ],
  imports: [
    CommonModule,
    MatTabsModule,
    MatSortModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTabsModule,
    MatFormFieldModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatSelectModule,
    MatNativeDateModule,
    MatListModule,
    MatCardModule,
    MatMenuModule,
    RouterModule,
    MatStepperModule,
    MatSliderModule,
    MatBadgeModule,
    MatExpansionModule,
    MatRadioModule,
    MatSlideToggleModule,
    NgxGalleryModule,
  ],
  exports: [
    MatTabsModule,
    MatSortModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTabsModule,
    MatFormFieldModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatSelectModule,
    MatNativeDateModule,
    MatListModule,
    MatCardModule,
    MatMenuModule,
    MatTooltipModule,
    MatBadgeModule,
    WarningDeletedComponent,
    ModalWarningComponent,
    ModalTemplateComponent,
    PageNotFoundComponent,
    RouterModule,
    ModalConfirmComponent,
    MatStepperModule,
    MatSliderModule,
    MatExpansionModule,
    MatRadioModule,
    MatSlideToggleModule,
    SidebarComponent,
    CheckboxCellRendererComponent,
    ImageCellRendererComponent,
    ImageGalleryComponent,
    PicturesSelectorComponent,
  ],
})
export class SharedModule {}
