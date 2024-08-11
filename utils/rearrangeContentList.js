import { createClient } from './supabase/client';

export default function rearrangeContentList(contentList, setContentList) {
  const supabase = createClient();

  const moveItem = async (index, direction) => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === contentList.length - 1)
    ) {
      // Can't move the first item up or the last item down
      return;
    }

    // Determine the new index for the item
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    // Swap the items in the contentList array
    const updatedList = [...contentList];
    const temp = updatedList[index];
    updatedList[index] = updatedList[newIndex];
    updatedList[newIndex] = temp;

    // Update the sortOrder values in the array
    updatedList[index].sortOrder = newIndex + 1;
    updatedList[newIndex].sortOrder = index + 1;

    // Update the state
    setContentList(updatedList);

    // Prepare the updates for the database
    const updates = [
      { id: updatedList[index].id, sortOrder: updatedList[index].sortOrder },
      { id: updatedList[newIndex].id, sortOrder: updatedList[newIndex].sortOrder },
    ];

    // Batch update the database
    const { error } = await supabase.from('posts').upsert(updates, { onConflict: ['id'] });

    if (error) {
      console.error("Error updating sortOrder:", error);
    }
  };

  return {
    moveItemUp: (index) => moveItem(index, 'up'),
    moveItemDown: (index) => moveItem(index, 'down'),
  };
}