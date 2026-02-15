import {
  Base,
  Button,
  Center,
  Cluster,
  Heading,
  Input,
  Stack,
  Text
} from 'smarthr-ui'
import styled from 'styled-components'
import { Avatar, UserAvatar } from './avatar'
import { useState } from 'react'

export type ChatMessage = {
  id: string
  user: string
  message: string
  isStreamer: boolean
}

export default function App () {
  const [chats, setChats] = useState<ChatMessage[]>([])
  const [intervalId, setIntervalId] = useState<number | undefined>(undefined)
  const [sendMessage, setSendMessage] = useState('')
  const [lastMessage, setLastMessage] = useState('')

  const title = '雑談配信'
  const streamerName = '配信者'
  const fetchChats = async () => {
    try {
      const fetchedChats = await window.api.chat({ title, context: lastMessage })
      setChats(prevChats => {
        const newChats = prevChats.concat(
          fetchedChats.map(
            chat => ({ ...chat, isStreamer: false } as ChatMessage)
          )
        )
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
                    {chat.isStreamer ? (
                      <Avatar src='../resources/icon.png' size={24} />
                    ) : (
                      <UserAvatar userName={chat.user} size={24} />
                    )}
                    <Stack gap={0.125}>
                      <Text size='XS'>{chat.user}</Text>
                      <Text>{chat.message}</Text>
                    </Stack>
                  </ChatRow>
                </div>
              ))}

              <Cluster>
                <Input
                  type='text'
                  value={sendMessage}
                  onChange={e => {
                    setSendMessage(e.target.value)
                  }}
                />
                <Button
                  onClick={() => {
                    setChats(prevChats => {
                      const newChats = prevChats.concat({
                        id: crypto.randomUUID(),
                        user: streamerName,
                        message: sendMessage,
                        isStreamer: true
                      })
                      return newChats
                    })
                    setLastMessage(sendMessage)
                    setSendMessage('')
                  }}
                >
                  送信
                </Button>
              </Cluster>

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
                    const id = window.setInterval(fetchChats, 10000)
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
  background-color: #c9c9c9;
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
