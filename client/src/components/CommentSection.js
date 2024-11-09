import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const CommentSectionWrapper = styled.div`
  background-color: #f8f9fa; /* Light gray background to stand out */
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 900px;
  margin: 2rem auto;

   @media (max-width: 768px) {
    padding: 1rem;
    max-width: 100%;
  }
`;

const CommentContainer = styled.div`
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const CommentInput = styled.textarea`
  width: 100%;
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid #ccc;
  resize: none;
  margin-bottom: 1.5rem;
  font-size: 1rem;
  background-color: #f9f9f9;
    @media (max-width: 768px) {
    padding: 0.8rem;
    font-size: 0.95rem;
  }
  &:focus {
    outline: none;
    border-color: #28a745;
    box-shadow: 0 0 10px rgba(40, 167, 69, 0.2);
  }
    
`;

const SubmitButton = styled.button`
  padding: 0.8rem 1.5rem;
  color: #fff;
  background-color: #28a745;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  margin-bottom:20px;
  font-size: 1.1rem;
 @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 1rem;
  }

  &:hover {
    background-color: #218838;
  }
`;

const Comment = styled.div`
  background-color: #ffffff;
  border-left: 4px solid #28a745;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
  &:hover {
    transform: translateY(-5px);
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const CommentContent = styled.p`
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 0.5rem;
  display: flex;
  flex-direction: column;

  strong {
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
    color: #28a745;
  }

  span {
    font-size: 1rem;
  }

  @media (max-width: 768px) {
    font-size: 1rem;

    strong {
      font-size: 1.1rem;
    }

    span {
      font-size: 0.95rem;
    }
  }
`;

const CommentFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #888;
  border-top: 1px solid #ddd;
  padding-top: 0.5rem;

   @media (max-width: 768px) {
    font-size: 0.85rem;
    padding-top: 0.3rem;
  }
`;

const ReplyButton = styled.button`
  color: #007bff;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.95rem;
  &:hover {
    color: #0056b3;
  }
     @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const ReplyContainer = styled.div`
  background-color: #f9f9f9;
  border-left: 3px solid #ddd;
  margin-left: 1.5rem;
  padding: 1rem;
  margin-top: 1rem;
  border-radius: 8px;
`;

const ReplyInput = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  border-radius: 10px;
  border: 1px solid #ddd;
  resize: none;
  font-size: 0.95rem;
  background-color: #ffffff;
  &:focus {
    outline: none;
    border-color: #28a745;
    box-shadow: 0 0 10px rgba(40, 167, 69, 0.2);
  }

   @media (max-width: 768px) {
    padding: 0.6rem;
    font-size: 0.9rem;
  }
`;

const ShowMoreButton = styled.button`
  color: #007bff;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.95rem;
  margin-top: 1rem;
  &:hover {
    color: #0056b3;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const CommentSection = ({ recipeId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showReplies, setShowReplies] = useState({});
  const [replyContent, setReplyContent] = useState({});
  const [userEmail, setUserEmail] = useState('');
  const [displayedComments, setDisplayedComments] = useState(2); // start with 2 comments
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const loggedInEmail = sessionStorage.getItem('email');
    setUserEmail(loggedInEmail);
    axios.get(`${API_BASE_URL}/api/comments?recipeId=${recipeId}`)
      .then(response => {
        setComments(response.data);
      })
      .catch(error => console.error('Error fetching comments:', error));
  }, [recipeId]);

  const handleCommentSubmit = () => {
    const commentData = { content: newComment, userEmail, recipeId, parentId: null };
    axios.post(`${API_BASE_URL}/api/comments`, commentData)
      .then(response => {
        setComments(prevComments => [response.data, ...prevComments]);
        setNewComment('');
      })
      .catch(error => console.error('Error submitting comment:', error));
  };

  const handleReplySubmit = (parentId) => {
    const replyData = { content: replyContent[parentId], userEmail, recipeId, parentId };
    axios.post(`${API_BASE_URL}/api/comments`, replyData)
      .then(response => {
        setComments(prevComments => {
          const updatedComments = [...prevComments];
          const parentComment = updatedComments.find(c => c.id === parentId);
          if (parentComment) {
            parentComment.replies = [...(parentComment.replies || []), response.data];
          }
          return updatedComments;
        });
        setReplyContent(prev => ({ ...prev, [parentId]: '' }));
      })
      .catch(error => console.error('Error submitting reply:', error));
  };

  const handleReplyToggle = (commentId) => {
    setShowReplies(prev => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const loadMoreComments = () => {
    setDisplayedComments(prev => prev + 2); // load 2 more comments
  };

  const handleDeleteComment = (id, isReply = false, parentId = null) => {
    const url = isReply
      ? `${API_BASE_URL}/api/comments/${id}?parentId=${parentId}`  // Pass parentId for replies
      : `${API_BASE_URL}/api/comments/${id}`;  // No parentId for parent comment deletion
    
    axios.delete(url)
      .then(() => {
        if (isReply && parentId !== null) {
          setComments(prevComments => {
            const updatedComments = [...prevComments];
            const parentComment = updatedComments.find(c => c.id === parentId);
            if (parentComment) {
              parentComment.replies = parentComment.replies.filter(reply => reply.id !== id);
            }
            return updatedComments;
          });
        } else {
          setComments(prevComments => prevComments.filter(comment => comment.id !== id));
        }
      })
      .catch(error => console.error('Error deleting comment:', error));
  };

  const renderComments = (comments) => {
    return comments.slice(0, displayedComments).map((comment) => (
      <Comment key={comment.id}>
        <CommentContent>
          <strong>{comment.userName}</strong>
          <span>{comment.content}</span>
        </CommentContent>
        <CommentFooter>
          <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
          {!comment.parentId && (
            <>
              <ReplyButton onClick={() => handleReplyToggle(comment.id)}>
                {showReplies[comment.id] ? 'Hide Replies' : 'Reply'}
              </ReplyButton>
              {comment.userEmail === userEmail && (
                <button onClick={() => handleDeleteComment(comment.id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>
                  Delete
                </button>
              )}
            </>
          )}
        </CommentFooter>
        {showReplies[comment.id] && !comment.parentId && (
          <ReplyContainer>
            {userEmail && (
              <>
                <ReplyInput
                  value={replyContent[comment.id] || ''}
                  onChange={(e) => setReplyContent(prev => ({ ...prev, [comment.id]: e.target.value }))}
                  placeholder="Write a reply..."
                />
                <SubmitButton onClick={() => handleReplySubmit(comment.id)}>Reply</SubmitButton>
              </>
            )}
            {comment.replies && comment.replies.map((reply) => (
              <Comment key={reply.id}>
                <CommentContent>
                  <strong>{reply.userName}</strong>
                  <span>{reply.content}</span>
                </CommentContent>
                <CommentFooter>
                  <span>{new Date(reply.createdAt).toLocaleDateString()}</span>
                  {reply.userEmail === userEmail && (
                    <button onClick={() => handleDeleteComment(reply.id, true, comment.id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>
                      Delete
                    </button>
                  )}
                </CommentFooter>
              </Comment>
            ))}
          </ReplyContainer>
        )}
      </Comment>
    ));
  };

  return (
    <CommentSectionWrapper>
      <h2>Comments</h2>
      <CommentInput
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Write a comment..."
      />
      <SubmitButton onClick={handleCommentSubmit}>Submit Comment</SubmitButton>

      {renderComments(comments)}

      {comments.length > displayedComments && (
        <ShowMoreButton onClick={loadMoreComments}>Load More</ShowMoreButton>
      )}
    </CommentSectionWrapper>
  );
};

export default CommentSection;
