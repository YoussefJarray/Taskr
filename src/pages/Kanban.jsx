import { useState, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useApp } from "../context/AppContext";
import KanbanCard from "../components/kanban/KanbanCard";
import Modal from "../components/ui/Modal";
import TaskForm from "../components/tasks/TaskForm";
import { BsPlus } from "react-icons/bs";

const COLUMNS = [
  { id: "todo", title: "To Do", color: "#6366F1" },
  { id: "in-progress", title: "In Progress", color: "#F59E0B" },
  { id: "done", title: "Done", color: "#10B981" },
];

function Column({ col, tasks, onAdd, onEdit }) {
  return (
    <div className="rounded-xl border border-subtle bg-surface-card flex flex-col">
      <div className="flex items-center justify-between px-3.5 py-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full pulse-dot" style={{ backgroundColor: col.color }} />
          <h3 className="text-xs font-semibold text-primary uppercase tracking-wider">
            {col.title}
          </h3>
          <span className="text-[11px] font-medium text-tertiary">{tasks.length}</span>
        </div>
      </div>

      <Droppable droppableId={col.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 px-2 pb-2 overflow-y-auto min-h-[140px] space-y-1.5 transition-colors rounded-b-xl ${
              snapshot.isDraggingOver ? "bg-violet-500/5" : ""
            }`}
          >
            {tasks.map((task, i) => (
              <Draggable key={task.id} draggableId={task.id} index={i}>
                {(p, s) => (
                  <div ref={p.innerRef} {...p.draggableProps} {...p.dragHandleProps} style={p.draggableProps.style}>
                    <KanbanCard task={task} isDragging={s.isDragging} onEdit={onEdit} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="py-8 text-center text-xs text-tertiary">Empty</div>
            )}
          </div>
        )}
      </Droppable>

      <div className="px-3 py-2 border-t border-subtle">
        <button
          onClick={() => onAdd(col.id)}
          className="flex items-center gap-1 w-full px-2 py-1 rounded-md text-xs font-medium text-gray-400 hover:text-violet-500 hover:bg-accent-soft transition-colors"
        >
          <BsPlus className="text-sm" /> Add
        </button>
      </div>
    </div>
  );
}

export default function Kanban() {
  const { tasks, collections, reorderTasks, addTask, updateTask, collectionFilter } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [activeCol, setActiveCol] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  const filteredTasks = collectionFilter
    ? tasks.filter((t) => t.collectionId === collectionFilter)
    : tasks;

  const getColTasks = useCallback(
    (status) => filteredTasks.filter((t) => t.status === status),
    [filteredTasks]
  );

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;

    const allTasks = [...tasks];
    const idx = allTasks.findIndex((t) => t.id === draggableId);
    if (idx === -1) return;
    
    // Auto-sync completed status based on destination column
    const isMovingToDone = destination.droppableId === "done";
    const isMovingFromDone = source.droppableId === "done";
    
    allTasks[idx] = { 
      ...allTasks[idx], 
      status: destination.droppableId,
      // Auto-mark as complete when moved to Done, unmark when moved away from Done
      completed: isMovingToDone ? true : (isMovingFromDone ? false : allTasks[idx].completed)
    };

    const colTasks = allTasks
      .filter((t) => t.status === source.droppableId)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
    const [moved] = colTasks.splice(source.index, 1);
    colTasks.splice(destination.index, 0, moved);

    const reordered = allTasks.map((t) => {
      if (t.status === source.droppableId) {
        const pos = colTasks.findIndex((ct) => ct.id === t.id);
        return { ...t, order: pos };
      }
      if (t.id === draggableId) return allTasks[idx];
      return t;
    });
    reorderTasks(reordered);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-5 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-primary">Kanban</h1>
          <p className="text-sm text-secondary mt-0.5">
            {collectionFilter
              ? `Showing "${collections.find((c) => c.id === collectionFilter)?.name || "collection"}"`
              : "Drag tasks between stages"}
          </p>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 min-h-0">
          {COLUMNS.map((col) => (
            <Column
              key={col.id}
              col={col}
              tasks={getColTasks(col.id)}
              onAdd={(id) => { setActiveCol(id); setEditingTask(null); setShowForm(true); }}
              onEdit={handleEdit}
            />
          ))}
        </div>
      </DragDropContext>

      <Modal open={showForm} onClose={() => setShowForm(false)} title={editingTask ? "Edit task" : "New task"}>
        <TaskForm
          collections={collections}
          initial={editingTask ? editingTask : { status: activeCol }}
          onSubmit={(d) => {
            if (editingTask) { updateTask({ id: editingTask.id, ...d }); } else { addTask(d); }
            setShowForm(false);
            setEditingTask(null);
          }}
          onCancel={() => { setShowForm(false); setEditingTask(null); }}
        />
      </Modal>
    </div>
  );
}
