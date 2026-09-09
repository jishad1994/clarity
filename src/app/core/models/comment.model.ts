

export interface Comment {
    id: string;
    taskId: string;
    author: string;
    content: string;
    createdAt: string;
    parentId: string | null;
    replies: Comment[];
}

//payload that comes from the comment form

export interface CommentDraft {
    taskId: string;
    author: string;
    content: string;
    parentId: string | null;
}




