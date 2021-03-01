import datetime
import time
import os


os.environ['TZ'] = 'CST'
pattern = '%d.%m.%Y %H:%M:%S'
# start/end/interval in epoch time
start = int(time.mktime(time.strptime('26.02.2021 15:00:00', pattern))) # 3:00pm CST, 2/26/2021
end = int(time.mktime(time.strptime('22.02.2021 8:30:00' , pattern))) # 8:30am CST, 2/22/2021
print(datetime.datetime.fromtimestamp(start))
print(datetime.datetime.weekday(datetime.datetime.fromtimestamp(start)))
print(datetime.datetime.fromtimestamp(end))