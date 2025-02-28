CREATE VIEW user_profile_view AS
SELECT
    u.id,
    u.email,
    up.first_name,
    up.last_name
FROM auth.users u
INNER JOIN user_profiles up ON u.id = up.user_id;
