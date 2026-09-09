import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { SOURCE_URLS } from "../../constants/source-url.constants";
import { Observable } from "rxjs";
import { Task } from "../../models/tasl.model";

@Injectable({
    providedIn: "root",
})
export class TaskService {
    private readonly _http = inject(HttpClient);
    private readonly _sourceUrl = SOURCE_URLS.TASK;

    fetchTasks(): Observable<Task[]> {
        return this._http.get<Task[]>(this._sourceUrl);
    }
}
