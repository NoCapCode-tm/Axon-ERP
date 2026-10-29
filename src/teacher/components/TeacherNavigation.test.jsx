import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import App from '../../App';
import TeacherChat from './TeacherChat';

jest.mock('react-router', () => {
  const { TextDecoder, TextEncoder } = require('util');
  global.TextDecoder = TextDecoder;
  global.TextEncoder = TextEncoder;
  return jest.requireActual('react-router');
});
jest.mock('react-router-dom', () => jest.requireActual('react-router'));

beforeEach(() => {
  window.history.replaceState({}, '', '/teacher/dashboard');
});

test('renders the Teacher navigation icons and opens the sidebar from the menu', () => {
  render(<App />);

  const navigation = screen.getByRole('navigation', { name: 'Teacher navigation' });
  expect(navigation.querySelectorAll('svg')).toHaveLength(9);

  const menuButton = screen.getByRole('button', { name: 'Open navigation menu' });
  fireEvent.click(menuButton);
  expect(menuButton).toHaveAttribute('aria-expanded', 'true');
});

test('closes the sidebar from the backdrop, Escape, and a selected navigation link', () => {
  render(<App />);
  const menuButton = screen.getByRole('button', { name: 'Open navigation menu' });

  fireEvent.click(menuButton);
  fireEvent.click(screen.getByRole('button', { name: 'Close navigation menu' }));
  expect(menuButton).toHaveAttribute('aria-expanded', 'false');

  fireEvent.click(menuButton);
  fireEvent.keyDown(window, { key: 'Escape' });
  expect(menuButton).toHaveAttribute('aria-expanded', 'false');

  fireEvent.click(menuButton);
  fireEvent.click(screen.getByRole('link', { name: 'Dashboard' }));
  expect(menuButton).toHaveAttribute('aria-expanded', 'false');
});

test('Teacher notifications and settings actions navigate to their pages', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: 'Notifications' }));
  expect(window.location.pathname).toBe('/teacher/notifications');
  expect(screen.getByRole('heading', { name: 'Notification' })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Settings' }));
  expect(window.location.pathname).toBe('/teacher/settings');
  expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument();
});

test('Dashboard actions navigate to existing Teacher pages', () => {
  render(<App />);

  fireEvent.click(screen.getAllByRole('button', { name: 'Mark Attendance' })[0]);
  expect(window.location.pathname).toBe('/teacher/attendance');

  fireEvent.click(screen.getByRole('link', { name: 'Dashboard' }));
  fireEvent.click(screen.getAllByRole('button', { name: 'View All' })[1]);
  expect(window.location.pathname).toBe('/teacher/lms');

  fireEvent.click(screen.getByRole('link', { name: 'Dashboard' }));
  fireEvent.click(screen.getByRole('button', { name: 'Evaluate Pending Assignment' }));
  expect(window.location.pathname).toBe('/teacher/lms');
});

test('Upcoming Exams View All navigates to the requested exams path', () => {
  render(<App />);

  fireEvent.click(screen.getAllByRole('button', { name: 'View All' })[0]);
  expect(window.location.pathname).toBe('/teacher/exams');
});

test('Messages opens the Teacher communication screen and its tabs', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: 'Messages' }));
  expect(screen.getByRole('heading', { name: 'Message' })).toBeInTheDocument();
  expect(screen.getByRole('tab', { name: 'Announcement' })).toHaveAttribute('aria-selected', 'true');
  expect(screen.getByRole('heading', { name: 'Drafted Announcements' })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('tab', { name: 'Circular' }));
  expect(screen.getByRole('heading', { name: 'Holiday Circular' })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('tab', { name: 'SETU' }));
  expect(screen.getByRole('region', { name: 'SETU messaging' })).toBeInTheDocument();
});

