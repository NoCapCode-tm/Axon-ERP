import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  EllipsisVertical,
  Mic,
  Paperclip,
  Phone,
  Search,
  Send,
  Smile,
  Video,
  X,
} from 'lucide-react';
import styles from '../CSS/Chat.module.css';

const contacts = Array.from({ length: 14 }, (_, index) => ({
  id: `contact-${index + 1}`,
  name: index === 0 ? 'Priya Singh' : 'Mrs. Aishwarya',
  role: index === 0 ? 'Admin' : 'Parent',
  preview: 'I will check and let you know',
  time: 'Now',
  unread: index !== 0,
}));

function ContactAvatar() {
  return (
    <span className={styles.avatar} aria-hidden="true">PS</span>
  );
}

const startingMessages = [
  {
    id: 'message-1',
    from: 'them',
    text: 'Kindly you please recheck the assignment works and report as some students did submit late.',
    time: '10:30 AM',
  },
  { id: 'message-2', from: 'me', text: 'Okay', time: '10:30 AM' },
];

function MeetingDialog({ onClose, onSchedule }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const submit = (event) => {
    event.preventDefault();
    onSchedule({ title: title.trim(), date, time });
  };

  return (
    <div
      className={styles.dialogBackdrop}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className={styles.meetingDialog} role="dialog" aria-modal="true" aria-labelledby="meeting-title">
        <div className={styles.dialogHeading}>
          <h2 id="meeting-title">Schedule a meeting</h2>
          <button type="button" aria-label="Close meeting form" onClick={onClose}><X size={19} /></button>
        </div>
        <form onSubmit={submit}>
          <label>
            Meeting title
            <input value={title} onChange={(event) => setTitle(event.target.value)} required />
          </label>
          <div className={styles.meetingFields}>
            <label>
              Date
              <input type="date" value={date} onChange={(event) => setDate(event.target.value)} required />
            </label>
            <label>
              Time
              <input type="time" value={time} onChange={(event) => setTime(event.target.value)} required />
            </label>
          </div>
          <div className={styles.meetingActions}>
            <button type="button" className={styles.secondaryButton} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.limeButton}>Schedule</button>
          </div>
        </form>
      </section>
    </div>
  );
}

