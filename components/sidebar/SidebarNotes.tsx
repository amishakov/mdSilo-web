import { Dispatch, memo, SetStateAction, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Notes, NoteTreeItem, useStore } from 'lib/store';
import { Sort } from 'lib/userSettingsSlice';
import { ciStringCompare, dateCompare, isMobile } from 'utils/helper';
import { useImportJson, useImportMds } from 'editor/hooks/useImport';
import { openDirDialog } from 'editor/hooks/useFSA';
import { FileSystemAccess } from 'editor/checks';
import ErrorBoundary from '../misc/ErrorBoundary';
import SidebarNotesBar from './SidebarNotesBar';
import SidebarNotesTree from './SidebarNotesTree';
import SidebarFoot from './SidebarFoot';

type SidebarNotesProps = {
  className?: string;
  setIsFindOrCreateModalOpen: Dispatch<SetStateAction<boolean>>;
};

function SidebarNotes(props: SidebarNotesProps) {
  const { className='', setIsFindOrCreateModalOpen } = props;

  const notes = useStore((state) => state.notes);
  const noteTree = useStore((state) => state.noteTree);
  const noteSort = useStore((state) => state.noteSort);
  const sortedNoteTree = useMemo(
    () => sortNoteTree(noteTree, notes, noteSort),
    [noteTree, notes, noteSort]
  );

  const noteList = Object.values(notes);
  const myNotes = noteList.filter(n => !n.is_wiki && !n.is_daily);
  const numOfNotes = useMemo(() => myNotes.length, [myNotes]);
  const setIsSidebarOpen = useStore((state) => state.setIsSidebarOpen);
  const onCreateNote = useCallback(() => {
    if (isMobile()) {
      setIsSidebarOpen(false);
    }
    setIsFindOrCreateModalOpen((isOpen) => !isOpen);
  }, [setIsSidebarOpen, setIsFindOrCreateModalOpen]);
  const onImportJson = useImportJson();
  const onImportFile = useImportMds();

  const hasFSA = FileSystemAccess.support(window);
  const onOpenFolder = openDirDialog;

  const btnClass = "p-1 my-1 mx-4 rounded bg-blue-500 hover:text-yellow-500";

  return (
    <ErrorBoundary>
      <div className={`flex flex-col flex-1 overflow-x-hidden ${className}`}>
        <SidebarNotesBar
          noteSort={noteSort}
          numOfNotes={numOfNotes}
          setIsFindOrCreateModalOpen={setIsFindOrCreateModalOpen}
        />
        {sortedNoteTree && sortedNoteTree.length > 0 ? (
          <SidebarNotesTree
            data={sortedNoteTree}
            className="flex-1 overflow-y-auto"
          />
        ) : (
          <>
            <p className="flex-1 px-6 my-2 text-center text-gray-500">
              No md yet
            </p>
            {hasFSA ? (<button className={btnClass} onClick={onOpenFolder}>Open Folder</button>) : null}
            <button className={btnClass} onClick={onImportFile}>Import File(.txt,.md)</button>
            <button className={btnClass} onClick={onCreateNote}>New File</button>
            <button className={btnClass} onClick={onImportJson}>Import Json</button>
            <Link href="/app/demo">
              <a className={`${btnClass} mb-4 text-center`}>Live Demo</a>
            </Link>
          </>
        )}
        <SidebarFoot />
      </div>
    </ErrorBoundary>
  );
}

/**
 * Sorts the tree recursively based on the information in notes with the given noteSort.
 */
const sortNoteTree = (
  tree: NoteTreeItem[],
  notes: Notes,
  noteSort: Sort
): NoteTreeItem[] => {
  // Copy tree shallowly
  const newTre = [...tree];
  // filte out the wiki
  const newTree = newTre.filter(n => !notes[n.id].is_wiki && !notes[n.id].is_daily);
  // Sort tree items (one level)
  if (newTree.length >= 2) {
    newTree.sort((n1, n2) => {
      const note1 = notes[n1.id];
      const note2 = notes[n2.id];
      switch (noteSort) {
        case Sort.DateModifiedAscending:
          return dateCompare(note1.updated_at, note2.updated_at);
        case Sort.DateModifiedDescending:
          return dateCompare(note2.updated_at, note1.updated_at);
        case Sort.DateCreatedAscending:
          return dateCompare(note1.created_at, note2.created_at);
        case Sort.DateCreatedDescending:
          return dateCompare(note2.created_at, note1.created_at);
        case Sort.TitleAscending:
          return ciStringCompare(note1.title, note2.title);
        case Sort.TitleDescending:
          return ciStringCompare(note2.title, note1.title);
        default:
          return ciStringCompare(note1.title, note2.title);
      }
    });
  }
  // Sort each tree item's children
  return newTree.map((item) => ({
    ...item,
    children: sortNoteTree(item.children, notes, noteSort),
  }));
};

export default memo(SidebarNotes);
