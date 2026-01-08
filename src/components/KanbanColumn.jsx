import { Droppable, Draggable } from '@hello-pangea/dnd';
import KanbanCard from './KanbanCard';

const COLUMN_COLORS = {
    gray: 'border-[--text-muted]/30',
    cyan: 'border-[--accent-cyan]/30',
    purple: 'border-[--accent-cyan]/30',
    green: 'border-[--accent-yellow]/30'
};

const HEADER_COLORS = {
    gray: 'bg-[--text-muted]/10 text-[--text-muted]',
    cyan: 'bg-[--accent-cyan]/10 text-[--accent-cyan]',
    purple: 'bg-[--accent-cyan]/10 text-[--accent-cyan]',
    green: 'bg-[--accent-yellow]/10 text-[--accent-yellow]'
};

export default function KanbanColumn({ column, onAddTask }) {
    const { id, title, tasks, color } = column;

    return (
        <div className={`kanban-column ${COLUMN_COLORS[color]}`}>
            {/* Column Header */}
            <div className="kanban-column-header">
                <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${HEADER_COLORS[color]}`}>
                        {title}
                    </span>
                    <span className="text-xs text-[--text-muted]">{tasks.length}</span>
                </div>
                <button
                    onClick={onAddTask}
                    className="p-1 rounded hover:bg-[--bg-tertiary] text-[--text-muted] hover:text-[--text-primary] transition-colors"
                    title="Add task"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </button>
            </div>

            {/* Droppable Area */}
            <Droppable droppableId={id}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`kanban-column-content ${snapshot.isDraggingOver ? 'kanban-column-dragging' : ''}`}
                    >
                        {tasks.length === 0 ? (
                            <div className="kanban-empty">
                                <p className="text-xs text-[--text-muted]">No tasks</p>
                            </div>
                        ) : (
                            tasks.map((task, index) => (
                                <Draggable key={task.id} draggableId={task.id} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className={snapshot.isDragging ? 'kanban-card-dragging' : ''}
                                        >
                                            <KanbanCard task={task} />
                                        </div>
                                    )}
                                </Draggable>
                            ))
                        )}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
}