function ContactPicker({ onClose, onSelect }) {
  return (
    <div
      className={styles.dialogBackdrop}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className={styles.pickerDialog} role="dialog" aria-modal="true" aria-labelledby="contact-picker-title">
        <div className={styles.dialogHeading}>
          <h2 id="contact-picker-title">Start a new chat</h2>
          <button type="button" aria-label="Close contact picker" onClick={onClose}><X size={19} /></button>
        </div>
        <div className={styles.pickerContacts}>
          {contacts.map((contact) => (
            <button
              type="button"
              className={styles.contactItem}
              key={contact.id}
              onClick={() => onSelect(contact)}
            >
              <ContactAvatar />
              <span className={styles.contactCopy}>
                <span className={styles.contactName}>{contact.name}</span>
                <span className={styles.contactPreview}>{contact.role}</span>
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function TeacherChat({ initialContacts = contacts }) {
  const [contactsState, setContactsState] = useState(initialContacts);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [search, setSearch] = useState('');
  const [messages, setMessages] = useState(() => (
    initialContacts.some((contact) => contact.id === contacts[0].id)
      ? { [contacts[0].id]: startingMessages }
      : {}
  ));
  const [messageText, setMessageText] = useState('');
  const [meetingOpen, setMeetingOpen] = useState(false);
  const [meetingStatus, setMeetingStatus] = useState('');
  const [actionStatus, setActionStatus] = useState('');
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
  const [contactPickerOpen, setContactPickerOpen] = useState(false);
  const conversationActionsRef = useRef(null);

  const selectedContact = contactsState.find((contact) => contact.id === selectedContactId);
  const visibleContacts = useMemo(() => contactsState.filter((contact) =>
    contact.name.toLowerCase().includes(search.trim().toLowerCase())
  ), [search, contactsState]);
  const selectedMessages = messages[selectedContactId] || [];

  useEffect(() => {
    document.body.classList.toggle('teacher-chat-open', Boolean(selectedContact));
    return () => document.body.classList.remove('teacher-chat-open');
  }, [selectedContact]);

  useEffect(() => {
    if (!optionsOpen) return undefined;
    const closeMenu = (event) => {
      if (!conversationActionsRef.current?.contains(event.target)) setOptionsOpen(false);
    };
    document.addEventListener('pointerdown', closeMenu);
    return () => document.removeEventListener('pointerdown', closeMenu);
  }, [optionsOpen]);

  const selectContact = (contact) => {
    setSelectedContactId(contact.id);
    setSearch('');
    setContactsState((current) => {
      const existingContact = current.find((item) => item.id === contact.id);
      if (!existingContact) return [{ ...contact, unread: false }, ...current];
      return current.map((item) =>
        item.id === contact.id ? { ...item, unread: false } : item
      );
    });
    setActionStatus('');
    setOptionsOpen(false);
    setContactPickerOpen(false);
  };

  const clearSelectedConversation = () => {
    if (!selectedContact) return;
    setMessages((current) => ({ ...current, [selectedContactId]: [] }));
    setContactsState((current) => current.map((contact) =>
      contact.id === selectedContactId
        ? { ...contact, preview: 'No messages yet', time: 'Now' }
        : contact
    ));
    setActionStatus('Conversation messages cleared.');
    setClearConfirmOpen(false);
    setOptionsOpen(false);
  };

  const backToConversations = () => {
    setSelectedContactId(null);
    setMessageText('');
    setActionStatus('');
    setOptionsOpen(false);
  };

  const markAllRead = () => {
    setContactsState((current) => current.map((contact) => ({ ...contact, unread: false })));
  };

  const sendMessage = (event) => {
    event.preventDefault();
    const text = messageText.trim();
    if (!text || !selectedContact) return;

    const message = {
      id: `message-${Date.now()}`,
      from: 'me',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((current) => ({
      ...current,
      [selectedContactId]: [...(current[selectedContactId] || []), message],
    }));
    setContactsState((current) => current.map((contact) =>
      contact.id === selectedContactId ? { ...contact, preview: text, time: 'Now' } : contact
    ));
    setMessageText('');
  };

  const scheduleMeeting = ({ title, date, time }) => {
    const readableDate = new Date(`${date}T${time}`).toLocaleString([], {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
    setMeetingStatus(`${title} scheduled for ${readableDate}.`);
    setMeetingOpen(false);
  };

  const showUnavailableAction = (label) => {
    setActionStatus(`${label} is not available in this preview.`);
    window.setTimeout(() => setActionStatus(''), 2500);
  };

  return (
    <section className={styles.chatPage} aria-label="SETU messaging">
      {!selectedContact && (
        <div className={styles.chatToolbar}>
          <button type="button" className={styles.limeButton} onClick={markAllRead}>
            Mark all as read
          </button>
          <button type="button" className={styles.limeButton} onClick={() => setMeetingOpen(true)}>
            Schedule a meeting
          </button>
        </div>
      )}

      {meetingStatus && <p className={styles.statusMessage} role="status">{meetingStatus}</p>}

      <div className={`${styles.chatWorkspace}${selectedContact ? ` ${styles.chatSelected}` : ''}`}>
        <aside className={styles.contactPanel} aria-label="Conversations">
          <label className={styles.contactSearch}>
            <Search size={17} aria-hidden="true" />
            <span className={styles.visuallyHidden}>Search conversations</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search..."
            />
            <button
              type="button"
              aria-label="Voice search is unavailable"
              title="Voice search is unavailable"
              onClick={() => setActionStatus('Voice search is not available in this preview.')}
            >
              <Mic size={17} aria-hidden="true" />
            </button>
          </label>
          <div className={styles.contactList}>
            {visibleContacts.length ? visibleContacts.map((contact) => (
              <button
                className={`${styles.contactItem}${selectedContactId === contact.id ? ` ${styles.selectedContact}` : ''}`}
                key={contact.id}
                type="button"
                aria-current={selectedContactId === contact.id ? 'true' : undefined}
                onClick={() => selectContact(contact)}
              >
                <ContactAvatar />
                <span className={styles.contactCopy}>
                  <span className={styles.contactName}>{contact.name}</span>
                  <span className={styles.contactPreview}>{contact.preview}</span>
                </span>
                <span className={styles.contactTime}>{contact.time}</span>
                {contact.unread && <span className={styles.unreadDot} aria-label="Unread" />}
              </button>
            )) : (
              <div className={styles.noChats}>
                <h2>No Chats</h2>
                <button type="button" className={styles.limeButton} onClick={() => setContactPickerOpen(true)}>
                  Start a new chat
                </button>
              </div>
            )}
          </div>
        </aside>

        <section className={styles.conversationPanel} aria-label="Conversation">
          {selectedContact ? (
            <>
              <header className={styles.conversationHeader}>
                <button
                  className={styles.backButton}
                  type="button"
                  aria-label="Back to conversations"
                  onClick={backToConversations}
                >
                  <ArrowLeft size={18} aria-hidden="true" />
                </button>
                <ContactAvatar />
                <span className={styles.conversationPerson}>
                  <strong>{selectedContact.name}</strong>
                  <small>{selectedContact.role}</small>
                </span>
                <div className={styles.conversationActions} ref={conversationActionsRef}>
                  <button type="button" aria-label="Start voice call" onClick={() => showUnavailableAction('Voice calling')}>
                    <Phone size={17} />
                  </button>
                  <button type="button" aria-label="Start video call" onClick={() => showUnavailableAction('Video calling')}>
                    <Video size={17} />
                  </button>
                  <button
                    type="button"
                    aria-label="More conversation options"
                    aria-expanded={optionsOpen}
                    onClick={() => setOptionsOpen((current) => !current)}
                  >
                    <EllipsisVertical size={18} />
                  </button>
                  {optionsOpen && (
                    <div className={styles.conversationMenu} role="menu">
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setOptionsOpen(false);
                          setClearConfirmOpen(true);
                        }}
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>
              </header>

              <div className={styles.chatMessages} aria-live="polite">
                {selectedMessages.length === 0 ? (
                  <div className={styles.noMessages}>
                    <h2>No Messages Yet</h2>
                    <p>Start a conversation with a teacher, parent, or administrator to collaborate and stay connected.</p>
                  </div>
                ) : (
                  <>
                    <p className={styles.dayDivider}>Today</p>
                    {selectedMessages.map((message) => (
                      <article
                        className={`${styles.chatBubble}${message.from === 'me' ? ` ${styles.ownMessage}` : ''}`}
                        key={message.id}
                      >
                        <p>{message.text}</p>
                        <time>{message.time}</time>
                      </article>
                    ))}
                  </>
                )}
              </div>

              {actionStatus && <p className={styles.statusMessage} role="status">{actionStatus}</p>}

              <form className={styles.composer} onSubmit={sendMessage}>
                <label className={styles.visuallyHidden} htmlFor="chat-message">Type your message</label>
                <label className={styles.attachButton} title="Attach a file">
                  <Paperclip size={17} aria-hidden="true" />
                  <input type="file" onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) setMessageText((current) => `${current}${current ? ' ' : ''}[${file.name}]`);
                  }} />
                </label>
                <input
                  id="chat-message"
                  value={messageText}
                  onChange={(event) => setMessageText(event.target.value)}
                  placeholder="Type your message..."
                />
                <button
                  className={styles.emojiButton}
                  type="button"
                  aria-label="Add smile emoji"
                  onClick={() => setMessageText((current) => `${current}🙂`)}
                >
                  <Smile size={16} />
                </button>
                <button className={styles.sendButton} type="submit" aria-label="Send message" disabled={!messageText.trim()}>
                  <Send size={17} aria-hidden="true" />
                </button>
              </form>
            </>
          ) : (
            <div className={styles.noMessages}>
              <h2>No Messages Yet</h2>
              <p>Start a conversation with a teacher, parent, or administrator to collaborate and stay connected.</p>
            </div>
          )}
        </section>
      </div>

      {meetingOpen && (
        <MeetingDialog onClose={() => setMeetingOpen(false)} onSchedule={scheduleMeeting} />
      )}
      {contactPickerOpen && (
        <ContactPicker
          onClose={() => setContactPickerOpen(false)}
          onSelect={selectContact}
        />
      )}
      {clearConfirmOpen && (
        <div
          className={styles.dialogBackdrop}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setClearConfirmOpen(false);
          }}
        >
          <section className={styles.meetingDialog} role="alertdialog" aria-modal="true" aria-labelledby="clear-chat-title">
            <div className={styles.dialogHeading}>
              <h2 id="clear-chat-title">Clear conversation?</h2>
              <button type="button" aria-label="Close confirmation" onClick={() => setClearConfirmOpen(false)}>
                <X size={19} />
              </button>
            </div>
            <p className={styles.confirmText}>
              This clears the messages in this conversation from the current view. The contact will stay in your list.
            </p>
            <div className={styles.meetingActions}>
              <button type="button" className={styles.secondaryButton} onClick={() => setClearConfirmOpen(false)}>
                Cancel
              </button>
              <button type="button" className={styles.dangerButton} onClick={clearSelectedConversation}>
                Clear messages
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}

export default TeacherChat;
