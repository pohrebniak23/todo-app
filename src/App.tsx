import React, { useState, useEffect } from 'react';
import { TodoApp } from './components/TodoApp';
import { TodoList } from './components/TodoList';
import { TodosType } from './types/TodosType';
import { TodosFilter } from './components/TodosFilter';
import { useLocalStorage } from './hook/useLocalStorage';
import { deleteTodo, userId, changeTodoStatus, getTodos } from './api/api';
import { SortBy } from './types/SortBy';
import { completedCount, notCompletedCount } from './helpers/todos-helper';

export const TodoData = React.createContext<any>({});

export const App: React.FC = () => {
  const [todos, setTodos] = useLocalStorage('todos', []);
  const [toggleStatus, setToggleStatus] = useState(false);
  const [sortBy, setSortBy] = useState(SortBy.All);

  useEffect(() => {
    getTodos(`todos/?userId=${userId}`)
      .then((data) => {
        setTodos(data);
      });
  }, []);

  useEffect(() => {
    const isEveryToggle = todos.every((todo: TodosType) => (
      todo.completed === true
    ));

    if (isEveryToggle) {
      setToggleStatus(true);
    } else {
      setToggleStatus(false);
    }
  }, [todos]);

  const contextValue: any = { setTodos };

  const clearCompleted = () => {
    todos.forEach((todo: TodosType) => {
      if (todo.completed === true) {
        deleteTodo(`todos/${todo.id}`)
          .then(setTodos(todos.filter((item: TodosType) => (
            item.completed !== true
          ))));
      }
    });
  };

  const toggleAll = () => {
    setTodos((curr: TodosType[]) => curr.map((item: TodosType) => {
      if (item.completed !== !toggleStatus) {
        changeTodoStatus(`todos/${item.id}`, !toggleStatus);

        return { ...item, completed: !toggleStatus };
      }

      return item;
    }));

    setToggleStatus(!toggleStatus);
  };

  return (
    <section className="todoapp">
      <header className="header">
        <h1>todos</h1>

        <TodoApp setTodos={setTodos} />
      </header>

      <section className="main">
        {todos.length > 0 && (
          <>
            <input
              type="checkbox"
              id="toggle-all"
              checked={toggleStatus}
              className="toggle-all"
              onChange={toggleAll}
            />
            <label htmlFor="toggle-all">Mark all as complete</label>
          </>
        )}

        <TodoData.Provider value={contextValue}>
          <TodoList
            items={todos}
            sortBy={sortBy}
          />
        </TodoData.Provider>

      </section>

      {todos.length > 0 && (
        <footer className="footer">
          <span className="todo-count" data-cy="todosCounter">
            {`${notCompletedCount(todos)} items left`}
          </span>

          <TodosFilter sortBy={sortBy} setSortBy={setSortBy} />

          {completedCount(todos) > 0
            && (
              <button
                type="button"
                className="clear-completed"
                onClick={() => clearCompleted()}
              >
                Clear completed
              </button>
            )
          }
        </footer>
      )}
    </section>
  );
};

export default App;
