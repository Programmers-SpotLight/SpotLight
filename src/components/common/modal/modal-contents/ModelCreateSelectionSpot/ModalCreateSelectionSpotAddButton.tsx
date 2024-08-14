import useSaveSelectionSpot from "@/hooks/useSaveSelectionSpot";


const ModalCreateSelectionSpotAddButton = () => {
  const validateAddSelectionSpot = useSaveSelectionSpot();

  const handleAddSpotClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    validateAddSelectionSpot();
  };

  return (
    <button 
      className="block mx-auto bg-primary text-white text-medium font-bold mt-8 rounded-[8px] w-[163px] h-[40px] text-center"
      onClick={handleAddSpotClick}
    >
      등록
    </button>
  );
};

export default ModalCreateSelectionSpotAddButton;