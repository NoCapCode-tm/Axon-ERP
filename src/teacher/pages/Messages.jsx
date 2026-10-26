import React, { useEffect, useRef, useState } from 'react';
import {
  CalendarDays,
  ChevronDown,
  CirclePlus,
  MessageCircle,
  Paperclip,
  Share2,
  ThumbsUp,
  PersonStanding,
  UserRound,
  X,
} from 'lucide-react';
import TeacherChat from '../components/TeacherChat';
import styles from '../CSS/Message.module.css';

const tabs = ['Announcement', 'Circular', 'SETU'];

const initialPosts = [
  {
    id: 'sports-day',
    type: 'Announcement',
    title: 'Annual Sports Day',
    sender: 'Admin',
    audience: 'Entire school',
    date: '25/08/26',
    description:
      'The Annual Sports Day will be held on 25 August 2026. Students are encouraged to participate enthusiastically and report on time in their respective sports attire. Parents are welcome to attend and cheer for the participants.',
    status: 'Posted',
  },
  {
    id: 'sports-day-draft',
    type: 'Announcement',
    title: 'Annual Sports Day',
    sender: 'Admin',
    audience: 'Entire school',
    date: '25/08/26',
    description:
      'The Annual Sports Day will be held on 25 August 2026. Students are encouraged to participate enthusiastically and report on time in their respective sports attire. Parents are welcome to attend and cheer for the participants.',
    status: 'Draft',
  },
  {
    id: 'holiday-circular',
    type: 'Circular',
    title: 'Holiday Circular',
    audience: 'Entire school',
    date: '25/08/26',
    description:
      'Dear Parents,\nThe school will remain closed from 21 October 2025 to 25 October 2025 on account of the festival holidays.',
    status: 'Posted',
  },
];

const initialDrafts = [
  { id: 'fees-1', title: 'Fees Update', description: 'Fee payment is now open. Parents are requested to pay the outstanding fees before the due date.' },
  { id: 'fees-2', title: 'Fees Update', description: 'Fee payment is now open. Parents are requested to pay the outstanding fees before the due date.' },
  { id: 'fees-3', title: 'Fees Update', description: 'Fee payment is now open. Parents are requested to pay the outstanding fees before the due date.' },
  { id: 'fees-4', title: 'Fees Update', description: 'Fee payment is now open. Parents are requested to pay the outstanding fees before the due date.' },
].map((draft) => ({ ...draft, type: 'Announcement', status: 'Draft' }));

const emptyForm = {
  title: '',
  sender: '',
  audience: '',
  date: '',
  channel: '',
  description: '',
};

function formatDate(value) {
  if (!value) return '';
  const [year, month, day] = value.split('-');
  return `${day}/${month}/${year.slice(-2)}`;
}

