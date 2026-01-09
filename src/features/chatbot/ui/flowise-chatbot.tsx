'use client';

import { useEffect } from 'react';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'flowise-fullchatbot': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

export const FlowiseChatbot = () => {
  useEffect(() => {
    // This effect ensures we only run this on the client,
    // although the script tag handles the logic itself.
    // We use a script tag injection to support the ES module import syntax from the CDN.
  }, []);

  return (
    <script
      type="module"
      dangerouslySetInnerHTML={{
        __html: `
            import Chatbot from "https://cdn.jsdelivr.net/npm/flowise-embed/dist/web.js"
            Chatbot.init({
                chatflowid: "ce102308-7471-4b49-8d30-db1069b3fbae",
                apiHost: "https://cloud.flowiseai.com",
                chatflowConfig: {
                    /* Chatflow Config */
                },
                observersConfig: {
                    /* Observers Config */
                },
                theme: {
                    button: {
                        backgroundColor: '#3B81F6',
                        right: 20,
                        bottom: 20,
                        size: 48,
                        dragAndDrop: true,
                        iconColor: 'white',
                        customIconSrc: 'https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/google-messages.svg',
                        autoWindowOpen: {
                            autoOpen: false,
                            openDelay: 2,
                            autoOpenOnMobile: false
                        }
                    },
                    tooltip: {
                        showTooltip: true,
                        tooltipMessage: 'Xin chào 👋!',
                        tooltipBackgroundColor: 'black',
                        tooltipTextColor: 'white',
                        tooltipFontSize: 16
                    },
                    // disclaimer: {
                    //     title: 'Disclaimer',
                    //     message: "By using this chatbot, you agree to the <a target=\\"_blank\\" href=\\"https://flowiseai.com/terms\\">Terms & Condition</a>",
                    //     textColor: 'black',
                    //     buttonColor: '#3b82f6',
                    //     buttonText: 'Start Chatting',
                    //     buttonTextColor: 'white',
                    //     blurredBackgroundColor: 'rgba(0, 0, 0, 0.4)',
                    //     backgroundColor: 'white'
                    // },
                    customCSS: \`\`,
                    chatWindow: {
                        showTitle: true,
                        showAgentMessages: false,
                        title: 'Chatbot PTIT',
                        titleAvatarSrc: 'https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/google-messages.svg',
                        welcomeMessage: 'Xin chào! tôi có thể giúp gì cho bạn',
                        errorMessage: 'xin lỗi tôi không thể trả lời câu hỏi này',
                        backgroundColor: '#ffffff',
                        backgroundImage: 'enter image path or link',
                        height: 700,
                        width: 400,
                        fontSize: 16,
                        starterPrompts: [
                            "sinh viên được nghỉ tết dương mấy hôm?",
                            "sinh viên có bắt buộc mua bảo hiểm y tế không?"
                        ],
                        starterPromptFontSize: 15,
                        clearChatOnReload: false,
                        sourceDocsTitle: 'Sources:',
                        renderHTML: true,
                        botMessage: {
                            backgroundColor: '#f7f8ff',
                            textColor: '#303235',
                            showAvatar: true,
                            avatarSrc: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Logo_PTIT_University.png/2048px-Logo_PTIT_University.png'
                        },
                        userMessage: {
                            backgroundColor: '#3B81F6',
                            textColor: '#ffffff',
                            showAvatar: true,
                            avatarSrc: 'https://raw.githubusercontent.com/zahidkhawaja/langchain-chat-nextjs/main/public/usericon.png'
                        },
                        textInput: {
                            placeholder: 'nhập câu hỏi của bạn vào đây',
                            backgroundColor: '#ffffff',
                            textColor: '#303235',
                            sendButtonColor: '#3B81F6',
                            maxChars: 50,
                            maxCharsWarningMessage: 'Bạn đã vượt quá giới hạn ký tự. Vui lòng nhập ít hơn 50 ký tự.',
                            autoFocus: true,
                            sendMessageSound: true,
                            sendSoundLocation: 'send_message.mp3',
                            receiveMessageSound: true,
                            receiveSoundLocation: 'receive_message.mp3'
                        },
                        feedback: {
                            color: '#303235'
                        },
                        dateTimeToggle: {
                            date: true,
                            time: true
                        },
                        footer: {
                            textColor: '#303235',
                            text: 'Powered by',
                            company: 'PTIT FORUM',
                            companyLink: 'https://flowiseai.com'
                        }
                    }
                }
            })
        `,
      }}
    />
  );
};
