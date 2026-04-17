import { HiBugAnt } from 'react-icons/hi2';
import { HiOutlineLightningBolt, HiOutlineClipboardCheck, HiOutlineSparkles } from 'react-icons/hi';
import { Draggable } from '@hello-pangea/dnd';

const typeIcons = {
  bug: { icon: HiBugAnt, color: '#e05252' },
  feature: { icon: HiOutlineSparkles, color: '#7a8ba5' },
  task: { icon: HiOutlineClipboardCheck, color: '#7ec8d8' },
  improvement: { icon: HiOutlineLightningBolt, color: '#fbbf24' },
};

const priorityColors = {
  critical: { bg: 'rgba(224,82,82,0.12)', text: '#e05252', border: 'rgba(224,82,82,0.2)' },
  high: { bg: 'rgba(232,124,90,0.12)', text: '#e87c5a', border: 'rgba(232,124,90,0.2)' },
  medium: { bg: 'rgba(122,139,165,0.12)', text: '#7a8ba5', border: 'rgba(122,139,165,0.2)' },
  low: { bg: 'rgba(61,107,94,0.12)', text: '#3d6b5e', border: 'rgba(61,107,94,0.2)' },
};

const IssueCard = ({ issue, index, projectKey, onClick }) => {
  const TypeIcon = typeIcons[issue.type]?.icon || HiBugAnt;
  const typeColor = typeIcons[issue.type]?.color || '#7a8ba5';
  const prio = priorityColors[issue.priority] || priorityColors.medium;

  return (
    <Draggable draggableId={issue._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick && onClick(issue)}
          style={{
            padding: '12px',
            borderRadius: '8px',
            border: `1px solid ${snapshot.isDragging ? 'rgba(126,200,216,0.3)' : 'var(--border-light)'}`,
            background: snapshot.isDragging ? 'var(--dark-700)' : 'var(--dark-750)',
            cursor: 'pointer',
            transition: 'border-color 0.15s, background 0.15s',
            transform: snapshot.isDragging ? 'rotate(2deg)' : 'none',
            ...provided.draggableProps.style,
          }}
        >
          {/* Top: type icon + ticket key + priority */}
          <div className="flex items-center justify-between" style={{ marginBottom: '8px' }}>
            <div className="flex items-center gap-1-5">
              <TypeIcon style={{ width: '13px', height: '13px', color: typeColor }} />
              <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--dark-500)' }}>
                {projectKey}-{issue.ticketNumber}
              </span>
            </div>
            <span className="badge" style={{
              background: prio.bg, color: prio.text,
              border: `1px solid ${prio.border}`,
            }}>
              {issue.priority}
            </span>
          </div>

          {/* Title */}
          <h4
            className="line-clamp-2"
            style={{
              fontSize: '13px', fontWeight: 500,
              color: 'var(--dark-200)', lineHeight: 1.4,
              marginBottom: '10px',
            }}
          >
            {issue.title}
          </h4>

          {/* Bottom: labels + assignee */}
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap" style={{ gap: '4px' }}>
              {issue.labels?.slice(0, 2).map((label, i) => (
                <span key={i} className="tag">{label}</span>
              ))}
            </div>
            {issue.assignee && (
              <div
                className="avatar avatar-sm shrink-0"
                title={issue.assignee.name}
              >
                {issue.assignee.name?.charAt(0)?.toUpperCase() ?? '?'}
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default IssueCard;
