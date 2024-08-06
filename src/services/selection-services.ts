'use server';

import { dbConnectionPool } from "@/libs/db";
import { 
  ISelectionCategory, 
  ISelectionCreateFormData, 
  ISelectionLocation, 
  ISelectionSpot 
} from "@/models/selection.model";
import { Knex } from "knex";
import { fileTypeFromBlob } from "file-type";
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from "path";


interface ISelectionCategoryQueryResultRow {
  category_id: number;
  category_name: string;
}

interface ISelectionLocationQueryResultRow {
  location_id: number;
  location_name: string;
  location_option_id: number;
  location_option_name: string;
}

export async function getSelectionCategories () {
  const queryResult : ISelectionCategoryQueryResultRow[] = await dbConnectionPool
    .column([
      'selection_category.slt_category_id as category_id',
      'selection_category.slt_category_name as category_name',
    ])
    .select()
    .from('selection_category');

  const categories : ISelectionCategory[] = queryResult.map((row) => {
    return {
      id: row.category_id,
      name: row.category_name
    };
  });

  return categories;
}

export async function getSelectionLocations() {
  const queryResult : ISelectionLocationQueryResultRow[] = await dbConnectionPool
    .column([
      'selection_location.slt_location_id as location_id',
      'selection_location.slt_location_name as location_name',
      'selection_location_option.slt_location_option_id as location_option_id',
      'selection_location_option.slt_location_option_name as location_option_name'
    ])
    .select()
    .from('selection_location')
    .join(
      'selection_location_option', 
      'selection_location.slt_location_id', 
      'selection_location_option.slt_location_id'
    )
    .orderBy('selection_location.slt_location_id', 'asc')

  const locations : Array<ISelectionLocation> = [];
  queryResult.forEach((row: ISelectionLocationQueryResultRow) => {
    const locationId = row.location_id;
    const locationName = row.location_name;
    const locationOptionId = row.location_option_id;
    const locationOptionName = row.location_option_name;
  
    const location = locations.find((location) => location.id === locationId);
    if (location) {
      location.options.push({
        id: locationOptionId,
        name: locationOptionName
      });
    } else {
      locations.push({
        id: locationId,
        name: locationName,
        options: [{
          id: locationOptionId,
          name: locationOptionName
        }]
      });
    }
  });

  return locations;
};

export async function createHashtags(transaction: Knex.Transaction<any, any[]>, hashtags: string[]) {
  const hashtagsToInsert = hashtags.map((hashtag) => {
    return {
      htag_name: hashtag
    };
  });

  try {
    await transaction('hashtag')
      .insert(hashtagsToInsert)
      .onConflict('htag_name')
      .merge();

    const querySelectResult = await transaction('hashtag')
      .select('htag_id')
      .whereIn('htag_name', hashtags);
    
    return querySelectResult.map((row) => row.htag_id);
  } catch (error) {
    console.error(error);
    throw new Error('Failed to create the hashtags');
  }
}

export async function saveSelectionImage(imageFile: File) {
  const newFileName = `${Date.now()}-${uuidv4()}`;
  const fileType = await fileTypeFromBlob(imageFile);
  const filePath = `${newFileName}.${fileType?.mime.split('/')[1]}`;
  const arrayBuffer = await imageFile.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  try {
    const savePath = path.join('.', 'public', 'images', 'selections', filePath);
    // Save the file to the public/images/selections directory for Windows and Linux
    await fs.writeFile(savePath, buffer);
    await fs.access(savePath);
  } catch (error) {
    console.error(error);
    return 'Failed to save the image';
  }
  return filePath;
}

const saveSelectionSpotPhoto = async (imageFile: File) => {
  const newFileName = `${Date.now()}-${uuidv4()}`;
  const fileType = await fileTypeFromBlob(imageFile);
  const filePath = `${newFileName}.${fileType?.mime.split('/')[1]}`;
  const arrayBuffer = await imageFile.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  try {
    // Save the file to the public/images/selections directory for Windows and Linux
    const savePath = path.join('.', 'public', 'images', 'selections', 'spots', filePath);
    await fs.writeFile(savePath, buffer);
    await fs.access(savePath);
  } catch (error) {
    console.error(error);
    return 'Failed to save the image';
  }
  return filePath;
}

