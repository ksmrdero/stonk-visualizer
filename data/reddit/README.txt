data.csv is formatted as follows:
stock (no-stock means no filter), subreddit, sentiment, num_pos, num_neutral, num_neg, end time (epoch format), end time (date format)

sentiment = 100 * (# positive - # negative) / (total)
if all posts/comments analyzed are positive, sentiment = 100,
if half positive, half negative, sentiment = 0
if all neutral, sentiment = 0
if all negative, sentiment = -100

I recommend changing sentiment calculation if it makes the graph look better