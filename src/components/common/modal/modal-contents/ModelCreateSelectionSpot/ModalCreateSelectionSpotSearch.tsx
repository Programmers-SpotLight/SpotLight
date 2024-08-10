import ModalCreateSelectionSpotSearchMap from "./ModalCreateSelectionSpotSearchMap";
import ModalCreateSelectionSpotSearchBar from "./ModalCreateSelectionSpotSearchBar";


const ModalCreateSelectionSpotSearch = () => {
  return (
    <div>
      <p className="text-medium font-bold mb-4">스팟 위치</p>
      <ModalCreateSelectionSpotSearchMap />
      <ModalCreateSelectionSpotSearchBar />
    </div>
  )
};

export default ModalCreateSelectionSpotSearch;