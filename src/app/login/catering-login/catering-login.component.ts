import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { LoginSharedService } from '../login-shared.service';

@Component({
  selector: 'app-catering-login',
  templateUrl: './catering-login.component.html',
  styleUrls: ['./catering-login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CateringLoginComponent implements OnInit {
  @ViewChild('container') container: ElementRef<HTMLDivElement>;

  public loginForm: FormGroup;

  constructor(
    fb: FormBuilder,
    private authService: AuthService,
    private sharedService: SharedService,
    private loginSharedService: LoginSharedService
  ) {
    this.loginForm = fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.sharedService.validateFormFields(this.loginForm);
  }

  async login() {
    this.sharedService.startBlockUI();

    try {
      var data = null;

      const formValue = this.loginForm.value;
      data = await this.authService.loginCatering(formValue.login, formValue.password);

      this.loginSharedService.handleToken(data.token, "/catering");
    } catch (err) {
      this.sharedService.showRequestError(err);
    }

    this.sharedService.stopBlockUI();
  }
}
