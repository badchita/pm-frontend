import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@app/environments/environment';
import { DataTable, TableParams } from '@app/shared/models/data-table.model';
import { Task } from '@app/features/tasks/models/task.model';
import { TableUtilityService } from '@app/shared/services/table-utility.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private http = inject(HttpClient);
  private tableUtilityService = inject(TableUtilityService);
  private apiProjects = `${environment.url}/projects`;

  create(task: Task, projectId: number): Observable<Task> {
    return this.http.post<Task>(`${this.apiProjects}/${projectId}/tasks`, task);
  }

  getList(
    tableParams: TableParams,
    filters: any,
    projectId: number
  ): Observable<DataTable<Task>> {
    const params = this.tableUtilityService.buildParams(tableParams, filters);

    return this.http.get<DataTable<Task>>(`${this.apiProjects}/${projectId}/tasks`, { params });
  }

  getById(projectId: number, id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiProjects}/${projectId}/tasks/${id}`);
  }
}
