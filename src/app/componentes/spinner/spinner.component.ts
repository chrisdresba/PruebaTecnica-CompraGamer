import { Component } from '@angular/core';
import { SpinnerService } from 'src/app/shared/services/spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent {
  public isLoading = this.service.isLoading;

  constructor(private readonly service: SpinnerService) {
    this.isLoading = this.service.isLoading;
  }

  ngOnInit(): void {}
}
