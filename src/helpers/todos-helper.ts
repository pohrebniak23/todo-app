import { TodosType } from "../types/TodosType";

export const notCompletedCount = (todos: TodosType[]) =>
  todos.length > 0
    ? todos.filter((item: TodosType) => !item.completed).length
    : 0;

export const completedCount = (todos: TodosType[]) =>
  todos.length > 0
    ? todos.filter((item: TodosType) => item.completed).length
    : "";
