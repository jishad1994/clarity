import { computed, Injectable, signal } from "@angular/core";
import { CommentDraft, Comment } from "../models/comment.model";
import { generateId } from "../utils/id-generator.util";
import { countAll, insertReply } from "../utils/store.util";

@Injectable({ providedIn: "root" })
export class CommentStore {
    private readonly _commentsByTaskSignal = signal<Record<string, Comment[]>>({});

    getCommentsForTask(taskId: string) {
        return computed(() => this._commentsByTaskSignal()[taskId] ?? []);
    }

    getCommentCount(taskId: string) {
        return computed(() => countAll(this._commentsByTaskSignal()[taskId] ?? []));
    }
    addComment(draft: CommentDraft): void {
        const comment: Comment = {
            id: generateId("comment"),
            taskId: draft.taskId,
            author: draft.author,
            content: draft.content,
            createdAt: new Date().toISOString(),
            parentId: draft.parentId,
            replies: [],
        };

        this._commentsByTaskSignal.update((byTask) => {
            const existing = byTask[draft.taskId] ?? [];
            const updatedTree = draft.parentId ? insertReply(existing, draft.parentId, comment) : [...existing, comment];

            return { ...byTask, [draft.taskId]: updatedTree };
        });
    }
}
