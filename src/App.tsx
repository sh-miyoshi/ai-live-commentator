import {
  ActionDialog,
  Base,
  Button,
  Center,
  Cluster,
  Dropdown,
  DropdownContent,
  DropdownTrigger,
  FaEllipsisIcon,
  FormControl,
  Heading,
  Input,
  Stack,
  Text
} from 'smarthr-ui'
import styled from 'styled-components'
import { Avatar, UserAvatar } from './avatar'
import { useRef, useState } from 'react'

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
  const [isSettingDialogOpen, setIsSettingDialogOpen] = useState(false)
  const [title, setTitle] = useState('雑談配信')
  const [streamerName, setStreamerName] = useState('配信者')
  // ダイアログ用一時state
  const [tempTitle, setTempTitle] = useState(title)
  const [tempStreamerName, setTempStreamerName] = useState(streamerName)

  const lastMessageRef = useRef('こんにちはー')
  const isFetchRef = useRef(false)

  const fetchChats = async () => {
    if (isFetchRef.current) {
      console.log('already fetching... skip')
      return
    }

    try {
      isFetchRef.current = true
      const fetchedChats = await window.api.chat({
        title,
        context: lastMessageRef.current
      })
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
      isFetchRef.current = false
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <Stack>
      <TitleCluster justify='space-between'>
        <Cluster>
          <Avatar src='../resources/icon.png' />
          <Stack gap={0.25}>
            {intervalId ? (
              <LiveBase padding={0.25}>
                <Center>LIVE</Center>
              </LiveBase>
            ) : (
              <WaitingBase padding={0.25}>
                <Center>待機中</Center>
              </WaitingBase>
            )}
            <Heading>{title}</Heading>
          </Stack>
        </Cluster>
        <div>
          <Dropdown>
            <DropdownTrigger>
              <Button>
                <FaEllipsisIcon />
              </Button>
            </DropdownTrigger>
            <DropdownContent>
              <ul>
                <li>
                  <SettingButton
                    variant='text'
                    onClick={() => {
                      setTempTitle(title)
                      setTempStreamerName(streamerName)
                      setIsSettingDialogOpen(true)
                    }}
                  >
                    設定
                  </SettingButton>
                </li>
                <li>
                  {intervalId ? (
                    <SettingButton
                      variant='text'
                      onClick={() => {
                        console.log('clear interval: ', intervalId)
                        clearInterval(intervalId)
                        setIntervalId(undefined)
                      }}
                    >
                      配信を停止
                    </SettingButton>
                  ) : (
                    <SettingButton
                      variant='danger'
                      onClick={() => {
                        fetchChats()
                        const id = window.setInterval(fetchChats, 10000)
                        console.log('set interval: ', id)
                        setIntervalId(id)
                      }}
                    >
                      配信を開始する
                    </SettingButton>
                  )}
                </li>
              </ul>
            </DropdownContent>
          </Dropdown>
        </div>
      </TitleCluster>
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
                    lastMessageRef.current = sendMessage
                    setSendMessage('')
                  }}
                >
                  送信
                </Button>
              </Cluster>
            </Stack>
          </Base>
        </ChatDiv>
      </Cluster>
      <ActionDialog
        title='設定'
        actionText='OK'
        onClickAction={() => {
          setTitle(tempTitle)
          setStreamerName(tempStreamerName)
          setIsSettingDialogOpen(false)
        }}
        onClickClose={() => {
          setIsSettingDialogOpen(false)
        }}
        isOpen={isSettingDialogOpen}
        size='XS'
      >
        <Stack>
          <FormControl label='配信タイトル'>
            <Input
              value={tempTitle}
              onChange={e => {
                setTempTitle(e.target.value)
              }}
              width='100%'
            />
          </FormControl>
          <FormControl label='配信者名'>
            <Input
              value={tempStreamerName}
              onChange={e => {
                setTempStreamerName(e.target.value)
              }}
              width='100%'
            />
          </FormControl>
        </Stack>
      </ActionDialog>
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

const WaitingBase = styled(Base)`
  background-color: #9a9493;
  width: 52px;
`

const SettingButton = styled(Button)`
  width: 140px;
  justify-content: flex-start;
`

const TitleCluster = styled(Cluster)`
  padding: 0.25rem 1.5rem 0.25rem 0.25rem;
`
