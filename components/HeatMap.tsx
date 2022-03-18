import { useRouter } from 'next/router';
import { store } from 'lib/store';

export default function HeatMap() {
  const router = useRouter();
  const onDayClick = (weekIdx: number, dayIdx: number) => {
    const note = naviToDailyNote(weekIdx, dayIdx);
    if (note) { router.push(`/app/md/${note.id}`); }
  };
  const hmLabelClass = "text-xs fill-green-500 cursor-pointer";
  return (
    <div className="overflow-auto p-2 m-2">
      <svg width="828" height="128" className="hm-svg">
        <g transform="translate(10, 20)">
          {Array.from(Array(53).keys()).map(weekIdx => (
            <WeekHeatMap key={`week-${weekIdx}`} weekIdx={weekIdx} onClick={onDayClick} />
          ))}
          {Array.from(Array(12).keys()).map(idx => (
            <text 
              key={`mon-${idx}`} 
              x={`${calcMonStart() * 16 + 66 * idx}`} 
              y="-8" className={hmLabelClass}
            >
              {getMonthLabel(idx)}
            </text>
          ))}
          <text textAnchor="start" className="hidden" dx="-10" dy="8">Sun</text>
          <text textAnchor="start" className={hmLabelClass} dx="-10" dy="25">Mon</text>
          <text textAnchor="start" className="hidden" dx="-10" dy="42">Tue</text>
          <text textAnchor="start" className={hmLabelClass} dx="-10" dy="56">Wed</text>
          <text textAnchor="start" className="hidden" dx="-10" dy="72">Thu</text>
          <text textAnchor="start" className={hmLabelClass} dx="-10" dy="85">Fri</text>
          <text textAnchor="start" className="hidden" dx="-10" dy="98">Sat</text>
        </g>
      </svg>
    </div>
  );
}

type WeekProps = {
  weekIdx: number;
  onClick: (weekIdx: number, dayIdx: number) => void;
  className?: string;
};

function WeekHeatMap({ weekIdx, onClick }: WeekProps) {
  
  return (
    <g transform={`translate(${16 * weekIdx}, 0)`}>
      {Array.from(Array(7).keys()).map(dayIdx => (
        <rect 
          key={`day-${dayIdx}`} width="11" height="11" rx="2" ry="2"  
          x={`${16 - weekIdx}`} 
          y={`${15 * dayIdx}`} 
          className={getDayStyle(weekIdx, dayIdx)} 
          onClick={() => onClick(weekIdx, dayIdx)}
        >
          <title>{getDataToolTips(weekIdx, dayIdx)}</title>
        </rect>
      ))}
    </g>
  );
}

function getDate(weekIdx: number, dayIdx: number) {
  const date = new Date();
  const day = date.getDate();
  const weekDay = date.getDay();
  const gapDay = (52 - weekIdx) * 7 - (dayIdx - weekDay);
  date.setDate(day - gapDay);
  return date.toISOString().split('T')[0];
}

function calcMonStart() {
  const date = new Date();
  const day = date.getDate();
  const startIdx = Math.ceil(day / 7);
  return startIdx;
}

type ActivityData = {
  activityNum: number; 
  createNum: number;
  updateNum: number;
}
function getData(weekIdx: number, dayIdx: number): ActivityData {
  const date = getDate(weekIdx, dayIdx);
  const notes = Object.values(store.getState().notes);
  let createNum = 0;
  let updateNum = 0;
  for (const note of notes) {
    if (note.created_at.startsWith(date)) {
      createNum += 1;
    }
    if (note.updated_at.startsWith(date)) {
      updateNum += 1;
    }
  }
  return {
    activityNum: createNum + updateNum,
    createNum,
    updateNum,
  };
}

function getDataToolTips(weekIdx: number, dayIdx: number) {
  const data = getData(weekIdx, dayIdx);
  const date = getDate(weekIdx, dayIdx);
  return `${date}:\nActivity: ${data.activityNum}\nCreated: ${data.createNum}\nUpdated: ${data.updateNum}`;
}

function getDayStyle(weekIdx: number, dayIdx: number) {
  const data = getData(weekIdx, dayIdx);
  const an = data.activityNum;
  const anStyle = an === 0 
    ? 'fill-gray-200 dark:fill-gray-800'
    : an >= 12 
      ? 'fill-green-500'
      : an >= 6 
        ? 'fill-cyan-500'
        : 'fill-primary-200 dark:fill-primary-900';

  return `${anStyle} cursor-pointer`;
}

function getMonthLabel(idx: number) {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const nowMonth = new Date().getMonth();
  const monIdx = nowMonth + idx + 1;
  const realIdx = monIdx >= 12 ? monIdx - 12 : monIdx;
  return months[realIdx];
}

const ymdNums = (date: string) => {
  const nums =  date.split('-').map(n => Number(n));
  return nums;
};

function naviToDailyNote(weekIdx: number, dayIdx: number) {
  const date = getDate(weekIdx, dayIdx);
  const notes = Object.values(store.getState().notes).filter(n => n.is_daily);
  const dateNums = ymdNums(date);
  for (const note of notes) {
    const titleNums = ymdNums(note.title);
    const check = dateNums.join('') === titleNums.join('');
    if (check) {
     return note;
    }
  }
}
