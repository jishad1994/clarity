import { Comment } from "../models/comment.model";

/** Counts every comment in a tree, at any depth */
export function countAll(comments: Comment[]): number {
    return comments.reduce((total, comment) => total + 1 + countAll(comment.replies), 0);
}

/**
 * Immutably walks the tree and appends `newReply` under the comment whose id
 * matches `parentId`, at whatever depth it lives.
 */
export function insertReply(comments: Comment[], parentId: string, newReply: Comment): Comment[] {
    return comments.map((comment) => {
        if (comment.id === parentId) {
            return { ...comment, replies: [...comment.replies, newReply] };
        }
        if (comment.replies.length > 0) {
            return { ...comment, replies: insertReply(comment.replies, parentId, newReply) };
        }
        return comment;
    });
}
