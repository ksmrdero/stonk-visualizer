import praw
import json
import csv
import time
import os

from psaw import PushshiftAPI
from nltk.sentiment.vader import SentimentIntensityAnalyzer as SIA

# This file contains the script that fetches data from Reddit,
# analyzes its sentiment, and outputs it as a JSON file.

# determine if comment is pos or neg. lower threshold results in more false positives/negatives
pos_neg_threshold = 0.35

def get_data(start, end, interval, stocks, subreddits, mode='w', path='stonk-visualizer/data/reddit/'):
    """
    Starts analyzing post/comment sentiment by stocks for each subreddit,
    starting at start time and going backward in interval increments.
    Also writes data to path as it's read

    start = time to start search backwards
    end = when to stop search
    interval = time period to get posts and analyze sentiment for
    stocks = stock tickers to filter comments for. if None, analyzes every comment
    subreddits = stocks to check each ticker for. if None, checks all of Reddit

    mode = 'a' or 'w', if you want to append to or rewrite the csv respectively
    path = where to write .csv file
    """
    csvfile = open(path+'data.csv', mode, newline='', buffering=2048)
    spamwriter = csv.writer(csvfile)
    lines_written = 0

    sia = SIA() # SentimentIntensityAnalyzer

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
    api = PushshiftAPI() # use alternative API to get post ids based on time

    subreddits = ['wallstreetbets', 'stocks', 'investing']

    for sr in subreddits:
        for stock in stocks:
            curr_time = start
            # while curr_time > end:
            while curr_time > start - interval * 15:
                posts = []
                comments = []

                # accumulate posts/comments using aliases of the stock
                for alias in stock:
                    if alias == 'no-filter':
                        # posts += list(api.search_submissions(subreddit = sr,
                        #                             before = curr_time,
                        #                             after = curr_time-interval,
                        #                             filter = ['selftext'],
                        #                             limit=50))
                        comments += list(api.search_comments(subreddit = sr,
                                                    before = curr_time,
                                                    after = curr_time-interval,
                                                    filter = ['body'],
                                                    limit=100))
                    else:
                        # posts += list(api.search_submissions(subreddit = sr,
                        #                             q = alias, # only get posts that contain q
                        #                             before = curr_time,
                        #                             after = curr_time-interval,
                        #                             filter = ['selftext'],
                        #                             limit=50))
                        comments += list(api.search_comments(subreddit = sr,
                                                    q = alias, # only get comments that contain q
                                                    before = curr_time,
                                                    after = curr_time-interval,
                                                    filter = ['body'],
                                                    limit=100))

                #if posts:
                    #print("posts:",posts[:4])
                #print("comments:",comments[0][0])

                num_pos = 0
                num_neutral = 0
                num_neg = 0
                num_skipped = 0

                for post in posts:
                    # skip empty/removed posts
                    if post[1] == '' or post[1] == '[removed]':
                        num_skipped += 1
                        continue
                    pol_score = sia.polarity_scores("yay") # pass in submission selftext (body)
                    #print(pol_score)
                    if pol_score['compound'] > pos_neg_threshold:
                        num_pos += 1
                    elif pol_score['compound'] < -1*pos_neg_threshold:
                        num_neg += 1
                    else:
                        num_neutral += 1
                for comment in comments:
                    #print("\n",comment[0])
                    pol_score = sia.polarity_scores(comment[0]) # pass in comment body
                    #print(pol_score)
                    if pol_score['compound'] > pos_neg_threshold:
                        num_pos += 1
                    elif pol_score['compound'] < -1*pos_neg_threshold:
                        num_neg += 1
                    else:
                        num_neutral += 1
                
                print("skipped:", num_skipped,"/",len(posts))
                d = {
                    "stock" : stock[0],
                    "subreddit" : sr,
                    "sentiment" : 100 * (num_pos-num_neg+1) / (num_pos+num_neutral+num_neg+1),
                    "num_pos" : num_pos,
                    "num_neutral" : num_neutral,
                    "num_neg" : num_neg,
                    "time" : curr_time,
                    "date" : time.strftime('%Y-%m-%d %H:%M:00', time.localtime(curr_time))
                    }
                spamwriter.writerow([d['stock'], d['subreddit'], d['sentiment'],
                    d['num_pos'], d['num_neutral'], d['num_neg'], d['time'], d['date']])
                lines_written += 1

                # check if time is equal to 8:30am CST. if it is, then subtract 17 hrs to get to 3:30pm again
                # if sunday, subtract 2 days to get to previous friday
                curr_time -= interval
                

    print("Lines written:", lines_written)
    csvfile.close()

if __name__ == "__main__":
    os.environ['TZ'] = 'CST'
    pattern = '%d.%m.%Y %H:%M:%S'
    # start/end/interval in epoch time
    start = int(time.mktime(time.strptime('26.02.2021 15:00:00', pattern))) # 3:00pm CST, 2/26/2021
    end = int(time.mktime(time.strptime('22.02.2021 8:30:00' , pattern))) # 8:30am CST, 2/22/2021

    interval = 60 * 30 # 30 minute intervals
    # stocks = ['no-stock', 'AAPL', 'BTC', 'DIA', 'GME', 'GOOG', 'SPY', 'TSLA']
    stocks = [['no-filter'], ['AAPL', "apple"], ['GME'], ['SPY'], ['TSLA', 'tesla']] # popular aliases included
    # note, apple is twice as frequent as APPL, tesla twice as much as TSLA
    # but gamestop is 1/5th as frequent as GME
    subreddits = ['wallstreetbets', 'stocks', 'investing']

    program_start_time = time.time()

    get_data(start, end, interval, stocks, subreddits)

    print("Program time:", time.time() - program_start_time)