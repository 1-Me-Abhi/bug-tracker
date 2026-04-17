import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { HiOutlineTrash } from 'react-icons/hi';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CommentSection = ({ issueId }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (issueId) api.getComments(issueId).then(setComments).catch(console.error);
  }, [issueId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    try {
      const comment = await api.addComment({ text, issue: issueId });
      setComments(prev => [...prev, comment]);
      setText('');
      toast.success('Comment added');
    } catch (error) { toast.error(error.message); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    try { await api.deleteComment(id); setComments(prev => prev.filter(c => c._id !== id)); toast.success('Comment deleted'); }
    catch (error) { toast.error(error.message); }
  };

  return (
    <div>
      <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--dark-200)', marginBottom: '16px' }}>
        Comments ({comments.length})
      </h3>

      <div style={{ maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
        {comments.map(comment => (
          <div key={comment._id} className="flex gap-3">
            <div className="avatar avatar-md shrink-0" style={{ marginTop: '2px' }}>
              {comment.author?.name?.charAt(0)?.toUpperCase() ?? '?'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--dark-200)' }}>{comment.author?.name}</span>
                <span style={{ fontSize: '11px', color: 'var(--dark-350)' }}>
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--dark-300)', marginTop: '4px', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{comment.text}</p>
            </div>
            {(comment.author?._id === user?._id || user?.role === 'admin') && (
              <button onClick={() => handleDelete(comment._id)} className="btn-ghost shrink-0">
                <HiOutlineTrash style={{ width: '14px', height: '14px' }} />
              </button>
            )}
          </div>
        ))}
        {comments.length === 0 && (
          <p style={{ fontSize: '13px', color: 'var(--dark-350)', textAlign: 'center', padding: '24px 0' }}>No comments yet. Be the first!</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex" style={{ gap: '8px' }}>
        <input
          type="text" value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Add a comment..."
          className="input"
          style={{ flex: 1 }}
        />
        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="btn"
          style={{ opacity: (loading || !text.trim()) ? 0.4 : 1 }}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default CommentSection;