export async function createSelection(
  transaction: Knex.Transaction<any, any[]>,
  formData: ISelectionCreateFormData
) {
  try {
    const queryResult = await transaction('selection')
      .insert({
        slt_title: formData.title,
        slt_status: formData.status,
        slt_category_id: formData.category ?? null,
        slt_location_option_id: formData.location?.subLocation ?? null,
        slt_description: formData.description ?? null,
        slt_img: formData.img ?? null,
      }, ['slt_id']);

    const selectionId = queryResult[0];
    if (formData.hashtags) {
      await createSelectionHashtags(transaction, selectionId, formData.hashtags as number[]);
    }
    if (formData.spots) {
      await createSelectionSpots(transaction, selectionId, formData.spots);
    }

  } catch (error : any) {
    console.error(error);
    throw new Error(error.message);
  }
}

async function createSelectionHashtags(
  transaction: Knex.Transaction<any, any[]>,
  selectionId: number,
  hashtags: number[]
) {
  for (let i = 0; i < hashtags.length; i++) {
    try {
      await transaction('selection_hashtag')
        .insert({
          slt_id: selectionId,
          slt_htag_id: transaction.fn.uuidToBin(uuidv4()),
          htag_id: hashtags[i]
        })
        .onConflict(['slt_id', 'htag_id'])
        .ignore();
    } catch (error) {
      console.error(error);
      throw new Error('Failed to create the selection hashtags');
    }
  }
}

async function createSelectionSpots(
  transaction: Knex.Transaction<any, any[]>,
  selectionId: number,
  spots: ISelectionSpot[]
) {
  const spotsIdsPhotos: Array<{id: string, photos: Array<string | File>}> = [];
  const spotsIdsHashtags: Array<{id: string, hashtags: number[]}> = [];
  const spotsToInsert = spots.map((spot) => {
    const spotId = uuidv4();
    spotsIdsPhotos.push({
      id: spotId,
      photos: spot.photos
    });
    spotsIdsHashtags.push({
      id: spotId,
      hashtags: spot.hashtags as number[]
    });

    return {
      spot_id: transaction.fn.uuidToBin(spotId),
      slt_id: selectionId,
      spot_title: spot.title,
      spot_description: spot.description,
      spot_gmap_id: spot.placeId,
      spot_gmap_address: spot.formattedAddress,
      spot_gmap_latitude: spot.latitude,
      spot_gmap_longitude: spot.longitude
    };
  });

  try {
    await transaction('spot')
      .insert(spotsToInsert);

    for (let i = 0; i < spotsIdsPhotos.length; i++) {
      for (let j = 0; j < spotsIdsPhotos[i].photos.length; j++) {
        if (spotsIdsPhotos[i].photos[j] instanceof File) {
          const filePath : string = await saveSelectionSpotPhoto(spotsIdsPhotos[i].photos[j] as File);
          spotsIdsPhotos[i].photos[j] = filePath;
        }
      }
    }

    for (let i = 0; i < spotsIdsHashtags.length; i++) {
      await createSelectionSpotHashtags(
        transaction, 
        spotsIdsHashtags[i].id, 
        spotsIdsHashtags[i].hashtags
      );
    }
    for (let i = 0; i < spotsIdsPhotos.length; i++) {
      if (spotsIdsPhotos[i].photos.length > 0) {
        await createSelectionSpotImages(
          transaction, 
          spotsIdsPhotos[i].id, 
          spotsIdsPhotos[i].photos as string[]
        );
      }
    }  
  } catch (error) {
    console.error(error);
    throw new Error('Failed to create the selection spots');
  }
}

async function createSelectionSpotHashtags(
  transaction: Knex.Transaction<any, any[]>,
  spotId: string,
  hashtags: number[]
) {
  const insertData = hashtags.map((hashtag) => {
    return {
      spot_htag_id: transaction.fn.uuidToBin(uuidv4()),
      spot_id: transaction.fn.uuidToBin(spotId),
      htag_id: hashtag
    };
  });

  try {
    await transaction('spot_hashtag')
      .insert(insertData)
      .onConflict(['spot_id', 'htag_id'])
      .ignore();
  } catch (error) {
    console.error(error);
    throw new Error('Failed to create the selection spot hashtags');
  }
}

export async function createSelectionSpotImages(
  transaction: Knex.Transaction<any, any[]>,
  spotId: string,
  photos: Array<string>
) {
  const insertData = photos.map((photo, index) => {
    return {
      spot_img_id: transaction.fn.uuidToBin(uuidv4()),
      spot_id: transaction.fn.uuidToBin(spotId),
      spot_img_url: photo,
      spot_img_order: index+1
    };
  });

  try {
    await transaction('spot_image')
      .insert(insertData)
      .onConflict(['spot_id', 'spot_photo_url'])
      .ignore();
  } catch (error) {
    console.error(error);
    throw new Error('Failed to create the selection spot photos');
  }
}

