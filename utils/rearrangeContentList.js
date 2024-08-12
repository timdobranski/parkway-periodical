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

    // Create a copy of the contentList
    const updatedList = [...contentList];

    // Remove the item from the current position
    const [movedItem] = updatedList.splice(index, 1);

    // Insert the item at the new position
    updatedList.splice(newIndex, 0, movedItem);

    // Recalculate the sortOrder for the entire list
    updatedList.forEach((item, idx) => {
      item.sortOrder = updatedList.length - idx; // Reverse the sortOrder
    });

    // Update the state
    setContentList(updatedList);

    // Prepare the updates for the database
    const updates = updatedList.map(item => ({
      id: item.id,
      sortOrder: item.sortOrder,
    }));

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