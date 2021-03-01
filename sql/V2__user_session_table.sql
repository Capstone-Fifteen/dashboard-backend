CREATE TYPE gender_type AS ENUM ('Male', 'Female', 'Other');
COMMENT ON TYPE gender_type IS 'Enumeration of valid options for gender field';

-- Table of registered dancers
CREATE TABLE dancer(
                       id SERIAL PRIMARY KEY,
                       name VARCHAR(255) NOT NULL,
                       gender gender_type NOT NULL,
                       created_at TIMESTAMPTZ DEFAULT now(),
                       last_updated TIMESTAMPTZ DEFAULT now()
);
COMMENT ON TABLE dancer IS 'List of registered dancers';
COMMENT ON COLUMN dancer.name IS 'Name of dancer';

CREATE TABLE session(
                        id SERIAL PRIMARY KEY,
                        name VARCHAR(255) NOT NULL,
                        start_time TIMESTAMPTZ DEFAULT now(),
                        end_time TIMESTAMPTZ,
                        created_at TIMESTAMPTZ DEFAULT now()
);
COMMENT ON TABLE session is 'List of created dance sessions';
COMMENT ON COLUMN session.name IS 'Name of the session';
COMMENT ON COLUMN session.start_time IS 'Start time of the session';
COMMENT ON COLUMN session.end_time IS 'End time of the session';

CREATE TABLE participant(
                            session_id INTEGER REFERENCES session(id),
                            dancer_id INTEGER REFERENCES dancer(id),
                            device_id INTEGER REFERENCES device(id),
                            expected_moves TEXT,
                            expected_positions TEXT,
                            created_at TIMESTAMPTZ DEFAULT now(),
                            PRIMARY KEY(session_id, dancer_id)
);
COMMENT ON TABLE participant IS 'Dancer-session relationship';
COMMENT ON COLUMN participant.expected_moves IS 'Expected dance moves (in comma-separated values)';
COMMENT ON COLUMN participant.expected_positions IS 'Expected dance positions (in comma-separated values)';
