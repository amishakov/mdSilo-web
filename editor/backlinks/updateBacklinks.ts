import { Element } from 'slate';
import produce from 'immer';
import { ElementType } from 'editor/slate';
import { Note } from 'types/model';
import { store } from 'lib/store';
import apiClient from 'lib/apiClient';
import { updateDbNote } from 'lib/api/curdNote';
import { computeLinkedBacklinks } from './useBacklinks';


/**
 * Updates the backlink properties of notes on the current note title changed,and 
 * id changed for a special case.
 * the current note is the note other notes link to
 * @param newTitle of note other notes link to
 * @param noteId of note other notes link to
 * @param newId of note other notes link to
 */
const updateBacklinks = async (newTitle: string, noteId: string, newId = '') => {
  const notes = store.getState().notes;
  const backlinks = computeLinkedBacklinks(notes, noteId);
  const updateData: Pick<Note, 'id' | 'content'>[] = [];

  for (const backlink of backlinks) {
    const note = notes[backlink.id];

    if (!note) {
      continue;
    }

    let newBacklinkContent = note.content;
    for (const match of backlink.matches) {
      newBacklinkContent = produce(newBacklinkContent, (draftState) => {
        // Path should not be empty
        const path = match.path;
        if (path.length <= 0) {
          return;
        }

        // Get the node from the path
        let linkNode = draftState[path[0]];
        for (const pathNumber of path.slice(1)) {
          linkNode = (linkNode as Element).children[pathNumber];
        }

        // Assert that linkNode is a note link or Pub link
        if (
          !Element.isElement(linkNode) ||
          !(linkNode.type === ElementType.NoteLink || linkNode.type === ElementType.PubLink)
        ) {
          return;
        }

        // Update noteTitle property on the node
        linkNode.noteTitle = newTitle;
        // special case for update pub-link's noteId 
        // for the noteId omitted when procee PubLink on import
        if (newId && newTitle == noteId) {
          linkNode.noteId = newId;
        }

        // If there is no custom text, then the link text should be the same as the note title
        if (!linkNode.customText) {
          linkNode.children = [{ text: newTitle }];
        }
      });
    }
    updateData.push({
      id: backlink.id,
      content: newBacklinkContent,
    });
  }

  // Make sure backlinks are updated locally
  for (const newNote of updateData) {
    store.getState().updateNote(newNote);
  }

  const offlineMode = store.getState().offlineMode;
  if (!offlineMode) {
    // It would be better if we could consolidate the update requests into one request
    // See https://github.com/supabase/supabase-js/issues/156
    const promises = [];
    const userId = apiClient.auth.user()?.id;
    if (userId) {
      for (const data of updateData) {
        promises.push(updateDbNote(data, userId));
      }
      await Promise.all(promises);
    }
  }
};

export default updateBacklinks;
