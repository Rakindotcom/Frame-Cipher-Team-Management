import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useTasks } from '../context/TasksContext';
import KanbanColumn from './KanbanColumn';

const COLUMNS = [
    { id: 'todo', title: 'To Do', color: 'gray' },
    { id: 'in-progress', title: 'Working On', color: 'cyan' },
    { id: 'review', title: 'Ready to Review', color: 'cyan' },
    { id: 'need-fixing', title: 'Need Fixing', color: 'cyan' },
    { id: 'done', title: 'Done', color: 'cyan' }
];

export default function KanbanBoard({ projectId, onAddTask }) {
    const { getTasksByProject, editTask } = useTasks();
    const tasks = getTasksByProject(projectId);

    // Group tasks by status
    const columns = COLUMNS.map(col => ({
        ...col,
        tasks: tasks.filter(task => task.status === col.id)
    }));

    const handleDragEnd = async (result) => {
        const { destination, source, draggableId } = result;

        // Dropped outside
        if (!destination) return;

        // Same position
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        // Update task status
        const newStatus = destination.droppableId;
        try {
            await editTask(draggableId, { status: newStatus }, 'status_changed');
        } catch (error) {
            console.error('Error updating task status:', error);
        }
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="kanban-board">
                {columns.map((column) => (
                    <KanbanColumn
                        key={column.id}
                        column={column}
                        onAddTask={() => onAddTask(column.id)}
                    />
                ))}
            </div>
        </DragDropContext>
    );
}
