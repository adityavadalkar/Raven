import os, random, string


class BaseConfig:
    SECRET_KEY = os.getenv("SECRET_KEY", None)
    if not SECRET_KEY:
        SECRET_KEY = "".join(random.choice(string.ascii_lowercase) for i in range(32))
