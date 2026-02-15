import { Base, Cluster, Heading, Stack } from 'smarthr-ui'
import styled from 'styled-components'

type ChatMessage = {
  id: string
  user: string
  message: string
}

type AvatarProps = {
  src: string
  size?: number // px
}

export default function App () {
  const title = '雑談配信'
  const chats: ChatMessage[] = [
    { id: '1', user: 'Alice', message: 'Hello!' },
    { id: '2', user: 'Bob', message: 'Hi there!' }
  ]

  return (
    <Stack>
      <Cluster>
        <Avatar src='../resources/icon.png' />
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
                <strong>{chat.user}:</strong> {chat.message}
              </div>
            ))}
          </Base>
        </ChatDiv>
      </Cluster>
    </Stack>
  )
}

const Avatar = ({ src, size = 64 }: AvatarProps) => {
  return (
    <img
      src={src}
      alt='avatar'
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        objectFit: 'cover', // 中央トリミング
        display: 'block'
      }}
    />
  )
}

const ChatDiv = styled.div`
  width: 200px;
`
