type Timestamp = number;

const enum Priority {
    None,
    Low,
    Medium,
    High
}

interface Todo extends Record<string, unknown> {
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

const TodoInstance: Todo = {
  Id: 0,
  Content: '',
  Note: null,
  CreationTime: 0,
  ReminderTime: null,
  Priority: 0,
  Flagged: false,
  Completed: false
} as const

export {
  Todo,
  TodoPartial,
  TodoInstance
}
