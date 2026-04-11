import { Droppable } from '@hello-pangea/dnd';
import IssueCard from './IssueCard';
import { HiOutlinePlus } from 'react-icons/hi';

const statusConfig = {
  todo: { label: 'To Do', dotColor: 'bg-status-todo' },
  in_progress: { label: 'In Progress', dotColor: 'bg-status-progress' },
  in_review: { label: 'In Review', dotColor: 'bg-status-review' },
  done: { label: 'Done', dotColor: 'bg-status-done' },
};

const KanbanColumn = ({ status, issues, projectKey, onIssueClick, onAddIssue }) => {
  const config = statusConfig[status] || { label: status, dotColor: 'bg-dark-400' };

  return (
    <div className="flex flex-col min-w-[280px] w-[280px] lg:w-auto lg:flex-1 bg-dark-800/50 rounded-2xl border border-dark-600/30">
      {/* Column header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-dark-600/30">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${config.dotColor}`} />
          <h3 className="text-sm font-semibold text-dark-100">{config.label}</h3>
          <span className="text-xs text-dark-400 bg-dark-700 px-1.5 py-0.5 rounded-md font-medium">
            {issues.length}
          </span>
        </div>
        <button
          onClick={() => onAddIssue && onAddIssue(status)}
          className="p-1 rounded-md text-dark-400 hover:text-brand-400 hover:bg-dark-700 transition-colors"
        >
          <HiOutlinePlus className="w-4 h-4" />
        </button>
      </div>

      {/* Droppable area */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`
              flex-1 p-2 space-y-2 overflow-y-auto min-h-[200px]
              transition-colors duration-200
              ${snapshot.isDraggingOver ? 'bg-brand-500/5' : ''}
            `}
          >
            {issues.map((issue, index) => (
              <IssueCard
                key={issue._id}
                issue={issue}
                index={index}
                projectKey={projectKey}
                onClick={onIssueClick}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;
