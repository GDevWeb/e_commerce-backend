import { saveRefreshToken } from "../service/auth.service";

async function testSaveRefreshToken() {
  const test1 = await saveRefreshToken(
    1,
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY3ODkwNTYwMCwiZXhwIjoxNjc4OTE2NDAwfQ.signature"
  );
  console.log(test1);
}
testSaveRefreshToken();
