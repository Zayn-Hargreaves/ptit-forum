import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CommentItem } from './comment-item';
import { Comment, TargetType } from '@entities/interaction/model/types';

// Mock the required hooks and components
vi.mock('@entities/session/model/queries', () => ({
  useMe: () => ({ data: null }),
}));

vi.mock('@features/comment/hooks/use-update-comment', () => ({
  useUpdateComment: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

vi.mock('@features/report/ui/report-dialog', () => ({
  ReportDialog: () => <div data-testid="report-dialog">Report Dialog</div>,
}));

vi.mock('./comment-form', () => ({
  CommentForm: () => <div data-testid="comment-form">Comment Form</div>,
}));

vi.mock('./reply-list', () => ({
  ReplyList: () => <div data-testid="reply-list">Reply List</div>,
}));

// Mock console.warn for testing
const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

describe('CommentItem XSS Prevention', () => {
  const mockComment: Comment = {
    id: 'test-comment-id',
    content: '',
    postId: 'test-post-id',
    author: {
      id: 'test-author-id',
      fullName: 'Test Author',
      avatarUrl: 'https://example.com/avatar.jpg',
    },
    createdDateTime: new Date().toISOString(),
    permissions: {
      canEdit: true,
      canDelete: true,
      canReport: false,
    },
    stats: {
      replyCount: 0,
      reactionCount: 0,
    },
  };

  const defaultProps = {
    comment: mockComment,
    postId: 'test-post-id',
    onDelete: vi.fn(),
    onReplySuccess: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock NODE_ENV for each test
    vi.stubEnv('NODE_ENV', 'development');
  });

  it('should sanitize dangerous HTML content', () => {
    const dangerousComment = {
      ...mockComment,
      content: '<script>alert("XSS")</script><p>Safe content</p>',
    };

    render(<CommentItem {...defaultProps} comment={dangerousComment} />);

    // The script tag should be removed, but p tag should remain
    const contentElement = screen.getByText('Safe content');
    expect(contentElement).toBeInTheDocument();

    // Check that console.warn was called for dangerous HTML
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Potentially dangerous HTML detected in comment content. Server-side sanitization may be insufficient.',
      expect.objectContaining({
        commentId: 'test-comment-id',
      })
    );
  });

  it('should preserve safe HTML content', () => {
    const safeComment = {
      ...mockComment,
      content: '<p><strong>Bold text</strong> and <em>italic text</em></p><br><code>code</code>',
    };

    render(<CommentItem {...defaultProps} comment={safeComment} />);

    // Check that safe HTML elements are preserved
    expect(screen.getByText('Bold text')).toBeInTheDocument();
    expect(screen.getByText('italic text')).toBeInTheDocument();
    expect(screen.getByText('code')).toBeInTheDocument();

    // Should not warn about dangerous HTML
    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });

  it('should detect iframe tags as dangerous', () => {
    const iframeComment = {
      ...mockComment,
      content: '<iframe src="https://evil.com"></iframe><p>Normal text</p>',
    };

    render(<CommentItem {...defaultProps} comment={iframeComment} />);

    expect(screen.getByText('Normal text')).toBeInTheDocument();
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Potentially dangerous HTML detected in comment content. Server-side sanitization may be insufficient.',
      expect.any(Object)
    );
  });

  it('should detect javascript: URLs as dangerous', () => {
    const jsUrlComment = {
      ...mockComment,
      content: '<a href="javascript:alert(\'XSS\')">Click me</a><p>Safe</p>',
    };

    render(<CommentItem {...defaultProps} comment={jsUrlComment} />);

    expect(screen.getByText('Safe')).toBeInTheDocument();
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Potentially dangerous HTML detected in comment content. Server-side sanitization may be insufficient.',
      expect.any(Object)
    );
  });

  it('should detect event handlers as dangerous', () => {
    const eventHandlerComment = {
      ...mockComment,
      content: '<div onclick="alert(\'XSS\')">Click me</div><p>Safe</p>',
    };

    render(<CommentItem {...defaultProps} comment={eventHandlerComment} />);

    expect(screen.getByText('Safe')).toBeInTheDocument();
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Potentially dangerous HTML detected in comment content. Server-side sanitization may be insufficient.',
      expect.any(Object)
    );
  });

  it('should not warn in production mode', () => {
    vi.stubEnv('NODE_ENV', 'production');

    const dangerousComment = {
      ...mockComment,
      content: '<script>alert("XSS")</script><p>Safe content</p>',
    };

    render(<CommentItem {...defaultProps} comment={dangerousComment} />);

    // Should not warn in production
    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });

  it('should handle empty content gracefully', () => {
    const emptyComment = {
      ...mockComment,
      content: '',
    };

    expect(() => {
      render(<CommentItem {...defaultProps} comment={emptyComment} />);
    }).not.toThrow();

    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });

  it('should handle null content gracefully', () => {
    const nullComment = {
      ...mockComment,
      content: null as any,
    };

    expect(() => {
      render(<CommentItem {...defaultProps} comment={nullComment} />);
    }).not.toThrow();

    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });
});
