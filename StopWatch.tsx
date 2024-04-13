import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

function StopWatch(): React.JSX.Element {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [lapTime, setLapTime] = useState(0);
  const [lap, setLap] = useState<number[]>([]);
  const [itval, setItl] = useState<NodeJS.Timeout | null>(null);
  const [minTime, setMinTime] = useState(0);
  const [maxTime, setMaxTime] = useState(0);
  const [minIndex, setMinIndex] = useState(-1);
  const [maxIndex, setMaxIndex] = useState(-1);
  const [hasStart, setHasStart] = useState(false);

  const startButton = () => {
    if (isRunning) {
      setIsRunning(false);
      if (itval) clearInterval(itval);
      return;
    }
    setIsRunning(true);
    setHasStart(true);
    const startTimer = setInterval(() => {
      setTime(time => time + 10);
      setLapTime(lapTime => lapTime+10)
    }, 70);
    setItl(startTimer);
  };

  const lapButton = () => {
    setLap([lapTime, ...lap]);
    setLapTime(0)
    setMaxIndex(maxIndex=>maxIndex+1)
    setMinIndex(minIndex=>minIndex+1)
    findMin()
  };

  const findMin = () => {
    lap.map((item, index) => {
        if (minTime == 0 || minTime > item) {
            setMinIndex(index)
            setMinTime(item)
        }
        if (maxTime < item) {
            setMaxIndex(index)
            setMaxTime(item)
        }
    })

  }

  const format = (duration: number, isMili:boolean) => {
    if (('' + duration).length == 1 && !isMili) {
      return '0' + duration;
    } else if (('' + duration).length == 2 && !isMili) return '' + duration;
    else {
        if (duration < 100)
            return '0' + duration/10;
        else 
            return '' + duration/10;
    }
  };

  const convert = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const remainingMilliseconds = milliseconds % 1000;
    return (
      format(minutes, false) +
      ':' +
      format(seconds, false) +
      ',' +
      format(remainingMilliseconds, true)
    );
  };

  const resetButton = () => {
    setTime(0)
    setLapTime(0)
    setMinIndex(-1)
    setMaxIndex(-1)
    setMaxTime(0)
    setMinTime(0)
    setIsRunning(false)
    setHasStart(false)
    setLap([])
    if (itval) clearInterval(itval);
  }

  let lapLength = lap.length;

  return (
    <View style={styles.container}>
      <Text style={[styles.textColor, styles.timeText]}>{convert(time)}</Text>
      <View style={styles.buttonSection}>
        <TouchableOpacity
          style={[styles.radiusButton, hasStart? styles.radiusColorLap2:styles.radiusColorLap]}
          onPress={hasStart&&!isRunning? resetButton:lapButton}>
          <View style={[styles.button, hasStart? styles.buttonColorLap2:styles.buttonLap1Color]}>
            <Text style={styles.textLap}>{hasStart&&!isRunning? 'Reset':'Lap'}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.radiusButton, isRunning?styles.radiusColorStop: styles.radiusColorStart]}
          onPress={startButton}>
          <View style={[styles.button, isRunning ? styles.buttonColorStop:styles.buttonStartColor]}>
            <Text style={isRunning? styles.textStop:styles.textStart}>
                {isRunning ? 'Stop' : 'Start'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.mt}>
        <View style={styles.labResult}>
            <Text style={styles.resultText}>Lap {lapLength+1}</Text>
            <Text style={styles.resultText}>{convert(lapTime)}</Text>
        </View>
        {[...lap].map((x, i) => (
          <View key={i} style={styles.labResult}>
            <Text style={(lapLength>=2&&i==minIndex)?styles.textStart:(lapLength>=2&&i==maxIndex)?styles.textStop:styles.resultText}>Lap {lapLength - i}</Text>
            <Text style={(lapLength>=2&&i==minIndex)?styles.textStart:(lapLength>=2&&i==maxIndex)?styles.textStop:styles.resultText}>{convert(x)}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  textColor: {
    color: 'white',
  },
  timeText: {
    fontSize: 70,
    fontWeight: '400',
    marginVertical: 90,
  },
  textLap: {
    fontSize: 20,
    color: 'white',
  },
  textStart: {
    fontSize: 20,
    color: 'rgb(69 194 102)',
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonLap1Color: {
    backgroundColor: 'rgb(28 27 29)',
  },
  buttonStartColor: {
    backgroundColor: 'rgb(9 41 16)',
  },
  buttonSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  radiusButton: {
    width: 90,
    height: 90,
    borderRadius: 100,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radiusColorLap: {
    borderColor: 'rgb(28 27 29)',
  },
  radiusColorStart: {
    borderColor: 'rgb(9 41 16)',
  },
  labResult: {
    marginTop: 15,
    width: '100%',

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultText: {
    fontSize: 20,
    color: 'white',
  },
  radiusColorStop: {
    borderColor: 'rgb(52 14 13)',
  },
  buttonColorStop: {
    backgroundColor: 'rgb(52 14 13)',
  },
  buttonColorLap2: {
    backgroundColor: 'rgb(51 51 51)',
  },
  radiusColorLap2: {
    borderColor: 'rgb(51 51 51)',
  },
  textStop: {
    fontSize: 20,
    color: 'rgb(214 69 61)',
  },
  mt: {
    marginTop: 10,
  }
});

export default StopWatch;
