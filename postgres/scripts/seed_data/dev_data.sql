-- !psql

INSERT INTO staff (username, password, phone_number)
VALUES ('staff1', 'password', '123');

INSERT INTO poi (name, latitude, longitude)
VALUES ('Community hall', 12.57765, 106.93492),
       ('West bridge', 12.58695, 106.92453),
       ('South west footbridge', 12.57489, 106.92981),
       ('Abandoned gold mine', 12.63372, 106.91886);

INSERT INTO report (report_type, severity, latitude, longitude)
VALUES ('erw', 'high', 12.60189, 106.92091),
       ('logging', 'low', 12.57283, 106.86640),
       ('mining', 'moderate', 12.63804, 106.91842),
       ('poaching', 'moderate', 12.55632, 106.93859);
