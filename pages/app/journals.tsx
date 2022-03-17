import { Descendant } from 'slate';
import Head from 'next/head';
import Link from 'next/link';
import { useStore } from 'lib/store';
import { Note } from 'types/model';
import ErrorBoundary from 'components/misc/ErrorBoundary';
import FindOrCreateInput from 'components/note/NoteNewInput';
import { realDateCompare, strToDate } from 'utils/helper';
import { bleachLinks } from 'editor/hooks/useSummary';
import ReadOnlyEditor from 'components/editor/ReadOnlyEditor';

export default function Journals() {
  const notes = useStore((state) => state.notes);
  const notesArr = Object.values(notes);
  const dailyNotes = notesArr.filter(n => !n.is_wiki && n.is_daily);
  dailyNotes.sort((n1, n2) => realDateCompare(strToDate(n2.title), strToDate(n1.title)));

  return (
    <>
      <Head>
        <title>Daily Notes | mdSilo</title>
      </Head>
      <ErrorBoundary>
        <div className="flex flex-1 flex-col flex-shrink-0 md:flex-shrink p-6 w-full mx-auto md:w-128 lg:w-160 xl:w-192 bg-white dark:bg-gray-900 dark:text-gray-200 overlfow-y-auto">
          <div className="flex justify-center my-6">
            <FindOrCreateInput
              className="w-full bg-white rounded shadow-popover dark:bg-gray-800"
            />
          </div>
          <div className="overlfow-y-auto">
            {dailyNotes.map((n) => (
              <NoteItem key={n.id} note={n} />
            ))}
          </div>
        </div>
      </ErrorBoundary>
    </>
  );
}

type NoteItemProps = {
  note: Note;
};

function NoteItem(props: NoteItemProps) {
  const { note } = props;
  const value: Descendant[] = bleachLinks(note.content);
  const noteId = note.id;

  return (
    <div className="flex flex-col w-full mx-auto overlfow-y-auto">
      <Link href={`/app/md/${noteId}`}>
        <a className="flex items-center link text-lg py-2 pl-4">
          <span className="title text-2xl text-yellow-500 font-semibold mt-4">
            {note.title}
          </span>
        </a>
      </Link>
      <ReadOnlyEditor value={value} className="pl-4" />
    </div>
  );
}