export async function prepareSelectionCreateFormData(formData: FormData) : Promise<ISelectionCreateFormData> {
  let data: ISelectionCreateFormData = {
    title: String(formData.get("title")),
    status: String(formData.get("status"))
  };

  if (formData.get("img")) {
    data = {
      ...data,
      img: formData.get("img") as File | string
    };
  }

  if (formData.get("category")) {
    data = {
      ...data,
      category: Number(formData.get("category"))
    };
  }
  if (formData.get("description")) {
    data = {
      ...data,
      description: String(formData.get("description"))
    };
  }
  if (formData.get("spots")) {
    data = {
      ...data,
      spots: JSON.parse(String(formData.get("spots")))
    };
    if (data.spots) {
      const spots = data.spots;
      for (let i=0; i < spots.length; i++) {
        const keys : string[] = Array.from(formData.keys());
        const images = keys.map((key) => {
          if (key.startsWith(`spots[${spots[i].placeId}][photos]`)) {
            return [Number(key.split('-')[3]), formData.get(key)];
          }
          return null;
        }).filter((image) => image !== null);

        const photos: (File | string)[] = [];
        for (let j=0; j < images.length; j++) {
          if (images[j][1] instanceof File) {
            photos.push(images[j][1] as File);
          } else {
            photos.push(images[j][1] as string);
          }
        }
        if (photos.length > 0)
          data.spots[i].photos = photos;
      }
    }
  }
  if (formData.get("hashtags")) {
    const hashtags = JSON.parse(String(formData.get("hashtags")))
    if (!Array.isArray(hashtags)) {
      data.hashtags = [];
    } else {
      data = {
        ...data,
        hashtags
      };
    }
  }
  if (formData.get("location")) {
    const location: { location: number, subLocation: {id: number, name: string} } = JSON.parse(String(formData.get("location")));
    if (!isNaN(location.location) && !isNaN(location.subLocation.id)) {
      data = {
        ...data,
        location: {
          location: location.location,
          subLocation: location.subLocation.id
        }
      };
    }
  }

  return data;
}

export async function validateTitle(title: string) : Promise<string | null> {
  if (!title) {
    return "Title is required";
  }
  if (title.length > 128) {
    return "Title should be less than 128 characters";
  }
  return null;
};

export async function validateCategory(category: number | undefined) : Promise<string | null> {
  if (category == null) {
    return "Category is required";
  }
  if (isNaN(category)) {
    return "Invalid category. It should be a value of integer";
  }
  const queryResult = await dbConnectionPool('selection_category')
    .where('slt_category_id', category);
  
  if (queryResult.length === 0) {
    return "Invalid category. Category does not exist";
  }
  return null;
};

export async function validateLocation(
  location: { location: number; subLocation: number } | undefined
) : Promise<string | null> {
  if (!location) {
    return "Location is required";
  }
  if (typeof location !== "object") {
    return "Invalid location. Location should be an object with location and subLocation properties";
  }
  if (isNaN(location.location) || isNaN(location.subLocation)) {
    return "Invalid location. Location should be an object with location and subLocation properties";
  }

  const queryResult = await dbConnectionPool('selection_location_option')
    .where('slt_location_option_id', location.subLocation)
    .andWhere('slt_location_id', location.location);
  if (queryResult.length === 0) {
    return "Invalid location. Sub-location does not exist";
  }
  return null;
};

export async function validateDescription(description: string | undefined) : Promise<string | null> {
  if (!description) {
    return "Description is required";
  }
  return null;
};

export async function validateImg(img: File | string | undefined) : Promise<string | null> {
  if (!img) {
    return "Image is required";
  }
  if (!(img instanceof File) && typeof img !== "string") {
    return "Invalid image. Image should be a file or a string";
  }
  
  // if the image is a file
  if (img instanceof File) {
    // if the file size is bigger than 2MB
    if (img.size > 2 * 1024 * 1024) {
      return "The file is too big";
    }

    const fileType = await fileTypeFromBlob(img);
    if (!fileType) {
      return 'Couldn\'t detect the type of the file you uploaded';
    }

    if (fileType?.mime != 'image/jpeg' && fileType?.mime != 'image/png') {
      return 'This is not an image file';
    }
  // if the image is a string (URL), check if it exists in the database
  } else {
    const queryResult = await dbConnectionPool('selection')
      .where('slt_img', img)
      .select();

    if (queryResult.length === 0) {
      return "Invalid image. Image does not exist";
    }
  }
  return null;
}