function MessageCard({ post }) {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [shareMessage, setShareMessage] = useState('');
  const shouldTruncate = post.description.length > 190;
  const displayedDescription = shouldTruncate && !expanded
    ? `${post.description.slice(0, 190).trimEnd()}...`
    : post.description;

  const addComment = (event) => {
    event.preventDefault();
    const text = commentText.trim();
    if (!text) return;
    setComments((current) => [...current, text]);
    setCommentText('');
  };

  const sharePost = async () => {
    const text = `${post.title}\n${post.description}`;
    setShareMessage('');

    if (navigator.share) {
      try {
        await navigator.share({ title: post.title, text });
        setShareMessage('Shared successfully.');
      } catch (error) {
        if (error.name !== 'AbortError') {
          setShareMessage('Unable to share this message.');
        }
      }
      return;
    }

    if (!navigator.clipboard?.writeText) {
      setShareMessage('Sharing is not supported in this browser.');
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setShareMessage('Message copied to clipboard.');
    } catch {
      setShareMessage('Unable to copy the message. Check clipboard permissions and try again.');
    }
  };

  return (
    <article className={styles.postCard}>
      <div className={styles.postHeading}>
        <h2>{post.title}</h2>
        <span className={post.status === 'Draft' ? styles.draftStatus : styles.postedStatus}>
          {post.status}
        </span>
      </div>
      <div className={styles.postMeta}>
        {post.sender && (
          <span><UserRound size={15} aria-hidden="true" />{post.sender}</span>
        )}
        <span><PersonStanding size={15} aria-hidden="true" />{post.audience}</span>
        <span><CalendarDays size={16} aria-hidden="true" />{post.date}</span>
      </div>
      <p className={styles.postDescription}>
        {displayedDescription}
        {shouldTruncate && (
          <button type="button" onClick={() => setExpanded((current) => !current)}>
            {expanded ? 'Read less' : 'Read more'}
          </button>
        )}
      </p>
      <div className={styles.attachmentPreview}>
        {post.attachments?.length ? post.attachments.join(', ') : 'Attachments'}
      </div>
      <div className={styles.postReactions} aria-label="Post actions">
        <button
          type="button"
          aria-label={liked ? `Unlike ${post.title}` : `Like ${post.title}`}
          aria-pressed={liked}
          className={liked ? styles.reactionActive : ''}
          onClick={() => setLiked((current) => !current)}
        >
          <ThumbsUp size={16} aria-hidden="true" />
        </button>
        <span className={styles.reactionCount} aria-live="polite">{liked ? 1 : 0}</span>
        <button
          type="button"
          aria-label={`Comment on ${post.title}`}
          aria-expanded={commentsOpen}
          onClick={() => setCommentsOpen((current) => !current)}
        >
          <MessageCircle size={16} aria-hidden="true" />
        </button>
        <span className={styles.reactionCount} aria-live="polite">{comments.length}</span>
        <button type="button" aria-label={`Share ${post.title}`} onClick={sharePost}>
          <Share2 size={16} aria-hidden="true" />
        </button>
        {shareMessage && <span className={styles.shareStatus} role="status">{shareMessage}</span>}
      </div>
      {commentsOpen && (
        <section className={styles.comments} aria-label={`Comments for ${post.title}`}>
          {comments.length > 0 && (
            <ul className={styles.commentList}>
              {comments.map((comment, index) => <li key={`${index}-${comment}`}>{comment}</li>)}
            </ul>
          )}
          <form className={styles.commentForm} onSubmit={addComment}>
            <label className={styles.visuallyHidden} htmlFor={`comment-${post.id}`}>Write a comment</label>
            <input
              id={`comment-${post.id}`}
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              placeholder="Write a comment..."
            />
            <button type="submit" className={styles.limeButton} disabled={!commentText.trim()}>
              Comment
            </button>
          </form>
        </section>
      )}
    </article>
  );
}

