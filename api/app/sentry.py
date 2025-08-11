import sentry_sdk
from app.config import Config

def init_sdk():
    sentry_sdk.init(
        dsn=Config().SENTRY_URL,
        # Add data like request headers and IP for users, if applicable;
        # see https://docs.sentry.io/platforms/python/data-management/data-collected/ for more info
        send_default_pii=True,
        # Set traces_sample_rate to 1.0 to capture 100%
        # of transactions for tracing.
        traces_sample_rate=1.0,
        # To collect profiles for all profile sessions,
        # set `profile_session_sample_rate` to 1.0.
        profile_session_sample_rate=1.0,
        # Profiles will be automatically collected while
        # there is an active span.
        profile_lifecycle="trace",

        # Enable logs to be sent to Sentry
        _experiments={
            "enable_logs": True,
        },
    )
