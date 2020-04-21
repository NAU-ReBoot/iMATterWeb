import { Component, OnInit } from '@angular/core';
import { LearningModuleService, LearningModule } from '../../services/learning-module.service';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

/**
 * openModal grabs the "new-learning-module-form" and displays it in the modal
 * see new-learning-module-form for functionality regarding adding a new learning module
 */
@Component({
  selector: 'app-learningmodules',
  templateUrl: './learningmodules.page.html',
  styleUrls: ['./learningmodules.page.scss'],
})
export class LearningmodulesPage implements OnInit {

  public learningModules: Observable<LearningModule[]>;
  
  constructor(public learningModService: LearningModuleService,
              public router: Router,
              public storage: Storage) { }

  ngOnInit() {
    this.storage.get('authenticated').then((val) => {
      if (val === 'false') {
        this.router.navigate(['/login/']);

      } else {
        this.storage.get('type').then((value) => {
          if (value !== 'admin') {
            this.router.navigate(['/login/']);
          }
        });
      }
    });

    this.learningModules = this.learningModService.getAllLearningModules();
  }

}
