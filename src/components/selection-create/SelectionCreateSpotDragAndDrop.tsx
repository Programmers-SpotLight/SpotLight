import { DragDropContext, Draggable } from "react-beautiful-dnd"
import StrictModeDroppable from "./StrictModeDroppable"
import SelectionCreateSpotItem from "./SelectionCreateSpotItem";
import { useStore } from "zustand";
import { useSelectionCreateStore } from "@/stores/selectionCreateStore";


const SelectionCreateSpotDragAndDrop = () => {
  const { 
    spots, 
    setSpots, 
    spotCategories 
  } = useStore(useSelectionCreateStore);

  const handleDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(spots);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSpots(items);
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <StrictModeDroppable droppableId="spots">
        {(provided, snapshot) => (
          <div 
            className="border border-solid border-grey2 w-full h-[190px] rounded-[8px] bg-white flex flex-col items-start gap-6 p-4 overflow-y-auto"
            style={snapshot.isDraggingOver ? { backgroundColor: "#F7F7F7" } : {}}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {/* 스팟 리스트 */}
            {spots.map((spot, index) => (
              <Draggable key={spot.placeId} draggableId={spot.placeId} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <SelectionCreateSpotItem
                      key={index}
                      index={index}
                      spot={spot}
                      spotCategories={spotCategories}
                    />
                  </div>
                )}
              </Draggable>
            ))}
        </div>
        )}
      </StrictModeDroppable>
    </DragDropContext>
  )
};

export default SelectionCreateSpotDragAndDrop;