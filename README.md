# Stonk Visualizer

This visualization analyzes the relationship between social media and stock price movements. Data is scraped from Reddit/Twitter, and presented using D3. 

## Retreiving/Processing Data 

### Stock Data
`./scripts/stocks/` contains notebooks used for downloading stock data.

### Reddit Data
`./scripts/reddit/reddit.py` contains the code for gathering data from reddit and applying sentiment analysis. 

### Twitter Data
`./scripts/twitter/` contains the scripts used to download tweets.

### Merging Everything Together
`./scripts/merge.ipynb` contains all the code for post-processing and merging stock and sentiment data, to create all the data `index.js` reads under `./data/new/`. 

sentiment score = 100 * (# positive - # negative) / (max number of posts overall)

## Loading the visualization
`index.html` can't be opened directly with normal brower settings. We used the Live Server extension on VS Code to open it. 