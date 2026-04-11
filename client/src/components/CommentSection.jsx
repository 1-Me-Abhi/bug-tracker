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
    if (issueId) {
      api.getComments(issueId).then(setComments).catch(console.error);
    }
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
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteComment(id);
      setComments(prev => prev.filter(c => c._id !== id));
      toast.success('Comment deleted');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-dark-100">
        Comments ({comments.length})
      </h3>

      {/* Comments list */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {comments.map(comment => (
          <div key={comment._id} className="flex gap-3 animate-slide-up">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-400 to-accent-cyan flex items-center justify-center text-[10px] font-bold text-dark-900 shrink-0 mt-0.5">
              {comment.author?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">{comment.author?.name}</span>
                <span className="text-[11px] text-dark-400">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-dark-200 mt-1 whitespace-pre-wrap">{comment.text}</p>
            </div>
            {(comment.author?._id === user?._id || user?.role === 'admin') && (
              <button
                onClick={() => handleDelete(comment._id)}
                className="p-1 rounded text-dark-500 hover:text-accent-rose transition-colors shrink-0"
              >
                <HiOutlineTrash className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-sm text-dark-400 text-center py-4">No comments yet. Be the first!</p>
        )}
      </div>

      {/* Add comment form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 px-3 py-2 bg-dark-700 border border-dark-600/50 rounded-lg text-sm text-white placeholder-dark-400 focus:border-brand-500/50"
        />
        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-500 disabled:opacity-50 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default CommentSection;