test('SETU opens with conversations listed and no conversation selected', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Messages' }));
  fireEvent.click(screen.getByRole('tab', { name: 'SETU' }));

  expect(screen.getByRole('complementary', { name: 'Conversations' })).toBeInTheDocument();
  expect(screen.getByText('No Messages Yet')).toBeInTheDocument();
  expect(screen.queryByRole('textbox', { name: 'Type your message' })).not.toBeInTheDocument();
});

test('SETU shows the empty chat-list state and lets the teacher start a chat', () => {
  render(<TeacherChat initialContacts={[]} />);

  expect(screen.getByRole('heading', { name: 'No Chats' })).toBeInTheDocument();
  expect(screen.getByText('No Messages Yet')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Start a new chat' }));
  const picker = screen.getByRole('dialog', { name: 'Start a new chat' });
  fireEvent.click(within(picker).getAllByRole('button', { name: /Mrs. Aishwarya/ })[0]);

  expect(screen.getByRole('button', { name: /Mrs. Aishwarya/ })).toBeInTheDocument();
  expect(within(screen.getByLabelText('Conversation')).getByText('Mrs. Aishwarya')).toBeInTheDocument();
});

test('creates an announcement from the Teacher Messages form', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Messages' }));
  fireEvent.click(screen.getByRole('button', { name: 'Create Announcements' }));

  fireEvent.change(screen.getByLabelText('Title*'), { target: { value: 'Parent meeting' } });
  fireEvent.change(screen.getByLabelText('Sent by*'), { target: { value: 'Teacher' } });
  fireEvent.change(screen.getByLabelText('Audience*'), { target: { value: 'Parents' } });
  fireEvent.change(screen.getByLabelText('Date*'), { target: { value: '2026-11-10' } });
  fireEvent.change(screen.getByLabelText('Channel*'), { target: { value: 'Email' } });
  fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Parent meeting at 3 PM.' } });
  fireEvent.click(screen.getByRole('button', { name: 'Create', exact: true }));

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Parent meeting' })).toBeInTheDocument();
  expect(screen.getByText('Parent meeting at 3 PM.')).toBeInTheDocument();
});

test('message reaction actions like, add comments, and share the message', async () => {
  const writeText = jest.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText },
  });
  Object.defineProperty(navigator, 'share', {
    configurable: true,
    value: undefined,
  });

  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Messages' }));

  const post = screen.getAllByRole('article').find((article) =>
    within(article).queryByText('Posted')
  );
  expect(post).toBeDefined();
  const postActions = within(post);

  const likeButton = postActions.getByRole('button', { name: 'Like Annual Sports Day' });
  fireEvent.click(likeButton);
  expect(postActions.getByRole('button', { name: 'Unlike Annual Sports Day' })).toHaveAttribute('aria-pressed', 'true');

  fireEvent.click(postActions.getByRole('button', { name: 'Comment on Annual Sports Day' }));
  fireEvent.change(postActions.getByRole('textbox', { name: 'Write a comment' }), {
    target: { value: 'Thanks for sharing!' },
  });
  fireEvent.click(postActions.getByRole('button', { name: 'Comment', exact: true }));
  expect(postActions.getByText('Thanks for sharing!')).toBeInTheDocument();

  fireEvent.click(postActions.getByRole('button', { name: 'Share Annual Sports Day' }));
  await waitFor(() => expect(writeText).toHaveBeenCalledWith(
    expect.stringContaining('Annual Sports Day')
  ));
  await waitFor(() => expect(postActions.getByRole('status')).toHaveTextContent('Message copied to clipboard.'));
});

test('notifications can be filtered, expanded, and marked as read', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Notifications' }));

  expect(screen.getByRole('heading', { name: 'Notification' })).toBeInTheDocument();
  const unreadFilter = screen.getByLabelText('Filter notifications');
  fireEvent.click(screen.getAllByRole('button', { name: /Unread notification:/ })[0]);
  expect(screen.getByText(/Ananya Singh sent you a message/)).toBeInTheDocument();

  fireEvent.change(unreadFilter, { target: { value: 'Unread' } });
  expect(screen.getAllByRole('button', { name: /Unread notification:/ })).toHaveLength(2);

  fireEvent.click(screen.getByRole('button', { name: 'Mark all as read' }));
  expect(screen.getByText('No unread notifications.')).toBeInTheDocument();
});

