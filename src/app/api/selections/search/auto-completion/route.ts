import { QUERY_STRING_NAME } from '@/constants/queryString';
import { dbConnectionPool } from '@/libs/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest): Promise<NextResponse<any>> {
    const url = req.nextUrl;
    const query = url.searchParams;
    const tagValue = query.get(QUERY_STRING_NAME.tagValue);

    // Todo : 초성도 자동완성이 가능하도록, Trie 알고리즘? 공부해보기
    if (!tagValue) {
        return NextResponse.json({ data: [] });
    }

    try {
        const searchQuery = dbConnectionPool('hashtag')
            .distinct('htag_name')
            .select('htag_name')
            .where('htag_name', 'like', `${tagValue}%`)
            .limit(7);

        const searchResult = await searchQuery;
        return NextResponse.json({ data: searchResult || [] });
    } catch (error) {
        console.error('Database query error:', error);
        return NextResponse.json({ data: [], error: 'Error fetching data' });
    }
}
