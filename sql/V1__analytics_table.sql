-- Table of registered wearable (device)
CREATE TABLE device(
                       id SERIAL PRIMARY KEY,
                       name VARCHAR(255)
);

COMMENT ON TABLE device IS 'List of registered wearables';
COMMENT ON COLUMN device.name IS 'Text identifier of the wearable';

-- Table of raw sensor data
CREATE TABLE raw_data(
                         device_timestamp TIMESTAMPTZ,
                         device_id INTEGER REFERENCES device(id),
                         created_at TIMESTAMPTZ DEFAULT now(),
                         x_reading NUMERIC NOT NULL,
                         y_reading NUMERIC NOT NULL,
                         z_reading NUMERIC NOT NULL,
                         pitch_reading NUMERIC NOT NULL,
                         roll_reading NUMERIC NOT NULL,
                         yaw_reading NUMERIC NOT NULL,
                         PRIMARY KEY(device_timestamp, device_id)
);
SELECT create_hypertable('raw_data', 'device_timestamp');
COMMENT ON TABLE raw_data IS 'Raw data from accelerometer and gyroscope';
COMMENT ON COLUMN raw_data.device_timestamp IS 'Timestamp of readings from wearable';
COMMENT ON COLUMN raw_data.device_id IS 'Unique identifier of wearable';
COMMENT ON COLUMN raw_data.x_reading IS 'Accelerometer reading at X-axis';
COMMENT ON COLUMN raw_data.y_reading IS 'Accelerometer reading at Y-axis';
COMMENT ON COLUMN raw_data.z_reading IS 'Accelerometer reading at Z-axis';
COMMENT ON COLUMN raw_data.pitch_reading IS 'Gyroscope reading at X-axis';
COMMENT ON COLUMN raw_data.roll_reading IS 'Gyroscope reading at Y-axis';
COMMENT ON COLUMN raw_data.yaw_reading IS 'Gyroscope reading at Z-axis';

-- Table of predicted data
CREATE TABLE predicted_data(
                               prediction_timestamp TIMESTAMPTZ,
                               device_id INTEGER REFERENCES device(id),
                               created_at TIMESTAMPTZ DEFAULT now(),
                               dance_position NUMERIC NOT NULL,
                               dance_move VARCHAR(255) NOT NULL,
                               PRIMARY KEY(prediction_timestamp, device_id)
);
SELECT create_hypertable('predicted_data', 'prediction_timestamp');
COMMENT ON TABLE predicted_data IS 'Raw data from accelerometer and gyroscope';
COMMENT ON COLUMN predicted_data.prediction_timestamp IS 'Timestamp the prediction was generated';
COMMENT ON COLUMN predicted_data.device_id IS 'Unique identifier of wearable';
COMMENT ON COLUMN predicted_data.dance_position IS 'Predicted position of dancer';
COMMENT ON COLUMN predicted_data.dance_move IS 'Predicted dance move of dancer';
