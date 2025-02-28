CREATE VIEW feature_requests_view AS
SELECT
    fr.id,
    fr.created_by,
    json_build_object(
        'id', up.id,
        'email', up.email,
        'first_name', up.first_name,
        'last_name', up.last_name
    ) AS creator,
    fr.request_title,
    fr.request_description,
    fr.status,
    fr.created_at,
    fr.updated_at,
    COALESCE(vote_counts.vote_count, 0) AS total_votes,
    COALESCE(comment_counts.comment_count, 0) AS total_comments,
    votes.vote_details,
    comments.comment_details
FROM feature_requests fr
LEFT JOIN user_profile_view up ON fr.created_by = up.id 

LEFT JOIN (
    SELECT feature_request_id, COUNT(*) AS vote_count
    FROM feature_request_votes
    GROUP BY feature_request_id
) vote_counts ON fr.id = vote_counts.feature_request_id

LEFT JOIN (
    SELECT feature_request_id, COUNT(*) AS comment_count
    FROM feature_request_comments
    GROUP BY feature_request_id
) comment_counts ON fr.id = comment_counts.feature_request_id

LEFT JOIN (
    SELECT frv.feature_request_id,
        json_agg(json_build_object(
            'id', frv.id,
            'voter', json_build_object(
                'id', up.id,
                'email', up.email,
                'first_name', up.first_name,
                'last_name', up.last_name
            ),
            'created_at', frv.created_at
        )) AS vote_details
    FROM feature_request_votes frv
    INNER JOIN user_profile_view up ON frv.created_by = up.id
    GROUP BY frv.feature_request_id
) votes ON fr.id = votes.feature_request_id

LEFT JOIN (
    SELECT frc.feature_request_id,
        json_agg(json_build_object(
            'id', frc.id,
            'commentor', json_build_object(
                'id', up.id,
                'email', up.email,
                'first_name', up.first_name,
                'last_name', up.last_name
            ),
            'comment', frc.comment,
            'created_at', frc.created_at
        ) ORDER BY frc.created_at ASC) AS comment_details
    FROM feature_request_comments frc
    INNER JOIN user_profile_view up ON frc.created_by = up.id
    GROUP BY frc.feature_request_id
) comments ON fr.id = comments.feature_request_id;
