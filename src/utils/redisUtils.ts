import { getData, incrementData, setData } from "@/libs/redis";
import { BadRequestError } from "./errors";


export async function limitAPIUsageWithDuration(
  key: string, 
  duration: number,
  errorMsg: string
) : Promise<void> {
  const data = await getData(key);
  if (!data) {
    await setData(
      key, 
      '1', 
      { expire: duration }
    );
    return;
  }

  throw new BadRequestError(errorMsg || 'API 사용량이 초과되었습니다. 잠시 후 다시 시도해주세요.');
}

export async function limitAPIUsageWithCount(
  key: string, 
  duration: number,
  count: number,
  errorMsg: string
) : Promise<void> {
  try {
    const data = await getData(key);
    if (!data) {
      await setData(
        key, 
        1,
        { expire: duration }
      );
      return;
    }

    if (Number(data) >= count) {
      throw new BadRequestError(errorMsg || 'API 사용량이 초과되었습니다. 잠시 후 다시 시도해주세요.');
    }

    await incrementData(key);
  } catch (error) {
    throw error;
  }
}