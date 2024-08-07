'use server';

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

export const getSelectionCategories = async (dbConnectionPool: Knex<any, unknown[]>) => {
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

export const getSelectionLocations = async (dbConnectionPool: Knex<any, unknown[]>) => {
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

const validateName = (name: string): string | null => {
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

const validateCategory = (category: number | undefined): string | null => {
  if (category == null) {
    return "Category is required";
  }
  if (isNaN(category)) {
    return "Invalid category. It should be a value of integer";
  }
  return null;
};

const validateLocation = (
  location: { location: number; subLocation: number } | undefined
): string | null => {
  if (!location) {
    return "Location is required";
  }
  if (typeof location !== "object") {
    return "Invalid location. Location should be an object with location and subLocation properties";
  }
  if (isNaN(location.location) || isNaN(location.subLocation)) {
    return "Invalid location. Location should be an object with location and subLocation properties";
  }
  return null;
};

const validateDescription = (description: string | undefined): string | null => {
  if (!description) {
    return "Description is required";
  }
  return null;
};

const validateSpots = (spots: ISelectionSpot[] | undefined): string | null => {
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

const validateHashtags = (hashtags: string[] | undefined): string | null => {
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

export const validateData = (data: ISelectionCreateFormData) => {
  const nameError = validateName(data.name);
  if (nameError) {
    console.log('Name error:', typeof nameError);
    return nameError;
  }

  if (!data.temp) {
    const categoryError = validateCategory(data.category);
    console.log('Category error:', categoryError);
    if (categoryError) return categoryError;

    const locationError = validateLocation(data.location);
    console.log('Location error:', locationError);
    if (locationError) return locationError;

    const descriptionError = validateDescription(data.description);
    console.log('Description error:', descriptionError);
    if (descriptionError) return descriptionError;

    const spotsError = validateSpots(data.spots);
    console.log('Spots error:', spotsError);
    if (spotsError) return spotsError;

    const hashtagsError = validateHashtags(data.hashtags);
    console.log('Hashtags error:', hashtagsError);
    if (hashtagsError) return hashtagsError;
  } else {
    if (data.category) {
      const categoryError = validateCategory(data.category);
      console.log('Temp category error:', categoryError);
      if (categoryError) return categoryError;
    }

    if (data.location) {
      const locationError = validateLocation(data.location);
      console.log('Temp location error:', locationError);
      if (locationError) return locationError;
    }

    if (data.description) {
      const descriptionError = validateDescription(data.description);
      console.log('Temp description error:', descriptionError);
      if (descriptionError) return descriptionError;
    }

    if (data.spots) {
      const spotsError = validateSpots(data.spots);
      console.log('Temp spots error:', spotsError);
      if (spotsError) return spotsError;
    }

    if (data.hashtags) {
      const hashtagsError = validateHashtags(data.hashtags);
      console.log('Temp hashtags error:', hashtagsError);
      if (hashtagsError) return hashtagsError;
    }
  }

  console.log('Data validated successfully');
  return null;
};