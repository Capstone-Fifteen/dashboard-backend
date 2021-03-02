CREATE TABLE dancer_analytic(
    dancer_id INT REFERENCES dancer(id),
    session_id INT REFERENCES session(id),
    move_accuracy NUMERIC,
    position_accuracy NUMERIC,
    average_emg NUMERIC,
    average_delay NUMERIC,
    created_at TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (dancer_id, session_id)
);

COMMENT ON TABLE dancer_analytic IS 'Table of aggregated data from each session for each dancer';
COMMENT ON COLUMN dancer_analytic.move_accuracy IS 'Overall dance move accuracy of the session';
COMMENT ON COLUMN dancer_analytic.position_accuracy IS 'Overall dance position accuracy of the session';
COMMENT ON COLUMN dancer_analytic.average_emg IS 'Average EMG reading of the session';
COMMENT ON COLUMN dancer_analytic.average_emg IS 'Average delay of the session';
