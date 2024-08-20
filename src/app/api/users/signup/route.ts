import { dbConnectionPool } from '@/libs/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { user_uid, user_type, user_nickname } = await req.json();

  // 필수 값 검증
  if (!user_uid) {
    return NextResponse.json(
      { error: "Missing user_uid" },
      { status: 400 }
    );
  }
  if (!user_type) {
    return NextResponse.json(
      { error: "Missing user_type" },
      { status: 400 }
    );
  }
  if (!user_nickname) {
    return NextResponse.json(
      { error: "Missing user_nickname" },
      { status: 400 }
    );
  }

  try {
    // 유저 중복 체크
    const isUserExist = await dbConnectionPool('user').select('user_nickname').where('user_nickname', user_nickname);
    if(isUserExist.length > 0) {
      return NextResponse.json(
        { message: "The same nickname already exists", status: 500, code: 'Nickname-duplicate'},
        { status: 500 }
      );
      // throw new Error('The same nickname already exists')
    }
    // 사용자 정보를 DB에 저장
    await dbConnectionPool('user').insert({
      'user.user_uid' : user_uid,
      'user.user_type': user_type,
      'user.user_nickname' : user_nickname,
    });
    
    const insertedUser = await dbConnectionPool('user')
    .select('*')
    .where({ user_uid: user_uid, user_type: user_type });
    
    if (insertedUser.length > 0) {
      // 성공적으로 저장된 경우
      return NextResponse.json(
        { message: "User registered successfully", status: 201},
        { status: 201 }
      );
    } else {
      console.error('데이터가 삽입되지 않았습니다.');
      throw new Error('Fail to insert user');
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to register user",
        details: error
      },
      { status: 500}
    );
  }
}