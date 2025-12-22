import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@app/environments/environment';
import { DataTable, TableParams } from '@app/shared/models/data-table.model';
import { Task } from '@app/features/tasks/models/task.model';
import { TableUtilityService } from '@app/shared/services/table-utility.service';
import { Observable } from 'rxjs';
import { TaskComment } from '../models/task-comment.model';
import { TaskStateHistory } from '../models/task-state-history.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient);
  private tableUtilityService = inject(TableUtilityService);

  private apiProjects = `${environment.url}/projects`;
  private apiTasks = `${environment.url}/tasks`;

  save(task: Task, projectId: number): Observable<Task> {
    if (!task.id) {
      return this.http.post<Task>(`${this.apiProjects}/${projectId}/tasks`, task);
    }

    return this.http.put<Task>(`${this.apiProjects}/${projectId}/tasks/${task.id}`, task);
  }

  getList(tableParams: TableParams, filters: any, projectId: number): Observable<DataTable<Task>> {
    const params = this.tableUtilityService.buildParams(tableParams, filters);

    return this.http.get<DataTable<Task>>(`${this.apiProjects}/${projectId}/tasks`, { params });
  }

  getById(projectId: number, id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiProjects}/${projectId}/tasks/${id}`);
  }

  saveTaskComment(taskComment: TaskComment, taskId: number): Observable<TaskComment> {
    return this.http.post<TaskComment>(`${this.apiTasks}/${taskId}/comments`, taskComment);
  }

  getAllTaskComments(taskId: number): Observable<TaskComment[]> {
    return this.http.get<TaskComment[]>(`${this.apiTasks}/${taskId}/comments`);
  }

  getAllTaskStateHistory(taskId: number): Observable<TaskStateHistory[]> {
    return this.http.get<TaskStateHistory[]>(`${this.apiTasks}/${taskId}/histories`);
  }
}