test('SETU chat lets the teacher select a conversation and send a message', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Messages' }));
  fireEvent.click(screen.getByRole('tab', { name: 'SETU' }));

  expect(screen.getByRole('region', { name: 'SETU messaging' })).toBeInTheDocument();
  fireEvent.click(screen.getAllByRole('button', { name: /Mrs. Aishwarya/ })[0]);
  fireEvent.change(screen.getByRole('textbox', { name: 'Type your message' }), {
    target: { value: 'I will review it today.' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Send message' }));
  expect(within(screen.getByLabelText('Conversation')).getByText('I will review it today.')).toBeInTheDocument();
});

test('chat back control returns to the conversation list', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Messages' }));
  fireEvent.click(screen.getByRole('tab', { name: 'SETU' }));
  fireEvent.click(screen.getAllByRole('button', { name: /Priya Singh/ })[0]);
  expect(screen.getByText(/Kindly you please recheck the assignment/)).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Back to conversations' }));
  expect(screen.getByRole('button', { name: /Priya Singh/ })).toBeInTheDocument();
  expect(screen.queryByText(/Kindly you please recheck the assignment/)).not.toBeInTheDocument();
});

test('clears only the selected chat after confirmation and keeps its contact', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Messages' }));
  fireEvent.click(screen.getByRole('tab', { name: 'SETU' }));
  fireEvent.click(screen.getAllByRole('button', { name: /Priya Singh/ })[0]);
  fireEvent.click(screen.getByRole('button', { name: 'More conversation options' }));
  const clearAction = screen.getByRole('menuitem', { name: 'Clear' });
  expect(clearAction.querySelector('svg')).toBeNull();
  fireEvent.click(clearAction);

  const confirmation = screen.getByRole('alertdialog', { name: 'Clear conversation?' });
  fireEvent.click(within(confirmation).getByRole('button', { name: 'Cancel' }));
  expect(screen.getByText(/Kindly you please recheck the assignment/)).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'More conversation options' }));
  fireEvent.click(screen.getByRole('menuitem', { name: 'Clear' }));
  fireEvent.click(screen.getByRole('button', { name: 'Clear messages' }));

  expect(screen.getByText('No Messages Yet')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Priya Singh/ })).toBeInTheDocument();
  expect(screen.getByText('Conversation messages cleared.')).toBeInTheDocument();
});

test('start a new chat opens the contact picker and selects a conversation', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Messages' }));
  fireEvent.click(screen.getByRole('tab', { name: 'SETU' }));
  fireEvent.change(screen.getByRole('textbox', { name: 'Search conversations' }), {
    target: { value: 'no matching contact' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Start a new chat' }));

  const picker = screen.getByRole('dialog', { name: 'Start a new chat' });
  fireEvent.click(within(picker).getAllByRole('button', { name: /Mrs. Aishwarya/ })[0]);
  expect(screen.queryByRole('dialog', { name: 'Start a new chat' })).not.toBeInTheDocument();
  const conversation = screen.getByLabelText('Conversation');
  expect(within(conversation).getByText('Mrs. Aishwarya')).toBeInTheDocument();
  expect(conversation.querySelector('.avatar svg')).toBeInTheDocument();
});

test('Schedule sidebar entry opens the Teacher schedule view', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Class Schedule' }));
  expect(screen.getByRole('heading', { name: 'Class Schedule' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Timetable' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Class Details' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Class Schedule' })).toHaveAttribute('aria-current', 'page');
  expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('aria-current', 'false');
  fireEvent.click(screen.getAllByRole('button', { name: 'Mark Attendance' })[0]);
  expect(screen.getByRole('status')).toHaveTextContent('Mark Attendance selected.');
});
