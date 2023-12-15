package models

type Guild struct {
	ID       string    `json:"guildId"`
	OwnerId  string    `json:"ownerId"`
	Name     string    `json:"guildName"`
	Members  []User    `json:"members"`
	Channels []Channel `json:"channels"`
}

// ################################## EVENTS ###########################################

type CreateGuildEvent struct {
	OwnerId   string `json:"ownerId"`
	GuildName string `json:"guildName"`
}

type DeleteGuildEvent struct {
	UserId  string `json:"userId"`
	GuildId string `json:"guildId"`
}

type JoinGuildEvent struct {
	GuildId  string `json:"guildId"`
	MemberId User   `json:"member"`
}

type LeaveGuildEvent struct {
	GuildId  string `json:"guildId"`
	MemberId string `json:"memberId"`
}

// ################################## EVENTS ###########################################

// ################################## RESULTS ##############################################

// Works for Creating and Joining already existing guild. If creating simply return an empty one
type JoinGuildResult struct {
	Guild Guild `json:"guild"`
}

// ################################## RESULTS ##############################################

// ################################## BROADCASTS ##############################################

type GuildJoinBroadcast struct {
	User    User   `json:"user"`
	GuildId string `json:"guildId"`
}

type GuildDeleteBroadcast struct {
	GuildId string `json:"guildId"`
}

type GuildLeaveBroadcast struct {
	UserId string `json:"userId"`
	Guild  Guild  `json:"guild"`
}
