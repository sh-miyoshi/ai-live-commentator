type AvatarProps = {
  src: string
  size?: number // px
}

type UserAvatarProps = {
  userName: string
  size?: number // px
}

export const Avatar = ({ src, size = 64 }: AvatarProps) => {
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

export const UserAvatar = ({ userName, size = 64 }: UserAvatarProps) => {
  const initial = userName?.[0]?.toUpperCase() ?? "?";
  const bg = stringToColor(userName);

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontWeight: 700,
        fontSize: size * 0.45,
        userSelect: "none",
        flexShrink: 0
      }}
    >
      {initial}
    </div>
  );
}

const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 65%, 45%)`;
}
