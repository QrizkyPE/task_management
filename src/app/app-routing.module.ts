import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TasksComponent } from './components/tasks/tasks.component';
// import { TaskFormComponent } from './components/task-form/task-form.component';

import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/tasks', pathMatch: 'full' },
  { path: 'tasks', component: TasksComponent },
  // { path: 'tasks/new', component: TaskFormComponent },
  // { path: 'tasks/edit/:id', component: TaskFormComponent },
  {
    path: 'labels',
    loadComponent: () => 
      import('./components/labels/labels.component').then(m => m.LabelsComponent),
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 