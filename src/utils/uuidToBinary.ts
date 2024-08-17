import { v4 as uuidv4 } from 'uuid';

// UUID를 바이너리 형식으로 변환
export function uuidToBinary(uuid?: string): Buffer {
  if (!uuid) {
    uuid = uuidv4();
  } else {
    if (typeof uuid !== 'string' || !uuid.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)) {
      throw new Error('Invalid UUID format');
    }
  }
  
  return Buffer.from(uuid.replace(/-/g, ''), 'hex');
}