import { Base, Button, Center, Cluster, Heading, Stack, Text } from 'smarthr-ui'
import styled from 'styled-components'
import { Avatar, UserAvatar } from './avatar'
import { useEffect, useState } from 'react'

export type ChatMessage = {
  id: string
  user: string
  message: string
}

export default function App () {
  const [chats, setChats] = useState<ChatMessage[]>([])
  const [intervalId, setIntervalId] = useState<number | undefined>(undefined)

  const title = '雑談配信'
  const fetchChats = async () => {
    try {
      const fetchedChats = await window.api.chat()
      setChats(prevChats => {
        const newChats = prevChats.concat(fetchedChats)
        console.log('fetched chats: ', fetchedChats)
        console.log('new chats: ', newChats)
        return newChats
      })
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <Stack>
      <Cluster>
        <Avatar src='../resources/icon.png' />
        <Stack gap={0.25}>
          <LiveBase padding={0.25}>
            <Center>LIVE</Center>
          </LiveBase>
          <Heading>{title}</Heading>
        </Stack>
      </Cluster>
      <Cluster>
        <ContentBase radius='m' padding={1}>
          <Center>メイン画面</Center>
        </ContentBase>
        <ChatDiv>
          <Base radius='m' padding={1}>
            <Stack>
              <Heading>チャット</Heading>
              {chats.map(chat => (
                <div key={chat.id}>
                  <ChatRow>
                    <UserAvatar userName={chat.user} size={24} />
                    <Stack gap={0.125}>
                      <Text size='XS'>{chat.user}</Text>
                      <Text>{chat.message}</Text>
                    </Stack>
                  </ChatRow>
                </div>
              ))}

              {intervalId ? (
                <Button
                  onClick={() => {
                    console.log('clear interval: ', intervalId)
                    clearInterval(intervalId)
                    setIntervalId(undefined)
                  }}
                >
                  停止
                </Button>
              ) : (
                <Button
                  variant='primary'
                  onClick={() => {
                    fetchChats()
                    const id = window.setInterval(fetchChats, 5000)
                    console.log('set interval: ', id)
                    setIntervalId(id)
                  }}
                >
                  開始
                </Button>
              )}
            </Stack>
          </Base>
        </ChatDiv>
      </Cluster>
    </Stack>
  )
}

// WIP: サイズは100% - チャット欄を横幅として、6:4で高さを決める
const ContentBase = styled(Base)`
  width: 600px;
  height: 400px;
`

const ChatDiv = styled.div`
  width: 300px;
`

const ChatRow = styled(Cluster)`
  align-items: center;
`

const LiveBase = styled(Base)`
  background-color: #e0664f;
  width: 46px;
`
