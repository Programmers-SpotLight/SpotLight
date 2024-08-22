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

// UUID를 문자열로 변환
export function uuidToString(uuidBuffer: Buffer): string {
  const uuidHex = uuidBuffer.toString('hex');
  return [
    uuidHex.slice(0, 8),
    uuidHex.slice(8, 12),
    uuidHex.slice(12, 16),
    uuidHex.slice(16, 20),
    uuidHex.slice(20)
  ].join('-');
}