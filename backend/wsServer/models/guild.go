package models

type UpdateGuilds struct {
	Type    interface{}
	GuildId string
	UserId  string
}

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
	GuildId string `json:"guildId"`
	Member  User   `json:"member"`
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

type LeaveGuildResult struct {
	GuildId string `json:"guildId"`
}

// ################################## RESULTS ##############################################

// ################################## BROADCASTS ##############################################
type GuildDeleteBroadcast struct {
	GuildId string `json:"guildId"`
}

type GuildJoinBroadcast struct {
	User    User   `json:"user"`
	GuildId string `json:"guildId"`
}

type GuildLeaveBroadcast struct {
	UserId  string `json:"userId"`
	GuildId string `json:"guildId"`
}
