export enum Error{
    AUTH_EMAIL_ALREADY_EXISTS = "auth/email-already-exists",
    AUTH_USERNAME_ALREADY_EXISTS = "auth/username-already-exists",
    AUTH_INVALID_EMAIL_PASSWORD = "auth/invalid-email-password",
    AUTH_UNAUTHORIZED = "auth/unauthorized",
    SERVICE_UNKNOWN_ERROR = "service/unknown-error",
    POST_UNAUTHORIZED_MODIFICATION = "post/unauthorized-modification",
    POST_INVALID_ID = "post/invalid-id",
    VOTES_UNAUTHORIZED_MODIFICATION = "votes/unauthorized-modification",
    VOTES_INVALID_ID = "votes/invalid-id",
    DB_INVALID_ID = "db/invalid-id",
    COMMENT_INVALID_ID = "comment/invalid-id",
    COMMENT_UNAUTHORIZED_MODIFICATION = "comment/unauthorized-modification"
}