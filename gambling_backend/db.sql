CREATE TABLE users
(user_id BIGSERIAL NOT NULL,
PRIMARY KEY (user_id),
username VARCHAR(30),
UNIQUE(username),
first_name VARCHAR(50) NOT NULL,
last_name VARCHAR(50) NOT NULL,
phone_number INT NOT NULL,
UNIQUE(phone_number),
email VARCHAR(50) NOT NULL,
UNIQUE(email),
gender VARCHAR(6),
current_bal INT,
whats_app_no INT,
Payment_Details VARCHAR[],
is_admin BOOLEAN DEFAULT('f')
wins BIGINT NOT NULL DEFAULT(0),
loses BIGINT NOT NULL DEFAULT(0),
Draws BIGINT NOT NULL DEFAULT(0)
);
CREATE TABLE matches
(
match_id BIGSERIAL UNIQUE NOT NULL,
PRIMARY KEY (match_id),
match_desc VARCHAR(100),
player_1 BIGINT NOT NULL UNIQUE,
player_2 BIGINT UNIQUE,
FOREIGN KEY (player_1) REFERENCES users(user_id),
FOREIGN KEY (player_2) REFERENCES users(user_id),
game INT NOT NULL,
FOREIGN KEY (game) REFERENCES games(game_id),
requested_bet BIGINT NOT NULL,
betted_amount INT,
commission_amount INT,
winable_amount INT,
is_finnished BOOLEAN DEFAULT('f'),
winner BIGINT,
FOREIGN KEY (winner) REFERENCES users(user_id),
dispute BOOLEAN DEFAULT('f'),
match_created_at TIMESTAMP
);
CREATE TABLE games(
    game_id BIGSERIAL NOT NULL UNIQUE,
    PRIMARY KEY (game_id),
    game_name VARCHAR(50) UNIQUE NOT NULL);

CREATE TABLE ingame_payments(
    FOREIGN KEY (match_id) REFERENCES matches(match_id),
)

CREATE TABLE reports(
    report_id BIGSERIAL UNIQUE NOT NULL,
    PRIMARY KEY (report_id),
    FOREIGN KEY (reported_by) REFERENCES users(user_id),
    topic VARCHAR(50) NOT NULL,
    topic_desc TEXT NOT NULL,
    contact_no VARCHAR(15) NOT NULL
);

TODO
#MEGGAGES