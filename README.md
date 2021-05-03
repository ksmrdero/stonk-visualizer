# stonk-visualizer

## Retreiving/Processing Data
This step isn't necessary unless you want to retreive new data. 

### Stock Data
`./scripts/stocks/` contains 2 notebooks used for downloading stock data.

### Reddit Data
`./scripts/reddit/reddit.py` contains the code for gathering data from reddit and applying sentiment analysis. 

### Merging Everything Together
`./scripts/merge.ipynb` contains all the code for post-processing and merging stock and sentiment data, to create all the data `index.js` reads under `./data/new/`. 

sentiment score = 100 * (# positive - # negative) / (max number of posts overall)

## Loading the visualization
`index.html` can't be opened directly with normal brower settings. We used the Live Server extension on VS Code to open it. Everything will load automatically once it's opened. 

## Contributions
James - html code, merging code, d3 code
Nick - Stock code
Eric - Reddit code
Shefali - d3 code, interactions
