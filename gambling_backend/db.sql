CREATE TABLE users
(user_id BIGSERIAL NOT NULL,
PRIMARY KEY (user_id),
username VARCHAR(30),
UNIQUE(username),
first_name VARCHAR(50),
last_name VARCHAR(50),
phone_number VARCHAR(14) NOT NULL,
UNIQUE(phone_number),
email VARCHAR(50) NOT NULL,
password text,
UNIQUE(email),
gender VARCHAR(6),
current_bal INT,
whats_app_no INT,
Payment_Details Text[],
is_admin BOOLEAN DEFAULT('f')
);
CREATE TABLE matches
(
match_id BIGSERIAL UNIQUE NOT NULL,
PRIMARY KEY (match_id),
match_desc VARCHAR(100),
player_1 BIGINT NOT NULL,
player_2 BIGINT,
FOREIGN KEY (player_1) REFERENCES users(user_id),
FOREIGN KEY (player_2) REFERENCES users(user_id),
game INT NOT NULL,
FOREIGN KEY (game) REFERENCES games(game_id),
requested_bet INT NOT NULL,
commission_amount INT,
winable_amount INT,
in_progress BOOLEAN DEFAULT('f'),
status text,
player_1_funded BOOLEAN DEFAULT('f'),
player_2_funded BOOLEAN DEFAULT('f'),
winner BIGINT,
FOREIGN KEY (winner) REFERENCES users(user_id),
dispute BOOLEAN DEFAULT('f'),
match_created_at text,
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

CREATE TABLE money_claim (
    payment_id BIGSERIAL NOT NULL,
    PRIMARY KEY (payment_id),
    amount INT not null,
    request_by int,
    foreign key (request_by) REFERENCES users(user_id),
    proof int UNIQUE,
    foreign key (proof) REFERENCES images(image_id),
    is_approved BOOLEAN DEFAULT('f')
)
CREATE TABLE images (
    image_id BIGSERIAL UNIQUE NOT NULL,
    PRIMARY KEY (image_id),
    cloudinary_id TEXT NOT NULL,
    image_url TEXT NOT NULL)
TODO
#MEGGAGES