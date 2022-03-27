import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { LoginSharedService } from '../login-shared.service';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.scss'],
})
export class ConfirmEmailComponent implements OnInit {
  public showError = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private sharedService: SharedService,
    private loginSharedService: LoginSharedService
  ) {}

  public async ngOnInit() {
    const token = this.route.snapshot.queryParams['token'];

    if (token) {
      try {
        await this.authService.confirmEmail(token);
        this.loginSharedService.handleToken(token, null);
      } catch (error) {
        this.showError = true;
        this.sharedService.showRequestError(error);
      }
    }
  }

  public toDashboard() {
    this.router.navigate([this.authService.isCompany() ? '/business' : '/dashboard']);
  }
}
