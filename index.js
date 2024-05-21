const axios = require('axios');

let token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJoYXNfZ3Vlc3QiOmZhbHNlLCJ0eXBlIjoiQUNDRVNTIiwiaXNzIjoiYmx1bSIsInN1YiI6IjZhYWExM2YzLWUyNzEtNDQ0NC04ZWZkLTFmOGQzYjU4YWFjNCIsImV4cCI6MTcxNjIxMTM5NSwiaWF0IjoxNzE2MjA3Nzk1fQ.Qh3aYMni_FjWwGevmqLlcKBBwzKLt8Djq8xTn9faJDU';
let refToken = '';
async function getClaim() {
  try {
    const response = await axios.post(
      'https://game-domain.blum.codes/api/v1/farming/claim',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(token);
    console.log('sukses klaim');
    // console.log(response.data.availableBalance);
    startFarm();
  } catch (error) {
    console.log(error.response.data.message);
    console.log('belum waktunya klaim...');
    console.log(token);
    startFarm();
  }
}

async function startFarm() {
  try {
    const response = await axios.post(
      'https://game-domain.blum.codes/api/v1/farming/start',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data);
    setTimeout(getBalance, 10000);
  } catch (error) {
    console.log('error 2: ', error.response.data);
  }
}

async function getBalance() {
  try {
    const response = await axios.get(
      'https://game-domain.blum.codes/api/v1/user/balance',
      {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
          Authorization: `Bearer ${token}`,
          Origin: 'https://telegram.blum.codes',
          Priority: 'u=1, i',
          Referer: 'https://telegram.blum.codes/',
          'Sec-Ch-Ua':
            '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
          'Sec-Ch-Ua-Mobile': '?0',
          'Sec-Ch-Ua-Platform': '"Windows"',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-site',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        },
      }
    );
    console.log('balance : ', response.data.availableBalance);
    const endTimeUnix = response.data.farming.endTime;
    const endTimeDate = new Date(endTimeUnix);
    const now = new Date();

    const timeDifference = endTimeDate.getTime() - now.getTime();
    let timeDifferenceInMinutes = Math.ceil(timeDifference / (1000 * 60));
    const timerInterval = setInterval(() => {
      if (timeDifferenceInMinutes <= 0) {
        clearInterval(timerInterval);
        console.log('Waktu klaim telah tiba!');
        return;
      }

      console.log(`Sisa waktu klaim: ${timeDifferenceInMinutes} menit`);
      timeDifferenceInMinutes--;
    }, 60 * 60 * 1000);

    setTimeout(getClaim, timeDifference);
    console.log('Klaim selanjutnya :', timeDifferenceInMinutes, 'menit lagi');

    //ubah disini untuk waktu pengambilan refresh token
    const satuJamDalamMilidetik = 30 * 60 * 1000;
    // const satuJamDalamMilidetik = 5000;

    setTimeout(refreshToken, satuJamDalamMilidetik);
    console.log('Refresh token akan dipanggil setelah 30 menit');
    console.log(token);
    let countdownTime = satuJamDalamMilidetik;
    const refreshCountdownInterval = setInterval(() => {
      if (countdownTime <= 0) {
        clearInterval(refreshCountdownInterval);
        console.log('Refresh token telah dipanggil!');
        return;
      }

      const remainingMinutes = Math.floor(countdownTime / 60000); // 60000 milidetik = 1 menit
      if (countdownTime % 60000 === 0) {
        console.log(`Sisa waktu refresh token: ${remainingMinutes} menit`);
      }

      countdownTime -= 1000;
    }, 30 * 60 * 1000);
  } catch (error) {
    console.log('test token', token);
    console.log('error 3: ', error);
  }
}

async function refreshToken() {
  try {
    const response = await axios.post(
      'https://gateway.blum.codes/v1/auth/refresh',
      {
        refresh: token,
      }
    );
    token = response.data.access;
    refToken = response.data.refresh;
    console.log(response.data);
    getClaim();
  } catch (error) {
    console.log('error 4: ', error.response.data);
  }
}

getClaim();
