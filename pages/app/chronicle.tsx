//import { useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useStore, store } from 'lib/store';
import ErrorBoundary from 'components/misc/ErrorBoundary';
import OpenSidebarButton from 'components/sidebar/OpenSidebarButton';
import NoteSumList from 'components/note/NoteSumList';
import FindOrCreateInput from 'components/note/NoteNewInput';
import HeatMap from 'components/HeatMap';
import { dateCompare, getStrDate } from 'utils/helper';
import { getOrCreateNoteId } from 'editor/handleNoteId';

export default function Chronicle() {
  const isSidebarOpen = useStore((state) => state.isSidebarOpen);

  const notes = useStore((state) => state.notes);
  const notesArr = Object.values(notes);
  const myNotes = notesArr.filter(n => !n.is_wiki && !n.is_daily);
  myNotes.sort((n1, n2) => dateCompare(n2.created_at, n1.created_at));
  const upDates = myNotes.map(n => getStrDate(n.created_at));
  const dateSet = new Set(upDates);
  const dates = Array.from(dateSet);

  const today = getStrDate((new Date()).toString());
  // get notes on a date
  const getDayNotes = (date: string) => myNotes.filter(n => getStrDate(n.created_at) === date);
  
  const router = useRouter();
  const onRecapDay = (date: string) => {
    const noteId = getOrCreateNoteId(date);
    // redirect to journals when the note not be prepared
    if (noteId) {
      const note = store.getState().notes[noteId]; // need to get note
      if (note) {
        router.push(`/app/md/${note.id}`);
      } else {
        router.push(`/app/journals`);
      }
    }
  };

  return (
    <>
      <Head>
        <title>Chronicle View | mdSilo</title>
      </Head>
      <ErrorBoundary>
        {!isSidebarOpen ? (
          <OpenSidebarButton className="absolute top-0 left-0 z-10 mx-4 my-1" />
        ) : null}
        <div className="flex flex-1 flex-col flex-shrink-0 md:flex-shrink p-6 w-full mx-auto md:w-128 lg:w-160 xl:w-192 bg-white dark:bg-gray-900 dark:text-gray-200 overlfow-y-auto">
          <div className="flex justify-center my-6">
            <FindOrCreateInput
              className="w-full bg-white rounded shadow-popover dark:bg-gray-800"
            />
          </div>
          <div className="my-1 p-1 rounded text-center">
            <Link href="/app/journals">
              <a className="link w-full text-2xl">Journals</a>
            </Link>
            <button className="link w-full mt-2" onClick={() => onRecapDay(today)}>
              Today : {today}
            </button>
          </div>
          <HeatMap />
          <div className="overlfow-y-auto">
            {dates.map((d) => (
              <NoteSumList
                key={d}
                anchor={d}
                notes={getDayNotes(d)}
                isDate={true}
                onClick={onRecapDay}
              />
            ))}
          </div>
        </div>
      </ErrorBoundary>
    </>
  );
}

