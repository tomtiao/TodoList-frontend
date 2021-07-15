type Timestamp = number;

const enum Priority {
    None,
    Low,
    Medium,
    High
}

interface Todo {
    Id: number;
    Content: string;
    Note: string | null;
    CreationTime: Timestamp;
    ReminderTime: Timestamp | null;
    Priority: Priority;
    Flagged: boolean;
    Completed: boolean;
}

type TodoPartial = { [P in keyof Todo as Exclude<P, 'Id'> & Exclude<P, 'CreationTime'>]?: Todo[P] }

export {
  Todo,
  TodoPartial
}
