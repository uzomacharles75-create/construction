import { useState, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DashboardShell } from '../../components/layout/DashboardShell';
import { useAuthStore } from '../../store/useAuthStore';
import apiClient from '../../api/client';

import { io } from 'socket.io-client';

import {
  Send,
  Search,
  MoreHorizontal,
  Phone,
  CheckCheck,
  ArrowLeft,
  MessageSquare,
} from 'lucide-react';

import {
  motion,
} from 'framer-motion';

// SOCKET CONNECTION
const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  window.location.origin;

const socket = io(SOCKET_URL, {
  transports: ['websocket'],
});

const StaffMessages = () => {
  const { user } = useAuthStore();

  const queryClient = useQueryClient();

  const [activeChat, setActiveChat] =
    useState<any>(null);

  const [inputText, setInputText] =
    useState('');

  const scrollRef =
    useRef<HTMLDivElement>(null);

  // FETCH CONVERSATIONS
  const {
    data: conversations,
    isLoading: loadingChats,
  } = useQuery({
    queryKey: ['staff-conversations'],

    queryFn: async () => {
      const { data } =
        await apiClient.get(
          '/messages/conversations'
        );

      return data;
    },
  });

  // FETCH CHAT MESSAGES
  const {
    data: messages,
    isLoading: loadingMessages,
  } = useQuery({
    queryKey: [
      'staff-messages',
      activeChat?._id,
    ],

    queryFn: async () => {
      const { data } =
        await apiClient.get(
          `/messages/${activeChat._id}`
        );

      return data;
    },

    enabled: !!activeChat?._id,
  });

  // SOCKET LISTENER
  useEffect(() => {
    if (!user?.id) return;

    socket.emit('join_room', user.id);

    const handleReceiveMessage = (
      newMsg: any
    ) => {
      queryClient.setQueryData(
        [
          'staff-messages',
          newMsg.conversationId,
        ],
        (old: any = []) => {
          return [...old, newMsg];
        }
      );

      queryClient.invalidateQueries({
        queryKey: ['staff-conversations'],
      });
    };

    socket.on(
      'receive_message',
      handleReceiveMessage
    );

    return () => {
      socket.off(
        'receive_message',
        handleReceiveMessage
      );
    };
  }, [user?.id, queryClient]);

  // AUTO SCROLL
  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages]);

  // SEND MESSAGE
  const handleSend = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      !inputText.trim() ||
      !activeChat
    )
      return;

    const payload = {
      conversationId: activeChat._id,
      text: inputText,
      senderId: user?.id,
    };

    try {
      const { data } =
        await apiClient.post(
          '/messages',
          payload
        );

      socket.emit(
        'send_message',
        data
      );

      queryClient.setQueryData(
        [
          'staff-messages',
          activeChat._id,
        ],
        (old: any = []) => {
          return [...old, data];
        }
      );

      queryClient.invalidateQueries({
        queryKey: ['staff-conversations'],
      });

      setInputText('');
    } catch (err) {
      console.error(
        'Transmission failed',
        err
      );
    }
  };

  const showList = !activeChat;
  const showChat = !!activeChat;

  return (
    <DashboardShell>
      <div className="min-h-[calc(100dvh-8rem)] h-[calc(100dvh-8rem)] sm:h-[calc(100dvh-10rem)] flex bg-brand-navy-card rounded-2xl sm:rounded-[3.5rem] shadow-premium border border-brand-border overflow-hidden">

        {/* LEFT SIDEBAR */}
        <aside
          className={`${
            showList
              ? 'flex'
              : 'hidden'
          } md:flex w-full md:w-80 border-r border-brand-border flex-col bg-brand-navy-light/30 shrink-0`}
        >
          {/* HEADER */}
          <div className="p-8 border-b border-brand-border bg-brand-navy-card">
            <h2 className="font-black text-white tracking-tight">
              Team Comms
            </h2>

            <div className="mt-4 relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35"
                size={14}
              />

              <input
                type="text"
                placeholder="Find colleague..."
                className="w-full pl-9 pr-4 py-2 bg-brand-navy-light rounded-xl text-[11px] font-bold border-none outline-none focus:ring-2 focus:ring-brand-yellow/10"
              />
            </div>
          </div>

          {/* CHAT LIST */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {loadingChats ? (
              <div className="p-10 text-center animate-pulse text-white/35 font-bold text-xs uppercase tracking-widest">
                Loading encrypted lines...
              </div>
            ) : (
              conversations?.map(
                (chat: any) => {
                  const otherUser =
                    chat.participants.find(
                      (p: any) =>
                        p._id !== user?.id
                    );

                  return (
                    <div
                      key={chat._id}
                      onClick={() =>
                        setActiveChat(
                          chat
                        )
                      }
                      className={`p-6 m-2 rounded-[2rem] cursor-pointer transition-all flex gap-4 items-center ${
                        activeChat?._id ===
                        chat._id
                          ? 'bg-brand-yellow text-brand-navy shadow-xl shadow-yellow'
                          : 'hover:bg-brand-navy-card'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-xl bg-brand-navy-card/20 flex items-center justify-center font-black text-xs shrink-0">
                        {otherUser?.name?.charAt(
                          0
                        ) || 'U'}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black truncate">
                          {otherUser?.name ||
                            'Unknown User'}
                        </p>

                        <p
                          className={`text-[10px] truncate ${
                            activeChat?._id ===
                            chat._id
                              ? 'text-brand-yellow'
                              : 'text-white/50'
                          }`}
                        >
                          {chat.lastMessage ||
                            'Start site coordination...'}
                        </p>
                      </div>
                    </div>
                  );
                }
              )
            )}
          </div>
        </aside>

        {/* CHAT WINDOW */}
        <main
          className={`${
            showChat
              ? 'flex'
              : 'hidden'
          } md:flex flex-1 flex-col bg-brand-navy-card min-w-0`}
        >
          {activeChat ? (
            <>
              {/* TOP BAR */}
              <header className="p-4 sm:p-6 border-b border-brand-border flex justify-between items-center px-4 sm:px-10 gap-2">
                <div className="flex items-center gap-3 min-w-0">

                  <button
                    type="button"
                    onClick={() =>
                      setActiveChat(
                        null
                      )
                    }
                    className="md:hidden p-2 rounded-xl bg-brand-navy-light shrink-0"
                    aria-label="Back"
                  >
                    <ArrowLeft
                      size={20}
                    />
                  </button>

                  {(() => {
                    const otherUser =
                      activeChat.participants.find(
                        (
                          p: any
                        ) =>
                          p._id !==
                          user?.id
                      );

                    return (
                      <>
                        <div className="w-10 h-10 rounded-xl bg-brand-navy flex items-center justify-center text-white font-black text-xs italic">
                          {otherUser?.name?.charAt(
                            0
                          ) || 'U'}
                        </div>

                        <div>
                          <p className="text-xs font-black text-white">
                            {otherUser?.name ||
                              'Unknown User'}
                          </p>

                          <p className="text-[9px] text-emerald-500 font-black uppercase tracking-[0.2em]">
                            Field Active
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-2.5 text-white/35 hover:text-brand-yellow transition-all">
                    <Phone
                      size={18}
                    />
                  </button>

                  <button className="p-2.5 text-white/35 hover:text-brand-yellow transition-all">
                    <MoreHorizontal
                      size={18}
                    />
                  </button>
                </div>
              </header>

              {/* MESSAGES */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-10 space-y-6 custom-scrollbar bg-brand-navy/50">

                {loadingMessages ? (
                  <div className="h-full flex items-center justify-center text-white/35 italic text-xs">
                    Accessing technical logs...
                  </div>
                ) : (
                  messages?.map(
                    (
                      msg: any,
                      i: number
                    ) => (
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: 5,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        key={i}
                        className={`flex flex-col ${
                          msg.senderId ===
                          user?.id
                            ? 'items-end'
                            : 'items-start'
                        }`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-[70%] p-5 rounded-[2rem] text-xs font-medium leading-relaxed shadow-sm ${
                            msg.senderId ===
                            user?.id
                              ? 'bg-brand-yellow text-brand-navy rounded-tr-none'
                              : 'bg-brand-navy-card text-white/90 border border-brand-border rounded-tl-none'
                          }`}
                        >
                          {msg.text}
                        </div>

                        <div className="mt-2 px-2 flex items-center gap-1">
                          <span className="text-[9px] text-white/35 font-black uppercase">
                            {new Date(
                              msg.createdAt
                            ).toLocaleTimeString(
                              [],
                              {
                                hour:
                                  '2-digit',
                                minute:
                                  '2-digit',
                              }
                            )}
                          </span>

                          {msg.senderId ===
                            user?.id && (
                            <CheckCheck
                              size={12}
                              className="text-brand-yellow"
                            />
                          )}
                        </div>
                      </motion.div>
                    )
                  )
                )}

                <div ref={scrollRef} />
              </div>

              {/* INPUT */}
              <footer className="p-4 sm:p-8 border-t border-brand-border bg-brand-navy-card">
                <form
                  onSubmit={
                    handleSend
                  }
                  className="flex gap-4 items-center bg-brand-navy-light p-2 rounded-[2.5rem] border border-brand-border focus-within:ring-4 ring-brand-yellow transition-all"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) =>
                      setInputText(
                        e.target.value
                      )
                    }
                    placeholder={`Reply to ${
                      activeChat.participants
                        .find(
                          (
                            p: any
                          ) =>
                            p._id !==
                            user?.id
                        )
                        ?.name?.split(
                          ' '
                        )[0] ||
                      'User'
                    }...`}
                    className="flex-1 bg-transparent border-none outline-none px-6 py-3 text-xs font-bold text-white"
                  />

                  <button
                    type="submit"
                    className="bg-brand-yellow p-4 rounded-[1.5rem] text-brand-navy shadow-xl hover:bg-brand-navy transition-all"
                  >
                    <Send
                      size={20}
                    />
                  </button>
                </form>
              </footer>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-20 opacity-30">
              <MessageSquare
                size={64}
                className="text-white/15 mb-6"
              />

              <h3 className="text-2xl font-black text-white">
                Site Coordination Hub
              </h3>

              <p className="text-xs font-bold text-white/50 mt-2 uppercase tracking-widest">
                Select a team member
                to begin
              </p>
            </div>
          )}
        </main>
      </div>
    </DashboardShell>
  );
};

export default StaffMessages;