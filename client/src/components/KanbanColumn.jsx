import { Droppable } from '@hello-pangea/dnd';
import IssueCard from './IssueCard';
import { HiOutlinePlus } from 'react-icons/hi';

const statusConfig = {
  todo: { label: 'To Do', color: '#7a8ba5' },
  in_progress: { label: 'In Progress', color: '#7ec8d8' },
  in_review: { label: 'In Review', color: '#a8b4c8' },
  done: { label: 'Done', color: '#34d399' },
};

const KanbanColumn = ({ status, issues, projectKey, onIssueClick, onAddIssue }) => {
  const config = statusConfig[status] || { label: status, color: '#7a8ba5' };

  return (
    <div className="kanban-col">
      {/* Column header */}
      <div className="kanban-col-header">
        <div className="flex items-center gap-2">
          <div style={{
            width: '8px', height: '8px',
            borderRadius: '50%',
            background: config.color,
          }} />
          <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--dark-200)' }}>{config.label}</h3>
          <span style={{
            fontSize: '11px', color: 'var(--dark-500)',
            background: 'rgba(255,255,255,0.04)',
            padding: '1px 6px', borderRadius: '4px',
            fontWeight: 500,
          }}>
            {issues.length}
          </span>
        </div>
        <button
          onClick={() => onAddIssue && onAddIssue(status)}
          className="btn-ghost"
          style={{ padding: '4px' }}
        >
          <HiOutlinePlus style={{ width: '14px', height: '14px' }} />
        </button>
      </div>

      {/* Droppable area */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="kanban-col-body"
            style={{
              background: snapshot.isDraggingOver ? 'rgba(126,200,216,0.03)' : 'transparent',
            }}
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
