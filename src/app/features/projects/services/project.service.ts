import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@app/environments/environment';
import { Project, ProjectForm } from '@app/shared/models/project.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private http = inject(HttpClient);
  private api = `${environment.url}/projects`;

  create(project: ProjectForm): Observable<Project> {
    return this.http.post<Project>(`${this.api}`, project);
  }

  getById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.api}/${id}`);
  }

  update(project: Project): Observable<Project> {
    return this.http.put<Project>(`${this.api}/${project.id}`, project);
  }
}
