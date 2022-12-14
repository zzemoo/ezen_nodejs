/** (1) 모듈 및 환경설정 불러오기 */

const {join, resolve} = require('path');
const dotenv = require('dotenv');
const mysql = require('mysql2');

//설정 파일 내용 가져오기
dotenv.config({path: join(resolve(), ".env.server.development")});

//접속정보 설정
const connectionInfo = {
    host: process.env.DATABASE_HOST, // MYSQL 서버 주소 (다른 PC인경우 IP주소)
    port: process.env.DATABASE_PORT, // MYSQL 포트번호
    user: process.env.DATABASE_USERNAME, //MYSQL의 로그인 할 수 있는 계정 이름
    password: process.env.DATABASE_PASSWORD, //비밀번호
    database: process.env.DATABASE_SCHEMA //사용하고자 하는 데이터베이스 이름
}

console.info(connectionInfo);

/** (2) mysql 접속 객체 생성 */
const dbcon = mysql.createConnection(connectionInfo);

/** (3) 데이터베이스 접속 */
dbcon.connect((error) => {
    if(error) {
        console.error("데이터베이스 접속에 실패했습니다.");
        console.error(error);
        return;
    }

    /** (4) INSERT, UPDATE, DELETE 쿼리 생성하기 */
    //실행할 SQL 구문
    //NODE의 변수로 치환될 부분(주로 저장, 수정될 값)은 ?로 지정
    //문자열이더라도 홑따옴표 사용 안함
    const sql = "INSERT INTO department (dname, loc) VALUES (?, ?)";
    //SQL문의 '?'를 치환할 배열 --> ? 순서대로 값을 지정한다.
    const input_data = ['Node학과', '공학관'];

    /**(5) SQL 실행하기 */
    dbcon.query(sql, input_data, (error, result) => {
        //이 에러가 감지되는 경우는 SQL문이 잘못 구성되어 MYSQL에서 에러가 발생한 경우.
        if(error) {
            console.error("SQL문 실행에 실패했습니다.");
            console.error(error);
            dbcon.end(); //데이터베이스 접속 해제(중요)
            return;
        }

        //저장결과 확인
        console.log('반영된 데이터의 수:' + result.affectedRows);
        //UPDATE, DELETE 쿼리의 경우 사용할 수 없는 값임
        console.log('생성된 PK값:' + result.insertId);
        //데이터베이스 접속해제
        dbcon.end();
    })
})