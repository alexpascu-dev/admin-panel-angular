import {
  Component,
  NgModule,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  HostListener,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../../../models/user.interface';
import { FormsModule, NgForm } from '@angular/forms';
import { inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UserFormData } from '../../../../../models/userform.interface';
import { Auth } from '../../../../auth/auth';
import { Roles } from '../../../../constants/constants';
import { UserManagementService } from '../../services/user-management-service';

@Component({
  standalone: true,
  selector: 'app-user-form',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSelectModule,
    FormsModule,
  ],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class UserForm implements OnInit {
  @Output() userUpdated = new EventEmitter<void>();
  @Output() userCreated = new EventEmitter<void>();
  @Input() formMode: 'create' | 'edit' = 'create'; // Default to create mode

  UserFormData = {
    userId: 0,
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    role: '',
    isActive: true,
    password: '',
    confirmPassword: '',
  };

  UpdateUserDto = {
    userId: 0,
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    role: '',
    isActive: true,
  };

  public auth = inject(Auth);
  private userManagementService = inject(UserManagementService);

  @HostListener('document:click')
  onAnyClick() {
    this.auth.checkAndLogoutIfExpired();
  }

  roles: string[] = [];
  Roles = Roles;

  @ViewChild('userForm') form!: NgForm;

  editMode: boolean = false;

  onResetClick(): void {
    const emptyForm: UserFormData = {
      userId: 0,
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      role: '',
      isActive: true,
      password: '',
      confirmPassword: '',
    };

    this.UserFormData = emptyForm;
    this.form.resetForm({ ...emptyForm });

    this.editMode = false;
  }

  get canSeeForm() {
    return this.auth.hasAnyRole([Roles.Admin, Roles.Supervisor]);
  }

  get canChangePassword() {
    return this.auth.hasRole(Roles.Admin);
  }

  get canChangeRole() {
    return this.auth.hasRole(Roles.Admin);
  }

  get isCreateMode() {
    return this.formMode === 'create';
  }

  get isEditMode() {
    return this.formMode === 'edit';
  }

  get buttonText() {
    return this.isEditMode ? 'Update User' : 'Create User';
  }

  ngOnInit() {
    // Only load roles for the form
    this.loadRoles();
  }

  loadRoles() {
    const context = this.userManagementService.createContext(this);
    this.userManagementService.loadRoles(context);
    this.roles = context.roles;
  }

  onUserFormSubmit(form: NgForm) {
    const context = this.userManagementService.createContext(this);
    this.userManagementService.onUserFormSubmit(form, context, () =>
      this.onResetClick(),
    );

    // Emit event to parent based on form mode
    if (this.isEditMode) {
      this.userUpdated.emit();
    } else {
      this.userCreated.emit();
    }
  }

  populateFormForEdit(user: User) {
    this.editMode = true;
    this.UserFormData = {
      userId: user.userId,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isActive: user.isActive,
      role: user.role,
      password: '',
      confirmPassword: '',
    };
  }
}
