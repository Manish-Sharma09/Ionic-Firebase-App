import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup = this.formBuilder.group({
    email: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),
      ],
    ],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit() {
    // Initialization already done in the declaration
  }

  get errorControl() {
    return this.loginForm.controls;
  }

  async login() {
    const loading = await this.loadingCtrl.create({
      message: 'Logging in...',
    });
    await loading.present();

    if (this.loginForm.valid) {
      this.authService
        .loginUser(this.loginForm.value.email, this.loginForm.value.password)
        .then(async (user) => {
          await loading.dismiss();
          this.router.navigate(['/home']);
        })
        .catch(async (error) => {
          await loading.dismiss();
          const alert = await this.alertCtrl.create({
            header: 'Login Failed',
            message: error.message,
            buttons: ['OK'],
          });
          await alert.present();
        });
    } else {
      await loading.dismiss();
      const alert = await this.alertCtrl.create({
        header: 'Invalid Data',
        message: 'Please provide valid information.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
}
