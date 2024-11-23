import { useState, useEffect } from 'react';
import { Calendar } from './components/Calendar';
import { TodoForm } from './components/TodoForm';
import { supabase, Todo } from './lib/supabase';
import { toast, Toaster } from 'react-hot-toast';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | undefined>();

  useEffect(() => {
    fetchTodos();
    const subscription = supabase
      .channel('todos')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'todos' }, fetchTodos)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchTodos() {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch todos');
    } else {
      setTodos(data || []);
    }
  }

  async function handleSubmit(todoData: Partial<Todo>) {
    if (selectedTodo) {
      const { error } = await supabase
        .from('todos')
        .update(todoData)
        .eq('id', selectedTodo.id);

      if (error) {
        toast.error('Failed to update todo');
      } else {
        toast.success('Todo updated successfully');
      }
    } else {
      const { error } = await supabase
        .from('todos')
        .insert([todoData]);

      if (error) {
        toast.error('Failed to create todo');
      } else {
        toast.success('Todo created successfully');
      }
    }

    setIsFormOpen(false);
    setSelectedTodo(undefined);
  }

  async function handleToggleComplete(todo: Todo) {
    const { error } = await supabase
      .from('todos')
      .update({ completed: !todo.completed })
      .eq('id', todo.id);

    if (error) {
      toast.error('Failed to update todo status');
    } else {
      toast.success(`Todo marked as ${todo.completed ? 'incomplete' : 'complete'}`);
    }
  }

  async function handleDelete(todo: Todo) {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', todo.id);

    if (error) {
      toast.error('Failed to delete todo');
    } else {
      toast.success('Todo deleted successfully');
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Todo Calendar</h1>
            <button
              onClick={() => {
                setSelectedTodo(undefined);
                setIsFormOpen(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Todo
            </button>
          </div>

          <Calendar
            todos={todos}
            onSelectEvent={(todo) => {
              setSelectedTodo(todo);
              setIsFormOpen(true);
            }}
          />

          <TodoForm
            isOpen={isFormOpen}
            onClose={() => {
              setIsFormOpen(false);
              setSelectedTodo(undefined);
            }}
            onSubmit={handleSubmit}
            initialData={selectedTodo}
          />
        </div>
      </div>
      <Toaster />
    </div>
  );
}