import praw

# This file contains the script that fetches data from Reddit,
# analyzes its sentiment, and outputs it as a JSON file.

reddit = praw.Reddit(
    client_id="",
    client_secret="",
    client_secret