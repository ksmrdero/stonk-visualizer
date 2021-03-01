
from psaw import PushshiftAPI
import os
import time
import praw
import json

# stored api keys and login locally
with open("stonk-visualizer/scripts/reddit/secret.txt") as f:
    secret_keys = json.load(f)

reddit = praw.Reddit(
    client_id=secret_keys['client_id'],
    client_secret=secret_keys['client_secret'],
    username = "Kuderic",
    password = secret_keys['p'][3:] + str(217),
    user_agent = "Stonk-visualizer by Kuderic"
)
api = PushshiftAPI(reddit) # use alternative API to get post ids based on time

interval = 60 * 100
os.environ['TZ'] = 'CST'
pattern = '%d.%m.%Y %H:%M:%S'
# start/end/interval in epoch time
start = int(time.mktime(time.strptime('26.02.2021 15:00:00', pattern))) # 3:00pm CST, 2/26/2021

sr = "wallstreetbets"

posts = api.search_comments(subreddit = sr,
                                q = "GME",
                                before = start,
                                after = start-interval,
                                filter = ['selftext'],
                                limit=50)