import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/authentication.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  regForm: FormGroup = this.formBuilder.group({
    username: ['', [Validators.required]],
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
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public authService: AuthenticationService,
    public router: Router,
    private alertCtrl: AlertController // Add AlertController to show alert messages
  ) {}

  ngOnInit() {
    // Initialization already done in the declaration
  }

  get errorControl() {
    return this.regForm?.controls;
  }

  async signUp() {
    if (this.regForm?.valid) {
      const loading = await this.loadingCtrl.create({
        message: 'Signing up...',
      });
      await loading.present();

      const user = await this.authService
        .registerUser(this.regForm.value.email, this.regForm.value.password)
        .catch((error) => {
          console.log(error);
          loading.dismiss();
          this.showErrorAlert(error.message); // Show error alert if registration fails
        });

      if (user) {
        await loading.dismiss(); // Corrected line
        this.router.navigate(['/home']);
      }
    } else {
      this.showErrorAlert('Please provide valid information.'); // Show alert if form is invalid
    }
  }

  async showErrorAlert(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Error',
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
