import crypto from 'crypto';

console.log('🧪 Starting Serverless Alipay Cashier & Licensing Gateway Automated Tests (¥600/Store)...');

// 1. Test BigInt RSA2 Sign & Verify
const testKey = `MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCNI9OoOH4G6YXNQteUBkq2drG4bX60hdf8ku2BrifN6cHBy6MRgA7tfnbleCk2mxsHSWqweafwjOVusRJwXN7CiWkoX7Glwxe+shb5Z/h/Zb+ZORO4gGHUOTTHsQ/8fDpWRfYT2pO0uOD2HGF/p473IK82JhxVyyZCaCpuobp1Ka8rK1VKe+JUKUxxX7K6T57p2Bkiwd/4ojZVZdleCujaPr+7Mj66qUJKD7rMSeP5+CRipd7IPFy6BH6CfoWXWGO9yIgZVGRsVB/0L69Sd0qR33pK6eDt0EKK6XLRpv2FX+YSJ6bZEHxU6i6rnK/JLhct5y6w4V9SKwvfM3U4beAvAgMBAAECggEAawXStkl4Dwe+pQHddGo89xUT+DRXEs43FFfZby8/EZ4ChVBD674+E4qE38X5AmYk3aanFwB4/yfnxcLRp5BUfhEyQyIlE/vWooxqbV6QiRH/clFcidgX1pQ2WIIEDEGq/sZ4LV/eBvj15MlqiSDmgLAxDA9kBw5PiaVxH4jVWYdM9+DJzFaNPW1wOvSnteGfDWAD0DTiyhfK3ep+U1Ei0xUwhzt2WFCeHeAFixcXtl7oJbamWoqRXuRvnpfAu7GoYsQ+UXxEqeafNKF9bwwSPE7sb3EMMCD9125XLcDLiWCrckq011jS5BhmhU2Hx7cqFPfAVinJDAxoZqVAWX7DSQKBgQDAW8NV8LeeWRWPc+m6XNGZ+yYuuQJhz4E1ZD7lbcmWSgyc3N34rs92bcp/qX/6NoKW4Jxm+FRp/j/7KNJ21xKSSmTkewD9iMEUt3YU5RYg4vDfeJ52kAml7vyqEyX0nnp8JqLogrDenIJCLTqdSGXH92MyzuP2gYm3xY7F6TRErQKBgQC71f8ErTPVBOsApumPPhPBi/EcxGDppn8BzxbOnLzniUG960O0I3W+P3Hm6Necnlms/YHh18hxST9Qs4q7O9+8tXvgSxdZ2uCXxux/vCcLAoIHj5yxAHEAGfwHe5zprFF4ji3ZPjW72fdKNw5kYjgnLOdjreNDzthvplNIMyt3ywKBgHfL7lAkdUaBtoK7rrFowwTBu9rXT9t4bsDAqMcb47LcdRRwHTGWNRBNehKdjl1W+2dZhS4/s9q7BD+4AbMPaLqA6Gq/DDPZql3rj/edYHWkwFx8czvlooyb1PFasYWx+Rg+u7BQTDSnhhwOrPVtNC4gLMBkxuYrcIhp2ev5u5qVAoGACQopdb4oKm5MKQHfZ6djKANmHS5OQ7BhmGKxBEyCwtnWMh+qaHb0aa1/+87k4YK1ah/hKk9KNDmENIwPdydQgzJwvcCfZRGlkWhfZV5Wuq7qNxbwQYx1471cZbfLO2uxmA2voy7dQycgQZAYvzgC38/HawKpV1ATFnx4sZbU1rUCgYBg8mmh2UuBwYPmysKCqIObpaCYQl2PhR3EM2GLHJq03eH5g4bWUmUu2HZYdjDA/8D7kfvDVSCmYdA23ZTo8QHxN7qEbQOGzW86s+ipZ+NxlSULkdLQZowZBRUTWpnLMgdaebHYvcTVTudokmy/DC9nzMSp844b9KBBcG3aAJrBWg==`;

