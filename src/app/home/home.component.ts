import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ElectronService, DatabaseService } from '../core/services';
import { FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  form = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    file: new FormControl(''),
  });

  data: [];

  constructor(private router: Router, private databaseService: DatabaseService) {

    this.databaseService.table('forms').insert([{ a: 5 }, { a: 42 }]).then(res => {
      console.log(res);
    })


  }

  async ngOnInit(): Promise<void> {

    this.loadData();
  }

  loadData() {
    this.databaseService.table('forms').find({}).then(res => {
      this.data = res;
    })
  }

  onFileChange(event) {
    let reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.form.patchValue({
          file: reader.result
        });

      };
    }
  }

  onSubmit() {
    var obj = this.form.value;
    this.databaseService.table('forms').insert(obj).then(res => {
      console.log(res);
      this.loadData();
    })
    this.form.reset();
  }


}
