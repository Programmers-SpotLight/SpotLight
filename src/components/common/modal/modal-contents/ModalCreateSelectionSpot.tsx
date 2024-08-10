import { AdvancedMarker, Map, useMap } from '@vis.gl/react-google-maps';
import { useEffect, useRef, useState } from 'react';
import OneLineInput from '../../input/OneLineInput';
import Image from 'next/image';
import { TPoiWithAddress } from '@/components/selection-create/PoiMarkers';
import useSpotSearch from '@/hooks/useSpotSearch';
import useReverseGeocoding from '@/hooks/useReverseGeocoding';
import useGeocoding from '@/hooks/useGeocoding';
import { useStore } from 'zustand';
import { useModalStore } from '@/stores/modalStore';
import { ISelectionCategory, ISelectionSpot } from '@/models/selection.model';
import { useSelectionCreateStore } from '@/stores/selectionCreateStore';
import useClickOutside from '@/hooks/useClickOutside';
import Dropdown from '../../Dropdown';
import Hashtag from '../../Hashtag';


const ModalCreateSelectionSpot = () => {
  const modalElementRef = useRef<HTMLDivElement>(null);
  const spotSearchResultRef = useRef<HTMLDivElement>(null);
  const geocodingRequested = useRef<boolean>(false);
  const reverseGeocodingRequested = useRef<boolean>(false);
  const map = useMap();

  const { 
    extraData : data, 
    closeModal,
    setExtraData
  } : { 
    extraData: {spotCategories: {id: number, name: string}[], spot?: ISelectionSpot} | null,
    closeModal: () => void, 
    setExtraData: (data: any) => void 
  } = useStore(useModalStore);
  const { addSpot, spots: currentSpots } = useStore(useSelectionCreateStore);

  const [currentPinCoords, setCurrentPinCoords] = useState<google.maps.LatLngLiteral>(
    (data?.spot?.latitude && data?.spot?.longitude) ? 
      { lat: data.spot.latitude, lng: data.spot.longitude } : 
      { lat: 37.5503, lng: 126.9971 }
  );

  const [placeName, setPlaceName] = useState<string>(data?.spot?.title || '');
  const [description, setDescription] = useState<string>(data?.spot?.description || '');
  const [category, setCategory] = useState<undefined | ISelectionCategory>(undefined);
  const [thumbnailImage, setThumbnailImage] = useState<File | string | null>(data?.spot?.photos[0] || null);
  const [thumbnailImage1, setThumbnailImage1] = useState<File | string | null>(data?.spot?.photos[1] || null);
  const [thumbnailImage2, setThumbnailImage2] = useState<File | string | null>(data?.spot?.photos[2] || null);
  const [thumbnailImage3, setThumbnailImage3] = useState<File | string |null>(data?.spot?.photos[3] || null);
  const [tagInputValue, setTagInputValue] = useState<string>('');
  const [tags, setTags] = useState<string[]>(data?.spot?.hashtags as string[]|| []);

  const [selectedLocation, setSelectedLocation] = useState<TPoiWithAddress>(
    (data?.spot?.latitude && data?.spot?.longitude && data?.spot?.placeId && data?.spot?.formattedAddress) ?
    {
      key: 'userSelectedSpot',
      address: data.spot?.formattedAddress,
      placeId: data.spot?.placeId,
      location: { lat: data.spot?.latitude, lng: data.spot?.longitude }
    } :
    {
      key: 'userSelectedSpot',
      address: '',
      placeId: '',
      location: { lat: 37.5503, lng: 126.9971  }, 
    }
  );

  // 스팟 검색 훅
  const { 
    searchValue, 
    setSearchValue, 
    spots, 
    fetchSpots, 
    loading, 
    error 
  } = useSpotSearch();

  // 역지오코딩 훅
  const {
    address: reverseGeocodingAddress,
    placeId: reverseGeocodingPlaceId,
    fetchAddress,
    loading: reverseGeocodingLoading,
    error: reverseGeocodingError
  } = useReverseGeocoding();

  // 지오코딩 훅
  const {
    coordinates: geocodingCoordinates,
    address: geocodingAddress,
    fetchGeocodingData,
    loading: geocodingLoading,
    error: geocodingError
  } = useGeocoding();
  const [isSpotSearchResultOpen, setIsSpotSearchResultOpen] = useState<boolean>(false);

  // 스팟 검색 결과 창을 닫는 이벤트 핸들러
  useClickOutside(spotSearchResultRef, () => setIsSpotSearchResultOpen(false))

  const handleSearchInputFocus = () => {
    setIsSpotSearchResultOpen(true);
  };

  const handleSearchValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsSpotSearchResultOpen(true);
      fetchSpots();
    }
  };

  const handlePlaceNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlaceName(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      setThumbnailImage(file);
    } else {
      alert('png, jpg, jpeg 파일만 업로드 가능합니다.');
    }
  };

  const handleImageChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      setThumbnailImage1(file);
    } else {
      alert('png, jpg, jpeg 파일만 업로드 가능합니다.');
    }
  };

  const handleImageChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      setThumbnailImage2(file);
    } else {
      alert('png, jpg, jpeg 파일만 업로드 가능합니다.');
    }
  };

  const handleImageChange3 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
      setThumbnailImage3(file);
    } else {
      alert('png, jpg, jpeg 파일만 업로드 가능합니다.');
    }
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInputValue(e.target.value);
  };
  const handleHashtagInput = (
    e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    if (e.type === "click" || (e as React.KeyboardEvent).key === "Enter") {
      e.preventDefault();
      if (tags.length >= 8) {
        alert("태그는 최대 8개까지 등록 가능합니다.");
        return;
      }
      if (tagInputValue === "") {
        alert("태그명을 입력해주세요.");
        return;
      }
      if (tags.includes(tagInputValue)) {
        alert("이미 등록된 태그입니다.");
        return;
      }
      setTags([...tags, tagInputValue]);
      setTagInputValue("");
    }
  };

  const handleDeleteHashtagClick = (
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    const tag = e.currentTarget.parentElement?.textContent;
    if (tag) {
      setTags(tags.filter((t) => t !== tag));
    }
  };

  const handleGeocodingClick = (placeId: string) => {
    if (!placeId) {
      return;
    }
    if (placeId === selectedLocation.placeId) {
      return;
    }

    geocodingRequested.current = true;
    setSelectedLocation({
      ...selectedLocation,
      placeId: placeId
    });
    fetchGeocodingData(
      placeId
    );
  };

  const handleReverseGeocodingClick = () => {
    if (
      selectedLocation.location.lat != currentPinCoords.lat || 
      selectedLocation.location.lng != currentPinCoords.lng) 
    {
      reverseGeocodingRequested.current = true;
      fetchAddress(
        currentPinCoords.lat,
        currentPinCoords.lng
      );
    }
  };

  const handleAddSpotClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!placeName) {
      alert('스팟 이름을 입력해주세요.');
      return;
    }
    if (!description) {
      alert('스팟 설명을 입력해주세요.');
      return;
    }
    if (!selectedLocation.placeId) {
      alert('스팟 위치를 설정해주세요.');
      return;
    }
    const isDuplicated = currentSpots.some(
      (spot) => spot.placeId === selectedLocation.placeId
    );
    if (isDuplicated) {
      alert('이미 등록된 스팟입니다.');
      return;
    }
    if (!category) {
      alert('카테고리를 설정해주세요.');
      return;
    }
    if (!selectedLocation.address) {
      alert('스팟 주소를 설정해주세요.');
      return;
    }
    if (tags.length === 0) {
      alert('태그를 등록해주세요.');
      return;
    }
    const photos = [thumbnailImage, thumbnailImage1, thumbnailImage2, thumbnailImage3].filter(
      (photo) => photo !== null
    );

    const spot: ISelectionSpot = {
      placeId: selectedLocation.placeId,
      title: placeName,
      category: category.id,
      description,
      formattedAddress: selectedLocation.address,
      latitude: selectedLocation.location.lat,
      longitude: selectedLocation.location.lng,
      hashtags: tags,
      photos
    };

    addSpot(spot);
    setExtraData(null); 
    closeModal();
  };

  // 모달 창의 높이를 동적으로 조절
  useEffect(() => {
    const handleResize = () => {
      if (modalElementRef.current) {
        const height = window.innerHeight - 200;
        modalElementRef.current.style.height = `${height}px`;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 역지오코딩 결과 처리
  useEffect(() => {
    if (!reverseGeocodingRequested.current) {
      return
    }
    if (reverseGeocodingLoading) return;
    if (reverseGeocodingError) {
      alert('주소를 가져오는데 실패했습니다.');
      return;
    }

    setSelectedLocation({
      ...selectedLocation,
      address: reverseGeocodingAddress || '',
      placeId: reverseGeocodingPlaceId || '',
      location: currentPinCoords
    });
    map?.setCenter(currentPinCoords || { lat: 0, lng: 0 });
  }, [
    reverseGeocodingLoading, 
    reverseGeocodingError, 
    reverseGeocodingAddress, 
    reverseGeocodingPlaceId
  ]);

  // 지오코딩 결과 처리
  useEffect(() => {
    if (!geocodingRequested.current) {
      return;
    }
    if (geocodingLoading) return;
    if (geocodingError) {
      alert('주소를 가져오는데 실패했습니다.');
      return;
    }

    setSelectedLocation({
      ...selectedLocation,
      location: geocodingCoordinates || { lat: 0, lng: 0 },
      address: geocodingAddress || '',
    });

    setCurrentPinCoords(geocodingCoordinates || { lat: 0, lng: 0 });
    map?.setCenter(geocodingCoordinates || { lat: 0, lng: 0 });
  }, [
    geocodingLoading, 
    geocodingError, 
    geocodingCoordinates, 
    geocodingAddress
  ]);


  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return null;
  }

  return (
    <div className="mt-8 overflow-y-auto" ref={modalElementRef}>
      <p className="text-medium font-bold mb-4">스팟 위치</p>
      <Map
        style={{ width: '100%', height: '280px', position: 'relative' }}
        defaultZoom={13}
        defaultCenter={ selectedLocation.location }
        streetViewControl={false}
        mapTypeControl={false}
        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID}
        reuseMaps={true}
      >
        <div className='absolute bottom-[8%] left-[2%] flex flex-col items-stretch gap-2'>
          <button
            className='btn btn-primary text-white font-medium block w-[142px]'
            onClick={() => {
              map?.panTo(currentPinCoords);
            }} 
          >
            마커로 이동
          </button>
        {(
          selectedLocation.location.lat !== currentPinCoords.lat || 
          selectedLocation.location.lng !== currentPinCoords.lng) && (
          <button 
            className='btn btn-primary text-white font-medium block w-[142px]'
            onClick={handleReverseGeocodingClick}
          >
            현재 위치 주소 설정
          </button>
        )}
        </div>
        <AdvancedMarker
          draggable={true}
          onDragEnd={(event) => {
            const { lat, lng } = event.latLng?.toJSON() || { lat: 0, lng: 0 };
            setCurrentPinCoords({ lat, lng });
          }}
          position={currentPinCoords}
          title={'스팟 위치'}
        />
      </Map>
      <div className='mt-4 relative'>
        {(selectedLocation.address) && (
        <div className='mb-4'>
          <p className='text-small font-bold'>현재 스팟 주소</p>
          <p className='text-grey4 text-small mt-2'>{selectedLocation.address}</p>
        </div>
        )}
        <OneLineInput
          placeholder='스팟을 검색해주세요'
          width='w-full'
          value={searchValue}
          onChange={handleSearchValueChange}
          onFocus={handleSearchInputFocus}
          onKeyDown={handleSearchKeyDown}
        />
        { isSpotSearchResultOpen && (
        <div
          ref={spotSearchResultRef}
          className='absolute top-[110%] p-3 border border-solid border-black w-full bg-white rounded-[8px]'
        >
          <ul className='text-grey4 w-full max-h-[192px] overflow-y-auto'>
            {loading && <li className='py-2'>로딩 중...</li>}
            {error && <li className='py-2'>에러가 발생했습니다.</li>}
            {(!loading && !error && spots.length > 0) && spots.map((spot) => (
              <li key={spot.id} className='py-2 cursor-pointer hover:bg-grey1'>
                <button onClick={() => handleGeocodingClick(spot.id)}>
                  {spot.displayName.text}
                </button>
              </li>
            ))}
            {(!loading && !error && spots.length === 0) && (
              <li className='py-2'>검색 결과가 없습니다.</li>
            )}
          </ul>
        </div>
        )}
      </div>
      <p className="text-medium font-bold mt-8 mb-4">스팟 정보</p>
      <div className='mt-4'>
        <OneLineInput
          placeholder='스팟의 이름을 입력해주세요'
          width='w-full'
          value={placeName}
          onChange={handlePlaceNameChange}
        />
      </div>
      <div className='mt-4'>
        <textarea 
          className="border-solid h-[100px] border border-grey2 p-3 rounded-[8px] placeholder:font-medium w-full resize-none" 
          placeholder="스팟에 대한 상세설명을 입력해주세요." 
          id="description" 
          name="description" 
          value={description}
          onChange={handleDescriptionChange}
        />
      </div>
      <div className=' mt-8 mb-4 flex'>
        <p className='w-1/4 text-medium font-bold'>스팟 카테고리</p>
        <Dropdown
        contents={data?.spotCategories}
        setCategory={setCategory}
        title='스팟 카테고리'
        />
      </div>
      <p className='mt-8 font-bold text-medium mb-4'>이미지 등록 (선택)</p>
      <div className='flex gap-2'>
        <button className="relative border border-solid border-grey2 w-3/4 h-[155px] rounded-[8px] bg-white flex flex-col items-center justify-center">
          {thumbnailImage ? (
            <img 
              src={
                typeof thumbnailImage === 'string' ? 
                  thumbnailImage : 
                  URL.createObjectURL(thumbnailImage)
              }
              className="w-auto h-full object-cover" 
              alt="thumbnail"
            />
          ) : (
            <Image 
              src="/icons/photo_camera_7C7C7C.svg" 
              width={32} 
              height={32} 
              alt="upload_photo"
            />
          )}
          <input
            type='file'
            accept='.png, .jpg, .jpeg'
            onChange={handleImageChange}
            className='absolute inset-0 bg-red-500 cursor-pointer top-0 left-0 w-full h-full opacity-0'
          />
        </button>
        <button className="relative border border-solid border-grey2 w-3/4 h-[155px] rounded-[8px] bg-white flex flex-col items-center justify-center">
          {thumbnailImage1 ? (
            <img 
              src={
                typeof thumbnailImage1 === 'string' ? 
                  thumbnailImage1 : 
                  URL.createObjectURL(thumbnailImage1)
              }
              className="w-auto h-full object-cover" 
              alt="thumbnail"
            />
          ) : (
            <Image 
              src="/icons/photo_camera_7C7C7C.svg" 
              width={32} 
              height={32} 
              alt="upload_photo"
            />
          )}
          <input
            type='file'
            accept='.png, .jpg, .jpeg'
            onChange={handleImageChange1}
            className='absolute inset-0 bg-red-500 cursor-pointer top-0 left-0 w-full h-full opacity-0'
          />
        </button>
        <button className="relative border border-solid border-grey2 w-3/4 h-[155px] rounded-[8px] bg-white flex flex-col items-center justify-center">
          {thumbnailImage2 ? (
            <img 
              src={
                typeof thumbnailImage2 === 'string' ? 
                  thumbnailImage2 : 
                  URL.createObjectURL(thumbnailImage2)
              }
              className="w-auto h-full object-cover" 
              alt="thumbnail"
            />
          ) : (
            <Image 
              src="/icons/photo_camera_7C7C7C.svg" 
              width={32} 
              height={32} 
              alt="upload_photo"
            />
          )}
          <input
            type='file'
            accept='.png, .jpg, .jpeg'
            onChange={handleImageChange2}
            className='absolute inset-0 bg-red-500 cursor-pointer top-0 left-0 w-full h-full opacity-0'
          />
        </button>
        <button className="relative border border-solid border-grey2 w-3/4 h-[155px] rounded-[8px] bg-white flex flex-col items-center justify-center">
          {thumbnailImage3 ? (
            <img 
              src={
                typeof thumbnailImage3 === 'string' ? 
                  thumbnailImage3 : 
                  URL.createObjectURL(thumbnailImage3)
              }
              className="w-auto h-full object-cover" 
              alt="thumbnail"
            />
          ) : (
            <Image 
              src="/icons/photo_camera_7C7C7C.svg" 
              width={32} 
              height={32} 
              alt="upload_photo"
            />
          )}
          <input
            type='file'
            accept='.png, .jpg, .jpeg'
            onChange={handleImageChange3}
            className='absolute inset-0 bg-red-500 cursor-pointer top-0 left-0 w-full h-full opacity-0'
          />
        </button>
      </div>
      <p className='mt-8 font-bold text-medium mb-4'>태그 등록</p>
      <div className="flex flex-col gap-4 w-full items-stretch">
        <div className='relative w-full'>
          <OneLineInput 
            placeholder="태그명을 입력해주세요" 
            id="title" 
            name="title"
            isError={false}
            width='w-full'
            value={tagInputValue}
            onChange={handleTagInputChange}
            onKeyDown={handleHashtagInput}
          />
          <button 
            className='absolute top-[50%] right-[1%] transform -translate-y-1/2'
            onClick={handleHashtagInput}
          >
            <Image 
              src="/icons/add_7C7C7C.svg" 
              width={32} 
              height={32} 
              alt="add-spot" 
            />
          </button>
        </div>
        <div className="text-small">
          <p className="text-grey4">해시태그는 총 8개까지 등록 가능합니다</p>
          <div className="flex gap-2 mt-4 text-grey3 overflow-x-auto flex-wrap">
          {tags.map((tag, index) => (
                <li key={index} className="list-none">
                  <Hashtag size="big" name={tag} cancelHashtag={handleDeleteHashtagClick} />
                </li>
              ))}
          </div>
        </div>
      </div>
      <button 
        className="block mx-auto bg-primary text-white text-medium font-bold mt-8 rounded-[8px] w-[163px] h-[40px] text-center"
        onClick={handleAddSpotClick}
      >
        등록
      </button>
    </div>
  );
};

export default ModalCreateSelectionSpot;