function CreateMessageModal({ type, onClose, onSave }) {
  const [form, setForm] = useState(emptyForm);
  const [attachments, setAttachments] = useState([]);
  const titleRef = useRef(null);
  const isAnnouncement = type === 'Announcement';

  useEffect(() => {
    titleRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submit = (event, status) => {
    event.preventDefault();
    onSave({
      ...form,
      type,
      date: formatDate(form.date),
      attachments: attachments.map((file) => file.name),
      status,
    });
  };

  return (
    <div
      className={styles.modalBackdrop}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="message-modal-title">
        <div className={styles.modalHeader}>
          <h2 id="message-modal-title">Create {type}</h2>
          <button type="button" className={styles.closeModal} aria-label="Close dialog" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={(event) => submit(event, 'Posted')}>
          <label className={`${styles.field} ${styles.fullField}`}>
            Title*
            <input ref={titleRef} name="title" value={form.title} onChange={updateField} required />
          </label>

          <div className={styles.fieldGrid}>
            {isAnnouncement && (
              <label className={styles.field}>
                Sent by*
                <select name="sender" value={form.sender} onChange={updateField} required>
                  <option value="" />
                  <option>Teacher</option>
                  <option>School Admin</option>
                </select>
              </label>
            )}
            <label className={styles.field}>
              Audience*
              <select name="audience" value={form.audience} onChange={updateField} required>
                <option value="" />
                <option>Entire school</option>
                <option>Students</option>
                <option>Parents</option>
                <option>Teachers</option>
                <option>Senior Section</option>
              </select>
            </label>
            <label className={styles.field}>
              Date*
              <span className={styles.dateInput}>
                <input type="date" name="date" value={form.date} onChange={updateField} required />
                <CalendarDays size={17} aria-hidden="true" />
              </span>
            </label>
            {isAnnouncement && (
              <label className={styles.field}>
                Channel*
                <select name="channel" value={form.channel} onChange={updateField} required>
                  <option value="" />
                  <option>School app</option>
                  <option>Email</option>
                  <option>SMS</option>
                </select>
              </label>
            )}
          </div>

          <label className={`${styles.field} ${styles.fullField}`}>
            Description
            <textarea name="description" value={form.description} onChange={updateField} rows="6" />
          </label>

          <label className={styles.attachmentButton}>
            <Paperclip size={14} aria-hidden="true" />
            Add attachments
            <input
              type="file"
              multiple
              onChange={(event) => setAttachments(Array.from(event.target.files || []))}
            />
          </label>
          {attachments.length > 0 && (
            <ul className={styles.attachmentNames}>
              {attachments.map((file) => <li key={`${file.name}-${file.size}`}>{file.name}</li>)}
            </ul>
          )}

          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>Cancel</button>
            <button type="button" className={styles.limeButton} onClick={(event) => submit(event, 'Draft')}>
              Save draft
            </button>
            <button type="submit" className={styles.limeButton}>Create</button>
          </div>
        </form>
      </section>
    </div>
  );
}

function Messages() {
  const [activeTab, setActiveTab] = useState('Announcement');
  const [filter, setFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [posts, setPosts] = useState(initialPosts);
  const [drafts, setDrafts] = useState(initialDrafts);

  const visiblePosts = posts.filter((post) =>
    post.type === activeTab && (filter === 'All' || post.status === filter)
  );
  const visibleDrafts = drafts.filter((draft) =>
    draft.type === activeTab && (filter === 'All' || filter === 'Draft')
  );

  const saveMessage = (message) => {
    const saved = { ...message, id: `message-${Date.now()}` };
    if (message.status === 'Draft') {
      setDrafts((current) => [saved, ...current]);
    } else {
      setPosts((current) => [saved, ...current]);
    }
    setModalOpen(false);
  };

  const postDraft = (draft) => {
    setDrafts((current) => current.filter((item) => item.id !== draft.id));
    setPosts((current) => [{ ...draft, status: 'Posted', date: draft.date || 'Today' }, ...current]);
  };

  const createButtonLabel = activeTab === 'Announcement' ? 'Create Announcements' : `Create ${activeTab}`;

  return (
    <main className={styles.messagePage}>
      <div className={styles.tabBar} role="tablist" aria-label="Message type">
        {tabs.map((tab) => (
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            className={activeTab === tab ? styles.activeTab : ''}
            key={tab}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'SETU' ? (
        <TeacherChat />
      ) : visiblePosts.length === 0 && visibleDrafts.length === 0 ? (
        <section className={styles.emptyMessage}>
          <div className={styles.emptyMessageIcon}><MessageCircle size={31} aria-hidden="true" /></div>
          <h2>School Admin / Communication / {activeTab}</h2>
          <p>Keep your school community informed by creating your first {activeTab.toLowerCase()}. Share updates, notices, or important information with the right audience.</p>
          <button type="button" className={styles.limeButton} onClick={() => setModalOpen(true)}>
            Create {activeTab} <CirclePlus size={15} aria-hidden="true" />
          </button>
        </section>
      ) : (
        <>
          <div className={styles.messageToolbar}>
            <button type="button" className={styles.limeButton} onClick={() => setModalOpen(true)}>
              {createButtonLabel} <CirclePlus size={15} aria-hidden="true" />
            </button>
            <label className={styles.filterControl}>
              <span className={styles.visuallyHidden}>Filter messages</span>
              <select value={filter} onChange={(event) => setFilter(event.target.value)}>
                <option value="All">Filter</option>
                <option>Posted</option>
                <option>Draft</option>
              </select>
              <ChevronDown size={15} aria-hidden="true" />
            </label>
          </div>
          <div className={styles.messageGrid}>
            <section className={styles.postList} aria-label={`${activeTab} messages`}>
              {visiblePosts.map((post) => <MessageCard key={post.id} post={post} />)}
            </section>
            <aside className={styles.draftPanel} aria-label={`Drafted ${activeTab}s`}>
              <h2>Drafted {activeTab}s</h2>
              {visibleDrafts.length === 0 ? (
                <p className={styles.noDrafts}>No drafts yet.</p>
              ) : visibleDrafts.map((draft) => (
                <article className={styles.draftCard} key={draft.id}>
                  <h3>{draft.title}</h3>
                  <p>{draft.description}</p>
                  <button type="button" className={styles.limeButton} onClick={() => postDraft(draft)}>
                    Post
                  </button>
                </article>
              ))}
            </aside>
          </div>
        </>
      )}

      {modalOpen && (
        <CreateMessageModal
          type={activeTab}
          onClose={() => setModalOpen(false)}
          onSave={saveMessage}
        />
      )}
    </main>
  );
}

export default Messages;
