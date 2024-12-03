import * as jwt from 'jsonwebtoken';
import { describe, expect, it } from 'vitest';

const privateKey =
    '-----BEGIN RSA PRIVATE KEY-----\n' +
    'MIIEogIBAAKCAQEArrG/WpvcDJ69OEJR2KcwQqg06tQCDtJUOLx3mnhz/Sjrw8fi\n' +
    'WI15S8D6ps+Iv2ebKkoWEyOGbFA4C+DI6+GAdVivPmkcDQo60qKlUgAn2RYzjzAn\n' +
    'b59eWPJRkuwfoCpK9ocMuPwab1oR0xtKQVxTwTtFwLFbmZEe5RZZpnvedI0vHTLh\n' +
    '5zpcDiiYlZKsIq+I3yQqw7+ZxiGnAOPa3HfwdLptu5BtXlG5FQzL6eJ2pAap5d6y\n' +
    'VNZ/hs/+LJJC3Vi2TXcKzsStn6yFRTrjZjEb8oASda9RavrQJavCgoijsugygvkP\n' +
    'DU3XdqmAL7pWI872yjEwoZFMu88+4pBIR0ABPwIDAQABAoIBAAU8NmvUt+d46lrB\n' +
    'QgqoF/4nZE6VQ+qFyxhYLY1nhrJTg50+ZD4bH0Nx6REOrx5tUG0YA0lXizO7w7I3\n' +
    'bk4DWAIsQjQwmjKZ1+FwFlw6vPb4f1sPKl9h+0XXHTK1+Myn988jhPIWPASSQm59\n' +
    'JuCGj8v+prx7lC8p9i8PWGhw1d3QQKI6SwWJkxoc1+2jrH3TTWi3MXQwmVL49kln\n' +
    'JafHOFs5p1rmsGrL/NJq3ONomXE4uzszyx3rWnIltSz/WVQxWhr88CNqhPvU+hQs\n' +
    '3YuqHdsIpY2sCRtpAlgUNgeZjbvUTOyPDs1J7Cl5P2TOm48su/Av9e1u35R8mJr5\n' +
    'qlknpWECgYEA4Oc8Q6x2jj+56SMwRKVVHxPTZxa1nZtZgwVBP91M3BEiRvfAbPy5\n' +
    '41DHihk+5uqiNEPaGmJyMxYlyR4+C62qxTvGNxeHVMXjScr6pTVLkKZFkWJabzhg\n' +
    'yuCfNEBFy0rjpW+jvijVXHvMb4bG5OIhrEn4qb0GMjn/inY0igrkXNMCgYEAxtlL\n' +
    '9l2es8cj3HvSOWmRQiqmgpVPIcM/5RvGLrBTNXBd8P1rdoq60Ug41ZedMaM1/0mC\n' +
    'd2XROG6PLvfXTSTm/pSu2vgQ+ixuQyXsmNfIq3lDSoybbgBF2VThAYJyHhd1l+mf\n' +
    '9RVi6h0XWN1ZlgrkrGavpf6CG6IdP7BdIn7V1mUCgYAA8LaNyeDNA3MxiFYhU1eh\n' +
    'w6F0ouGrgQTEyXbWX4R8vw2Xol2Jlxzn2GSdLTHYIU8ATPBSf+reT89kod28isNW\n' +
    'A8P2YwDL1+/1VQXrPufL+QX9b53VLTUqY/oGa+ZezTdab7cNinop4tKd/MBEILXn\n' +
    'VH/XpdSqzRdGauwZT6ZYxQKBgCuFk+KwSvP+OhMf5rs6J9jbjOY318IEAhAbLB07\n' +
    '6npfxa/hR4wCgTEdJZNaQ8WBe2gMpsmLN2eqixw0kqMH2KcP09WJRe37m4aG3mn1\n' +
    'kK43NEs0yzAgTylqMnUqH+AGMm61a5UwwR2MkHeauujkKXiyYO9r7P4vVUeDSl8q\n' +
    'c5MhAoGASu6+Pn43FMBiIz9HAKnZykMLdkKluUnwjbwHz9XUDS4mAr1BzGDgMeQ3\n' +
    'Q+ByY0214nWaG9KjyW9K/TscvAhKShXQaqdvo5k72WYjatT557xgrE/m9fNvvtEz\n' +
    '12p69rfgK2JApBKGgnDl53PZZlQ4QJyZ/mSbhUEzwM64oE7a5KQ=\n' +
    '-----END RSA PRIVATE KEY-----';

export const createAndSign = (payload: any): string => {
    return jwt.sign(payload, privateKey, {
        algorithm: 'RS256',
        keyid: 'dummyKey'
    });
};

describe('Jwt Test Suite', () => {
    it('encrypt and decrypt signed token', async () => {
        const signedToken = createAndSign('some token');
        expect(signedToken).toEqual(
            'eyJhbGciOiJSUzI1NiIsImtpZCI6ImR1bW15S2V5In0.c29tZSB0b2tlbg.mLWWaCne94eD3Fz8IGDdeyj5AYxt94EO83EFlWWEDD4gh0YWroHFeF5C0mqmEomMeZbR5ITjMn1j2bb17TvnyXcQYlfA5NstQHFcLivwY4SG5DtF_OUsGpu5hpZeAhQd1JDTyvZ6nrhA2MAYdRB92ythlM5MFDMqGEP8X05hzQjUDGn4YssBQGMT2-nI5BXfZKtd7NY5OwUys2zgPP6lHC6bV7nQS4_OpIlSOO0HWbS41D7D-vCiktT7yMT3DaSXxuS9lhiuB0Io_XLGFH15xHuBdhNOLTjJl6tBRP8OYyoMEEy3zCwJcDXFlruqERsp7lRlUFV88_xXq24i8I6Png'
        );
    });
});
