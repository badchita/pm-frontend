import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@app/environments/environment';
import { Project } from '@app/features/projects/models/project.model';
import { Observable } from 'rxjs';
import { TaskStateUpdate } from '../models/task-board.model';

@Injectable({
  providedIn: 'root',
})
export class TaskboardService {
  private readonly http = inject(HttpClient);
  private readonly apiProjects = `${environment.url}/projects`;
  private readonly apiTasks = `${environment.url}/tasks`;

  getProject(projectId: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiProjects}/${projectId}/task-board`);
  }

  updateTaskState(taskId: number, updateTaskState: TaskStateUpdate): Observable<void> {
    return this.http.put<void>(`${this.apiTasks}/${taskId}/state`, updateTaskState);
  }
}