const testPubKey = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAjSPTqDh+BumFzULXlAZKtnaxuG1+tIXX/JLtga4nzenBwcujEYAO7X525XgpNpsbB0lqsHmn8IzlbrEScFzewolpKF+xpcMXvrIW+Wf4f2W/mTkTuIBh1Dk0x7EP/Hw6VkX2E9qTtLjg9hxhf6eO9yCvNiYcVcsmQmgqbqG6dSmvKytVSnviVClMcV+yuk+e6dgZIsHf+KI2VWXZXgro2j6/uzI+uqlCSg+6zEnj+fgkYqXeyDxcugR+gn6Fl1hjvciIGVRkbFQf9C+vUndKkd96Sung7dBCiuly0ab9hV/mEiem2RB8VOouq5yvyS4XLecusOFfUisL3zN1OG3gLwIDAQAB`;

const SHA256_DIGEST_INFO_PREFIX = Buffer.from('3031300d060960864801650304020105000420', 'hex');
function modPow(b, exp, mod) {
  let res = 1n;
  b = b % mod;
  while (exp > 0n) {
    if (exp % 2n === 1n) res = (res * b) % mod;
    b = (b * b) % mod;
    exp /= 2n;
  }
  return res;
}

function parseRsaKeyBigInt(keyB64) {
  const cleanB64 = keyB64.replace(/-----BEGIN[A-Z\s]+-----/g, '').replace(/-----END[A-Z\s]+-----/g, '').replace(/[\r\n\s]+/g, '');
  const buf = Buffer.from(cleanB64, 'base64');
  let pos = 0;
  function readByte() { return buf[pos++]; }
  function readLength() {
    let b = readByte();
    if (b < 0x80) return b;
    let numBytes = b & 0x7f;
    let len = 0;
    for (let i = 0; i < numBytes; i++) len = (len << 8) | readByte();
    return len;
  }
  function readInteger() {
    let tag = readByte();
    let len = readLength();
    let intBuf = buf.subarray(pos, pos + len);
    pos += len;
    if (intBuf.length === 0) return 0n;
    return BigInt('0x' + intBuf.toString('hex'));
  }
  if (buf[0] === 0x30) {
    readByte(); readLength();
    let v = readInteger();
    if (v === 0n && buf[pos] === 0x30) {
      readByte(); let algLen = readLength(); pos += algLen;
      if (buf[pos] === 0x04) {
        readByte(); readLength();
        if (buf[pos] === 0x30) {
          readByte(); readLength();
          let rsaVer = readInteger();
          let n = readInteger(); let e = readInteger(); let d = readInteger();
          return { n, e, d };
        }
      }
    }
  }
  pos = 0;
  readByte(); readLength();
  let v = readInteger(); let n = readInteger(); let e = readInteger(); let d = readInteger();
  return { n, e, d };
}

function signPkcs1Sha256(prestr, privKeyB64) {
  const { n, d } = parseRsaKeyBigInt(privKeyB64);
  const hash = crypto.createHash('sha256').update(Buffer.from(prestr, 'utf8')).digest();
  const digestInfo = Buffer.concat([SHA256_DIGEST_INFO_PREFIX, hash]);
  const ps = Buffer.alloc(256 - 3 - digestInfo.length, 0xff);
  const em = Buffer.concat([Buffer.from([0x00, 0x01]), ps, Buffer.from([0x00]), digestInfo]);
  const sBn = modPow(BigInt('0x' + em.toString('hex')), d, n);
  let sHex = sBn.toString(16);
  while (sHex.length < 512) sHex = '0' + sHex;
  return Buffer.from(sHex, 'hex').toString('base64');
}

// Test with 600 RMB Single Store Order
const sampleMsg = 'app_id=2021007100687379&biz_content={"out_trade_no":"WB_ORD_TEST_600","subject":"Wildberries极速上架助手-单店商业授权(¥600/店)","total_amount":"600.00"}';
const sig = signPkcs1Sha256(sampleMsg, testKey);

const verifier = crypto.createVerify('RSA-SHA256');
verifier.update(Buffer.from(sampleMsg, 'utf8'));
const ok = verifier.verify({ key: Buffer.from(testPubKey, 'base64'), format: 'der', type: 'spki' }, Buffer.from(sig, 'base64'));

console.log('✅ BigInt RSA-SHA256 Sign & Verify (¥600 Single Store):', ok ? 'PASSED' : 'FAILED');
if (!ok) process.exit(1);
console.log('🎉 All Automated Gateway Tests Completed Successfully!');