export async function validateSpots(spots: ISelectionSpot[] | undefined) : Promise<string | null> {
  if (!spots) {
    return "Spots are required";
  }
  if (!Array.isArray(spots)) {
    return "Invalid spots. Spots should be an array";
  }
  if (spots.length === 0) {
    return "At least one spot is required";
  }

  for (let i = 0; i < spots.length; i++) {
    if (!spots[i].title) {
      return `Name is required for spot ${i + 1}`;
    }
    if (!spots[i].description) {
      return `Description is required for spot ${i + 1}`;
    }
    if (!spots[i].formattedAddress) {
      return `Address is required for spot ${i + 1}`;
    }
    if (spots[i].hashtags.length === 0) {
      return `At least one hashtag is required for spot ${i + 1}`;
    }
    if (!spots[i].latitude || !spots[i].longitude) {
      return `Location is required for spot ${i + 1}`;
    }
    if (spots[i].latitude < -90 || spots[i].latitude > 90) {
      return `Invalid latitude for spot ${i + 1}`;
    }
    if (spots[i].longitude < -180 || spots[i].longitude > 180) {
      return `Invalid longitude for spot ${i + 1}`;
    }
    for (let j = 0; j < spots[i].hashtags.length; j++) {
      if (typeof spots[i].hashtags[j] !== "string") {
        return `Invalid hashtag for spot ${i + 1}`;
      }
    }
    for (let j = 0; j < spots[i].photos.length; j++) {
      if (typeof spots[i].photos[j] !== "string" && !(spots[i].photos[j] instanceof File)) {
        return `Invalid photo for spot ${i + 1}`;
      }
      if (typeof spots[i].photos[j] === "string") {
        // if the string contains one or more slashes, reject it
        const imageFileName = spots[i].photos[j] as string;
        if (imageFileName.includes('/')) {
          return `Invalid photo for spot ${i + 1}`;
        }

        try {
          const imgPath = path.join('.', 'public', 'images', 'selections', 'spots', imageFileName);
          await fs.access(imgPath);
        } catch (error) {
          console.error(error);
          return `Invalid photo`;
        }
      }
    }
  }
  return null;
};

export async function validateHashtags(hashtags: string[] | undefined) : Promise<string | null> {
  if (!hashtags) {
    return "Hashtags are required";
  }
  if (!Array.isArray(hashtags)) {
    return "Invalid hashtags. Hashtags should be an array";
  }
  if (hashtags.length === 0) {
    return "At least one hashtag is required";
  }
  if (hashtags.length > 8) {
    return "Maximum of 8 hashtags are allowed";
  }
  for (let i = 0; i < hashtags.length; i++) {
    if (typeof hashtags[i] !== "string") {
      return `Invalid hashtag ${i + 1}`;
    }
  }
  return null;
};

export async function validateStatus(selectionStatus: string) : Promise<string | null> {
  const validStatuses = ["temp", "public", "private"];
  if (!validStatuses.includes(selectionStatus)) {
    return "Invalid status";
  }
  return null;
}

export async function validateData(data: ISelectionCreateFormData) : Promise<string | null> {
  const nameError = await validateTitle(data.title);
  if (nameError) {
    return nameError;
  }
  const statusError = await validateStatus(data.status);
  if (statusError) {
    return statusError;
  }

  if (data.status != "temp") {
    const categoryError = await validateCategory(data.category);
    if (categoryError) return categoryError;

    const locationError = await validateLocation(data.location);
    if (locationError) return locationError;

    const descriptionError = await validateDescription(data.description);
    if (descriptionError) return descriptionError;

    const imgError = await validateImg(data.img);
    if (imgError) return imgError;

    const spotsError = await validateSpots(data.spots);
    if (spotsError) return spotsError;

    const hashtagsError = await validateHashtags(data.hashtags as string[]);
    if (hashtagsError) return hashtagsError;
  } else {
    if (data.category) {
      const categoryError = await validateCategory(data.category);
      if (categoryError) return categoryError;
    }

    if (data.location) {
      const locationError = await validateLocation(data.location);
      if (locationError) return locationError;
    }

    if (data.description) {
      const descriptionError = await validateDescription(data.description);
      if (descriptionError) return descriptionError;
    }

    if (data.img) {
      const imgError = await validateImg(data.img);
      if (imgError) return imgError;
    }

    if (data.spots) {
      const spotsError = await validateSpots(data.spots);
      if (spotsError) return spotsError;
    }

    if (data.hashtags) {
      const hashtagsError = await validateHashtags(data.hashtags as string[]);
      if (hashtagsError) return hashtagsError;
    }
  }

  return null;
};