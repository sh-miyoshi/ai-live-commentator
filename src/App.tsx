import { Base, Center, Cluster, Heading, Stack, Text } from 'smarthr-ui'
import styled from 'styled-components'
import { Avatar, UserAvatar } from './avatar'

type ChatMessage = {
  id: string
  user: string
  message: string
}

export default function App() {
  const title = '雑談配信'
  const chats: ChatMessage[] = [
    { id: '1', user: 'Alice', message: 'Hello!' },
    { id: '2', user: 'Bob', message: 'Hi there!' }
  ]

  return (
    <Stack>
      <Cluster>
        <Avatar src='../resources/icon.png' />
        <Stack gap={0.25}>
          <LiveBase padding={0.25}>
            <Center>
              LIVE
            </Center>
          </LiveBase>
          <Heading>{title}</Heading>
        </Stack>
      </Cluster>
      <Cluster>
        <div>
          <p>Content</p>
        </div>
        <ChatDiv>
          <Base radius='m' padding={1}>
            <Heading>チャット</Heading>
            {chats.map(chat => (
              <div key={chat.id}>
                <UserAvatar userName={chat.user} size={24} />
                <strong>{chat.user}:</strong> {chat.message}
              </div>
            ))}
          </Base>
        </ChatDiv>
      </Cluster>
    </Stack>
  )
}

const ChatDiv = styled.div`
  width: 200px;
`

const LiveBase = styled(Base)`
  background-color: #E0664F;
  width: 46px;
`
