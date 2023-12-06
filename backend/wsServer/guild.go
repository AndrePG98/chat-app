package wsServer

type Guild struct {
	GuildId  string
	Channels []string
}

func NewGuild() *Guild {
	return &Guild{
		Channels: make([]string, 0),
	}
}
