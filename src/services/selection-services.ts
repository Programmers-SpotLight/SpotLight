'use server';

import { dbConnectionPool } from "@/libs/db";
import { ISelectionCategory, ISelectionCreateFormData, ISelectionLocation, ISelectionSpot } from "@/models/selection.model";
import { Knex } from "knex";


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

export async function getSelectionCategories (dbConnectionPool: Knex<any, unknown[]>) {
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

export async function getSelectionLocations(dbConnectionPool: Knex<any, unknown[]>) {
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

export async function validateName(name: string) {
  console.log('Name:', name);
  if (!name) {
    return "Name is required";
  }
  if (name.length > 128) {
    return "Name should be less than 128 characters";
  }
  console.log('Name validated successfully');
  return null;
};

export async function validateCategory(category: number | undefined) {
  if (category == null) {
    return "Category is required";
  }
  if (isNaN(category)) {
    return "Invalid category. It should be a value of integer";
  }
  const queryResult = await dbConnectionPool('selection_category')
    .where('slt_category_id', category);
  
  console.log('Query result:', queryResult);
  if (queryResult.length === 0) {
    return "Invalid category. Category does not exist";
  }
  return null;
};

export async function validateLocation(
  location: { location: number; subLocation: number } | undefined
) {
  if (!location) {
    return "Location is required";
  }
  if (typeof location !== "object") {
    return "Invalid location. Location should be an object with location and subLocation properties";
  }
  if (isNaN(location.location) || isNaN(location.subLocation)) {
    return "Invalid location. Location should be an object with location and subLocation properties";
  }

  const queryResult = await dbConnectionPool('selection_location')
    .where('slt_location_id', location.location);
  if (queryResult.length === 0) {
    return "Invalid location. Location does not exist";
  }

  const queryResult2 = await dbConnectionPool('selection_location_option')
    .where('slt_location_option_id', location.subLocation)
    .andWhere('slt_location_id', location.location);
  if (queryResult2.length === 0) {
    return "Invalid location. Sub-location does not exist";
  }
  return null;
};

export async function validateDescription(description: string | undefined) {
  if (!description) {
    return "Description is required";
  }
  return null;
};

export async function validateSpots(spots: ISelectionSpot[] | undefined) {
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
    if (!spots[i].name) {
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
    }
  }
  return null;
};

export async function validateHashtags(hashtags: string[] | undefined) {
  if (!hashtags) {
    return "Hashtags are required";
  }
  if (!Array.isArray(hashtags)) {
    return "Invalid hashtags. Hashtags should be an array";
  }
  if (hashtags.length === 0) {
    return "At least one hashtag is required";
  }
  for (let i = 0; i < hashtags.length; i++) {
    if (typeof hashtags[i] !== "string") {
      return `Invalid hashtag ${i + 1}`;
    }
  }
  return null;
};

export async function validateData(data: ISelectionCreateFormData) {
  const nameError = await validateName(data.name);
  if (nameError) {
    return nameError;
  }

  if (!data.temp) {
    const categoryError = await validateCategory(data.category);
    if (categoryError) return categoryError;

    const locationError = await validateLocation(data.location);
    if (locationError) return locationError;

    const descriptionError = await validateDescription(data.description);
    if (descriptionError) return descriptionError;

    const spotsError = await validateSpots(data.spots);
    if (spotsError) return spotsError;

    const hashtagsError = await validateHashtags(data.hashtags);
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

    if (data.spots) {
      const spotsError = await validateSpots(data.spots);
      if (spotsError) return spotsError;
    }

    if (data.hashtags) {
      const hashtagsError = await validateHashtags(data.hashtags);
      if (hashtagsError) return hashtagsError;
    }
  }

  return null;
};