'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Heart, MessageCircle, Send, MoreHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { Thread, ThreadReply } from '@/lib/bazaar-data';

interface ThreadBazaarProps {
  threads: Thread[];
}

export function ThreadBazaar({ threads: initialThreads }: ThreadBazaarProps) {
  const [threads, setThreads] = useState<Thread[]>(initialThreads);
  const [expandedThread, setExpandedThread] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleLike = (threadId: string) => {
    setThreads(prev => prev.map(thread => {
      if (thread.id === threadId) {
        return {
          ...thread,
          likes: thread.isLiked ? thread.likes - 1 : thread.likes + 1,
          isLiked: !thread.isLiked
        };
      }
      return thread;
    }));
  };

  const handleLikeReply = (threadId: string, replyId: string) => {
    setThreads(prev => prev.map(thread => {
      if (thread.id === threadId) {
        const updatedReplies = thread.replies.map(reply => {
          if (reply.id === replyId) {
            return {
              ...reply,
              likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
              isLiked: !reply.isLiked
            };
          }
          return reply;
        });
        return { ...thread, replies: updatedReplies };
      }
      return thread;
    }));
  };

  const handleReply = (threadId: string) => {
    if (!replyText.trim()) return;
    
    const newReply: ThreadReply = {
      id: `reply-${Date.now()}`,
      userId: 'current-user',
      userName: 'You',
      userAvatar: 'https://i.pravatar.cc/150?img=20',
      content: replyText,
      timestamp: 'now',
      likes: 0,
      isLiked: false,
    };

    setThreads(prev => prev.map(thread => {
      if (thread.id === threadId) {
        return {
          ...thread,
          replies: [...thread.replies, newReply],
          replyCount: thread.replyCount + 1
        };
      }
      return thread;
    }));

    setReplyText('');
    setReplyingTo(null);
  };

  if (threads.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No discussions yet</p>
        <p className="text-sm text-gray-400 mt-1">Be the first to start a conversation!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-0">
      {threads.map(thread => (
        <div 
          key={thread.id}
          className="bg-white rounded-xl p-4"
        >
          {/* Thread Header */}
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <img 
                src={thread.userAvatar} 
                alt={thread.userName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 text-sm">{thread.userName}</span>
                <span className="text-gray-400 text-xs">· {thread.timestamp}</span>
              </div>
              
              {/* Thread Content */}
              <p className="text-gray-700 text-sm mt-1 leading-relaxed">
                {thread.content}
              </p>

              {/* Thread Actions */}
              <div className="flex items-center gap-4 mt-3">
                <button 
                  onClick={() => handleLike(thread.id)}
                  className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 transition-colors"
                >
                  <Heart 
                    className={`w-4 h-4 ${thread.isLiked ? 'fill-red-500 text-red-500' : ''}`} 
                  />
                  <span className="text-xs">{thread.likes}</span>
                </button>
                
                <button 
                  onClick={() => setReplyingTo(replyingTo === thread.id ? null : thread.id)}
                  className="flex items-center gap-1.5 text-gray-500 hover:text-blue-500 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-xs">{thread.replyCount}</span>
                </button>
                
                <button className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 transition-colors ml-auto">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              {/* Reply Input */}
              {replyingTo === thread.id && (
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#ff2742]"
                    onKeyDown={(e) => e.key === 'Enter' && handleReply(thread.id)}
                  />
                  <button 
                    onClick={() => handleReply(thread.id)}
                    disabled={!replyText.trim()}
                    className="bg-[#ff2742] text-white rounded-full p-2 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Replies Section */}
              {thread.replies.length > 0 && (
                <div className="mt-3 pt-3">
                  {expandedThread === thread.id ? (
                    <>
                      {thread.replies.map(reply => (
                        <div key={reply.id} className="flex gap-2 mb-3 last:mb-0">
                          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                            <img 
                              src={reply.userAvatar} 
                              alt={reply.userName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="bg-gray-50 rounded-2xl px-3 py-2">
                              <span className="font-semibold text-xs text-gray-900">{reply.userName}</span>
                              <p className="text-xs text-gray-700 mt-0.5">{reply.content}</p>
                            </div>
                            <div className="flex items-center gap-3 mt-1 ml-2">
                              <button 
                                onClick={() => handleLikeReply(thread.id, reply.id)}
                                className="flex items-center gap-1 text-gray-400"
                              >
                                <Heart 
                                  className={`w-3 h-3 ${reply.isLiked ? 'fill-red-500 text-red-500' : ''}`} 
                                />
                                <span className="text-xs">{reply.likes}</span>
                              </button>
                              <span className="text-xs text-gray-400">{reply.timestamp}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      <button 
                        onClick={() => setExpandedThread(null)}
                        className="flex items-center gap-1 text-[#ff2742] text-xs font-medium mt-2"
                      >
                        <ChevronUp className="w-3 h-3" />
                        Hide replies
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => setExpandedThread(thread.id)}
                      className="flex items-center gap-1 text-[#ff2742] text-xs font-medium mt-1"
                    >
                      <ChevronDown className="w-3 h-3" />
                      View {thread.replyCount} {thread.replyCount === 1 ? 'reply' : 'replies'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ThreadBazaar;
