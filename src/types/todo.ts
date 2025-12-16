interface Comment {
    id: number;
    content: string;
    createdAt: string;
    authorId: number;
}

export interface ToDoItem {
    id: number;
    title: string;
    description: string;
    createdAt: string;
    creatorId: number;
    status: "todo" | "in-progress" | "done";
    tag: "important" | "normal" | "backlog";
    comments: Comment[];
}