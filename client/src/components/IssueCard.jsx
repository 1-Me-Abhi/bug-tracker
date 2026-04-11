import { HiBugAnt } from 'react-icons/hi2';
import { HiOutlineLightningBolt, HiOutlineClipboardCheck, HiOutlineSparkles } from 'react-icons/hi';
import { Draggable } from '@hello-pangea/dnd';

const typeIcons = {
  bug: { icon: HiBugAnt, color: 'text-accent-rose' },
  feature: { icon: HiOutlineSparkles, color: 'text-accent-violet' },
  task: { icon: HiOutlineClipboardCheck, color: 'text-accent-cyan' },
  improvement: { icon: HiOutlineLightningBolt, color: 'text-accent-amber' },
};

const priorityColors = {
  critical: 'bg-priority-critical/20 text-priority-critical border-priority-critical/30',
  high: 'bg-priority-high/20 text-priority-high border-priority-high/30',
  medium: 'bg-priority-medium/20 text-priority-medium border-priority-medium/30',
  low: 'bg-priority-low/20 text-priority-low border-priority-low/30',
};

const IssueCard = ({ issue, index, projectKey, onClick }) => {
  const TypeIcon = typeIcons[issue.type]?.icon || HiBugAnt;
  const typeColor = typeIcons[issue.type]?.color || 'text-dark-300';

  return (
    <Draggable draggableId={issue._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick && onClick(issue)}
          className={`
            group p-3.5 rounded-xl border border-dark-600/50 bg-dark-700/80
            cursor-pointer transition-all duration-200
            hover:border-brand-500/30 hover:bg-dark-700
            ${snapshot.isDragging ? 'shadow-xl shadow-brand-500/20 border-brand-500/40 rotate-2 scale-105' : ''}
          `}
        >
          {/* Top row: Type icon + ticket key */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <TypeIcon className={`w-3.5 h-3.5 ${typeColor}`} />
              <span className="text-[11px] font-mono text-dark-300">
                {projectKey}-{issue.ticketNumber}
              </span>
            </div>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-md border font-medium ${priorityColors[issue.priority]}`}>
              {issue.priority}
            </span>
          </div>

          {/* Title */}
          <h4 className="text-sm font-medium text-dark-100 group-hover:text-white transition-colors line-clamp-2 mb-3">
            {issue.title}
          </h4>

          {/* Bottom row: Labels + Assignee */}
          <div className="flex items-center justify-between">
            <div className="flex gap-1 flex-wrap">
              {issue.labels?.slice(0, 2).map((label, i) => (
                <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-dark-600/80 text-dark-200">
                  {label}
                </span>
              ))}
            </div>
            {issue.assignee && (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-400 to-accent-cyan flex items-center justify-center text-[10px] font-bold text-dark-900 shrink-0" title={issue.assignee.name}>
                {issue.assignee.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default IssueCard;
